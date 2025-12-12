"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavCategory } from "@/app/types/nav.type";

interface MobileSidebarProps {
    navigation: NavCategory[];
    basePath: string;
    topicTitle: string;
}

export function MobileSidebar({ navigation, basePath, topicTitle }: MobileSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Track which categories are expanded
    const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        navigation.forEach((category) => {
            const hasActiveItem = category.items.some(
                (item) => pathname === `${basePath}/${item.slug}`
            );
            initial[category.name] = hasActiveItem;
        });
        return initial;
    });

    const toggleCategory = (name: string) => {
        setExpanded((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-100 bg-black/50 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar drawer */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-110 w-72 border-r border-border transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                style={{ backgroundColor: 'var(--sidebar-bg, #ffffff)' }}
            >
                <div className="absolute inset-0 bg-white dark:bg-zinc-900" />
                {/* Header */}
                <div className="relative flex items-center justify-between h-14 px-4 border-b border-border bg-white dark:bg-zinc-900">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{topicTitle}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={closeSidebar}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close menu</span>
                    </Button>
                </div>

                {/* Navigation */}
                <ScrollArea className="relative h-[calc(100vh-3.5rem)] py-4 bg-white dark:bg-zinc-900">
                    <nav className="px-3 space-y-1">
                        {navigation.map((category) => {
                            const isExpanded = expanded[category.name];
                            const hasActiveItem = category.items.some(
                                (item) => pathname === `${basePath}/${item.slug}`
                            );

                            return (
                                <div key={category.name} className="space-y-1">
                                    <button
                                        onClick={() => toggleCategory(category.name)}
                                        className={cn(
                                            "flex items-center justify-between w-full px-2 py-2 text-sm font-medium rounded-md transition-colors",
                                            hasActiveItem
                                                ? "text-foreground"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}
                                    >
                                        <span>{category.name}</span>
                                        <ChevronRight
                                            className={cn(
                                                "h-4 w-4 transition-transform duration-200",
                                                isExpanded && "rotate-90"
                                            )}
                                        />
                                    </button>

                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-200",
                                            isExpanded ? "max-h-1000px opacity-100" : "max-h-0 opacity-0"
                                        )}
                                    >
                                        <ul className="ml-2 pl-2 border-l border-border space-y-1 py-1">
                                            {category.items.map((item) => {
                                                const href = `${basePath}/${item.slug}`;
                                                const isActive = pathname === href;

                                                return (
                                                    <li key={item.slug}>
                                                        <Link
                                                            href={href}
                                                            onClick={closeSidebar}
                                                            className={cn(
                                                                "block rounded-md px-2 py-1.5 text-sm transition-colors",
                                                                isActive
                                                                    ? "bg-accent text-accent-foreground font-medium"
                                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                            )}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </ScrollArea>
            </aside>
        </>
    );
}
