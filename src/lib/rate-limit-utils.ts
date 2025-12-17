/**
 * Rate limit utility functions for parsing headers and formatting display
 */

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
    retryAfter?: number;
}

/**
 * Parse rate limit information from response headers
 */
export function parseRateLimitHeaders(headers: Headers): RateLimitInfo | null {
    const limit = headers.get('x-ratelimit-limit');
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    const retryAfter = headers.get('retry-after');

    if (!limit || !remaining || !reset) {
        return null;
    }

    return {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
    };
}

/**
 * Check if a response is rate limited (429 status)
 */
export function isRateLimited(response: Response): boolean {
    return response.status === 429;
}

/**
 * Get rate limit info from a response
 */
export async function getRateLimitInfo(response: Response): Promise<RateLimitInfo | null> {
    const rateLimitInfo = parseRateLimitHeaders(response.headers);

    if (isRateLimited(response) && !rateLimitInfo?.retryAfter) {
        // Try to get retryAfter from response body
        try {
            const data = await response.clone().json();
            if (data.retryAfter && rateLimitInfo) {
                rateLimitInfo.retryAfter = data.retryAfter;
            }
        } catch {
            // Ignore JSON parse errors
        }
    }

    return rateLimitInfo;
}

/**
 * Format time remaining for display
 * @param seconds - Number of seconds remaining
 * @returns Formatted string like "45s", "2m 30s", or "1h 5m"
 */
export function formatTimeRemaining(seconds: number): string {
    if (seconds < 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    if (minutes > 0) {
        return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
    }

    return `${secs}s`;
}

/**
 * Calculate percentage of requests remaining
 */
export function getRemainingPercentage(info: RateLimitInfo): number {
    return (info.remaining / info.limit) * 100;
}

/**
 * Check if approaching rate limit (< 20% remaining)
 */
export function isApproachingLimit(info: RateLimitInfo): boolean {
    return getRemainingPercentage(info) < 20;
}

/**
 * Get time until reset in seconds
 */
export function getTimeUntilReset(resetTimestamp: number): number {
    return Math.max(0, Math.ceil((resetTimestamp - Date.now()) / 1000));
}
