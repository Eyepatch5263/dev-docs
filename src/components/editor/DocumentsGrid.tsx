"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { NewDocumentButton } from "@/components/editor/NewDocumentButton";
import { DocumentCard } from "@/components/editor/DocumentCard";
import { DocumentsGridProps } from "@/app/types/editor.type";
import { labels, styles } from "@/constants/editor";

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const MAX_DOCUMENTS = Number(process.env.MAX_DOCUMENTS) || 6;

function getStatusBadge(status: string) {
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
            {labels[status] || "Draft"}
        </span>
    );
}

export function DocumentsGrid({ initialDocuments }: DocumentsGridProps) {
    const [documents, setDocuments] = useState(initialDocuments);
    const docSize = documents.length
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
        <div>
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
                {docSize < MAX_DOCUMENTS && (
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
                )}
            </div>
            {docSize==MAX_DOCUMENTS && (
                <div
                    className="h-full cursor-not-allowed mt-5 min-h-[180px] p-6 rounded-xl border-2 border-dashed border-red-500/80 flex flex-col items-center justify-center gap-3 transition-all duration-200 group"
                >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center transition-colors">
                        <FileText className="h-6 w-6 text-red-500/80"   />
                    </div>
                    <span className="text-lg text-red-500/80 transition-colors">
                        Max Documents Reached
                    </span>
                </div>
            )}
        </div>

    );
}
