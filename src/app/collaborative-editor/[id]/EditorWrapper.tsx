"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useCallback } from "react";
import { DocumentActions } from "@/components/editor/DocumentActions";

// Dynamically import the editor to avoid SSR issues with Yjs
const CollaborativeEditor = dynamic(
    () => import("@/components/editor/CollaborativeEditor").then((mod) => mod.CollaborativeEditor),
    {
        ssr: false,
        loading: () => (
            <div className="animate-pulse p-4">
                <div className="h-12 bg-muted rounded-lg mb-4" />
                <div className="h-[500px] bg-muted rounded-lg" />
            </div>
        ),
    }
);

interface EditorWrapperProps {
    documentId: string;
    userName: string;
    userId: string;
}

export function EditorWrapper({ documentId, userName, userId }: EditorWrapperProps) {
    const [isNewDocument, setIsNewDocument] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [documentTitle, setDocumentTitle] = useState("Untitled Document");

    // Ref to store getContent function from editor
    const getContentRef = useRef<(() => string) | null>(null);

    useEffect(() => {
        // Check localStorage for new document flag (set by NewDocumentButton)
        const isNew = localStorage.getItem("inNewDocument") === "true";
        if (isNew) {
            setIsNewDocument(true);
            setIsOwner(true); // Creator is always the owner
            setIsLoading(false);
            // Clear the flag after reading
            localStorage.removeItem("inNewDocument");
            return;
        }

        // Check document ownership
        const checkOwnership = async () => {
            try {
                const response = await fetch(`/api/documents/${documentId}`);
                const data = await response.json();

                if (data.document) {
                    setIsOwner(data.isOwner);
                    if (data.document.title) {
                        setDocumentTitle(data.document.title);
                    }
                } else {
                    // Document doesn't exist in DB yet - current user becomes owner
                    setIsOwner(true);
                }
            } catch (error) {
                console.error("Failed to check ownership:", error);
                // Default to owner if we can't check
                setIsOwner(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkOwnership();
    }, [documentId]);

    // Callback to receive getContent from editor
    const handleEditorReady = useCallback((getContent: () => string) => {
        getContentRef.current = getContent;
    }, []);

    // Get content for saving
    const getContent = useCallback(() => {
        return getContentRef.current?.() || "";
    }, []);

    // Get title from localStorage or state
    const getTitle = useCallback(() => {
        return localStorage.getItem(`doc_title_${documentId}`) || documentTitle;
    }, [documentId, documentTitle]);

    // Get subtitle from localStorage
    const getSubtitle = useCallback(() => {
        return localStorage.getItem(`doc_subtitle_${documentId}`) || "";
    }, [documentId]);

    const handleSaveSuccess = (status: "draft" | "review") => {
        console.log(`Document saved as ${status}`);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Document Actions Bar - only show when loaded and is owner */}
            {!isLoading && isOwner && (
                <div className="flex justify-end px-4 py-2 border-b border-border bg-background/50">
                    <DocumentActions
                        documentId={documentId}
                        isOwner={isOwner}
                        getContent={getContent}
                        getTitle={getTitle}
                        getSubtitle={getSubtitle}
                        onSaveSuccess={handleSaveSuccess}
                    />
                </div>
            )}

            {/* Editor */}
            <div className="flex-1">
                <CollaborativeEditor
                    documentId={documentId}
                    userName={userName}
                    isNewDocument={isNewDocument}
                    onEditorReady={handleEditorReady}
                />
            </div>
        </div>
    );
}
