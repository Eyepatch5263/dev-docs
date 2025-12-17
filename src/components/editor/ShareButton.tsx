"use client";

import { usePathname } from "next/navigation";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ShareButtonProps {
    documentId: string;
}

export function ShareButton({ documentId }: ShareButtonProps) {
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);
    const [metadata, setMetadata] = useState({ topic: "", category: "", description: "" });

    useEffect(() => {
        // Read metadata from localStorage
        const topic = localStorage.getItem(`doc_title_${documentId}`) || "";
        const category = localStorage.getItem(`doc_category_${documentId}`) || "";
        const description = localStorage.getItem(`doc_subtitle_${documentId}`) || "";

        setMetadata({ topic, category, description });
    }, [documentId]);

    const handleShare = async () => {
        // Build URL with metadata as query params
        const url = new URL(`${window.location.origin}${pathname}`);

        if (metadata.topic) url.searchParams.set('topic', metadata.topic);
        if (metadata.category) url.searchParams.set('category', metadata.category);
        if (metadata.description) url.searchParams.set('title', metadata.description);

        const shareUrl = url.toString();

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    return (
        <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon-sm"
            onClick={handleShare}
            title={copied ? "Copied!" : "Copy share link"}
        >
            <Link2 className={`h-4 w-4 ${copied ? 'text-emerald-500' : ''}`} />
        </Button>
    );
}
