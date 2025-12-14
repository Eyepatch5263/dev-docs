import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Plus, FileText, Clock, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { NewDocumentButton } from "@/components/editor/NewDocumentButton";

export const metadata = {
    title: "Collaborative Editor - Explainbytes",
    description: "Create and collaborate on documents in real-time",
};

// Mock data
const mockDocuments = [
    {
        id: "1",
        title: "Introduction to Distributed Systems",
        updatedAt: "2024-12-14T10:30:00Z",
        status: "draft",
        collaborators: 2,
    },
    {
        id: "2",
        title: "Database Indexing Strategies",
        updatedAt: "2024-12-13T15:45:00Z",
        status: "pending_review",
        collaborators: 1,
    },
     {
        id: "3",
        title: "Introduction to Distributed",
        updatedAt: "2024-12-14T10:30:00Z",
        status: "draft",
        collaborators: 3,
    },
];

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
        draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        pending_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    const labels: Record<string, string> = {
        draft: "Draft",
        pending_review: "Pending Review",
        approved: "Approved",
        rejected: "Rejected",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
            {labels[status] || "Draft"}
        </span>
    );
}

// If no session exist redirect to signin
export default async function CollaborativeEditorPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/signin?callbackUrl=/collaborative-editor");
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header githubHidden={true} />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
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
                        <NewDocumentButton size="lg" />
                    </div>
                </div>

                {/* Documents Grid */}
                {mockDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockDocuments.map((doc) => (
                            <Link
                                key={doc.id}
                                href={`/collaborative-editor/${doc.id}`}
                                className="group"
                            >
                                <div className="relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200">
                                    {/* Document Icon */}
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {doc.title}
                                    </h3>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatDate(doc.updatedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4" />
                                            <span>{doc.collaborators}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    {getStatusBadge(doc.status)}

                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            </Link>
                        ))}

                        {/* Create New Card */}
                        <NewDocumentButton
                            variant="ghost"
                            className="h-full min-h-[200px] p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-3 transition-all duration-200 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                Create New Document
                            </span>
                        </NewDocumentButton>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No documents yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Create your first document and start collaborating
                        </p>
                        <NewDocumentButton size="lg">
                            Create Your First Document
                        </NewDocumentButton>
                    </div>
                )}
            </main>
        </div>
    );
}
