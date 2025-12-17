import Redis from 'ioredis';
import { redisClient } from './rate-limiter';
// Configure Redis client
// Default to localhost:6300 as per user's setup

// import { Redis } from '@upstash/redis'


// For local development use docker based redis container
// const redisClient = new Redis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6300', 10),
//     maxRetriesPerRequest: 3,
//     retryStrategy(times) {
//         const delay = Math.min(times * 50, 2000);
//         return delay;
//     },
//     lazyConnect: true, // Don't connect until first command
// });


// Handle connection events
redisClient.on('connect', () => {
    console.log('Redis: Connected successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});

// Cache key prefixes
export const CACHE_KEYS = {
    SEARCH: 'search:',
    TERM: 'term:',
    RELATED: 'related:',
} as const;

// Default TTL in seconds (1 day)
export const DEFAULT_TTL = 60 * 60 * 24;

/**
 * Get cached data from Redis
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
    try {
        const cached = await redisClient.get(key);
        if (cached) {
            return JSON.parse(cached) as T;
        }
        return null;
    } catch (error) {
        console.error('Redis GET error:', error);
        return null;
    }
}

/**
 * Set data in Redis cache with TTL
 */
export async function setInCache<T>(
    key: string,
    data: T,
    ttlSeconds: number = DEFAULT_TTL
): Promise<boolean> {
    try {
        await redisClient.setex(key, ttlSeconds, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Redis SET error:', error);
        return false;
    }
}

/**
 * Delete a key from cache
 */
export async function deleteFromCache(key: string): Promise<boolean> {
    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error('Redis DEL error:', error);
        return false;
    }
}

/**
 * Clear all cached search results
 */
export async function clearSearchCache(): Promise<boolean> {
    try {
        const keys = await redisClient.keys(`${CACHE_KEYS.SEARCH}*`);
        if (keys.length > 0) {
            await redisClient.del(...keys);
        }
        return true;
    } catch (error) {
        console.error('Redis clear search cache error:', error);
        return false;
    }
}

/**
 * Check if Redis is connected
 */
export async function isRedisConnected(): Promise<boolean> {
    try {
        await redisClient.ping();
        return true;
    } catch {
        return false;
    }
}

export default redisClient;
