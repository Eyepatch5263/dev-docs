"use client";

import { usePathname } from "next/navigation";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ShareButton() {
    const pathname = usePathname();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${pathname}`;

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
