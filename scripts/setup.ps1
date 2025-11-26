# Supabase Setup Script for Windows
# This script helps set up Supabase CLI and apply migrations

Write-Host "🚀 My Refuge - Supabase Setup" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if Supabase CLI is installed
Write-Host "`n📦 Checking Supabase CLI installation..." -ForegroundColor Yellow
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "`nInstalling Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Supabase CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g supabase" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Supabase CLI installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Supabase CLI is installed" -ForegroundColor Green
}

# Check if logged in
Write-Host "`n🔐 Checking Supabase login status..." -ForegroundColor Yellow
$loginStatus = supabase projects list 2>&1
if ($LASTEXITCODE -ne 0 -or $loginStatus -match "not logged in" -or $loginStatus -match "error") {
    Write-Host "⚠️  Not logged in to Supabase" -ForegroundColor Yellow
    Write-Host "Please run: supabase login" -ForegroundColor Cyan
    Write-Host "This will open your browser to authenticate." -ForegroundColor Gray
    $continue = Read-Host "`nContinue with login? (y/n)"
    if ($continue -eq 'y' -or $continue -eq 'Y') {
        supabase login
    } else {
        Write-Host "Setup cancelled. Please login manually and run this script again." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "✅ Logged in to Supabase" -ForegroundColor Green
}

# Link to project
Write-Host "`n🔗 Linking to Supabase project..." -ForegroundColor Yellow
Write-Host "Project ID: ltjxhzfacfqfxkwzeinc" -ForegroundColor Gray

$linked = Test-Path ".supabase\config.toml"
if (-not $linked) {
    Write-Host "Linking project..." -ForegroundColor Cyan
    supabase link --project-ref ltjxhzfacfqfxkwzeinc
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to link project" -ForegroundColor Red
        Write-Host "Please check your project ID and database password." -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Project linked!" -ForegroundColor Green
} else {
    Write-Host "✅ Project already linked" -ForegroundColor Green
}

# Apply migrations
Write-Host "`n📊 Applying database migrations..." -ForegroundColor Yellow
supabase db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to apply migrations" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create storage bucket 'images' in Supabase Dashboard" -ForegroundColor White
Write-Host "2. Assign roles to users via admin dashboard" -ForegroundColor White
Write-Host "3. Start using the admin dashboard!" -ForegroundColor White

