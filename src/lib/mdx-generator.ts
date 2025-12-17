/**
 * MDX File Generator
 * Generates MDX files with proper frontmatter from document metadata
 */

import { CATEGORY_ORDER } from "@/constants/docs";
import { CATEGORY_LABELS } from "@/constants/editor";

interface DocumentMetadata {
    description: string;
    topic: string;
    category: string;
    content: string;
}

// ---
// title: Introduction To Networking
// description: Getting started with networking fundamentals
// order: 1
// category: Introduction
// ---

/**
 * Generate complete MDX file content with frontmatter
 * @param metadata - Document metadata from database
 * @returns Complete MDX file content ready to commit
 */
export function generateMDXFile(metadata: DocumentMetadata): string {
    const { description, topic, category, content } = metadata;

    // Get category display label
    const categoryLabel = CATEGORY_LABELS[category] || category;

    // Get order from CATEGORY_ORDER mapping
    const order = CATEGORY_ORDER[categoryLabel] || 999;

    // Generate frontmatter
    const frontmatter = [
        "---",
        `title: ${topic}`,
        `description: ${description}`,
        `order: ${order}`,
        `category: ${categoryLabel}`,
        "---",
        "",
    ].join("\n");

    // Combine frontmatter and content
    return frontmatter + content;
}

/**
 * Generate file path for MDX file in content directory
 * @param topic - Document topic (e.g., "system-design")
 * @param slug - Document slug (generated from title)
 * @returns File path (e.g., "content/system-design/introduction.mdx")
 */
export function generateFilePath(topic: string, slug: string): string {
    return `content/${topic}/${slug}.mdx`;
}
