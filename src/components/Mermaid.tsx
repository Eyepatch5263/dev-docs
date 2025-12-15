"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidProps {
    chart: string;
    className?: string;
}

export function Mermaid({ chart, className = "" }: MermaidProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const renderChart = async () => {
            try {
                // Dynamically import mermaid to avoid SSR issues
                const mermaid = (await import("mermaid")).default;

                mermaid.initialize({
                    startOnLoad: false,
                    theme: "dark",
                    themeVariables: {
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
                    },
                    flowchart: {
                        htmlLabels: true,
                        curve: "basis",
                    },
                    securityLevel: "loose",
                });

                const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
                setError("");
            } catch (err) {
                console.error("Mermaid rendering error:", err);
                setError(err instanceof Error ? err.message : "Failed to render diagram");
            }
        };

        renderChart();
    }, [chart]);

    if (error) {
        return (
            <div className={`my-6 p-4 rounded-lg border border-red-500/50 bg-red-500/10 ${className}`}>
                <p className="text-red-500 text-sm">Diagram Error: {error}</p>
                <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
                    {chart}
                </pre>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`my-6 flex justify-center overflow-x-auto p-4 rounded-lg bg-[#0d1117] border border-border ${className}`}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
