#!/bin/bash
# Bash script to set up .env file for My Refuge
# Run this script: chmod +x setup-env.sh && ./setup-env.sh

echo "Setting up .env file for My Refuge..."

# Check if .env already exists
if [ -f .env ]; then
    read -p ".env file already exists. Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit
    fi
fi

# Get Supabase Project URL
echo ""
echo "Please enter your Supabase Project URL:"
echo "  (Find this in: Supabase Dashboard → Settings → API → Project URL)"
echo "  Example: https://abcdefghijklmnop.supabase.co"
read -p "Supabase URL: " supabase_url

# Get Supabase Anon Key
echo ""
echo "Please enter your Supabase Publishable/Anon Key:"
echo "  (Find this in: Supabase Dashboard → Settings → API → Project API keys → anon public)"
echo "  This is the key that starts with 'sb_' or 'eyJ'"
read -p "Supabase Anon Key: " supabase_key

# Validate inputs
if [ -z "$supabase_url" ]; then
    echo "Error: Supabase URL cannot be empty!"
    exit 1
fi

if [ -z "$supabase_key" ]; then
    echo "Error: Supabase Anon Key cannot be empty!"
    exit 1
fi

# Create .env file
cat > .env << EOF
# Supabase Configuration
# Generated on $(date)

# Your Supabase Project URL
VITE_SUPABASE_URL=$supabase_url

# Your Supabase Publishable/Anon Key (for client-side use)
VITE_SUPABASE_ANON_KEY=$supabase_key
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "Next steps:"
echo "  1. Restart your dev server (npm run dev)"
echo "  2. Try logging in to the admin dashboard"
echo ""
echo "⚠️  Remember: Never commit the .env file to git!"

