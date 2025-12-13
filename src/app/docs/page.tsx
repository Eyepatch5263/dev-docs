import { Header } from "@/components/Header";
import { getAllTopics } from "@/lib/docs";
import { TopicCard } from "@/components/TopicCard";
import HeroReusableComponent from "@/components/HeroReusableComponent";

export default function DocsLandingPage() {
    const topics = getAllTopics();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
                {/* Hero Section */}
                <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 mx-auto text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Actively Maintained Documentation
                    </div>
                    <HeroReusableComponent title="Developer's" subHeading="Documentation Doom" description="Deep-dive into system fundamentals with richly illustrated guides. Master databases, operating systems, and distributed architectures through diagrams, examples, and visual breakdowns."/>

                    {/* Topic Cards Grid */}
                    <main className="container mx-auto px-4 py-12">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {topics.map((topic, index) => {
                                console.log("topic", topic)
                                const articleCount = topic.articles || 0;
                                const isAvailable = articleCount > 0;

                                return (
                                    <TopicCard
                                        key={topic.id}
                                        id={topic.id}
                                        title={topic.title}
                                        description={topic.description}
                                        icon={topic.icon}
                                        color={topic.color}
                                        count={articleCount}
                                        countLabel={isAvailable ? 'articles' : 'Coming soon'}
                                        href={`/docs/${topic.id}`}
                                        index={index}
                                        isAvailable={isAvailable}
                                    />
                                );
                            })}
                        </div>
                    </main>
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
