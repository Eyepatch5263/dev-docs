import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignUpForm } from "@/components/auth/SignUpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up - Explainbytes",
    description: "Create your free Explainbytes account to access documentation and learning resources.",
};

export default async function SignUpPage() {
    // Redirect authenticated users to home
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/");
    }

    return <SignUpForm />;
}
