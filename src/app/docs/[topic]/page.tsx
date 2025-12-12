import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllDocsForTopic, getTopicMeta, discoverTopics } from "@/lib/docs";
import { notFound } from "next/navigation";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DocMeta } from "@/app/types/docs.type";

interface TopicPageProps {
    params: Promise<{ topic: string }>;
}

// Category display order
const categoryOrder: Record<string, number> = {
    "Introduction": 1,
    "Building Blocks": 2,
    "Design Problems": 3,
    "Advanced": 4,
    "Epilogue": 5,
};

function groupByCategory(docs: DocMeta[]): Record<string, DocMeta[]> {
    const groups: Record<string, DocMeta[]> = {};

    for (const doc of docs) {
        const category = doc.category || "Other";
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(doc);
    }

    return groups;
}

function getSortedCategories(groups: Record<string, DocMeta[]>): string[] {
    return Object.keys(groups).sort((a, b) => {
        const orderA = categoryOrder[a] ?? 999;
        const orderB = categoryOrder[b] ?? 999;
        return orderA - orderB;
    });
}

export async function generateStaticParams() {
    const topics = discoverTopics();
    return topics.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: TopicPageProps) {
    const { topic } = await params;
    const topicMeta = getTopicMeta(topic);

    if (!topicMeta) {
        return { title: "Not Found" };
    }

    return {
        title: `${topicMeta.title} | CS Documentation`,
        description: topicMeta.description,
    };
}

export default async function TopicHomePage({ params }: TopicPageProps) {
    const { topic } = await params;
    const topicMeta = getTopicMeta(topic);

    if (!topicMeta) {
        notFound();
    }

    const docs = getAllDocsForTopic(topic);
    const groupedDocs = groupByCategory(docs);
    const sortedCategories = getSortedCategories(groupedDocs);

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="space-y-2 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    {topicMeta.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                    {topicMeta.description}
                </p>
            </div>

            {/* Topics grouped by category */}
            {sortedCategories.map((category) => (
                <section key={category} className="mb-10">
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">
                        {category}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {groupedDocs[category].map((doc) => (
                            <Link key={doc.slug} href={`/docs/${topic}/${doc.slug}`}>
                                <Card className="group h-full transition-colors hover:border-primary">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between text-base">
                                            {doc.title}
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                        </CardTitle>
                                        {doc.description && (
                                            <CardDescription className="text-sm">
                                                {doc.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}

            {docs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Content coming soon! Check back later.
                    </p>
                </div>
            )}
        </div>
    );
}
