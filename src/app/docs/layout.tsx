import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { getNavigation } from "@/lib/docs";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigation = getNavigation();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <Sidebar navigation={navigation} />
                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
}
