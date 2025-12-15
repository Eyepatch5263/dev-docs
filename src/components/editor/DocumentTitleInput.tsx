"use client";

import { useEffect, useState, useRef } from "react";

interface DocumentTitleInputProps {
    documentId: string;
}

export function DocumentTitleInput({ documentId }: DocumentTitleInputProps) {
    const hasInitialized = useRef(false);

    // Initialize title synchronously to catch localStorage before React strict mode double-runs
    const [title, setTitle] = useState(() => {
        if (typeof window !== "undefined") {
            const storedTitle = localStorage.getItem("newDocumentTitle");
            if (storedTitle) {
                // Don't clear here - we'll clear in useEffect
                return storedTitle;
            }
        }
        // Fallback: format documentId as title
        return documentId
            .replace(/_/g, " ")
            
            .replace(/\b\w/g, (char) => char.toUpperCase());
    });

    useEffect(() => {
        // Clear localStorage only once
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            localStorage.removeItem("newDocumentTitle");
        }
    }, []);

    return (
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-none outline-none font-semibold text-lg focus:ring-0 w-full max-w-md"
            placeholder="Document title..."
        />
    );
}

