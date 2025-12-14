"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerificationState = "loading" | "success" | "error" | "already-verified";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [state, setState] = useState<VerificationState>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setState("error");
            setMessage("No verification token provided");
            return;
        }

        verifyEmail(token);
    }, [token]);

    const verifyEmail = async (verificationToken: string) => {
        try {
            const response = await fetch(
                `/api/auth/verify-email?token=${verificationToken}`
            );
            const data = await response.json();

            if (response.ok) {
                if (data.alreadyVerified) {
                    setState("already-verified");
                    setMessage("Your email is already verified");
                } else {
                    setState("success");
                    setMessage(data.message || "Email verified successfully!");
                }
            } else {
                setState("error");
                setMessage(data.error || "Verification failed");
            }
        } catch {
            setState("error");
            setMessage("An unexpected error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                    {/* Loading State */}
                    {state === "loading" && (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">
                                Verifying your email...
                            </h1>
                            <p className="text-muted-foreground">
                                Please wait while we verify your email address
                            </p>
                        </div>
                    )}

                    {/* Success State */}
                    {state === "success" && (
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </motion.div>
                            <h1 className="text-2xl font-bold mb-2">
                                Email Verified!
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                {message}
                            </p>
                            <Button
                                onClick={() => router.push("/signin")}
                                className="w-full"
                            >
                                Sign In
                            </Button>
                        </div>
                    )}

                    {/* Already Verified State */}
                    {state === "already-verified" && (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                                <Mail className="h-8 w-8 text-blue-500" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">
                                Already Verified
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                {message}. You can sign in to your account.
                            </p>
                            <Button
                                onClick={() => router.push("/signin")}
                                className="w-full"
                            >
                                Sign In
                            </Button>
                        </div>
                    )}

                    {/* Error State */}
                    {state === "error" && (
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">
                                Verification Failed
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                {message}
                            </p>
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/signup")}
                                    className="w-full"
                                >
                                    Sign Up Again
                                </Button>
                                <div className="text-sm text-muted-foreground">
                                    or{" "}
                                    <Link
                                        href="/signin"
                                        className="text-primary hover:underline"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
