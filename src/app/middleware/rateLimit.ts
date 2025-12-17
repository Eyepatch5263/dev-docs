import { SlidingWindowRateLimiter } from "@/lib/rate-limiter";
import { NextRequest } from "next/server";

export async function rateLimitMiddleware(req: NextRequest, limits: { request: number, window: number }) {
    // get the IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unkown'


    // check rate limit
    const { allowed, remaining, resetTime, retryAfter } = await SlidingWindowRateLimiter(ip, limits.request, limits.window)

    // add rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', limits.request.toString())
    headers.set('X-RateLimit-Remaining', remaining.toString())
    headers.set('X-RateLimit-Reset', resetTime.toString())

    if (!allowed) {
        headers.set('retry-after', retryAfter!.toString())
    }

    return {
        allowed,
        remaining,
        resetTime,
        retryAfter,
        headers
    }

}