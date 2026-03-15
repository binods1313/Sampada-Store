@echo off
REM ============================================================================
REM Sampada Designer - Google Cloud SQL Setup Script
REM ============================================================================
REM Run this script AFTER installing Google Cloud CLI
REM Download from: https://cloud.google.com/sdk/docs/install#windows
REM ============================================================================

echo.
echo ============================================================================
echo    SAMPADA DESIGNER - GOOGLE CLOUD SQL SETUP
echo ============================================================================
echo.

REM Check if gcloud is installed
where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Google Cloud CLI is not installed or not in PATH.
    echo.
    echo Please install it from:
    echo https://cloud.google.com/sdk/docs/install#windows
    echo.
    echo After installation, restart this terminal and run this script again.
    pause
    exit /b 1
)

echo [1/8] Checking gcloud installation...
gcloud --version | head -1
echo.

echo [2/8] Setting project...
gcloud config set project sampada-store-87848430
echo.

echo [3/8] Enabling required APIs...
gcloud services enable sqladmin.googleapis.com cloudsql.googleapis.com storage-api.googleapis.com compute.googleapis.com
echo.

echo [4/8] Creating Cloud SQL instance (this takes 5-10 minutes)...
echo Instance: sampada-db
echo Region: us-central1
echo PostgreSQL: 15
echo Tier: db-f1-micro
echo.

gcloud sql instances create sampada-db ^
  --database-version=POSTGRES_15 ^
  --tier=db-f1-micro ^
  --region=us-central1 ^
  --storage-type=SSD ^
  --storage-size=10GB ^
  --availability-type=zonal ^
  --backup-start-time=03:00

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Instance creation may have failed. Check if it already exists:
    gcloud sql instances list
    echo.
)

echo.
echo [5/8] Creating database...
gcloud sql databases create sampada --instance=sampada-db
echo.

echo [6/8] Creating database user...
echo.
set /p DB_PASSWORD="Enter a secure password for 'sampada-user': "
gcloud sql users create sampada-user --instance=sampada-db --password=%DB_PASSWORD%
echo.

echo [7/8] Getting connection information...
echo.
echo Public IP Address:
for /f "tokens=*" %%i in ('gcloud sql instances describe sampada-db --format="value(ipAddresses[0].ipAddress)"') do set CLOUD_SQL_IP=%%i
echo %CLOUD_SQL_IP%
echo.

echo [8/8] Authorizing your IP address...
for /f "tokens=*" %%i in ('curl -s ifconfig.me') do set MY_IP=%%i
echo Your IP: %MY_IP%
gcloud sql instances patch sampada-db --authorized-networks=%MY_IP%/32
echo.

echo ============================================================================
echo    SETUP COMPLETE!
echo ============================================================================
echo.
echo Add this to your .env.local file:
echo.
echo DATABASE_URL="postgresql://sampada-user:%DB_PASSWORD%@%CLOUD_SQL_IP%:5432/sampada"
echo.
echo Then run:
echo   npm run db:push
echo   npm run dev
echo.
echo ============================================================================
pause
