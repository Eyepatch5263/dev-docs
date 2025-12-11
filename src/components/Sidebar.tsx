"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NavCategory } from "@/lib/docs";

interface SidebarProps {
    navigation: NavCategory[];
}

export function Sidebar({ navigation }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 border-r border-border">
            <ScrollArea className="h-[calc(100vh-3.5rem)] py-6">
                <nav className="px-4 space-y-6">
                    {navigation.map((category) => (
                        <div key={category.name}>
                            <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight text-foreground">
                                {category.name}
                            </h3>
                            <ul className="space-y-1">
                                {category.items.map((item) => {
                                    const href = `/docs/${item.slug}`;
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
                    ))}
                </nav>
            </ScrollArea>
        </aside>
    );
}
