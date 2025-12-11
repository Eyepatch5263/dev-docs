import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllSlugs, getDocBySlug } from "@/lib/docs";
import { extractHeadings } from "@/lib/toc";
import { TableOfContents } from "@/components/TableOfContents";
import { Separator } from "@/components/ui/separator";
import { mdxComponents } from "@/components/mdx-components";

interface DocPageProps {
    params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({
        slug: slug.split("/"),
    }));
}

export async function generateMetadata({ params }: DocPageProps) {
    const { slug } = await params;
    const slugPath = slug.join("/");
    const doc = getDocBySlug(slugPath);

    if (!doc) {
        return { title: "Not Found" };
    }

    return {
        title: `${doc.title} | System Design Docs`,
        description: doc.description,
    };
}

export default async function DocPage({ params }: DocPageProps) {
    const { slug } = await params;
    const slugPath = slug.join("/");
    const doc = getDocBySlug(slugPath);

    if (!doc) {
        notFound();
    }

    const headings = extractHeadings(doc.content);

    return (
        <div className="flex">
            <article className="flex-1 min-w-0 px-8 py-8 max-w-3xl">
                <header className="space-y-2 mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
                    {doc.description && (
                        <p className="text-lg text-muted-foreground">{doc.description}</p>
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
