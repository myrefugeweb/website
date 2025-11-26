# Custom Domain Setup for GitHub Pages

This guide will help you configure the custom domain `www.my-refuge.org` for your GitHub Pages site.

## Step 1: Configure DNS Records

You need to update DNS records at your domain registrar (Squarespace) to point to GitHub Pages instead of Webflow.

**Note:** Squarespace may show a warning about DNS records - this is normal and can be ignored. See `docs/SQUARESPACE_DNS_WARNING.md` for details.

### Remove Webflow Records

**Delete these existing records:**
1. **CNAME** record: `www` → `proxy-ssl.webflow.com` (DELETE THIS)
2. **TXT** record: `_webflow` → `one-time-verification=...` (DELETE THIS)
3. **A** records for `@` pointing to Webflow IPs (you can keep these or remove them)

### Add GitHub Pages CNAME Record

**Add/Update the CNAME record:**

- **Type**: CNAME
- **Name/HOST**: `www`
- **Value/DATA**: `myrefugeweb.github.io`
- **TTL**: 4 hrs (or 3600 seconds)
- **PRIORITY**: N/A (leave blank)

### Root Domain (@) Records

For the root domain (`@`), you have two options:

**Option A: Keep existing A records** (if you want the root domain to still work)
- Keep the existing A records pointing to Webflow IPs (or update them if needed)
- Note: Root domain won't point to GitHub Pages, only `www` will

**Option B: Remove root domain A records** (if you only need www)
- Delete the A records for `@` if you don't need the root domain

**For GitHub Pages, you only need the `www` CNAME record.**

## Step 2: Enable Custom Domain in GitHub

1. Go to your repository: https://github.com/myrefugeweb/website
2. Navigate to **Settings** → **Pages**
3. Under **Custom domain**, enter: `www.my-refuge.org`
4. Check **"Enforce HTTPS"** (this will be available after DNS propagates)
5. Click **Save**

## Step 3: Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate. You can check propagation status using:

- https://www.whatsmydns.net/#CNAME/www.my-refuge.org
- https://dnschecker.org/#CNAME/www.my-refuge.org

## Step 4: Verify SSL Certificate

After DNS propagates:

1. GitHub will automatically provision an SSL certificate (can take up to 24 hours)
2. Once the certificate is ready, you can enable **"Enforce HTTPS"** in the Pages settings
3. Your site will be accessible at: `https://www.my-refuge.org`

## Troubleshooting

### Squarespace DNS Warning?

If Squarespace shows a warning about DNS records:
- **This is normal** - Squarespace doesn't recognize GitHub Pages DNS configuration
- **Ignore the warning** - your DNS is correct for GitHub Pages
- See `docs/SQUARESPACE_DNS_WARNING.md` for full explanation

### Domain not resolving?

1. **Check DNS records**: Verify the CNAME or A records are correct
2. **Wait longer**: DNS propagation can take up to 48 hours
3. **Check GitHub Pages settings**: Make sure the custom domain is saved in repository settings

### SSL certificate not issued?

1. **Wait 24 hours**: GitHub needs time to provision the certificate
2. **Verify DNS**: Make sure DNS is fully propagated
3. **Check domain in GitHub**: Go to Settings → Pages and verify the domain is listed

### Site shows GitHub 404?

1. **Check the workflow**: Go to Actions tab and verify the deployment succeeded
2. **Verify base path**: The Vite config should have `base: '/'` for custom domains
3. **Check CNAME file**: Should be in `public/CNAME` with `www.my-refuge.org`

## Current Configuration

- **Repository**: myrefugeweb/website
- **Custom Domain**: www.my-refuge.org
- **Base Path**: `/` (root)
- **CNAME File**: `public/CNAME` → deployed to root of site

## Testing

After setup, test your site:
- `https://www.my-refuge.org` - Should load your site
- `https://myrefugeweb.github.io/website/` - Will still work but redirects to custom domain

## Notes

- The CNAME file is automatically included in the build from `public/CNAME`
- GitHub Pages will automatically redirect `myrefugeweb.github.io/website` to your custom domain
- Always use HTTPS in production (enforce HTTPS in GitHub Pages settings)

