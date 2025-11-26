# Setup Instructions for My Refuge Website

## Step 1: Get Your Supabase Anon Key

1. Go to your Supabase project: https://ltjxhzfacfqfxkwzeinc.supabase.co
2. Navigate to **Settings** → **API**
3. Copy the **anon public** key (this is your publishable key for client-side use)
4. You'll need this for the `.env` file

## Step 2: Create Environment File

The `.env` file has been created automatically with your project URL. 

If you need to update it, create a `.env` file in the root of your project with:

```env
VITE_SUPABASE_URL=https://ltjxhzfacfqfxkwzeinc.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_anon_key_here` with the anon key you copied from Step 1.

**Note:** The `.env` file is already created with your project URL. You just need to verify the `VITE_SUPABASE_ANON_KEY` is correct.

## Step 3: Set Up Database

### Option A: Using Supabase CLI (Recommended)

1. If you haven't already, install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref ltjxhzfacfqfxkwzeinc
   ```

4. Run the schema:
   ```bash
   supabase db push
   ```
   Or manually copy and paste the contents of `supabase/schema.sql` into the SQL Editor in your Supabase dashboard.

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/schema.sql`
5. Click **Run** to execute the SQL

## Step 4: Set Up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `images`
4. Make it **Public** (toggle the public setting)
5. Click **Create bucket**

## Step 5: Create Your First Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: your admin email
   - Password: a strong password
4. Click **Create user**
5. Save these credentials - you'll use them to log into the admin dashboard

## Step 6: Install Dependencies and Run

```bash
npm install
npm run dev
```

The site should now be running! Visit `http://localhost:5173` to see your site.

## Step 7: Access Admin Dashboard

1. Go to the footer of your website
2. Click the "login" link (it's small and subtle)
3. Or navigate directly to `/admin`
4. Log in with the credentials you created in Step 5

## Features Available in Admin Dashboard

- **📷 Manage Images**: Upload images for different sections (hero, mission, help, contact, etc.)
- **✏️ Edit Home Page**: Update the main title and description
- **👕 Sparrows Closet**: Edit Sparrows Closet page content
- **📅 Calendar Events**: Add and manage events that appear on the site
- **👥 Manage Users**: View user accounts (coming soon)
- **🔐 Roles & Permissions**: View roles and their permissions

## Important Notes

- The admin dashboard is designed to be very user-friendly for non-technical users
- All images are stored in Supabase Storage
- Content is stored in Supabase Database
- The site uses Row Level Security (RLS) for data protection
- Only authenticated users can modify content

## Troubleshooting

### Can't log in?
- Make sure you created a user in Supabase Authentication
- Check that your `.env` file has the correct anon key
- Check browser console for errors

### Images not uploading?
- Make sure the `images` storage bucket exists and is public
- Check that RLS policies are set up correctly
- Verify your user has authentication

### Database errors?
- Make sure you ran the schema.sql file
- Check that all tables were created successfully
- Verify RLS policies are enabled

## Next Steps

1. Upload images for each section through the admin dashboard
2. Customize the header content
3. Add calendar events
4. Test the donation buttons (they link to your GiveForms page)
5. Deploy to GitHub Pages or your preferred hosting

