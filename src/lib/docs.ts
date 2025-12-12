import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DocContent, DocMeta, TopicMeta } from "@/app/types/docs.type";
import { NavCategory, NavItem } from "@/app/types/nav.type";

const contentDirectory = path.join(process.cwd(), "content");

// Helper to convert folder name to display title
// e.g., "system-design" -> "System Design", "dbms" -> "DBMS"
function folderNameToTitle(folderName: string): string {
    // Special cases for acronyms
    const acronyms: Record<string, string> = {
        dbms: "DBMS",
        sql: "SQL",
        api: "API",
        http: "HTTP",
        tcp: "TCP",
        ip: "IP",
        dns: "DNS",
        os: "OS",
    };

    if (acronyms[folderName.toLowerCase()]) {
        return acronyms[folderName.toLowerCase()];
    }

    return folderName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Dynamically discover all topics from the content directory
export function discoverTopics(): string[] {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    return fs.readdirSync(contentDirectory).filter((item) => {
        const itemPath = path.join(contentDirectory, item);
        // Only include directories, exclude hidden folders and files
        return fs.statSync(itemPath).isDirectory() && !item.startsWith("_") && !item.startsWith(".");
    });
}

// Get topic metadata - reads from _meta.json if exists, otherwise generates from folder name
export function getTopicMeta(topic: string): TopicMeta | null {
    const topicDir = path.join(contentDirectory, topic);

    if (!fs.existsSync(topicDir) || !fs.statSync(topicDir).isDirectory()) {
        return null;
    }

    const metaPath = path.join(topicDir, "_meta.json");

    // Count actual MDX files for articles count
    const articleCount = getAllDocsForTopic(topic).length;

    if (fs.existsSync(metaPath)) {
        try {
            const metaContent = fs.readFileSync(metaPath, "utf-8");
            const meta = JSON.parse(metaContent);
            return {
                id: topic,
                title: meta.title || folderNameToTitle(topic),
                description: meta.description || `Documentation for ${folderNameToTitle(topic)}`,
                icon: meta.icon,
                color: meta.color,
                articles: articleCount, // Use actual count instead of manual value
            };
        } catch {
            // Fall through to default
        }
    }

    // Default metadata generated from folder name
    return {
        id: topic,
        title: folderNameToTitle(topic),
        description: `Documentation for ${folderNameToTitle(topic)}`,
        articles: articleCount,
    };
}

// Returns metadata for all topics (dynamically discovered)
export function getAllTopics(): TopicMeta[] {
    const topicIds = discoverTopics();
    return topicIds
        .map((id) => getTopicMeta(id))
        .filter((meta): meta is TopicMeta => meta !== null);
}

function getTopicDirectory(topic: string): string {
    return path.join(contentDirectory, topic);
}

function getAllMdxFiles(dir: string, baseDir = dir): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files: string[] = [];
    // this reads all files and directories but recursively
    // will return all the files in this case
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        // for reading dir recursively
        if (stat.isDirectory()) {
            files.push(...getAllMdxFiles(fullPath, baseDir));

            // if .mdx file found push it in files array and return the array
        } else if (item.endsWith(".mdx")) {
            const relativePath = path.relative(baseDir, fullPath);
            files.push(relativePath);
        }
    }

    return files;
}

export function getAllDocsForTopic(topic: string): DocMeta[] {
    const topicDir = getTopicDirectory(topic);

    if (!fs.existsSync(topicDir)) {
        return [];
    }

    const files = getAllMdxFiles(topicDir);

    const docs = files.map((file) => {
        const filePath = path.join(topicDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);

        const slug = file.replace(/\.mdx$/, "").replace(/\\/g, "/");

        return {
            slug,
            title: data.title || slug,
            description: data.description,
            image: data.image,
            order: data.order || 999,
            category: data.category,
        };
    });

    return docs.sort((a, b) => a.order - b.order);
}

// get the content and metadata for a specific doc by topic and slug
export function getDocBySlug(topic: string, slug: string): DocContent | null {
    const filePath = path.join(getTopicDirectory(topic), `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
        slug,
        title: data.title || slug,
        description: data.description,
        image: data.image,
        order: data.order || 999,
        category: data.category,
        content,
    };
}

// Category order for sorting
const categoryOrder: Record<string, number> = {
    "Introduction": 1,
    "Building Blocks": 2,
    "Design Problems": 3,
    "Epilogue": 4,
};

export function getNavigationForTopic(topic: string): NavCategory[] {
    const docs = getAllDocsForTopic(topic);
    const categories: Map<string, NavItem[]> = new Map();

    for (const doc of docs) {
        const item: NavItem = {
            title: doc.title,
            slug: doc.slug,
            order: doc.order || 999,
        };

        const categoryName = doc.category || "Uncategorized";
        const items = categories.get(categoryName) || [];
        items.push(item);
        categories.set(categoryName, items);
    }

    const nav: NavCategory[] = [];

    // Add categorized docs in proper order
    for (const [name, items] of categories) {
        nav.push({
            name,
            items: items.sort((a, b) => a.order - b.order),
        });
    }

    // Sort categories by predefined order
    nav.sort((a, b) => {
        const orderA = categoryOrder[a.name] || 999;
        const orderB = categoryOrder[b.name] || 999;
        return orderA - orderB;
    });

    return nav;
}

export function getAllSlugsForTopic(topic: string): string[] {
    const docs = getAllDocsForTopic(topic);
    return docs.map((doc) => doc.slug);
}

// Legacy functions for backward compatibility
export function getAllDocs(): DocMeta[] {
    const allDocs: DocMeta[] = [];
    const topicIds = discoverTopics();

    for (const topic of topicIds) {
        const topicDocs = getAllDocsForTopic(topic);
        allDocs.push(
            ...topicDocs.map((doc) => ({
                ...doc,
                slug: `${topic}/${doc.slug}`,
            }))
        );
    }

    return allDocs.sort((a, b) => (a.order || 999) - (b.order || 999));
}

export function getNavigation(): NavCategory[] {
    // This is kept for backward compatibility but shouldn't be used in the new structure
    return [];
}

export function getAllSlugs(): string[] {
    const docs = getAllDocs();
    return docs.map((doc) => doc.slug);
}
