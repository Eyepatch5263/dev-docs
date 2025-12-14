-- Supabase Database Schema for Authentication
-- Run this SQL in your Supabase SQL Editor to create the users table
-- NOTE: Run each section separately if you encounter issues

-- =============================================
-- SECTION 1: Create users table
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT,
    avatar_url TEXT,
    oauth_provider TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- =============================================
-- SECTION 2: Create index on email
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =============================================
-- SECTION 3: Enable Row Level Security
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECTION 4: Create RLS policies
-- Run these one at a time if needed
-- =============================================

-- Policy for service role to manage all users (for API operations)
CREATE POLICY "Service role can manage all users" ON users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy for authenticated users to read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = id::text);
