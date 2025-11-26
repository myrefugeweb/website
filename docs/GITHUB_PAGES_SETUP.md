# GitHub Pages Deployment Setup

This guide will help you push your code to GitHub and set up GitHub Pages.

## Step 1: Authenticate with GitHub

You need to authenticate with the `myrefugeweb` GitHub account. You have a few options:

### Option A: Use SSH (Recommended)

1. Generate an SSH key if you don't have one:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add the SSH key to your GitHub account:
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub` (or `type ~/.ssh/id_ed25519.pub` on Windows)
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste your key and save

3. Change the remote URL to use SSH:
   ```bash
   git remote set-url origin git@github.com:myrefugeweb/website.git
   ```

4. Push to GitHub:
   ```bash
   git push -u origin main
   ```

### Option B: Use Personal Access Token

1. Create a Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Select scopes: `repo` (full control of private repositories)
   - Copy the token

2. Push using the token:
   ```bash
   git push -u origin main
   ```
   When prompted for password, paste your Personal Access Token.

### Option C: Use GitHub CLI

1. Install GitHub CLI if not already installed
2. Authenticate:
   ```bash
   gh auth login
   ```
3. Push:
   ```bash
   git push -u origin main
   ```

## Step 2: Enable GitHub Pages

After pushing your code:

1. Go to your repository: https://github.com/myrefugeweb/website
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. The GitHub Actions workflow will automatically build and deploy your site

## Step 3: Configure Environment Variables (Required)

The build process needs your Supabase credentials. Add them as GitHub Secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:
   - Name: `VITE_SUPABASE_URL`
     Value: Your Supabase project URL
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: Your Supabase anon key

## Step 4: Verify Deployment

1. After pushing, go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Once it completes, your site will be available at:
   ```
   https://myrefugeweb.github.io/website/
   ```

## Troubleshooting

### Build Fails
- Check that environment variables are set correctly in GitHub Secrets
- Review the Actions logs for specific error messages

### Site Not Loading
- Verify the base path in `vite.config.ts` is set to `/website/`
- Check that the GitHub Pages source is set to "GitHub Actions"
- Wait a few minutes for DNS propagation

### Authentication Issues
- Make sure you're authenticated with the correct GitHub account
- Try using SSH instead of HTTPS
- Verify you have write access to the repository

