"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Document } from "@/app/types/editor.type";
import UserDocumentCard from "@/components/profile/UserDocumentCard";
import UserStats from "@/components/profile/UserStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { profileBgColor } from "@/constants/admin";

type TabType = "draft" | "review" | "approved" | "rejected";

// Fetch function for user documents
async function fetchUserDocuments(tab: TabType) {
    const response = await fetch(`/api/documents?status=${tab}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch documents");
    }

    return data.documents || [];
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("draft");

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin?callbackUrl=/profile");
        }
    }, [status, router]);

    // Fetch documents for all tabs using TanStack Query
    const draftQuery = useQuery({
        queryKey: ["user-documents", "draft"],
        queryFn: () => fetchUserDocuments("draft"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    const reviewQuery = useQuery({
        queryKey: ["user-documents", "review"],
        queryFn: () => fetchUserDocuments("review"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    const approvedQuery = useQuery({
        queryKey: ["user-documents", "approved"],
        queryFn: () => fetchUserDocuments("approved"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    const rejectedQuery = useQuery({
        queryKey: ["user-documents", "rejected"],
        queryFn: () => fetchUserDocuments("rejected"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    // Get documents for each tab
    const documents = {
        draft: draftQuery.data || [],
        review: reviewQuery.data || [],
        approved: approvedQuery.data || [],
        rejected: rejectedQuery.data || [],
    };

    const loading = status === "loading" || (draftQuery.isLoading && reviewQuery.isLoading && approvedQuery.isLoading && rejectedQuery.isLoading);

    // Loading state
    if (loading) {
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
                        {Object.entries(profileBgColor).map(([key, value]) => {
                            const tabKey = key as TabType;
                            return (
                                <TabsTrigger className="capitalize" key={tabKey} value={tabKey}>
                                    {tabKey}
                                    {documents[tabKey].length > 0 && (
                                        <span className={`ml-2 px-2 py-0.5 text-white text-xs rounded-full ${value}`}>
                                            {documents[tabKey].length}
                                        </span>
                                    )}
                                </TabsTrigger>
                            );
                        })}
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
                                    {documents[tab].map((doc: Document) => (
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
