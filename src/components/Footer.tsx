"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-transparent py-6">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-xs font-medium text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Explain Bytes. All rights reserved.
          </div>

          {/* Social Links & Theme Toggle */}
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/Eyepatch5263"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4.5 h-4.5" />
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
