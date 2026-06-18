"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Zap,
  Code2,
  Globe,
  Layers,
  Database,
  Infinity as InfinityIcon,
  LayoutGrid,
  Box,
  Lock,
  ArrowLeft,
  X,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { EngineeringTerm } from "../../../data/sample-terms";
import { sampleTerms } from "../../../data/sample-terms";
import { TermCard } from "@/components/TermCard";
import { RateLimitError } from "@/components/ui/rate-limit-error";
import { isRateLimited, getRateLimitInfo } from "@/lib/rate-limit-utils";
import Link from "next/link";

interface SearchResponse {
  success: boolean;
  terms: EngineeringTerm[];
  total: number;
  source: "elasticsearch" | "local" | "cache";
  error?: string;
  retryAfter?: number;
}

// Custom Illustration Component
function TermsIllustration() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto aspect-5/4 flex items-center justify-center pointer-events-none select-none">
      <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-2xl">
        {/* Background ambient glow */}
        <circle
          cx="250"
          cy="200"
          r="150"
          className="fill-indigo-500/5 dark:fill-primary/5 blur-3xl"
        />

        {/* Floating Aa behind the book */}
        <text
          x="290"
          y="120"
          className="font-serif text-[110px] font-semibold fill-slate-100 dark:fill-zinc-800/60 transition-colors duration-300"
        >
          Aa
        </text>

        {/* Book Shadow */}
        <ellipse
          cx="270"
          cy="300"
          rx="140"
          ry="12"
          className="fill-slate-200/40 dark:fill-zinc-950/30 blur-md"
        />

        {/* Open Book */}
        <g className="transition-transform duration-300">
          {/* Spine / Center Page */}
          <path
            d="M 270,140 L 270,290"
            className="stroke-slate-350 dark:stroke-zinc-700"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Back Cover / Pages Depth Left */}
          <path
            d="M 120,165 C 160,160 220,170 268,143 Q 268,293 268,293 C 220,320 160,310 120,315 Z"
            className="fill-slate-100/80 dark:fill-zinc-900/80 stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="1.5"
          />
          {/* Left Page Top */}
          <path
            d="M 125,160 C 165,155 225,165 270,140 Q 270,290 270,290 C 225,315 165,305 125,310 Z"
            className="fill-white dark:fill-zinc-900 stroke-slate-300 dark:stroke-zinc-800"
            strokeWidth="1.5"
          />

          {/* Back Cover / Pages Depth Right */}
          <path
            d="M 420,165 C 380,160 320,170 272,143 Q 272,293 272,293 C 320,320 380,310 420,315 Z"
            className="fill-slate-100/80 dark:fill-zinc-900/80 stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="1.5"
          />
          {/* Right Page Top */}
          <path
            d="M 415,160 C 375,155 315,165 270,140 Q 270,290 270,290 C 315,315 375,305 415,310 Z"
            className="fill-white dark:fill-zinc-900 stroke-slate-300 dark:stroke-zinc-800"
            strokeWidth="1.5"
          />

          {/* Left Page Text Lines */}
          <line
            x1="145"
            y1="185"
            x2="225"
            y2="175"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="145"
            y1="205"
            x2="245"
            y2="193"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="145"
            y1="225"
            x2="210"
            y2="217"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="145"
            y1="245"
            x2="250"
            y2="233"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="145"
            y1="265"
            x2="230"
            y2="255"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="145"
            y1="285"
            x2="190"
            y2="280"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Right Page Text Lines */}
          <line
            x1="295"
            y1="175"
            x2="375"
            y2="185"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="295"
            y1="193"
            x2="395"
            y2="205"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="295"
            y1="217"
            x2="360"
            y2="225"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="295"
            y1="233"
            x2="400"
            y2="245"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="295"
            y1="255"
            x2="380"
            y2="265"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="295"
            y1="280"
            x2="340"
            y2="285"
            className="stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Dotted lines from book to floating cards */}
        <path
          d="M 370,185 Q 400,165 440,165"
          className="stroke-slate-350 dark:stroke-zinc-800 fill-none"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 360,250 Q 400,260 430,270"
          className="stroke-slate-350 dark:stroke-zinc-800 fill-none"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Floating HTML code tag badge </ > on Left */}
        <g>
          {/* Shadow */}
          <rect
            x="75"
            y="195"
            width="48"
            height="48"
            rx="12"
            className="fill-slate-200/50 dark:fill-zinc-950/30 blur-xs"
          />
          {/* Card container */}
          <rect
            x="75"
            y="190"
            width="48"
            height="48"
            rx="12"
            className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-zinc-800"
            strokeWidth="1.5"
          />
          <text
            x="99"
            y="222"
            className="font-mono text-base font-bold fill-slate-700 dark:fill-slate-350 text-center"
            textAnchor="middle"
          >
            &lt;/&gt;
          </text>
        </g>

        {/* Magnifying Glass (hovering and tilted) */}
        <g className="origin-[340px_230px]">
          {/* Handle shadow */}
          <line
            x1="365"
            y1="265"
            x2="415"
            y2="315"
            className="stroke-slate-300/40 dark:stroke-zinc-950/30"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Handle */}
          <line
            x1="360"
            y1="260"
            x2="410"
            y2="310"
            className="stroke-slate-800 dark:stroke-slate-200"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Lens frame shadow */}
          <circle
            cx="330"
            cy="220"
            r="42"
            className="fill-none stroke-slate-200/50 dark:stroke-zinc-950/30"
            strokeWidth="7"
          />
          {/* Lens frame */}
          <circle
            cx="325"
            cy="215"
            r="40"
            className="fill-blue-500/5 stroke-slate-800 dark:stroke-slate-100"
            strokeWidth="6"
          />
          {/* Glass glare highlight */}
          <path
            d="M 300,200 A 35 35 0 0 1 345,190"
            className="stroke-white/80 fill-none"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Plant Twig branch on bottom right */}
        <path
          d="M 430,360 Q 455,300 480,220"
          className="stroke-slate-300 dark:stroke-zinc-800 fill-none"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <path
          d="M 442,330 Q 430,320 422,328 Q 435,335 442,330"
          className="fill-slate-300 dark:fill-zinc-800"
        />
        <path
          d="M 452,300 Q 470,290 472,302 Q 458,308 452,300"
          className="fill-slate-300 dark:fill-zinc-800"
        />
        <path
          d="M 462,270 Q 448,255 440,265 Q 455,272 462,270"
          className="fill-slate-300 dark:fill-zinc-800"
        />
        <path
          d="M 470,240 Q 490,230 488,245 Q 475,248 470,240"
          className="fill-slate-300 dark:fill-zinc-800"
        />
      </svg>

      {/* Absolute positioned floating overlay cards to match "API" and "JWT" badges */}
      <div className="absolute top-[26%] right-[-1%] pointer-events-auto">
        <div className="flex flex-col gap-0.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg text-left w-[125px]">
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 font-mono">
            API
          </span>
          <span className="text-[7.5px] leading-tight text-slate-400 dark:text-slate-500">
            Application Programming Interface
          </span>
        </div>
      </div>

      <div className="absolute bottom-[28%] right-[11%] pointer-events-auto">
        <div className="flex flex-col gap-0.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg text-left w-[100px]">
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 font-mono">
            JWT
          </span>
          <span className="text-[7.5px] leading-tight text-slate-400 dark:text-slate-500 font-mono">
            JSON Web Token
          </span>
        </div>
      </div>
    </div>
  );
}

export function EngineeringTermsClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EngineeringTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [source, setSource] = useState<"elasticsearch" | "local" | "cache">(
    "local",
  );
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isRateLimitedState, setIsRateLimitedState] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    retryAfter: number;
    limit?: number;
  } | null>(null);

  // Redesigned: Category and Popular Terms state management
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut: "/" or "Cmd+K" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.metaKey && e.key === "k")) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Perform API search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsRateLimitedState(false);
    setRateLimitInfo(null);

    try {
      const response = await fetch(
        `/api/engineering-terms/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data: SearchResponse = await response.json();

      if (response.ok && data.success) {
        setResults(data.terms);
        setSource(data.source);
      } else if (isRateLimited(response)) {
        const rateLimitData = await getRateLimitInfo(response);
        setIsRateLimitedState(true);
        setRateLimitInfo({
          retryAfter: data.retryAfter || rateLimitData?.retryAfter || 60,
          limit: rateLimitData?.limit,
        });
        setResults([]);
      } else {
        setError(data.error || "Search failed");
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }, []);

  // Typing handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedCategory(null); // Clear active category filter when typing

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Category click handler
  const handleCategoryClick = (categoryKey: string) => {
    if (categoryKey === "all") {
      setSelectedCategory(null);
      setQuery("");
      setResults([]);
      setHasSearched(false);
      return;
    }

    setSelectedCategory(categoryKey);
    setQuery(""); // Clear manual text search

    // Filter locally instantly
    const localFiltered = sampleTerms.filter(
      (term) => term.category.toLowerCase() === categoryKey.toLowerCase(),
    );
    setResults(localFiltered);
    setSource("local");
    setHasSearched(true);
  };

  // Click handler for Popular Search Tags
  const handlePopularTagClick = (tagText: string) => {
    setQuery(tagText);
    setSelectedCategory(null);
    performSearch(tagText);
  };

  // Reset page back to hero / categories view
  const handleReset = () => {
    setQuery("");
    setSelectedCategory(null);
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  // UI configuration elements matching mockups
  const popularTags = ["API", "REST", "CRUD", "Docker", "Git", "JWT"];

  const categoriesList = [
    {
      name: "Programming",
      count: "128 terms",
      key: "Programming",
      icon: Code2,
    },
    {
      name: "Web Development",
      count: "96 terms",
      key: "Web Development",
      icon: Globe,
    },
    {
      name: "Data Structures",
      count: "64 terms",
      key: "System Design",
      icon: Layers,
    },
    { name: "Databases", count: "78 terms", key: "DBMS", icon: Database },
    { name: "DevOps", count: "55 terms", key: "DevOps", icon: InfinityIcon },
    {
      name: "All Categories",
      count: "20+ topics",
      key: "all",
      icon: LayoutGrid,
    },
  ];

  const popularTermsList = [
    {
      term: "API",
      desc: "Application Programming Interface. A set of rules that allows different software applications to communicate.",
      tag: "Web Development",
      icon: Code2,
      slug: "api",
    },
    {
      term: "SQL",
      desc: "Structured Query Language. A standard language for managing and manipulating relational database models.",
      tag: "Databases",
      icon: Database,
      slug: "sql",
    },
    {
      term: "OOP",
      desc: "Object-Oriented Programming. A programming paradigm based on the concept of objects and classes.",
      tag: "Programming",
      icon: Box,
      slug: "oop",
    },
    {
      term: "REST",
      desc: "Representational State Transfer. An architectural style for designing stateless, networked applications.",
      tag: "Web Development",
      icon: Globe,
      slug: "rest",
    },
    {
      term: "HTTPS",
      desc: "HyperText Transfer Protocol Secure. A secure version of HTTP for safe, encrypted data communication.",
      tag: "Networking",
      icon: Lock,
      slug: "https",
    },
  ];

  // Determine what mode to display
  const isShowingResults = query.trim().length > 0 || selectedCategory !== null;

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
      {/* Split Grid Hero: Left Column Title/Search & Right Column Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
        {/* Left Column: Heading text & Search Box */}
        <div className="lg:col-span-7 flex flex-col text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Section Tag Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-100/60 dark:bg-zinc-900/60 text-[10px] font-mono font-bold tracking-widest text-slate-500 dark:text-zinc-400 uppercase mb-5">
              Engineering Terms
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-5 leading-[1.15]">
              Understand every <br />
              term. Build better.
            </h1>

            <p className="text-slate-550 dark:text-zinc-400 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
              Explore a curated collection of engineering terms, definitions,
              and real-world context.
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-800 dark:group-focus-within:text-zinc-250 transition-colors" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for any term..."
                  value={query}
                  onChange={handleSearchChange}
                  className="w-full h-14 pl-12.5 pr-20 text-base border-slate-200 dark:border-zinc-800/80 bg-white/45 dark:bg-zinc-900/40 focus:border-slate-800 dark:focus:border-zinc-400 rounded-xl transition-all shadow-sm group-hover:shadow-md focus:shadow-md focus:ring-0 focus:outline-none"
                />
                <div className="absolute right-4.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {isLoading && (
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                  )}
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-slate-200 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-900/80 px-2 text-[10px] font-mono text-slate-450 dark:text-zinc-550">
                    ⌘ K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Popular Tags List */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5 text-xs text-slate-500 dark:text-zinc-450">
              <span className="font-mono">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handlePopularTagClick(tag)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800/80 rounded-md transition-colors font-mono cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Book & Magnifying Glass SVG Illustration */}
        <div className="lg:col-span-5 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <TermsIllustration />
          </motion.div>
        </div>
      </div>

      {/* API Search Errors and Rate Limits Panel */}
      <AnimatePresence>
        {isRateLimitedState && rateLimitInfo ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mb-8"
          >
            <RateLimitError
              variant="inline"
              retryAfter={rateLimitInfo.retryAfter}
              limit={rateLimitInfo.limit}
              onRetry={() => performSearch(query)}
            />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
          >
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* CONDITIONAL LAYOUT TRANSITION */}
      <div className="relative w-full">
        {!isShowingResults ? (
          /* LANDING STATE: CATEGORIES & POPULAR TERMS */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-16"
          >
            {/* Browse by Category */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-serif">
                  Browse by Category
                </h2>
                <button
                  onClick={() => handleCategoryClick("all")}
                  className="group text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  View all categories
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>{" "}
              {/* Categories Grid Layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categoriesList.map((cat, i) => {
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleCategoryClick(cat.key)}
                      className="group flex flex-col items-start p-5 bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/60 rounded-xl hover:border-slate-800 dark:hover:border-zinc-400 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 mb-4 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-950 transition-all">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm mb-1 group-hover:text-slate-900 dark:group-hover:text-white">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-slate-450 dark:text-zinc-500 font-mono">
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Popular Terms grid of 5 columns */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-serif">
                  Popular Terms
                </h2>
                <button
                  onClick={() => handleCategoryClick("all")}
                  className="group text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  View all terms
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* Popular Terms grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {popularTermsList.map((term, i) => {
                  const TermIcon = term.icon;
                  return (
                    <Link
                      href={`/engineering-terms/${term.slug}`}
                      key={i}
                      className="group flex flex-col justify-between p-5 bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/60 rounded-xl hover:border-slate-800 dark:hover:border-zinc-400 hover:shadow-md transition-all text-left"
                    >
                      <div>
                        {/* Top Icon Row */}
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-650 dark:text-zinc-350 w-fit mb-4 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-950 transition-all">
                          <TermIcon className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                          {term.term}
                        </h3>
                        <p className="text-xs text-slate-450 dark:text-zinc-400 leading-relaxed mb-6">
                          {term.desc}
                        </p>
                      </div>

                      {/* Footer Tag */}
                      <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-zinc-550 bg-slate-100/50 dark:bg-zinc-900/60 px-2 py-0.5 border border-slate-200/55 dark:border-zinc-800 rounded w-fit">
                        {term.tag}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* RESULTS STATE: SEARCH / CATEGORY LIST */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Results Header: Active Category badge or Back Button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-350 rounded-lg transition-colors cursor-pointer"
                  title="Back to all categories"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                  {selectedCategory ? (
                    <span className="flex items-center gap-2 text-slate-900 dark:text-white">
                      Category:{" "}
                      <span className="font-mono bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2.5 py-0.5 rounded text-xs">
                        {selectedCategory}
                      </span>
                    </span>
                  ) : (
                    <span>Search results for: &quot;{query}&quot;</span>
                  )}
                </span>
              </div>

              {/* Clear All Results Trigger */}
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Clear filters
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Results Display Area */}
            <div className="max-w-4xl">
              {!isMounted || (isLoading && results.length === 0) ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((term, index) => (
                    <motion.div
                      key={term.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <TermCard term={term} searchQuery={query} />
                    </motion.div>
                  ))}
                </div>
              ) : hasSearched ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-2xl">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="font-bold text-slate-850 dark:text-white text-base mb-1">
                    No terms found
                  </h3>
                  <p className="text-sm text-slate-450 dark:text-zinc-550">
                    Try searching for a different keyword or browse categories.
                  </p>
                </div>
              ) : (
                // Category fallback when nothing is returned from search endpoint
                <div className="grid gap-4">
                  {sampleTerms.slice(0, 15).map((term, index) => (
                    <motion.div
                      key={term.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <TermCard term={term} searchQuery={query} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer search details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 mt-16 text-xs text-slate-450 dark:text-zinc-550 font-mono"
      >
        <Zap className="w-3.5 h-3.5" />
        <span>
          Powered by{" "}
          {source === "elasticsearch"
            ? "Elasticsearch"
            : source === "cache"
              ? "Redis cache"
              : "local database"}{" "}
          fallback.
        </span>
      </motion.div>
    </main>
  );
}
