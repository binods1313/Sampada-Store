# 🚀 Sampada Designer - Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (local, Cloud SQL, or Supabase)
- A Google Cloud account (for Cloud Storage)
- A Stripe account

---

## Step 1: Database Setup

### Option A: Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL** if you haven't:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Create database**:
   ```sql
   CREATE DATABASE sampada;
   ```

3. **Set DATABASE_URL in .env.local**:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/sampada"
   ```

### Option B: Google Cloud SQL (Production)

1. **Create Cloud SQL instance** (if not already done):
   ```bash
   gcloud sql instances create sampada-db \
     --database-version=POSTGRES_15 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

2. **Create database and user**:
   ```bash
   gcloud sql databases create sampada --instance=sampada-db
   gcloud sql users create sampada-user --instance=sampada-db --password=YOUR_PASSWORD
   ```

3. **Get the IP address**:
   ```bash
   gcloud sql instances describe sampada-db --format='value(ipAddresses[0].ipAddress)'
   ```

4. **Set DATABASE_URL in .env.local**:
   ```
   DATABASE_URL="postgresql://sampada-user:YOUR_PASSWORD@IP_ADDRESS:5432/sampada"
   ```

### Option C: Supabase (Easy Alternative)

1. Go to https://supabase.com and create a project
2. Copy the connection string from Settings > Database > Connection string
3. Set it in .env.local

---

## Step 2: Push Database Schema

After setting DATABASE_URL, run:

```bash
npx prisma db push
```

This creates all the tables for the designer feature.

---

## Step 3: Google Cloud Storage Setup

1. **Create a bucket** (if not already done):
   ```bash
   gsutil mb -l us-central1 gs://sampada-storage-87848430/
   ```

2. **Create service account**:
   ```bash
   gcloud iam service-accounts create sampada-storage \
     --display-name="Sampada Storage Service"
   ```

3. **Grant permissions**:
   ```bash
   gcloud projects add-iam-policy-binding sampada-store-87848430 \
     --member="serviceAccount:sampada-storage@sampada-store-87848430.iam.gserviceaccount.com" \
     --role="roles/storage.objectAdmin"
   ```

4. **Create key file**:
   ```bash
   gcloud iam service-accounts keys create gcs-key.json \
     --iam-account=sampada-storage@sampada-store-87848430.iam.gserviceaccount.com
   ```

5. **Add to .env.local**:
   ```
   GOOGLE_CLOUD_PROJECT_ID=sampada-store-87848430
   GCS_BUCKET_NAME=sampada-storage-87848430
   GCS_KEY_FILE=./gcs-key.json
   ```

---

## Step 4: Stripe Subscription Products

1. **Log in to Stripe Dashboard** (https://dashboard.stripe.com)

2. **Create Pro Product**:
   - Go to Products > Add Product
   - Name: "Sampada Designer Pro"
   - Price: $30.00 USD, Recurring monthly
   - Copy the **Price ID** (starts with `price_`)

3. **Create Ultra Product**:
   - Name: "Sampada Designer Ultra"
   - Price: $300.00 USD, Recurring monthly
   - Copy the **Price ID**

4. **Create Webhook Endpoint**:
   - Go to Developers > Webhooks > Add endpoint
   - URL: `https://your-domain.com/api/subscriptions/designer/webhook`
   - Events to listen: 
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the **Signing Secret** (starts with `whsec_`)

5. **Add to .env.local**:
   ```
   STRIPE_DESIGNER_PRO_PRICE_ID=price_xxx
   STRIPE_DESIGNER_ULTRA_PRICE_ID=price_xxx
   STRIPE_DESIGNER_WEBHOOK_SECRET=whsec_xxx
   ```

---

## Step 5: Verify Setup

Run the verification script:

```bash
node scripts/verify-setup.js
```

This will check all your environment variables and files.

---

## Step 6: Start Development

```bash
npm run dev
```

Visit:
- **Homepage**: http://localhost:3000
- **Designer**: http://localhost:3000/designer
- **Templates**: http://localhost:3000/designer/templates
- **Subscription**: http://localhost:3000/subscription

---

## Troubleshooting

### "Cannot find module '.prisma/client/default'"
Run:
```bash
npx prisma generate
```

### Database connection errors
1. Check DATABASE_URL is correct
2. Ensure PostgreSQL is running
3. Check firewall/network settings

### "Environment variable not found: DATABASE_URL"
Make sure you have `.env.local` file with DATABASE_URL set.

### Google Cloud Storage errors
1. Verify GCS_KEY_FILE path is correct
2. Check bucket permissions
3. Ensure service account has `roles/storage.objectAdmin`

---

## Quick Reference

| Feature | URL |
|---------|-----|
| Homepage | `/` |
| Designer Dashboard | `/designer` |
| Create New Design | `/designer` (click Create) |
| Edit Design | `/designer/[id]` |
| Templates | `/designer/templates` |
| Subscription Plans | `/subscription` |

| API Endpoint | Purpose |
|--------------|---------|
| `GET /api/designs` | List user's designs |
| `POST /api/designs` | Create new design |
| `GET /api/user/designer-status` | Get user's tier & limits |
| `POST /api/subscriptions/designer` | Start subscription checkout |
| `POST /api/designs/export` | Export to Printify |
