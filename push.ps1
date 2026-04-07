# SnapSpec.io - Push to GitHub
# Usage: .\push.ps1 [commit-message]

param(
    [string]$Message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub: snapspec-io" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "[1/3] Checking git status..." -ForegroundColor Yellow
$status = git status --porcelain
if (-not $status) {
    Write-Host "      No changes to commit." -ForegroundColor Green
    exit 0
}

# Add all changes
Write-Host "[2/3] Staging changes..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to stage changes!" -ForegroundColor Red
    exit 1
}

# Commit
Write-Host "[3/3] Committing and pushing..." -ForegroundColor Yellow
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to commit!" -ForegroundColor Red
    exit 1
}

# Push
git push origin master
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Repository: " -NoNewline -ForegroundColor White
Write-Host "https://github.com/joshpan999-code/snapspec-io" -ForegroundColor Cyan
Write-Host ""
