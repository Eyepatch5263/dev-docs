import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EditorWrapper } from "./EditorWrapper";
import { DocumentTitleInput } from "@/components/editor/DocumentTitleInput";
import { ShareButton } from "@/components/editor/ShareButton";

interface DocumentPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DocumentPageProps) {
    let { id } = await params;
    return {
        title: `Editing Document - Explainbytes`,
        description: `Collaborative editing document ${id}`,
    };
}

export default async function DocumentEditorPage({ params }: DocumentPageProps) {
    const session = await getServerSession(authOptions);

    // If no session exist redirect to signin
    if (!session) {
        redirect("/signin?callbackUrl=/collaborative-editor");
    }

    const { id } = await params;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
                <div className="flex h-14 items-center justify-between px-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                        <Link href="/collaborative-editor">
                            <Button variant="ghost" size="icon-sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>

                        
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Collaborators */}
                        <div className="flex items-center gap-1 mr-2">
                            
                            <div className="flex -space-x-2">
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-7 w-7 rounded-full border-2 border-background"
                                    />
                                ) : (
                                    <div className="h-7 w-7 rounded-full bg-primary border-2 border-background flex items-center justify-center text-primary-foreground text-xs font-medium">
                                        {session.user?.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>
                            <Button variant="ghost" size="icon-sm" title="View collaborators">
                                <Users className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Share Link */}
                        <ShareButton />
                    </div>
                </div>
            </header>

            {/* Editor */}
            <main className="flex-1 flex flex-col">
                <EditorWrapper
                    documentId={id}
                    userName={session.user?.name || "Anonymous"}
                    userId={session.user?.id || ""}
                />
            </main>
        </div>
    );
}
