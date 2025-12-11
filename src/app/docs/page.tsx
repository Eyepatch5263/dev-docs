import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllDocs } from "@/lib/docs";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function DocsHomePage() {
    const docs = getAllDocs();

    // Group docs by category
    const rootDocs = docs.filter((doc) => !doc.slug.includes("/"));
    const systemDesignDocs = docs.filter((doc) =>
        doc.slug.startsWith("system-design/")
    );

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="space-y-2 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    System Design Documentation
                </h1>
                <p className="text-lg text-muted-foreground">
                    Learn the fundamentals of system design, from scalability to
                    distributed systems. This guide covers essential concepts for building
                    robust, scalable applications.
                </p>
            </div>

            {/* Getting Started */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                    Getting Started
                </h2>
                <div className="grid gap-4">
                    {rootDocs.map((doc) => (
                        <Link key={doc.slug} href={`/docs/${doc.slug}`}>
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

            {/* System Design Topics */}
            <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                    System Design Topics
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {systemDesignDocs.map((doc) => (
                        <Link key={doc.slug} href={`/docs/${doc.slug}`}>
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
        </div>
    );
}
