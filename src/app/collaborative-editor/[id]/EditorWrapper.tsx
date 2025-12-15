"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
}

export function EditorWrapper({ documentId, userName }: EditorWrapperProps) {
    const [isNewDocument, setIsNewDocument] = useState(false);

    useEffect(() => {
        // Check localStorage for new document flag (set by NewDocumentButton)
        const isNew = localStorage.getItem("inNewDocument") === "true";
        if (isNew) {
            setIsNewDocument(true);
            // Clear the flag after reading
            localStorage.removeItem("inNewDocument");
        }
    }, []);

    return (
        <CollaborativeEditor
            documentId={documentId}
            userName={userName}
            isNewDocument={isNewDocument}
        />
    );
}
