import Link from "next/link";
import { BookOpen, Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-14 items-center justify-between px-6">
                <Link href="/docs" className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold">Developer Docs</span>
                </Link>
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                        <a
                            href="https://github.com/Eyepatch5263/dev-docs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    );
}
