import { searchTermsLocally, type EngineeringTerm } from '../../data/sample-terms';

import { Client } from '@elastic/elasticsearch';

interface SearchResult {
    terms: EngineeringTerm[];
    total: number;
    source: 'elasticsearch' | 'local';
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

/**
 * Generate a URL-friendly slug from a term name
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
 * Search engineering terms using Elasticsearch (or fallback to local search)
 */
export async function searchTerms(query: string): Promise<SearchResult> {
    // Check if Elasticsearch is configured
    const isElasticsearchConfigured = !!(
        process.env.ELASTICSEARCH_URL &&
        process.env.ELASTICSEARCH_API_KEY
    );

    if (!isElasticsearchConfigured) {
        // Fallback to local search if elasticsearch is not configured
        const terms = searchTermsLocally(query);
        return {
            terms,
            total: terms.length,
            source: 'local',
        };
    }

    try {
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

        return {
            terms,
            total: typeof response.hits.total === 'number'
                ? response.hits.total
                : response.hits.total?.value || 0,
            source: 'elasticsearch',
        };

    } catch (error) {
        console.error('Elasticsearch search failed, using local fallback:', error);

        // Graceful fallback to local search
        const terms = searchTermsLocally(query);
        return {
            terms,
            total: terms.length,
            source: 'local',
        };
    }
}

/**
 * Get a single term by slug from Elasticsearch (or fallback)
 * // this function is triggering when we have to search for the single term 
 * when i got tons of suggestion and when i click on any one of the search this would trigger
 */
export async function getTermBySlug(slug: string): Promise<EngineeringTerm | null> {

    // check if elasticsearch is configured
    const isElasticsearchConfigured = !!(
        process.env.ELASTICSEARCH_URL &&
        process.env.ELASTICSEARCH_API_KEY
    );

    // if elasticsearch is not configured, use local fallback means get the searches from local file
    if (!isElasticsearchConfigured) {
        const { getTermBySlug: localGetTerm } = await import('../../data/sample-terms');
        return localGetTerm(slug) || null;
    }

    try {
        // Convert slug to potential term name (e.g., "query-latency" -> "query latency")
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
            return normalizeTermFromES(hit._source, hit._id || 'unknown');
        }

        // If not found in Elasticsearch, try local fallback
        const { getTermBySlug: localGetTerm } = await import('../../data/sample-terms');
        return localGetTerm(slug) || null;
    } catch (error) {
        console.error('Elasticsearch get failed, using local fallback:', error);
        const { getTermBySlug: localGetTerm } = await import('../../data/sample-terms');
        return localGetTerm(slug) || null;
    }
}

/**
 * Get related terms by matching tags from Elasticsearch
 * Finds terms that share at least one tag with the given term
 */
export async function getRelatedTerms(
    term: EngineeringTerm,
    limit: number = 3
): Promise<EngineeringTerm[]> {
    const isElasticsearchConfigured = !!(
        process.env.ELASTICSEARCH_URL &&
        process.env.ELASTICSEARCH_API_KEY
    );

    if (!isElasticsearchConfigured) {
        // Fallback to local related terms
        const { getRelatedTerms: localGetRelated } = await import('../../data/sample-terms');
        return localGetRelated(term, limit);
    }

    try {
        // Search for terms that share tags with the current term
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
        return hits.map((hit: any) => normalizeTermFromES(hit._source, hit._id));
    } catch (error) {
        console.error('Elasticsearch related terms failed, using local fallback:', error);
        const { getRelatedTerms: localGetRelated } = await import('../../data/sample-terms');
        return localGetRelated(term, limit);
    }
}
