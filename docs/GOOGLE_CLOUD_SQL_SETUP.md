# 🚀 Google Cloud SQL Setup Guide for Sampada Designer

## Prerequisites

Before running the setup commands, you need the Google Cloud CLI installed.

---

## Step 1: Install Google Cloud CLI

### Option A: Windows Installer (Recommended)

1. Download the installer from:
   https://cloud.google.com/sdk/docs/install#windows

2. Run the installer and follow the prompts

3. Restart your terminal/PowerShell after installation

4. Verify installation:
   ```powershell
   gcloud --version
   ```

### Option B: Download directly

1. Go to: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
2. Run the installer
3. Restart terminal

---

## Step 2: Authenticate with Google Cloud

```bash
# Login to Google Cloud (opens browser)
gcloud auth login

# Set your project
gcloud config set project sampada-store-87848430

# Verify project
gcloud config get-value project
# Should output: sampada-store-87848430
```

---

## Step 3: Enable Required APIs

```bash
gcloud services enable \
  sqladmin.googleapis.com \
  cloudsql.googleapis.com \
  storage-api.googleapis.com \
  compute.googleapis.com
```

---

## Step 4: Create Cloud SQL Instance

**Configuration:**
- Instance name: `sampada-db`
- Region: `us-central1`
- PostgreSQL version: 15
- Machine type: `db-f1-micro` (can upgrade later)

```bash
# Create the PostgreSQL instance
gcloud sql instances create sampada-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --availability-type=zonal \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=03

# This takes 5-10 minutes to complete
```

**Note:** If you want private IP (more secure), add:
```bash
--network=default \
--no-assign-ip
```

---

## Step 5: Create Database and User

```bash
# Create the sampada database
gcloud sql databases create sampada --instance=sampada-db

# Create database user (you'll be prompted for password)
gcloud sql users create sampada-user \
  --instance=sampada-db \
  --password=YOUR_SECURE_PASSWORD
```

**Important:** Save the password securely! You'll need it for DATABASE_URL.

---

## Step 6: Get Connection Information

```bash
# Get the public IP address
gcloud sql instances describe sampada-db --format='value(ipAddresses[0].ipAddress)'

# Get connection name (for Cloud SQL Proxy)
gcloud sql instances describe sampada-db --format='value(connectionName)'
```

---

## Step 7: Configure Network Access

### Option A: Allow Your IP (for development)

```bash
# Get your public IP
curl ifconfig.me

# Authorize your IP
gcloud sql instances patch sampada-db --authorized-networks=YOUR_IP/32
```

### Option B: Cloud SQL Proxy (more secure)

Download and run Cloud SQL Proxy:
```bash
# Download proxy
curl -o cloud_sql_proxy.exe https://dl.google.com/cloudsql/cloud_sql_proxy_x64.exe

# Run proxy (keep this running in a separate terminal)
cloud_sql_proxy.exe -instances=sampada-store-87848430:us-central1:sampada-db=tcp:5432
```

---

## Step 8: Set Up Environment Variable

Add to your `.env.local`:

### If using public IP:
```
DATABASE_URL="postgresql://sampada-user:YOUR_PASSWORD@CLOUD_SQL_IP:5432/sampada"
```

### If using Cloud SQL Proxy:
```
DATABASE_URL="postgresql://sampada-user:YOUR_PASSWORD@127.0.0.1:5432/sampada"
```

---

## Step 9: Push Database Schema

```bash
# From your project directory
npx prisma db push
```

You should see:
```
✓ Created 5 new tables
✓ Added indexes
```

---

## Step 10: Verify Connection

```bash
# Open Prisma Studio to browse your database
npx prisma studio
```

This opens http://localhost:5555 where you can see your tables.

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Project ID | `sampada-store-87848430` |
| Instance Name | `sampada-db` |
| Region | `us-central1` |
| PostgreSQL Version | 15 |
| Machine Type | `db-f1-micro` |
| Database Name | `sampada` |
| User | `sampada-user` |

---

## Cost Estimate

- **db-f1-micro**: ~$7-10/month
- **Storage (10GB SSD)**: ~$1.70/month
- **Network egress**: Varies by usage

Total estimated: **~$10-15/month**

---

## Troubleshooting

### "Connection refused"
- Check if your IP is authorized
- Or run Cloud SQL Proxy

### "Authentication failed"
- Verify password in DATABASE_URL
- Check user exists: `gcloud sql users list --instance=sampada-db`

### "Instance not found"
- Wait for instance creation to complete
- Check status: `gcloud sql instances describe sampada-db`

---

## Security Best Practices

1. **Use Cloud SQL Proxy** in production instead of public IP
2. **Create VPC Connector** for Cloud Run/App Engine
3. **Rotate passwords** regularly
4. **Enable SSL/TLS** for connections
5. **Use IAM authentication** for service accounts

---

## Next Steps After Setup

1. Run `npm run db:push` to create tables
2. Run `npm run dev` to start the app
3. Visit http://localhost:3000/designer
4. Create your first design!
