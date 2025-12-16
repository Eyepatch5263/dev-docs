import { supabaseAdmin } from "./supabase";

/**
 * Check if a user has admin role
 */
export async function isAdmin(userId: string): Promise<boolean> {
    if (!supabaseAdmin) {
        return false;
    }

    try {
        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

        if (error || !user) {
            return false;
        }

        return user.role === "admin";
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}

/**
 * Generate user avatar initials from name or email
 */
export function generateAvatarInitials(name?: string, email?: string): string {
    if (name) {
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    if (email) {
        return email.substring(0, 2).toUpperCase();
    }

    return "??";
}

/**
 * Generate avatar background color based on email/name
 */
export function generateAvatarColor(identifier: string): string {
    const colors = [
        "bg-linear-to-br from-blue-500 to-blue-600",
        "bg-linear-to-br from-purple-500 to-purple-600",
        "bg-linear-to-br from-pink-500 to-pink-600",
        "bg-linear-to-br from-green-500 to-green-600",
        "bg-linear-to-br from-yellow-500 to-yellow-600",
        "bg-linear-to-br from-red-500 to-red-600",
        "bg-linear-to-br from-indigo-500 to-indigo-600",
        "bg-linear-to-br from-teal-500 to-teal-600",
    ];

    // Generate consistent color based on string
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
        hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
        return "just now";
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 30) {
        return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
        return date.toLocaleDateString();
    }
}
