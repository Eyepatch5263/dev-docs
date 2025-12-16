"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Document } from "@/app/types/editor.type";
import UserDocumentCard from "@/components/profile/UserDocumentCard";
import UserStats from "@/components/profile/UserStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";

type TabType = "draft" | "review" | "approved" | "rejected";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("draft");
    const [documents, setDocuments] = useState<Record<TabType, Document[]>>({
        draft: [],
        review: [],
        approved: [],
        rejected: [],
    });
    const [loading, setLoading] = useState(true);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin?callbackUrl=/profile");
        }
    }, [status, router]);

    // Fetch documents for a specific tab
    const fetchDocuments = async (tab: TabType) => {
        try {
            const response = await fetch(`/api/documents?status=${tab}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch documents");
            }

            setDocuments((prev) => ({
                ...prev,
                [tab]: data.documents || [],
            }));
        } catch (error) {
            console.error(`Error fetching ${tab} documents:`, error);
            toast.error(`Failed to load ${tab} documents`);
        }
    };

    // Load initial data
    useEffect(() => {
        if (status === "authenticated") {
            const loadAllTabs = async () => {
                setLoading(true);
                await Promise.all([
                    fetchDocuments("draft"),
                    fetchDocuments("review"),
                    fetchDocuments("approved"),
                    fetchDocuments("rejected"),
                ]);
                setLoading(false);
            };
            loadAllTabs();
        }
    }, [status]);

    // Loading state
    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header githubHidden={true} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl capitalize font-bold text-foreground">{session?.user?.name}</h1>
                            <p className="text-muted-foreground">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <UserStats
                    draftCount={documents.draft.length}
                    pendingCount={documents.review.length}
                    approvedCount={documents.approved.length}
                    rejectedCount={documents.rejected.length}
                />

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
                    <TabsList className="flex justify-between w-full mb-6">
                        <TabsTrigger value="draft">
                            Draft
                            {documents.draft.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">
                                    {documents.draft.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="review">
                            Pending
                            {documents.review.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                                    {documents.review.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="approved">
                            Approved
                            {documents.approved.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                                    {documents.approved.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="rejected">
                            Rejected
                            {documents.rejected.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {documents.rejected.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Content */}
                    {(["draft", "review", "approved", "rejected"] as TabType[]).map((tab) => (
                        <TabsContent key={tab} value={tab} className="space-y-6">
                            {documents[tab].length === 0 ? (
                                <div className="text-center py-16 bg-card border border-border rounded-xl">
                                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        No {tab === "review" ? "pending" : tab} documents
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {tab === "draft"
                                            ? "Start creating a new document to see it here."
                                            : tab === "review"
                                                ? "Submit a document for review to see it here."
                                                : `No documents have been ${tab} yet.`}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {documents[tab].map((doc) => (
                                        <UserDocumentCard key={doc.id} document={doc} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
