# Quick Start - Database Setup

## 🚀 Fastest Way to Set Up

### Option 1: Use the Setup Script (Recommended)

**Windows:**
```powershell
cd backend
.\setup.ps1
```

**Mac/Linux:**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

4. **Link to your project**:
   ```bash
   supabase link --project-ref ltjxhzfacfqfxkwzeinc
   ```
   
   You'll be prompted for your database password.

5. **Apply migrations**:
   ```bash
   supabase db push
   ```

## ✅ Verification

After setup, verify everything worked:

1. **Check tables were created**:
   - Go to Supabase Dashboard → Table Editor
   - You should see: `images`, `calendar_events`, `header_content`, `sparrows_closet_content`, `roles`, `user_roles`, `page_views`, `unique_visitors`, `analytics_events`

2. **Check storage bucket**:
   - Go to Supabase Dashboard → Storage
   - Create bucket named `images` (if not exists)
   - Make it **Public**

3. **Test admin login**:
   - Go to your site: `http://localhost:5173/admin`
   - Login with your credentials

## 📋 What Gets Created

### Tables
- ✅ `roles` - User roles
- ✅ `user_roles` - User-role assignments
- ✅ `images` - Image management
- ✅ `calendar_events` - Events
- ✅ `header_content` - Page headers
- ✅ `sparrows_closet_content` - Sparrows Closet content
- ✅ `page_views` - Analytics tracking
- ✅ `unique_visitors` - Visitor tracking
- ✅ `analytics_events` - Event tracking

### Default Data
- ✅ 4 default roles (super_admin, admin, editor, viewer)
- ✅ Default header content
- ✅ Default Sparrows Closet content

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies configured for public read, authenticated write
- ✅ Analytics tables allow public insert (for tracking)

## 🔧 Troubleshooting

### "Project not found"
- Make sure you're logged in: `supabase login`
- Verify project ID: `ltjxhzfacfqfxkwzeinc`

### "Database password incorrect"
- Get your password from Supabase Dashboard → Settings → Database
- Or reset it if needed

### "Migration failed"
- Check error message in terminal
- Verify you have proper permissions
- Try running migrations one at a time

### Tables not showing up
- Refresh Supabase Dashboard
- Check Table Editor
- Verify migrations ran successfully: `supabase migration list`

## 📚 Next Steps

1. **Create Storage Bucket**:
   - Supabase Dashboard → Storage → New bucket
   - Name: `images`
   - Public: ON

2. **Assign Admin Role**:
   - Use the admin dashboard (once logged in)
   - Or manually in Supabase Dashboard

3. **Start Tracking Analytics**:
   - Analytics will start tracking automatically once frontend code is connected

## 🆘 Need Help?

- See `SUPABASE_CLI_SETUP.md` for detailed CLI instructions
- See `DATABASE_SCHEMA.md` for table documentation
- See `README.md` for general backend info

