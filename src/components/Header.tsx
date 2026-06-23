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

export function Header({
  children,
  githubHidden = true,
  forceShow = false,
}: HeaderProps) {
  const pathname = usePathname();

  // List of routes where the global header should be hidden when rendered without children
  const hiddenRoutes = [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
    "/verify-email",
  ];
  const shouldHide = hiddenRoutes.includes(pathname);

  if (shouldHide && !children && !forceShow) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent">
      {/* Responsive SVG Curved Background & Border */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <svg
          className="w-full h-full text-zinc-200 dark:text-zinc-800/60 fill-white dark:fill-black/95 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L1440,0 L1440,54 Q720,64 0,54 Z" />
          <path
            d="M0,54 Q720,64 1440,54"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="flex h-20 items-center justify-between px-6 md:px-10">
        {/* Left side: Mobile Sidebar toggle and Brand Logo */}
        <div className="flex items-center gap-4">
          {children}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
          >
            {/* Custom Logo with Invert support in light mode */}
            <img
              src="/explain.png"
              alt="Logo"
              className="h-5.5 w-10 filter invert dark:invert-0 drop-shadow-[0_0_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]"
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative flex items-center h-full text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "text-zinc-950 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-2 left-0 right-0 h-[2.5px] bg-zinc-800 dark:bg-zinc-200 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.12)] dark:shadow-[0_0_8px_rgba(255,255,255,0.35)]" />
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
              <Separator
                orientation="vertical"
                className="mx-1.5 h-4 bg-border/65"
              />
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 hover:bg-accent rounded-full"
              >
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

          <Separator
            orientation="vertical"
            className="mx-1.5 h-4 bg-border/65"
          />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
