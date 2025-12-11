"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NavCategory } from "@/lib/docs";

interface SidebarProps {
    navigation: NavCategory[];
    basePath: string;
}

export function Sidebar({ navigation, basePath }: SidebarProps) {
    const pathname = usePathname();

    // Track which categories are expanded
    const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
        // By default, expand the category that contains the current page
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

    return (
        <aside className="w-[18%] min-w-[200px] shrink-0 border-r border-border">
            <ScrollArea className="h-[calc(100vh-3.5rem)] py-6">
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

                                {/* Collapsible content */}
                                <div
                                    className={cn(
                                        "overflow-hidden transition-all duration-200",
                                        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
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
    );
}
