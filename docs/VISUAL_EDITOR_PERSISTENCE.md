# Visual Editor - Data Persistence & Public Access

## ✅ Yes, Everything is Persisted!

All changes made in the Visual Editor are **saved to your Supabase database** and will be visible to all visitors on your published site.

## What Gets Saved

### 1. **Images** ✅
- When you select an image for a section, it's saved to the `images` table
- Images are stored in Supabase Storage and referenced in the database
- **Public visitors can see all images** - RLS policies allow public read access

### 2. **Layouts** ✅
- When you change a section's layout, it's saved to the `section_layouts` table
- Layout preferences persist across page reloads
- **Public visitors see the selected layouts** - RLS policies allow public read access

## Public Access Configuration

Your database has Row Level Security (RLS) policies that allow:

✅ **Public Read Access** for:
- `images` table - Anyone can view images
- `section_layouts` table - Anyone can view layout settings
- Storage bucket - Images are publicly accessible

✅ **Authenticated Write Access** for:
- Only logged-in admins can upload/edit images
- Only logged-in admins can change layouts

## Error Handling

The site is designed to handle errors gracefully:

1. **If an image fails to load:**
   - Shows a placeholder: "No image available"
   - Site continues to work normally
   - No errors shown to visitors

2. **If a layout fails to load:**
   - Defaults to 'default' layout
   - Site continues to work normally
   - No errors shown to visitors

3. **If database is temporarily unavailable:**
   - Components show placeholders
   - Site doesn't crash
   - Visitors see a working site (just without dynamic content)

## Verification Checklist

To ensure everything works for public visitors:

### 1. Verify RLS Policies
Run this in Supabase SQL Editor to check your policies:

```sql
-- Check images table policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'images';

-- Check section_layouts table policies  
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'section_layouts';
```

You should see policies like:
- "Images are viewable by everyone" (SELECT)
- "Section layouts are viewable by everyone" (SELECT)

### 2. Test Public Access
1. Open your site in an **incognito/private window** (not logged in)
2. Check browser console (F12) for any errors
3. Verify images load correctly
4. Verify layouts display correctly

### 3. If You See 406 Errors
If visitors see 406 (Not Acceptable) errors, run:
- `backend/sql/fix_public_read_access.sql` in Supabase SQL Editor

This ensures public read access is properly configured.

## How It Works

1. **Admin makes changes** → Saved to Supabase database
2. **Database persists data** → Changes are permanent
3. **Public site loads** → Reads from same database
4. **RLS policies allow** → Public can read, but not write
5. **Visitors see changes** → Immediately after you save

## Important Notes

- ✅ Changes are **immediate** - No cache delays
- ✅ Changes are **permanent** - Stored in database
- ✅ Changes are **public** - All visitors see them
- ✅ Site is **resilient** - Handles errors gracefully
- ✅ No authentication needed - Public visitors don't need to log in

## Troubleshooting

### Images Not Showing for Visitors
1. Check RLS policies (see above)
2. Verify storage bucket is public
3. Check browser console for errors
4. Run `fix_public_read_access.sql` if needed

### Layouts Not Applying
1. Check `section_layouts` table has entries
2. Verify RLS policies allow public SELECT
3. Check browser console for errors

### Site Shows Errors
1. Check Supabase is accessible
2. Verify API keys are correct
3. Check RLS policies are set up
4. Review browser console for specific errors

