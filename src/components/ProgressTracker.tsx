'use client';

import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

interface ProgressTrackerProps {
    knownCards: Set<string>;
    reviewCards: Set<string>;
    totalCards: number;
    currentCardId: string;
    onMarkKnown: () => void;
    onMarkReview: () => void;
    categoryColor?: string;
}

export function ProgressTracker({
    knownCards,
    reviewCards,
    totalCards,
    currentCardId,
    onMarkKnown,
    onMarkReview,
    categoryColor = 'oklch(0.6 0.2 240)',
}: ProgressTrackerProps) {
    const isKnown = knownCards.has(currentCardId);
    const isReview = reviewCards.has(currentCardId);
    const progressPercentage = (knownCards.size / totalCards) * 100;

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                        {knownCards.size} / {totalCards} mastered
                    </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: categoryColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onMarkKnown}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${isKnown
                            ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-2 border-green-500/50'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground border-2 border-transparent'
                        }`}
                >
                    <Check className="w-4 h-4" />
                    <span className="text-sm">
                        {isKnown ? 'Known' : 'Mark Known'}
                    </span>
                </button>

                <button
                    onClick={onMarkReview}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${isReview
                            ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-2 border-orange-500/50'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground border-2 border-transparent'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                        {isReview ? 'Review Later' : 'Mark Review'}
                    </span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {knownCards.size}
                    </p>
                    <p className="text-xs text-muted-foreground">Known</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {reviewCards.size}
                    </p>
                    <p className="text-xs text-muted-foreground">Review</p>
                </div>
            </div>

            {/* Keyboard hints */}
            <div className="text-center text-xs text-muted-foreground pt-2">
                <kbd className="px-2 py-1 bg-muted rounded">K</kbd> Known •{' '}
                <kbd className="px-2 py-1 bg-muted rounded">R</kbd> Review
            </div>
        </div>
    );
}
