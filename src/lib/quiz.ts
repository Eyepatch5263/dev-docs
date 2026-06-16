import fs from "fs";
import path from "path";

export interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const quizDirectory = path.join(process.cwd(), "data", "quiz");

export function getQuizBySlug(topic: string, slug: string): Question[] | null {
    const filePath = path.join(quizDirectory, topic, `${slug}.json`);
    
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent) as Question[];
    } catch (error) {
        console.error(`Error loading quiz for ${topic}/${slug}:`, error);
        return null;
    }
}

export function hasQuizForSlug(topic: string, slug: string): boolean {
    const filePath = path.join(quizDirectory, topic, `${slug}.json`);
    return fs.existsSync(filePath);
}
