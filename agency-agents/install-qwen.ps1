# Install Agency agents for Qwen Code (project-scoped)
# Usage: .\install-qwen.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SrcDir = Join-Path $RepoRoot "integrations\qwen\agents"
$DestDir = Join-Path $RepoRoot ".qwen\agents"

if (-not (Test-Path $SrcDir)) {
    Write-Host "[ERR] integrations/qwen/agents not found. Run .\convert-qwen.ps1 first." -ForegroundColor Red
    exit 1
}

Write-Host "`n[The Agency] Installing agents for Qwen Code..." -ForegroundColor Cyan
Write-Host "  Source: $SrcDir" -ForegroundColor Gray
Write-Host "  Dest:   $DestDir" -ForegroundColor Gray
Write-Host ""

New-Item -ItemType Directory -Force -Path $DestDir | Out-Null

$count = 0
$files = Get-ChildItem -Path $SrcDir -Filter "*.md" -File
foreach ($file in $files) {
    Copy-Item $file.FullName -Destination $DestDir -Force
    $count++
}

Write-Host "[OK] Qwen Code: installed $count agents to $DestDir" -ForegroundColor Green
Write-Host "`nTip: Run '/agents manage' in Qwen Code to refresh, or restart session." -ForegroundColor Yellow
