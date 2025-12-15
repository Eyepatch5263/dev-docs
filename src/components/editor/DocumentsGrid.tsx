"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { NewDocumentButton } from "@/components/editor/NewDocumentButton";
import { DocumentCard } from "@/components/editor/DocumentCard";

interface Document {
    id: string;
    document_id: string;
    title: string | null;
    topic: string | null;
    category: string | null;
    status: string;
    updated_at: string;
}

interface DocumentsGridProps {
    initialDocuments: Document[];
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
        draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    const labels: Record<string, string> = {
        draft: "Draft",
        review: "In Review",
        approved: "Approved",
        rejected: "Rejected",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
            {labels[status] || "Draft"}
        </span>
    );
}

export function DocumentsGrid({ initialDocuments }: DocumentsGridProps) {
    const [documents, setDocuments] = useState(initialDocuments);

    const handleDelete = (documentId: string) => {
        setDocuments(documents.filter(doc => doc.id !== documentId));
    };

    if (documents.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-6">
                    Create your first document to get started
                </p>
                <NewDocumentButton />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
                <DocumentCard
                    key={doc.id}
                    doc={doc}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    onDelete={() => handleDelete(doc.id)}
                />
            ))}

            {/* Create New Card */}
            <NewDocumentButton
                variant="ghost"
                className="h-full min-h-[180px] p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 transition-all duration-200 group"
            >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-lg text-muted-foreground group-hover:text-primary transition-colors">
                    Create New Document
                </span>
            </NewDocumentButton>
        </div>
    );
}
