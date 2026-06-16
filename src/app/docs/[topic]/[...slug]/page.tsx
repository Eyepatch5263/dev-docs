import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllSlugsForTopic, getDocBySlug, getTopicMeta, discoverTopics } from "@/lib/docs";
import { extractHeadings } from "@/lib/toc";
import { TableOfContents } from "@/components/TableOfContents";
import { Separator } from "@/components/ui/separator";
import { mdxComponents } from "@/components/mdx-components";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Quiz } from "@/components/Quiz";
import { getQuizBySlug, hasQuizForSlug } from "@/lib/quiz";

interface DocPageProps {
    params: Promise<{ topic: string; slug: string[] }>;
}

export async function generateStaticParams() {
    const topics = discoverTopics();
    const params: { topic: string; slug: string[] }[] = [];

    for (const topic of topics) {
        const slugs = getAllSlugsForTopic(topic);
        for (const slug of slugs) {
            // Document reader route
            params.push({
                topic,
                slug: slug.split("/"),
            });
            // Quiz sub-route
            params.push({
                topic,
                slug: [...slug.split("/"), "quiz"],
            });
        }
    }

    return params;
}

// generates metadata for each doc page dynamically for SEO
export async function generateMetadata({ params }: DocPageProps) {
    const { topic, slug } = await params;
    const isQuizRoute = slug[slug.length - 1] === "quiz";
    const slugParts = isQuizRoute ? slug.slice(0, -1) : slug;
    const slugPath = slugParts.join("/");
    const doc = getDocBySlug(topic, slugPath);
    const topicMeta = getTopicMeta(topic);

    if (!doc) {
        return { title: "Not Found" };
    }

    const title = isQuizRoute
        ? `${doc.title} Quiz | ${topicMeta?.title || topic} | Explainbytes`
        : `${doc.title} | ${topicMeta?.title || topic} | Explainbytes`;

    const description = isQuizRoute
        ? `Test your knowledge on ${doc.title} with interactive questions.`
        : doc.description;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://explainbytes.tech";
    const canonical = encodeURI(`${siteUrl}/docs/${topic}/${slugPath}${isQuizRoute ? "/quiz" : ""}`);

    const images = doc.image
        ? [`${siteUrl}${doc.image.startsWith("/") ? "" : "/"}${doc.image}`]
        : [`${siteUrl}/logo.svg`];

    return {
        title,
        description,
        alternates: { canonical },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            images: images.map((url) => ({ url })),
            siteName: "Explainbytes",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images,
        },
    };
}

export default async function DocPage({ params }: DocPageProps) {
    const { topic, slug } = await params;
    const isQuizRoute = slug[slug.length - 1] === "quiz";
    const slugParts = isQuizRoute ? slug.slice(0, -1) : slug;
    const slugPath = slugParts.join("/");
    const doc = getDocBySlug(topic, slugPath);

    if (!doc) {
        notFound();
    }

    if (isQuizRoute) {
        const questions = getQuizBySlug(topic, slugPath);
        const quizExists = !!questions;
        return (
            <div className="flex flex-1 w-full justify-start">
                <div className="w-full xl:w-[80%] min-w-0 px-4 md:px-8 py-6 md:py-8 animate-in fade-in duration-300">
                    {/* Header/Back link */}
                    <div className="mb-8">
                        <Link href={`/docs/${topic}/${slugPath}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Article</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                            {doc.title} Quiz
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {quizExists
                                ? "Test your understanding of the concepts covered in this chapter."
                                : "A quiz for this chapter is coming soon! Check back later."}
                        </p>
                    </div>

                    {quizExists ? (
                        <Quiz questions={questions} />
                    ) : (
                        <div className="flex justify-center">
                            <div className="text-center p-12 border border-dashed rounded-2xl bg-card/40 mt-8">
                                <p className="text-muted-foreground mb-4 font-medium">No quiz questions configured for this topic yet.</p>
                                <Link href={`/docs/${topic}/${slugPath}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                                    Return to Reading
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // extract headings for table of contents
    const headings = extractHeadings(doc.content);
    const hasQuiz = hasQuizForSlug(topic, slugPath);

    return (
        <div className="flex flex-1 w-full">
            <article className="w-full xl:w-[80%] min-w-0 px-4 md:px-8 py-6 md:py-8">
                {/* Document header with title and description */}
                <header className="space-y-2 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{doc.title}</h1>
                    {doc.description && (
                        <p className="text-base md:text-lg text-muted-foreground">{doc.description}</p>
                    )}
                </header>

                <Separator className="mb-8" />

                {/* for rendering mdx component */}
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-code:before:content-none prose-code:after:content-none prose-pre:m-0 prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0">
                    <MDXRemote
                        source={doc.content}
                        components={mdxComponents}
                        options={{
                            mdxOptions: {
                                remarkPlugins: [remarkGfm],
                                rehypePlugins: [
                                    rehypeSlug,
                                    [
                                        rehypePrettyCode,
                                        {
                                            theme: {
                                                dark: "github-dark",
                                                light: "github-light",
                                            },
                                            keepBackground: false,
                                        },
                                    ],
                                ],
                            },
                        }}
                    />
                </div>

                {/* Take Quiz Banner */}
                {hasQuiz && (
                    <div className="mt-12 p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
                        <div className="space-y-1 text-center md:text-left">
                            <h3 className="font-bold text-lg text-foreground">Test Your Knowledge!</h3>
                            <p className="text-sm text-muted-foreground">Take the interactive quiz for this chapter to reinforce what you've learned.</p>
                        </div>
                        <Link href={`/docs/${topic}/${slugPath}/quiz`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0">
                            Take Quiz
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </article>

            <TableOfContents headings={headings} />
        </div>
    );
}
