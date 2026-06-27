import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { rateLimitMiddleware } from "@/app/middleware/rateLimit";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { READ_RATE_LIMIT, WRITE_RATE_LIMIT } from "@/lib/rate-limit-config";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get document by document_id
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request, READ_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        },
      );
    }

    const session = await getServerSession(authOptions);
    const { id: documentId } = await params;

    let document;
    try {
      const res = await db.query<any>(
        `SELECT d.*, 
                        json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'avatar_url', u.avatar_url) as owner
                 FROM documents d
                 LEFT JOIN users u ON d.owner_id = u.id
                 WHERE d.document_id = $1
                 LIMIT 1`,
        [documentId],
      );
      document = res.rows[0];
    } catch (dbError) {
      console.error("Database error fetching document:", dbError);
      return NextResponse.json(
        { error: "Database connection or query failed" },
        { status: 500 },
      );
    }

    if (!document) {
      // Document doesn't exist yet - that's okay
      return NextResponse.json({
        document: null,
        isOwner: false,
      });
    }

    // Check if current user is the owner
    const isOwner = session?.user?.id === document.owner_id;

    return NextResponse.json(
      {
        document: {
          id: document.id,
          documentId: document.document_id,
          title: document.title,
          description: document.description,
          content: document.content,
          status: document.status,
          createdAt: document.created_at,
          updatedAt: document.updated_at,
          owner: document.owner,
        },
        isOwner,
      },
      {
        headers: rateLimitResult.headers,
      },
    );
  } catch (error) {
    console.error("Document fetch error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a document (owner only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(
      request,
      WRITE_RATE_LIMIT,
    );
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        },
      );
    }

    const session = await getServerSession(authOptions);
    const { id: documentId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if document exists and user is owner
    let document;
    try {
      const docRes = await db.query<any>(
        "SELECT id, owner_id FROM documents WHERE document_id = $1 LIMIT 1",
        [documentId],
      );
      document = docRes.rows[0];
    } catch (dbError) {
      console.error("Database error finding document:", dbError);
      return NextResponse.json(
        { error: "Database query failed" },
        { status: 500 },
      );
    }

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    if (document.owner_id !== session.user.id) {
      return NextResponse.json(
        { error: "Only the document owner can delete this document" },
        { status: 403 },
      );
    }

    try {
      await db.query("DELETE FROM documents WHERE id = $1", [document.id]);
    } catch (deleteError) {
      console.error("Error deleting document:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Document deleted successfully",
      },
      {
        headers: rateLimitResult.headers,
      },
    );
  } catch (error) {
    console.error("Document delete error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
