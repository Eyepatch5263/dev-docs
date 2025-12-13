import { CategoryInfo, Flashcard, FlashcardCategory } from "@/app/types/flashcard.type";
import dbms from "../../data/flashcard/dbms.json";
import os from "../../data/flashcard/operating-systems.json";
import networking from "../../data/flashcard/networking.json";
import systemDesign from "../../data/flashcard/system-design.json";
import devops from "../../data/flashcard/devops.json";
import category from "../../data/flashcard_category/category.json";

export const flashcards: Flashcard[] = [
    ...(dbms as Flashcard[]),
    ...(os as Flashcard[]),
    ...(networking as Flashcard[]),
    ...(systemDesign as Flashcard[]),
    ...(devops as Flashcard[])
];

export const categories: CategoryInfo[] = [
    ...(category as CategoryInfo[])
];

// Utility functions
export function getFlashcardsByCategory(category: FlashcardCategory): Flashcard[] {
    return flashcards.filter(card => card.category === category);
}

export function getCategoryInfo(category: FlashcardCategory): CategoryInfo | undefined {
    return categories.find(cat => cat.id === category);
}

export function shuffleDeck<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function getAllCategories(): CategoryInfo[] {
    return categories;
}
