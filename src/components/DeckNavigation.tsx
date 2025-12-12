'use client';

import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeckNavigationProps {
    currentIndex: number;
    totalCards: number;
    onPrevious: () => void;
    onNext: () => void;
    onShuffle: () => void;
    disablePrevious?: boolean;
    disableNext?: boolean;
}

export function DeckNavigation({
    currentIndex,
    totalCards,
    onPrevious,
    onNext,
    onShuffle,
    disablePrevious = false,
    disableNext = false,
}: DeckNavigationProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-2xl mx-auto">
            {/* Progress indicator */}
            <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                    Card <span className="font-bold text-foreground">{currentIndex + 1}</span> of{' '}
                    <span className="font-bold text-foreground">{totalCards}</span>
                </p>
                <div className="w-full sm:w-48 h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrevious}
                    disabled={disablePrevious}
                    className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Previous card"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={onShuffle}
                    className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Shuffle deck"
                >
                    <Shuffle className="w-5 h-5" />
                </button>

                <button
                    onClick={onNext}
                    disabled={disableNext}
                    className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Next card"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Keyboard hints */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded">←</kbd>
                <kbd className="px-2 py-1 bg-muted rounded">→</kbd>
                <kbd className="px-2 py-1 bg-muted rounded">S</kbd>
            </div>
        </div>
    );
}
