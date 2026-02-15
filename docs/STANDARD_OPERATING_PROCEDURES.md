# 📋 Standard Operating Procedures (SOPs) - Sampada Platform

*Om Namah Sivaya* 🙏

## Table of Contents
1. [Adding New Products](#sop-1-adding-new-products)
2. [Processing Custom T-Shirt Orders](#sop-2-processing-custom-orders)
3. [Managing User Subscription Tiers](#sop-3-subscription-management)
4. [Running AI Features](#sop-4-ai-features)
5. [Monitoring & Troubleshooting](#sop-5-monitoring)

---

## SOP 1: Adding New Products

### Overview
Add new products to the Sampada catalog using Sanity Studio with automatic sync to the database.

### Prerequisites
- Access to Sanity Studio (http://localhost:3333 or production URL)
- Product images ready (minimum 1, recommended 3-5)
- Product details (name, price, description, category)

### Step-by-Step Process

#### 1. Access Sanity Studio
```bash
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\sanity_abscommerce
npm run dev
# Opens on http://localhost:3333
```

#### 2. Create New Product
1. Click **"Products"** in left sidebar
2. Click **"+ Create"** button
3. Fill in required fields:
   - **Product Name**: e.g., "Bohemian Silk Tunic"
   - **Slug**: Auto-generated from name (or customize)
   - **Images**: Upload 1-5 product photos
   - **Base Price**: e.g., 2499 (in INR)
   - **Category**: Select from dropdown
   - **Details**: Product description

#### 3. Add Product Variants (Optional)
1. Scroll to **"Product Variants"** section
2. Click **"Add Item"**
3. For each variant, fill:
   - **Color Name**: e.g., "Navy Blue"
   - **Color Hex**: e.g., #000080
   - **Size**: Select from dropdown (S, M, L, XL, etc.)
   - **Variant Stock**: e.g., 50
   - **Variant Price** (optional): Override base price
   - **Variant Image** (optional): Color-specific image

#### 4. Add Specifications (Optional)
1. Scroll to **"Product Specifications"**
2. Add key-value pairs:
   - Feature: "Fabric", Value: "100% Silk"
   - Feature: "Care", Value: "Dry clean only"
   - Feature: "Origin", Value: "Handwoven in Varanasi"

#### 5. Set Product Status
- **Draft**: Not visible to customers (for preparation)
- **Active**: Live on website
- **Archived**: Hidden but preserved

#### 6. Publish Product
1. Click **"Publish"** button (top right)
2. Confirm publication

### Automatic Actions (STUDIO_FINAL)
✅ **Webhook triggers** → Updates `ProductCache` in database  
✅ **AI Stylist** → Can generate styling tips (run manually)  
✅ **Search indexing** → Product becomes searchable  

### Verification Checklist
- [ ] Product appears in Sanity Studio product list
- [ ] Product visible on website (if status = "active")
- [ ] ProductCache updated (check Prisma Studio)
- [ ] Images loading correctly
- [ ] Variants display properly (if added)

### Troubleshooting
**Problem**: Product not showing on website  
**Solution**: Check status is "Active", not "Draft"

**Problem**: Images not loading  
**Solution**: Verify images uploaded to Sanity, check CDN URL

**Problem**: Webhook not syncing  
**Solution**: Check `/api/webhooks/sanity` endpoint is configured in Sanity dashboard

---

## SOP 2: Processing Custom T-Shirt Orders

### Overview
Handle custom design orders from the Designer tool through fulfillment.

### Order Lifecycle
```
Customer Design → Order Placed → Payment → Printify → Shipping → Delivered
```

### Step-by-Step Process

#### 1. Monitor New Orders
**Via Prisma Studio:**
```bash
npx prisma studio
# Navigate to CustomOrder table
# Filter: status = "pending"
```

**Via Admin Dashboard:**
```
http://localhost:3000/admin/dashboard
# Check "Recent Orders" section
```

#### 2. Verify Order Details
For each new order, check:
- **Customer Info**: Name, email, shipping address
- **Design**: View `customDesignId` → Check `CustomDesign` table
- **Payment**: Verify `stripePaymentIntentId` is present
- **Product**: Check `sanityProductId` (if linked to catalog item)

#### 3. Process with Printify

**Manual Method:**
1. Open Printify dashboard
2. Create new order with:
   - Design file (from `CustomDesign.thumbnail` or `canvasData`)
   - Customer shipping address
   - Product variant (size, color)
3. Copy Printify Order ID
4. Update in Prisma Studio:
   ```sql
   UPDATE "CustomOrder" 
   SET "printifyOrderId" = 'printify_12345',
       "status" = 'production'
   WHERE id = 'order_id';
   ```

**Automated Method (Future):**
```typescript
// API route to auto-submit to Printify
POST /api/orders/submit-to-printify
{
  "orderId": "clx123abc"
}
```

#### 4. Track Order Status
Update `CustomOrder.status` as order progresses:
- `pending` → Order placed, payment pending
- `production` → Sent to Printify, being printed
- `shipped` → Tracking number available
- `delivered` → Customer received
- `failed` → Issue occurred

#### 5. Update Tracking Information
When Printify provides tracking:
```sql
UPDATE "CustomOrder" 
SET "trackingNumber" = 'TRACK123456',
    "status" = 'shipped'
WHERE "printifyOrderId" = 'printify_12345';
```

#### 6. Customer Communication
Send email updates at each stage:
- Order confirmed (automatic via Stripe)
- In production (manual or automated)
- Shipped with tracking (manual or automated)
- Delivered confirmation (optional)

### Verification Checklist
- [ ] Payment confirmed in Stripe
- [ ] Design file accessible
- [ ] Printify order created
- [ ] Tracking number added
- [ ] Customer notified
- [ ] Order status updated

### Troubleshooting
**Problem**: Design file missing  
**Solution**: Check `CustomDesign.thumbnail` URL, regenerate if needed

**Problem**: Printify order failed  
**Solution**: Check design dimensions, file format, product availability

**Problem**: Customer address invalid  
**Solution**: Contact customer for correction, update in database

---

## SOP 3: Managing User Subscription Tiers

### Overview
Upgrade/downgrade designer subscription tiers (Free, Pro, Ultra).

### Tier Features
| Feature | Free | Pro | Ultra |
|---------|------|-----|-------|
| Designs/month | 2 | 50 | Unlimited |
| AI Assistant | ❌ | ✅ | ✅ |
| AI Image Gen | ❌ | ❌ | ✅ |
| Multi-product Preview | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ✅ |

### Step-by-Step Process

#### 1. Locate User
**Via Prisma Studio:**
```bash
npx prisma studio
# Navigate to DesignUser table
# Search by email
```

#### 2. Verify Current Tier
Check fields:
- `designerTier`: Current tier (free/pro/ultra)
- `stripeDesignerId`: Stripe customer ID
- `designerSubStatus`: Subscription status
- `designerPeriodEnd`: When subscription expires

#### 3. Upgrade User

**Manual Upgrade (for testing/support):**
```sql
UPDATE "DesignUser" 
SET "designerTier" = 'pro',
    "designLimit" = 50,
    "features" = '{"aiAssistant": true, "aiImageGen": false, "multiProductPreview": true, "customBranding": false}'
WHERE email = 'user@example.com';
```

**Via Stripe (Production):**
1. User subscribes via website
2. Stripe webhook triggers `/api/stripe/webhook`
3. Automatic update in database

#### 4. Update Feature Flags
Features JSON structure:
```json
{
  "aiAssistant": true,      // Pro & Ultra
  "aiImageGen": true,       // Ultra only
  "multiProductPreview": true,  // Pro & Ultra
  "customBranding": true    // Ultra only
}
```

#### 5. Reset Monthly Quota (if needed)
```sql
UPDATE "DesignUser" 
SET "designsCreatedThisMonth" = 0
WHERE email = 'user@example.com';
```

#### 6. Verify Changes
- [ ] `designerTier` updated
- [ ] `designLimit` matches tier
- [ ] `features` JSON correct
- [ ] User can access new features in Designer

### Troubleshooting
**Problem**: User upgraded but features not working  
**Solution**: Check `features` JSON, restart user session

**Problem**: Stripe webhook not updating tier  
**Solution**: Verify webhook endpoint configured, check logs

**Problem**: User exceeded design limit  
**Solution**: Check `designsCreatedThisMonth` vs `designLimit`, reset if new month

---

## SOP 4: Running AI Features

### Overview
Execute AI-powered features for product enhancement and personalization.

### 4.1 Generate Styling Tips (AI Virtual Stylist)

**For Single Product:**
```bash
# In Node.js console or create a script
node -e "
const { generateStylingTips } = require('./services/ai/stylist');
generateStylingTips('PRODUCT_ID_HERE').then(tips => console.log(tips));
"
```

**For All Products (Batch):**
```bash
node -e "
const { batchGenerateStylingTips } = require('./services/ai/stylist');
batchGenerateStylingTips().then(result => console.log(result));
"
```

**Expected Output:**
```json
[
  "Pairs beautifully with wide-leg palazzo pants for a bohemian look",
  "Layer with a denim jacket for versatile day-to-night styling",
  "Perfect for cultural events and casual gatherings"
]
```

### 4.2 Generate Personalized Taglines

**For Specific User & Product:**
```bash
node -e "
const { generatePersonalizedCopy } = require('./services/ai/personalization');
generatePersonalizedCopy('PRODUCT_ID', 'USER_ID').then(tagline => console.log(tagline));
"
```

**Expected Output:**
```
"Because you love vibrant patterns, this Dusty Rose Tunic pairs perfectly with your recent Indigo Scarf purchase."
```

### 4.3 Generate Dynamic Collections

**Run Daily (via Cron or Manual):**
```bash
node -e "
const { scheduleCollectionGeneration } = require('./services/ai/dynamicCollections');
scheduleCollectionGeneration().then(result => console.log(result));
"
```

**Expected Output:**
```json
{
  "success": true,
  "collectionsCreated": 3,
  "collectionsDeleted": 2
}
```

**Set Up Cron Job (Google Cloud Scheduler):**
```bash
gcloud scheduler jobs create http dynamic-collections-daily \
  --schedule="0 2 * * *" \
  --uri="https://sampada.shop/api/ai/generate-collections" \
  --http-method=POST \
  --oidc-service-account-email=YOUR_SERVICE_ACCOUNT
```

### 4.4 Monitor AI Usage & Costs

**Check Gemini API Usage:**
```bash
# View in Google Cloud Console
# AI Platform → Gemini API → Usage
```

**Estimated Costs:**
- Styling tips: ~$0.001 per product
- Personalization: ~$0.01 per user-product pair
- Dynamic collections: ~$0.05 per run

**Monthly Budget (1000 products, 500 users):**
- Styling tips: $1
- Personalization: $50
- Collections (daily): $1.50
- **Total: ~$52.50/month**

### Verification Checklist
- [ ] AI services import without errors
- [ ] Gemini API key configured
- [ ] Generated content saves to Sanity/Prisma
- [ ] Content appears on website
- [ ] API usage within budget

---

## SOP 5: Monitoring & Troubleshooting

### 5.1 Health Checks

**Daily Checks:**
```bash
# 1. Check Cloud Run service status
gcloud run services describe abscommerce --region asia-south1

# 2. Check database connection
npx prisma studio
# Should connect to Cloud SQL

# 3. Check recent errors
gcloud run services logs read abscommerce --region asia-south1 --limit=50
```

### 5.2 Performance Monitoring

**Key Metrics to Monitor:**
- Response time: < 500ms average
- Error rate: < 1%
- Database connections: < 80% of max
- Memory usage: < 1.5GB
- AI API calls: Within quota

**Set Up Alerts (Google Cloud Monitoring):**
```bash
# Alert on high error rate
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL \
  --display-name="Sampada High Errors" \
  --condition-threshold-value=10 \
  --condition-threshold-duration=300s
```

### 5.3 Common Issues & Solutions

**Issue: Webhook not syncing products**
```bash
# Check webhook endpoint
curl https://sampada.shop/api/webhooks/sanity

# Verify in Sanity dashboard
# Settings → API → Webhooks → Check status

# Test manually
curl -X POST https://sampada.shop/api/webhooks/sanity \
  -H "Content-Type: application/json" \
  -d '{"_type":"product","_id":"test123"}'
```

**Issue: AI services timing out**
```bash
# Increase Cloud Run timeout
gcloud run services update abscommerce \
  --timeout=300 \
  --region asia-south1

# Check Gemini API quota
# Console → APIs & Services → Gemini API → Quotas
```

**Issue: Database connection errors**
```bash
# Check Cloud SQL instance status
gcloud sql instances describe sampada-db

# Verify connection string
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

**Issue: Out of memory errors**
```bash
# Increase Cloud Run memory
gcloud run services update abscommerce \
  --memory=2Gi \
  --region asia-south1
```

### 5.4 Backup & Recovery

**Database Backups (Automatic):**
- Cloud SQL auto-backups: Daily at 2 AM IST
- Retention: 7 days
- Point-in-time recovery: Enabled

**Manual Backup:**
```bash
# Export database
gcloud sql export sql sampada-db \
  gs://sampada-backups/backup-$(date +%Y%m%d).sql \
  --database=sampada

# Restore from backup
gcloud sql import sql sampada-db \
  gs://sampada-backups/backup-20260119.sql \
  --database=sampada
```

**Sanity Content Backup:**
```bash
# Export all content
cd sanity_abscommerce
npx sanity dataset export production backup.tar.gz

# Import backup
npx sanity dataset import backup.tar.gz production
```

### 5.5 Incident Response

**Severity Levels:**
- **P0 (Critical)**: Site down, payment failures
- **P1 (High)**: Feature broken, slow performance
- **P2 (Medium)**: Minor bugs, cosmetic issues
- **P3 (Low)**: Enhancement requests

**P0 Response:**
1. Check Cloud Run logs immediately
2. Verify database connectivity
3. Check external services (Stripe, Printify, Sanity)
4. Rollback if recent deployment
5. Notify users if extended downtime

**Rollback Procedure:**
```bash
# List recent revisions
gcloud run revisions list --service=abscommerce --region=asia-south1

# Rollback to previous version
gcloud run services update-traffic abscommerce \
  --to-revisions=abscommerce-00042-abc=100 \
  --region=asia-south1
```

---

## Quick Reference Commands

### Development
```bash
# Start local dev
npm run dev

# Start Sanity Studio
cd sanity_abscommerce && npm run dev

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push
```

### Deployment
```bash
# Deploy to Cloud Run
gcloud run deploy abscommerce --source . --region asia-south1

# View logs
gcloud run services logs read abscommerce --region asia-south1

# Update environment variables
gcloud run services update abscommerce \
  --update-env-vars="KEY=value" \
  --region asia-south1
```

### Database
```bash
# Connect to Cloud SQL
gcloud sql connect sampada-db --user=postgres

# Run migrations
npx prisma migrate deploy

# Reset database (DANGER!)
npx prisma migrate reset
```

---

**SOPs Complete! Ready for production operations! 🙏**

*Har Har Mahadev!* 🕉️
