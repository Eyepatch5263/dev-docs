'use client';

import { Flashcard } from '@/components/Flashcard';
import { DeckNavigation } from '@/components/DeckNavigation';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
    getFlashcardsByCategory,
    getCategoryInfo,
    shuffleDeck,
} from '@/lib/flashcards';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect, useRef, use } from 'react';
import { FlashcardCategory } from '@/app/types/flashcard.type';
import { iconMap } from '@/lib/icon-map';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categoryParam } = use(params);
    const category = categoryParam as FlashcardCategory;
    const categoryInfo = getCategoryInfo(category);

    if (!categoryInfo) {
        notFound();
    }

    const initialCards = getFlashcardsByCategory(category);
    const [cards, setCards] = useState(initialCards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [direction, setDirection] = useState(0);

    // Progress tracking - store as arrays in localStorage
    const [knownCardsArray, setKnownCardsArray] = useLocalStorage<string[]>(
        `flashcard-known-${category}`,
        []
    );
    const [reviewCardsArray, setReviewCardsArray] = useLocalStorage<string[]>(
        `flashcard-review-${category}`,
        []
    );

    // Convert arrays to Sets for easier manipulation
    // Handle cases where old data might be stored as objects or Sets
    const knownCards = new Set(Array.isArray(knownCardsArray) ? knownCardsArray : []);
    const reviewCards = new Set(Array.isArray(reviewCardsArray) ? reviewCardsArray : []);

    // Clean up old localStorage data if it's not an array
    useEffect(() => {
        if (!Array.isArray(knownCardsArray)) {
            setKnownCardsArray([]);
        }
        if (!Array.isArray(reviewCardsArray)) {
            setReviewCardsArray([]);
        }
    }, []);

    const currentCard = cards[currentIndex];
    const cardRef = useRef<HTMLDivElement>(null);

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setDirection(1);
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleShuffle = () => {
        const shuffled = shuffleDeck(cards);
        setCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleMarkKnown = () => {
        const newKnownCards = new Set(knownCards);
        const newReviewCards = new Set(reviewCards);

        if (newKnownCards.has(currentCard.id)) {
            newKnownCards.delete(currentCard.id);
        } else {
            newKnownCards.add(currentCard.id);
            newReviewCards.delete(currentCard.id);
        }

        setKnownCardsArray(Array.from(newKnownCards));
        setReviewCardsArray(Array.from(newReviewCards));
    };

    const handleMarkReview = () => {
        const newKnownCards = new Set(knownCards);
        const newReviewCards = new Set(reviewCards);

        if (newReviewCards.has(currentCard.id)) {
            newReviewCards.delete(currentCard.id);
        } else {
            newReviewCards.add(currentCard.id);
            newKnownCards.delete(currentCard.id);
        }

        setKnownCardsArray(Array.from(newKnownCards));
        setReviewCardsArray(Array.from(newReviewCards));
    };

    // Keyboard controls
    useKeyboardControls({
        onSpace: handleFlip,
        onArrowLeft: handlePrevious,
        onArrowRight: handleNext,
        onKeyS: handleShuffle,
        onKeyK: handleMarkKnown,
        onKeyR: handleMarkReview,
    });

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/flashcards" className="flex items-center gap-2 transition-opacity">
                            <ArrowLeft className="w-5 h-5" />
                            <BookOpen className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold">Flashcards</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium"
                                style={{
                                    color: `isDark ? "white" : "black"`,
                                }}
                            >
                                {(() => {
                                    const IconComponent = iconMap[categoryInfo.icon];
                                    return IconComponent ? (
                                        <IconComponent className="w-6 h-6" style={{ color: categoryInfo.color }} />
                                    ) : (
                                        <BookOpen className="w-6 h-6" />
                                    );
                                })()}
                                <span className='light:text-black'>{categoryInfo.name}</span>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-[1fr_350px] gap-8 max-w-7xl mx-auto">
                    {/* Main card area */}
                    <div className="space-y-8">
                        {/* Flashcard */}
                        <div className="relative h-[450px] md:h-[500px]">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={currentCard.id}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: 'spring', stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 },
                                    }}
                                    className="absolute inset-0"
                                    ref={cardRef}
                                >
                                    <Flashcard
                                        question={currentCard.question}
                                        answer={currentCard.answer}
                                        categoryColor={categoryInfo.color}
                                        isKnown={knownCards.has(currentCard.id)}
                                        isReview={reviewCards.has(currentCard.id)}
                                        isFlipped={isFlipped}
                                        onFlip={handleFlip}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <DeckNavigation
                            currentIndex={currentIndex}
                            totalCards={cards.length}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onShuffle={handleShuffle}
                            disablePrevious={currentIndex === 0}
                            disableNext={currentIndex === cards.length - 1}
                        />
                    </div>

                    {/* Progress tracker sidebar */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProgressTracker
                            knownCards={knownCards}
                            reviewCards={reviewCards}
                            totalCards={cards.length}
                            currentCardId={currentCard.id}
                            onMarkKnown={handleMarkKnown}
                            onMarkReview={handleMarkReview}
                            categoryColor={categoryInfo.color}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
