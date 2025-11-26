-- Fix Public Read Access for Images and Analytics Tables
-- This fixes 406 (Not Acceptable) errors when reading data
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================
-- FIX IMAGES TABLE - Ensure Public Read Access
-- ============================================

-- Drop and recreate the public read policy
DROP POLICY IF EXISTS "Images are viewable by everyone" ON images;
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT 
  USING (true);

-- Verify RLS is enabled
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FIX UNIQUE_VISITORS TABLE - Allow Public Insert/Update
-- ============================================

-- Drop and recreate policies
DROP POLICY IF EXISTS "Unique visitors are insertable by anyone" ON unique_visitors;
CREATE POLICY "Unique visitors are insertable by anyone" ON unique_visitors
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Unique visitors are updatable by anyone" ON unique_visitors;
CREATE POLICY "Unique visitors are updatable by anyone" ON unique_visitors
  FOR UPDATE 
  USING (true);

-- Allow public SELECT for tracking (needed for analytics)
DROP POLICY IF EXISTS "Unique visitors are viewable by everyone" ON unique_visitors;
CREATE POLICY "Unique visitors are viewable by everyone" ON unique_visitors
  FOR SELECT 
  USING (true);

-- Verify RLS is enabled
ALTER TABLE unique_visitors ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FIX ANALYTICS_EVENTS TABLE - Allow Public Insert
-- ============================================

-- Drop and recreate policy
DROP POLICY IF EXISTS "Analytics events are insertable by anyone" ON analytics_events;
CREATE POLICY "Analytics events are insertable by anyone" ON analytics_events
  FOR INSERT 
  WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FIX PAGE_VIEWS TABLE - Allow Public Insert
-- ============================================

-- Drop and recreate policy
DROP POLICY IF EXISTS "Page views are insertable by anyone" ON page_views;
CREATE POLICY "Page views are insertable by anyone" ON page_views
  FOR INSERT 
  WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFY POLICIES
-- ============================================

-- Check that policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('images', 'unique_visitors', 'analytics_events', 'page_views')
ORDER BY tablename, policyname;

