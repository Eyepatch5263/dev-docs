import Redis from "ioredis";

const REDIS_URL = String(process.env.REDIS_URL);

export const redisClient = new Redis(REDIS_URL);

export async function SlidingWindowRateLimiter(ip: string, maxRequest: number = 100, window: number = 60000): Promise<{ allowed: boolean, remaining: number, resetTime: number, retryAfter?: number }> {
    const now = Date.now()
    const windowId = Math.floor(now / window)
    const windowStart = windowId * window

    // redis keys for previous and current windows
    const currentKey = `ratelimit:${ip}:${windowId}`
    const previousKey = `ratelimit:${ip}:${windowId - 1}`

    const pipeline = redisClient.pipeline();
    // get count for both current and previous window
    pipeline.get(currentKey)
    pipeline.get(previousKey)
    const results = await pipeline.exec()

    // Parse Redis pipeline results - each result is [error, value]
    const currentCount = parseInt((results?.[0]?.[1] as string) || '0', 10)
    const previousCount = parseInt((results?.[1]?.[1] as string) || '0', 10)

    // sliding window algo
    const percentageIntoWindow = (now - windowStart) / window
    const previousWeight = 1 - percentageIntoWindow

    const estimatedCount = previousCount * previousWeight + currentCount

    const allowed = estimatedCount < maxRequest

    if (allowed) {
        // increment the current window counter
        const multi = redisClient.multi();
        multi.incr(currentKey)
        // TTL = 2 windows
        multi.expire(currentKey, Math.ceil(window * 2 / 1000))
        await multi.exec()
    }

    const remaining = Math.max(0, maxRequest - Math.ceil(estimatedCount))
    const resetTime = windowStart + window
    const retryAfter = Math.ceil((resetTime - now) / 1000)

    return { allowed, remaining, resetTime, retryAfter: allowed ? undefined : retryAfter }
}