"use client";

interface User {
    name: string;
    color: string;
}

interface UserPresenceProps {
    users: User[];
}

export function UserPresence({ users }: UserPresenceProps) {
    if (users.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
                {users.length} other{users.length !== 1 ? "s" : ""} editing
            </span>
            <div className="flex -space-x-2">
                {users.slice(0, 5).map((user, index) => (
                    <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-medium text-white"
                        style={{ backgroundColor: user.color }}
                        title={user.name}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                ))}
                {users.length > 5 && (
                    <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        +{users.length - 5}
                    </div>
                )}
            </div>
        </div>
    );
}
