-- Supabase Database Schema for Documents
-- Run this SQL in your Supabase SQL Editor to create the documents table

-- =============================================
-- SECTION 1: Create documents table
-- =============================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id TEXT UNIQUE NOT NULL,        -- The WebSocket room ID
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Untitled Document',
    subtitle TEXT,                           -- Subtopic (e.g., "DNS" under "System Design")
    content TEXT,                            -- HTML content from TipTap
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 2: Create indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_id ON documents(document_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- =============================================
-- SECTION 3: Enable Row Level Security
-- =============================================
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECTION 4: Create RLS policies
-- =============================================

-- Policy for service role to manage all documents (for API operations)
CREATE POLICY "Service role can manage all documents" ON documents
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy for authenticated users to read their own documents
CREATE POLICY "Users can read own documents" ON documents
    FOR SELECT
    TO authenticated
    USING (owner_id::text = auth.uid()::text);

-- Policy for authenticated users to insert their own documents
CREATE POLICY "Users can insert own documents" ON documents
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id::text = auth.uid()::text);

-- Policy for authenticated users to update their own documents
CREATE POLICY "Users can update own documents" ON documents
    FOR UPDATE
    TO authenticated
    USING (owner_id::text = auth.uid()::text)
    WITH CHECK (owner_id::text = auth.uid()::text);

-- Policy for authenticated users to delete their own documents
CREATE POLICY "Users can delete own documents" ON documents
    FOR DELETE
    TO authenticated
    USING (owner_id::text = auth.uid()::text);
