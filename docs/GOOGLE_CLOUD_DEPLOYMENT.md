# 🌐 Domain Setup: Sampada.shop + SampadaStore.com (Google Cloud Run)

## Deployment Platform: Google Cloud Run

**Primary Domain:** `Sampada.shop`  
**Backup Domain:** `SampadaStore.com`  
**Platform:** Google Cloud Run  
**Database:** Google Cloud SQL (PostgreSQL)

---

## Google Cloud Run Configuration

### Step 1: Domain Mapping

```bash
# Map primary domain
gcloud run domain-mappings create --service abscommerce --domain sampada.shop --region asia-south1

# Map www subdomain
gcloud run domain-mappings create --service abscommerce --domain www.sampada.shop --region asia-south1

# Map backup domain
gcloud run domain-mappings create --service abscommerce --domain sampadastore.com --region asia-south1

# Map www for backup
gcloud run domain-mappings create --service abscommerce --domain www.sampadastore.com --region asia-south1
```

### Step 2: DNS Configuration (Cloud DNS)

```bash
# Create DNS zone
gcloud dns managed-zones create sampada-zone --dns-name="sampada.shop." --description="Sampada primary domain"

# Add A record for sampada.shop
gcloud dns record-sets create sampada.shop. --zone=sampada-zone --type=A --ttl=300 --rrdatas="YOUR_CLOUD_RUN_IP"

# Add CNAME for www
gcloud dns record-sets create www.sampada.shop. --zone=sampada-zone --type=CNAME --ttl=300 --rrdatas="ghs.googlehosted.com."

# Repeat for SampadaStore.com
gcloud dns managed-zones create sampadastore-zone --dns-name="sampadastore.com." --description="Sampada backup domain"
```

### Step 3: SSL Certificate (Automatic)

```bash
# Google Cloud Run automatically provisions SSL certificates
# Verify certificate status
gcloud run domain-mappings describe --domain sampada.shop --region asia-south1

# Check SSL is active (should show "ACTIVE")
```

### Step 4: Environment Variables

Update in **Google Cloud Console** or via command:

```bash
# Set environment variables for Cloud Run
gcloud run services update abscommerce \
  --update-env-vars="NEXT_PUBLIC_SITE_URL=https://sampada.shop" \
  --update-env-vars="NEXT_PUBLIC_DOMAIN=sampada.shop" \
  --update-env-vars="NEXT_PUBLIC_BACKUP_DOMAIN=sampadastore.com" \
  --update-env-vars="DATABASE_URL=postgres://..." \
  --update-env-vars="SANITY_WEBHOOK_SECRET=your-secret" \
  --region asia-south1
```

### Step 5: Load Balancer for Multi-Domain Redirect

Create Cloud Load Balancer to redirect all domains to primary:

```bash
# Create URL map for redirects
gcloud compute url-maps create sampada-redirect-map \
  --default-service=sampada-backend-service

# Add redirect rules
gcloud compute url-maps add-path-matcher sampada-redirect-map \
  --path-matcher-name=redirect-matcher \
  --default-service=sampada-backend-service \
  --new-hosts="sampadastore.com,www.sampadastore.com,www.sampada.shop"
```

---

## Next.js Configuration for Cloud Run

### Update `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Cloud Run
  output: 'standalone',
  
  // Enable compression
  compress: true,
  
  // Cloud Run uses port from environment
  // No custom server needed
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ],
      },
    ]
  },

  // Redirect all backup domains to primary
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'sampadastore.com',
          },
        ],
        destination: 'https://sampada.shop/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.sampadastore.com',
          },
        ],
        destination: 'https://sampada.shop/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.sampada.shop',
          },
        ],
        destination: 'https://sampada.shop/:path*',
        permanent: true,
      },
    ]
  },
  
  images: {
    domains: ['cdn.sanity.io', 'storage.googleapis.com', 'sampada.shop'],
  },
}

module.exports = nextConfig
```

### Update `Dockerfile` (if using custom)

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild for production
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
```

---

## Deployment Commands

### Deploy to Cloud Run

```bash
# Build and deploy
gcloud run deploy abscommerce \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars="DATABASE_URL=$DATABASE_URL,GOOGLE_AI_API_KEY=$GOOGLE_AI_API_KEY"

# Or using Docker
docker build -t gcr.io/YOUR_PROJECT_ID/sampada .
docker push gcr.io/YOUR_PROJECT_ID/sampada
gcloud run deploy abscommerce --image gcr.io/YOUR_PROJECT_ID/sampada --region asia-south1
```

### Database Migration on Cloud SQL

```bash
# Connect to Cloud SQL via proxy
cloud_sql_proxy -instances=YOUR_PROJECT:asia-south1:sampada-db=tcp:5432

# Run migrations
npx prisma migrate deploy
```

---

## Cloud Storage for Images

```bash
# Create bucket for user uploads
gcloud storage buckets create gs://sampada-uploads --location=asia-south1

# Set CORS for bucket
cat > cors.json << EOF
[
  {
    "origin": ["https://sampada.shop", "https://sampadastore.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gcloud storage buckets update gs://sampada-uploads --cors-file=cors.json
```

---

## Monitoring & Logging

```bash
# View logs
gcloud run services logs read abscommerce --region asia-south1 --limit=100

# Set up alerts
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="Sampada 5xx Errors" \
  --condition-display-name="High error rate" \
  --condition-threshold-value=10
```

---

## Cost Optimization

### Cloud Run Pricing (asia-south1)
- **Free tier:** First 2 million requests/month
- **Compute:** ~$0.00002400/vCPU-second
- **Memory:** ~$0.00000250/GiB-second
- **Estimated:** $20-50/month for 10K users

### Recommended Settings
```bash
--min-instances 1      # Keep warm, avoid cold starts
--max-instances 10     # Handle traffic spikes
--cpu 2                # Sufficient for AI services
--memory 2Gi           # Handles Prisma + Gemini
--concurrency 80       # Requests per instance
```

---

## Quick Setup Script

```bash
#!/bin/bash
# setup-gcp-domains.sh

PROJECT_ID="your-project-id"
REGION="asia-south1"
SERVICE_NAME="abscommerce"

# Deploy service
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

# Map domains
for domain in "sampada.shop" "www.sampada.shop" "sampadastore.com" "www.sampadastore.com"; do
  echo "Mapping $domain..."
  gcloud run domain-mappings create \
    --service $SERVICE_NAME \
    --domain $domain \
    --region $REGION
done

echo "✅ Deployment complete! Configure DNS as shown above."
```

---

## Environment Variables Checklist

```bash
# Required
DATABASE_URL="postgresql://..."
GOOGLE_AI_API_KEY="your-gemini-key"
NEXT_PUBLIC_SITE_URL="https://sampada.shop"

# Optional but recommended
SANITY_WEBHOOK_SECRET="random-string"
STRIPE_SECRET_KEY="sk_live_..."
PRINTIFY_API_KEY="your-key"
```

---

**Total Annual Cost:**
- Domains: $37/year
- Cloud Run: ~$30/month = $360/year
- Cloud SQL: ~$25/month = $300/year
- Cloud Storage: ~$5/month = $60/year
- **Total: ~$757/year** for full production setup

**Ready for Sampada.shop on Google Cloud! 🚀**
