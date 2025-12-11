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

function getAllMdxFiles(dir: string, baseDir = dir): string[] {
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

export function getAllDocs(): DocMeta[] {
    const files = getAllMdxFiles(contentDirectory);

    const docs = files.map((file) => {
        const filePath = path.join(contentDirectory, file);
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

export function getDocBySlug(slug: string): DocContent | null {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

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

export function getNavigation(): NavCategory[] {
    const docs = getAllDocs();
    const categories: Map<string, NavItem[]> = new Map();

    // First, handle root-level docs
    const rootDocs: NavItem[] = [];

    for (const doc of docs) {
        if (!doc.slug.includes("/")) {
            rootDocs.push({
                title: doc.title,
                slug: doc.slug,
                order: doc.order || 999,
            });
        } else {
            const category = doc.category || doc.slug.split("/")[0];
            const items = categories.get(category) || [];
            items.push({
                title: doc.title,
                slug: doc.slug,
                order: doc.order || 999,
            });
            categories.set(category, items);
        }
    }

    const nav: NavCategory[] = [];

    // Add root docs as "Getting Started"
    if (rootDocs.length > 0) {
        nav.push({
            name: "Getting Started",
            items: rootDocs.sort((a, b) => a.order - b.order),
        });
    }

    // Add categorized docs
    for (const [name, items] of categories) {
        nav.push({
            name,
            items: items.sort((a, b) => a.order - b.order),
        });
    }

    return nav;
}

export function getAllSlugs(): string[] {
    const docs = getAllDocs();
    return docs.map((doc) => doc.slug);
}
