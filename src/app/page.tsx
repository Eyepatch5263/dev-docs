import { Hero } from '@/components/Hero';
import { FeatureSection } from '@/components/FeatureSection';
import { NewsletterForm } from '@/components/NewsletterForm';
import { Footer } from '@/components/Footer';
import Image from 'next/image';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* FlashDocs Feature */}
      <FeatureSection
        title="Flash Docs"
        description="Deep explanations of OS, DBMS, Networking, and System Design. From fundamentals to expert-level concepts, learn at your own pace with comprehensive documentation."
        buttonText="Read Concepts"
        buttonLink="/docs"
        imagePosition="right"
        illustration={
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src="/flashdocs-illustration.jpg"
              alt="FlashDocs - Deep learning resources"
              fill
              className="object-contain"
              priority
            />
          </div>
        }
      />

      {/* FlashCards Feature */}
      <FeatureSection
        title="Flash Cards"
        description="Interactive flashcards to help you memorize essential engineering concepts through active recall. Practice anytime, anywhere, and track your progress."
        buttonText="Practice Now"
        buttonLink="/flashcards"
        imagePosition="left"
        illustration={
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src="/flashcard-illustration.jpg"
              alt="FlashCards - Interactive learning"
              fill
              className="object-contain rounded-lg "
            />
          </div>
        }
      />

      {/* Engineering Terms Feature */}
      <FeatureSection
        title="Engineering Terms"
        description="Explore a curated collection of engineering terms, definitions, and related concepts. Whether you're a student, engineer, or professional, our resources provide clear explanations and practical examples to help you understand complex topics."
        buttonText="Explore Terms"
        buttonLink="/engineering-terms"
        imagePosition="right"
        illustration={
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <Image
              src="/engineering-terms-illustration.jpg"
              alt="Engineering Terms - Clear explanations and practical examples"
              fill
              className="object-contain"
              priority
            />
          </div>
        }
      />

      {/* Newsletter Section */}
      <NewsletterForm />

      {/* Footer */}
      <Footer />
    </main>
  );
}
