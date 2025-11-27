# My Refuge - Admin Account Confirmation Email

This document contains the branded email template for admin account creation confirmations.

## Overview

When an admin creates a new user account, Supabase sends a confirmation email. This template includes:
- My Refuge branding
- Welcome message
- Temporary password
- Confirmation link
- Professional styling

## Template Variables

The following variables are available in the Supabase email template:

- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - Link to confirm the account
- `{{ .SiteURL }}` - Your site URL (https://www.my-refuge.org)
- `{{ .Data.password }}` - Generated temporary password
- `{{ .Data.must_change_password }}` - Flag indicating password change required
- `{{ .RedirectTo }}` - Redirect URL after confirmation

## Brand Colors

- **Primary Orange**: `#FF8C00`
- **Secondary Blue**: `#007DFF`
- **Text Dark**: `#1a1a1a`
- **Text Gray**: `#666666`
- **Background**: `#FFFFFF`

## How to Use

1. **Copy the Email Template**:
   - Open `email-template.html`
   - Copy the entire HTML content

2. **Paste into Supabase**:
   - Go to Supabase Dashboard → Authentication → Email Templates
   - Select "Confirm signup" template
   - Paste the HTML into the template body
   - Save the template

The logo is already configured to use the public Supabase Storage URL, so no additional setup is needed!

## Notes

- All styles are inline for email client compatibility
- The template uses table-based layout for better email client support
- Password is displayed prominently but users are reminded to change it

