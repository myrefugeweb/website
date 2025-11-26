# Quick Steps to Get Your Anon/Public Key

## ⚠️ Your .env file needs the anon/public key!

Your `.env` file currently has: `REPLACE_WITH_YOUR_ANON_PUBLIC_KEY_HERE`

You need to replace this with your actual **anon/public** key from Supabase.

## Step-by-Step Instructions

### 1. Go to Your Supabase Dashboard
- Visit: https://supabase.com/dashboard/project/ltjxhzfacfqfxkwzeinc
- Or go to: https://supabase.com → Login → Select your project

### 2. Navigate to API Settings
- Click **Settings** (gear icon) in the left sidebar
- Click **API** in the settings menu

### 3. Find the Anon/Public Key
Look for the **"Project API keys"** section. You'll see:

```
Project API keys
├── anon public          ← COPY THIS ONE!
│   └── [long key string]
│
└── service_role         ← DO NOT USE THIS!
    └── [long key string]
```

### 4. Copy the Anon Public Key
- Click the **copy icon** (📋) next to the **anon public** key
- The key might look like:
  - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT format)
  - Or another format depending on your Supabase version

### 5. Update Your .env File
1. Open the `.env` file in your project root
2. Find this line:
   ```
   VITE_SUPABASE_ANON_KEY=REPLACE_WITH_YOUR_ANON_PUBLIC_KEY_HERE
   ```
3. Replace `REPLACE_WITH_YOUR_ANON_PUBLIC_KEY_HERE` with the key you copied
4. Save the file

### 6. Restart Your Dev Server
```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## ⚠️ Important Notes

- ✅ Use the **anon public** key (safe for frontend)
- ❌ Do NOT use the **service_role** key (secret, forbidden in browser)
- The key you provided earlier (`sb_secret_...`) is a secret key - you need the anon/public one instead

## Still Having Issues?

If you can't find the anon public key:
1. Make sure you're in the **Settings → API** section
2. Look for keys labeled as "public", "anon", or "publishable"
3. The anon key is the one that's safe to expose in client-side code

