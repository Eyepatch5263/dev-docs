import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { rateLimitMiddleware } from "@/app/middleware/rateLimit";
import { formatCategoryName, formatTopicName } from "@/constants/editor";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { READ_RATE_LIMIT, WRITE_RATE_LIMIT } from "@/lib/rate-limit-config";

export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimitMiddleware(request, WRITE_RATE_LIMIT);
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
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      documentId,
      title,
      description,
      topic,
      category,
      content,
      status,
      isOriginalOwner,
    } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses = ["draft", "review", "approved", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if document exists with this document_id and user is the owner
    const existingDocRes = await db.query<{
      id: string;
      owner_id: string;
      document_id: string;
    }>(
      "SELECT id, owner_id, document_id FROM documents WHERE document_id = $1 AND owner_id = $2 LIMIT 1",
      [documentId, session.user.id],
    );
    const existingDoc = existingDocRes.rows[0];

    // Determine if this should be a fork based on client-provided ownership
    const isFork = !isOriginalOwner;

    // For 'review' status, only the original document owner can submit
    if (status === "review" && isFork) {
      return NextResponse.json(
        { error: "Only the original document creator can submit for review" },
        { status: 403 },
      );
    }

    if (existingDoc) {
      // User's document exists - update it
      let updatedDoc;
      try {
        const updateRes = await db.query<any>(
          `UPDATE documents 
                     SET title = $1, description = $2, topic = $3, category = $4, content = $5, status = $6, updated_at = NOW() 
                     WHERE id = $7 
                     RETURNING *`,
          [
            title || "Untitled Document",
            description || "",
            formatTopicName(topic || "system-design"),
            formatCategoryName(category || "introduction"),
            content,
            status || "draft",
            existingDoc.id,
          ],
        );
        updatedDoc = updateRes.rows[0];
      } catch (updateError) {
        console.error("Error updating document:", updateError);
        return NextResponse.json(
          { error: "Failed to update document" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          message: "Document updated successfully",
          document: updatedDoc,
          isFork: false,
        },
        {
          headers: rateLimitResult.headers,
        },
      );
    } else {
      // Create new document
      // If this is a fork, generate a new document_id
      const newDocumentId = isFork
        ? `${session.user.name?.toLowerCase().replace(/\s+/g, "_") || "user"}_${Math.random().toString(36).substring(2, 15)}`
        : documentId;

      let newDoc;
      try {
        const insertRes = await db.query<any>(
          `INSERT INTO documents (document_id, owner_id, title, description, topic, category, content, status) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                     RETURNING *`,
          [
            newDocumentId,
            session.user.id,
            title || "Untitled Document",
            description || "",
            formatTopicName(topic || "system-design"),
            formatCategoryName(category || "introduction"),
            content,
            status || "draft",
          ],
        );
        newDoc = insertRes.rows[0];
      } catch (createError) {
        console.error("Error creating document:", createError);
        return NextResponse.json(
          { error: "Failed to create document" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          message: isFork
            ? "Document forked successfully"
            : "Document created successfully",
          document: newDoc,
          isFork: isFork,
          newDocumentId: isFork ? newDocumentId : undefined,
        },
        {
          status: 201,
          headers: rateLimitResult.headers,
        },
      );
    }
  } catch (error) {
    console.error("Document save error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

// GET - List user's documents
export async function GET(request: NextRequest) {
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let documents;
    try {
      let sql = `SELECT id, document_id, title, description, topic, content, category, status, created_at, updated_at 
                       FROM documents 
                       WHERE owner_id = $1`;
      const params: any[] = [session.user.id];

      if (status) {
        sql += ` AND status = $2`;
        params.push(status);
      }

      sql += ` ORDER BY updated_at DESC`;

      const res = await db.query(sql, params);
      documents = res.rows;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { documents },
      {
        headers: rateLimitResult.headers,
      },
    );
  } catch (error) {
    console.error("Document list error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
