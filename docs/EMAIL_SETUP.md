# Email Setup for User Invitations

When admins create new users, the system generates a password that needs to be sent to the user. There are two ways to handle this:

## Option 1: Manual Email (Current Implementation)

The system provides a `mailto:` link that opens your email client with a pre-filled message containing:
- User's email address
- Generated password
- Login instructions
- Password change requirement notice

**How it works:**
1. Admin creates user
2. Password is generated and copied to clipboard
3. Admin is prompted to open email client
4. Email is pre-filled with all necessary information
5. Admin sends the email

## Option 2: Automatic Email via Supabase Edge Function (Recommended for Production)

For automatic email sending, you can create a Supabase Edge Function that sends a custom email with the password.

### Step 1: Create Edge Function

1. Go to your Supabase Dashboard → Edge Functions
2. Create a new function called `send-user-invite`
3. Use the code below:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, password, role } = await req.json()

    // Send email using Resend (or your preferred email service)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@myrefuge.org', // Your verified domain
        to: email,
        subject: 'Your My Refuge Admin Account',
        html: `
          <h2>Welcome to My Refuge Admin</h2>
          <p>Your admin account has been created.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>IMPORTANT:</strong> You will be required to change this password on your first login.</p>
          <p><a href="${Deno.env.get('SITE_URL')}/admin">Login Here</a></p>
        `,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### Step 2: Set Up Resend (or Another Email Service)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add it to Supabase Edge Function secrets:
   - Supabase Dashboard → Edge Functions → Settings → Secrets
   - Add: `RESEND_API_KEY`

### Step 3: Update Frontend Code

Update the user creation code to call the Edge Function:

```typescript
// After creating user successfully
const { data: emailData, error: emailError } = await supabase.functions.invoke('send-user-invite', {
  body: { email: userFormData.email, password: password, role: userFormData.role }
})

if (emailError) {
  console.error('Error sending email:', emailError)
  // Fall back to mailto link
}
```

## Option 3: Customize Supabase Email Template

You can customize Supabase's email templates, but they cannot include the generated password since it's created client-side.

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize the "Confirm signup" template
3. Add instructions about password being sent separately

**Note:** The password cannot be included in Supabase's default email templates because it's generated in the browser and not available to Supabase's email service.

## Recommendation

For now, use **Option 1** (mailto link) as it works immediately without additional setup. For production, implement **Option 2** (Edge Function) for a more professional experience.

