# Convert Agency agents to Qwen Code format
# Usage: .\convert-qwen.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Today = Get-Date -Format "yyyy-MM-dd"
$OutDir = Join-Path $RepoRoot "integrations\qwen\agents"

$AgentDirs = @(
    "academic", "design", "engineering", "game-development", "marketing",
    "paid-media", "sales", "product", "project-management", "testing",
    "support", "spatial-computing", "specialized"
)

function Get-FrontmatterField {
    param([string]$File, [string]$Field)
    $content = Get-Content $File -Raw
    if ($content -match "(?s)^---\n(.*?)\n---") {
        $frontmatter = $Matches[1]
        $pattern = "(?m)^" + [regex]::Escape($Field) + ":\s*(.+)$"
        if ($frontmatter -match $pattern) {
            return $Matches[1].Trim()
        }
    }
    return $null
}

function Get-Body {
    param([string]$File)
    $content = Get-Content $File -Raw
    $parts = $content -split "(?m)^---$"
    if ($parts.Count -ge 3) {
        return ($parts[2..($parts.Count-1)] -join "---").Trim()
    }
    return $content
}

function Slugify {
    param([string]$Name)
    return ($Name.ToLower() -replace '[^a-z0-9]', '-' -replace '-+', '-' -replace '^-', '' -replace '-$', '')
}

function Convert-QwenAgent {
    param([string]$File)
    
    $name = Get-FrontmatterField -File $File -Field "name"
    $description = Get-FrontmatterField -File $File -Field "description"
    $tools = Get-FrontmatterField -File $File -Field "tools"
    $body = Get-Body -File $File
    
    if (-not $name) { return $false }
    
    $slug = Slugify $name
    $outFile = Join-Path $OutDir "$slug.md"
    
    New-Item -ItemType Directory -Force -Path (Split-Path $outFile) | Out-Null
    
    if ($tools) {
        $content = @"
---
name: $slug
description: $description
tools: $tools
---
$body
"@
    } else {
        $content = @"
---
name: $slug
description: $description
---
$body
"@
    }
    
    [System.IO.File]::WriteAllText($outFile, $content, [System.Text.UTF8Encoding]::new($false))
    return $true
}

Write-Host "`n[The Agency] Converting agents to Qwen Code format..." -ForegroundColor Cyan
Write-Host "  Repo:   $RepoRoot" -ForegroundColor Gray
Write-Host "  Output: $OutDir" -ForegroundColor Gray
Write-Host "  Date:   $Today" -ForegroundColor Gray
Write-Host ""

$totalCount = 0

foreach ($dir in $AgentDirs) {
    $dirPath = Join-Path $RepoRoot $dir
    if (-not (Test-Path $dirPath)) { continue }
    
    $files = Get-ChildItem -Path $dirPath -Filter "*.md" -File
    foreach ($file in $files) {
        $firstLine = Get-Content $file.FullName -TotalCount 1
        if ($firstLine -ne "---") { continue }
        
        $converted = Convert-QwenAgent -File $file.FullName
        if ($converted) { $totalCount++ }
    }
}

Write-Host "[OK] Converted $totalCount agents for Qwen Code" -ForegroundColor Green
Write-Host "`nRun .\install-qwen.ps1 to install them to your project." -ForegroundColor Yellow
