"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useCallback } from "react";
import { DocumentActions } from "@/components/editor/DocumentActions";
import { convertToMDX } from "@/lib/mdx-converter";
import { DocumentTitleInput } from "@/components/editor/DocumentTitleInput";

// Type for editor content methods
interface EditorContent {
    getHTML: () => string;
    getJSON: () => Record<string, unknown>;
}

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

    // Ref to store editor content methods
    const getContentRef = useRef<EditorContent | null>(null);

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

    // Callback to receive editor methods
    const handleEditorReady = useCallback((content: EditorContent) => {
        getContentRef.current = content;
    }, []);

    // Get content as MDX for saving to database
    const getContent = useCallback(() => {
        if (!getContentRef.current) return "";
        const json = getContentRef.current.getJSON();
        // Convert ProseMirror JSON to MDX (cast through unknown for type safety)
        return convertToMDX(json as unknown as Parameters<typeof convertToMDX>[0]);
    }, []);

    // Get topic from localStorage (stored as title for backward compatibility)
    const getTopic = useCallback(() => {
        return localStorage.getItem(`doc_title_${documentId}`) || documentTitle;
    }, [documentId, documentTitle]);

    // Get subtitle (document title) from localStorage
    const getSubtitle = useCallback(() => {
        return localStorage.getItem(`doc_subtitle_${documentId}`) || "";
    }, [documentId]);

    // Get category from localStorage
    const getCategory = useCallback(() => {
        return localStorage.getItem(`doc_category_${documentId}`) || "introduction";
    }, [documentId]);

    const handleSaveSuccess = (status: "draft" | "review") => {
        console.log(`Document saved as ${status}`);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Document Actions Bar - only show when loaded and is owner */}
            {!isLoading && isOwner && (
                <div className="flex justify-between px-4 py-2 border-b border-border bg-background/50">
                    {/* Document Title Input */}
                    <DocumentTitleInput documentId={documentId} />
                    <DocumentActions
                        documentId={documentId}
                        isOwner={isOwner}
                        getContent={getContent}
                        getTopic={getTopic}
                        getSubtitle={getSubtitle}
                        getCategory={getCategory}
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
