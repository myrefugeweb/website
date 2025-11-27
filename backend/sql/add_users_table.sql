-- Add users table to store user emails
-- This allows us to display user emails in the admin dashboard
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (for displaying in admin dashboard)
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert (when creating new users)
CREATE POLICY "Authenticated users can insert" ON users
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update" ON users
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Function to automatically sync email from auth.users
-- This will be called via trigger when users are created/updated in auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, updated_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) 
  DO UPDATE SET 
    email = NEW.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync email when user is created/updated in auth.users
-- Note: This requires access to auth.users, so it uses SECURITY DEFINER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();

-- Migrate existing users (if any)
-- This will populate the users table with emails from existing auth.users
INSERT INTO users (id, email)
SELECT id, email
FROM auth.users
WHERE email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

