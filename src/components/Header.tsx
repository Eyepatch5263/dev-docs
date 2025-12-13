import Link from "next/link";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Inria_Sans } from "next/font/google";
interface HeaderProps {
    children?: React.ReactNode;
}

const Inria_Sans_Font = Inria_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-inria-sans",
});

export function Header({ children }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-18 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    {children}
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Explainbytes logo" className="h-8 w-8" />
                        <span className={`${Inria_Sans_Font.className} text-xl font-semibold`}>Explainbytes</span>
                    </Link>
                </div>
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
