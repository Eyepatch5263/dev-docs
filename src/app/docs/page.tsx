import Link from "next/link";
import { ArrowRight, Server, Network, HardDrive, Database, FileText, LucideIcon, CloudUploadIcon } from "lucide-react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/Header";
import { getAllTopics } from "@/lib/docs";

// Map icon names from _meta.json to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
    Server,
    Network,
    HardDrive,
    Database,
    CloudUploadIcon,
    FileText,
};

// Default values for missing metadata
const defaultColor = "from-gray-500 to-slate-500";
const DefaultIcon = FileText;

export default function DocsLandingPage() {
    const topics = getAllTopics();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
                {/* Hero Section */}
                <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Actively Maintained Documentation
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Developer's
                        <br />
                        <span className="text-gray-400 bg-clip-text">
                            Documentation Doom
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
                        Comprehensive guides and references for software developers
                        to build, deploy, and scale applications effectively.
                    </p>

                    {/* Topic Cards Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl w-full">
                        {topics.map((topic) => {
                            const Icon = topic.icon ? (iconMap[topic.icon] || DefaultIcon) : DefaultIcon;
                            const color = topic.color || defaultColor;
                            const articleCount = topic.articles || 0;
                            const isAvailable = articleCount > 0;

                            return (
                                <Link
                                    key={topic.id}
                                    href={isAvailable ? `/docs/${topic.id}` : "#"}
                                    className={!isAvailable ? "cursor-not-allowed" : ""}
                                >
                                    <Card
                                        className={`group h-full transition-all duration-300 ${isAvailable
                                            ? "hover:border-primary hover:shadow-lg hover:-translate-y-1"
                                            : "opacity-60"
                                            }`}
                                    >
                                        <CardHeader className="space-y-4 items-center text-center">
                                            <div
                                                className={`w-12 h-12 rounded-lg bg-linear-to-br ${color} flex items-center justify-center mx-auto`}
                                            >
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <CardTitle className="flex items-center justify-center gap-2">
                                                    {topic.title}
                                                    {isAvailable && (
                                                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                                    )}
                                                </CardTitle>
                                                <CardDescription className="text-sm leading-relaxed">
                                                    {topic.description}
                                                </CardDescription>
                                            </div>
                                            <div className="pt-2 border-t border-border">
                                                <span className="text-xs text-muted-foreground">
                                                    {isAvailable
                                                        ? `${articleCount} articles`
                                                        : "Coming soon"}
                                                </span>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border py-6 px-6 text-center text-sm text-muted-foreground">
                    <p>
                        Built By Developer for Developers. &copy; {new Date().getFullYear()} EyePatch5263.
                    </p>
                </footer>
            </div>
        </div>
    );
}
