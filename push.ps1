# SnapSpec.io - Git Push Script
# Usage: .\push.ps1 [-Message "commit message"]

param(
    [string]$Message = "Update configuration"
)

Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan

# Check for changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Yellow
    exit 0
}

# Add all changes
Write-Host "📝 Staging changes..." -ForegroundColor Gray
git add .

# Commit
Write-Host "💾 Committing: $Message" -ForegroundColor Gray
git commit -m $Message

# Push
Write-Host "🚀 Pushing to origin/main..." -ForegroundColor Gray
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "   Repository: https://github.com/joshpan999-code/snapspec-io" -ForegroundColor White
} else {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    exit 1
}
