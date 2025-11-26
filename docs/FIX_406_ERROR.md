# Fix 406 (Not Acceptable) Errors from Supabase

## Problem

You're seeing 406 errors in the browser console when the site tries to load images or track analytics:

```
GET https://ltjxhzfacfqfxkwzeinc.supabase.co/rest/v1/images?... 406 (Not Acceptable)
GET https://ltjxhzfacfqfxkwzeinc.supabase.co/rest/v1/unique_visitors?... 406 (Not Acceptable)
```

## Why This Happens

The Row Level Security (RLS) policies in Supabase might not be correctly configured to allow public read access. Even though the policies exist, they might not be applied correctly.

## Solution

Run the fix SQL script in your Supabase dashboard to ensure public read access is properly configured.

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Run the Fix Script

1. Open the file: `backend/sql/fix_public_read_access.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify It Worked

After running the script, you should see:
- A success message
- A table showing all the policies that were created

### Step 4: Test Your Site

1. Refresh your website: `https://www.my-refuge.org`
2. Open browser DevTools → Console
3. The 406 errors should be gone
4. Images should load correctly

## What the Fix Does

The script:
1. **Drops and recreates** the public read policies to ensure they're correct
2. **Enables RLS** on all tables (required for policies to work)
3. **Allows public SELECT** on images table (so anyone can view images)
4. **Allows public INSERT/UPDATE** on analytics tables (for tracking)
5. **Verifies** all policies are created correctly

## Still Getting 406 Errors?

1. **Check the SQL ran successfully** - Look for any error messages
2. **Verify your API key** - Make sure you're using the **anon public** key, not service_role
3. **Check Supabase logs** - Go to Logs → API Logs to see detailed error messages
4. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)

## Alternative: Manual Fix

If the script doesn't work, you can manually fix each policy:

```sql
-- Fix images table
DROP POLICY IF EXISTS "Images are viewable by everyone" ON images;
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT USING (true);
```

## Need More Help?

- Check Supabase documentation: https://supabase.com/docs/guides/auth/row-level-security
- Review your RLS policies in: Supabase Dashboard → Authentication → Policies

