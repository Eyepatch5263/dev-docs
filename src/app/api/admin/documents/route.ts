import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

// GET - Fetch all documents for admin review
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const userIsAdmin = await isAdmin(session.user.id);
        if (!userIsAdmin) {
            return NextResponse.json(
                { error: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Database connection not available" },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "review";

        // Build query
        let query = supabaseAdmin
            .from("documents")
            .select(`
                id,
                document_id,
                title,
                topic,
                category,
                status,
                content,
                created_at,
                updated_at,
                reviewed_by,
                reviewed_at,
                owner:users!owner_id (
                    id,
                    name,
                    email,
                    avatar_url
                )
            `);

        // Filter by status
        if (status === "all") {
            // For "all", exclude drafts - only show submitted documents
            query = query.in("status", ["review", "approved", "rejected"]);
        } else if (status !== "all") {
            // For specific status, filter normally
            query = query.eq("status", status);
        }

        // Order by updated_at descending
        query = query.order("updated_at", { ascending: false });

        // Execute query
        const { data: documents, error } = await query;

        if (error) {
            console.error("Error fetching documents:", error);
            return NextResponse.json(
                { error: "Failed to fetch documents" },
                { status: 500 }
            );
        }

        return NextResponse.json({ documents });
    } catch (error) {
        console.error("Admin documents list error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
