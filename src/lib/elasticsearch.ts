import { searchTermsLocally, type EngineeringTerm } from '../../data/sample-terms';

import { Client } from '@elastic/elasticsearch';
import { getFromCache, setInCache, CACHE_KEYS, DEFAULT_TTL } from './redis';

interface SearchResult {
    terms: EngineeringTerm[];
    total: number;
    source: 'elasticsearch' | 'local' | 'cache';
}

// configure elasticsearch client
const client = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
        apiKey: process.env.ELASTICSEARCH_API_KEY || '',
    },
});

// configure index name
const INDEX_NAME = process.env.ELASTICSEARCH_INDEX || 'engineering-terms';

// Cache TTL values (in seconds)
const SEARCH_CACHE_TTL = DEFAULT_TTL; // 1 Day for search results
const TERM_CACHE_TTL = 60 * 60 * 24; // 1 Day for individual terms
const RELATED_CACHE_TTL = 60 * 60 * 24; // 1 Day for related terms

/**
 * Check if Redis caching should be used based on environment
 * In production, we skip Redis and use Elasticsearch directly with local fallback
 */
function shouldUseCache(): boolean {
    return process.env.ENVIRONMENT !== 'production';
}

/**
 * Generate a cache key for search queries
 */
function getSearchCacheKey(query: string): string {
    return `${CACHE_KEYS.SEARCH}${query.toLowerCase().trim()}`;
}

/**
 * Generate a cache key for term lookups
 */
function getTermCacheKey(slug: string): string {
    return `${CACHE_KEYS.TERM}${slug}`;
}

/**
 * Generate a cache key for related terms
 */
function getRelatedCacheKey(termSlug: string): string {
    return `${CACHE_KEYS.RELATED}${termSlug}`;
}

/**
 * Generate a URL-friendly slug from a term name
 * like "System Design" -> "system-design"
 */
function generateSlug(term: string): string {
    return term
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Normalize Elasticsearch document to ensure all required fields exist
 */
function normalizeTermFromES(source: any, docId: string): EngineeringTerm {
    return {
        id: source.id || docId,
        term: source.term || source.name || 'Unknown Term',
        slug: source.slug || generateSlug(source.term || source.name || docId),
        definition: source.definition || source.description || '',
        category: source.category || 'System Design',
        tags: Array.isArray(source.tags) ? source.tags : [],
    };
}

/**
 * Search engineering terms using Redis cache + Elasticsearch (read-through cache pattern)
 * 1. Check Redis cache first (skipped in production)
 * 2. If cache miss, query Elasticsearch
 * 3. Store result in Redis for future requests (skipped in production)
 */
export async function searchTerms(query: string): Promise<SearchResult> {
    const cacheKey = getSearchCacheKey(query);

    // Step 1: Check Redis cache first (Read-Through Cache) - skip in production
    if (shouldUseCache()) {
        const cachedResult = await getFromCache<SearchResult>(cacheKey);
        if (cachedResult) {
            console.log(`Cache HIT for search: "${query}"`);
            return {
                ...cachedResult,
                source: 'cache', // Mark as served from cache
            };
        }
        console.log(`Cache MISS for search: "${query}"`);
    } else {
        console.log(`Production mode: Skipping cache for search: "${query}"`);
    }

    // Check if Elasticsearch is configured
    const isElasticsearchConfigured = !!(
        process.env.ELASTICSEARCH_URL &&
        process.env.ELASTICSEARCH_API_KEY
    );

    if (!isElasticsearchConfigured) {
        // Fallback to local search if elasticsearch is not configured
        const terms = searchTermsLocally(query);
        const result: SearchResult = {
            terms,
            total: terms.length,
            source: 'local',
        };
        // Cache the local result too (only in non-production)
        if (shouldUseCache()) {
            await setInCache(cacheKey, result, SEARCH_CACHE_TTL);
        }
        return result;
    }

    try {
        // Step 2: Query Elasticsearch on cache miss
        const response = await client.search({
            index: INDEX_NAME,
            query: {
                bool: {
                    should: [
                        {
                            match_phrase_prefix: {
                                term: {
                                    query: query,
                                    boost: 3,
                                },
                            },
                        },
                        {
                            match: {
                                term: {
                                    query: query,
                                    fuzziness: 'AUTO',
                                    boost: 2,
                                },
                            },
                        },
                        {
                            match: {
                                definition: {
                                    query: query,
                                    fuzziness: 'AUTO',
                                },
                            },
                        },
                        {
                            match: {
                                tags: query,
                            },
                        },
                    ],
                    minimum_should_match: 1,
                },
            },
            size: 20,
        });

        const hits = response.hits.hits;
        const terms = hits.map((hit: any) => normalizeTermFromES(hit._source, hit._id));

        const result: SearchResult = {
            terms,
            total: typeof response.hits.total === 'number'
                ? response.hits.total
                : response.hits.total?.value || 0,
            source: 'elasticsearch',
        };

        // Step 3: Store in Redis cache for future requests (only in non-production)
        if (shouldUseCache()) {
            await setInCache(cacheKey, result, SEARCH_CACHE_TTL);
            console.log(`Cached search result for: "${query}"`);
        }

        return result;

    } catch (error) {
        console.error('Elasticsearch search failed, using local fallback:', error);

        // Graceful fallback to local search
        const terms = searchTermsLocally(query);
        const result: SearchResult = {
            terms,
            total: terms.length,
            source: 'local',
        };
        // Cache the fallback result with shorter TTL (only in non-production)
        if (shouldUseCache()) {
            await setInCache(cacheKey, result, 60); // 1 minute for fallback
        }
        return result;
    }
}

/**
 * Get a single term by slug from Redis cache + Elasticsearch (read-through cache pattern)
 * This function triggers when clicking on a search suggestion
 */
export async function getTermBySlug(slug: string): Promise<EngineeringTerm | null> {
    const cacheKey = getTermCacheKey(slug);

    // Step 1: Check Redis cache first - skip in production
    if (shouldUseCache()) {
        const cachedTerm = await getFromCache<EngineeringTerm>(cacheKey);
        if (cachedTerm) {
            console.log(`Cache HIT for term: "${slug}"`);
            return cachedTerm;
        }
        console.log(`Cache MISS for term: "${slug}"`);
    } else {
        console.log(`Production mode: Skipping cache for term: "${slug}"`);
    }

    // check if elasticsearch is configured
    const isElasticsearchConfigured = !!(
        process.env.ELASTICSEARCH_URL &&
        process.env.ELASTICSEARCH_API_KEY
    );

    // if elasticsearch is not configured, use local fallback means get the searches from local file
    if (!isElasticsearchConfigured) {
        const { getTermBySlug: localGetTerm } = await import('../../data/sample-terms');
        const term = localGetTerm(slug) || null;

        // cache the local term (only in non-production)
        if (term && shouldUseCache()) {
            await setInCache(cacheKey, term, TERM_CACHE_TTL);
        }
        return term;
    }

    try {
        // Step 2: Convert slug to potential term name (e.g., "query-latency" -> "query latency")
        const termNameFromSlug = slug.replace(/-/g, ' ');

        const response = await client.search({
            index: INDEX_NAME,
            query: {
                bool: {
                    should: [
                        // Try exact slug match (if your index has a slug field)
                        { term: { slug: slug } },
                        { term: { 'slug.keyword': slug } },
                        // Try matching by term name (derived from slug)
                        { match_phrase: { term: termNameFromSlug } },
                        // Try ID match
                        { term: { id: slug } },
                        { term: { _id: slug } },
                    ],
                    minimum_should_match: 1,
                }
            },
            size: 1,
        });

        const hit = response.hits.hits[0];
        if (hit) {
            const term = normalizeTermFromES(hit._source, hit._id || 'unknown');
            // Step 3: Cache the result (only in non-production)
            if (shouldUseCache()) {
                await setInCache(cacheKey, term, TERM_CACHE_TTL);
                console.log(`Cached term: "${slug}"`);
            }
            return term;
        }

        // If not found in Elasticsearch, try local fallback
        const { getTermBySlug: localGetTerm } = await import('../../data/sample-terms');
        const localTerm = localGetTerm(slug) || null;

        // cache the local term (only in non-production)
        if (localTerm && shouldUseCache()) {
            await setInCache(cacheKey, localTerm, TERM_CACHE_TTL);
        }
        return localTerm;
    } catch (error) {
        console.error('Elasticsearch get failed, using local fallback:', error);
        const { getTermBySlug: localGetTerm } = await import('../../data/sample-terms');
        return localGetTerm(slug) || null;
    }
}

/**
 * Get related terms by matching tags from Redis cache + Elasticsearch (read-through cache pattern)
 * Finds terms that share at least one tag with the given term
 */
export async function getRelatedTerms(
    term: EngineeringTerm,
    limit: number = 3
): Promise<EngineeringTerm[]> {
    const cacheKey = getRelatedCacheKey(term.slug);

    // Step 1: Check Redis cache first - skip in production
    if (shouldUseCache()) {
        const cachedRelated = await getFromCache<EngineeringTerm[]>(cacheKey);
        if (cachedRelated) {
            console.log(`Cache HIT for related terms: "${term.slug}"`);
            return cachedRelated;
        }
        console.log(`Cache MISS for related terms: "${term.slug}"`);
    } else {
        console.log(`Production mode: Skipping cache for related terms: "${term.slug}"`);
    }

    const isElasticsearchConfigured = !!(
        process.env.ELASTICSEARCH_URL &&
        process.env.ELASTICSEARCH_API_KEY
    );

    if (!isElasticsearchConfigured) {
        // Fallback to local related terms
        const { getRelatedTerms: localGetRelated } = await import('../../data/sample-terms');
        const related = await localGetRelated(term, limit);

        // cache the local related terms (only in non-production)
        if (shouldUseCache()) {
            await setInCache(cacheKey, related, RELATED_CACHE_TTL);
        }
        return related;
    }

    try {
        // Step 2: Search for terms that share tags with the current term
        const response = await client.search({
            index: INDEX_NAME,
            query: {
                bool: {
                    // Match any of the term's tags
                    should: term.tags.map(tag => ({
                        term: { tags: tag }
                    })),
                    // Exclude the current term
                    must_not: [
                        { match_phrase: { term: term.term } }
                    ],
                    minimum_should_match: 1,
                }
            },
            size: limit,
        });

        const hits = response.hits.hits;
        const related = hits.map((hit: any) => normalizeTermFromES(hit._source, hit._id));

        // Step 3: Cache the result (only in non-production)
        if (shouldUseCache()) {
            await setInCache(cacheKey, related, RELATED_CACHE_TTL);
            console.log(`Cached related terms for: "${term.slug}"`);
        }

        return related;
    } catch (error) {
        console.error('Elasticsearch related terms failed, using local fallback:', error);
        const { getRelatedTerms: localGetRelated } = await import('../../data/sample-terms');
        return localGetRelated(term, limit);
    }
}

