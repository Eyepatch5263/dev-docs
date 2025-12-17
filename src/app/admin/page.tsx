"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SubmissionCard from "@/components/admin/SubmissionCard";
import AdminStats from "@/components/admin/AdminStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldAlert, FileText } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { adminBgColor } from "@/constants/admin";

type TabType = "review" | "approved" | "rejected" | "all";

// Fetch function for documents
async function fetchDocuments(tab: TabType) {
    const response = await fetch(`/api/admin/documents?status=${tab}`);
    const data = await response.json();

    if (response.status === 403) {
        throw new Error("FORBIDDEN");
    }

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch documents");
    }

    return data.documents || [];
}

// Update document status function
async function updateDocumentStatus(id: string, status: "approved" | "rejected") {
    const response = await fetch(`/api/admin/documents/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update document");
    }

    return data;
}

export default function AdminDashboard() {
    const { status } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>("review");

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/signin?callbackUrl=/admin");
        }
    }, [status, router]);

    // Fetch documents for all tabs using TanStack Query
    const reviewQuery = useQuery({
        queryKey: ["admin-documents", "review"],
        queryFn: () => fetchDocuments("review"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    const approvedQuery = useQuery({
        queryKey: ["admin-documents", "approved"],
        queryFn: () => fetchDocuments("approved"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    const rejectedQuery = useQuery({
        queryKey: ["admin-documents", "rejected"],
        queryFn: () => fetchDocuments("rejected"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    const allQuery = useQuery({
        queryKey: ["admin-documents", "all"],
        queryFn: () => fetchDocuments("all"),
        enabled: status === "authenticated",
        staleTime: 30 * 1000,
    });

    // Mutation for updating document status
    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
            updateDocumentStatus(id, status),
        onSuccess: (variables) => {
            toast.success(`Document ${variables.status} successfully`);
            // Invalidate all document queries to refetch
            queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
        },
        onError: (error) => {
            console.error("Error updating document:", error);
            toast.error("Failed to update document status");
        },
    });

    // Handle status update
    const handleStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
        updateMutation.mutate({ id, status: newStatus });
    };

    // Check if user is admin based on query errors
    const isAdmin = !reviewQuery.error || (reviewQuery.error as Error).message !== "FORBIDDEN";
    const loading = status === "loading" || (reviewQuery.isLoading && approvedQuery.isLoading && rejectedQuery.isLoading && allQuery.isLoading);

    // Get documents for each tab
    const documents = {
        review: reviewQuery.data || [],
        approved: approvedQuery.data || [],
        rejected: rejectedQuery.data || [],
        all: allQuery.data || [],
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    // Access denied state
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You don't have permission to access the admin dashboard. Please contact an administrator if you believe this is an error.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <QueryProvider>
            <div className="min-h-screen bg-background">
                <Header githubHidden={true} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                                <p className="text-muted-foreground">Manage and review submitted documents</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <AdminStats
                        pendingCount={documents.review.length}
                        approvedCount={documents.approved.length}
                        rejectedCount={documents.rejected.length}
                        totalCount={documents.all.length}
                    />

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
                        <TabsList className="flex justify-between w-full mb-6">
                            {(["review", "approved", "rejected", "all"] as TabType[]).map((tab) => (
                                <TabsTrigger className="capitalize" key={tab} value={tab}>
                                    {tab}
                                    {documents[tab].length > 0 && (
                                        <span className={`md:ml-2 px-2 py-0.5 hidden md:block  text-white text-xs rounded-full ${adminBgColor[tab]}`}>
                                            {documents[tab].length}
                                        </span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Tab Content */}
                        {(["review", "approved", "rejected", "all"] as TabType[]).map((tab) => (
                            <TabsContent key={tab} value={tab} className="space-y-6">
                                {documents[tab].length === 0 ? (
                                    <div className="text-center py-16 bg-card border border-border rounded-xl">
                                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            No {tab === "review" ? "pending" : tab === "all" ? "" : tab} documents
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {tab === "review"
                                                ? "All caught up! No documents waiting for review."
                                                : tab === "all"
                                                    ? "No documents have been submitted yet."
                                                    : `No documents have been ${tab} yet.`}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {documents[tab].map((doc: any) => (
                                            <SubmissionCard
                                                key={doc.id}
                                                document={doc}
                                                onStatusUpdate={handleStatusUpdate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </QueryProvider>
    )

}
