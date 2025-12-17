"use client";

import { useState } from "react";
import { Send, Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DocumentActionsProps {
    documentId: string;
    isOwner: boolean;
    getContent: () => string;
    getTopic: () => string;
    getTitle: () => string;
    getDescription: () => string;
    getCategory: () => string;
    onSaveSuccess?: (status: "draft" | "review") => void;
}

export function DocumentActions({
    documentId,
    isOwner,
    getContent,
    getTopic,
    getTitle,
    getDescription,
    getCategory,
    onSaveSuccess,
}: DocumentActionsProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [lastAction, setLastAction] = useState<"draft" | "review" | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: "", description: "" });

    const showDialog = (title: string, description: string) => {
        setDialogContent({ title, description });
        setDialogOpen(true);
    };

    const saveDocument = async (status: "draft" | "review") => {
        setIsSaving(true);
        setSaveStatus("idle");
        setLastAction(status);

        try {
            const content = getContent();
            const topic = getTopic();
            const title = getTitle();
            const description = getDescription();
            const category = getCategory();

            const response = await fetch("/api/documents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentId,
                    title,
                    description,
                    topic,
                    category,
                    content,
                    status,
                    isOriginalOwner: isOwner, // Pass ownership flag to API
                }),
            });

            if (!response.ok) {
                const data = await response.json();

                // Check if this is a permission error for review submission
                if (status === "review" && (
                    data.error?.includes('original document creator') ||
                    data.error?.includes('submit for review')
                )) {
                    showDialog(
                        "Permission Denied",
                        "Only the original document creator can submit for review.\n\nYou can save your own draft copy, but cannot submit the original document for review."
                    );
                    setSaveStatus("idle");
                    return;
                }

                throw new Error(data.error || "Failed to save document");
            }


            const responseData = await response.json();

            // If this was a fork, redirect to the new document
            if (responseData.isFork && responseData.newDocumentId) {
                const topic = getTopic();
                const category = getCategory();
                const docTitle = getTitle();
                const docDescription = getDescription();

                // Build URL with metadata and loadFromDb flag
                const url = new URL(`/collaborative-editor/${responseData.newDocumentId}`, window.location.origin);
                if (topic) url.searchParams.set('topic', topic);
                if (category) url.searchParams.set('category', category);
                if (docTitle) url.searchParams.set('title', docTitle);
                if (docDescription) url.searchParams.set('description', docDescription);
                url.searchParams.set('loadFromDb', 'true'); // Tell editor to load content from database

                showDialog(
                    "Document Forked!",
                    "Your own copy has been created. You'll be redirected to your forked document in a moment..."
                );

                // Redirect after a short delay to let user see the message
                setTimeout(() => {
                    window.location.href = url.toString();
                }, 2000);
                return;
            }

            setSaveStatus("success");
            onSaveSuccess?.(status);

            // Reset success status after 3 seconds
            setTimeout(() => {
                setSaveStatus("idle");
            }, 3000);
        } catch (error) {
            console.error("Save error:", error);
            setSaveStatus("error");
            setTimeout(() => {
                setSaveStatus("idle");
            }, 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <TooltipProvider>
                <div className="flex items-center gap-2">
                    {/* Save as Draft */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => saveDocument("draft")}
                                disabled={isSaving}
                            >
                                {isSaving && lastAction === "draft" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : saveStatus === "success" && lastAction === "draft" ? (
                                    <Check className="h-4 w-4 text-emerald-500" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span className="hidden sm:inline">Save Draft</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Save as draft (only you can see this)</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Submit for Review - Only show for owners */}
                    {isOwner && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => saveDocument("review")}
                                    disabled={isSaving}
                                >
                                    {isSaving && lastAction === "review" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : saveStatus === "success" && lastAction === "review" ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    <span className="hidden sm:inline">Submit for Review</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Submit document for admin review</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {/* Error indicator */}
                    {saveStatus === "error" && (
                        <span className="text-sm text-destructive">
                            Failed to save
                        </span>
                    )}
                </div>
            </TooltipProvider>

            {/* Dialog for notifications */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogContent.title}</DialogTitle>
                        <DialogDescription className="whitespace-pre-line">
                            {dialogContent.description}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
