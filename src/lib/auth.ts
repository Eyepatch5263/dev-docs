import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabase";

export const authOptions: NextAuthOptions = {
    providers: [
        // Credentials provider for email/password authentication
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                if (!supabaseAdmin) {
                    throw new Error("Database connection not available");
                }

                // Find user by email
                const { data: user, error } = await supabaseAdmin
                    .from("users")
                    .select("*")
                    .eq("email", credentials.email.toLowerCase())
                    .single();

                if (error || !user) {
                    throw new Error("Invalid email or password");
                }

                // Check if email is verified
                if (!user.email_verified) {
                    throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
                }

                // Verify password
                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isValidPassword) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.avatar_url,
                };
            },
        }),
        // GitHub OAuth provider (optional)
        ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
            ? [
                GitHubProvider({
                    clientId: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                }),
            ]
            : []),
        // Google OAuth provider (optional)
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
            ]
            : []),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/signin",
        error: "/signin",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
            }

            // Handle OAuth sign-in - create or update user in Supabase
            if (account && account.provider !== "credentials" && user && supabaseAdmin) {
                const { data: existingUser } = await supabaseAdmin
                    .from("users")
                    .select("id")
                    .eq("email", user.email?.toLowerCase())
                    .single();

                if (!existingUser) {
                    // Create new user for OAuth sign-in
                    // OAuth users have verified emails from the provider
                    const { data: newUser } = await supabaseAdmin
                        .from("users")
                        .insert({
                            email: user.email?.toLowerCase(),
                            name: user.name,
                            avatar_url: user.image,
                            oauth_provider: account.provider,
                            email_verified: true, // OAuth providers verify emails
                        })
                        .select()
                        .single();

                    if (newUser) {
                        token.id = newUser.id;
                    }
                } else {
                    token.id = existingUser.id;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },
    events: {
        async signIn({ user, account }) {
            // Update last login timestamp
            if (supabaseAdmin && user.email) {
                await supabaseAdmin
                    .from("users")
                    .update({ last_login: new Date().toISOString() })
                    .eq("email", user.email.toLowerCase());
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
