import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate beautiful HTML verify email template
function getVerificationEmailHtml(userName: string, verificationUrl: string): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const logoUrl = `${siteUrl}/explain.png`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; margin: 0 auto;">
                    <!-- Logo/Brand Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 30px;">
                            <img src="${logoUrl}" alt="ExplainBytes" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
                        </td>
                    </tr>
                    <!-- Main Card -->
                    <tr>
                        <td style="background: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <!-- Gradient Header -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="height: 6px; background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);"></td>
                                </tr>
                            </table>
                            <!-- Content -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 40px 40px 30px;">
                                        <!-- Icon -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td align="center">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 50%; text-align: center; vertical-align: middle; line-height: 64px;">
                                                                <span style="font-size: 28px; display: inline-block; vertical-align: middle; line-height: normal;">✉️</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <div style="height: 24px;"></div>
                                        <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">Verify your email</h1>
                                        <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #71717a; text-align: center;">Hi <strong style="color: #18181b;">${userName}</strong>, thanks for signing up!</p>
                                        <p style="margin: 0 0 32px; font-size: 15px; line-height: 24px; color: #71717a; text-align: center;">Click the button below to verify your email address and activate your account.</p>
                                        <!-- CTA Button -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);">Verify Email Address</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <!-- Footer Info -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 0 40px 40px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #fafafa; border-radius: 10px; padding: 16px;">
                                            <tr>
                                                <td style="padding: 16px;">
                                                    <p style="margin: 0 0 8px; font-size: 13px; color: #71717a; text-align: center;">
                                                        <span style="display: inline-block; margin-right: 6px;">⏰</span>
                                                        This link expires in <strong style="color: #18181b;">24 hours</strong>
                                                    </p>
                                                    <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 20px; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 12px; color: #a1a1aa;">Having trouble? Copy and paste this link:</p>
                            <p style="margin: 0 0 20px; font-size: 11px; color: #6366f1; word-break: break-all;">${verificationUrl}</p>
                            <p style="margin: 0; font-size: 12px; color: #a1a1aa;">© ${new Date().getFullYear()} ExplainBytes. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

// Password validation regex patterns
const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /[0-9]/,
};

function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!PASSWORD_REQUIREMENTS.hasUppercase.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!PASSWORD_REQUIREMENTS.hasLowercase.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
        errors.push("Password must contain at least one number");
    }

    return { valid: errors.length === 0, errors };
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate a secure verification token
function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: NextRequest) {
    console.log("=== SIGNUP API CALLED ===");
    try {
        const body = await request.json();
        const { email, password, name } = body;
        console.log("Signup request for:", email);

        // Validate required fields
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Validate email format
        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: passwordValidation.errors[0], errors: passwordValidation.errors },
                { status: 400 }
            );
        }

        // Check Supabase connection
        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Database connection not available" },
                { status: 500 }
            );
        }

        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("id, email_verified")
            .eq("email", email.toLowerCase())
            .single();

        if (existingUser) {
            // If user exists but not verified, resend verification email
            if (!existingUser.email_verified) {
                const verificationToken = generateVerificationToken();
                const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

                // Update token
                await supabaseAdmin
                    .from("users")
                    .update({
                        verification_token: verificationToken,
                        verification_token_expires: tokenExpires.toISOString(),
                    })
                    .eq("id", existingUser.id);

                // Send verification email
                const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;

                await resend.emails.send({
                    from: "ExplainBytes <verify@news.explainbytes.tech>",
                    to: email.toLowerCase(),
                    subject: "Verify your email - ExplainBytes",
                    html: getVerificationEmailHtml(name.trim(), verificationUrl),
                });

                return NextResponse.json(
                    {
                        message: "Verification email resent. Please check your inbox.",
                        requiresVerification: true,
                    },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password with bcrypt (12 rounds for security)
        const passwordHash = await bcrypt.hash(password, 12);

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user in Supabase
        const { data: newUser, error: createError } = await supabaseAdmin
            .from("users")
            .insert({
                email: email.toLowerCase(),
                password_hash: passwordHash,
                name: name.trim(),
                email_verified: false,
                verification_token: verificationToken,
                verification_token_expires: tokenExpires.toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select("id, email, name")
            .single();

        if (createError) {
            console.error("Error creating user:", createError);
            return NextResponse.json(
                { error: "Failed to create account. Please try again." },
                { status: 500 }
            );
        }

        // Send verification email
        const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;
        console.log("Verification URL:", verificationUrl);
        console.log("Sending email to:", email.toLowerCase());
        console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

        try {
            const emailResult = await resend.emails.send({
                from: "ExplainBytes <verify@news.explainbytes.tech>",
                to: email.toLowerCase(),
                subject: "Verify your email - ExplainBytes",
                html: getVerificationEmailHtml(name.trim(), verificationUrl),
            });
            console.log("Email sent result:", JSON.stringify(emailResult, null, 2));
        } catch (emailError) {
            console.error("=== EMAIL SENDING FAILED ===");
            console.error("Error:", emailError);
        }

        return NextResponse.json(
            {
                message: "Account created! Please check your email to verify your account.",
                requiresVerification: true,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
