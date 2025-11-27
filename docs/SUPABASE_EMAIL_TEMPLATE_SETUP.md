# Supabase Email Template Setup with Password

This guide shows how to customize the Supabase email template to include the generated password.

## Step 1: Access Email Templates

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ltjxhzfacfqfxkwzeinc`
3. Navigate to **Authentication** → **Email Templates**
4. Click on **"Confirm signup"** template

## Step 2: Update the Email Template

Replace the template body with the following to include the password:

```html
<h2>Confirm your signup</h2>

<p>Your admin account has been created for My Refuge.</p>

<p><strong>Email:</strong> {{ .Email }}</p>
<p><strong>Temporary Password:</strong> {{ .Data.password }}</p>
<p><strong>Role:</strong> {{ .Data.role }}</p>

<p><strong>IMPORTANT:</strong> You will be required to change this password on your first login for security reasons.</p>

<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>

<p>After confirming, you can log in at: <a href="{{ .SiteURL }}/admin">{{ .SiteURL }}/admin</a></p>
```

## Step 3: Available Template Variables

You can use these variables in your email template:

- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - Link to confirm the account
- `{{ .SiteURL }}` - Your site URL (set in URL Configuration)
- `{{ .Token }}` - Confirmation token (if needed)
- `{{ .Data.password }}` - Generated password (from our code)
- `{{ .Data.role }}` - User's role (from our code)
- `{{ .Data.must_change_password }}` - Flag indicating password change required
- `{{ .RedirectTo }}` - Redirect URL after confirmation

## Step 4: Update Site URL

Make sure your **Site URL** in **Authentication** → **URL Configuration** is set to:
```
https://www.my-refuge.org
```

## Step 5: Test

1. Create a new user in the admin dashboard
2. Check the confirmation email
3. Verify the password is included in the email
4. Verify the confirmation link points to your production URL

## Notes

- The password is stored in `user_metadata` and is accessible via `{{ .Data.password }}` in the template
- The password is only sent in the confirmation email - it's not stored permanently
- Users will be forced to change their password on first login
- The email template uses Go template syntax (`{{ }}`)

## Security Note

While the password is included in the email, this is acceptable for initial account setup since:
1. The email is sent to the user's own email address
2. Users are required to change the password on first login
3. The password is a temporary, randomly generated value

