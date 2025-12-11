import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { getNavigationForTopic, getTopicMeta } from "@/lib/docs";
import { notFound } from "next/navigation";

interface TopicLayoutProps {
    children: React.ReactNode;
    params: Promise<{ topic: string }>;
}

export default async function TopicLayout({ children, params }: TopicLayoutProps) {
    const { topic } = await params;
    const topicMeta = getTopicMeta(topic);

    if (!topicMeta) {
        notFound();
    }

    const navigation = getNavigationForTopic(topic);

    return (
        <div className="min-h-screen bg-background">
            <Header>
                <MobileSidebar navigation={navigation} basePath={`/docs/${topic}`} topicTitle={topicMeta.title} />
            </Header>
            <div className="flex">
                <Sidebar navigation={navigation} basePath={`/docs/${topic}`} />
                <main className="flex-1 min-w-0 w-full">{children}</main>
            </div>
        </div>
    );
}
