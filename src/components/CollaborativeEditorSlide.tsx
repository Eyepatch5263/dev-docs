"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  Edit3,
  FileText,
  GitFork,
  Globe,
  Link2,
  MessageSquare,
  MoreHorizontal,
  PlayCircle,
  Plus,
  Search,
  Send,
  Shield,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";

const workflowSteps = [
  {
    icon: Users,
    label: "Collaborate",
    description: "Invite others and work together in real-time.",
  },
  {
    icon: GitFork,
    label: "Fork",
    description: "Fork the document to save a copy and make changes.",
  },
  {
    icon: Send,
    label: "Submit",
    description: "Only the original creator can submit for review.",
  },
  {
    icon: Shield,
    label: "Admin Review",
    description: "Admins review and approve before publishing.",
  },
  {
    icon: Globe,
    label: "Published",
    description: "Once approved, it goes live for everyone.",
  },
];

const documents = [
  {
    title: "Database Indexing Explained",
    edited: "Edited just now",
    collaborators: 2,
    time: "2 min ago",
    by: "Arjun",
    status: "DRAFT",
  },
  {
    title: "CAP Theorem in Depth",
    edited: "Edited 1 hour ago",
    collaborators: 1,
    time: "1 hour ago",
    by: "You",
    status: "SUBMITTED",
  },
  {
    title: "Consistency Models",
    edited: "Edited yesterday",
    collaborators: 0,
    time: "Yesterday",
    by: "Sarthak",
    status: "APPROVED",
  },
  {
    title: "Load Balancer Patterns",
    edited: "Edited 2 days ago",
    collaborators: 3,
    time: "2 days ago",
    by: "You",
    status: "PUBLISHED",
  },
  {
    title: "Caching Strategies",
    edited: "Edited 3 days ago",
    collaborators: 0,
    time: "3 days ago",
    by: "You",
    status: "DRAFT",
  },
];

const activities = [
  {
    user: "Arjun",
    action: "made changes to",
    doc: "Database Indexing Explained",
    time: "Just now",
    icon: Edit3,
  },
  {
    user: "You",
    action: "submitted",
    doc: "CAP Theorem in Depth",
    time: "1 hour ago",
    icon: Send,
  },
  {
    user: "Sarthak",
    action: "commented on",
    doc: "Consistency Models",
    time: "Yesterday",
    icon: MessageSquare,
  },
  {
    user: "Kunal",
    action: "forked",
    doc: "Load Balancer Patterns",
    time: "2 days ago",
    icon: GitFork,
  },
  {
    user: "Admin",
    action: "approved",
    doc: "Consistency Models",
    time: "2 days ago",
    icon: CheckCircle,
  },
];

const statusStyle: Record<string, string> = {
  DRAFT:
    "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400",
  SUBMITTED:
    "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-slate-300",
  APPROVED:
    "border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-200",
  PUBLISHED:
    "border-slate-500 dark:border-slate-400 text-slate-800 dark:text-slate-100",
};

export function CollaborativeEditorSlide() {
  return (
    <section className="relative w-full min-h-screen lg:h-screen flex flex-col overflow-visible lg:overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-100/50 via-transparent to-slate-100/30 dark:from-slate-900/50 dark:via-transparent dark:to-slate-900/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full min-h-inherit lg:h-full mx-auto px-8 lg:px-16 xl:px-24 flex flex-col justify-between py-10 lg:py-12 overflow-visible lg:overflow-hidden">
        {/* ─── Top Row: Hero Text + How It Works ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-6"
        >
          {/* Left: Heading */}
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-4">
              Collaborative Editor
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-2">
              Write together.
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-400 dark:text-slate-500 leading-[1.1] mb-4">
              Publish better.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 max-w-md">
              Collaborate in real-time, fork to experiment, and publish only the
              best knowledge.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/collaborative-editor"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-mono tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg transition-all duration-200 hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Document
              </Link>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold font-mono tracking-wider border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200">
                <PlayCircle className="w-3.5 h-3.5" />
                Learn how it works
              </button>
            </div>
          </div>

          {/* Right: How it works */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-5">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              How it works
            </h3>
            <div className="flex items-start justify-between gap-1">
              {workflowSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex flex-col items-center text-center flex-1 relative"
                  >
                    {/* Arrow connector */}
                    {i < workflowSteps.length - 1 && (
                      <div className="absolute top-4 left-[60%] w-[80%] h-px bg-slate-200 dark:bg-slate-800 z-0" />
                    )}
                    <div className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center mb-2 relative z-10">
                      <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      {step.label}
                    </span>
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 leading-tight hidden lg:block max-w-[80px]">
                      {step.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ─── Middle Row: Share Link + Live Collaborators ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6"
        >
          {/* Share link */}
          <div className="lg:col-span-3 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Start collaborating
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">
              Share a link with others to collaborate on a document in
              real-time.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
                <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                  https://explainbytes.tech/doc/abc123
                </span>
              </div>
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <Globe className="w-3 h-3" /> Anyone with the link
              </span>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[11px] font-semibold font-mono tracking-wide whitespace-nowrap">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Live collaborators */}
          <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 flex flex-col justify-center">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Live Collaborators
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "S", "K"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {initial}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  +3
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-400 animate-pulse" />
                7 people are editing this document
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Bottom Row: Documents Table + Recent Activity ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 flex-1 min-h-0"
        >
          {/* Documents table */}
          <div className="lg:col-span-3 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 flex flex-col overflow-hidden">
            {/* Table header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Documents
              </h3>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400">
                    Search documents...
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-3 border-b border-slate-100 dark:border-slate-800/50 pb-2">
              {["All", "Owned by me", "Shared with me", "Forked by me"].map(
                (tab, i) => (
                  <span
                    key={tab}
                    className={`text-[10px] font-medium cursor-default ${
                      i === 0
                        ? "text-slate-800 dark:text-slate-200 border-b border-slate-800 dark:border-slate-200 pb-2 -mb-2"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {tab}
                  </span>
                ),
              )}
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 mb-2 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
              <span className="col-span-4">Document</span>
              <span className="col-span-2 hidden sm:block">Collaborators</span>
              <span className="col-span-3 hidden sm:block">Last Updated</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-1"></span>
            </div>

            {/* Document rows */}
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/30 flex-1 overflow-hidden">
              {documents.map((doc) => (
                <div
                  key={doc.title}
                  className="grid grid-cols-12 gap-2 items-center py-2.5"
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                    <div>
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block leading-tight">
                        {doc.title}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500">
                        {doc.edited}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:flex items-center gap-1">
                    <div className="flex -space-x-1">
                      {Array.from({
                        length: Math.min(doc.collaborators + 1, 3),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 text-[7px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    {doc.collaborators > 0 && (
                      <span className="text-[9px] text-slate-400 dark:text-slate-500">
                        +{doc.collaborators}
                      </span>
                    )}
                  </div>
                  <div className="col-span-3  sm:block">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {doc.time}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">
                      by {doc.by}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border ${statusStyle[doc.status]}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  </div>
                </div>
              ))}
            </div>

            {/* View all link */}
            <Link
              href="/collaborative-editor"
              className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/40 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              View all documents <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Recent Activity
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors">
                View all
              </span>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-hidden">
              {activities.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {item.user}
                        </span>{" "}
                        {item.action}{" "}
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {item.doc}
                        </span>
                      </p>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500">
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ─── Footer Note ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500"
        >
          <Shield className="w-3 h-3" />
          Only document owners can submit for review and publish. Admins ensure
          quality before it goes live.
        </motion.div>
      </div>
    </section>
  );
}
