'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright */}
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Explain Bytes. All rights reserved.
                    </div>

                    {/* Social Links & Theme Toggle */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="https://github.com/Eyepatch5263"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </Link>

                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </footer>
    );
}
