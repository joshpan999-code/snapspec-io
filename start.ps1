# SnapSpec.io - One-click Start Script
# Usage: .\start.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SnapSpec.io - VESC Configuration Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/3] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[1/3] Dependencies already installed." -ForegroundColor Green
}

# Kill any existing Next.js process on port 3000
$existingProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($existingProcess) {
    Write-Host "      Stopping existing server on port 3000..." -ForegroundColor Yellow
    Kill-Process -Id $existingProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Start dev server
Write-Host "[2/3] Starting development server..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "node_modules/next/dist/bin/next", "dev" -NoNewWindow

# Wait for server to be ready
Write-Host "      Waiting for server to start..." -ForegroundColor Gray
$maxWait = 30
$waited = 0
while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 1
    $waited++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 1 -ErrorAction SilentlyContinue
        if ($response) { break }
    } catch {}
    Write-Host "." -NoNewline -ForegroundColor Gray
}
Write-Host ""

# Open browser
Write-Host "[3/3] Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000/dashboard"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SnapSpec.io is running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Dashboard:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host "  Home:       " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
