"use client";

import { DocumentWithUser } from "@/app/types/editor.type";
import { generateAvatarInitials, generateAvatarColor } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Tag, Layers, Eye, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import rehypeHighlight from "rehype-highlight";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";
import ReusableAdminProfileCard from "../ReusableAdminProfileCard";

interface SubmissionCardProps {
    document: DocumentWithUser;
    onStatusUpdate: (id: string, status: "approved" | "rejected") => Promise<void>;
}

export default function SubmissionCard({ document, onStatusUpdate }: SubmissionCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showContentDialog, setShowContentDialog] = useState(false);
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [mdxError, setMdxError] = useState<string>("");
    const [isCompiling, setIsCompiling] = useState(false);

    const handleApprove = async () => {
        setIsUpdating(true);
        try {
            await onStatusUpdate(document.id, "approved");
            setShowApproveDialog(false);
        } catch (error) {
            console.error("Error approving document:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReject = async () => {
        setIsUpdating(true);
        try {
            await onStatusUpdate(document.id, "rejected");
            setShowRejectDialog(false);
        } catch (error) {
            console.error("Error rejecting document:", error);
        } finally {
            setIsUpdating(false);
        }
    };

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

    const initials = generateAvatarInitials(document.owner.name, document.owner.email);
    const avatarColor = generateAvatarColor(document.owner.email);
    const profileImage = document.owner.avatar_url ? document.owner.avatar_url : null;
    const altText = document.owner.name;
    const name = document.owner.name;
    const email = document.owner.email;

    return (
        <>
            <div className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <ReusableAdminProfileCard document={document} userDetails={{ profileImage, altText, name, email, initials, avatarColor }} />
                <div className="p-6 space-y-4">
                    {/* View Content Button */}
                    {document.content && (
                        <div className="pt-4 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={() => setShowContentDialog(true)}
                                className="w-full"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Content
                            </Button>
                        </div>
                    )}
                </div>

                {/* Action Buttons - Only show for pending review */}
                {document.status === "review" && (
                    <div className="p-6 pt-0 flex gap-3">
                        <Button
                            variant={"default"}
                            onClick={() => setShowApproveDialog(true)}
                            disabled={isUpdating}
                            className="flex-1 bg-green-500 light:bg-green-400 hover:bg-green-400 text-white dark:text-black"
                        >
                            Approve
                        </Button>
                        <Button
                            onClick={() => setShowRejectDialog(true)}
                            disabled={isUpdating}
                            variant="destructive"
                            className="flex-1"
                        >
                            Reject
                        </Button>
                    </div>
                )}
            </div>

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Document?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will approve "{document.description || "Untitled Document"}" and make it visible to all users.
                            This action can be reversed later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApprove}
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isUpdating ? "Approving..." : "Approve"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Document?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will reject "{document.description || "Untitled Document"}". The submitter will be notified.
                            This action can be reversed later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReject}
                            disabled={isUpdating}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isUpdating ? "Rejecting..." : "Reject"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
