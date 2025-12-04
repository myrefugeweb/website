-- Fix RLS Policy for published_is_active Column Access
-- This fixes 406 (Not Acceptable) errors when querying images with published_is_active
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================
-- STEP 1: Ensure published_is_active column exists
-- ============================================

-- Add the column if it doesn't exist
ALTER TABLE images
  ADD COLUMN IF NOT EXISTS published_is_active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_unpublished_changes BOOLEAN DEFAULT false;

-- Initialize published_is_active with current is_active values for existing records
UPDATE images 
SET published_is_active = COALESCE(is_active, false),
    has_unpublished_changes = false
WHERE published_is_active IS NULL;

-- ============================================
-- STEP 2: Fix RLS Policy - Allow Public Access to All Columns
-- ============================================

-- Drop existing policy
DROP POLICY IF EXISTS "Images are viewable by everyone" ON images;

-- Recreate policy that allows public read access to all columns
-- This explicitly allows filtering on published_is_active
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT 
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Grant explicit column permissions (if needed)
-- ============================================

-- Grant SELECT on all columns to anon role
GRANT SELECT ON images TO anon;
GRANT SELECT ON images TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify the policy exists
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'images' AND policyname = 'Images are viewable by everyone';

-- Test query (should work without 406 error)
-- SELECT url, alt_text, published_is_active 
-- FROM images 
-- WHERE section = 'hero' AND published_is_active = true 
-- LIMIT 1;

