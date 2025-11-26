# Production Setup Guide

This guide will help you deploy My Refuge to production.

## 📋 Pre-Deployment Checklist

### 1. Database Setup ✅
- [x] All tables created via `backend/setup_database.sql`
- [x] RLS policies configured
- [x] Storage bucket `images` created and set to public
- [x] Default roles and content inserted

### 2. Environment Variables
- [ ] Create `.env.production` file (see `env.production.example`)
- [ ] Set production Supabase URL
- [ ] Set production Supabase anon key
- [ ] Verify all environment variables are set

### 3. Security
- [ ] Review RLS policies
- [ ] Verify no service_role keys in frontend code
- [ ] Enable Supabase email confirmations (if needed)
- [ ] Set up rate limiting (via Supabase)
- [ ] Review CORS settings

### 4. Performance
- [ ] Test production build locally
- [ ] Verify image optimization
- [ ] Check bundle sizes
- [ ] Test on slow connections

### 5. Monitoring
- [ ] Set up error tracking (optional)
- [ ] Configure analytics
- [ ] Set up uptime monitoring

## 🚀 Building for Production

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Production Environment Variables
```bash
# Copy the example file
cp env.production.example .env.production

# Edit .env.production with your production values
```

### Step 3: Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Step 4: Test Production Build Locally
```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

3. **Set Environment Variables:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add production variables

4. **Create `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Option 3: GitHub Pages

1. **Update `vite.config.ts`:**
   ```typescript
   base: '/my-refuge/', // Replace with your repo name
   ```

2. **Add GitHub Actions workflow** (see `.github/workflows/deploy.yml`)

3. **Set GitHub Secrets:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 4: Traditional Hosting (cPanel, FTP, etc.)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder contents** to your web server

3. **Configure your server:**
   - Point document root to `dist/` folder
   - Set up SPA routing (all routes → `index.html`)

## 🔒 Production Security Checklist

### Supabase Security
- [ ] RLS enabled on all tables
- [ ] Policies reviewed and tested
- [ ] No service_role key in frontend
- [ ] Email confirmations enabled (if needed)
- [ ] Rate limiting configured
- [ ] CORS properly configured

### Application Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No sensitive data in client code
- [ ] Error messages don't leak sensitive info
- [ ] Input validation on all forms

### Environment Variables
- [ ] `.env.production` not committed to git
- [ ] Production keys different from development
- [ ] Keys rotated regularly
- [ ] Keys stored securely (use platform secrets)

## ⚡ Performance Optimizations

### Build Optimizations
- ✅ Code splitting enabled
- ✅ Tree shaking enabled
- ✅ Minification enabled
- ✅ Console logs removed in production
- ✅ Source maps disabled (or optional)

### Runtime Optimizations
- ✅ Images loaded lazily
- ✅ Components code-split
- ✅ CSS code-split
- ✅ Vendor chunks separated

### Supabase Optimizations
- ✅ Indexes on frequently queried columns
- ✅ RLS policies optimized
- ✅ Image optimization via Supabase Storage
- ✅ Connection pooling (if using server-side)

## 📊 Monitoring & Analytics

### Error Tracking
Consider adding error tracking:
- Sentry
- LogRocket
- Rollbar

### Analytics
- Page views tracked in `page_views` table
- User interactions in `analytics_events` table
- Unique visitors in `unique_visitors` table

### Uptime Monitoring
- UptimeRobot
- Pingdom
- StatusCake

## 🔄 Backup & Recovery

### Database Backups
1. **Automatic Backups:**
   - Supabase provides automatic daily backups
   - Check Supabase Dashboard → Database → Backups

2. **Manual Backup:**
   ```sql
   -- Export via Supabase Dashboard → Database → Backups
   ```

### Storage Backups
- Images stored in Supabase Storage
- Consider periodic exports of important images

## 🧪 Testing Production Build

### Local Testing
```bash
npm run build
npm run preview
```

### Checklist
- [ ] All pages load correctly
- [ ] Images load from Supabase
- [ ] Admin login works
- [ ] Image upload works
- [ ] Content editing works
- [ ] Forms submit correctly
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Fast load times

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Environment Variables Not Working
- Verify variables start with `VITE_`
- Restart dev server after changes
- Check build logs for errors

### Images Not Loading
- Verify storage bucket is public
- Check CORS settings
- Verify image URLs are correct

### RLS Policy Errors
- Check user is authenticated
- Verify policies are correct
- Test policies in Supabase Dashboard

## 📝 Post-Deployment

1. **Test Everything:**
   - Homepage loads
   - Admin login works
   - Image upload works
   - Content editing works

2. **Monitor:**
   - Check error logs
   - Monitor analytics
   - Watch for performance issues

3. **Document:**
   - Document deployment process
   - Note any custom configurations
   - Update team on changes

## 🔗 Useful Links

- [Vite Production Guide](https://vitejs.dev/guide/build.html)
- [Supabase Production Guide](https://supabase.com/docs/guides/hosting)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)

