"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Generate a unique document ID from username and timestamp
function generateDocumentId(userName: string): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 8);
    const userPart = userName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
    return `${userPart}_${timestamp.toString(36)}_${randomPart}`;
}

interface NewDocumentButtonProps {
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "outline" | "ghost";
    className?: string;
    showIcon?: boolean;
    children?: React.ReactNode;
}

export function NewDocumentButton({
    size = "lg",
    variant = "default",
    className = "",
    showIcon = true,
    children
}: NewDocumentButtonProps) {
    const router = useRouter();
    const { data: session } = useSession();

    const handleCreateDocument = () => {
        const userName = session?.user?.name || session?.user?.email || "anonymous";
        const documentId = generateDocumentId(userName);
        localStorage.setItem("inNewDocument", "true");
        localStorage.setItem("newDocumentTitle", "New Document");
        router.push(`/collaborative-editor/${documentId}`);
    };

    return (
        <Button
            size={size}
            variant={variant}
            className={`gap-2 ${className}`}
            onClick={() => handleCreateDocument()}
        >
            {children || "New Document"}
        </Button>
    );
}
