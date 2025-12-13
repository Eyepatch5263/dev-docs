import { getAllTopics } from '@/lib/docs';
import { CategoryInfo } from '@/app/types/flashcard.type';

// Server-side function to get categories from content folders
export function getCategoriesFromContent(): CategoryInfo[] {
    const topics = getAllTopics();
    console.log(topics);

    return topics.map(topic => ({
        id: topic.id as any, // Map to FlashcardCategory type
        name: topic.title,
        icon: topic.icon || 'BookOpen',
        color: topic.color || 'oklch(0.6 0.2 240)',
        description: topic.description
    }));
}