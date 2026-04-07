# SnapSpec.io - One-click Start Script
# Usage: .\start.ps1

Write-Host "🚀 Starting SnapSpec.io..." -ForegroundColor Cyan

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start dev server in background
Write-Host "🌐 Starting development server..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "node_modules/next/dist/bin/next", "dev" -NoNewWindow

# Wait for server to start
Start-Sleep -Seconds 5

# Open browser
Write-Host "🌍 Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3000/dashboard"

Write-Host "✅ SnapSpec.io is running!" -ForegroundColor Green
Write-Host "   Dashboard: http://localhost:3000/dashboard" -ForegroundColor White
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray
