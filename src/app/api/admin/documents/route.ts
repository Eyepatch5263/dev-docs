import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { rateLimitMiddleware } from "@/app/middleware/rateLimit";
import { isAdmin } from "@/lib/admin-server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { READ_RATE_LIMIT } from "@/lib/rate-limit-config";

// GET - Fetch all documents for admin review
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

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "review";

    let documents;
    try {
      let sql = `SELECT d.id, d.document_id, d.title, d.description, d.topic, d.category, d.status, d.content, d.created_at, d.updated_at, d.reviewed_by, d.reviewed_at,
                              json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'avatar_url', u.avatar_url) as owner
                       FROM documents d
                       LEFT JOIN users u ON d.owner_id = u.id`;
      const params: any[] = [];

      if (status === "all") {
        sql += ` WHERE d.status IN ('review', 'approved', 'rejected')`;
      } else {
        sql += ` WHERE d.status = $1`;
        params.push(status);
      }

      sql += ` ORDER BY d.updated_at DESC`;

      const res = await db.query(sql, params);
      documents = res.rows;
    } catch (error) {
      console.error("Error fetching documents for admin:", error);
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
    console.error("Admin documents list error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
