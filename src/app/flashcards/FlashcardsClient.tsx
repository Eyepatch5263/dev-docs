'use client';

import { CategorySelector } from '@/components/CategorySelector';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Trophy } from 'lucide-react';
import { CategoryInfo } from '@/app/types/flashcard.type';
import HeroReusableComponent from '@/components/HeroReusableComponent';

interface FlashcardsClientProps {
    categories: CategoryInfo[];
    cardCounts: Record<string, number>;
    totalCards: number;
}

export function FlashcardsClient({ categories, cardCounts, totalCards }: FlashcardsClientProps) {
    const [studyStreak] = useLocalStorage('flashcard-streak', 0);
    const [totalStudied] = useLocalStorage('flashcard-total-studied', 0);

    return (
        <main className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <HeroReusableComponent title='Master' subHeading='Technical Concepts' description='Transform complex technical concepts into bite-sized flashcards. Learn faster, retain longer, and ace your interviews with confidence.'/>
                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div className="text-left">
                            <p className="text-2xl font-bold text-foreground">
                                {totalCards}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Cards</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div className="text-left">
                            <p className="text-2xl font-bold text-foreground">
                                {totalStudied}
                            </p>
                            <p className="text-xs text-muted-foreground">Cards Studied</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <div className="text-left">
                            <p className="text-2xl font-bold text-foreground">
                                {studyStreak}
                            </p>
                            <p className="text-xs text-muted-foreground">Day Streak</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Categories */}
            <div className="mb-8">
                <CategorySelector categories={categories} cardCounts={cardCounts} />
            </div>

            {/* Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 p-6 rounded-2xl bg-muted/50 border border-border"
            >
                <h3 className="text-lg font-semibold mb-4">Study Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                        • Use keyboard shortcuts for faster navigation (Space, Arrow keys)
                    </li>
                    <li>
                        • Mark cards as "Known" or "Review Later" to track your progress
                    </li>
                    <li>• Shuffle the deck to test your knowledge in random order</li>
                    <li>
                        • Study consistently to maintain your streak and improve retention
                    </li>
                </ul>
            </motion.div>
        </main>
    );
}
