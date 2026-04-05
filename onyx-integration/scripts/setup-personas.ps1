# Setup Onyx Personas for Sampada
# Creates all 4 custom AI agents via Onyx API
# Usage: .\setup-personas.ps1

$ErrorActionPreference = "Stop"

$OnyxUrl = "http://localhost:3000/api"
$PersonasConfig = "E:\Sampada-Store\onyx-integration\config\onyx_personas.py"

Write-Host "`n[Onyx] Setting up Sampada AI Personas..." -ForegroundColor Cyan
Write-Host "  Target: $OnyxUrl" -ForegroundColor Gray
Write-Host ""

# Check if Onyx is running
Write-Host "[1/2] Checking Onyx availability..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$OnyxUrl/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  Onyx is running" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Cannot reach Onyx at $OnyxUrl" -ForegroundColor Yellow
    Write-Host "  Make sure Onyx Lite is deployed first (run deploy-onyx-lite.ps1)" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') { exit 0 }
}

# Parse personas from Python config
Write-Host "`n[2/2] Creating personas..." -ForegroundColor Yellow

# Since we can't easily parse Python from PowerShell, we'll use predefined payloads
$personas = @(
    @{
        name = "Sampada Product Expert"
        description = "AI assistant that helps customers find and compare tech products"
        system_prompt = "You are the Sampada Product Expert, an AI assistant specializing in tech products. Help customers find the perfect products from Sampada Store's catalog including headphones, smartwatches, sunglasses, space suits, and the Aurora Sky Pulse™ product line. Be specific with product names, prices, specs, and comparisons. Always mention stock availability and current deals."
        is_public = $true
        display_priority = 1
    },
    @{
        name = "Sampada Support Team"
        description = "AI support agent for order inquiries, returns, shipping, and technical issues"
        system_prompt = "You are the Sampada Support Team, an AI assistant dedicated to helping customers with their orders and inquiries. Handle order status tracking, shipping questions, returns and refunds, product troubleshooting, and account/payment questions. Be empathetic, specific, and always provide next steps with timelines."
        is_public = $true
        display_priority = 2
    },
    @{
        name = "Sampada Dev Assistant"
        description = "Internal AI assistant for Sampada development team"
        system_prompt = "You are the Sampada Development Assistant, an AI expert on the Sampada-Store codebase. You have access to the GitHub repository, all source code (Next.js, React, Sanity, Stripe integration), architecture documentation, API specs, and deployment configs. Be code-first, show examples, consider impact, follow conventions, suggest tests, and warn about gotchas."
        is_public = $false
        display_priority = 10
    },
    @{
        name = "Sampada Business Analyst"
        description = "AI analyst for business intelligence, revenue tracking, and market insights"
        system_prompt = "You are the Sampada Business Analyst, an AI expert on e-commerce analytics. Analyze revenue trends, product performance, customer behavior, conversion funnels, A/B tests, and market trends. Always cite exact numbers, suggest visualizations, show trends vs previous periods, and end with specific recommendations."
        is_public = $false
        display_priority = 11
    }
)

$created = 0
$failed = 0

foreach ($persona in $personas) {
    Write-Host "`n  Creating: $($persona.name)..." -ForegroundColor Gray
    
    $body = @{
        name = $persona.name
        description = $persona.description
        system_prompt = $persona.system_prompt
        is_public = $persona.is_public
        display_priority = $persona.display_priority
    } | ConvertTo-Json
    
    try {
        # Try to create persona
        $response = Invoke-RestMethod -Uri "$OnyxUrl/persona" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "  [OK] $($persona.name) created (ID: $($response.id))" -ForegroundColor Green
        $created++
    } catch {
        # Persona might already exist
        if ($_.Exception.Response.StatusCode -eq 409 -or $_.Exception.Message -match "already exists") {
            Write-Host "  [SKIP] $($persona.name) already exists" -ForegroundColor Yellow
        } else {
            Write-Host "  [ERR] Failed to create $($persona.name): $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }
}

Write-Host "`n[Summary]" -ForegroundColor Cyan
Write-Host "  Created: $created" -ForegroundColor Green
Write-Host "  Failed:  $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($created -gt 0) {
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Test personas in Onyx UI: http://localhost:3000" -ForegroundColor Gray
    Write-Host "  2. Add chat widget to Sampada storefront" -ForegroundColor Gray
    Write-Host "  3. Configure persona IDs in widget props" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Customer-facing personas:" -ForegroundColor Cyan
    Write-Host "  - Sampada Product Expert (product pages)" -ForegroundColor Gray
    Write-Host "  - Sampada Support Team (contact/account pages)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Internal personas:" -ForegroundColor Cyan
    Write-Host "  - Sampada Dev Assistant (admin portal)" -ForegroundColor Gray
    Write-Host "  - Sampada Business Analyst (admin dashboard)" -ForegroundColor Gray
}
