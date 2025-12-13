'use client';

import { CategoryInfo } from '@/app/types/flashcard.type';
import { TopicCard } from './TopicCard';

interface CategorySelectorProps {
    categories: CategoryInfo[];
    cardCounts: Record<string, number>;
}

export function CategorySelector({ categories, cardCounts }: CategorySelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
                <TopicCard
                    key={category.id}
                    id={category.id}
                    title={category.name}
                    description={category.description}
                    icon={category.icon}
                    color={category.color}
                    count={cardCounts[category.id] || 0}
                    countLabel="cards"
                    href={`/flashcards/${category.id}`}
                    index={index}
                />
            ))}
        </div>
    );
}
