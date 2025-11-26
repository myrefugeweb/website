# Quick Deployment Guide

## 🚀 Fastest Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

That's it! Your site is live.

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables

### Option 3: GitHub Pages (Free)

1. **Push to GitHub**

2. **Set up GitHub Actions:**
   - The workflow file is already created (`.github/workflows/deploy.yml`)
   - Add secrets in GitHub: Settings → Secrets → Actions
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Push to main branch** - deployment happens automatically

### Option 4: Traditional Hosting

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your web server

3. **Configure server** to serve `index.html` for all routes

## 📋 Before Deploying

1. ✅ Test build: `npm run build`
2. ✅ Test preview: `npm run preview`
3. ✅ Verify environment variables
4. ✅ Check security settings

## 🔗 Full Documentation

See `PRODUCTION_SETUP.md` for complete production guide.

