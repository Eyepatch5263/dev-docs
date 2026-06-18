"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, Globe, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

type TabType = "OS" | "DBMS" | "NETWORKING" | "SYS_DESIGN";

// Redesigned scattered wireframe SVGs (responsive opacity/color in light/dark mode)
const TorusWireframe = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-16 h-16 stroke-current text-slate-300/30 dark:text-slate-800/25 fill-none"
    strokeWidth="0.8"
  >
    <ellipse cx="50" cy="50" rx="40" ry="20" />
    <ellipse cx="50" cy="50" rx="30" ry="12" />
    <ellipse cx="50" cy="50" rx="20" ry="6" />
    <path d="M 10 50 Q 50 10 90 50 Q 50 90 10 50" />
    <path d="M 20 50 Q 50 30 80 50 Q 50 70 20 50" />
    <line x1="50" y1="10" x2="50" y2="30" />
    <line x1="50" y1="70" x2="50" y2="90" />
    <line x1="10" y1="50" x2="20" y2="50" />
    <line x1="80" y1="50" x2="90" y2="50" />
  </svg>
);

const CylinderWireframe = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-14 h-14 stroke-current text-slate-300/30 dark:text-slate-800/25 fill-none"
    strokeWidth="0.8"
  >
    <ellipse cx="50" cy="20" rx="30" ry="10" />
    <ellipse cx="50" cy="80" rx="30" ry="10" />
    <line x1="20" y1="20" x2="20" y2="80" />
    <line x1="80" y1="20" x2="80" y2="80" />
    <line x1="50" y1="30" x2="50" y2="90" strokeDasharray="2 2" />
  </svg>
);

const PrismWireframe = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-14 h-14 stroke-current text-slate-300/30 dark:text-slate-800/25 fill-none"
    strokeWidth="0.8"
  >
    <polygon points="50,15 20,40 80,40" />
    <polygon points="50,65 20,90 80,90" />
    <line x1="50" y1="15" x2="50" y2="65" />
    <line x1="20" y1="40" x2="20" y2="90" />
    <line x1="80" y1="40" x2="80" y2="90" />
  </svg>
);

// Scattered nodes and snippets data
const docNodes = [
  {
    name: "Query Planner",
    status: "optimizing query...",
    color: "bg-rose-500",
    posClass: "left-[4%] top-[12%] md:left-[6%] md:top-[15%]",
  },
  {
    name: "OS Scheduler",
    status: "allocating timeslice...",
    color: "bg-emerald-500",
    posClass: "left-[2%] bottom-[12%] md:left-[4%] md:bottom-[15%]",
  },
  {
    name: "Page Cache",
    status: "evicting dirty pages...",
    color: "bg-blue-500",
    posClass: "right-[4%] top-[10%] md:right-[6%] md:top-[12%]",
  },
  {
    name: "BGP Router",
    status: "updating path vector...",
    color: "bg-amber-500",
    posClass: "right-[2%] bottom-[10%] md:right-[8%] md:bottom-[15%]",
  },
];

const docSnippets = [
  {
    text: 'db.execute("SELECT * FROM users")',
    posClass: "left-[14%] top-[45%] md:left-[16%]",
    delay: 0,
  },
  {
    text: "void* thread_func(void* arg)",
    posClass: "right-[12%] top-[55%] md:right-[15%]",
    delay: 1.5,
  },
  {
    text: "socket.connect(addr)",
    posClass: "left-[12%] bottom-[32%] md:left-[14%]",
    delay: 0.8,
  },
  { text: "ingress.route(req)", posClass: "right-[20%] top-[8%]", delay: 2.2 },
];

export function FlashDocsSection() {
  const [activeTab, setActiveTab] = useState<TabType>("OS");

  return (
    <section className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 sm:px-8 lg:px-16 py-12 transition-colors duration-500">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5 dark:from-primary/15 dark:via-background dark:to-accent/15 pointer-events-none" />

      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Faint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Scattered Wireframe Shapes */}
      <motion.div
        className="absolute pointer-events-none block scale-[0.6] sm:scale-75 md:scale-100"
        style={{ left: "6%", top: "24%" }}
        animate={{ y: [0, -10, 0], rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <TorusWireframe />
      </motion.div>
      <motion.div
        className="absolute pointer-events-none block scale-[0.6] sm:scale-75 md:scale-100"
        style={{ right: "8%", bottom: "24%" }}
        animate={{ y: [0, 12, 0], rotate: [360, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <CylinderWireframe />
      </motion.div>
      <motion.div
        className="absolute pointer-events-none block scale-[0.5] sm:scale-75 md:scale-90"
        style={{ right: "12%", top: "20%" }}
        animate={{ y: [0, -8, 0], rotate: [0, -360] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <PrismWireframe />
      </motion.div>

      {/* Scattered Tech Nodes */}
      {docNodes.map((node, i) => (
        <div
          key={i}
          className={`absolute ${node.posClass} pointer-events-none z-10 scale-75 md:scale-90 lg:scale-100`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md shadow-lg"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${node.color} animate-pulse`}
            />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono font-bold text-slate-700 dark:text-slate-300">
                {node.name}
              </span>
              <span className="text-[7px] font-mono text-slate-500 leading-none">
                {node.status}
              </span>
            </div>
          </motion.div>
        </div>
      ))}

      {/* Scattered Floating Code Snippets */}
      {docSnippets.map((snippet, i) => (
        <motion.div
          key={snippet.text}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.35, y: 0 }}
          viewport={{ once: true }}
          className={`absolute ${snippet.posClass} hidden sm:block pointer-events-none font-mono text-[10px] text-slate-400 dark:text-slate-650 tracking-wide select-none`}
          animate={{ y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: snippet.delay },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            },
          }}
        >
          {snippet.text}
        </motion.div>
      ))}

      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Column: Title and Content */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block font-mono">
              Interactive visual playground
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Flash Docs
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Deep explanations of OS, DBMS, Networking, and System Design. From
              fundamentals to expert-level concepts, learn at your own pace with
              comprehensive, visual documentation.
            </p>

            <Link
              href="/docs"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-white dark:bg-white border border-slate-300 dark:border-transparent text-slate-900 dark:text-slate-950 rounded-xl font-semibold transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-100 shadow-xl shadow-slate-200/50 dark:shadow-black/25 font-mono text-xs tracking-wider cursor-pointer"
            >
              READ CONCEPTS
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Visual Dashboard Panel */}
        <div className="lg:col-span-7 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full bg-white/40 dark:bg-zinc-900/35 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden relative"
          >
            {/* Glow Border Effect */}
            <div className="absolute -inset-px bg-linear-to-tr from-primary/10 via-transparent to-primary/10 dark:from-primary/5 dark:via-transparent dark:to-primary/5 rounded-2xl pointer-events-none" />

            {/* Tab Headers */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-6 relative z-10">
              {(["OS", "DBMS", "NETWORKING", "SYS_DESIGN"] as TabType[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-300 select-none cursor-pointer border ${
                      activeTab === tab
                        ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 border-transparent"
                    }`}
                  >
                    {tab === "OS" && <Cpu className="w-3.5 h-3.5" />}
                    {tab === "DBMS" && <Database className="w-3.5 h-3.5" />}
                    {tab === "NETWORKING" && <Globe className="w-3.5 h-3.5" />}
                    {tab === "SYS_DESIGN" && <Layers className="w-3.5 h-3.5" />}
                    [{tab.replace("_", " ")}]
                  </button>
                ),
              )}
            </div>

            {/* Interactive Diagrams Area */}
            <div className="min-h-[380px] flex flex-col justify-between relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex-1 flex flex-col justify-between gap-6"
                >
                  {activeTab === "OS" && <OSDiagram />}
                  {activeTab === "DBMS" && <DBMSDiagram />}
                  {activeTab === "NETWORKING" && <NetworkingDiagram />}
                  {activeTab === "SYS_DESIGN" && <SysDesignDiagram />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* 1. OS Diagram Component */
function OSDiagram() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400">
        PROCESS SCHEDULING (ROUND ROBIN)
      </div>

      <div className="relative w-full aspect-video bg-slate-100/60 dark:bg-zinc-950/60 rounded-xl border border-slate-200 dark:border-slate-900 p-4 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 600 300"
          className="w-full h-full text-slate-300 dark:text-slate-700 stroke-current fill-none"
          strokeWidth="1.5"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 1.5 L 8 5 L 0 8.5 z"
                className="fill-slate-400 dark:fill-slate-600"
              />
            </marker>
          </defs>

          {/* Background Grid */}
          <pattern
            id="grid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 30"
              className="stroke-slate-200/50 dark:stroke-slate-900/40"
              strokeWidth="0.75"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Flow Paths */}
          <path
            d="M 30,150 L 110,150"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <path
            d="M 190,150 L 270,150"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <path
            d="M 350,150 L 430,150"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />

          {/* Loops */}
          <path
            d="M 310,120 L 310,80 L 150,80 L 150,120"
            markerEnd="url(#arrow)"
            strokeDasharray="3 3"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <path
            d="M 310,180 L 310,230 L 270,230"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <path
            d="M 190,230 L 150,230 L 150,180"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />

          {/* READY State */}
          <g transform="translate(110, 120)">
            <rect
              width="80"
              height="60"
              rx="8"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="35"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-xs font-semibold stroke-none select-none"
            >
              READY
            </text>
          </g>

          {/* RUNNING State */}
          <g transform="translate(270, 120)">
            <rect
              width="80"
              height="60"
              rx="8"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="35"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-xs font-semibold stroke-none select-none"
            >
              RUNNING
            </text>
          </g>

          {/* PROCESS State */}
          <g transform="translate(430, 120)">
            <rect
              width="80"
              height="60"
              rx="8"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="35"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-xs font-semibold stroke-none select-none"
            >
              PROCESS
            </text>
          </g>

          {/* WAIT State */}
          <g transform="translate(190, 210)">
            <rect
              width="80"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-900"
            />
            <text
              x="40"
              y="24"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 font-mono text-[10px] font-semibold stroke-none select-none"
            >
              WAIT
            </text>
          </g>

          {/* Labels */}
          <text
            x="230"
            y="70"
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] stroke-none select-none"
          >
            TIMEOUT
          </text>
          <text
            x="320"
            y="210"
            textAnchor="start"
            className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] stroke-none select-none"
          >
            I/O BLOCK
          </text>
          <text
            x="140"
            y="210"
            textAnchor="end"
            className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] stroke-none select-none"
          >
            I/O COMP
          </text>

          {/* Animated scheduler node */}
          <motion.circle
            r="3.5"
            className="fill-primary"
            style={{ filter: "drop-shadow(0 0 5px #3b82f6)" }}
            animate={{
              cx: [30, 150, 150, 310, 310, 470],
              cy: [150, 150, 150, 150, 150, 150],
              opacity: [0, 1, 1, 1, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-3 gap-4">
        {/* Table Widget */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1 flex justify-between">
            <span>READY QUEUE</span>
            <span className="text-primary animate-pulse">●</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 dark:text-slate-600">
                <th>PID</th>
                <th>PRIO</th>
                <th>STATE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1024</td>
                <td>H</td>
                <td className="text-emerald-600 dark:text-emerald-500">
                  READY
                </td>
              </tr>
              <tr>
                <td>2048</td>
                <td>M</td>
                <td className="text-emerald-600 dark:text-emerald-500">
                  READY
                </td>
              </tr>
              <tr>
                <td>4096</td>
                <td>L</td>
                <td className="text-slate-400 dark:text-slate-500">WAIT</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Timeline Widget */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            GANTT TIMELINE
          </div>
          <div className="flex-1 flex flex-col gap-1.5 justify-center py-1">
            <div className="flex items-center gap-1">
              <span className="w-7 text-[8px] text-slate-400 dark:text-slate-600">
                CPU0
              </span>
              <div className="flex-1 h-2.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 rounded-xs overflow-hidden flex">
                <div className="w-1/3 bg-primary/80 border-r border-slate-200 dark:border-slate-950" />
                <div className="w-1/4 bg-rose-500/80 border-r border-slate-200 dark:border-slate-950" />
                <div className="w-5/12 bg-emerald-500/80" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-7 text-[8px] text-slate-400 dark:text-slate-600">
                CPU1
              </span>
              <div className="flex-1 h-2.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 rounded-xs overflow-hidden flex">
                <div className="w-1/2 bg-rose-500/80 border-r border-slate-200 dark:border-slate-950" />
                <div className="w-1/6 bg-primary/80 border-r border-slate-200 dark:border-slate-950" />
                <div className="w-1/3 bg-emerald-550/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Hierarchy Tree Widget */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            PROCESS TREE
          </div>
          <div className="flex-1 flex items-center justify-center py-0.5">
            <svg
              viewBox="0 0 100 50"
              className="w-full h-full stroke-slate-300 dark:stroke-slate-800 fill-none"
              strokeWidth="1"
            >
              <line x1="50" y1="10" x2="25" y2="30" />
              <line x1="50" y1="10" x2="75" y2="30" />
              <line x1="25" y1="30" x2="15" y2="45" />
              <line x1="25" y1="30" x2="35" y2="45" />
              <circle
                cx="50"
                cy="10"
                r="3"
                className="fill-white dark:fill-zinc-950 stroke-primary"
                strokeWidth="1.5"
              />
              <circle
                cx="25"
                cy="30"
                r="2.5"
                className="fill-white dark:fill-zinc-950 stroke-slate-400 dark:stroke-slate-600"
              />
              <circle
                cx="75"
                cy="30"
                r="2.5"
                className="fill-white dark:fill-zinc-950 stroke-slate-400 dark:stroke-slate-600"
              />
              <circle
                cx="15"
                cy="45"
                r="2"
                className="fill-white dark:fill-zinc-950 stroke-slate-350 dark:stroke-slate-700"
              />
              <circle
                cx="35"
                cy="45"
                r="2"
                className="fill-white dark:fill-zinc-950 stroke-slate-350 dark:stroke-slate-700"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. DBMS Diagram Component */
function DBMSDiagram() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400">
        B+ TREE INDEX LOOKUP
      </div>

      <div className="relative w-full aspect-video bg-slate-100/60 dark:bg-zinc-950/60 rounded-xl border border-slate-200 dark:border-slate-900 p-4 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 600 300"
          className="w-full h-full text-slate-300 dark:text-slate-750 stroke-current fill-none"
          strokeWidth="1.5"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 1.5 L 8 5 L 0 8.5 z"
                className="fill-slate-400 dark:fill-slate-600"
              />
            </marker>
          </defs>

          {/* Hierarchy links */}
          <line
            x1="300"
            y1="70"
            x2="150"
            y2="130"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <line
            x1="300"
            y1="70"
            x2="450"
            y2="130"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />

          <line
            x1="150"
            y1="160"
            x2="80"
            y2="210"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <line
            x1="150"
            y1="160"
            x2="220"
            y2="210"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <line
            x1="450"
            y1="160"
            x2="380"
            y2="210"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <line
            x1="450"
            y1="160"
            x2="520"
            y2="210"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />

          {/* Root Node */}
          <g transform="translate(260, 30)">
            <rect
              width="80"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="24"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[10px] font-semibold stroke-none select-none"
            >
              [ 20 | 50 ]
            </text>
            <text
              x="40"
              y="-8"
              textAnchor="middle"
              className="fill-slate-450 dark:fill-slate-500 font-mono text-[8px] tracking-wider stroke-none select-none"
            >
              ROOT
            </text>
          </g>

          {/* Internal Left Node */}
          <g transform="translate(110, 120)">
            <rect
              width="80"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="24"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[10px] font-semibold stroke-none select-none"
            >
              [ 10 | 15 ]
            </text>
          </g>

          {/* Internal Right Node */}
          <g transform="translate(410, 120)">
            <rect
              width="80"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="24"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[10px] font-semibold stroke-none select-none"
            >
              [ 30 | 40 ]
            </text>
          </g>

          {/* Leaf Nodes */}
          <g transform="translate(40, 200)">
            <rect
              width="80"
              height="30"
              rx="4"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-900"
            />
            <text
              x="40"
              y="18"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-400 font-mono text-[9px] stroke-none select-none"
            >
              5 , 8
            </text>
          </g>
          <g transform="translate(180, 200)">
            <rect
              width="80"
              height="30"
              rx="4"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-900"
            />
            <text
              x="40"
              y="18"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-400 font-mono text-[9px] stroke-none select-none"
            >
              12 , 14
            </text>
          </g>
          <g transform="translate(340, 200)">
            <rect
              width="80"
              height="30"
              rx="4"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-900"
            />
            <text
              x="40"
              y="18"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-400 font-mono text-[9px] stroke-none select-none"
            >
              22 , 28
            </text>
          </g>
          <g transform="translate(480, 200)">
            <rect
              width="80"
              height="30"
              rx="4"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-900"
            />
            <text
              x="40"
              y="18"
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-400 font-mono text-[9px] stroke-none select-none"
            >
              35 , 42
            </text>
            <text
              x="40"
              y="42"
              textAnchor="middle"
              className="fill-emerald-600 dark:fill-emerald-500 font-mono text-[8px] font-bold tracking-wider stroke-none select-none"
            >
              MATCH (42)
            </text>
          </g>

          {/* Search query tag */}
          <text
            x="40"
            y="45"
            className="fill-primary font-mono text-[9px] font-bold stroke-none select-none"
          >
            FIND Key: 42
          </text>

          {/* Animated search pointer */}
          <motion.circle
            r="3.5"
            className="fill-primary"
            style={{ filter: "drop-shadow(0 0 5px #3b82f6)" }}
            animate={{
              cx: [300, 450, 520],
              cy: [70, 140, 210],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-3 gap-4">
        {/* WAL widget */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            WRITE-AHEAD LOG
          </div>
          <div className="flex flex-col gap-0.5 text-[8px]">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 py-0.5">
              <span className="text-slate-400 dark:text-slate-500">
                LSN: 0x82a
              </span>
              <span className="text-primary font-bold">TX_01 COMMIT</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 py-0.5">
              <span className="text-slate-400 dark:text-slate-500">
                LSN: 0x82b
              </span>
              <span>TX_02 INSERT [42]</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400 dark:text-slate-500">
                LSN: 0x82c
              </span>
              <span className="text-slate-400 dark:text-slate-600">
                TX_02 UPDATE [42]
              </span>
            </div>
          </div>
        </div>

        {/* Buffer cache pool */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            BUFFER POOL
          </div>
          <div className="flex flex-col gap-1.5 justify-center py-1">
            <div>
              <div className="flex justify-between text-[8px] text-slate-400 dark:text-slate-500 mb-0.5">
                <span>CACHE HIT RATE</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                  96.8%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: "96.8%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[8px] text-slate-400 dark:text-slate-500 mb-0.5">
                <span>DIRTY PAGES</span>
                <span className="text-amber-600 dark:text-amber-500 font-bold">
                  3.2%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: "3.2%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Locks Table */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            ACTIVE LOCKS
          </div>
          <table className="w-full text-left text-[8px]">
            <thead>
              <tr className="text-slate-400 dark:text-slate-600">
                <th>TXID</th>
                <th>TYPE</th>
                <th>RES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TX_01</td>
                <td className="text-amber-600 dark:text-amber-500">SHARED</td>
                <td>PAGE_82</td>
              </tr>
              <tr>
                <td>TX_02</td>
                <td className="text-rose-600 dark:text-rose-500">EXCLUSIVE</td>
                <td>ROW_918</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* 3. Networking Diagram Component */
function NetworkingDiagram() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400">
        TCP 3-WAY HANDSHAKE
      </div>

      <div className="relative w-full aspect-video bg-slate-100/60 dark:bg-zinc-950/60 rounded-xl border border-slate-200 dark:border-slate-900 p-4 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 600 300"
          className="w-full h-full text-slate-300 dark:text-slate-705 stroke-current fill-none"
          strokeWidth="1.5"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 1.5 L 8 5 L 0 8.5 z"
                className="fill-slate-400 dark:fill-slate-600"
              />
            </marker>
          </defs>

          {/* Host path bounds */}
          <line
            x1="120"
            y1="40"
            x2="120"
            y2="260"
            strokeDasharray="3 3"
            className="stroke-slate-200 dark:stroke-slate-850"
          />
          <line
            x1="480"
            y1="40"
            x2="480"
            y2="260"
            strokeDasharray="3 3"
            className="stroke-slate-200 dark:stroke-slate-850"
          />

          {/* Host labels */}
          <g transform="translate(80, 20)">
            <rect
              width="80"
              height="24"
              rx="4"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="15"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              CLIENT
            </text>
          </g>
          <g transform="translate(440, 20)">
            <rect
              width="80"
              height="24"
              rx="4"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="15"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              SERVER
            </text>
          </g>

          {/* Dialogue Paths */}
          <path
            d="M 120,80 L 480,140"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <text
            x="300"
            y="95"
            textAnchor="middle"
            className="fill-primary font-mono text-[9px] font-bold stroke-none select-none"
          >
            SYN (Seq=X)
          </text>

          <path
            d="M 480,150 L 120,210"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <text
            x="300"
            y="170"
            textAnchor="middle"
            className="fill-rose-500 dark:fill-rose-400 font-mono text-[9px] font-bold stroke-none select-none"
          >
            SYN-ACK (Seq=Y, Ack=X+1)
          </text>

          <path
            d="M 120,220 L 480,260"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <text
            x="300"
            y="235"
            textAnchor="middle"
            className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[9px] font-bold stroke-none select-none"
          >
            ACK (Seq=X+1, Ack=Y+1)
          </text>

          {/* Status Labels */}
          <text
            x="100"
            y="90"
            textAnchor="end"
            className="fill-slate-400 dark:fill-slate-500 font-mono text-[8px] stroke-none select-none"
          >
            SYN_SENT
          </text>
          <text
            x="500"
            y="150"
            textAnchor="start"
            className="fill-slate-400 dark:fill-slate-500 font-mono text-[8px] stroke-none select-none"
          >
            SYN_RCVD
          </text>
          <text
            x="100"
            y="230"
            textAnchor="end"
            className="fill-emerald-600 dark:fill-emerald-500 font-mono text-[8px] font-bold stroke-none select-none"
          >
            ESTABLISHED
          </text>
          <text
            x="500"
            y="270"
            textAnchor="start"
            className="fill-emerald-600 dark:fill-emerald-500 font-mono text-[8px] font-bold stroke-none select-none"
          >
            ESTABLISHED
          </text>

          {/* Animated packets */}
          <motion.circle
            r="3.5"
            className="fill-primary"
            style={{ filter: "drop-shadow(0 0 5px #3b82f6)" }}
            animate={{
              cx: [120, 480],
              cy: [80, 140],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            r="3.5"
            className="fill-rose-500"
            style={{ filter: "drop-shadow(0 0 5px #f43f5e)" }}
            animate={{
              cx: [480, 120],
              cy: [150, 210],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3.5,
              delay: 1.16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            r="3.5"
            className="fill-emerald-500"
            style={{ filter: "drop-shadow(0 0 5px #10b981)" }}
            animate={{
              cx: [120, 480],
              cy: [220, 260],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3.5,
              delay: 2.33,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-3 gap-4">
        {/* Headers */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            SEGMENT DECODER
          </div>
          <div className="flex flex-col gap-0.5 text-[7px] leading-tight">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 py-0.5">
              <span className="text-slate-400 dark:text-slate-500">
                SRC PORT
              </span>
              <span>49152 (CLIENT)</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 py-0.5">
              <span className="text-slate-400 dark:text-slate-500">
                DST PORT
              </span>
              <span className="text-primary font-bold">443 (HTTPS)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400 dark:text-slate-500">FLAGS</span>
              <span className="text-emerald-600 dark:text-emerald-500">
                SYN, ACK
              </span>
            </div>
          </div>
        </div>

        {/* Congestion Control Graph */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            CONGESTION WINDOW
          </div>
          <div className="flex-1 flex items-center justify-center py-0.5">
            <svg
              viewBox="0 0 100 30"
              className="w-full h-full stroke-primary fill-none"
              strokeWidth="1"
            >
              <path d="M 0,25 Q 15,25 25,20 T 50,15 T 70,5 L 70,25 T 100,10" />
              <line
                x1="0"
                y1="28"
                x2="100"
                y2="28"
                className="stroke-slate-100 dark:stroke-zinc-950"
              />
            </svg>
          </div>
        </div>

        {/* latency RTT logs */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            LATENCY LOG (RTT)
          </div>
          <div className="flex flex-col gap-0.5 text-[8px]">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400 dark:text-slate-500">
                SYN_SENT
              </span>
              <span>12ms</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-400 dark:text-slate-500">
                SYN-ACK
              </span>
              <span>14ms</span>
            </div>
            <div className="flex justify-between py-0.5 font-bold text-emerald-600 dark:text-emerald-500">
              <span>RTT AVG</span>
              <span>13.2ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4. System Design Diagram Component */
function SysDesignDiagram() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400">
        SCALABLE EVENT-DRIVEN ARCHITECTURE
      </div>

      <div className="relative w-full aspect-video bg-slate-100/60 dark:bg-zinc-950/60 rounded-xl border border-slate-200 dark:border-slate-900 p-4 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 600 300"
          className="w-full h-full text-slate-300 dark:text-slate-705 stroke-current fill-none"
          strokeWidth="1.5"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M 0 1.5 L 8 5 L 0 8.5 z"
                className="fill-slate-400 dark:fill-slate-600"
              />
            </marker>
          </defs>

          {/* Links */}
          <path
            d="M 80,150 L 150,150"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <path
            d="M 230,150 L 300,150"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />

          {/* Server Cache paths */}
          <path
            d="M 340,120 L 340,70"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <path
            d="M 340,70 L 340,120"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />

          <path
            d="M 380,150 L 450,150"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          <path
            d="M 510,150 L 530,150"
            markerEnd="url(#arrow)"
            className="stroke-slate-300 dark:stroke-slate-700"
          />

          {/* Client Box */}
          <g transform="translate(10, 130)">
            <rect
              width="70"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="35"
              y="24"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              CLIENT
            </text>
          </g>

          {/* LB Box */}
          <g transform="translate(150, 130)">
            <rect
              width="80"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="24"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              GATEWAY / LB
            </text>
          </g>

          {/* Web Server Box */}
          <g transform="translate(300, 120)">
            <rect
              width="80"
              height="60"
              rx="8"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="40"
              y="35"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[10px] font-semibold stroke-none select-none"
            >
              WEB SERVER
            </text>
          </g>

          {/* Cache Box */}
          <g transform="translate(300, 30)">
            <rect
              width="80"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-900"
            />
            <text
              x="40"
              y="24"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              REDIS CACHE
            </text>
          </g>

          {/* Kafka Box */}
          <g transform="translate(450, 130)">
            <rect
              width="60"
              height="40"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x="30"
              y="24"
              textAnchor="middle"
              className="fill-slate-800 dark:fill-slate-300 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              KAFKA
            </text>
          </g>

          {/* Consumer/DB */}
          <g transform="translate(530, 125)">
            <rect
              width="60"
              height="50"
              rx="6"
              className="fill-white dark:fill-zinc-900 stroke-slate-200 dark:stroke-slate-900"
            />
            <text
              x="30"
              y="25"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              WORKER
            </text>
            <text
              x="30"
              y="40"
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 font-mono text-[9px] font-semibold stroke-none select-none"
            >
              / DB
            </text>
          </g>

          {/* Flow labels */}
          <text
            x="115"
            y="140"
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500 font-mono text-[8px] stroke-none select-none"
          >
            HTTP
          </text>
          <text
            x="415"
            y="140"
            textAnchor="middle"
            className="fill-primary font-mono text-[8px] font-bold stroke-none select-none"
          >
            PRODUCE
          </text>
          <text
            x="360"
            y="95"
            textAnchor="start"
            className="fill-amber-600 dark:fill-amber-500 font-mono text-[8px] stroke-none select-none"
          >
            LOOKUP
          </text>

          {/* Animated event dot */}
          <motion.circle
            r="3.5"
            className="fill-primary"
            style={{ filter: "drop-shadow(0 0 5px #3b82f6)" }}
            animate={{
              cx: [45, 115, 190, 340, 480, 560],
              cy: [150, 150, 150, 150, 150, 150],
              opacity: [0, 1, 1, 1, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-3 gap-4">
        {/* Health widget */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            GATEWAY MONITOR
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[8px]">
              <span>API HEALTH</span>
              <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                99.98%
              </span>
            </div>
            <div className="flex gap-0.5 items-end h-6">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500/80 rounded-xs"
                  style={{ height: `${80 + Math.random() * 20}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Queue monitor */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            KAFKA QUEUE LAG
          </div>
          <div className="flex flex-col gap-0.5 text-[8px]">
            <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-900">
              <span>topic.user-events</span>
              <span className="text-emerald-600 dark:text-emerald-500">
                0 LAG
              </span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-900">
              <span>topic.email-notify</span>
              <span className="text-amber-600 dark:text-amber-500">12 LAG</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>topic.payment-db</span>
              <span className="text-emerald-600 dark:text-emerald-500">
                0 LAG
              </span>
            </div>
          </div>
        </div>

        {/* Redis hits */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-550 dark:text-slate-400 flex flex-col justify-between shadow-xl">
          <div className="text-[10px] text-slate-800 dark:text-slate-300 font-bold mb-1.5 border-b border-slate-200 dark:border-slate-900/60 pb-1">
            REDIS CACHE STATS
          </div>
          <div className="flex flex-col gap-1.5 justify-center py-1">
            <div>
              <div className="flex justify-between text-[8px] text-slate-400 dark:text-slate-500 mb-0.5">
                <span>CACHE HIT RATIO</span>
                <span className="text-primary font-bold">87.5%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "87.5%" }} />
              </div>
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 dark:text-slate-500">
              <span>KEYS INSTORE</span>
              <span>42,109</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
