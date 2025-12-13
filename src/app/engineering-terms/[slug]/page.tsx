import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { getTermBySlug, getRelatedTerms } from '@/lib/elasticsearch';
import { sampleTerms } from '@/data/sample-terms';
import { TermCard } from '@/components/TermCard';
import type { Metadata } from 'next';

// Map category to badge variant
const categoryVariantMap: Record<string, 'system-design' | 'dbms' | 'os' | 'networking' | 'devops'> = {
    'System Design': 'system-design',
    'DBMS': 'dbms',
    'Operating System': 'os',
    'Networking': 'networking',
    'DevOps': 'devops',
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate static paths for all terms
export async function generateStaticParams() {
    return sampleTerms.map((term) => ({
        slug: term.slug,
    }));
}

// Generate metadata for each term
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const term = await getTermBySlug(slug);

    if (!term) {
        return {
            title: 'Term Not Found - Explainbytes',
        };
    }

    return {
        title: `${term.term} - Engineering Terms | Explainbytes`,
        description: term.definition,
        keywords: [term.term, term.category, ...term.tags],
    };
}

export default async function TermDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const term = await getTermBySlug(slug);

    if (!term) {
        notFound();
    }

    const variant = categoryVariantMap[term.category] || 'secondary';
    const relatedTerms = await getRelatedTerms(term, 3);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-12">
                {/* Back link */}
                <Link
                    href="/engineering-terms"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Engineering Terms
                </Link>

                {/* Term content */}
                <article className="max-w-3xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                                {term.term}
                            </h1>
                            <Badge variant={variant} className="text-sm px-3 py-1">
                                {term.category}
                            </Badge>
                        </div>
                    </div>

                    {/* Definition */}
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                        <p className="text-lg leading-relaxed text-foreground/90">
                            {term.definition}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="mb-12">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                            Tags
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {term.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Related concepts */}
                    {relatedTerms.length > 0 && (
                        <section className="border-t border-border pt-12">
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-semibold">Related Concepts</h2>
                            </div>
                            <div className="grid gap-4">
                                {relatedTerms.map((relatedTerm) => (
                                    <TermCard key={relatedTerm.id} term={relatedTerm} />
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </main>
        </div>
    );
}
