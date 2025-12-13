import { Header } from '@/components/Header';
import { getFlashcardsByCategory } from '@/data/flashcards';
import { getCategoriesFromContent } from '@/lib/flashcard-categories';
import { FlashcardsClient } from './FlashcardsClient';

export default function FlashcardsPage() {
    // Fetch categories dynamically from content folders
    const categories = getCategoriesFromContent();

    // Calculate card counts per category
    const cardCounts = categories.reduce((acc, category) => {
        acc[category.id] = getFlashcardsByCategory(category.id).length;
        return acc;
    }, {} as Record<string, number>);

    const totalCards = Object.values(cardCounts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header />

            <FlashcardsClient
                categories={categories}
                cardCounts={cardCounts}
                totalCards={totalCards}
            />
        </div>
    );
}
