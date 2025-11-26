# SSL Certificate Issue - Fix Guide

## Problem
You're seeing: `NET::ERR_CERT_COMMON_NAME_INVALID` - The certificate is for `*.github.io` instead of `www.my-refuge.org`

## Why This Happens
This is **normal** during initial setup. GitHub needs to:
1. Detect your custom domain in DNS
2. Provision a new SSL certificate for your domain
3. This can take **up to 24 hours**

## Solution Steps

### Step 1: Verify Custom Domain in GitHub
1. Go to: https://github.com/myrefugeweb/website/settings/pages
2. Under **"Custom domain"**, make sure `www.my-refuge.org` is entered
3. Click **Save** if you just added it
4. Wait a few minutes for GitHub to detect the domain

### Step 2: Check Domain Status
In the GitHub Pages settings, you should see one of these statuses:

- ✅ **"DNS check successful"** - DNS is correct, waiting for certificate
- ⚠️ **"DNS check failed"** - DNS might not be fully propagated yet
- 🔒 **"Certificate is being provisioned"** - GitHub is working on it
- ✅ **"Certificate is ready"** - You can enable HTTPS!

### Step 3: Wait for Certificate
- **Minimum**: 5-10 minutes (if DNS propagated quickly)
- **Typical**: 1-4 hours
- **Maximum**: Up to 24 hours

### Step 4: Enable HTTPS
Once the certificate is ready:
1. Go back to Settings → Pages
2. Check the box: **"Enforce HTTPS"**
3. Your site will now be secure!

## Temporary Workaround (NOT Recommended for Production)

If you need to test the site before the certificate is ready:
- Click "Continue to www.my-refuge.org (unsafe)" - but this is just for testing
- **Don't use this in production** - wait for the proper certificate

## Check Certificate Status

You can check if the certificate is ready by:
1. Going to GitHub Pages settings
2. Looking at the domain status indicator
3. Or checking: https://www.ssllabs.com/ssltest/analyze.html?d=www.my-refuge.org

## Common Issues

### "DNS check failed"
- Wait longer for DNS propagation (can take up to 48 hours)
- Verify your CNAME record: `www` → `myrefugeweb.github.io`
- Check DNS propagation: https://www.whatsmydns.net/#CNAME/www.my-refuge.org

### Certificate taking longer than 24 hours
- Double-check the domain is correctly entered in GitHub
- Verify DNS is fully propagated
- Contact GitHub Support if it's been more than 48 hours

## Expected Timeline

1. **DNS propagates**: 5 minutes - 48 hours (usually 1-4 hours)
2. **GitHub detects domain**: 5-15 minutes after DNS propagates
3. **Certificate provisioned**: 10 minutes - 24 hours (usually 1-4 hours)
4. **Total**: Usually 2-8 hours, can take up to 48 hours

## Current Status Check

Right now, your site is:
- ✅ Resolving correctly (DNS is working)
- ⏳ Waiting for SSL certificate to be provisioned
- ⚠️ Showing insecure warning (temporary)

**Action**: Just wait for GitHub to provision the certificate, then enable HTTPS in settings!

