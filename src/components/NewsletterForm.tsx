'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { RateLimitError } from '@/components/ui/rate-limit-error';
import { isRateLimited, getRateLimitInfo } from '@/lib/rate-limit-utils';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate-limited'>('idle');
    const [message, setMessage] = useState('');
    const [rateLimitInfo, setRateLimitInfo] = useState<{ retryAfter: number; limit?: number } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');
        setMessage('');
        setRateLimitInfo(null);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Thanks for subscribing! Check your inbox.');
                setEmail('');
            } else if (isRateLimited(response)) {
                // Handle rate limit
                const rateLimitData = await getRateLimitInfo(response);
                setStatus('rate-limited');
                setRateLimitInfo({
                    retryAfter: data.retryAfter || rateLimitData?.retryAfter || 60,
                    limit: rateLimitData?.limit,
                });
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to subscribe. Please try again later.');
        }
    };

    const handleRetry = () => {
        setStatus('idle');
        setRateLimitInfo(null);
        setMessage('');
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Mail className="w-12 h-12 mx-auto mb-6 text-primary" />
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                        Join the Explain Bytes Newsletter
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Get updates on new concepts, system design breakdowns, and flashcards delivered to your inbox.
                    </p>

                    {status === 'rate-limited' && rateLimitInfo ? (
                        <RateLimitError
                            variant="inline"
                            retryAfter={rateLimitInfo.retryAfter}
                            limit={rateLimitInfo.limit}
                            onRetry={handleRetry}
                        />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    disabled={status === 'loading'}
                                    className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Subscribing...
                                        </>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </div>

                            {/* Status Messages */}
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center justify-center gap-2 text-sm ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}
                                >
                                    {status === 'success' ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4" />
                                    )}
                                    {message}
                                </motion.div>
                            )}
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
