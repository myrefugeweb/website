-- Fix RLS Policies for Images Table
-- This fixes the issue where authenticated users can't upload images
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Images are insertable by authenticated users" ON images;
DROP POLICY IF EXISTS "Images are updatable by authenticated users" ON images;
DROP POLICY IF EXISTS "Images are deletable by authenticated users" ON images;

-- Recreate with auth.uid() check (more reliable than auth.role())
CREATE POLICY "Images are insertable by authenticated users" ON images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Images are updatable by authenticated users" ON images
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Images are deletable by authenticated users" ON images
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Also fix calendar_events policies
DROP POLICY IF EXISTS "Events are insertable by authenticated users" ON calendar_events;
DROP POLICY IF EXISTS "Events are updatable by authenticated users" ON calendar_events;
DROP POLICY IF EXISTS "Events are deletable by authenticated users" ON calendar_events;

CREATE POLICY "Events are insertable by authenticated users" ON calendar_events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Events are updatable by authenticated users" ON calendar_events
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Events are deletable by authenticated users" ON calendar_events
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix header_content policies
DROP POLICY IF EXISTS "Header content is insertable by authenticated users" ON header_content;
DROP POLICY IF EXISTS "Header content is updatable by authenticated users" ON header_content;
DROP POLICY IF EXISTS "Header content is deletable by authenticated users" ON header_content;

CREATE POLICY "Header content is insertable by authenticated users" ON header_content
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Header content is updatable by authenticated users" ON header_content
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Header content is deletable by authenticated users" ON header_content
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix sparrows_closet_content policies
DROP POLICY IF EXISTS "Sparrows Closet content is insertable by authenticated users" ON sparrows_closet_content;
DROP POLICY IF EXISTS "Sparrows Closet content is updatable by authenticated users" ON sparrows_closet_content;
DROP POLICY IF EXISTS "Sparrows Closet content is deletable by authenticated users" ON sparrows_closet_content;

CREATE POLICY "Sparrows Closet content is insertable by authenticated users" ON sparrows_closet_content
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sparrows Closet content is updatable by authenticated users" ON sparrows_closet_content
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Sparrows Closet content is deletable by authenticated users" ON sparrows_closet_content
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix sponsors policies (if they exist)
DROP POLICY IF EXISTS "Sponsors are insertable by authenticated users" ON sponsors;
DROP POLICY IF EXISTS "Sponsors are updatable by authenticated users" ON sponsors;
DROP POLICY IF EXISTS "Sponsors are deletable by authenticated users" ON sponsors;

CREATE POLICY "Sponsors are insertable by authenticated users" ON sponsors
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Sponsors are updatable by authenticated users" ON sponsors
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Sponsors are deletable by authenticated users" ON sponsors
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix section_layouts policies (if they exist)
DROP POLICY IF EXISTS "Section layouts are insertable by authenticated users" ON section_layouts;
DROP POLICY IF EXISTS "Section layouts are updatable by authenticated users" ON section_layouts;

CREATE POLICY "Section layouts are insertable by authenticated users" ON section_layouts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Section layouts are updatable by authenticated users" ON section_layouts
  FOR UPDATE USING (auth.uid() IS NOT NULL);

