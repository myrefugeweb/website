# Quick script to update your .env file with the anon key
# Usage: .\update-env-key.ps1

Write-Host "`n🔑 Supabase Anon Key Updater" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create it first or run setup-env.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📋 Instructions:" -ForegroundColor Yellow
Write-Host "1. Go to: https://supabase.com/dashboard/project/ltjxhzfacfqfxkwzeinc/settings/api" -ForegroundColor White
Write-Host "2. Find the 'anon public' key (NOT service_role)" -ForegroundColor White
Write-Host "3. Copy the entire key" -ForegroundColor White
Write-Host ""

$anonKey = Read-Host "Paste your anon public key here"

if ([string]::IsNullOrWhiteSpace($anonKey)) {
    Write-Host "❌ No key provided. Exiting." -ForegroundColor Red
    exit 1
}

# Check if it looks like a secret key
if ($anonKey -match 'sb_secret_' -or $anonKey -match 'service_role') {
    Write-Host "⚠️  WARNING: This looks like a secret key!" -ForegroundColor Yellow
    Write-Host "You should use the 'anon public' key, not the 'service_role' key." -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Read current .env file
$envContent = Get-Content .env -Raw

# Replace the placeholder or existing key
if ($envContent -match 'VITE_SUPABASE_ANON_KEY=.*') {
    $envContent = $envContent -replace 'VITE_SUPABASE_ANON_KEY=.*', "VITE_SUPABASE_ANON_KEY=$anonKey"
} else {
    # Add it if it doesn't exist
    $envContent += "`nVITE_SUPABASE_ANON_KEY=$anonKey"
}

# Write back to file
try {
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host "`n✅ .env file updated successfully!" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Restart your dev server for changes to take effect!" -ForegroundColor Yellow
    Write-Host "   Run: npm run dev" -ForegroundColor Cyan
} catch {
    Write-Host "`n❌ Error updating .env file: $_" -ForegroundColor Red
    exit 1
}

