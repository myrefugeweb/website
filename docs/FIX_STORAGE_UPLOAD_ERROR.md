# Fix Storage Upload 400 Error

## Problem

You're getting a **400 (Bad Request)** error when trying to upload images:
```
POST https://ltjxhzfacfqfxkwzeinc.supabase.co/storage/v1/object/images/images/hero-1764193662362.png 400 (Bad Request)
```

And the error message says:
```
Error uploading image: RLS Policy Error: Your account may not have permission to upload images.
```

## Why This Happens

Supabase Storage buckets have **separate RLS policies** from database tables. Even though you're logged in and can insert into the `images` table, the storage bucket needs its own policies to allow file uploads.

## Solution

Run the storage bucket policies fix in your Supabase dashboard.

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Run the Storage Bucket Fix

1. Open the file: `backend/sql/fix_storage_bucket_policies.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)

**OR** you can run the updated `fix_public_read_access.sql` which now includes storage bucket fixes.

### Step 3: Verify Storage Bucket Exists

Make sure the `images` storage bucket exists:

1. Go to **Storage** in your Supabase dashboard
2. Check if there's a bucket named `images`
3. If it doesn't exist:
   - Click **New bucket**
   - Name: `images`
   - Make it **Public** (toggle on)
   - Click **Create bucket**

### Step 4: Test Upload

1. Go back to your admin dashboard
2. Try uploading an image
3. It should work now!

## What the Fix Does

The script creates storage bucket policies that:
- ✅ Allow **authenticated users** to upload images
- ✅ Allow **authenticated users** to update/delete images
- ✅ Allow **public** to read images (so they display on the site)

## Still Getting 400 Error?

1. **Check the bucket exists**: Go to Storage → make sure `images` bucket exists
2. **Check bucket is public**: The bucket should be set to "Public" in Storage settings
3. **Verify you're logged in**: Check that you have an active session in the admin dashboard
4. **Check Supabase logs**: Go to Logs → API Logs to see detailed error messages

## Alternative: Manual Fix via UI

You can also set storage policies via the Supabase UI:

1. Go to **Storage** → **Policies**
2. Select the `images` bucket
3. Add policies:
   - **INSERT**: `auth.uid() IS NOT NULL`
   - **UPDATE**: `auth.uid() IS NOT NULL`
   - **DELETE**: `auth.uid() IS NOT NULL`
   - **SELECT**: `true` (public read)

