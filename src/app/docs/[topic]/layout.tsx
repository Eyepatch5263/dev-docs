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

    // fetches the topic from the url params
    const { topic } = await params;

    // this will give metadata like title, description for given topic
    const topicMeta = getTopicMeta(topic);

    if (!topicMeta) {
        notFound();
    }

    // This gives the whole navigation structure for the topic like system design 
    // topics and their subtopics
    // like introduction and all the subtopics related to introduction
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
