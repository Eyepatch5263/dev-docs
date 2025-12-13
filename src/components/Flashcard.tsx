'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

interface FlashcardProps {
    question: string;
    answer: string;
    categoryColor?: string;
    isKnown?: boolean;
    isReview?: boolean;
    isFlipped?: boolean;
    onFlip?: () => void;
}

export function Flashcard({ question, answer, categoryColor = 'oklch(0.6 0.2 240)', isKnown = false, isReview = false, isFlipped = false, onFlip }: FlashcardProps) {
    const handleFlip = () => {
        onFlip?.();
    };

    return (
        <div className="perspective-1000 w-full h-full">
            <motion.div
                className="relative w-full h-full cursor-pointer preserve-3d"
                onClick={handleFlip}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of card */}
                <div
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {/* Light mode background */}
                    <div
                        className="absolute inset-0 dark:hidden"
                        style={{
                            background: `linear-gradient(135deg, ${categoryColor}35 0%, ${categoryColor}20 50%, ${categoryColor}30 100%)`,
                        }}
                    />

                    {/* Dark mode background - Brightened */}
                    <div
                        className="absolute inset-0 hidden dark:block"
                        style={{
                            background: `linear-gradient(135deg, ${categoryColor}40 0%, ${categoryColor}28 50%, ${categoryColor}35 100%)`,
                        }}
                    />

                    {/* Decorative overlay pattern - Light mode */}
                    <div className="absolute inset-0 opacity-20 dark:hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                    </div>

                    {/* Decorative overlay pattern - Dark mode - Brightened */}
                    <div className="absolute inset-0 opacity-18 hidden dark:block">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                    </div>

                    {/* Card border - Light mode */}
                    <div
                        className="absolute inset-0 rounded-2xl dark:hidden"
                        style={{
                            border: `2px solid ${categoryColor}60`,
                        }}
                    />

                    {/* Card border - Dark mode - Brightened */}
                    <div
                        className="absolute inset-0 rounded-2xl hidden dark:block"
                        style={{
                            border: `2px solid ${categoryColor}55`,
                        }}
                    />

                    {/* Status Badge - Top Right */}
                    <AnimatePresence>
                        {isKnown && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/90 dark:bg-green-500/80 text-white text-sm font-medium shadow-lg backdrop-blur-sm"
                            >
                                <Check className="w-4 h-4" />
                                <span>Known</span>
                            </motion.div>
                        )}
                        {isReview && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/90 dark:bg-orange-500/80 text-white text-sm font-medium shadow-lg backdrop-blur-sm"
                            >
                                <Clock className="w-4 h-4" />
                                <span>Review Later</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content */}
                    <div className="relative h-full flex items-center justify-center p-8">
                        <div className="text-center space-y-6 max-w-2xl">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-background/90 dark:bg-background/80 backdrop-blur-sm border border-primary/30 dark:border-primary/20 text-primary text-sm font-medium mb-4 shadow-lg">
                                Question
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed drop-shadow-sm">
                                {question}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-8">
                                Click or press <kbd className="px-2 py-1 bg-background/80 dark:bg-background/60 backdrop-blur-sm rounded text-xs border border-border shadow-sm">Space</kbd> to reveal answer
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div
                    className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    {/* Light mode background */}
                    <div
                        className="absolute inset-0 dark:hidden"
                        style={{
                            background: `linear-gradient(135deg, ${categoryColor}45 0%, ${categoryColor}30 50%, ${categoryColor}40 100%)`,
                        }}
                    />

                    {/* Dark mode background - Brightened */}
                    <div
                        className="absolute inset-0 hidden dark:block"
                        style={{
                            background: `linear-gradient(135deg, ${categoryColor}48 0%, ${categoryColor}35 50%, ${categoryColor}42 100%)`,
                        }}
                    />

                    {/* Decorative overlay pattern - Light mode */}
                    <div className="absolute inset-0 opacity-25 dark:hidden">
                        <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                    </div>

                    {/* Decorative overlay pattern - Dark mode - Brightened */}
                    <div className="absolute inset-0 opacity-22 hidden dark:block">
                        <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl"
                            style={{ background: categoryColor }}
                        />
                    </div>

                    {/* Card border - Light mode */}
                    <div
                        className="absolute inset-0 rounded-2xl dark:hidden"
                        style={{
                            border: `2px solid ${categoryColor}70`,
                        }}
                    />

                    {/* Card border - Dark mode - Brightened */}
                    <div
                        className="absolute inset-0 rounded-2xl hidden dark:block"
                        style={{
                            border: `2px solid ${categoryColor}60`,
                        }}
                    />

                    {/* Content */}
                    <div className="relative h-full flex items-center justify-center p-8">
                        <div className="text-center space-y-6 max-w-2xl">
                            <div
                                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-lg backdrop-blur-sm border"
                                style={{
                                    background: `${categoryColor}40`,
                                    color: categoryColor,
                                    borderColor: `${categoryColor}60`,
                                }}
                            >
                                Answer
                            </div>
                            <div className="bg-background/60 dark:bg-background/50 backdrop-blur-md rounded-xl p-6 border border-foreground/10 dark:border-background/30 shadow-xl">
                                <p className="text-lg md:text-xl text-foreground leading-relaxed">
                                    {answer}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-8">
                                Click or press <kbd className="px-2 py-1 bg-background/80 dark:bg-background/60 backdrop-blur-sm rounded text-xs border border-border shadow-sm">Space</kbd> to flip back
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
        </div>
    );
}
