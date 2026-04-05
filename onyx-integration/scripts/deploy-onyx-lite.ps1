# Onyx Lite Deployment Script for Windows
# Usage: .\deploy-onyx-lite.ps1

$ErrorActionPreference = "Stop"

$OnyxRoot = "E:\Sampada-Store\onyx"
$DeployDir = Join-Path $OnyxRoot "deployment\docker_compose"

Write-Host "`n[Onyx] Deploying Onyx Lite for Sampada Store..." -ForegroundColor Cyan
Write-Host "  Location: $DeployDir" -ForegroundColor Gray
Write-Host ""

# Check Docker
Write-Host "[1/4] Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "  $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERR] Docker not found. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check Docker daemon
Write-Host "`n[2/4] Checking Docker daemon..." -ForegroundColor Yellow
try {
    $containers = docker ps 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERR] Docker daemon not running or Linux engine not started." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please:" -ForegroundColor Yellow
        Write-Host "  1. Start Docker Desktop from system tray" -ForegroundColor Yellow
        Write-Host "  2. Right-click Docker icon in tray" -ForegroundColor Yellow
        Write-Host "  3. Select 'Switch to Linux containers' (if available)" -ForegroundColor Yellow
        Write-Host "  4. Wait for Docker to start, then re-run this script" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
    Write-Host "  Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "[ERR] Cannot connect to Docker daemon." -ForegroundColor Red
    exit 1
}

# Check .env file
Write-Host "`n[3/4] Checking configuration..." -ForegroundColor Yellow
$envFile = Join-Path $DeployDir ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "  Creating .env from template..." -ForegroundColor Yellow
    Copy-Item (Join-Path $DeployDir "env.template") $envFile
    
    # Generate auth secret
    $secret = [BitConverter]::ToString((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 })).Replace('-','').ToLower()
    $content = Get-Content $envFile -Raw
    $content = $content -replace 'USER_AUTH_SECRET=""', "USER_AUTH_SECRET=`"$secret`""
    [System.IO.File]::WriteAllText($envFile, $content)
    Write-Host "  .env created with auth secret" -ForegroundColor Green
} else {
    Write-Host "  .env file exists" -ForegroundColor Green
}

# Deploy Onyx Lite
Write-Host "`n[4/4] Deploying Onyx Lite..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes to pull images..." -ForegroundColor Gray
Write-Host ""

Set-Location $DeployDir

docker compose -f docker-compose.yml -f docker-compose.onyx-lite.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] Onyx Lite deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access Onyx at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Default login: a@example.com / a" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Open http://localhost:3000 in browser" -ForegroundColor Gray
    Write-Host "  2. Run .\setup-personas.ps1 to create AI agents" -ForegroundColor Gray
    Write-Host "  3. Add chat widget to Sampada storefront" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To stop: docker compose -f docker-compose.yml -f docker-compose.onyx-lite.yml down" -ForegroundColor Gray
} else {
    Write-Host "`n[ERR] Deployment failed. Check Docker logs for details." -ForegroundColor Red
    exit 1
}
