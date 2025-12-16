'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 dark:from-primary/10 dark:via-background dark:to-accent/10" />

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="relative max-w-4xl mx-auto text-center z-10">
                {/* 404 Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mb-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                        <FileQuestion className="relative w-24 h-24 sm:w-32 sm:h-32 text-primary mx-auto" />
                    </div>
                </motion.div>

                {/* 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        404
                    </h1>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 w-full sm:w-auto justify-center"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium text-lg transition-all hover:scale-105 hover:shadow-lg border border-border w-full sm:w-auto justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Go Back
                    </button>

                    <Link
                        href="/engineering-terms"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-medium text-lg transition-all hover:scale-105 hover:shadow-lg border border-border w-full sm:w-auto justify-center"
                    >
                        <Search className="w-5 h-5" />
                        Search
                    </Link>
                </motion.div>

                {/* Helpful Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                    className="mt-16 pt-8 border-t border-border"
                >
                    <p className="text-sm text-muted-foreground mb-4">Popular pages you might be looking for:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/docs"
                            className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        >
                            Flash Docs
                        </Link>
                        <Link
                            href="/flashcards"
                            className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        >
                            Flash Cards
                        </Link>
                        <Link
                            href="/collaborative-editor"
                            className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        >
                            Collaborative Editor
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
