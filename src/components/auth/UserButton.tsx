"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserButton() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Loading state
    if (status === "loading") {
        return (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        );
    }

    // Not authenticated
    if (!session?.user) {
        return (
            <Button asChild variant="default" size="sm">
                <Link href="/signin">Sign in</Link>
            </Button>
        );
    }

    // Get user initials for avatar fallback
    const getInitials = (name: string | null | undefined): string => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {session.user.image ? (
                    <img
                        src={session.user.image}
                        alt={session.user.name || "User avatar"}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {getInitials(session.user.name)}
                    </div>
                )}
                <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-popover p-2 shadow-lg z-50"
                    >
                        {/* User Info */}
                        <div className="px-3 py-2 border-b border-border mb-2">
                            <p className="font-medium text-sm truncate">{session.user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {session.user.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                            >
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Profile</span>
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                            >
                                <Settings className="h-4 w-4 text-muted-foreground" />
                                <span>Settings</span>
                            </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-border mt-2 pt-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    signOut({ callbackUrl: "/" });
                                }}
                                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors w-full text-left text-destructive hover:text-destructive"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
