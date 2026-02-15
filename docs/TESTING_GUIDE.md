# 🧪 Testing Guide - STUDIO_FINAL Implementation

*Om Namah Sivaya* 🙏

## Overview
Complete testing procedures for the Billionaire Protocol implementation.

---

## Pre-Testing Checklist

✅ **Environment Setup:**
- [ ] Prisma Client generated successfully
- [ ] Database schema updated (ProductCache, SearchLog, PersonalizedContent tables exist)
- [ ] Google Cloud SQL connection working
- [ ] Environment variables configured (.env.local)
- [ ] GOOGLE_AI_API_KEY set

✅ **Dependencies:**
- [ ] All npm packages installed
- [ ] No TypeScript errors in IDE
- [ ] Sanity Studio accessible

---

## Phase 1: Local Development Testing

### 1.1 Start Development Server

```powershell
# Terminal 1: Start Next.js
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce
npm run dev

# Terminal 2: Start Sanity Studio (optional)
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\sanity_abscommerce
npm run dev

# Terminal 3: Open Prisma Studio
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce
npx prisma studio
```

**Expected Results:**
- Next.js: http://localhost:3000
- Sanity Studio: http://localhost:3333
- Prisma Studio: http://localhost:5555

### 1.2 Verify Database Connection

**In Prisma Studio:**
1. Check tables exist:
   - ✅ DesignUser
   - ✅ CustomDesign
   - ✅ CustomOrder (with new fields: sanityProductId, paymentStatus, totalAmount)
   - ✅ ProductCache (NEW)
   - ✅ SearchLog (NEW)
   - ✅ PersonalizedContent (NEW)

2. Verify CustomOrder schema:
   - Click on CustomOrder table
   - Check columns include: `sanityProductId`, `paymentStatus`, `totalAmount`

**Pass Criteria:** All 6 tables visible, CustomOrder has new fields

---

## Phase 2: Integration Layer Testing

### 2.1 Test Unified Data Layer

**Create test file: `tests/unifiedData.test.ts`**
```typescript
import { getProductWithOrders, getAllProductsWithInventory } from '@/lib/unifiedData';

async function testUnifiedData() {
  console.log('Testing Unified Data Layer...\n');
  
  // Test 1: Get all products with inventory
  try {
    const products = await getAllProductsWithInventory();
    console.log('✅ getAllProductsWithInventory:', products.length, 'products');
  } catch (error) {
    console.error('❌ getAllProductsWithInventory failed:', error);
  }
  
  // Test 2: Get specific product with orders (if you have a product slug)
  try {
    const product = await getProductWithOrders('test-product-slug');
    console.log('✅ getProductWithOrders:', product ? 'Success' : 'No product found');
  } catch (error) {
    console.error('❌ getProductWithOrders failed:', error);
  }
}

testUnifiedData();
```

**Run test:**
```powershell
npx ts-node tests/unifiedData.test.ts
```

**Pass Criteria:**
- No import errors
- Functions execute without crashing
- Data returned from both Sanity and Prisma

### 2.2 Test Webhook Endpoint

**Test webhook manually:**
```powershell
# Send test webhook
curl -X POST http://localhost:3000/api/webhooks/sanity `
  -H "Content-Type: application/json" `
  -d '{\"_type\":\"product\",\"_id\":\"test123\",\"name\":\"Test Product\",\"price\":100,\"status\":\"active\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

**Verify in Prisma Studio:**
- Check ProductCache table
- Should have new entry with sanityId="test123"

**Pass Criteria:** ProductCache updated with test product

---

## Phase 3: AI Services Testing

### 3.1 Test AI Virtual Stylist

**Create test file: `tests/aiStylist.test.ts`**
```typescript
import { generateStylingTips } from '@/services/ai/stylist';

async function testStylist() {
  console.log('Testing AI Virtual Stylist...\n');
  
  // You'll need a real product ID from Sanity
  const productId = 'YOUR_PRODUCT_ID_HERE';
  
  try {
    const tips = await generateStylingTips(productId);
    console.log('✅ Styling tips generated:');
    tips.forEach((tip, i) => console.log(`  ${i + 1}. ${tip}`));
  } catch (error) {
    console.error('❌ Styling tips generation failed:', error);
  }
}

testStylist();
```

**Run test:**
```powershell
npx ts-node tests/aiStylist.test.ts
```

**Pass Criteria:**
- 3 styling tips generated
- Tips saved to Sanity product
- No API errors

### 3.2 Test AI Personalization

**Create test file: `tests/aiPersonalization.test.ts`**
```typescript
import { generatePersonalizedCopy } from '@/services/ai/personalization';

async function testPersonalization() {
  console.log('Testing AI Personalization Engine...\n');
  
  const productId = 'YOUR_PRODUCT_ID';
  const userId = 'YOUR_USER_ID';
  
  try {
    const tagline = await generatePersonalizedCopy(productId, userId);
    console.log('✅ Personalized tagline:', tagline);
  } catch (error) {
    console.error('❌ Personalization failed:', error);
  }
}

testPersonalization();
```

**Pass Criteria:**
- Personalized tagline generated
- Cached in PersonalizedContent table
- Tagline relevant to user's history

### 3.3 Test Dynamic Collections

**Create test file: `tests/aiCollections.test.ts`**
```typescript
import { generateDynamicCollections } from '@/services/ai/dynamicCollections';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDynamicCollections() {
  console.log('Testing AI Dynamic Collections...\n');
  
  // First, add some test search logs
  await prisma.searchLog.createMany({
    data: [
      { query: 'bohemian dress' },
      { query: 'silk tunic' },
      { query: 'ethnic wear' },
      { query: 'traditional clothing' },
      { query: 'bohemian style' },
    ]
  });
  
  try {
    const collectionIds = await generateDynamicCollections();
    console.log('✅ Collections created:', collectionIds.length);
    console.log('Collection IDs:', collectionIds);
  } catch (error) {
    console.error('❌ Dynamic collections failed:', error);
  }
}

testDynamicCollections();
```

**Pass Criteria:**
- 3 collections created in Sanity
- Collections based on search trends
- Products grouped logically

---

## Phase 4: Admin Dashboard Testing

### 4.1 Access Dashboard

**Navigate to:**
```
http://localhost:3000/admin/dashboard
```

**Visual Checks:**
- [ ] Page loads without errors
- [ ] All metric cards display
- [ ] Revenue shows (may be 0 if no orders)
- [ ] Product count shows
- [ ] Recent orders table renders
- [ ] Low stock alerts section visible
- [ ] AI insights section displays

### 4.2 Verify Data Sources

**Check dashboard fetches from:**
1. **Prisma** (orders, revenue, users)
   - Open browser DevTools → Network tab
   - Look for API calls to database

2. **Sanity** (products, inventory)
   - Should see Sanity API calls
   - Product count should match Sanity Studio

**Pass Criteria:**
- Dashboard loads in < 2 seconds
- All sections render
- Data from both Prisma and Sanity displayed

---

## Phase 5: End-to-End Workflow Testing

### 5.1 Product Addition Workflow

**Steps:**
1. Open Sanity Studio (http://localhost:3333)
2. Create new product:
   - Name: "Test Bohemian Tunic"
   - Price: 2499
   - Status: Active
   - Add 1 image
3. Publish product
4. Check webhook fired (Terminal logs)
5. Verify in Prisma Studio → ProductCache
6. Check product appears on website

**Pass Criteria:**
- Product created in Sanity
- Webhook processed successfully
- ProductCache updated
- Product visible on frontend

### 5.2 AI Enhancement Workflow

**Steps:**
1. Get product ID from Sanity
2. Run styling tips generator:
   ```powershell
   node -e "require('./services/ai/stylist').generateStylingTips('PRODUCT_ID').then(console.log)"
   ```
3. Check Sanity Studio → Product → stylingTips field
4. Verify tips appear on product page

**Pass Criteria:**
- 3 styling tips generated
- Tips saved to Sanity
- Tips display on frontend

---

## Phase 6: Performance Testing

### 6.1 Load Time Testing

**Test homepage:**
```powershell
# Using curl to measure response time
Measure-Command { curl http://localhost:3000 }
```

**Expected:** < 500ms

**Test admin dashboard:**
```powershell
Measure-Command { curl http://localhost:3000/admin/dashboard }
```

**Expected:** < 1500ms (fetches from 2 data sources)

### 6.2 Database Query Performance

**In Prisma Studio:**
1. Click on ProductCache
2. Note load time
3. Should be < 100ms for < 1000 products

**Test complex query:**
```typescript
// In Node console
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.time('Complex Query');
await prisma.customOrder.findMany({
  include: {
    user: true,
    design: true
  },
  where: {
    paymentStatus: 'completed'
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10
});
console.timeEnd('Complex Query');
```

**Expected:** < 200ms

---

## Phase 7: Error Handling Testing

### 7.1 Test Invalid Webhook

```powershell
# Send malformed webhook
curl -X POST http://localhost:3000/api/webhooks/sanity `
  -H "Content-Type: application/json" `
  -d '{\"invalid\":\"data\"}'
```

**Expected:**
- Returns 500 error
- Error logged
- No crash

### 7.2 Test AI Service Failure

**Temporarily set invalid API key:**
```powershell
$env:GOOGLE_AI_API_KEY="invalid_key"
npm run dev
```

**Run AI service:**
```powershell
node -e "require('./services/ai/stylist').generateStylingTips('test').catch(console.error)"
```

**Expected:**
- Graceful error handling
- Error logged
- Returns empty array or null

---

## Phase 8: Security Testing

### 8.1 Test Webhook Authentication

**Without secret:**
```powershell
curl -X POST http://localhost:3000/api/webhooks/sanity `
  -H "Content-Type: application/json" `
  -d '{\"_type\":\"product\"}'
```

**Expected:** Should process (warning logged if no secret configured)

### 8.2 Test SQL Injection Prevention

**Prisma automatically prevents SQL injection, but verify:**
```typescript
// This should be safe
await prisma.customOrder.findMany({
  where: {
    customerEmail: "'; DROP TABLE CustomOrder; --"
  }
});
```

**Expected:** No tables dropped, query returns empty result

---

## Phase 9: Production Readiness Checklist

### 9.1 Environment Variables
- [ ] DATABASE_URL configured
- [ ] GOOGLE_AI_API_KEY set
- [ ] SANITY_WEBHOOK_SECRET set
- [ ] NEXT_PUBLIC_SITE_URL correct
- [ ] All Stripe keys configured

### 9.2 Security
- [ ] Webhook signature verification implemented
- [ ] API routes protected
- [ ] Environment secrets not in code
- [ ] CORS configured correctly

### 9.3 Performance
- [ ] Database indexes created
- [ ] Images optimized
- [ ] Caching implemented
- [ ] No console.logs in production code

### 9.4 Monitoring
- [ ] Error tracking configured
- [ ] Logging implemented
- [ ] Alerts set up
- [ ] Health check endpoint working

---

## Test Results Template

```markdown
## STUDIO_FINAL Test Results
**Date:** 2026-01-19
**Tester:** [Your Name]

### Phase 1: Local Development
- [ ] Dev server starts: ✅/❌
- [ ] Database connection: ✅/❌
- [ ] Prisma Studio access: ✅/❌

### Phase 2: Integration
- [ ] Unified data layer: ✅/❌
- [ ] Webhook endpoint: ✅/❌
- [ ] ProductCache sync: ✅/❌

### Phase 3: AI Services
- [ ] Styling tips generation: ✅/❌
- [ ] Personalization: ✅/❌
- [ ] Dynamic collections: ✅/❌

### Phase 4: Admin Dashboard
- [ ] Dashboard loads: ✅/❌
- [ ] Metrics display: ✅/❌
- [ ] Data from both sources: ✅/❌

### Phase 5: E2E Workflows
- [ ] Product addition: ✅/❌
- [ ] AI enhancement: ✅/❌

### Phase 6: Performance
- [ ] Homepage < 500ms: ✅/❌
- [ ] Dashboard < 1500ms: ✅/❌
- [ ] DB queries < 200ms: ✅/❌

### Issues Found:
1. [Issue description]
2. [Issue description]

### Overall Status: PASS / FAIL / PARTIAL
```

---

## Quick Test Commands

```powershell
# Start all services
npm run dev                    # Next.js
npx prisma studio             # Database UI

# Run tests
npx ts-node tests/unifiedData.test.ts
npx ts-node tests/aiStylist.test.ts
npx ts-node tests/aiPersonalization.test.ts

# Check database
npx prisma db pull            # Verify schema
npx prisma studio             # Visual inspection

# Test webhook
curl -X POST http://localhost:3000/api/webhooks/sanity -H "Content-Type: application/json" -d '{\"_type\":\"product\",\"_id\":\"test\"}'

# Performance test
Measure-Command { curl http://localhost:3000 }
```

---

**Ready to test! Let's verify everything works! 🧪**

*Har Har Mahadev!* 🕉️
