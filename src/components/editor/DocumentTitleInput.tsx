"use client";

import { useEffect, useState, useRef } from "react";

interface DocumentTitleInputProps {
    documentId: string;
}

export function DocumentTitleInput({ documentId }: DocumentTitleInputProps) {
    const hasInitialized = useRef(false);
    const titleStorageKey = `doc_title_${documentId}`;
    const subtitleStorageKey = `doc_subtitle_${documentId}`;

    // Initialize title
    const [title, setTitle] = useState(() => {
        if (typeof window !== "undefined") {
            const docTitle = localStorage.getItem(titleStorageKey);
            if (docTitle) return docTitle;
            const storedTitle = localStorage.getItem("newDocumentTitle");
            if (storedTitle) return storedTitle;
        }
        return documentId
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    });

    // Initialize subtitle
    const [subtitle, setSubtitle] = useState(() => {
        if (typeof window !== "undefined") {
            const docSubtitle = localStorage.getItem(subtitleStorageKey);
            if (docSubtitle) return docSubtitle;
        }
        return "";
    });

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            localStorage.removeItem("newDocumentTitle");
            localStorage.setItem(titleStorageKey, title);
            if (subtitle) {
                localStorage.setItem(subtitleStorageKey, subtitle);
            }
        }
    }, [titleStorageKey, subtitleStorageKey, title, subtitle]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        localStorage.setItem(titleStorageKey, newTitle);
    };

    const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSubtitle = e.target.value;
        setSubtitle(newSubtitle);
        localStorage.setItem(subtitleStorageKey, newSubtitle);
    };

    return (
        <div className="flex flex-col">
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="bg-transparent border-none outline-none font-semibold text-lg focus:ring-0 w-full max-w-md"
                placeholder="Topic (e.g., System Design)..."
            />
            <input
                type="text"
                value={subtitle}
                onChange={handleSubtitleChange}
                className="bg-transparent border-none outline-none text-sm text-muted-foreground focus:ring-0 w-full max-w-md"
                placeholder="Subtopic (e.g., DNS)..."
            />
        </div>
    );
}
