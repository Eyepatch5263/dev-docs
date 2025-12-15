"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, useCallback } from "react";
import { DocumentActions } from "@/components/editor/DocumentActions";
import { convertToMDX } from "@/lib/mdx-converter";
import { DocumentTitleInput } from "@/components/editor/DocumentTitleInput";
import { MDXPreview } from "@/components/editor/MDXPreview";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    const [showPreview, setShowPreview] = useState(true);
    const [mdxContent, setMdxContent] = useState("");
    const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor"); // For mobile tabs

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
        // Get initial content for preview
        const json = content.getJSON();
        setMdxContent(convertToMDX(json as unknown as Parameters<typeof convertToMDX>[0]));
    }, []);

    // Handle content changes for live preview
    const handleContentChange = useCallback((json: Record<string, unknown>) => {
        const mdx = convertToMDX(json as unknown as Parameters<typeof convertToMDX>[0]);
        setMdxContent(mdx);
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
                <div className="flex justify-between items-center px-4 py-2 border-b border-border bg-background/50">
                    {/* Document Title Input */}
                    <DocumentTitleInput documentId={documentId} />

                    <div className="flex items-center gap-2">
                        {/* Preview Toggle - Desktop only */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="gap-2 hidden lg:flex"
                        >
                            {showPreview ? (
                                <>
                                    <EyeOff className="h-4 w-4" />
                                    Hide Preview
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4" />
                                    Show Preview
                                </>
                            )}
                        </Button>

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
                </div>
            )}

            {/* Mobile Tabs - shown only on mobile */}
            <div className="lg:hidden flex border-b border-border bg-muted/30">
                <button
                    onClick={() => setActiveTab("editor")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "editor"
                            ? "text-foreground border-b-2 border-primary bg-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Editor
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "preview"
                            ? "text-foreground border-b-2 border-primary bg-background"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Preview
                </button>
            </div>

            {/* Editor and Preview Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor - Desktop: side-by-side, Mobile: tab-based */}
                <div className={`
                    ${showPreview ? 'lg:w-1/2' : 'w-full'} 
                    ${activeTab === "editor" ? 'block' : 'hidden lg:block'}
                    overflow-auto border-r border-border transition-all
                `}>
                    <CollaborativeEditor
                        documentId={documentId}
                        userName={userName}
                        isNewDocument={isNewDocument}
                        onEditorReady={handleEditorReady}
                        onContentChange={handleContentChange}
                    />
                </div>

                {/* Preview Panel - Desktop: side-by-side, Mobile: tab-based */}
                {showPreview && (
                    <div className={`
                        lg:w-1/2 w-full
                        ${activeTab === "preview" ? 'block' : 'hidden lg:block'}
                        overflow-hidden bg-background
                    `}>
                        <MDXPreview content={mdxContent} className="h-full" />
                    </div>
                )}
            </div>
        </div>
    );
}
