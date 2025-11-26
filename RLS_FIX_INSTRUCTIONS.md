# Fix RLS Policy Error for Image Uploads

## Problem
You're getting this error when uploading images:
```
Error uploading image: new row violates row-level security policy
```

## Solution

The RLS policies are using `auth.role() = 'authenticated'` which can be unreliable. We need to change them to use `auth.uid() IS NOT NULL` instead.

## Quick Fix

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Run the Fix SQL**
   - Copy the contents of `backend/fix_images_rls.sql`
   - Paste into the SQL Editor
   - Click **Run**

3. **Test Again**
   - Try uploading an image in the admin dashboard
   - It should work now!

## What the Fix Does

The SQL file updates all RLS policies to use `auth.uid() IS NOT NULL` instead of `auth.role() = 'authenticated'`. This is more reliable because:

- `auth.uid()` returns the user's UUID if authenticated, `NULL` if not
- `auth.role()` can sometimes return unexpected values
- Checking for `IS NOT NULL` is more straightforward

## Tables Fixed

- `images` - Image uploads
- `calendar_events` - Event creation
- `header_content` - Header content editing
- `sparrows_closet_content` - Sparrows Closet content
- `sponsors` - Sponsor management
- `section_layouts` - Layout selection

## Alternative: Manual Fix

If you prefer to fix manually, update each policy like this:

```sql
-- Old (unreliable)
CREATE POLICY "Images are insertable by authenticated users" ON images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- New (reliable)
CREATE POLICY "Images are insertable by authenticated users" ON images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## Still Having Issues?

1. **Check you're logged in**
   - Make sure you're logged into the admin dashboard
   - Check browser console for auth errors

2. **Verify session**
   - Open browser DevTools → Application → Cookies
   - Look for Supabase session cookies

3. **Check RLS is enabled**
   - In Supabase Dashboard → Table Editor → images
   - Check that RLS is enabled (should show a lock icon)

4. **Verify policies exist**
   - In Supabase Dashboard → Authentication → Policies
   - Check that policies for `images` table exist

