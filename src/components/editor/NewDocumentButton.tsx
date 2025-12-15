"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Topic options
const TOPICS = [
    { value: "ai-ml", label: "AI/ML" },
    { value: "networking", label: "Networking" },
    { value: "operating-systems", label: "Operating Systems" },
    { value: "devops", label: "DevOps" },
    { value: "dbms", label: "DBMS" },
    { value: "system-design", label: "System Design" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "web", label: "Web" },
];

// Category options
const CATEGORIES = [
    { value: "introduction", label: "Introduction" },
    { value: "core-concepts-terminologies", label: "Core Concepts & Terminologies" },
    { value: "architecture-components", label: "Architecture & Components" },
    { value: "building-blocks", label: "Building Blocks" },
    { value: "design-patterns", label: "Design Patterns" },
    { value: "workflow-execution", label: "Workflow and Execution" },
    { value: "scalability-performance", label: "Scalability and Performance" },
    { value: "security-safety", label: "Security and Safety" },
    { value: "case-studies", label: "Case Studies" },
    { value: "common-pitfalls", label: "Common Pitfalls" },
    { value: "summary", label: "Summary" },
];

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
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState("system-design");
    const [category, setCategory] = useState("introduction");
    const [title, setTitle] = useState("");

    const handleCreateDocument = () => {
        const userName = session?.user?.name || session?.user?.email || "anonymous";
        const documentId = generateDocumentId(userName);

        // Store metadata in localStorage for the editor to pick up
        localStorage.setItem("inNewDocument", "true");
        localStorage.setItem(`doc_title_${documentId}`, topic);
        localStorage.setItem(`doc_subtitle_${documentId}`, title || "Untitled Document");
        localStorage.setItem(`doc_category_${documentId}`, category);

        setOpen(false);
        router.push(`/collaborative-editor/${documentId}`);
    };

    const selectBaseClass = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size={size}
                    variant={variant}
                    className={`gap-2 ${className}`}
                >
                    {children || "New Document"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                    <DialogDescription>
                        Set up your document details. You can edit these later.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Topic Selection */}
                    <div className="grid gap-2">
                        <label htmlFor="topic" className="text-sm font-medium">
                            Topic
                        </label>
                        <select
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className={selectBaseClass}
                        >
                            {TOPICS.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Selection */}
                    <div className="grid gap-2">
                        <label htmlFor="category" className="text-sm font-medium">
                            Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={selectBaseClass}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Document Title */}
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Document Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., CDN, DNS, Load Balancer..."
                            className={`${selectBaseClass} placeholder:text-muted-foreground`}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateDocument}>
                        Create Document
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
