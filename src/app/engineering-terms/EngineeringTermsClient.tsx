'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { EngineeringTerm } from '../../../data/sample-terms';
import { TermCard } from '@/components/TermCard';
import HeroReusableComponent from '@/components/HeroReusableComponent';

interface SearchResponse {
    success: boolean;
    terms: EngineeringTerm[];
    total: number;
    source: 'elasticsearch' | 'local';
    error?: string;
}

export function EngineeringTermsClient() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<EngineeringTerm[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [source, setSource] = useState<'elasticsearch' | 'local'>('local');
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Keyboard shortcut: "/" to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Load initial terms on mount
    // when component mounts for the first time initally load the local searches
    useEffect(() => {
        setIsMounted(true);
        performSearch('');
    }, []);

    // perform search function, using useCallback to prevent expensive re-renders
    const performSearch = useCallback(async (searchQuery: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/engineering-terms/search?q=${encodeURIComponent(searchQuery)}`
            );
            const data: SearchResponse = await response.json();

            if (data.success) {
                setResults(data.terms);
                setSource(data.source);
            } else {
                setError(data.error || 'Search failed');
                setResults([]);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to search. Please try again.');
            setResults([]);
        } finally {
            setIsLoading(false);
            setHasSearched(true);
        }
    }, []);

    // Debounced search means the search will only be performed after the user has stopped typing for 300ms
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            performSearch(value);
        }, 300);
    };

    return (
        <main className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <HeroReusableComponent title='Search' subHeading='For Any Engineering Terms ' description='A comprehensive glossary of software engineering terms and definitions for developers.' />
                {/* Search Input */}
                <div className="relative max-w-2xl mx-auto">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for any engineering term (e.g. Latency, Deadlock, Quorum...)"
                            value={query}
                            onChange={handleSearchChange}
                            className="w-full h-14 pl-12 pr-16 text-lg border-2 focus:border-primary rounded-xl transition-all shadow-sm hover:shadow-md focus:shadow-lg"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isLoading && (
                                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                            )}
                            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 text-xs font-medium text-muted-foreground">
                                /
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Powered by badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground"
                >
                    <Zap className="w-4 h-4" />
                    <span>
                        Powered by {source === 'elasticsearch' ? 'Elasticsearch' : 'local search'} for fast and accurate results
                    </span>
                </motion.div>
            </motion.div>

            {/* Error State */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl mx-auto mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results contain category, term, definition, and tags */}
            <div className="max-w-4xl mx-auto">
                {!isMounted || (isLoading && !hasSearched) ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : results.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid gap-4"
                    >
                        {results.map((term, index) => (
                            <motion.div
                                key={term.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <TermCard term={term} searchQuery={query} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : hasSearched ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-lg text-muted-foreground">
                            No terms found. Try a different keyword.
                        </p>
                    </motion.div>
                ) : null}
            </div>

            {/* Search Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto mt-16 p-6 rounded-2xl bg-muted/50 border border-border"
            >
                <h3 className="text-lg font-semibold mb-4">Search Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                        • Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-xs">/</kbd> anywhere to focus the search bar
                    </li>
                    <li>• Type partial terms — &quot;lat&quot; will match &quot;Latency&quot;</li>
                    <li>• Search by category names like &quot;System Design&quot; or &quot;DBMS&quot;</li>
                    <li>• Search by tags like &quot;performance&quot; or &quot;scalability&quot;</li>
                </ul>
            </motion.div>
        </main>
    );
}
