'use client';

import { useState, useEffect, useCallback } from 'react';
import { RateLimitInfo, parseRateLimitHeaders, getTimeUntilReset } from '@/lib/rate-limit-utils';

interface UseRateLimitOptions {
    onWarning?: (info: RateLimitInfo) => void;
    onLimitReached?: (info: RateLimitInfo) => void;
    warningThreshold?: number; // Percentage threshold for warning (default: 20)
}

interface UseRateLimitReturn {
    rateLimitInfo: RateLimitInfo | null;
    isLimited: boolean;
    timeUntilReset: number;
    updateRateLimit: (headers: Headers) => void;
    resetRateLimit: () => void;
}

/**
 * Custom hook for handling rate limit state and countdown
 */
export function useRateLimit(options: UseRateLimitOptions = {}): UseRateLimitReturn {
    const { onWarning, onLimitReached, warningThreshold = 20 } = options;

    const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
    const [timeUntilReset, setTimeUntilReset] = useState(0);
    const [hasWarned, setHasWarned] = useState(false);

    // Update rate limit info from response headers
    const updateRateLimit = useCallback((headers: Headers) => {
        const info = parseRateLimitHeaders(headers);
        if (info) {
            setRateLimitInfo(info);

            // Check if approaching limit
            const percentage = (info.remaining / info.limit) * 100;
            if (percentage < warningThreshold && !hasWarned && info.remaining > 0) {
                setHasWarned(true);
                onWarning?.(info);
            }

            // Check if limit reached
            if (info.remaining === 0) {
                onLimitReached?.(info);
            }
        }
    }, [onWarning, onLimitReached, warningThreshold, hasWarned]);

    // Reset rate limit state
    const resetRateLimit = useCallback(() => {
        setRateLimitInfo(null);
        setTimeUntilReset(0);
        setHasWarned(false);
    }, []);

    // Countdown timer effect
    useEffect(() => {
        if (!rateLimitInfo?.reset) return;

        const updateCountdown = () => {
            const remaining = getTimeUntilReset(rateLimitInfo.reset);
            setTimeUntilReset(remaining);

            // Reset when countdown reaches 0
            if (remaining === 0) {
                resetRateLimit();
            }
        };

        // Update immediately
        updateCountdown();

        // Update every second
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [rateLimitInfo?.reset, resetRateLimit]);

    const isLimited = rateLimitInfo?.remaining === 0;

    return {
        rateLimitInfo,
        isLimited,
        timeUntilReset,
        updateRateLimit,
        resetRateLimit,
    };
}
