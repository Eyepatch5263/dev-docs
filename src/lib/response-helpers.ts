import { NextResponse } from "next/server";

/**
 * Helper function to create a JSON response with rate limit headers
 */
export function createRateLimitedResponse<T>(
    data: T,
    headers: Headers,
    options?: { status?: number }
) {
    return NextResponse.json(data, {
        status: options?.status || 200,
        headers,
    });
}
