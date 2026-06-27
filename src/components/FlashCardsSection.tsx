"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Scattered nodes and snippets data for Flash Cards
const cardNodes = [
  {
    name: "Active Recall",
    status: "testing memory...",
    color: "bg-indigo-500",
    posClass: "left-[4%] top-[18%] md:left-[6%] md:top-[20%]",
  },
  {
    name: "Leitner System",
    status: "sorting card piles...",
    color: "bg-emerald-500",
    posClass: "left-[2%] bottom-[18%] md:left-[4%] md:bottom-[20%]",
  },
  {
    name: "SuperMemo-2",
    status: "calculating intervals...",
    color: "bg-rose-500",
    posClass: "right-[4%] top-[18%] md:right-[6%] md:top-[20%]",
  },
  {
    name: "Retention Rate",
    status: "tracking decay curve...",
    color: "bg-amber-500",
    posClass: "right-[2%] bottom-[18%] md:right-[6%] md:bottom-[20%]",
  },
];

const cardSnippets = [
  {
    text: "spaced_repetition.schedule(card)",
    posClass: "left-[14%] top-[45%] md:left-[16%]",
    delay: 0,
  },
  {
    text: "flashcard.flip() -> show_answer",
    posClass: "right-[12%] top-[55%] md:right-[15%]",
    delay: 1.5,
  },
  {
    text: "active_recall_interval = 2.5",
    posClass: "left-[12%] bottom-[32%] md:left-[14%]",
    delay: 0.8,
  },
  {
    text: "retention_rate = Math.exp(-t/halflife)",
    posClass: "right-[20%] top-[8%]",
    delay: 2.2,
  },
];

// Custom SVG Icons for Floating Cards
const Dbmssvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 text-primary stroke-current fill-none"
    strokeWidth="1.5"
  >
    {/* Cylinders */}
    <path
      d="M 30,30 C 30,22 70,22 70,30 L 70,70 C 70,78 30,78 30,70 Z"
      className="stroke-slate-400 dark:stroke-slate-700"
    />
    <path
      d="M 30,30 C 30,38 70,38 70,30"
      className="stroke-slate-500 dark:stroke-slate-600"
    />
    <path
      d="M 30,50 C 30,58 70,58 70,50"
      className="stroke-slate-500 dark:stroke-slate-600"
    />
    {/* Table representation overlay */}
    <rect
      x="52"
      y="45"
      width="28"
      height="24"
      rx="3"
      className="fill-white dark:fill-slate-900 stroke-primary"
      strokeWidth="1.2"
    />
    <line
      x1="52"
      y1="53"
      x2="80"
      y2="53"
      className="stroke-primary"
      strokeWidth="0.8"
    />
    <line
      x1="52"
      y1="61"
      x2="80"
      y2="61"
      className="stroke-primary"
      strokeWidth="0.8"
    />
    <line
      x1="61"
      y1="45"
      x2="61"
      y2="69"
      className="stroke-primary"
      strokeWidth="0.8"
    />
    <line
      x1="71"
      y1="45"
      x2="71"
      y2="69"
      className="stroke-primary"
      strokeWidth="0.8"
    />
    {/* Magnifying Glass */}
    <circle
      cx="78"
      cy="72"
      r="5"
      className="fill-white dark:fill-slate-900 stroke-amber-500"
      strokeWidth="1.2"
    />
    <line
      x1="81.5"
      y1="75.5"
      x2="88"
      y2="82"
      className="stroke-amber-500"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Aimlsvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 text-emerald-500 stroke-current fill-none"
    strokeWidth="1.5"
  >
    {/* Neural nodes */}
    <circle
      cx="30"
      cy="50"
      r="4.5"
      className="fill-emerald-500/20 stroke-emerald-500"
    />
    <circle
      cx="55"
      cy="30"
      r="4.5"
      className="fill-emerald-500/20 stroke-emerald-500"
    />
    <circle
      cx="55"
      cy="50"
      r="4.5"
      className="fill-emerald-500/20 stroke-emerald-500"
    />
    <circle
      cx="55"
      cy="70"
      r="4.5"
      className="fill-emerald-500/20 stroke-emerald-500"
    />
    <circle
      cx="80"
      cy="40"
      r="4.5"
      className="fill-emerald-500/20 stroke-emerald-500"
    />
    <circle
      cx="80"
      cy="60"
      r="4.5"
      className="fill-emerald-500/20 stroke-emerald-500"
    />
    {/* Connections */}
    <line
      x1="34.5"
      y1="50"
      x2="50.5"
      y2="30"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeWidth="1"
    />
    <line
      x1="34.5"
      y1="50"
      x2="50.5"
      y2="50"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeWidth="1"
    />
    <line
      x1="34.5"
      y1="50"
      x2="50.5"
      y2="70"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeWidth="1"
    />

    <line
      x1="59.5"
      y1="30"
      x2="75.5"
      y2="40"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeWidth="1"
    />
    <line
      x1="59.5"
      y1="50"
      x2="75.5"
      y2="40"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeWidth="1"
    />
    <line
      x1="59.5"
      y1="50"
      x2="75.5"
      y2="60"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeWidth="1"
    />
    <line
      x1="59.5"
      y1="70"
      x2="75.5"
      y2="60"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeWidth="1"
    />
    {/* Sine wave activity line */}
    <path
      d="M 15,15 Q 25,30 35,15 T 55,15 T 75,25 T 90,10"
      className="stroke-amber-500"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const Networksvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 text-rose-500 stroke-current fill-none"
    strokeWidth="1.5"
  >
    <circle
      cx="35"
      cy="35"
      r="4"
      className="fill-rose-500/20 stroke-rose-500"
    />
    <circle
      cx="65"
      cy="35"
      r="4"
      className="fill-rose-500/20 stroke-rose-500"
    />
    <circle
      cx="35"
      cy="65"
      r="4"
      className="fill-rose-500/20 stroke-rose-500"
    />
    <circle
      cx="65"
      cy="65"
      r="4"
      className="fill-rose-500/20 stroke-rose-500"
    />
    {/* Topology Arrows */}
    <line
      x1="39"
      y1="35"
      x2="61"
      y2="35"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <line
      x1="35"
      y1="39"
      x2="35"
      y2="61"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <line
      x1="65"
      y1="39"
      x2="65"
      y2="61"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <line
      x1="39"
      y1="65"
      x2="61"
      y2="65"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <line
      x1="39"
      y1="39"
      x2="61"
      y2="61"
      className="stroke-slate-300 dark:stroke-slate-800"
      strokeDasharray="2 2"
    />
    {/* Globe Overlay */}
    <circle
      cx="75"
      cy="70"
      r="10"
      className="fill-white dark:fill-slate-900 stroke-primary"
      strokeWidth="1"
    />
    <ellipse
      cx="75"
      cy="70"
      rx="4"
      ry="10"
      className="stroke-primary"
      strokeWidth="0.8"
    />
    <line
      x1="65"
      y1="70"
      x2="85"
      y2="70"
      className="stroke-primary"
      strokeWidth="0.8"
    />
  </svg>
);

const Securitysvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 text-indigo-500 stroke-current fill-none"
    strokeWidth="1.5"
  >
    {/* Shield */}
    <path
      d="M 30,25 C 50,20 50,20 70,25 L 70,50 C 70,68 50,78 50,78 C 50,78 30,68 30,50 Z"
      className="fill-indigo-500/10 stroke-indigo-500"
    />
    <circle cx="50" cy="46" r="3.5" className="fill-indigo-500" />
    <path
      d="M 50,49.5 L 50,60"
      className="stroke-indigo-500"
      strokeWidth="2.5"
    />
    {/* Lock Overlay */}
    <rect
      x="62"
      y="55"
      width="22"
      height="18"
      rx="3.5"
      className="fill-white dark:fill-slate-900 stroke-amber-500"
      strokeWidth="1.2"
    />
    <path
      d="M 67,55 L 67,49 C 67,44 79,44 79,49 L 79,55"
      className="stroke-amber-500"
      strokeWidth="1.2"
    />
  </svg>
);

const Websvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 text-amber-500 stroke-current fill-none"
    strokeWidth="1.5"
  >
    {/* Browser Layout */}
    <rect
      x="25"
      y="25"
      width="50"
      height="36"
      rx="4"
      className="fill-amber-500/10 stroke-amber-500"
    />
    <circle cx="31" cy="31" r="1.5" className="fill-amber-500 stroke-none" />
    <circle cx="36" cy="31" r="1.5" className="fill-amber-500 stroke-none" />
    <circle cx="41" cy="31" r="1.5" className="fill-amber-500 stroke-none" />
    {/* Tag text representation */}
    <path
      d="M 34,48 L 40,43 L 34,38"
      className="stroke-amber-500"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 66,48 L 60,43 L 66,38"
      className="stroke-amber-500"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="52"
      y1="37"
      x2="48"
      y2="49"
      className="stroke-amber-500"
      strokeWidth="1.2"
    />
    {/* Nodes connecting */}
    <line
      x1="50"
      y1="61"
      x2="50"
      y2="73"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <line
      x1="50"
      y1="73"
      x2="35"
      y2="73"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <line
      x1="50"
      y1="73"
      x2="65"
      y2="73"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <circle
      cx="35"
      cy="73"
      r="2.5"
      className="fill-white dark:fill-slate-950 stroke-slate-500"
    />
    <circle
      cx="65"
      cy="73"
      r="2.5"
      className="fill-white dark:fill-slate-950 stroke-slate-500"
    />
  </svg>
);

const Devopssvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 text-cyan-500 stroke-current fill-none"
    strokeWidth="1.5"
  >
    {/* Infinity loop */}
    <path
      d="M 32,50 C 12,65 12,35 32,50 C 52,65 68,65 68,50 C 68,35 52,35 32,50"
      className="stroke-cyan-500"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Gear gears overlay */}
    <circle
      cx="50"
      cy="50"
      r="6"
      className="stroke-amber-500 fill-white dark:fill-slate-900"
    />
    <path
      d="M 50,41 L 50,43 M 50,57 L 50,59 M 41,50 L 43,50 M 57,50 L 59,50"
      className="stroke-amber-500"
      strokeWidth="1.5"
    />
  </svg>
);

const Sysdesignsvg = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-10 h-10 text-primary stroke-current fill-none"
    strokeWidth="1.5"
  >
    {/* Gateway node */}
    <rect
      x="42"
      y="20"
      width="16"
      height="12"
      rx="2"
      className="fill-white dark:fill-slate-900 stroke-primary"
    />
    {/* Cluster */}
    <rect
      x="20"
      y="52"
      width="16"
      height="12"
      rx="2"
      className="fill-white dark:fill-slate-900 stroke-slate-400 dark:stroke-slate-700"
    />
    <rect
      x="42"
      y="52"
      width="16"
      height="12"
      rx="2"
      className="fill-white dark:fill-slate-950 stroke-slate-400 dark:stroke-slate-700"
    />
    <rect
      x="64"
      y="52"
      width="16"
      height="12"
      rx="2"
      className="fill-white dark:fill-slate-900 stroke-slate-400 dark:stroke-slate-700"
    />
    {/* Arrows */}
    <path
      d="M 50,32 L 50,45"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <path
      d="M 50,45 L 28,45 L 28,52"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <path
      d="M 50,45 L 72,45 L 72,52"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    <path
      d="M 50,45 L 50,52"
      className="stroke-slate-300 dark:stroke-slate-800"
    />
    {/* Database nodes */}
    <circle
      cx="50"
      cy="78"
      r="3.5"
      className="fill-white dark:fill-slate-950 stroke-amber-500"
    />
    <line
      x1="50"
      y1="64"
      x2="50"
      y2="74"
      className="stroke-amber-500"
      strokeWidth="1"
      strokeDasharray="1.5 1.5"
    />
  </svg>
);

interface TopicCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  x?: number;
  y?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function FloatingTopicCard({
  title,
  description,
  icon,
  x,
  y,
  onMouseEnter,
  onMouseLeave,
}: TopicCardProps) {
  const isOrbit = x !== undefined && y !== undefined;
  return (
    <div
      className={`select-none cursor-pointer w-[220px] h-[110px] z-10 transition-transform duration-300 ${
        isOrbit ? "absolute" : "relative"
      }`}
      style={
        isOrbit
          ? {
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }
          : undefined
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="group relative w-full h-full">
        {/* Back Card (Detail Drawer) - Always slides down */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-slate-900/80 rounded-2xl p-4 flex flex-col justify-center shadow-lg transition-all duration-500 ease-out translate-y-[4px] rotate-1 opacity-70 group-hover:translate-y-[85%] group-hover:rotate-0 group-hover:opacity-100 z-0">
          <span className="text-[10px] md:text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {description}
          </span>
        </div>

        {/* Front Card (Title & Icon) */}
        <div className="absolute inset-0 bg-white dark:bg-zinc-900/95 border border-slate-200 dark:border-slate-800/85 shadow-xl dark:shadow-black/45 rounded-2xl p-4 flex flex-col items-center justify-center z-10 transition-transform duration-350 ease-out group-hover:-translate-y-1.5">
          <div className="mb-1.5 transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
          <span className="text-[10px] md:text-xs font-mono font-bold text-slate-800 dark:text-slate-200 text-center tracking-wide">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FlashCardsSection() {
  const [angleOffset, setAngleOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Orbit Animation Loop
  useEffect(() => {
    if (isPaused) return;
    let lastTime = performance.now();
    let frameId: number;

    const update = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      // 0.08 rad/sec (~78 seconds for one full revolution)
      setAngleOffset((prev) => (prev + delta * 0.08) % (2 * Math.PI));
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  const topicCards = [
    {
      title: "DBMS Fundamentals",
      description:
        "DBMS: Understand databases, SQL querying, normalization, indexing, and ACID transactions with concise flashcards.",
      icon: <Dbmssvg />,
    },
    {
      title: "AI/ML Principles",
      description:
        "AI/ML: Learn neural networks, machine learning algorithms, deep models, optimization, and AI applications.",
      icon: <Aimlsvg />,
    },
    {
      title: "Networking Protocols",
      description:
        "Networking: Explore TCP/IP models, routing metrics, socket layers, switching routing tables, and Wi-Fi networks.",
      icon: <Networksvg />,
    },
    {
      title: "Cyber Security",
      description:
        "Cyber Security: Grasp security frameworks, cryptography keys, threat modeling, vulnerability scanning, and defense.",
      icon: <Securitysvg />,
    },
    {
      title: "Web Development",
      description:
        "Web Dev: Covers HTML/CSS layout rendering engines, JS event execution context, DOM rendering trees, and API design.",
      icon: <Websvg />,
    },
    {
      title: "DevOps Fundamentals",
      description:
        "DevOps: Learn CI/CD orchestration pipelines, docker image layers, container configurations, and infrastructure code.",
      icon: <Devopssvg />,
    },
    {
      title: "System Design",
      description:
        "System Design: Break down horizontal scaling patterns, consistent hashing rings, caching, CDN caches, and DB sharding.",
      icon: <Sysdesignsvg />,
    },
  ];

  // Ellipse parameters for desktop layout
  const a = 820; // Horizontal radius
  const b = 410; // Vertical radius

  // Position cards dynamically along the ellipse based on current angleOffset
  const cards = topicCards.map((card, i) => {
    const baseAngle = (i * 2 * Math.PI) / topicCards.length;
    const angle = (baseAngle + angleOffset) % (2 * Math.PI);
    const x = a * Math.cos(angle);
    const y = b * Math.sin(angle);
    const isUpper = y < 0;
    return { ...card, x, y, isUpper };
  });

  return (
    <section className="relative w-full min-h-screen lg:h-full flex items-center justify-center overflow-visible lg:overflow-hidden bg-slate-50 dark:bg-black px-4 py-12 lg:py-0 transition-colors duration-500">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/2 via-transparent to-primary/3 dark:from-amber-500/2 dark:via-transparent dark:to-primary/4 pointer-events-none" />

      {/* Faint radial glow */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/3 dark:bg-amber-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* Faint grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Scattered Nodes (Status Badges) */}
      {cardNodes.map((node, i) => (
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
              <span className="text-[9px] font-mono font-bold text-slate-700 dark:text-slate-350">
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
      {cardSnippets.map((snippet, i) => (
        <motion.div
          key={snippet.text}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.35, y: 0 }}
          viewport={{ once: true }}
          className={`absolute ${snippet.posClass} hidden sm:block pointer-events-none font-mono text-[10px] text-slate-400 dark:text-slate-600 tracking-wide select-none`}
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

      {/* Ellipse Orbit Line - Hidden on Mobile */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block">
        <ellipse
          cx="50%"
          cy="50%"
          rx={a}
          ry={b}
          className="stroke-slate-200/70 dark:stroke-slate-800/40 fill-none"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Orbiting Surrounding Cards Wrapper - Hidden on Mobile */}
      <div className="absolute inset-0 z-10 hidden lg:block pointer-events-none">
        <div className="w-full h-full relative pointer-events-auto">
          {cards.map((card, i) => (
            <FloatingTopicCard
              key={i}
              {...card}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            />
          ))}
        </div>
      </div>

      {/* Static Scattered Cards for Mobile Screens only - Hidden on Desktop */}
      <div className="absolute inset-0 lg:hidden pointer-events-none z-10 overflow-hidden">
        {/* DBMS Fundamentals - top left */}
        <div className="absolute top-[2%] left-[2%] -rotate-6 scale-[0.7] origin-top-left pointer-events-auto">
          <FloatingTopicCard
            title="DBMS Fundamentals"
            description="DBMS: Understand databases, SQL querying, normalization, indexing, and ACID transactions with concise flashcards."
            icon={<Dbmssvg />}
          />
        </div>

        {/* AI/ML Principles - top right */}
        <div className="absolute top-[10%] right-[2%] rotate-3 scale-[0.7] origin-top-right pointer-events-auto">
          <FloatingTopicCard
            title="AI/ML Principles"
            description="AI/ML: Learn neural networks, machine learning algorithms, deep models, optimization, and AI applications."
            icon={<Aimlsvg />}
          />
        </div>

        {/* Networking Protocols - bottom left */}
        <div className="absolute bottom-[10%] left-[2%] rotate-3 scale-[0.7] origin-bottom-left pointer-events-auto">
          <FloatingTopicCard
            title="Networking Protocols"
            description="Networking: Explore TCP/IP models, routing metrics, socket layers, switching routing tables, and Wi-Fi networks."
            icon={<Networksvg />}
          />
        </div>

        {/* System Design - bottom right */}
        <div className="absolute bottom-[2%] right-[2%] -rotate-6 scale-[0.7] origin-bottom-right pointer-events-auto">
          <FloatingTopicCard
            title="System Design"
            description="System Design: Break down horizontal scaling patterns, consistent hashing rings, caching, CDN caches, and DB sharding."
            icon={<Sysdesignsvg />}
          />
        </div>
      </div>

      {/* Centerpiece Master Card - Always Visible */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="group w-full max-w-[720px] bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl relative z-20 flex flex-col md:flex-row gap-8 items-center"
      >
        {/* Glow Ring */}
        <div className="absolute -inset-px bg-linear-to-tr from-primary/10 via-transparent to-primary/10 dark:from-primary/5 dark:via-transparent dark:to-primary/5 rounded-2xl pointer-events-none" />

        {/* Left Side: 3D Stacked Card Illustration (Fanning on Hover) */}
        <div className="relative w-[160px] h-[190px] shrink-0">
          {/* Background Sheet 3 */}
          <div className="absolute inset-0 bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-900/30 rounded-xl transition-all duration-500 ease-out -rotate-12 -translate-x-5 translate-y-3 shadow-sm group-hover:-rotate-12 group-hover:-translate-x-8 group-hover:translate-y-5" />

          {/* Background Sheet 2 */}
          <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-900/60 rounded-xl transition-all duration-500 ease-out -rotate-6 -translate-x-2.5 translate-y-1.5 shadow-md group-hover:-rotate-6 group-hover:-translate-x-4 group-hover:translate-y-2.5" />

          {/* Foreground Top Document Card */}
          <div className="absolute inset-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-black/50 rounded-xl p-4 flex flex-col justify-between transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex flex-col gap-2">
              <span className="text-[8px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500/80 uppercase">
                System Design
              </span>
              <div className="h-px bg-slate-100 dark:bg-slate-800/60 w-full my-0.5" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-250 leading-tight">
                What is Idempotency?
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="h-1 w-full bg-slate-100 dark:bg-slate-900 rounded-full" />
              <div className="h-1 w-[80%] bg-slate-100 dark:bg-slate-900 rounded-full" />
              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-50 dark:border-slate-900">
                <span className="text-[7px] font-mono text-slate-400 dark:text-slate-500">
                  Double-sided
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Star Badge Indicator */}
            <div className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 flex items-center justify-center text-[9px] text-amber-500">
              ★
            </div>
          </div>
        </div>

        {/* Right Side: Feature Information details */}
        <div className="flex-1 text-left w-full">
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-[9px] font-bold font-mono tracking-widest text-slate-500 dark:text-slate-400 mb-4 inline-block uppercase">
            Feature
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-none">
            Flash Cards
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Revise key concepts across CS fundamentals with bite-sized
            flashcards—anytime, anywhere.
          </p>

          {/* Mini Topics List tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {[
              "DBMS",
              "AI/ML",
              "Networks",
              "Cybersecurity",
              "DevOps",
              "Web Dev",
              "System Design",
              "+ More",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-md font-mono text-[9px] font-medium text-slate-500 dark:text-slate-400 select-none"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/flashcards"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-300 hover:opacity-90 shadow-xl shadow-black/10"
          >
            START REVISING
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
