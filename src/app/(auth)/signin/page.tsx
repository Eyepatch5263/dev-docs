import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In - Explainbytes",
    description: "Sign in to your Explainbytes account to access documentation and learning resources.",
};

function SignInFormFallback() {
    return (
        <div className="w-full max-w-md animate-pulse">
            <div className="text-center mb-8">
                <div className="h-9 bg-muted rounded w-48 mx-auto mb-2" />
                <div className="h-5 bg-muted rounded w-64 mx-auto" />
            </div>
            <div className="space-y-5">
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-12" />
                    <div className="h-10 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-16" />
                    <div className="h-10 bg-muted rounded" />
                </div>
                <div className="h-11 bg-muted rounded" />
            </div>
        </div>
    );
}

export default async function SignInPage() {
    // Redirect authenticated users to home
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/");
    }

    return (
        <Suspense fallback={<SignInFormFallback />}>
            <SignInForm />
        </Suspense>
    );
}
