import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { rateLimitMiddleware } from "@/app/middleware/rateLimit";
import { isAdmin } from "@/lib/admin-server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { WRITE_RATE_LIMIT } from "@/lib/rate-limit-config";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH - Update document status (approve/reject)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;

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

    const { status } = await request.json();

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'approved' or 'rejected'" },
        { status: 400 },
      );
    }

    let updatedDoc;
    try {
      const updateRes = await db.query<any>(
        `WITH updated AS (
                     UPDATE documents 
                     SET status = $1, reviewed_by = $2, reviewed_at = NOW() 
                     WHERE id = $3 
                     RETURNING *
                 )
                 SELECT u.*, 
                        json_build_object('id', usr.id, 'name', usr.name, 'email', usr.email, 'avatar_url', usr.avatar_url) as owner
                 FROM updated u
                 LEFT JOIN users usr ON u.owner_id = usr.id`,
        [status, session.user.id, id],
      );
      updatedDoc = updateRes.rows[0];
    } catch (updateError) {
      console.error("Error updating document:", updateError);
      return NextResponse.json(
        { error: "Failed to update document" },
        { status: 500 },
      );
    }

    if (!updatedDoc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    // If approved, commit MDX file to GitHub
    if (status === "approved" && updatedDoc) {
      try {
        const { generateMDXFile, generateFilePath } = await import(
          "@/lib/mdx-generator"
        );
        const { commitFileToGitHub, generateSlugFromTitle } = await import(
          "@/lib/github"
        );

        // Prepare metadata for MDX generation
        const metadata = {
          description: updatedDoc.description || "Untitled Document",
          topic: updatedDoc.topic || "system-design",
          category: updatedDoc.category || "introduction",
          content: updatedDoc.content || "",
        };

        // Generate MDX file content
        const mdxContent = generateMDXFile(metadata);

        // Generate slug and file path
        const slug = generateSlugFromTitle(metadata.description);
        const filePath = generateFilePath(metadata.topic, slug);

        // Commit to GitHub
        const commitMessage = `Add: ${metadata.description}`;
        await commitFileToGitHub(filePath, mdxContent, commitMessage);

        console.log(`Successfully committed MDX file to GitHub: ${filePath}`);
      } catch (githubError) {
        // Log error but don't fail the approval
        console.error(
          "GitHub commit error (approval still successful):",
          githubError,
        );
        // Optionally: Store error in database or notify admin
      }
    }

    return NextResponse.json(
      {
        message: `Document ${status} successfully`,
        document: updatedDoc,
      },
      {
        headers: rateLimitResult.headers,
      },
    );
  } catch (error) {
    console.error("Admin document update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
