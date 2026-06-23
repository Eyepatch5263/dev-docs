import { notFound } from "next/navigation";
import {
  getFlashcardsByCategory,
  getCategoryInfo,
  getAllCategories,
} from "@/lib/flashcards";
import { FlashcardCategory } from "@/app/types/flashcard.type";
import { CategoryClient } from "./CategoryClient";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryInfo = getCategoryInfo(category as FlashcardCategory);
  return {
    title: categoryInfo
      ? `${categoryInfo.name} Flashcards | Explainbytes`
      : "Flashcards | Explainbytes",
    description:
      categoryInfo?.description ||
      "Master computer science and system design concepts with interactive flashcards.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryParam } = await params;
  const category = categoryParam as FlashcardCategory;
  const categoryInfo = getCategoryInfo(category);

  if (!categoryInfo) {
    notFound();
  }

  const initialCards = getFlashcardsByCategory(category);

  return (
    <CategoryClient
      category={category}
      categoryInfo={categoryInfo}
      initialCards={initialCards}
    />
  );
}
