"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Loader2,
    Github,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export function SignUpForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setFormError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setFormError("Name is required");
            return false;
        }
        if (!formData.email.trim()) {
            setFormError("Email is required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setFormError("Please enter a valid email address");
            return false;
        }
        if (formData.password.length < 8) {
            setFormError("Password must be at least 8 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setFormError("Passwords do not match");
            return false;
        }
        if (!formData.acceptTerms) {
            setFormError("You must accept the terms and conditions");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setFormError(null);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setFormError(data.error || "Failed to create account");
                return;
            }

            // Show success message - user needs to verify email
            setSuccess(true);
        } catch {
            setFormError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = (provider: string) => {
        signIn(provider, { callbackUrl: "/" });
    };

    // Success State
    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md text-center py-8"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Check Your Email!</h2>
                <p className="text-muted-foreground mb-4">
                    We&apos;ve sent a verification link to <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                    Please check your inbox and click the verification link to activate your account.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Create an account</h1>
                    <p className="text-muted-foreground mt-2 text-base lg:text-lg">
                        Get started with your free account today
                    </p>
                </motion.div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {formError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3"
                    >
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                        <p className="text-sm text-destructive">{formError}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm ml-1 lg:text-base">Full Name</Label>
                    <div className="relative mt-2">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-10 lg:pl-12 h-11 lg:h-12 text-base lg:text-lg"
                            required
                            autoComplete="name"
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm ml-1 lg:text-base">Email</Label>
                    <div className="relative mt-2">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10 lg:pl-12 h-11 lg:h-12 text-base lg:text-lg"
                            required
                            autoComplete="email"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm ml-1 lg:text-base">Password</Label>
                    <div className="relative mt-2">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 lg:pl-12 pr-10 lg:pr-12 h-11 lg:h-12 text-base lg:text-lg"
                            required
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                            ) : (
                                <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                            )}
                        </button>
                    </div>
                    <PasswordStrengthIndicator password={formData.password} />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm ml-1 lg:text-base">Confirm Password</Label>
                    <div className="relative mt-2">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="pl-10 lg:pl-12 pr-10 lg:pr-12 h-11 lg:h-12 text-base lg:text-lg"
                            required
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                            ) : (
                                <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                            )}
                        </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs lg:text-sm text-destructive mt-1">Passwords do not match</p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 8 && (
                        <p className="text-xs lg:text-sm text-emerald-500 mt-1 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 lg:h-4 lg:w-4" />
                            Passwords match
                        </p>
                    )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                    <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
                        }
                        className="mt-0.5"
                    />
                    <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed cursor-pointer">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                        </Link>
                    </Label>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-11 lg:h-12 font-medium text-base lg:text-lg cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Create account"
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 gap-3">
                <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn("github")}
                    className="h-11 lg:h-12 cursor-pointer text-base"
                    type="button"
                >
                    <Github className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span>GitHub</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn("google")}
                    className="h-11 lg:h-12 cursor-pointer text-base"
                    type="button"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span>Google</span>
                </Button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm lg:text-base text-muted-foreground mt-8">
                Already have an account?{" "}
                <Link
                    href="/signin"
                    className="font-medium text-primary hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </motion.div>
    );
}
