# Supabase CLI Setup Guide

This guide will help you set up and use the Supabase CLI to manage your database.

## Installation

### Windows (PowerShell)
```powershell
# Using npm
npm install -g supabase

# Or using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Mac/Linux
```bash
# Using npm
npm install -g supabase

# Or using Homebrew (Mac)
brew install supabase/tap/supabase
```

## Initial Setup

### 1. Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate. After logging in, you'll be able to use the CLI.

### 2. Link to Your Project

Navigate to the backend folder and link to your project:

```bash
cd backend
supabase link --project-ref ltjxhzfacfqfxkwzeinc
```

You'll be prompted for:
- Database password (the one you set when creating the project)
- API URL (should auto-detect)
- Anon key (should auto-detect)

### 3. Verify Connection

Check that you're connected:

```bash
supabase projects list
```

You should see your project listed.

## Database Management

### Apply Migrations

Push all migrations to your remote database:

```bash
supabase db push
```

This will apply all migration files in `backend/supabase/migrations/` in order.

### Create New Migration

Create a new migration file:

```bash
supabase migration new migration_name
```

This creates a new file like `20240101120000_migration_name.sql` in the migrations folder.

### View Migration Status

Check which migrations have been applied:

```bash
supabase migration list
```

### Reset Database (⚠️ DANGEROUS)

Reset your database and reapply all migrations:

```bash
supabase db reset
```

**Warning**: This will delete all data!

### Generate TypeScript Types

Generate TypeScript types from your database schema:

```bash
supabase gen types typescript --project-id ltjxhzfacfqfxkwzeinc > src/types/database.types.ts
```

## Local Development

### Start Local Supabase

Run Supabase locally for development:

```bash
supabase start
```

This starts:
- PostgreSQL database (port 54322)
- Supabase Studio (port 54323)
- API server (port 54321)
- Storage (port 54324)

### Stop Local Supabase

```bash
supabase stop
```

### View Local Database

Open Supabase Studio:

```bash
supabase studio
```

Or visit: http://localhost:54323

## Common Commands

### Database Diff

Compare local and remote schemas:

```bash
supabase db diff
```

### Pull Remote Schema

Pull the remote database schema to local:

```bash
supabase db pull
```

### Push Local Schema

Push local migrations to remote:

```bash
supabase db push
```

### Execute SQL

Run SQL directly:

```bash
supabase db execute "SELECT * FROM images LIMIT 10;"
```

## Troubleshooting

### "Project not found" error

Make sure you're logged in:
```bash
supabase login
```

And that the project is linked:
```bash
supabase link --project-ref ltjxhzfacfqfxkwzeinc
```

### Migration conflicts

If migrations conflict, you may need to:
1. Check migration order
2. Resolve conflicts manually
3. Use `supabase db reset` (⚠️ deletes data)

### Connection issues

Verify your project ID and credentials:
```bash
supabase projects list
supabase link --project-ref ltjxhzfacfqfxkwzeinc
```

## Next Steps

1. Apply migrations: `supabase db push`
2. Create storage bucket: Use Supabase Dashboard → Storage
3. Set up RLS policies: Already included in migrations
4. Generate types: `supabase gen types typescript`

## Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Type Generation](https://supabase.com/docs/guides/cli/generating-types)

