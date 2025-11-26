# How to Find Your Supabase Anon/Public Key

## ⚠️ Important: You're Using the Wrong Key!

The error "Forbidden use of secret API key in browser" means you're using a **secret/service_role key** instead of the **anon/public key**.

## 🔑 How to Find the Correct Key

### Step 1: Go to Your Supabase Dashboard
1. Visit [https://supabase.com](https://supabase.com) and log in
2. Select your project: **ltjxhzfacfqfxkwzeinc**

### Step 2: Navigate to API Settings
1. Click **Settings** (gear icon in the left sidebar)
2. Click **API** in the settings menu

### Step 3: Find the Anon/Public Key
In the **Project API keys** section, you'll see two keys:

#### ✅ **anon public** (USE THIS ONE!)
- This is the **publishable** key
- Safe to use in frontend/browser code
- Usually starts with `eyJ` (JWT format) or may be in a different format
- Labeled as **"anon public"** or **"public"**

#### ❌ **service_role** (DO NOT USE THIS!)
- This is the **secret** key
- **FORBIDDEN** in browser code
- Usually starts with `sb_secret_` or `eyJ` (but labeled as service_role)
- Only for backend/server use

### Step 4: Copy the Correct Key
1. Find the **anon public** key
2. Click the copy icon next to it
3. Update your `.env` file with this key

### Step 5: Update Your .env File
Open your `.env` file and replace the key:

```env
VITE_SUPABASE_URL=https://ltjxhzfacfqfxkwzeinc.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
```

Replace `your_anon_public_key_here` with the **anon public** key you just copied.

### Step 6: Restart Your Dev Server
```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

## 🔍 Visual Guide

In your Supabase Dashboard → Settings → API, you should see:

```
Project API keys
├── anon public          ← USE THIS ONE (for frontend)
│   └── eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│
└── service_role         ← DO NOT USE (for backend only)
    └── eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ❓ Still Can't Find It?

If you're using the new Supabase dashboard:
1. Look for **"Project API keys"** section
2. The **anon public** key might be labeled as:
   - "anon public"
   - "public"
   - "publishable"
   - "client key"

The key you need is the one that's **safe for client-side use** and is **not** the service_role key.

## 🚨 Security Note

- ✅ **anon public** key = Safe for frontend, can be exposed in client code
- ❌ **service_role** key = Secret, must NEVER be in frontend code, only backend

