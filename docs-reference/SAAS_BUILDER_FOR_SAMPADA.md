# SaaS Builder Power - Application to Sampada E-Commerce Platform

## Overview

The **saas-builder** power provides patterns for building production-ready multi-tenant SaaS applications with serverless architecture. While Sampada is currently an e-commerce platform, it has significant SaaS characteristics through its **Designer Pro/Ultra subscription tiers**. This document explains how saas-builder patterns can enhance Sampada's architecture.

---

## Current Sampada Architecture vs SaaS Builder Patterns

### What Sampada Already Has ✅

1. **Multi-Tier Subscriptions**
   - Free, Pro ($30/month), Ultra ($300/month) designer tiers
   - Tier-based feature gating (AI tools, design limits, custom branding)
   - Stripe integration for subscription management

2. **User Isolation**
   - `DesignUser` model with per-user designs and orders
   - User-scoped queries in API routes
   - NextAuth session management

3. **Usage Tracking**
   - `designsCreatedThisMonth` counter
   - `DesignUsageLog` for action tracking
   - Design limits per tier (2 free, 50 pro, unlimited ultra)

4. **Billing Integration**
   - Stripe checkout sessions
   - Separate designer customer IDs (`stripeDesignerId`)
   - Subscription status tracking

### What SaaS Builder Can Improve 🚀

---

## 1. Enhanced Multi-Tenancy Architecture

### Current State
Sampada uses user-level isolation but lacks true tenant-level architecture. Each user is treated individually rather than as part of a tenant organization.

### SaaS Builder Pattern
```
Tenant → Multiple Users → Shared Resources
```

### Recommended Implementation

**Add Tenant Model:**
```prisma
model Tenant {
  id                    String    @id @default(cuid())
  name                  String    // "Acme Corp Design Team"
  slug                  String    @unique // "acme-corp"
  
  // Subscription (tenant-level, not user-level)
  tier                  String    @default("free")
  stripeCustomerId      String?   @unique
  subscriptionStatus    String?
  periodEnd             DateTime?
  
  // Tenant-level quotas
  designLimit           Int?
  userLimit             Int?      // Max users per tenant
  storageLimit          Int?      // GB of storage
  
  // Feature flags (tenant-level)
  features              Json      @default("{}")
  
  // Relations
  users                 TenantUser[]
  designs               CustomDesign[]
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model TenantUser {
  id                    String    @id @default(cuid())
  tenantId              String
  tenant                Tenant    @relation(fields: [tenantId], references: [id])
  
  userId                String    // Links to DesignUser
  role                  String    // 'owner' | 'admin' | 'designer' | 'viewer'
  
  @@unique([tenantId, userId])
}
```

**Benefits:**
- Teams can share design libraries and templates
- One subscription covers multiple team members
- Tenant-level billing (not per-user)
- Enterprise customers can have isolated workspaces

---

## 2. Proper Money Handling (Critical!)

### Current Issue ⚠️
```typescript
// In CustomOrder model
totalAmount Float? // ❌ DANGEROUS - floats for money!
```

### SaaS Builder Rule
**NEVER use floats for money. Always use integer cents.**

### Recommended Fix

**Update Schema:**
```prisma
model CustomOrder {
  // ❌ Remove this
  // totalAmount Float?
  
  // ✅ Add these
  amountCents           Int       // 3000 = $30.00
  currency              String    @default("USD")
  
  // Already correct!
  priceInCents          Int       // ✅ Good!
}
```

**Update API Code:**
```typescript
// ❌ BAD
const total = price * quantity; // Float math
const amount = parseFloat(total.toFixed(2)); // Rounding errors!

// ✅ GOOD
const amountCents = priceInCents * quantity; // Integer math only
const displayAmount = (amountCents / 100).toFixed(2); // Convert only for display
```

**Why This Matters:**
- Prevents rounding errors in financial calculations
- Ensures accurate tax calculations
- Complies with payment processor requirements
- Avoids legal issues with incorrect charges

---

## 3. Serverless Architecture Migration

### Current State
Sampada runs on a traditional Next.js server (`server.js`) with PostgreSQL.

### SaaS Builder Pattern
Serverless-first: AWS Lambda + API Gateway + DynamoDB

### Hybrid Approach for Sampada

**Keep:**
- Next.js frontend (deploy to Vercel)
- PostgreSQL for relational data (products, orders)
- Sanity CMS for content

**Migrate to Serverless:**
- AI image generation → Lambda function
- Design export → Lambda function
- Usage metering → EventBridge + Lambda
- Webhook processing → Lambda functions

**Benefits:**
- Zero cost when idle
- Auto-scaling for traffic spikes
- Pay-per-use pricing
- Better separation of concerns

**Example: AI Image Generation as Lambda**
```typescript
// Current: app/api/ai/generate-image/route.ts (runs on server)
// Proposed: AWS Lambda function

export const handler = async (event) => {
  const { tenantId, userId } = event.requestContext.authorizer; // From JWT
  
  // Check tenant quota
  const usage = await checkTenantUsage(tenantId, 'ai_image_generation');
  if (usage.exceeded) {
    return { statusCode: 429, body: 'Quota exceeded' };
  }
  
  // Generate image
  const result = await generateImage(event.body);
  
  // Track usage
  await trackUsage(tenantId, userId, 'ai_image_generation', 1);
  
  return { statusCode: 200, body: JSON.stringify(result) };
};
```

---

## 4. JWT-Based Authentication with Tenant Context

### Current State
NextAuth sessions with user ID and email.

### SaaS Builder Pattern
JWT tokens with embedded tenant ID and user roles.

### Recommended Implementation

**Lambda Authorizer Pattern:**
```typescript
// Lambda authorizer validates JWT and injects context
export const handler = async (event) => {
  const token = event.headers.Authorization;
  
  // Verify JWT
  const decoded = verifyJWT(token);
  
  // Return context for downstream functions
  return {
    principalId: decoded.userId,
    context: {
      tenantId: decoded.tenantId,
      userId: decoded.userId,
      roles: decoded.roles.join(','), // 'owner,admin'
      tier: decoded.tier, // 'pro' | 'ultra'
    },
  };
};
```

**API Function Pattern:**
```typescript
export async function POST(req: NextRequest) {
  // Extract tenant context (injected by authorizer)
  const tenantId = req.headers.get('x-tenant-id');
  const userRoles = req.headers.get('x-user-roles')?.split(',');
  
  // Check permissions
  if (!userRoles?.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // All queries scoped to tenant
  const designs = await db.customDesign.findMany({
    where: { tenantId }, // ✅ Tenant isolation
  });
  
  return NextResponse.json(designs);
}
```

**Benefits:**
- Automatic tenant isolation
- Role-based access control (RBAC)
- No need to query user roles on every request
- Prevents cross-tenant data leakage

---

## 5. Usage-Based Billing & Metering

### Current State
Simple monthly subscriptions with design count limits.

### SaaS Builder Pattern
Track billable events in real-time, charge based on actual usage.

### Recommended Implementation

**Billable Events for Sampada:**
- AI image generations (expensive!)
- AI design suggestions
- Design exports (high-res)
- Storage used (GB)
- Custom orders placed

**EventBridge Pattern:**
```typescript
// Publish usage event
await eventBridge.putEvents({
  Entries: [{
    Source: 'sampada.designer',
    DetailType: 'UsageEvent',
    Detail: JSON.stringify({
      tenantId: 'tenant_123',
      userId: 'user_456',
      eventType: 'ai_image_generation',
      quantity: 1,
      metadata: { model: 'gemini-pro', resolution: '1024x1024' },
      timestamp: new Date().toISOString(),
    }),
  }],
});
```

**Aggregate and Bill:**
```typescript
// Lambda triggered at end of billing period
export const handler = async (event) => {
  const tenants = await getAllActiveTenants();
  
  for (const tenant of tenants) {
    const usage = await aggregateUsage(tenant.id, billingPeriod);
    
    // Calculate charges
    const charges = {
      baseSubscription: tenant.tier === 'pro' ? 3000 : 30000, // cents
      aiGenerations: usage.aiGenerations * 10, // $0.10 per generation
      storage: Math.max(0, usage.storageGB - 10) * 50, // $0.50/GB over 10GB
    };
    
    const totalCents = Object.values(charges).reduce((a, b) => a + b, 0);
    
    // Charge via Stripe
    await stripe.invoiceItems.create({
      customer: tenant.stripeCustomerId,
      amount: totalCents,
      currency: 'usd',
      description: `Usage for ${billingPeriod}`,
    });
  }
};
```

**Benefits:**
- Fair pricing (pay for what you use)
- Higher revenue from power users
- Lower barrier to entry (free tier with usage limits)
- Transparent billing

---

## 6. Database Key Prefixing for Tenant Isolation

### Current State
User-scoped queries with `WHERE userId = ?`

### SaaS Builder Pattern
Prefix all database keys with tenant ID.

### Recommended for DynamoDB (if migrating)

```typescript
// Composite key pattern
const design = {
  pk: `${tenantId}#DESIGN#${designId}`, // Primary key
  sk: 'metadata', // Sort key
  tenantId,
  designId,
  name: 'My Design',
  // ... other fields
};

// Query all designs for tenant
const designs = await dynamodb.query({
  KeyConditionExpression: 'pk = :pk',
  ExpressionAttributeValues: {
    ':pk': `${tenantId}#DESIGN`,
  },
});
```

### For PostgreSQL (current setup)

**Add tenant_id to all tables:**
```prisma
model CustomDesign {
  id                    String    @id @default(cuid())
  tenantId              String    // ✅ Add this
  userId                String
  // ... rest of fields
  
  @@index([tenantId]) // ✅ Index for fast queries
  @@index([tenantId, userId]) // ✅ Composite index
}
```

**Always query with tenant context:**
```typescript
// ❌ BAD - could leak data
const designs = await db.customDesign.findMany({
  where: { userId },
});

// ✅ GOOD - tenant-scoped
const designs = await db.customDesign.findMany({
  where: { 
    tenantId, // From JWT
    userId,
  },
});
```

---

## 7. Webhook Security & Idempotency

### Current State
Basic Stripe webhook handling.

### SaaS Builder Pattern
Verify signatures, handle retries, ensure idempotency.

### Recommended Implementation

```typescript
// app/api/subscriptions/designer/webhook/route.ts
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  
  // ✅ Verify webhook signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_DESIGNER_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // ✅ Store raw webhook for debugging
  await db.webhookLog.create({
    data: {
      provider: 'stripe',
      eventType: event.type,
      payload: event,
      receivedAt: new Date(),
    },
  });
  
  // ✅ Idempotency check
  const existing = await db.webhookProcessed.findUnique({
    where: { eventId: event.id },
  });
  
  if (existing) {
    console.log('✅ Webhook already processed:', event.id);
    return NextResponse.json({ received: true });
  }
  
  // Process webhook
  try {
    await processWebhook(event);
    
    // ✅ Mark as processed
    await db.webhookProcessed.create({
      data: { eventId: event.id, processedAt: new Date() },
    });
  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
  
  return NextResponse.json({ received: true });
}
```

**Add Models:**
```prisma
model WebhookLog {
  id                    String    @id @default(cuid())
  provider              String    // 'stripe' | 'printify'
  eventType             String
  payload               Json
  receivedAt            DateTime  @default(now())
}

model WebhookProcessed {
  eventId               String    @id // Stripe event ID
  processedAt           DateTime  @default(now())
}
```

---

## 8. Cost-Per-Tenant Monitoring

### SaaS Builder Pattern
Track infrastructure costs per tenant to optimize pricing.

### Recommended Implementation

**Track Resource Usage:**
```prisma
model TenantUsage {
  id                    String    @id @default(cuid())
  tenantId              String
  month                 String    // '2026-02'
  
  // Usage metrics
  apiCalls              Int       @default(0)
  aiGenerations         Int       @default(0)
  storageGB             Float     @default(0)
  bandwidthGB           Float     @default(0)
  
  // Cost estimates (cents)
  computeCostCents      Int       @default(0)
  storageCostCents      Int       @default(0)
  aiCostCents           Int       @default(0)
  totalCostCents        Int       @default(0)
  
  // Revenue
  revenueCents          Int       @default(0)
  
  createdAt             DateTime  @default(now())
  
  @@unique([tenantId, month])
  @@index([tenantId])
  @@index([month])
}
```

**Calculate Profitability:**
```typescript
const profitability = await db.tenantUsage.findMany({
  where: { month: '2026-02' },
  select: {
    tenantId: true,
    totalCostCents: true,
    revenueCents: true,
  },
});

const analysis = profitability.map(t => ({
  tenantId: t.tenantId,
  profit: t.revenueCents - t.totalCostCents,
  margin: ((t.revenueCents - t.totalCostCents) / t.revenueCents) * 100,
}));

// Identify unprofitable tenants
const losers = analysis.filter(t => t.profit < 0);
```

---

## 9. Feature Flags & Gradual Rollout

### Current State
Simple JSON feature flags in `DesignUser.features`.

### SaaS Builder Pattern
Tenant-level feature flags with gradual rollout.

### Recommended Implementation

```prisma
model FeatureFlag {
  id                    String    @id @default(cuid())
  name                  String    @unique // 'ai_image_gen_v2'
  description           String?
  
  // Rollout strategy
  enabled               Boolean   @default(false)
  rolloutPercent        Int       @default(0) // 0-100
  
  // Tier restrictions
  minTier               String?   // 'pro' | 'ultra'
  
  // Tenant overrides
  enabledTenants        String[]  @default([]) // Explicit enable
  disabledTenants       String[]  @default([]) // Explicit disable
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

**Check Feature Access:**
```typescript
async function hasFeature(tenantId: string, featureName: string): Promise<boolean> {
  const flag = await db.featureFlag.findUnique({
    where: { name: featureName },
  });
  
  if (!flag || !flag.enabled) return false;
  
  // Explicit overrides
  if (flag.disabledTenants.includes(tenantId)) return false;
  if (flag.enabledTenants.includes(tenantId)) return true;
  
  // Tier check
  const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
  if (flag.minTier && !meetsMinTier(tenant.tier, flag.minTier)) {
    return false;
  }
  
  // Gradual rollout (deterministic based on tenant ID)
  const hash = hashString(tenantId);
  const bucket = hash % 100;
  return bucket < flag.rolloutPercent;
}
```

---

## 10. Security Best Practices

### SaaS Builder Recommendations

**1. Never Trust Client Input**
```typescript
// ❌ BAD - tenant ID from request body
const { tenantId, designId } = await req.json();
const design = await db.customDesign.findUnique({ where: { id: designId } });

// ✅ GOOD - tenant ID from JWT
const tenantId = req.headers.get('x-tenant-id'); // From authorizer
const { designId } = await req.json();
const design = await db.customDesign.findUnique({
  where: { 
    id: designId,
    tenantId, // ✅ Verify ownership
  },
});
```

**2. Rate Limiting Per Tenant**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    const tier = req.headers.get('x-tenant-tier');
    return tier === 'ultra' ? 1000 : tier === 'pro' ? 100 : 10;
  },
  keyGenerator: (req) => req.headers.get('x-tenant-id'), // Per tenant
});
```

**3. Audit Logging**
```prisma
model AuditLog {
  id                    String    @id @default(cuid())
  tenantId              String
  userId                String
  action                String    // 'design.created' | 'user.invited'
  resourceType          String
  resourceId            String
  metadata              Json?
  ipAddress             String?
  userAgent             String?
  timestamp             DateTime  @default(now())
  
  @@index([tenantId])
  @@index([userId])
  @@index([timestamp])
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (2-3 weeks)
1. ✅ Fix money handling (remove Float, use Int cents)
2. ✅ Add webhook logging and idempotency
3. ✅ Implement proper error handling in webhooks
4. ✅ Add audit logging for financial operations

### Phase 2: Multi-Tenancy (3-4 weeks)
1. Add Tenant model and TenantUser junction table
2. Migrate existing DesignUsers to single-user tenants
3. Update all API routes to use tenant context
4. Add tenant-level subscription management
5. Implement team invitations and role management

### Phase 3: Usage-Based Billing (2-3 weeks)
1. Implement usage event tracking
2. Set up EventBridge for usage aggregation
3. Create billing Lambda functions
4. Add usage dashboards for customers
5. Implement quota enforcement

### Phase 4: Serverless Migration (4-6 weeks)
1. Move AI endpoints to Lambda functions
2. Implement Lambda authorizer with JWT
3. Set up API Gateway
4. Migrate webhook handlers to Lambda
5. Add CloudWatch monitoring

### Phase 5: Advanced Features (ongoing)
1. Feature flag system with gradual rollout
2. Cost-per-tenant monitoring
3. Advanced RBAC with custom permissions
4. Multi-region support
5. Enterprise SSO integration

---

## Quick Wins (Implement Today!)

### 1. Fix Money Handling
```bash
# Update schema
npx prisma migrate dev --name fix-money-handling
```

### 2. Add Webhook Logging
```typescript
// Takes 30 minutes, prevents debugging nightmares
```

### 3. Add Tenant Context Header
```typescript
// Middleware to extract tenant from session
export function middleware(req: NextRequest) {
  const session = await getServerSession();
  const tenantId = session?.user?.tenantId || session?.user?.id; // Fallback to userId
  
  req.headers.set('x-tenant-id', tenantId);
  req.headers.set('x-user-id', session?.user?.id);
  
  return NextResponse.next({ request: req });
}
```

---

## Conclusion

The **saas-builder** power provides battle-tested patterns for building scalable, profitable SaaS applications. Sampada already has many SaaS characteristics through its designer subscription tiers. By adopting these patterns incrementally, you can:

- **Increase revenue** through usage-based billing
- **Reduce costs** with serverless architecture
- **Improve security** with proper tenant isolation
- **Scale efficiently** to thousands of customers
- **Prevent bugs** with proper money handling

Start with the quick wins, then tackle multi-tenancy and usage-based billing. The serverless migration can wait until you have proven product-market fit and need to scale.

---

## Resources

- SaaS Builder Power: `C:\Users\Binod\.kiro\powers\installed\saas-builder\`
- Steering Files: Architecture, Billing, Implementation, Repository Structure
- MCP Servers: Stripe, AWS Serverless, DynamoDB (available in power)

**Next Steps:**
1. Review this document with your team
2. Prioritize which patterns to implement first
3. Start with Phase 1 (Foundation) - critical bug fixes
4. Gradually adopt multi-tenancy and usage-based billing
5. Use saas-builder MCP tools for AWS deployment when ready
