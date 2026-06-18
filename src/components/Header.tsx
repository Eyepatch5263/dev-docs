"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@/components/auth/UserButton";
import { Inria_Sans } from "next/font/google";

interface HeaderProps {
    children?: React.ReactNode;
    githubHidden?: boolean;
    forceShow?: boolean;
}

const Inria_Sans_Font = Inria_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-inria-sans",
});

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Flashcards", href: "/flashcards" },
    { label: "Engineering Terms", href: "/engineering-terms" },
    { label: "Collaborative Editor", href: "/collaborative-editor" },
];

export function Header({ children, githubHidden = true, forceShow = false }: HeaderProps) {
    const pathname = usePathname();

    // List of routes where the global header should be hidden when rendered without children
    const hiddenRoutes = ["/", "/signin", "/signup", "/forgot-password", "/verify-email"];
    const shouldHide = hiddenRoutes.includes(pathname);

    if (shouldHide && !children && !forceShow) return null;

    return (
        <header className="sticky top-0 z-40 w-full">
            <div className="flex h-16 items-center justify-between px-6 md:px-10">
                {/* Left side: Mobile Sidebar toggle and Brand Logo */}
                <div className="flex items-center gap-4">
                    {children}
                    <Link href="/" className="flex items-center gap-2.5 group transition-opacity hover:opacity-90">
                        {/* Custom 4-pointed Sparkle/Star SVG Logo */}
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5.5 w-5.5 text-foreground fill-current transition-transform group-hover:scale-105"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 3 Q12 12 3 12 Q12 12 12 21 Q12 12 21 12 Q12 12 12 3 Z" />
                        </svg>
                        <span className={`${Inria_Sans_Font.className} text-base font-semibold tracking-tight text-foreground`}>
                            Explainbytes
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 h-full">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`relative flex items-center h-full text-[13px] font-medium transition-colors ${
                                    isActive 
                                        ? "text-foreground" 
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>{link.label}</span>
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side: Actions (Theme, Github, User Profile) */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    
                    {!githubHidden && (
                        <>
                            <Separator orientation="vertical" className="mx-1.5 h-4 bg-border/65" />
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-accent rounded-full">
                                <a
                                    href="https://github.com/Eyepatch5263/dev-docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                    <span className="sr-only">GitHub</span>
                                </a>
                            </Button>
                        </>
                    )}
                    
                    <Separator orientation="vertical" className="mx-1.5 h-4 bg-border/65" />
                    <UserButton />
                </div>
            </div>
        </header>
    );
}
