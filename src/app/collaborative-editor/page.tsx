import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/Header";
import { supabaseAdmin } from "@/lib/supabase";
import { DocumentsGrid } from "@/components/editor/DocumentsGrid";

export const metadata = {
    title: "Collaborative Editor - Explainbytes",
    description: "Create and collaborate on documents in real-time",
};

// Fetch user's documents from Supabase
async function getUserDocuments(userId: string) {
    if (!supabaseAdmin) return [];

    const { data: documents, error } = await supabaseAdmin
        .from("documents")
        .select("id, document_id, title, topic, category, status, created_at, updated_at")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching documents:", error);
        return [];
    }

    return documents || [];
}

export default async function CollaborativeEditorPage() {
    const session = await getServerSession(authOptions);

    // If no session exist redirect to signin
    if (!session) {
        redirect("/signin?callbackUrl=/collaborative-editor");
    }

    if (!session.user?.id) {
        redirect("/signin");
    }

    // Fetch user's documents from Supabase
    const documents = await getUserDocuments(session.user.id);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-muted/30">
                <div className="container mx-auto px-4 py-10 max-w-7xl">
                    <div className="mb-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                                    Your Documents
                                </h1>
                                <p className="text-muted-foreground text-lg">
                                    Create, collaborate, and publish content in real-time
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Documents Grid */}
                    <DocumentsGrid initialDocuments={documents} />
                </div>
            </main>
        </div>
    );
}
