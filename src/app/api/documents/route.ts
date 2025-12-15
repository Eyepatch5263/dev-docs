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

        const { documentId, title, subtitle, content, status } = await request.json();

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
            .select("id, owner_id")
            .eq("document_id", documentId)
            .single();

        if (existingDoc) {
            // Document exists - check if user is owner
            if (existingDoc.owner_id !== session.user.id) {
                return NextResponse.json(
                    { error: "Only the document owner can save changes" },
                    { status: 403 }
                );
            }

            // Update existing document
            const { data: updatedDoc, error: updateError } = await supabaseAdmin
                .from("documents")
                .update({
                    title: title || "Untitled Document",
                    subtitle: subtitle || null,
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
            // Create new document
            const { data: newDoc, error: createError } = await supabaseAdmin
                .from("documents")
                .insert({
                    document_id: documentId,
                    owner_id: session.user.id,
                    title: title || "Untitled Document",
                    subtitle: subtitle || null,
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
            .select("id, document_id, title, subtitle, status, created_at, updated_at")
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
