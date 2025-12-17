export const styles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    review: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
export const labels: Record<string, string> = {
    draft: "Draft",
    review: "In Review",
    approved: "Approved",
    rejected: "Rejected",
};

// Topic display labels
export const TOPIC_LABELS: Record<string, string> = {
    "ai-ml": "AI/ML",
    "networking": "Networking",
    "operating-systems": "Operating Systems",
    "devops": "DevOps",
    "dbms": "DBMS",
    "system-design": "System Design",
    "cybersecurity": "Cybersecurity",
    "web": "Web",
};

// Category display labels
export const CATEGORY_LABELS: Record<string, string> = {
    "introduction": "Introduction",
    "core-concepts-terminologies": "Core Concepts & Terminologies",
    "architecture-components": "Architecture & Components",
    "building-blocks": "Building Blocks",
    "design-patterns": "Design Patterns",
    "workflow-execution": "Workflow and Execution",
    "scalability-performance": "Scalability and Performance",
    "security-safety": "Security and Safety",
    "case-studies": "Case Studies",
    "common-pitfalls": "Common Pitfalls",
    "summary": "Summary",
};

// Topic options
export const TOPICS = [
    { value: "ai-ml", label: "AI/ML" },
    { value: "networking", label: "Networking" },
    { value: "operating-systems", label: "Operating Systems" },
    { value: "devops", label: "DevOps" },
    { value: "dbms", label: "DBMS" },
    { value: "system-design", label: "System Design" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "web", label: "Web" },
];

// Category options
export const CATEGORIES = [
    { value: "introduction", label: "Introduction" },
    { value: "core-concepts-terminologies", label: "Core Concepts & Terminologies" },
    { value: "architecture-components", label: "Architecture & Components" },
    { value: "building-blocks", label: "Building Blocks" },
    { value: "design-patterns", label: "Design Patterns" },
    { value: "workflow-execution", label: "Workflow and Execution" },
    { value: "scalability-performance", label: "Scalability and Performance" },
    { value: "security-safety", label: "Security and Safety" },
    { value: "case-studies", label: "Case Studies" },
    { value: "common-pitfalls", label: "Common Pitfalls" },
    { value: "summary", label: "Summary" },
];

/**
 * Format topic slug to proper display name
 * @param slug - Topic slug (e.g., "system-design")
 * @returns Formatted topic name (e.g., "System Design")
 */
export function formatTopicName(slug: string): string {
    return TOPIC_LABELS[slug] || slug;
}

/**
 * Format category slug to proper display name
 * @param slug - Category slug (e.g., "core-concepts-terminologies")
 * @returns Formatted category name (e.g., "Core Concepts & Terminologies")
 */
export function formatCategoryName(slug: string): string {
    return CATEGORY_LABELS[slug] || slug;
}