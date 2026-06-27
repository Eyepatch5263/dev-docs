"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Container,
  Cpu,
  Database,
  FileText,
  Globe,
  Layers,
  Lightbulb,
  Link2,
  Search,
  Star,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  { label: "System Design", icon: Layers },
  { label: "Operating Systems", icon: Cpu },
  { label: "Database", icon: Database },
  { label: "Networking", icon: Globe },
  { label: "DevOps", icon: Container },
  { label: "Languages", icon: Terminal },
];

const featuredTerm = {
  term: "CAP Theorem",
  category: "DISTRIBUTED SYSTEMS",
  date: "Featured",
  definition:
    "In distributed systems, you can only guarantee two out of the three: Consistency, Availability, and Partition Tolerance. The theorem helps in designing reliable distributed systems by understanding these trade-offs.",
  relatedTerms: [
    "PACELC",
    "Consistency",
    "Availability",
    "Partition Tolerance",
    "+ 6 more",
  ],
};

const recentTerms = [
  { term: "ACID Properties", category: "Database", slug: "acid-properties" },
  {
    term: "Eventual Consistency",
    category: "Distributed Systems",
    slug: "eventual-consistency",
  },
  { term: "Idempotency", category: "System Design", slug: "idempotency" },
  { term: "Rate Limiting", category: "System Design", slug: "rate-limiting" },
  { term: "Deadlock", category: "Operating Systems", slug: "deadlock" },
];

const stats = [
  {
    icon: FileText,
    value: "2000+",
    label: "Terms",
    description: "Curated engineering concepts across multiple domains",
  },
  {
    icon: Lightbulb,
    value: "Clear",
    label: "Explanations",
    description: "Simple, accurate and practical explanations with examples",
  },
  {
    icon: Link2,
    value: "Related",
    label: "Concepts",
    description: "Discover connected topics and learn in context",
  },
];

// Orbiting CS terms — small floating badges that orbit the section
const orbitTerms = [
  { label: "Latency", color: "bg-blue-500" },
  { label: "Throughput", color: "bg-emerald-500" },
  { label: "Sharding", color: "bg-violet-500" },
  { label: "Quorum", color: "bg-amber-500" },
  { label: "DNS", color: "bg-rose-500" },
  { label: "TCP/IP", color: "bg-cyan-500" },
  { label: "Mutex", color: "bg-indigo-500" },
  { label: "B+ Tree", color: "bg-pink-500" },
  { label: "REST API", color: "bg-teal-500" },
  { label: "Caching", color: "bg-orange-500" },
  { label: "OAuth", color: "bg-sky-500" },
  { label: "Deadlock", color: "bg-red-500" },
];

function OrbitingTerm({
  label,
  color,
  x,
  y,
}: {
  label: string;
  color: string;
  x: number;
  y: number;
}) {
  return (
    <div
      className="absolute z-10 pointer-events-none select-none"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm shadow-md">
        <span className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
        <span className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}

export function EngineeringTermsSlide() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [angleOffset, setAngleOffset] = useState(0);

  // Orbit animation loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const update = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setAngleOffset((prev) => (prev + delta * 0.06) % (2 * Math.PI));
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Compute orbital positions for CS terms
  const orbitA = 700; // horizontal radius
  const orbitB = 380; // vertical radius

  const positionedTerms = orbitTerms.map((term, i) => {
    const baseAngle = (i * 2 * Math.PI) / orbitTerms.length;
    const angle = (baseAngle + angleOffset) % (2 * Math.PI);
    const x = orbitA * Math.cos(angle);
    const y = orbitB * Math.sin(angle);
    return { ...term, x, y };
  });

  return (
    <section className="relative w-full min-h-screen lg:h-screen flex flex-col items-center overflow-visible lg:overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/2 via-transparent to-primary/3 dark:from-amber-500/2 dark:via-transparent dark:to-primary/4 pointer-events-none" />

      {/* Faint radial glow */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/3 dark:bg-amber-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* Faint grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Orbit ellipse outline — desktop only */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block">
        <ellipse
          cx="50%"
          cy="50%"
          rx={orbitA}
          ry={orbitB}
          className="stroke-slate-200/40 dark:stroke-slate-800/25 fill-none"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Orbiting CS term badges — desktop only */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none z-10">
        {positionedTerms.map((term, i) => (
          <OrbitingTerm
            key={i}
            label={term.label}
            color={term.color}
            x={term.x}
            y={term.y}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20 w-full max-w-5xl min-h-inherit lg:h-full mx-auto px-6 flex flex-col items-center justify-between py-10 lg:py-12 overflow-visible lg:overflow-hidden">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Search technical concepts.
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-slate-400 to-slate-300 dark:from-slate-500 dark:to-slate-600 bg-clip-text text-transparent leading-[1.15]">
            Understand deeply.
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 text-center max-w-xl mb-6 leading-relaxed"
        >
          Explore thousands of engineering terms and concepts.
          <br className="hidden sm:block" />
          Clear explanations, real-world examples, and related topics.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-2xl mb-5"
        >
          <Link href="/engineering-terms" className="block">
            <div
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all duration-300 cursor-text ${
                searchFocused
                  ? "border-primary/40 shadow-lg shadow-primary/5 bg-white dark:bg-slate-900/80"
                  : "border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
              onMouseEnter={() => setSearchFocused(true)}
              onMouseLeave={() => setSearchFocused(false)}
            >
              <Search className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="flex-1 text-sm text-slate-400 dark:text-slate-500 select-none">
                Search engineering terms, concepts, technologies...
              </span>
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                ↵ Enter
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-6"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mr-1">
            Browse Topics
          </span>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href="/engineering-terms"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/40 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/60 transition-all duration-200"
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </Link>
            );
          })}
          <Link
            href="/engineering-terms"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/40 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-primary/40 hover:text-primary transition-all duration-200"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </motion.div>

        {/* Two-Column: Featured Term + Recently Viewed */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
        >
          {/* Term of the Day Card */}
          <div className="md:col-span-3 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5 sm:p-6">
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-400/80">
                  Term of the Day
                </span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {featuredTerm.date}
              </span>
            </div>

            {/* Term title */}
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              {featuredTerm.term}
            </h3>

            {/* Category badge */}
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-300/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 mb-3">
              {featuredTerm.category}
            </span>

            {/* Definition */}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {featuredTerm.definition}
            </p>

            {/* Related terms */}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-2 block">
                Related Terms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {featuredTerm.relatedTerms.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-200 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recently Viewed Sidebar */}
          <div className="md:col-span-2 bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Popular Terms
              </span>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/40">
              {recentTerms.map((item) => (
                <Link
                  key={item.slug}
                  href={`/engineering-terms/${item.slug}`}
                  className="group flex items-center justify-between py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/20 -mx-2 px-2 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block leading-tight">
                        {item.term}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                </Link>
              ))}
            </div>

            <Link
              href="/engineering-terms"
              className="flex items-center justify-center gap-1.5 mt-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800/40"
            >
              View all terms <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/40 rounded-xl px-6 py-4"
        >
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800/40">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 first:pl-0 last:pr-0"
                >
                  <Icon className="w-5 h-5 hidden sm:block text-slate-400 dark:text-slate-500 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                      {stat.value} {stat.label}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight hidden sm:block">
                      {stat.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
