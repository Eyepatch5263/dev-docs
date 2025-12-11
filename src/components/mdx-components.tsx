import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// Language display names
const languageDisplay: Record<string, string> = {
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    tsx: "TypeScript (TSX)",
    jsx: "JavaScript (JSX)",
    python: "Python",
    py: "Python",
    bash: "Terminal",
    sh: "Terminal",
    shell: "Terminal",
    zsh: "Terminal",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    css: "CSS",
    html: "HTML",
    sql: "SQL",
    go: "Go",
    rust: "Rust",
    plaintext: "Plain Text",
    text: "Plain Text",
};

// Mac-style code block wrapper
function Pre({
    children,
    className,
    ...props
}: ComponentPropsWithoutRef<"pre">) {
    return (
        <pre
            className={cn("overflow-x-auto p-4 text-sm leading-relaxed", className)}
            {...props}
        >
            {children}
        </pre>
    );
}

// Custom figure wrapper for rehype-pretty-code
function Figure({
    children,
    className,
    ...props
}: ComponentPropsWithoutRef<"figure">) {
    // Check if this is a code block (has data-rehype-pretty-code-figure)
    const isCodeBlock =
        props["data-rehype-pretty-code-figure" as keyof typeof props] !== undefined;

    if (!isCodeBlock) {
        return (
            <figure className={className} {...props}>
                {children}
            </figure>
        );
    }

    // Extract language from the figcaption or data attribute
    let language = "Code";
    const dataLanguage = props["data-language" as keyof typeof props] as string;
    if (dataLanguage) {
        language = languageDisplay[dataLanguage] || dataLanguage.toUpperCase();
    }

    return (
        <figure
            className={cn(
                "my-6 rounded-xl border overflow-hidden shadow-lg",
                "bg-[#f6f8fa] border-[#d0d7de] dark:bg-[#0d1117] dark:border-[#30363d]",
                className
            )}
            {...props}
        >
            {/* Mac-style title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-[#f0f3f6] border-[#d0d7de] dark:bg-[#161b22] dark:border-[#30363d]">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 text-center">
                    <span className="text-xs font-medium text-[#57606a] dark:text-[#8b949e]">{language}</span>
                </div>
                <div className="w-13" />
            </div>
            {/* Code content */}
            <div className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_pre]:p-4 [&_pre]:!bg-transparent [&_code]:!bg-transparent">
                {children}
            </div>
        </figure>
    );
}

function Code({
    children,
    className,
    ...props
}: ComponentPropsWithoutRef<"code">) {
    // Check if this is an inline code (no language class)
    const isInline = !className?.includes("language-");

    if (isInline) {
        return (
            <code
                className={cn(
                    "relative rounded-md bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium text-foreground",
                    className
                )}
                {...props}
            >
                {children}
            </code>
        );
    }

    return (
        <code className={cn("font-mono text-sm", className)} {...props}>
            {children}
        </code>
    );
}

export const mdxComponents = {
    pre: Pre,
    code: Code,
    figure: Figure,
};