import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface DocMeta {
    slug: string;
    title: string;
    description?: string;
    order?: number;
    category?: string;
}

export interface DocContent extends DocMeta {
    content: string;
}

export interface NavItem {
    title: string;
    slug: string;
    order: number;
}

export interface NavCategory {
    name: string;
    items: NavItem[];
}

export interface TopicMeta {
    id: string;
    title: string;
    description: string;
}

// Topic metadata
const topics: Record<string, TopicMeta> = {
    "system-design": {
        id: "system-design",
        title: "System Design",
        description:
            "Learn the fundamentals of designing scalable, reliable, and efficient systems. Covers distributed systems, microservices, and architectural patterns.",
    },
    networking: {
        id: "networking",
        title: "Networking",
        description:
            "Understand computer networks, protocols, TCP/IP, HTTP, DNS, and how data travels across the internet.",
    },
    "operating-systems": {
        id: "operating-systems",
        title: "Operating Systems",
        description:
            "Explore process management, memory management, file systems, and how operating systems work under the hood.",
    },
    dbms: {
        id: "dbms",
        title: "Database Management",
        description:
            "Master database concepts, SQL, NoSQL, indexing, transactions, and data modeling techniques.",
    },
};

export function getTopicMeta(topic: string): TopicMeta | null {
    return topics[topic] || null;
}

export function getAllTopics(): TopicMeta[] {
    return Object.values(topics);
}

function getTopicDirectory(topic: string): string {
    return path.join(contentDirectory, topic);
}

function getAllMdxFiles(dir: string, baseDir = dir): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllMdxFiles(fullPath, baseDir));
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
            order: data.order || 999,
            category: data.category,
        };
    });

    return docs.sort((a, b) => a.order - b.order);
}

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

    for (const topic of Object.keys(topics)) {
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
