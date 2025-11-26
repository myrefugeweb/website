# Production Deployment Checklist

Use this checklist to ensure everything is ready for production deployment.

## ✅ Pre-Deployment

### Database
- [ ] All tables created and migrated
- [ ] RLS policies configured and tested
- [ ] Storage bucket `images` created and public
- [ ] Default roles inserted (super_admin, admin, editor, viewer)
- [ ] Default content inserted (header, sparrows closet)
- [ ] Indexes created for performance
- [ ] Helper functions created

### Environment Variables
- [ ] `.env.production` file created
- [ ] `VITE_SUPABASE_URL` set to production URL
- [ ] `VITE_SUPABASE_ANON_KEY` set to production anon key
- [ ] All environment variables verified
- [ ] No development keys in production config

### Security
- [ ] RLS enabled on all tables
- [ ] Policies tested and working
- [ ] No service_role keys in frontend
- [ ] CORS configured correctly
- [ ] Email confirmations enabled (if needed)
- [ ] Rate limiting configured

### Code Quality
- [ ] No console.log statements (or removed in build)
- [ ] No debug code
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Error boundaries configured

## 🏗️ Build & Test

### Build Process
- [ ] `npm run build` completes successfully
- [ ] No build errors or warnings
- [ ] Bundle size is reasonable
- [ ] Source maps disabled (or optional)

### Local Testing
- [ ] `npm run preview` works
- [ ] All pages load correctly
- [ ] Images load from Supabase
- [ ] Admin login works
- [ ] Image upload works
- [ ] Content editing works
- [ ] Forms submit correctly
- [ ] Navigation works
- [ ] Mobile responsive

### Performance
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] Code splitting working
- [ ] Lazy loading implemented
- [ ] No unnecessary requests

## 🚀 Deployment

### Platform Setup
- [ ] Deployment platform configured
- [ ] Environment variables set in platform
- [ ] Build settings configured
- [ ] Domain configured
- [ ] SSL certificate active

### Post-Deployment
- [ ] Site accessible via production URL
- [ ] All pages load correctly
- [ ] Admin login works
- [ ] Image upload works
- [ ] Content editing works
- [ ] Analytics tracking works
- [ ] Error tracking configured (if applicable)

## 🔍 Monitoring

### Setup
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Uptime monitoring set up
- [ ] Logging configured

### Verification
- [ ] Errors are being tracked
- [ ] Analytics data is being collected
- [ ] Uptime monitoring is active
- [ ] Logs are accessible

## 🔄 Maintenance

### Regular Tasks
- [ ] Database backups verified
- [ ] Storage backups configured
- [ ] Update dependencies regularly
- [ ] Monitor error logs
- [ ] Review analytics
- [ ] Security updates applied

### Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide updated
- [ ] Team access configured

## 🆘 Rollback Plan

- [ ] Previous version backed up
- [ ] Rollback process documented
- [ ] Team knows rollback procedure
- [ ] Database migration rollback plan

## 📝 Notes

Add any custom configurations or important notes here:

```
[Your notes here]
```

---

**Last Updated:** [Date]
**Deployed By:** [Name]
**Version:** [Version]

