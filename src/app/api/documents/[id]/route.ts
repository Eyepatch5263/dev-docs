import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get document by document_id
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id: documentId } = await params;

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Database connection not available" },
                { status: 500 }
            );
        }

        const { data: document, error } = await supabaseAdmin
            .from("documents")
            .select("*, owner:users(id, name, email, avatar_url)")
            .eq("document_id", documentId)
            .single();

        if (error || !document) {
            // Document doesn't exist yet - that's okay
            return NextResponse.json({
                document: null,
                isOwner: false,
            });
        }

        // Check if current user is the owner
        const isOwner = session?.user?.id === document.owner_id;

        return NextResponse.json({
            document: {
                id: document.id,
                documentId: document.document_id,
                title: document.title,
                content: document.content,
                status: document.status,
                createdAt: document.created_at,
                updatedAt: document.updated_at,
                owner: document.owner,
            },
            isOwner,
        });
    } catch (error) {
        console.error("Document fetch error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a document (owner only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        const { id: documentId } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Database connection not available" },
                { status: 500 }
            );
        }

        // Check if document exists and user is owner
        const { data: document } = await supabaseAdmin
            .from("documents")
            .select("id, owner_id")
            .eq("document_id", documentId)
            .single();

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        if (document.owner_id !== session.user.id) {
            return NextResponse.json(
                { error: "Only the document owner can delete this document" },
                { status: 403 }
            );
        }

        const { error: deleteError } = await supabaseAdmin
            .from("documents")
            .delete()
            .eq("id", document.id);

        if (deleteError) {
            console.error("Error deleting document:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete document" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error("Document delete error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
