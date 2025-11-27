# Supabase Email Redirect Configuration

This guide explains how to configure Supabase email confirmation redirects to use your production domain instead of localhost.

## Problem

When Supabase sends confirmation emails, they may redirect to `http://localhost:5173` instead of your production URL (`https://www.my-refuge.org/admin`).

## Solution

You need to configure the redirect URLs in your Supabase Dashboard.

### Step 1: Update Site URL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ltjxhzfacfqfxkwzeinc`
3. Navigate to **Authentication** → **URL Configuration**
4. Update the **Site URL** field:
   ```
   https://www.my-refuge.org
   ```

### Step 2: Add Redirect URLs

In the same **URL Configuration** section, add your production URLs to the **Redirect URLs** list:

```
https://www.my-refuge.org/admin
https://www.my-refuge.org/admin/dashboard
https://www.my-refuge.org/admin/change-password
```

**Important:** Make sure to include:
- `/admin` - for login redirects
- `/admin/dashboard` - for dashboard access
- `/admin/change-password` - for password change flow

### Step 3: Update Environment Variable (Optional)

You can also set a `VITE_SITE_URL` environment variable in your production environment:

```env
VITE_SITE_URL=https://www.my-refuge.org
```

This will be used by the code to set the correct redirect URL when creating users.

### Step 4: Verify Configuration

After updating the settings:

1. **Wait 1-2 minutes** for changes to propagate
2. Create a test user in the admin dashboard
3. Check the confirmation email - the link should now point to `https://www.my-refuge.org/admin` instead of localhost

## Current Code Implementation

The code now automatically uses:
1. `VITE_SITE_URL` environment variable (if set)
2. `window.location.origin` (current domain) as fallback

This ensures the redirect URL is always correct for the environment you're running in.

## Troubleshooting

### Emails still redirecting to localhost?

1. **Check Supabase Dashboard settings** - Make sure you saved the changes
2. **Wait for propagation** - Changes can take 1-2 minutes
3. **Clear browser cache** - Old redirects may be cached
4. **Check environment variable** - Ensure `VITE_SITE_URL` is set in production

### Testing Locally

For local development, you can keep localhost URLs in the Supabase Dashboard, or add both:
- `http://localhost:5173/admin` (for local dev)
- `https://www.my-refuge.org/admin` (for production)

Both URLs can be in the redirect list simultaneously.

## Additional Notes

- The `config.toml` file in `backend/supabase/` is only for local Supabase CLI development
- Production Supabase settings are configured in the Supabase Dashboard, not in code
- Email templates can be customized in **Authentication** → **Email Templates**

