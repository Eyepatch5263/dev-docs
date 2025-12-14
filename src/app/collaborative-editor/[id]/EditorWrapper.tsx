"use client";

import dynamic from "next/dynamic";

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
    return (
        <CollaborativeEditor
            documentId={documentId}
            userName={userName}
        />
    );
}
