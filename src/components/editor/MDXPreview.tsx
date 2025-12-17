"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState, useCallback } from "react";
import remarkGfm from "remark-gfm";
import { Eye, Code2 } from "lucide-react";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";
import { mdxComponents } from "../mdx-components";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

interface MDXPreviewProps {
    content: string;
    className?: string;
}

export function MDXPreview({ content, className = "" }: MDXPreviewProps) {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [error, setError] = useState<string>("");
    const [showRaw, setShowRaw] = useState(false);

    const compileMDX = useCallback(async () => {
        if (!content.trim()) {
            setMdxSource(null);
            setError("");
            return;
        }

        try {
            const result = await serialize(content, {
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                    development: false,
                },
            });
            setMdxSource(result);
            setError("");
        } catch (err) {
            console.error("MDX compilation error:", err);
            setError(err instanceof Error ? err.message : "Failed to compile MDX");
            setMdxSource(null);
        }
    }, [content]);

    useEffect(() => {
        // Debounce the compilation
        const timeout = setTimeout(compileMDX, 300);
        return () => clearTimeout(timeout);
    }, [compileMDX]);

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                </div>
                <button
                    onClick={() => setShowRaw(!showRaw)}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs rounded hover:bg-muted transition-colors"
                    title={showRaw ? "Show Rendered" : "Show Raw MDX"}
                >
                    <Code2 className="h-3.5 w-3.5" />
                    {showRaw ? "Rendered" : "Raw MDX"}
                </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-4">
                {showRaw ? (
                    <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground bg-muted/50 p-4 rounded-lg overflow-auto">
                        {content || "Start typing to see MDX output..."}
                    </pre>
                ) : error ? (
                    <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10">
                        <p className="text-red-500 text-sm font-medium mb-2">MDX Error:</p>
                        <pre className="text-xs text-red-400 whitespace-pre-wrap">{error}</pre>
                    </div>
                ) : !content.trim() ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Start typing to see preview...
                    </div>
                ) : mdxSource ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:bg-[#0d1117] [&_code]:text-sm">
                        <MDXRemote
                            {...mdxSource}
                            components={mdxComponents}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse text-muted-foreground text-sm">
                            Compiling...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
