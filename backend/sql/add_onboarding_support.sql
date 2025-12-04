-- Add Onboarding Support to Users Table
-- Run this in Supabase Dashboard → SQL Editor

-- Add onboarding_completed column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Update existing users to have onboarding_completed = false (they can retake onboarding)
UPDATE users
SET onboarding_completed = false
WHERE onboarding_completed IS NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed);

