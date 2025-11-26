# Add GitHub Secrets for Supabase

Your site needs Supabase credentials to work. These need to be added as **GitHub Secrets** so the build process can access them.

## Quick Steps

1. **Go to GitHub Secrets:**
   - Navigate to: https://github.com/myrefugeweb/website/settings/secrets/actions
   - Or: Go to your repo → **Settings** → **Secrets and variables** → **Actions**

2. **Add `VITE_SUPABASE_URL`:**
   - Click **"New repository secret"**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase project URL
     - Example: `https://ltjxhzfacfqfxkwzeinc.supabase.co`
     - Find it in: Supabase Dashboard → Settings → API → Project URL
   - Click **"Add secret"**

3. **Add `VITE_SUPABASE_ANON_KEY`:**
   - Click **"New repository secret"** again
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon/public key
     - Find it in: Supabase Dashboard → Settings → API → Project API keys → **anon public**
     - This is the **publishable** key (safe for frontend)
     - ⚠️ **NOT** the service_role key!
   - Click **"Add secret"**

4. **Trigger a new build:**
   - Go to: https://github.com/myrefugeweb/website/actions
   - Click **"Deploy to GitHub Pages"** workflow
   - Click **"Run workflow"** → **"Run workflow"** button
   - This will rebuild with the new secrets

## How to Find Your Supabase Keys

1. Go to [supabase.com](https://supabase.com) and log in
2. Select your project
3. Go to **Settings** → **API**
4. You'll see:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **Project API keys** section:
     - **anon public** → Use for `VITE_SUPABASE_ANON_KEY` ✅
     - **service_role** → DO NOT USE (this is secret!) ❌

## Verify Secrets Are Set

After adding secrets, you can verify they're there:
- Go to: https://github.com/myrefugeweb/website/settings/secrets/actions
- You should see both secrets listed:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## After Adding Secrets

1. **Wait for the build to complete** (2-3 minutes)
2. **Check the Actions tab** to see if the build succeeded
3. **Visit your site** - it should now work!

## Troubleshooting

### "Secret not found" error
- Make sure the secret names are **exactly**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check for typos or extra spaces

### Still getting "Supabase is not configured"
- Make sure you triggered a new build after adding secrets
- Check the Actions log to see if the build used the secrets
- Verify the secret values are correct (no extra spaces, full URLs)

### Build still failing
- Check the Actions log for specific errors
- Make sure you're using the **anon public** key, not service_role
- Verify the Supabase URL is correct and includes `https://`

