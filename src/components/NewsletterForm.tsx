'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';
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
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-6 py-10 transition-colors duration-500">
            {/* Faint radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/2 dark:bg-slate-900/5 rounded-full blur-3xl pointer-events-none" />

            {/* Faint grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="relative z-10 max-w-xl w-full">
                <div className="flex flex-col items-center text-center">
                    {/* Floating Mail Icon Card */}
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 shadow-xl shadow-slate-900/5 flex items-center justify-center mb-6 relative">
                        <Mail className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                        <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center">
                            <Sparkles className="w-2.5 h-2.5" />
                        </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-3">
                        Stay Updated
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
                        Join the Newsletter
                    </h2>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
                        Get updates on new computer science concepts, system design breakdowns, and flashcards delivered directly to your inbox.
                    </p>

                    {/* Subscription Glass Box */}
                    <div className="w-full bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-950/5">
                        {status === 'rate-limited' && rateLimitInfo ? (
                            <RateLimitError
                                variant="inline"
                                retryAfter={rateLimitInfo.retryAfter}
                                limit={rateLimitInfo.limit}
                                onRetry={handleRetry}
                            />
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            disabled={status === 'loading'}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl text-sm font-bold font-mono tracking-wider transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Subscribing...
                                            </>
                                        ) : (
                                            <>
                                                Subscribe
                                                <Send className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Status Messages */}
                                {message && (
                                    <div
                                        className={`flex items-center justify-center gap-2 text-xs font-semibold pt-1 ${
                                            status === 'success'
                                                ? 'text-slate-800 dark:text-slate-200'
                                                : 'text-rose-600 dark:text-rose-400'
                                        }`}
                                    >
                                        {status === 'success' ? (
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        ) : (
                                            <AlertCircle className="w-3.5 h-3.5" />
                                        )}
                                        {message}
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
