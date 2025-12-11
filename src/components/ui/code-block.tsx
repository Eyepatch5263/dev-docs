import { cn } from "@/lib/utils";

interface CodeBlockProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function CodeBlock({ children, className, title }: CodeBlockProps) {
    return (
        <div
            className={cn(
                "rounded-lg border border-border bg-[#1e1e1e] overflow-hidden shadow-lg",
                className
            )}
        >
            {/* Mac-style title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#2d2d2d] border-b border-[#404040]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_0_1px_#e0443e]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_0_1px_#dea123]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_0_1px_#1aab29]" />
                </div>
                {title && (
                    <span className="ml-2 text-xs text-[#8b8b8b] font-medium">
                        {title}
                    </span>
                )}
            </div>
            {/* Code content */}
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}
