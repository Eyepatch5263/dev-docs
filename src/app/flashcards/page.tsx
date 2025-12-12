'use client';

import { CategorySelector } from '@/components/CategorySelector';
import { Header } from '@/components/Header';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getAllCategories, getFlashcardsByCategory } from '@/data/flashcards';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function FlashcardsPage() {
    const categories = getAllCategories();
    const [studyStreak] = useLocalStorage('flashcard-streak', 0);
    const [totalStudied] = useLocalStorage('flashcard-total-studied', 0);

    // Calculate card counts per category
    const cardCounts = categories.reduce((acc, category) => {
        acc[category.id] = getFlashcardsByCategory(category.id).length;
        return acc;
    }, {} as Record<string, number>);

    const totalCards = Object.values(cardCounts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header/>

            <main className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text ">
                        Master Technical Concepts
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Learn DBMS, Operating Systems, Networking, and System Design through interactive flashcards.
                        Track your progress and build your knowledge one card at a time.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">{totalCards}</p>
                                <p className="text-xs text-muted-foreground">Total Cards</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                            <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">{totalStudied}</p>
                                <p className="text-xs text-muted-foreground">Cards Studied</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">{studyStreak}</p>
                                <p className="text-xs text-muted-foreground">Day Streak</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Choose Your Byte</h2>
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
                        <li>• Use keyboard shortcuts for faster navigation (Space, Arrow keys)</li>
                        <li>• Mark cards as "Known" or "Review Later" to track your progress</li>
                        <li>• Shuffle the deck to test your knowledge in random order</li>
                        <li>• Study consistently to maintain your streak and improve retention</li>
                    </ul>
                </motion.div>
            </main>
        </div>
    );
}
