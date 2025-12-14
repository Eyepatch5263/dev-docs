import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

// Password validation regex patterns
const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

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
            .select("id")
            .eq("email", email.toLowerCase())
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password with bcrypt (12 rounds for security)
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user in Supabase
        const { data: newUser, error: createError } = await supabaseAdmin
            .from("users")
            .insert({
                email: email.toLowerCase(),
                password_hash: passwordHash,
                name: name.trim(),
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

        return NextResponse.json(
            {
                message: "Account created successfully",
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
