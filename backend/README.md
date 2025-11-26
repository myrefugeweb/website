# Backend Setup - My Refuge

This folder contains the database schema, migrations, and Supabase configuration for the My Refuge project.

## Project Information

- **Project ID**: `ltjxhzfacfqfxkwzeinc`
- **Project URL**: `https://ltjxhzfacfqfxkwzeinc.supabase.co`

## Folder Structure

```
backend/
├── supabase/
│   ├── config.toml          # Supabase CLI configuration
│   └── migrations/          # Database migration files
│       ├── 20240101000000_initial_schema.sql
│       ├── 20240101000001_rls_policies.sql
│       └── 20240101000002_helper_functions.sql
└── README.md
```

## Setup Instructions

### Prerequisites

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

### Link to Your Project

Link the CLI to your Supabase project:

```bash
cd backend
supabase link --project-ref ltjxhzfacfqfxkwzeinc
```

You'll be prompted for your database password.

### Apply Migrations

Push all migrations to your Supabase project:

```bash
supabase db push
```

Or apply migrations individually:

```bash
supabase migration up
```

### Verify Setup

1. Check that all tables were created:
   ```bash
   supabase db diff
   ```

2. View your database in Supabase Studio:
   ```bash
   supabase studio
   ```

## Database Schema

### Core Tables

- **roles** - User roles and permissions
- **user_roles** - Junction table linking users to roles
- **images** - Dynamic image management
- **header_content** - Page header content
- **sparrows_closet_content** - Sparrows Closet page content
- **calendar_events** - Event calendar

### Analytics Tables

- **page_views** - Track page visits
- **unique_visitors** - Track unique visitors
- **analytics_events** - Track user interactions (clicks, form submissions, etc.)

### Views

- **daily_page_views** - Daily page view summaries
- **analytics_summary** - Overall analytics summary
- **top_pages** - Most viewed pages
- **event_analytics** - Event tracking analytics

## Storage Buckets

Make sure to create the following storage bucket:

1. **images** - Public bucket for uploaded images

```bash
# Create via Supabase Dashboard:
# Storage → New bucket → Name: "images" → Public: ON
```

## Default Roles

The migration creates these default roles:

- **super_admin** - Full access to all features
- **admin** - Can manage content, images, and events
- **editor** - Can edit content only
- **viewer** - Read-only access

## Security

All tables have Row Level Security (RLS) enabled with appropriate policies:

- **Public tables** (images, events, content): Anyone can read, authenticated users can write
- **Analytics tables**: Anyone can insert (for tracking), authenticated users can read
- **Role tables**: Authenticated users can read, admins can manage

## Next Steps

1. Create storage bucket for images
2. Assign roles to users via the admin dashboard
3. Start tracking analytics events from the frontend
4. Set up automated backups (via Supabase dashboard)

## Troubleshooting

### Migration fails

If a migration fails, check:
1. You're logged in: `supabase login`
2. Project is linked: `supabase projects list`
3. Database password is correct

### RLS policies blocking access

Check that:
1. User is authenticated
2. User has appropriate role assigned
3. Policies are correctly applied

## Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

