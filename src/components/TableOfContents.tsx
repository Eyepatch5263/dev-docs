"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Heading } from "@/lib/toc";

interface TableOfContentsProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    if (headings.length === 0) {
        return null;
    }

    return (
        <aside className="hidden xl:block w-[10%] min-w-[180px] shrink-0 pr-4">
            <div className="sticky top-14">
                <ScrollArea className="h-[calc(100vh-3.5rem)] py-6 pl-2">
                    <div className="space-y-2 border-l border-border pl-4">
                        <p className="text-sm font-medium text-foreground">On This Page</p>
                        <ul className="space-y-2 text-sm">
                            {headings.map((heading) => (
                                <li key={heading.id}>
                                    <a
                                        href={`#${heading.id}`}
                                        className={cn(
                                            "block text-muted-foreground transition-colors hover:text-foreground",
                                            heading.level === 3 && "pl-4"
                                        )}
                                    >
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ScrollArea>
            </div>
        </aside>
    );
}
