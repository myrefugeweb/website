# How to Push to GitHub

You need to authenticate with the `myrefugeweb` GitHub account to push code.

## Quick Method: Personal Access Token

### Step 1: Create a Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `My Refuge Website Push`
4. Select the **`repo`** scope (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Push Using the Token

Run this command:
```bash
git push -u origin main
```

When prompted:
- **Username**: Enter `myrefugeweb` (or your GitHub username)
- **Password**: Paste the Personal Access Token (NOT your GitHub password)

### Alternative: Store Credentials

If you want to avoid entering credentials each time, you can configure Git Credential Manager:

```bash
# Configure Git to use the credential manager
git config --global credential.helper manager-core

# Then push (you'll be prompted once, then it will be saved)
git push -u origin main
```

## After Pushing

1. Go to: https://github.com/myrefugeweb/website
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select: **GitHub Actions**
4. Go to **Settings** → **Secrets and variables** → **Actions**
5. Add these secrets:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
6. The GitHub Actions workflow will automatically build and deploy!

Your site will be live at: `https://myrefugeweb.github.io/website/`

