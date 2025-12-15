import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate beautiful HTML welcome email template
function getWelcomeEmailHtml(userName: string): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explainbytes.tech";
    const logoUrl = `${siteUrl}/explain.png`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ExplainBytes</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Logo -->
                    <tr>
                        <td style="text-align: center; padding: 30px 20px 20px;">
                            <img src="${logoUrl}" alt="ExplainBytes" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;" />
                        </td>
                    </tr>
                    <!-- Welcome Banner -->
                    <tr>
                        <td style="padding: 0 24px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); border-radius: 12px;">
                                <tr>
                                    <td style="text-align: center; padding: 20px;">
                                        <span style="font-size: 48px;">🎉</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Heading -->
                    <tr>
                        <td style="padding: 24px 24px 0;">
                            <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #18181b; text-align: center;">Welcome to ExplainBytes!</h1>
                            <p style="margin: 0 0 8px; font-size: 15px; line-height: 24px; color: #52525b;">Hi <strong>${userName}</strong>,</p>
                            <p style="margin: 0 0 16px; font-size: 15px; line-height: 24px; color: #52525b;">Your email has been verified and your account is now active! You're now part of a growing community of developers and engineers learning together.</p>
                        </td>
                    </tr>
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 24px;">
                            <div style="border-top: 1px solid #e4e4e7; margin: 24px 0;"></div>
                        </td>
                    </tr>
                    <!-- Features Header -->
                    <tr>
                        <td style="padding: 0 24px;">
                            <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #18181b; text-align: center;">Explore What's Waiting for You</h2>
                        </td>
                    </tr>
                    <!-- Feature 1: Flash Docs -->
                    <tr>
                        <td style="padding: 0 24px 16px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #fafafa; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <span style="font-size: 32px; display: block; margin-bottom: 8px;">📚</span>
                                        <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #18181b;">Flash Docs</p>
                                        <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #71717a;">Deep explanations of OS, DBMS, Networking, and System Design. From fundamentals to expert-level concepts.</p>
                                        <a href="${siteUrl}/docs" style="display: inline-block; padding: 8px 16px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; color: #18181b; font-size: 13px; font-weight: 500; text-decoration: none;">Read Concepts</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Feature 2: Flash Cards -->
                    <tr>
                        <td style="padding: 0 24px 16px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #fafafa; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <span style="font-size: 32px; display: block; margin-bottom: 8px;">🃏</span>
                                        <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #18181b;">Flash Cards</p>
                                        <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #71717a;">Interactive flashcards to help you memorize essential engineering concepts through active recall.</p>
                                        <a href="${siteUrl}/flashcards" style="display: inline-block; padding: 8px 16px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; color: #18181b; font-size: 13px; font-weight: 500; text-decoration: none;">Practice Now</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Feature 3: Engineering Terms -->
                    <tr>
                        <td style="padding: 0 24px 16px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #fafafa; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <span style="font-size: 32px; display: block; margin-bottom: 8px;">🔍</span>
                                        <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #18181b;">Engineering Terms</p>
                                        <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #71717a;">Explore a curated collection of engineering terms, definitions, and related concepts with clear explanations.</p>
                                        <a href="${siteUrl}/engineering-terms" style="display: inline-block; padding: 8px 16px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; color: #18181b; font-size: 13px; font-weight: 500; text-decoration: none;">Explore Terms</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Feature 4: Collaborative Editor -->
                    <tr>
                        <td style="padding: 0 24px 16px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #fafafa; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <span style="font-size: 32px; display: block; margin-bottom: 8px;">✍️</span>
                                        <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #18181b;">Collaborative Editor</p>
                                        <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #71717a;">Seamlessly collaborate on documents in real-time, publish with a single click, and contribute to shared knowledge.</p>
                                        <a href="${siteUrl}/collaborative-editor" style="display: inline-block; padding: 8px 16px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; color: #18181b; font-size: 13px; font-weight: 500; text-decoration: none;">Try Now</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 24px;">
                            <div style="border-top: 1px solid #e4e4e7; margin: 8px 0 24px;"></div>
                        </td>
                    </tr>
                    <!-- CTA Section -->
                    <tr>
                        <td style="padding: 0 24px 24px; text-align: center;">
                            <p style="margin: 0 0 16px; font-size: 15px; color: #52525b;">Ready to start your learning journey?</p>
                            <a href="${siteUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);">Explore ExplainBytes</a>
                        </td>
                    </tr>
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 24px;">
                            <div style="border-top: 1px solid #e4e4e7; margin: 0 0 24px;"></div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 0 24px 30px; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">Questions? Reach out to us anytime. We're here to help!</p>
                            <p style="margin: 0 0 16px; font-size: 13px; color: #a1a1aa;">© ${new Date().getFullYear()} ExplainBytes. All rights reserved.</p>
                            <p style="margin: 0; font-size: 13px;">
                                <a href="${siteUrl}" style="color: #6366f1; text-decoration: none;">Website</a>
                                <span style="color: #a1a1aa;"> • </span>
                                <a href="${siteUrl}/docs" style="color: #6366f1; text-decoration: none;">Docs</a>
                                <span style="color: #a1a1aa;"> • </span>
                                <a href="${siteUrl}/flashcards" style="color: #6366f1; text-decoration: none;">Flashcards</a>
                            </p>
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

// Send welcome email to newly verified user
async function sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
        const emailResult = await resend.emails.send({
            from: "ExplainBytes <welcome@news.explainbytes.tech>",
            to: email,
            subject: "Welcome to ExplainBytes! 🎉",
            html: getWelcomeEmailHtml(name),
        });
        console.log("Welcome email sent:", JSON.stringify(emailResult, null, 2));
    } catch (error) {
        console.error("Failed to send welcome email:", error);
        // Don't throw - welcome email failure shouldn't break verification
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");
        console.log("token:", token);

        if (!token) {
            return NextResponse.json(
                { error: "Verification token is required" },
                { status: 400 }
            );
        }

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Database connection not available" },
                { status: 500 }
            );
        }

        // Find user with this verification token
        const { data: user, error: findError } = await supabaseAdmin
            .from("users")
            .select("id, email, name, verification_token_expires, email_verified")
            .eq("verification_token", token)
            .single();

        if (findError || !user) {
            return NextResponse.json(
                { error: "Invalid or expired verification link" },
                { status: 400 }
            );
        }

        // Check if already verified
        if (user.email_verified) {
            return NextResponse.json(
                { message: "Email already verified", alreadyVerified: true },
                { status: 200 }
            );
        }

        // Check if token has expired
        if (user.verification_token_expires) {
            const expiresAt = new Date(user.verification_token_expires);
            if (expiresAt < new Date()) {
                return NextResponse.json(
                    { error: "Verification link has expired. Please request a new one." },
                    { status: 400 }
                );
            }
        }

        // Update user as verified and clear token
        const { error: updateError } = await supabaseAdmin
            .from("users")
            .update({
                email_verified: true,
                verification_token: null,
                verification_token_expires: null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

        if (updateError) {
            console.error("Error verifying user:", updateError);
            return NextResponse.json(
                { error: "Failed to verify email. Please try again." },
                { status: 500 }
            );
        }

        // Send welcome email after successful verification
        await sendWelcomeEmail(user.email, user.name);

        return NextResponse.json(
            {
                message: "Email verified successfully!",
                verified: true,
                user: {
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
