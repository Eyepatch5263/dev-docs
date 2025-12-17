"use client";

import { Document } from "@/app/types/editor.type";
import { formatRelativeTime } from "@/lib/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Layers, Eye, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";

interface UserDocumentCardProps {
    document: Document;
}

export default function UserDocumentCard({ document }: UserDocumentCardProps) {
    const [showContentDialog, setShowContentDialog] = useState(false);
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [mdxError, setMdxError] = useState<string>("");
    const [isCompiling, setIsCompiling] = useState(false);

    // Compile MDX when dialog opens
    useEffect(() => {
        const compileMDX = async () => {
            if (!showContentDialog || !document.content) return;

            setIsCompiling(true);
            try {
                const result = await serialize(document.content, {
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeHighlight],
                        development: false,
                    },
                });
                setMdxSource(result);
                setMdxError("");
            } catch (err) {
                console.error("MDX compilation error:", err);
                setMdxError(err instanceof Error ? err.message : "Failed to compile MDX");
                setMdxSource(null);
            } finally {
                setIsCompiling(false);
            }
        };

        compileMDX();
    }, [showContentDialog, document.content]);

    const getStatusBadge = () => {
        const statusConfig = {
            draft: { label: "Draft", className: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
            review: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
            approved: { label: "Approved", className: "bg-green-500/10 text-green-600 border-green-500/20" },
            rejected: { label: "Rejected", className: "bg-red-500/10 text-red-600 border-red-500/20" },
        };

        const config = statusConfig[document.status as keyof typeof statusConfig] || statusConfig.draft;
        return <Badge variant="outline" className={`${config.className} font-medium`}>{config.label}</Badge>;
    };

    return (
        <>
            <div className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                {/* Card Header with Status */}
                <div className="p-6 border-b border-border bg-muted/30">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {document.title || "Untitled Document"}
                            </h2>
                        </div>
                        {/* Status Badge */}
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Document Details */}
                <div className="p-6 space-y-4">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Topic */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Layers className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Topic</span>
                            </div>
                            <p className="text-sm font-medium text-foreground capitalize">
                                {document.topic?.replace(/-/g, " ") || "N/A"}
                            </p>
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Tag className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Category</span>
                            </div>
                            <p className="text-sm font-medium text-foreground capitalize">
                                {document.category?.replace(/-/g, " ") || "N/A"}
                            </p>
                        </div>

                        {/* Last Updated */}
                        <div className="space-y-1 col-span-2">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Last Updated</span>
                            </div>
                            <p className="text-sm font-medium text-foreground">
                                {formatRelativeTime(document.updated_at)}
                            </p>
                        </div>
                    </div>

                    {/* View Content Button */}
                    {document.content && (
                        <div className="pt-4 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={() => setShowContentDialog(true)}
                                className="w-full"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Content
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Preview Dialog */}
            <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
                <DialogContent className=" min-w-[85vw] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="md:text-xl flex text-md font-bold">
                            {document.title || "Untitled Document"}
                        </DialogTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row gap-4 text-sm text-muted-foreground pt-2">
                            <div className="flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 shrink-0" />
                                <span className="capitalize truncate">{document.description}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5 shrink-0" />
                                <span className="capitalize">{document.topic?.replace(/-/g, " ")}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Tag className="h-3.5 w-3.5 shrink-0" />
                                <span className="capitalize">{document.category?.replace(/-/g, " ")}</span>
                            </div>
                            <div className="sm:col-span-2 md:col-span-1 md:ml-auto">
                                {getStatusBadge()}
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto mt-4">
                        {isCompiling ? (
                            <div className="flex items-center justify-center h-full py-12">
                                <div className="animate-pulse text-muted-foreground text-sm">
                                    Compiling MDX...
                                </div>
                            </div>
                        ) : mdxError ? (
                            <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10">
                                <p className="text-red-500 text-sm font-medium mb-2">MDX Compilation Error:</p>
                                <pre className="text-xs text-red-400 whitespace-pre-wrap">{mdxError}</pre>
                            </div>
                        ) : mdxSource ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:bg-[#0d1117] [&_code]:text-sm">
                                <MDXRemote {...mdxSource} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full py-12 text-muted-foreground text-sm">
                                No content available
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
