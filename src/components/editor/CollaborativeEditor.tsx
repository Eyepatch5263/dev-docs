"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useState, useCallback } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { UserPresence } from "./UserPresence";

interface CollaborativeEditorProps {
    documentId: string;
    userName?: string;
    userColor?: string;
}

// Generate a random color for cursor
function getRandomColor() {
    const colors = [
        "#f87171", "#fb923c", "#fbbf24", "#a3e635",
        "#34d399", "#22d3d8", "#60a5fa", "#a78bfa",
        "#f472b6", "#e879f9",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// WebSocket server URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:1234";

// Inner editor component - only rendered when ydoc and provider are guaranteed to exist
function TiptapEditorInner({
    ydoc,
    provider,
    userName,
    color,
}: {
    ydoc: Y.Doc;
    provider: WebsocketProvider;
    userName: string;
    color: string;
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isConnected, setIsConnected] = useState(provider.wsconnected);
    const [connectedUsers, setConnectedUsers] = useState<Array<{ name: string; color: string }>>([]);

    useEffect(() => {
        provider.awareness.setLocalStateField("user", {
            name: userName,
            color: color,
        });

        const handleStatus = ({ status }: { status: string }) => {
            setIsConnected(status === "connected");
        };

        const handleAwarenessChange = () => {
            const states = provider.awareness.getStates();
            const users: Array<{ name: string; color: string }> = [];
            states.forEach((state, clientId) => {
                if (clientId !== provider.awareness.clientID && state.user) {
                    users.push(state.user);
                }
            });
            setConnectedUsers(users);
        };

        provider.on("status", handleStatus);
        provider.awareness.on("change", handleAwarenessChange);
        handleAwarenessChange();

        return () => {
            provider.off("status", handleStatus);
            provider.awareness.off("change", handleAwarenessChange);
        };
    }, [provider, userName, color]);

    const handleUpdate = useCallback(() => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date());
        }, 1000);
    }, []);

    // Create editor with guaranteed non-null ydoc and provider
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                undoRedo: false,
            }),
            Placeholder.configure({
                placeholder: "Start writing your content here...",
                emptyEditorClass: "is-editor-empty",
            }),
            Highlight.configure({ multicolor: true }),
            Typography,
            Collaboration.configure({
                document: ydoc,
            }),
            CollaborationCursor.configure({
                provider: provider,
                user: { name: userName, color: color },
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6",
            },
        },
        onUpdate: handleUpdate,
    });

    return (
        <div className="flex flex-col h-full">
            <EditorToolbar editor={editor} />

            <div className="flex items-center justify-between px-4 py-2 border-b border-border text-sm">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`} />
                        <span className="text-muted-foreground">
                            {isConnected ? "Connected" : "Connecting..."}
                        </span>
                    </span>

                    {connectedUsers.length > 0 && (
                        <UserPresence users={connectedUsers} />
                    )}
                </div>

                <div className="text-muted-foreground">
                    {isSaving ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Saving...
                        </span>
                    ) : lastSaved ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Saved
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-card">
                <EditorContent editor={editor} className="h-full" />
            </div>
        </div>
    );
}

// Main component - handles Yjs initialization
export function CollaborativeEditor({
    documentId,
    userName = "Anonymous",
    userColor,
}: CollaborativeEditorProps) {
    const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
    const [provider, setProvider] = useState<WebsocketProvider | null>(null);
    const [color] = useState(() => userColor || getRandomColor());

    useEffect(() => {
        if (typeof window === "undefined") return;

        const doc = new Y.Doc();
        const prov = new WebsocketProvider(WS_URL, documentId, doc);

        setYdoc(doc);
        setProvider(prov);

        return () => {
            // Clear local awareness state before disconnecting
            // This tells other clients to remove this user
            prov.awareness.setLocalState(null);
            prov.disconnect();
            prov.destroy();
            doc.destroy();
        };
    }, [documentId]);

    // Loading state - do NOT render editor until ydoc and provider exist
    if (!ydoc || !provider) {
        return (
            <div className="animate-pulse">
                <div className="h-12 bg-muted rounded-lg mb-4" />
                <div className="h-[500px] bg-muted rounded-lg" />
            </div>
        );
    }

    // Only render TiptapEditorInner when we have valid ydoc and provider
    return (
        <TiptapEditorInner
            ydoc={ydoc}
            provider={provider}
            userName={userName}
            color={color}
        />
    );
}
