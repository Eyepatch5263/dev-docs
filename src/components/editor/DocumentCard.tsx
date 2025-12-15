"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DocumentCardProps {
    doc: {
        id: string;
        document_id: string;
        title: string | null;
        topic: string | null;
        category: string | null;
        status: string;
        updated_at: string;
    };
    formatDate: (date: string) => string;
    getStatusBadge: (status: string) => React.ReactNode;
    onDelete: () => void;
}

export function DocumentCard({ doc, formatDate, getStatusBadge, onDelete }: DocumentCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/documents/${doc.document_id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete document");
            }

            setDeleteDialogOpen(false);
            onDelete(); // Callback to refresh the list
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete document");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="group relative">
                <Link
                    href={`/collaborative-editor/${doc.document_id}`}
                    className="block"
                >
                    <div className="relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200">
                        {/* Topic Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
                                {doc.topic?.replace(/-/g, " ") || "System Design"}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                                {doc.category?.replace(/-/g, " ") || "Introduction"}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {doc.title || "Untitled Document"}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(doc.updated_at)}</span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        {getStatusBadge(doc.status)}

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </Link>

                {/* Delete Button - Always visible */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-background/20 backdrop-blur-sm hover:text-black dark:hover:text-white"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteDialogOpen(true);
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{doc.title || "Untitled Document"}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
