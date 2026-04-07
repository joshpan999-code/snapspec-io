# SnapSpec.io - Local Build Test Script
# Usage: .\deploy-local.ps1

Write-Host "🔨 Building SnapSpec.io for production..." -ForegroundColor Cyan

# Run build
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Build Summary:" -ForegroundColor White
    Write-Host "   - Ready for Vercel deployment" -ForegroundColor Gray
    Write-Host "   - Run 'vercel --prod' to deploy to production" -ForegroundColor Gray
    Write-Host ""
    
    # Check if .next folder exists
    if (Test-Path ".next") {
        $size = (Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   - Build size: $([math]::Round($size, 2)) MB" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "   Check errors above and fix before deploying" -ForegroundColor Gray
    exit 1
}
