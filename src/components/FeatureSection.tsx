"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useRef } from "react";

interface FeatureSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  illustration: ReactNode;
  imagePosition?: "left" | "right";
}

export function FeatureSection({
  title,
  description,
  buttonText,
  buttonLink,
  illustration,
  imagePosition = "right",
}: FeatureSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative w-full h-full flex items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
    >
      {/* Subtle gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] dark:from-primary/[0.06] dark:via-transparent dark:to-accent/[0.06] pointer-events-none" />

      {/* Faint radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.04] dark:bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center ${
            imagePosition === "left" ? "" : ""
          }`}
        >
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`flex flex-col justify-center ${
              imagePosition === "left" ? "md:order-2" : ""
            }`}
          >
            {/* Subtle label */}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-primary/70 mb-4"
            >
              {title === "Engineering Terms"
                ? "Curated knowledge base"
                : "Real-time workspace"}
            </motion.span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-slate-900 dark:text-white leading-[1.1]">
              {title}
            </h2>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
              {description}
            </p>

            <Link
              href={buttonLink}
              className="group inline-flex items-center gap-2.5 w-fit px-6 py-3 rounded-xl text-sm font-semibold font-mono tracking-wider
                                bg-white dark:bg-white border border-slate-200 dark:border-transparent
                                text-slate-900 dark:text-slate-950
                                shadow-lg shadow-slate-200/40 dark:shadow-black/20
                                transition-all duration-300
                                hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-black/30
                                hover:scale-[1.02] active:scale-[0.98]"
            >
              {buttonText.toUpperCase()}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className={`relative ${
              imagePosition === "left" ? "md:order-1" : ""
            }`}
          >
            {/* Decorative ring behind the illustration */}
            <div className="absolute inset-0 -m-4 rounded-3xl border border-slate-200/40 dark:border-slate-800/30 pointer-events-none" />

            {/* Glass panel */}
            <div className="relative bg-white/30 dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/30">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-2xl pointer-events-none" />

              <div className="relative z-10">{illustration}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
