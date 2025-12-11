import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllDocsForTopic, getTopicMeta } from "@/lib/docs";
import { notFound } from "next/navigation";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface TopicPageProps {
    params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
    return [
        { topic: "system-design" },
        { topic: "networking" },
        { topic: "operating-systems" },
        { topic: "dbms" },
    ];
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

    // Separate intro/getting started docs from main content
    const introDocs = docs.filter(
        (doc) =>
            doc.slug === "introduction" ||
            doc.slug === "intro" ||
            doc.slug === "getting-started"
    );
    const mainDocs = docs.filter(
        (doc) =>
            doc.slug !== "introduction" &&
            doc.slug !== "intro" &&
            doc.slug !== "getting-started"
    );

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

            {/* Getting Started */}
            {introDocs.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">
                        Getting Started
                    </h2>
                    <div className="grid gap-4">
                        {introDocs.map((doc) => (
                            <Link key={doc.slug} href={`/docs/${topic}/${doc.slug}`}>
                                <Card className="group transition-colors hover:border-primary">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            {doc.title}
                                            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                        </CardTitle>
                                        {doc.description && (
                                            <CardDescription>{doc.description}</CardDescription>
                                        )}
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Main Topics */}
            <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                    Topics
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {mainDocs.map((doc) => (
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
