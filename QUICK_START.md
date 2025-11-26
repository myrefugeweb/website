# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables

**On Windows (PowerShell):**
```powershell
.\setup-env.ps1
```

**On Mac/Linux:**
```bash
chmod +x setup-env.sh
./setup-env.sh
```

**Or manually:**
1. Copy `env.example` to `.env`
2. Open `.env` and fill in:
   - `VITE_SUPABASE_URL` - Your Supabase project URL (from Supabase Dashboard → Settings → API)
   - `VITE_SUPABASE_ANON_KEY` - Your publishable/anon key (also from Settings → API)

### Step 3: Get Your Supabase Keys

1. Go to [supabase.com](https://supabase.com) and log in
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

### Step 4: Run the Development Server
```bash
npm run dev
```

### Step 5: Access the Site
- Frontend: http://localhost:5173
- Admin Login: http://localhost:5173/admin (or click "login" in footer)

## 🔧 Troubleshooting

### "Invalid API key" Error
1. ✅ Check that your `.env` file exists in the root directory
2. ✅ Verify the keys don't have extra spaces or quotes
3. ✅ Make sure you're using the **anon/public** key, not the service_role key
4. ✅ Restart your dev server after updating `.env`

### Can't Login?
1. ✅ Make sure you created a user in Supabase (Authentication → Users)
2. ✅ Check browser console for errors
3. ✅ Verify your `.env` file has the correct keys

### Still Having Issues?
- Check `ENV_SETUP.md` for detailed environment setup
- Check `SUPABASE_SETUP.md` for database setup
- Check browser console for specific error messages

## 📝 Next Steps

1. Set up your database tables (see `SUPABASE_SETUP.md`)
2. Create an admin user in Supabase (Authentication → Users)
3. Upload images through the admin dashboard
4. Customize content through the admin dashboard

