import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH - Update document status (approve/reject)
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

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

        const { status } = await request.json();

        // Validate status
        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status. Must be 'approved' or 'rejected'" },
                { status: 400 }
            );
        }

        // Update document status
        console.log("Updating document status:", id);
        const { data: updatedDoc, error: updateError } = await supabaseAdmin
            .from("documents")
            .update({
                status,
                reviewed_by: session.user.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select(`
                id,
                document_id,
                title,
                topic,
                category,
                status,
                updated_at,
                reviewed_by,
                reviewed_at,
                owner:users!owner_id (
                    id,
                    name,
                    email,
                    avatar_url
                )
            `)
            .single();

        if (updateError) {
            console.error("Error updating document:", updateError);
            return NextResponse.json(
                { error: "Failed to update document" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: `Document ${status} successfully`,
            document: updatedDoc,
        });
    } catch (error) {
        console.error("Admin document update error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
