import { NextRequest, NextResponse } from "next/server";
import { discoverTopics } from "@/lib/docs";
import { rateLimitMiddleware } from "@/app/middleware/rateLimit";
import { READ_RATE_LIMIT } from "@/lib/rate-limit-config";

export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request, READ_RATE_LIMIT)
    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            {
                error: 'Too many requests',
                retryAfter: rateLimitResult.retryAfter
            },
            {
                status: 429,
                headers: rateLimitResult.headers
            }
        )
    }

    const topics = discoverTopics();
    return NextResponse.json(topics, {
        headers: rateLimitResult.headers
    });
}