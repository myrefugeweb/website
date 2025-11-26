-- Fix Storage Bucket Policies for Image Uploads
-- This fixes 400 (Bad Request) errors when uploading images to storage
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================
-- FIX STORAGE BUCKET POLICIES
-- ============================================

-- First, ensure the bucket exists (if it doesn't, create it via Storage UI)
-- Then set up policies for the 'images' storage bucket

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read images" ON storage.objects;

-- Allow authenticated users to upload to images bucket
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid() IS NOT NULL
  );

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update images" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'images' AND
    auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid() IS NOT NULL
  );

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete images" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'images' AND
    auth.uid() IS NOT NULL
  );

-- Allow public to read images (so they can be displayed on the site)
CREATE POLICY "Allow public to read images" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'images');

-- ============================================
-- VERIFY STORAGE POLICIES
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
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

