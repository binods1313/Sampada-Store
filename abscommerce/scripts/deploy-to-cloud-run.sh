#!/bin/bash
# Sampada Cloud Run Deployment Script
# 
# This script builds and deploys Sampada to Google Cloud Run
# 
# Prerequisites:
# - gcloud CLI installed and authenticated
# - Docker installed
# - Cloud SQL instance created (sampada-production)
# - Secret Manager secrets created
#
# Usage:
#   ./deploy-to-cloud-run.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="sampada-store-2026"
REGION="us-central1"
SERVICE_NAME="sampada"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
CLOUD_SQL_INSTANCE="${PROJECT_ID}:${REGION}:sampada-production"

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Sampada Cloud Run Deployment                         ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}\n"

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}\n"

# Check gcloud
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}✗ gcloud CLI not found. Install from:${NC}"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi
echo -e "${GREEN}✓${NC} gcloud CLI installed"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found. Install from:${NC}"
    echo "https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker installed"

# Check project
gcloud config set project ${PROJECT_ID}
echo -e "${GREEN}✓${NC} Project set to ${PROJECT_ID}\n"

# Step 2: Create secrets if they don't exist
echo -e "${YELLOW}Step 2: Creating Secret Manager secrets...${NC}\n"

create_secret_if_not_exists() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2
    
    if gcloud secrets describe ${SECRET_NAME} --project=${PROJECT_ID} &> /dev/null; then
        echo -e "${GREEN}✓${NC} Secret ${SECRET_NAME} already exists"
    else
        echo -n "${SECRET_VALUE}" | gcloud secrets create ${SECRET_NAME} --data-file=- --project=${PROJECT_ID}
        echo -e "${GREEN}✓${NC} Secret ${SECRET_NAME} created"
    fi
}

# Prompt for secrets
echo "Enter your Stripe and Database credentials:"
read -p "STRIPE_SECRET_KEY (sk_test_...): " STRIPE_SECRET
read -p "STRIPE_PUBLISHABLE_KEY (pk_test_...): " STRIPE_PUBKEY
read -p "STRIPE_DESIGNER_PRO_PRICE_ID (price_...): " STRIPE_PRO_ID
read -p "STRIPE_DESIGNER_ULTRA_PRICE_ID (price_...): " STRIPE_ULTRA_ID
read -p "STRIPE_WEBHOOK_SECRET (whsec_...): " STRIPE_WEBHOOK
read -p "DATABASE_URL (postgresql://...): " DATABASE_URL

create_secret_if_not_exists "STRIPE_SECRET_KEY" "${STRIPE_SECRET}"
create_secret_if_not_exists "STRIPE_PUBLISHABLE_KEY" "${STRIPE_PUBKEY}"
create_secret_if_not_exists "STRIPE_DESIGNER_PRO_PRICE_ID" "${STRIPE_PRO_ID}"
create_secret_if_not_exists "STRIPE_DESIGNER_ULTRA_PRICE_ID" "${STRIPE_ULTRA_ID}"
create_secret_if_not_exists "STRIPE_WEBHOOK_SECRET" "${STRIPE_WEBHOOK}"
create_secret_if_not_exists "DATABASE_URL" "${DATABASE_URL}"

echo ""

# Step 3: Build Docker image
echo -e "${YELLOW}Step 3: Building Docker image...${NC}\n"

docker build -t ${IMAGE_NAME} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Docker build successful\n"
else
    echo -e "${RED}✗${NC} Docker build failed"
    exit 1
fi

# Step 4: Push to Container Registry
echo -e "${YELLOW}Step 4: Pushing image to Container Registry...${NC}\n"

docker push ${IMAGE_NAME}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Image pushed successfully\n"
else
    echo -e "${RED}✗${NC} Failed to push image"
    exit 1
fi

# Step 5: Deploy to Cloud Run
echo -e "${YELLOW}Step 5: Deploying to Cloud Run...${NC}\n"

gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME} \
    --region ${REGION} \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --concurrency 80 \
    --timeout 300 \
    --set-env-vars NODE_ENV=production \
    --add-cloudsql-instances ${CLOUD_SQL_INSTANCE} \
    --set-secrets DATABASE_URL=DATABASE_URL:latest \
    --set-secrets STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest \
    --set-secrets STRIPE_PUBLISHABLE_KEY=STRIPE_PUBLISHABLE_KEY:latest \
    --set-secrets STRIPE_DESIGNER_PRO_PRICE_ID=STRIPE_DESIGNER_PRO_PRICE_ID:latest \
    --set-secrets STRIPE_DESIGNER_ULTRA_PRICE_ID=STRIPE_DESIGNER_ULTRA_PRICE_ID:latest \
    --set-secrets STRIPE_WEBHOOK_SECRET=STRIPE_WEBHOOK_SECRET:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Deployment successful\n"
else
    echo -e "${RED}✗${NC} Deployment failed"
    exit 1
fi

# Step 6: Get service URL
echo -e "${YELLOW}Step 6: Getting service URL...${NC}\n"

SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Deployment Complete!                                  ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}\n"

echo -e "Service Name: ${GREEN}${SERVICE_NAME}${NC}"
echo -e "Region: ${GREEN}${REGION}${NC}"
echo -e "Service URL: ${GREEN}${SERVICE_URL}${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test the deployment: curl ${SERVICE_URL}/api/health"
echo "2. Configure custom domain (optional)"
echo "3. Set up monitoring and alerts"
echo ""

# Open Cloud Console
echo "Opening Cloud Console..."
start "https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}?project=${PROJECT_ID}"
