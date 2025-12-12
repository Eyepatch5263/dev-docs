export type FlashcardCategory = 'dbms' | 'os' | 'networking' | 'system-design';

export interface Flashcard {
    id: string;
    category: FlashcardCategory;
    question: string;
    answer: string;
}

export interface CategoryInfo {
    id: FlashcardCategory;
    name: string;
    icon: string;
    color: string;
    description: string;
}