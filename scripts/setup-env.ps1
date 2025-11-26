# PowerShell script to set up .env file for My Refuge
# Run this script: .\setup-env.ps1

Write-Host "Setting up .env file for My Refuge..." -ForegroundColor Cyan

# Check if .env already exists
if (Test-Path .env) {
    $overwrite = Read-Host ".env file already exists. Overwrite? (y/n)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit
    }
}

# Get Supabase Project URL
Write-Host "`nPlease enter your Supabase Project URL:" -ForegroundColor Yellow
Write-Host "  (Find this in: Supabase Dashboard → Settings → API → Project URL)" -ForegroundColor Gray
Write-Host "  Example: https://abcdefghijklmnop.supabase.co" -ForegroundColor Gray
$supabaseUrl = Read-Host "Supabase URL"

# Get Supabase Anon Key
Write-Host "`nPlease enter your Supabase Publishable/Anon Key:" -ForegroundColor Yellow
Write-Host "  (Find this in: Supabase Dashboard → Settings → API → Project API keys → anon public)" -ForegroundColor Gray
Write-Host "  This is the key that starts with 'sb_' or 'eyJ'" -ForegroundColor Gray
$supabaseKey = Read-Host "Supabase Anon Key"

# Validate inputs
if ([string]::IsNullOrWhiteSpace($supabaseUrl)) {
    Write-Host "Error: Supabase URL cannot be empty!" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrWhiteSpace($supabaseKey)) {
    Write-Host "Error: Supabase Anon Key cannot be empty!" -ForegroundColor Red
    exit 1
}

# Create .env file content
$envContent = @"
# Supabase Configuration
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Your Supabase Project URL
VITE_SUPABASE_URL=$supabaseUrl

# Your Supabase Publishable/Anon Key (for client-side use)
VITE_SUPABASE_ANON_KEY=$supabaseKey
"@

# Write to .env file
try {
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host "`n✅ .env file created successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart your dev server (npm run dev)" -ForegroundColor White
    Write-Host "  2. Try logging in to the admin dashboard" -ForegroundColor White
    Write-Host "`n⚠️  Remember: Never commit the .env file to git!" -ForegroundColor Yellow
} catch {
    Write-Host "`n❌ Error creating .env file: $_" -ForegroundColor Red
    exit 1
}

