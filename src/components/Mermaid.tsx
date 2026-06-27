"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Maximize2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MermaidProps {
  chart: string;
  className?: string;
}

export function Mermaid({ chart, className = "" }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || typeof chart !== "string") {
        setError("No valid chart code provided");
        return;
      }

      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import("mermaid")).default;

        // Process chart string: replace custom tokens with their respective characters,
        // and decode standard HTML entities that can be parsed by Next.js/MDX compiler.
        const processedChart = chart
          .replace(/\[nl\]/g, "\n")
          .replace(/\[br\]/g, "<br/>")
          .replace(/\\n/g, "\n")
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        console.log("PROCESSED CHART:", JSON.stringify(processedChart));

        const isDark = resolvedTheme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          themeVariables: isDark
            ? {
                primaryColor: "#3b82f6",
                primaryTextColor: "#e5e7eb",
                primaryBorderColor: "#4b5563",
                lineColor: "#9ca3af",
                secondaryColor: "#1f2937",
                tertiaryColor: "#111827",
                background: "#0d1117",
                mainBkg: "#1f2937",
                nodeBorder: "#4b5563",
                clusterBkg: "#1f2937",
                clusterBorder: "#4b5563",
                titleColor: "#e5e7eb",
                edgeLabelBackground: "#1f2937",
                fontFamily: "Georgia, Times New Roman, serif",
              }
            : {
                primaryColor: "#2563eb",
                primaryTextColor: "#1f2937",
                primaryBorderColor: "#d1d5db",
                lineColor: "#4b5563",
                secondaryColor: "#f3f4f6",
                tertiaryColor: "#f9fafb",
                background: "#ffffff",
                mainBkg: "#f3f4f6",
                nodeBorder: "#d1d5db",
                clusterBkg: "#f3f4f6",
                clusterBorder: "#d1d5db",
                titleColor: "#1f2937",
                edgeLabelBackground: "#ffffff",
                fontFamily: "Georgia, Times New Roman, serif",
              },
          flowchart: {
            htmlLabels: true,
            curve: "basis",
          },
          securityLevel: "loose",
        });

        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg } = await mermaid.render(id, processedChart);
        setSvg(svg);
        setError("");
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to render diagram",
        );
      }
    };

    renderChart();
  }, [chart, resolvedTheme]);

  if (error) {
    return (
      <div
        className={`my-6 p-4 rounded-lg border border-red-500/50 bg-red-500/10 ${className}`}
      >
        <p className="text-red-500 text-sm">Diagram Error: {error}</p>
        <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div className="relative group my-6">
      <div
        ref={containerRef}
        className={`flex justify-center overflow-x-auto p-4 rounded-lg bg-[#f9fafb] dark:bg-[#0d1117] border border-border ${className}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {svg && !error && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="absolute top-3 right-3 p-1.5 rounded-md border bg-background text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
              title="Expand diagram"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent
            className="min-w-[60vw] md:min-w-[90vw] min-h-[40vh] md:min-h-[90vh] border-none bg-[#f9fafb] dark:bg-[#0d1117] p-8 shadow-xl flex flex-col items-center justify-center [&>button]:cursor-pointer"
            showCloseButton={true}
          >
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <DialogClose asChild>
              <div
                className="w-full h-full overflow-auto flex items-center justify-center cursor-zoom-out p-4 [&_svg]:max-w-full [&_svg]:max-h-[80vh] [&_svg]:w-auto [&_svg]:h-auto select-none"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
