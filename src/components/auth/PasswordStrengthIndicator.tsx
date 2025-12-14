"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface PasswordStrengthIndicatorProps {
    password: string;
}

interface PasswordCriteria {
    label: string;
    met: boolean;
}

function getPasswordStrength(password: string): {
    score: number;
    label: string;
    criteria: PasswordCriteria[];
} {
    const criteria: PasswordCriteria[] = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /[0-9]/.test(password) },
        { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const metCount = criteria.filter((c) => c.met).length;
    const score = (metCount / criteria.length) * 100;

    let label = "Very Weak";
    if (score >= 100) label = "Strong";
    else if (score >= 80) label = "Good";
    else if (score >= 60) label = "Fair";
    else if (score >= 40) label = "Weak";

    return { score, label, criteria };
}

function getStrengthColor(score: number): string {
    if (score >= 100) return "bg-emerald-500";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
}

function getStrengthTextColor(score: number): string {
    if (score >= 100) return "text-emerald-500";
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const { score, label, criteria } = getPasswordStrength(password);

    if (!password) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 mt-3"
        >
            {/* Strength Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className={`text-xs font-medium ${getStrengthTextColor(score)}`}>
                        {label}
                    </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${getStrengthColor(score)} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Criteria Checklist */}
            <div className="grid grid-cols-1 gap-1.5">
                {criteria.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2"
                    >
                        {item.met ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                        <span
                            className={`text-xs ${item.met ? "text-foreground" : "text-muted-foreground"
                                }`}
                        >
                            {item.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
