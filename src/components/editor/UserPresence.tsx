"use client";

interface User {
    name: string;
    color: string;
}

interface UserPresenceProps {
    users: User[];
    maxCursorsToShow?: number; // Optional: Limit cursors shown for performance
}

/**
 * ✅ OPTIMIZATION 4: Hide cursors based on user count
 * - ≤4 users: Show all cursors/avatars
 * - 5-8 users: Show names only
 * - >8 users: Show presence count only
 */
export function UserPresence({ users, maxCursorsToShow }: UserPresenceProps) {
    if (users.length === 0) return null;

    const userCount = users.length;

    // For >8 users: Show count only
    if (userCount > 8) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                    {userCount} collaborators online
                </span>
            </div>
        );
    }

    // For 5-8 users: Show names only (no avatars)
    if (userCount >= 5 && userCount <= 8) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                    {users.slice(0, 3).map(u => u.name).join(", ")}
                    {userCount > 3 && ` +${userCount - 3} more`}
                </span>
            </div>
        );
    }

    // For ≤4 users: Show all avatars
    const displayCount = maxCursorsToShow !== undefined ? Math.min(maxCursorsToShow, userCount) : Math.min(5, userCount);

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
                {userCount} other{userCount !== 1 ? "s" : ""} editing
            </span>
            <div className="flex -space-x-2">
                {users.slice(0, displayCount).map((user, index) => (
                    <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-medium text-white"
                        style={{ backgroundColor: user.color }}
                        title={user.name}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                ))}
                {userCount > displayCount && (
                    <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        +{userCount - displayCount}
                    </div>
                )}
            </div>
        </div>
    );
}
