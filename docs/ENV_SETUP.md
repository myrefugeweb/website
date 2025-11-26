# Environment Variables Setup

## Quick Setup

1. **Create your `.env` file** in the root of the project:
   ```bash
   # On Windows (PowerShell)
   Copy-Item env.example .env
   
   # On Mac/Linux
   cp env.example .env
   ```

2. **Open the `.env` file** and fill in your Supabase credentials:

```env
# Your Supabase Project URL
# Find this in: Supabase Dashboard → Settings → API → Project URL
# Example: https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# Your Supabase Publishable/Anon Key
# Find this in: Supabase Dashboard → Settings → API → Project API keys → anon public
# This is the key that starts with "sb_" or "eyJ" (JWT format)
VITE_SUPABASE_ANON_KEY=sb_secret_1iUP59ZzKOQAs2o1QAIbEA_N0GeS2u3
```

3. **Get your Project URL:**
   - Go to your Supabase Dashboard
   - Navigate to **Settings** → **API**
   - Copy the **Project URL** (it looks like: `https://xxxxx.supabase.co`)
   - Replace `https://your-project-ref.supabase.co` in your `.env` file

4. **Verify your keys:**
   - The **VITE_SUPABASE_ANON_KEY** should be your publishable/anon key (safe for frontend)
   - If you have a service role key, do NOT put it in the frontend `.env` file

5. **Restart your dev server** after creating/updating the `.env` file:
   ```bash
   npm run dev
   ```

## Troubleshooting

### "Invalid API key" error
- Make sure your `.env` file is in the root directory (same level as `package.json`)
- Check that the key doesn't have extra spaces or quotes
- Verify you're using the **anon/public** key, not the service role key
- Restart your dev server after updating `.env`

### Can't find the keys?
1. Go to [supabase.com](https://supabase.com) and log in
2. Select your project
3. Go to **Settings** → **API**
4. You'll see:
   - **Project URL** - copy this for `VITE_SUPABASE_URL`
   - **Project API keys** section:
     - **anon public** - copy this for `VITE_SUPABASE_ANON_KEY` (this is the publishable key)
     - **service_role** - DO NOT use this in frontend (secret key for backend only)

## Important Notes

- ✅ The `.env` file is already in `.gitignore` - your keys won't be committed
- ✅ The `VITE_SUPABASE_ANON_KEY` is safe to use in frontend code
- ❌ Never put the service_role key in frontend code
- ❌ Never commit your `.env` file to git

