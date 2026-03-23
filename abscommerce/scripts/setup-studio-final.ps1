#!/usr/bin/env pwsh
# Sampada STUDIO_FINAL Setup Script
# Runs all necessary Prisma and database setup commands

Write-Host "🚀 Sampada STUDIO_FINAL Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Store the current directory
$projectRoot = "E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce"
Set-Location $projectRoot

Write-Host "📍 Working directory: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "Step 1/3: Generating Prisma Client..." -ForegroundColor Green
Write-Host "This will update TypeScript types for new schema models" -ForegroundColor Gray

try {
    npx prisma generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Prisma Client generated successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Prisma generate failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error generating Prisma Client: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Create Migration
Write-Host "Step 2/3: Creating database migration..." -ForegroundColor Green
Write-Host "This will create SQL migration files for new models" -ForegroundColor Gray

try {
    npx prisma migrate dev --name add_studio_final_models
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration created and applied successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Migration failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Note: If database is already up-to-date, this is normal" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error creating migration: $_" -ForegroundColor Red
    Write-Host "Attempting to continue..." -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Verify Setup
Write-Host "Step 3/3: Verifying setup..." -ForegroundColor Green

# Check if Prisma Client is generated
if (Test-Path "node_modules\.prisma\client") {
    Write-Host "✅ Prisma Client exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma Client not found in node_modules" -ForegroundColor Yellow
}

# Check if migration exists
if (Test-Path "prisma\migrations") {
    $migrationCount = (Get-ChildItem "prisma\migrations" -Directory).Count
    Write-Host "✅ Migrations folder exists ($migrationCount migrations)" -ForegroundColor Green
} else {
    Write-Host "⚠️  No migrations folder found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "New Database Models Added:" -ForegroundColor Cyan
Write-Host "  • ProductCache - Fast Sanity product lookups" -ForegroundColor White
Write-Host "  • SearchLog - Track user searches for AI collections" -ForegroundColor White
Write-Host "  • PersonalizedContent - Cache AI-generated taglines" -ForegroundColor White
Write-Host ""
Write-Host "New Fields Added to CustomOrder:" -ForegroundColor Cyan
Write-Host "  • sanityProductId - Bridge to Sanity products" -ForegroundColor White
Write-Host "  • paymentStatus - Track payment state" -ForegroundColor White
Write-Host "  • totalAmount - Order total in dollars" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your IDE/TypeScript server for type updates" -ForegroundColor White
Write-Host "  2. Test with: npm run dev" -ForegroundColor White
Write-Host "  3. Visit admin dashboard: http://localhost:3000/admin/dashboard" -ForegroundColor White
Write-Host "  4. Open Prisma Studio: npx prisma studio" -ForegroundColor White
Write-Host ""
