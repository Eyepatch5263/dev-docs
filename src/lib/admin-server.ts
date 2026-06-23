import { db } from "./db";

/**
 * Check if a user has admin role
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const res = await db.query<{ role: string }>(
      "SELECT role FROM users WHERE id = $1 LIMIT 1",
      [userId],
    );

    if (res.rows.length === 0) {
      return false;
    }

    return res.rows[0].role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
