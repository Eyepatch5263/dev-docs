"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useState, useCallback } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { UserPresence } from "./UserPresence";

// Create lowlight instance with JavaScript and TypeScript only
const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("js", javascript);
lowlight.register("typescript", typescript);
lowlight.register("ts", typescript);

interface EditorContent {
    getHTML: () => string;
    getJSON: () => Record<string, unknown>;
}

interface CollaborativeEditorProps {
    documentId: string;
    userName?: string;
    userColor?: string;
    isNewDocument?: boolean;
    onEditorReady?: (content: EditorContent) => void;
    onContentChange?: (json: Record<string, unknown>) => void;
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
    onEditorReady,
    onContentChange,
}: {
    ydoc: Y.Doc;
    provider: WebsocketProvider;
    userName: string;
    color: string;
    onEditorReady?: (content: EditorContent) => void;
    onContentChange?: (json: Record<string, unknown>) => void;
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

    const handleUpdate = useCallback(({ editor: ed }: { editor: { getJSON: () => Record<string, unknown> } }) => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date());
        }, 1000);

        // Notify parent of content change for preview
        if (onContentChange) {
            onContentChange(ed.getJSON());
        }
    }, [onContentChange]);

    // Create editor with guaranteed non-null ydoc and provider
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                undoRedo: false,
                codeBlock: false, // Disable default, use CodeBlockLowlight instead
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'typescript',
                enableTabIndentation: true,
            }),
            Placeholder.configure({
                placeholder: "Start writing your content here...",
                emptyEditorClass: "is-editor-empty",
            }),
            Highlight.configure({ multicolor: true }),
            Typography,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
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
                class: "tiptap prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6",
                spellcheck: "false",
            },
        },
        onUpdate: handleUpdate,
    });

    // Expose editor methods to parent via callback
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady({
                getHTML: () => editor.getHTML(),
                getJSON: () => editor.getJSON() as Record<string, unknown>,
            });
        }
    }, [editor, onEditorReady]);

    // Load content from database if loadFromDb flag is set (for forked documents)
    useEffect(() => {
        if (!editor) return;

        const documentId = provider.roomname;
        const shouldLoad = localStorage.getItem(`loadFromDb_${documentId}`);

        if (shouldLoad === 'true') {
            console.log('Loading forked document content from database...');

            // Fetch content from API
            fetch(`/api/documents/${documentId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.document && data.document.content) {
                        // Wait for Yjs to be ready, then set content
                        setTimeout(() => {
                            try {
                                editor.commands.setContent(data.document.content);
                                console.log('Forked document content loaded successfully');
                            } catch (err) {
                                console.error('Failed to set content:', err);
                            }
                        }, 500);
                    }
                    // Clear the flag so we don't load again
                    localStorage.removeItem(`loadFromDb_${documentId}`);
                })
                .catch(error => {
                    console.error('Failed to load content from database:', error);
                    localStorage.removeItem(`loadFromDb_${documentId}`);
                });
        }
    }, [editor, provider.roomname]);

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
    onEditorReady,
    onContentChange,
}: CollaborativeEditorProps) {
    const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
    const [provider, setProvider] = useState<WebsocketProvider | null>(null);
    const [color] = useState(() => userColor || getRandomColor());
    const [roomFullError, setRoomFullError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const doc = new Y.Doc();
        const prov = new WebsocketProvider(WS_URL, documentId, doc);

        // Listen for WebSocket close events (room full rejection)
        prov.ws?.addEventListener('close', (event: CloseEvent) => {
            if (event.code === 4000) {
                setRoomFullError(event.reason || 'Room is full. Maximum collaborators reached.');
            }
        });

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

    // Show error UI if room is full
    if (roomFullError) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                    <svg
                        className="h-8 w-8 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-destructive mb-2">Room Full</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                    {roomFullError}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                    This document has reached its maximum number of collaborators.
                    Please try again later or create a new document.
                </p>
                <div className="flex gap-4">
                    <a
                        href="/collaborative-editor"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Create New Document
                    </a>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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
            onEditorReady={onEditorReady}
            onContentChange={onContentChange}
        />
    );
}
