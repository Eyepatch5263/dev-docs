import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");
        console.log("token:",token)

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
