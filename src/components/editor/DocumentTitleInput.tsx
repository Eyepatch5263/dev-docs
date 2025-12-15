"use client";

import { useEffect, useState, useRef } from "react";

// Topic display labels
const TOPIC_LABELS: Record<string, string> = {
    "ai-ml": "AI/ML",
    "networking": "Networking",
    "operating-systems": "Operating Systems",
    "devops": "DevOps",
    "dbms": "DBMS",
    "system-design": "System Design",
    "cybersecurity": "Cybersecurity",
    "web": "Web",
};

// Category display labels
const CATEGORY_LABELS: Record<string, string> = {
    "introduction": "Introduction",
    "core-concepts-terminologies": "Core Concepts & Terminologies",
    "architecture-components": "Architecture & Components",
    "building-blocks": "Building Blocks",
    "design-patterns": "Design Patterns",
    "workflow-execution": "Workflow and Execution",
    "scalability-performance": "Scalability and Performance",
    "security-safety": "Security and Safety",
    "case-studies": "Case Studies",
    "common-pitfalls": "Common Pitfalls",
    "summary": "Summary",
};

interface DocumentTitleInputProps {
    documentId: string;
}

export function DocumentTitleInput({ documentId }: DocumentTitleInputProps) {
    const hasInitialized = useRef(false);
    const topicStorageKey = `doc_title_${documentId}`;
    const subtitleStorageKey = `doc_subtitle_${documentId}`;
    const categoryStorageKey = `doc_category_${documentId}`;

    const [topic, setTopic] = useState("system-design");
    const [subtitle, setSubtitle] = useState("Untitled Document");
    const [category, setCategory] = useState("introduction");

    useEffect(() => {
        if (!hasInitialized.current && typeof window !== "undefined") {
            hasInitialized.current = true;

            const storedTopic = localStorage.getItem(topicStorageKey);
            const storedSubtitle = localStorage.getItem(subtitleStorageKey);
            const storedCategory = localStorage.getItem(categoryStorageKey);

            if (storedTopic) setTopic(storedTopic);
            if (storedSubtitle) setSubtitle(storedSubtitle);
            if (storedCategory) setCategory(storedCategory);

            // Clear the new document flag
            localStorage.removeItem("inNewDocument");
        }
    }, [topicStorageKey, subtitleStorageKey, categoryStorageKey]);

    const topicLabel = TOPIC_LABELS[topic] || topic;
    const categoryLabel = CATEGORY_LABELS[category] || category;

    return (
        <div className="flex items-center gap-3">
            {/* Topic Badge */}
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {topicLabel}
            </span>

            {/* Category */}
            <span className="text-xs text-muted-foreground">
                {categoryLabel}
            </span>

            {/* Separator */}
            <span className="text-muted-foreground">/</span>

            {/* Document Title */}
            <h1 className="font-semibold text-lg">
                {subtitle}
            </h1>
        </div>
    );
}
