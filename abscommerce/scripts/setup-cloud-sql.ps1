# ============================================================================
# Sampada Designer - Google Cloud SQL Setup Script (PowerShell)
# ============================================================================
# Run this script AFTER installing Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install#windows
# ============================================================================

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   SAMPADA DESIGNER - GOOGLE CLOUD SQL SETUP" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ID = "sampada-store-2026"
$INSTANCE_NAME = "sampada-db"
$REGION = "us-central1"
$DATABASE_NAME = "sampada"
$DB_USER = "sampada-user"
$TIER = "db-f1-micro"
$PG_VERSION = "POSTGRES_15"

# Check if gcloud is installed
$gcloudPath = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloudPath) {
    Write-Host "ERROR: Google Cloud CLI is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install from:" -ForegroundColor Yellow
    Write-Host "https://cloud.google.com/sdk/docs/install#windows" -ForegroundColor White
    Write-Host ""
    Write-Host "Or download directly:" -ForegroundColor Yellow
    Write-Host "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/9] Checking gcloud installation..." -ForegroundColor Green
gcloud --version | Select-Object -First 1
Write-Host ""

# Write-Host "[2/9] Authenticating (browser will open)..." -ForegroundColor Green
# gcloud auth login --no-launch-browser 2>$null
# if ($LASTEXITCODE -ne 0) {
#     Write-Host "Opening browser for authentication..." -ForegroundColor Yellow
#     gcloud auth login
# }
Write-Host ""

Write-Host "[3/9] Setting project to $PROJECT_ID..." -ForegroundColor Green
gcloud config set project $PROJECT_ID
Write-Host ""

Write-Host "[4/9] Enabling required APIs..." -ForegroundColor Green
gcloud services enable sqladmin.googleapis.com cloudsql.googleapis.com storage-api.googleapis.com compute.googleapis.com
Write-Host ""

# Check if instance already exists
Write-Host "[5/9] Checking if instance exists..." -ForegroundColor Green
$existingInstance = gcloud sql instances list --format="value(name)" 2>$null | Where-Object { $_ -eq $INSTANCE_NAME }

if ($existingInstance) {
    Write-Host "Instance '$INSTANCE_NAME' already exists!" -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue with existing instance? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
} else {
    Write-Host "[5/9] Creating Cloud SQL instance..." -ForegroundColor Green
    Write-Host "  Instance: $INSTANCE_NAME" -ForegroundColor White
    Write-Host "  Region: $REGION" -ForegroundColor White
    Write-Host "  PostgreSQL: 15" -ForegroundColor White
    Write-Host "  Tier: $TIER" -ForegroundColor White
    Write-Host ""
    Write-Host "This takes 5-10 minutes. Please wait..." -ForegroundColor Yellow
    Write-Host ""

    gcloud sql instances create $INSTANCE_NAME `
        --database-version=$PG_VERSION `
        --tier=$TIER `
        --region=$REGION `
        --storage-type=SSD `
        --storage-size=10GB `
        --availability-type=zonal `
        --backup-start-time=03:00 `
        --maintenance-window-day=SUN `
        --maintenance-window-hour=03

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error creating instance. Check the error above." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host ""

Write-Host "[6/9] Creating database..." -ForegroundColor Green
gcloud sql databases create $DATABASE_NAME --instance=$INSTANCE_NAME 2>$null
Write-Host ""

Write-Host "[7/9] Creating database user..." -ForegroundColor Green
$DB_PASSWORD = Read-Host "Enter a secure password for '$DB_USER'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

gcloud sql users create $DB_USER --instance=$INSTANCE_NAME --password=$PlainPassword 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "User may already exist. Updating password..." -ForegroundColor Yellow
    gcloud sql users set-password $DB_USER --instance=$INSTANCE_NAME --password=$PlainPassword
}
Write-Host ""

Write-Host "[8/9] Getting connection information..." -ForegroundColor Green
$CLOUD_SQL_IP = gcloud sql instances describe $INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)"
$CONNECTION_NAME = gcloud sql instances describe $INSTANCE_NAME --format="value(connectionName)"
Write-Host "  Public IP: $CLOUD_SQL_IP" -ForegroundColor White
Write-Host "  Connection Name: $CONNECTION_NAME" -ForegroundColor White
Write-Host ""

Write-Host "[9/9] Authorizing your IP address..." -ForegroundColor Green
try {
    $MY_IP = (Invoke-WebRequest -Uri "https://ifconfig.me/ip" -UseBasicParsing).Content.Trim()
    Write-Host "  Your IP: $MY_IP" -ForegroundColor White
    gcloud sql instances patch $INSTANCE_NAME --authorized-networks="$MY_IP/32" --quiet
} catch {
    Write-Host "Could not auto-detect IP. You may need to authorize manually." -ForegroundColor Yellow
}
Write-Host ""

# Generate DATABASE_URL
$DATABASE_URL = "postgresql://${DB_USER}:${PlainPassword}@${CLOUD_SQL_IP}:5432/${DATABASE_NAME}"

Write-Host "============================================================================" -ForegroundColor Green
Write-Host "   SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Add this to your .env.local file:" -ForegroundColor Yellow
Write-Host ""
Write-Host "DATABASE_URL=`"$DATABASE_URL`"" -ForegroundColor White
Write-Host ""
Write-Host "GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID" -ForegroundColor White
Write-Host "GCS_BUCKET_NAME=sampada-storage-87848430" -ForegroundColor White
Write-Host ""
Write-Host "Then run:" -ForegroundColor Yellow
Write-Host "  npm run db:push" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Green

# Copy to clipboard
$DATABASE_URL | Set-Clipboard
Write-Host "DATABASE_URL has been copied to clipboard!" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
