/**
 * MDX Converter - Converts ProseMirror JSON to MDX format
 * 
 * Flow: editor.getJSON() → convertToMDX() → MDX string
 */

interface ProseMirrorNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: ProseMirrorNode[];
    text?: string;
    marks?: ProseMirrorMark[];
}

interface ProseMirrorMark {
    type: string;
    attrs?: Record<string, unknown>;
}

/**
 * Convert ProseMirror JSON document to MDX string
 */
export function convertToMDX(doc: ProseMirrorNode): string {
    if (!doc || doc.type !== "doc" || !doc.content) {
        return "";
    }

    const lines: string[] = [];

    for (const node of doc.content) {
        const converted = convertNode(node);
        if (converted !== null) {
            lines.push(converted);
        }
    }

    // Join with double newlines for proper MDX paragraph spacing
    return lines.join("\n\n").trim();
}

/**
 * Convert a single ProseMirror node to MDX
 */
function convertNode(node: ProseMirrorNode): string | null {
    switch (node.type) {
        case "heading":
            return convertHeading(node);
        case "paragraph":
            return convertParagraph(node);
        case "codeBlock":
            return convertCodeBlock(node);
        case "bulletList":
            return convertBulletList(node);
        case "orderedList":
            return convertOrderedList(node);
        case "blockquote":
            return convertBlockquote(node);
        case "table":
            return convertTable(node);
        case "horizontalRule":
            return "---";
        case "hardBreak":
            return "\n";
        default:
            // For unknown nodes, try to extract text content
            if (node.content) {
                return node.content.map(n => convertNode(n)).filter(Boolean).join("");
            }
            return null;
    }
}

/**
 * Convert heading node: # Heading
 */
function convertHeading(node: ProseMirrorNode): string {
    const level = (node.attrs?.level as number) || 1;
    const prefix = "#".repeat(Math.min(level, 6));
    const text = convertInlineContent(node.content);
    return `${prefix} ${text}`;
}

/**
 * Convert paragraph node
 */
function convertParagraph(node: ProseMirrorNode): string {
    return convertInlineContent(node.content);
}

/**
 * Convert code block: ```language\ncode\n```
 */
function convertCodeBlock(node: ProseMirrorNode): string {
    const language = (node.attrs?.language as string) || "";
    const code = node.content?.map(n => n.text || "").join("") || "";
    return `\`\`\`${language}\n${code}\n\`\`\``;
}

/**
 * Convert bullet list: - item
 */
function convertBulletList(node: ProseMirrorNode): string {
    if (!node.content) return "";

    return node.content
        .map(item => {
            if (item.type === "listItem" && item.content) {
                const text = item.content
                    .map(n => convertNode(n))
                    .filter(Boolean)
                    .join("\n");
                // Indent nested content and add bullet
                return `- ${text.split("\n").join("\n  ")}`;
            }
            return null;
        })
        .filter(Boolean)
        .join("\n");
}

/**
 * Convert ordered list: 1. item
 */
function convertOrderedList(node: ProseMirrorNode): string {
    if (!node.content) return "";

    return node.content
        .map((item, index) => {
            if (item.type === "listItem" && item.content) {
                const text = item.content
                    .map(n => convertNode(n))
                    .filter(Boolean)
                    .join("\n");
                // Indent nested content and add number
                return `${index + 1}. ${text.split("\n").join("\n   ")}`;
            }
            return null;
        })
        .filter(Boolean)
        .join("\n");
}

/**
 * Convert blockquote: > quote
 */
function convertBlockquote(node: ProseMirrorNode): string {
    if (!node.content) return "";

    const content = node.content
        .map(n => convertNode(n))
        .filter(Boolean)
        .join("\n");

    // Prefix each line with >
    return content.split("\n").map(line => `> ${line}`).join("\n");
}

/**
 * Convert table: | col1 | col2 |
 */
function convertTable(node: ProseMirrorNode): string {
    if (!node.content) return "";

    const rows: string[] = [];
    let isFirstRow = true;

    for (const row of node.content) {
        if (row.type !== "tableRow" || !row.content) continue;

        const cells: string[] = [];
        for (const cell of row.content) {
            // Handle both tableHeader and tableCell
            if ((cell.type === "tableHeader" || cell.type === "tableCell") && cell.content) {
                const cellContent = cell.content
                    .map(n => convertNode(n))
                    .filter(Boolean)
                    .join(" ");
                cells.push(cellContent || " ");
            }
        }

        if (cells.length > 0) {
            rows.push(`| ${cells.join(" | ")} |`);

            // Add separator after header row
            if (isFirstRow) {
                const separator = cells.map(() => "---").join(" | ");
                rows.push(`| ${separator} |`);
                isFirstRow = false;
            }
        }
    }

    return rows.join("\n");
}

/**
 * Convert inline content (text with marks)
 */
function convertInlineContent(content?: ProseMirrorNode[]): string {
    if (!content) return "";

    return content.map(node => {
        if (node.type === "text") {
            let text = node.text || "";

            // Apply marks in order: code first (innermost), then others
            if (node.marks) {
                // Sort marks so code is applied first
                const sortedMarks = [...node.marks].sort((a, b) => {
                    if (a.type === "code") return -1;
                    if (b.type === "code") return 1;
                    return 0;
                });

                for (const mark of sortedMarks) {
                    text = applyMark(text, mark);
                }
            }

            return text;
        } else if (node.type === "hardBreak") {
            return "\n";
        }
        return "";
    }).join("");
}

/**
 * Apply a mark to text (bold, italic, code, etc.)
 */
function applyMark(text: string, mark: ProseMirrorMark): string {
    switch (mark.type) {
        case "bold":
            return `**${text}**`;
        case "italic":
            return `*${text}*`;
        case "code":
            return `\`${text}\``;
        case "strike":
            return `~~${text}~~`;
        case "highlight":
            return `<mark>${text}</mark>`;
        case "link":
            const href = mark.attrs?.href as string || "#";
            return `[${text}](${href})`;
        default:
            return text;
    }
}

/**
 * Generate MDX with frontmatter
 */
export function convertToMDXWithFrontmatter(
    doc: ProseMirrorNode,
    metadata: { title?: string; subtitle?: string; author?: string; date?: string }
): string {
    const content = convertToMDX(doc);

    // Build frontmatter
    const frontmatterLines: string[] = ["---"];
    if (metadata.title) frontmatterLines.push(`title: "${metadata.title}"`);
    if (metadata.subtitle) frontmatterLines.push(`subtitle: "${metadata.subtitle}"`);
    if (metadata.author) frontmatterLines.push(`author: "${metadata.author}"`);
    if (metadata.date) frontmatterLines.push(`date: "${metadata.date}"`);
    frontmatterLines.push("---");

    // Only include frontmatter if there's metadata
    if (frontmatterLines.length > 2) {
        return `${frontmatterLines.join("\n")}\n\n${content}`;
    }

    return content;
}
