# Database Setup Instructions

## 🚀 Quick Setup (Recommended)

The easiest way to set up your database is to run the SQL file directly in the Supabase Dashboard.

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **ltjxhzfacfqfxkwzeinc**
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Setup SQL

1. Click **New Query**
2. Open the file `backend/setup_database.sql` in your code editor
3. Copy the **entire contents** of the file
4. Paste it into the SQL Editor in Supabase
5. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Setup

After running the SQL, verify everything was created:

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `roles`
   - ✅ `user_roles`
   - ✅ `images`
   - ✅ `header_content`
   - ✅ `sparrows_closet_content`
   - ✅ `calendar_events`
   - ✅ `page_views`
   - ✅ `unique_visitors`
   - ✅ `analytics_events`

3. Check **Database** → **Functions** for:
   - ✅ `user_has_role`
   - ✅ `user_has_permission`

4. Check **Database** → **Views** for:
   - ✅ `daily_page_views`
   - ✅ `analytics_summary`
   - ✅ `top_pages`
   - ✅ `event_analytics`

### Step 4: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `images`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**

## ✅ That's It!

Your database is now set up and ready to use. You can:

- Login to the admin dashboard
- Upload images
- Manage content
- Track analytics

## 🔧 Alternative: Using Supabase CLI

If you prefer to use the CLI (requires installation):

### Install Supabase CLI

**Windows (using Scoop):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Mac (using Homebrew):**
```bash
brew install supabase/tap/supabase
```

**Or download directly:**
- Visit: https://github.com/supabase/cli/releases
- Download the appropriate binary for your OS

### Use CLI

```bash
# Login
supabase login

# Link project
cd backend
supabase link --project-ref ltjxhzfacfqfxkwzeinc

# Push migrations
supabase db push
```

## 🆘 Troubleshooting

### "Table already exists" errors
- This is normal if you've run the script before
- The `IF NOT EXISTS` clauses prevent errors
- You can safely ignore these messages

### "Policy already exists" errors
- The script uses `DROP POLICY IF EXISTS` to handle this
- If you see errors, the policies may need to be dropped manually first

### "Function already exists" errors
- The script uses `CREATE OR REPLACE` to handle this
- These are safe to ignore

## 📚 Next Steps

1. **Assign Admin Role**: 
   - Go to Table Editor → `user_roles`
   - Add a row with your user_id and the admin role_id

2. **Test Admin Dashboard**:
   - Login at `/admin`
   - Try uploading an image
   - Edit content

3. **Set Up Analytics**:
   - Analytics will start tracking automatically
   - View data in the `page_views` and `analytics_events` tables

