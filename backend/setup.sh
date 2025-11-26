#!/bin/bash
# Supabase Setup Script for Mac/Linux
# This script helps set up Supabase CLI and apply migrations

echo "🚀 My Refuge - Supabase Setup"
echo "=============================="

# Check if Supabase CLI is installed
echo ""
echo "📦 Checking Supabase CLI installation..."
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "Installing Supabase CLI..."
    npm install -g supabase
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Supabase CLI"
        echo "Please install manually: npm install -g supabase"
        exit 1
    fi
    echo "✅ Supabase CLI installed!"
else
    echo "✅ Supabase CLI is installed"
fi

# Check if logged in
echo ""
echo "🔐 Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase"
    echo "Please run: supabase login"
    echo "This will open your browser to authenticate."
    read -p "Continue with login? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        supabase login
    else
        echo "Setup cancelled. Please login manually and run this script again."
        exit 0
    fi
else
    echo "✅ Logged in to Supabase"
fi

# Link to project
echo ""
echo "🔗 Linking to Supabase project..."
echo "Project ID: ltjxhzfacfqfxkwzeinc"

if [ ! -f ".supabase/config.toml" ]; then
    echo "Linking project..."
    supabase link --project-ref ltjxhzfacfqfxkwzeinc
    if [ $? -ne 0 ]; then
        echo "❌ Failed to link project"
        echo "Please check your project ID and database password."
        exit 1
    fi
    echo "✅ Project linked!"
else
    echo "✅ Project already linked"
fi

# Apply migrations
echo ""
echo "📊 Applying database migrations..."
supabase db push
if [ $? -ne 0 ]; then
    echo "❌ Failed to apply migrations"
    echo "Please check the error messages above."
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create storage bucket 'images' in Supabase Dashboard"
echo "2. Assign roles to users via admin dashboard"
echo "3. Start using the admin dashboard!"

