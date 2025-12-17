'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatTimeRemaining } from '@/lib/rate-limit-utils';

interface RateLimitErrorProps {
    retryAfter: number; // seconds until reset
    limit?: number;
    resetTime?: number;
    onRetry?: () => void;
    variant?: 'page' | 'inline';
}

export function RateLimitError({
    retryAfter: initialRetryAfter,
    limit,
    resetTime,
    onRetry,
    variant = 'page',
}: RateLimitErrorProps) {
    const [timeRemaining, setTimeRemaining] = useState(initialRetryAfter);
    const [canRetry, setCanRetry] = useState(false);

    useEffect(() => {
        if (timeRemaining <= 0) {
            setCanRetry(true);
            return;
        }

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                    setCanRetry(true);
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining]);

    const progress = initialRetryAfter > 0
        ? ((initialRetryAfter - timeRemaining) / initialRetryAfter) * 100
        : 100;

    if (variant === 'inline') {
        return (
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                    <div className="flex-1 space-y-2">
                        <div>
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                                Rate Limit Reached
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                You've made too many requests. Please wait before trying again.
                            </p>
                        </div>

                        {timeRemaining > 0 && (
                            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                <Clock className="h-4 w-4" />
                                <span>Retry in {formatTimeRemaining(timeRemaining)}</span>
                            </div>
                        )}

                        {canRetry && onRetry && (
                            <Button
                                onClick={onRetry}
                                size="sm"
                                variant="outline"
                                className="mt-2"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            <Card className="w-full max-w-md p-8 text-center space-y-6 bg-gradient-to-br from-background to-muted/20">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-xl animate-pulse" />
                        <div className="relative bg-amber-100 dark:bg-amber-950 p-4 rounded-full">
                            <Clock className="h-12 w-12 text-amber-600 dark:text-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                        Rate Limit Reached
                    </h2>
                    <p className="text-muted-foreground">
                        You've made too many requests. Please wait a moment before trying again.
                    </p>
                </div>

                {/* Countdown */}
                {timeRemaining > 0 && (
                    <div className="space-y-3">
                        <div className="text-5xl font-bold text-amber-600 dark:text-amber-500 tabular-nums">
                            {formatTimeRemaining(timeRemaining)}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-500 transition-all duration-1000 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Info */}
                {limit && (
                    <div className="text-sm text-muted-foreground">
                        Rate limit: <span className="font-semibold">{limit} requests per minute</span>
                    </div>
                )}

                {/* Retry button */}
                <Button
                    onClick={onRetry}
                    disabled={!canRetry}
                    className="w-full"
                    size="lg"
                >
                    {canRetry ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </>
                    ) : (
                        <>
                            <Clock className="h-4 w-4 mr-2" />
                            Please Wait...
                        </>
                    )}
                </Button>

                {/* Help text */}
                <p className="text-xs text-muted-foreground">
                    This limit helps us maintain service quality for all users.
                </p>
            </Card>
        </div>
    );
}
