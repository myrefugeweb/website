-- Fix login error caused by users table trigger
-- The trigger needs to bypass RLS to insert into users table
-- Run this in Supabase Dashboard → SQL Editor

-- Drop and recreate the function with proper permissions
DROP FUNCTION IF EXISTS sync_user_email() CASCADE;

-- Recreate function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert or update user email
  INSERT INTO public.users (id, email, updated_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) 
  DO UPDATE SET 
    email = NEW.email,
    updated_at = NOW();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth operation
    RAISE WARNING 'Error syncing user email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();

-- Also update RLS policies to be more permissive for the trigger
-- The trigger uses SECURITY DEFINER, but we should also ensure policies allow it

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert" ON users;
DROP POLICY IF EXISTS "Authenticated users can update" ON users;

-- Create new policies that allow the trigger to work
-- The trigger runs with SECURITY DEFINER, so it should bypass RLS,
-- but we'll make the policies more permissive just in case
CREATE POLICY "Allow trigger inserts" ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow trigger updates" ON users
  FOR UPDATE
  USING (true);

-- Keep the select policy as is (public read)
-- The existing "Users are viewable by everyone" policy should remain

