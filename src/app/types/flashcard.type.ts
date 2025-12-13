export type FlashcardCategory = 'dbms' | 'operating-systems' | 'networking' | 'system-design' | 'devops';

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