# Supabase Setup Guide

This guide will help you set up Supabase for the My Refuge admin dashboard.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `my-refuge` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Open the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here
```

**Important:** 
- Never commit the `.env` file to git! It's already in `.gitignore`.
- The `VITE_SUPABASE_ANON_KEY` should be your **publishable/anon** key (safe for frontend use)
- If you have a service role key, do NOT put it in the frontend `.env` file - it's only for backend use

## Step 4: Create Database Tables

In your Supabase project, go to **SQL Editor** and run the following SQL:

### Images Table
```sql
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Calendar Events Table
```sql
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Header Content Table
```sql
CREATE TABLE header_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default header content
INSERT INTO header_content (title, description) VALUES (
  'A PLACE TO BELONG',
  'My Refuge in Bartlesville, Oklahoma, is an organization empowering at-risk youth through Christian mentoring, providing meals, clothing, and crisis aid to children and families in Washington County.'
);
```

## Step 5: Set Up Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `images`
4. Make it **Public** (so images can be accessed from the frontend)
5. Click **Create bucket**

## Step 6: Set Up Authentication

1. Go to **Authentication** → **Policies**
2. For the `images` table, create a policy that allows:
   - **SELECT**: Public (anyone can view)
   - **INSERT/UPDATE/DELETE**: Only authenticated users (admins)

3. For the `calendar_events` table:
   - **SELECT**: Public
   - **INSERT/UPDATE/DELETE**: Only authenticated users

4. For the `header_content` table:
   - **SELECT**: Public
   - **UPDATE**: Only authenticated users

## Step 7: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter admin email and password
4. Save the credentials securely

## Step 8: Update Admin Login

In `src/pages/AdminLogin/AdminLogin.tsx`, replace the placeholder authentication with:

```typescript
import { supabase } from '../../lib/supabase';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message);
    setLoading(false);
  } else {
    navigate('/admin/dashboard');
  }
};
```

## Next Steps

- Implement image upload functionality in the admin dashboard
- Connect calendar events to display on the home page
- Add real-time updates using Supabase subscriptions (optional)

For more help, check the [Supabase Documentation](https://supabase.com/docs).

