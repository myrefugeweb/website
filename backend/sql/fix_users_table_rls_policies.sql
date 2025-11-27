-- Fix RLS policies for users table to allow super admins to manage users
-- Run this in Supabase Dashboard → SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert" ON users;
DROP POLICY IF EXISTS "Authenticated users can update" ON users;
DROP POLICY IF EXISTS "Allow trigger inserts" ON users;
DROP POLICY IF EXISTS "Allow trigger updates" ON users;

-- SELECT: Anyone can read (for displaying in admin dashboard)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT
  USING (true);

-- INSERT: Allow authenticated users and triggers
CREATE POLICY "Allow user inserts" ON users
  FOR INSERT
  WITH CHECK (true);

-- UPDATE: Allow authenticated users to update
CREATE POLICY "Authenticated users can update" ON users
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- DELETE: Allow authenticated users to delete (super admins will use this)
CREATE POLICY "Authenticated users can delete" ON users
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

