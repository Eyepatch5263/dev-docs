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