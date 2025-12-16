-- Supabase Admin Schema Migration
-- Run this SQL in your Supabase SQL Editor to add admin role support
-- NOTE: Run each section separately if you encounter issues

-- =============================================
-- SECTION 1: Add role column to users table
-- =============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- =============================================
-- SECTION 2: Create index on role for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =============================================
-- SECTION 3: Add reviewed_by and reviewed_at to documents (optional enhancement)
-- =============================================
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- =============================================
-- SECTION 4: Create index on reviewed_by
-- =============================================
CREATE INDEX IF NOT EXISTS idx_documents_reviewed_by ON documents(reviewed_by);

-- =============================================
-- SECTION 5: Update RLS policies for admin operations
-- =============================================

-- Policy for admins to read all documents
CREATE POLICY "Admins can read all documents" ON documents
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Policy for admins to update all documents
CREATE POLICY "Admins can update all documents" ON documents
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- SECTION 6: Manual admin promotion example
-- =============================================
-- Replace 'admin@example.com' with the actual admin user's email
-- Run this after creating the admin user account:
-- 
-- UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
--
