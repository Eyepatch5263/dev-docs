import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// POST - Create or update a document
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

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

        const { documentId, title, topic, category, content, status } = await request.json();

        if (!documentId) {
            return NextResponse.json(
                { error: "Document ID is required" },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ["draft", "review", "approved", "rejected"];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        // Check if document exists
        const { data: existingDoc } = await supabaseAdmin
            .from("documents")
            .select("id, owner_id, document_id")
            .eq("document_id", documentId)
            .eq("owner_id", session.user.id) // Check for user's own copy
            .single();

        // Also check if there's an original document (for ownership verification)
        const { data: originalDoc } = await supabaseAdmin
            .from("documents")
            .select("owner_id")
            .eq("document_id", documentId)
            .order("created_at", { ascending: true })
            .limit(1)
            .single();

        // For 'review' status, only the original document owner can submit
        if (status === "review" && originalDoc && originalDoc.owner_id !== session.user.id) {
            return NextResponse.json(
                { error: "Only the original document creator can submit for review" },
                { status: 403 }
            );
        }

        if (existingDoc) {
            // User's document exists - update it
            const { data: updatedDoc, error: updateError } = await supabaseAdmin
                .from("documents")
                .update({
                    title: title || "Untitled Document",
                    topic: topic || "system-design",
                    category: category || "introduction",
                    content,
                    status: status || "draft",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existingDoc.id)
                .select()
                .single();

            if (updateError) {
                console.error("Error updating document:", updateError);
                return NextResponse.json(
                    { error: "Failed to update document" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                message: "Document updated successfully",
                document: updatedDoc,
            });
        } else {
            // Create new document (user's copy/fork)
            const { data: newDoc, error: createError } = await supabaseAdmin
                .from("documents")
                .insert({
                    document_id: documentId,
                    owner_id: session.user.id,
                    title: title || "Untitled Document",
                    topic: topic || "system-design",
                    category: category || "introduction",
                    content,
                    status: status || "draft",
                })
                .select()
                .single();

            if (createError) {
                console.error("Error creating document:", createError);
                return NextResponse.json(
                    { error: "Failed to create document" },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                message: "Document created successfully",
                document: newDoc,
            }, { status: 201 });
        }
    } catch (error) {
        console.error("Document save error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

// GET - List user's documents
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        let query = supabaseAdmin
            .from("documents")
            .select("id, document_id, title, topic, category, status, created_at, updated_at")
            .eq("owner_id", session.user.id)
            .order("updated_at", { ascending: false });

        if (status) {
            query = query.eq("status", status);
        }

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
        console.error("Document list error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
