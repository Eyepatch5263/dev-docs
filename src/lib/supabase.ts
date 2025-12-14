import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client-side Supabase client (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (full permissions - use only in server actions/API routes)
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Types for user management
export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}
