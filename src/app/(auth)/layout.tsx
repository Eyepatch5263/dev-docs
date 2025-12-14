import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div className="min-h-screen flex flex-col bg-background">
                    {/* Decorative Background */}
                    <div className="fixed inset-0 -z-10 overflow-hidden">
                        {/* Gradient orbs */}
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50" />

                        {/* Grid pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />
                    </div>

                    {/* Header */}
                    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                        <div className="container mx-auto flex h-16 items-center justify-between px-4">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <img src="/logo.svg" alt="Explainbytes" className="h-8 w-8" />
                                <span className="text-xl font-semibold">Explainbytes</span>
                            </Link>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 flex items-center justify-center px-4 py-12">
                        <div className="w-full max-w-md">
                            {/* Glassmorphism Card */}
                            <div className="relative">
                                {/* Card glow effect */}
                                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-50" />

                                {/* Card */}
                                <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-border/50 py-6">
                        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                            <p>© {new Date().getFullYear()} Explainbytes. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </ThemeProvider>
        </AuthProvider>
    );
}
