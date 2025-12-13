import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { EngineeringTerm } from '@/data/sample-terms';

interface TermCardProps {
    term: EngineeringTerm;
    searchQuery?: string;
}

// Map category to badge variant
const categoryVariantMap: Record<string, 'system-design' | 'dbms' | 'os' | 'networking' | 'devops'> = {
    'System Design': 'system-design',
    'DBMS': 'dbms',
    'OS': 'os',
    'Networking': 'networking',
    'DevOps': 'devops',
};

// Highlight matching text in results
function highlightMatch(text: string, query: string): React.ReactNode {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground rounded px-0.5">
                {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

export function TermCard({ term, searchQuery = '' }: TermCardProps) {
    const variant = categoryVariantMap[term.category] || 'secondary';

    // Truncate definition to ~150 characters
    const truncatedDefinition = term.definition.length > 150
        ? `${term.definition.slice(0, 150)}...`
        : term.definition;

    return (
        <Link href={`/engineering-terms/${term.slug}`}>
            <article className="group p-6 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Term name and category */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {highlightMatch(term.term, searchQuery)}
                            </h3>
                            <Badge variant={variant} className="text-xs">
                                {term.category}
                            </Badge>
                        </div>

                        {/* Definition */}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {highlightMatch(truncatedDefinition, searchQuery)}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                            {term.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Arrow indicator */}
                    <div className="hidden sm:block text-muted-foreground group-hover:text-primary transition-colors">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div>
            </article>
        </Link>
    );
}
