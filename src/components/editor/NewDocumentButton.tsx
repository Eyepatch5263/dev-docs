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

import { TOPICS, CATEGORIES } from "@/constants/editor";

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
    children
}: NewDocumentButtonProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState("system-design");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("introduction");
    const [description, setDescription] = useState("");

    const handleCreateDocument = () => {
        const userName = session?.user?.name || session?.user?.email || "anonymous";
        const documentId = generateDocumentId(userName);

        // Store metadata in localStorage for the editor to pick up
        localStorage.setItem("inNewDocument", "true");
        localStorage.setItem(`doc_topic_${documentId}`, topic);
        localStorage.setItem(`doc_title_${documentId}`, title || "Untitled Document");
        localStorage.setItem(`doc_description_${documentId}`, description || "");
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

                    {/* Title */}
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Database Design"
                            className={`${selectBaseClass} placeholder:text-muted-foreground`}
                        />
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Description
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Getting started with Database Design.."
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
