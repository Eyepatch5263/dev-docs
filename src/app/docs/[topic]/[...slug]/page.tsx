import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllSlugsForTopic, getDocBySlug, getTopicMeta } from "@/lib/docs";
import { extractHeadings } from "@/lib/toc";
import { TableOfContents } from "@/components/TableOfContents";
import { Separator } from "@/components/ui/separator";
import { mdxComponents } from "@/components/mdx-components";

interface DocPageProps {
    params: Promise<{ topic: string; slug: string[] }>;
}

export async function generateStaticParams() {
    const topics = ["system-design", "networking", "operating-systems", "dbms"];
    const params: { topic: string; slug: string[] }[] = [];

    for (const topic of topics) {
        const slugs = getAllSlugsForTopic(topic);
        for (const slug of slugs) {
            params.push({
                topic,
                slug: slug.split("/"),
            });
        }
    }

    return params;
}

export async function generateMetadata({ params }: DocPageProps) {
    const { topic, slug } = await params;
    const slugPath = slug.join("/");
    const doc = getDocBySlug(topic, slugPath);
    const topicMeta = getTopicMeta(topic);

    if (!doc) {
        return { title: "Not Found" };
    }

    return {
        title: `${doc.title} | ${topicMeta?.title || topic} | CS Docs`,
        description: doc.description,
    };
}

export default async function DocPage({ params }: DocPageProps) {
    const { topic, slug } = await params;
    const slugPath = slug.join("/");
    const doc = getDocBySlug(topic, slugPath);

    if (!doc) {
        notFound();
    }

    const headings = extractHeadings(doc.content);

    return (
        <div className="flex flex-1 w-full">
            <article className="w-full xl:w-[80%] min-w-0 px-4 md:px-8 py-6 md:py-8">
                <header className="space-y-2 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{doc.title}</h1>
                    {doc.description && (
                        <p className="text-base md:text-lg text-muted-foreground">{doc.description}</p>
                    )}
                </header>

                <Separator className="mb-8" />

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
            </article>

            <TableOfContents headings={headings} />
        </div>
    );
}
