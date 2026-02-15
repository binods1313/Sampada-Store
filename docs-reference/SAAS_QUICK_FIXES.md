# SaaS Builder Quick Fixes - Immediate Action Items

## Critical Issues to Fix Today 🚨

### 1. Money Handling Bug (30 minutes)

**Problem:** Using `Float` for money causes rounding errors and financial inaccuracies.

**Location:** `abscommerce/prisma/schema.prisma`

**Fix:**
```prisma
model CustomOrder {
  // ❌ REMOVE THIS LINE
  // totalAmount Float?
  
  // ✅ ADD THESE LINES
  totalAmountCents      Int       // Store as integer cents
  currency              String    @default("USD")
  
  // Already correct!
  priceInCents          Int       // ✅ Keep this
}
```

**Run Migration:**
```bash
cd abscommerce
npx prisma migrate dev --name fix-money-handling
```

**Update API Code:**
```typescript
// In any file that calculates money
// ❌ BAD
const total = price * quantity;
const amount = parseFloat(total.toFixed(2));

// ✅ GOOD
const totalAmountCents = priceInCents * quantity;
const displayAmount = (totalAmountCents / 100).toFixed(2);
```

---

### 2. Webhook Idempotency (1 hour)

**Problem:** Stripe webhooks can be delivered multiple times, causing duplicate charges or status updates.

**Add Models:**
```prisma
model WebhookLog {
  id                    String    @id @default(cuid())
  provider              String    // 'stripe' | 'printify'
  eventType             String
  eventId               String    @unique
  payload               Json
  processed             Boolean   @default(false)
  processedAt           DateTime?
  receivedAt            DateTime  @default(now())
  
  @@index([provider])
  @@index([eventType])
  @@index([processed])
}
```

**Update Webhook Handler:**
```typescript
// app/api/subscriptions/designer/webhook/route.ts
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  
  // Verify signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_DESIGNER_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // ✅ Check if already processed
  const existing = await db.webhookLog.findUnique({
    where: { eventId: event.id },
  });
  
  if (existing?.processed) {
    console.log('✅ Webhook already processed:', event.id);
    return NextResponse.json({ received: true });
  }
  
  // ✅ Log webhook
  await db.webhookLog.create({
    data: {
      provider: 'stripe',
      eventType: event.type,
      eventId: event.id,
      payload: event,
    },
  });
  
  // Process webhook
  try {
    await processWebhookEvent(event);
    
    // ✅ Mark as processed
    await db.webhookLog.update({
      where: { eventId: event.id },
      data: { processed: true, processedAt: new Date() },
    });
  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
  
  return NextResponse.json({ received: true });
}
```

---

### 3. Tenant Context Middleware (30 minutes)

**Problem:** Tenant ID should come from JWT/session, not request body.

**Create Middleware:**
```typescript
// middleware.ts (root of abscommerce/)
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Skip for public routes
  if (req.nextUrl.pathname.startsWith('/api/health')) {
    return NextResponse.next();
  }
  
  // Get session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Inject tenant context into headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-id', token.sub || token.id); // User ID as tenant for now
  requestHeaders.set('x-user-id', token.sub || token.id);
  requestHeaders.set('x-user-email', token.email);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/designs/:path*', '/api/subscriptions/:path*', '/api/user/:path*'],
};
```

**Use in API Routes:**
```typescript
export async function POST(req: NextRequest) {
  // ✅ Get tenant from header (injected by middleware)
  const tenantId = req.headers.get('x-tenant-id');
  const userId = req.headers.get('x-user-id');
  
  // ❌ NEVER accept tenant from body
  // const { tenantId } = await req.json(); // DANGEROUS!
  
  // All queries scoped to tenant
  const designs = await db.customDesign.findMany({
    where: { userId: tenantId }, // For now, userId = tenantId
  });
  
  return NextResponse.json(designs);
}
```

---

### 4. Audit Logging for Financial Operations (1 hour)

**Add Model:**
```prisma
model AuditLog {
  id                    String    @id @default(cuid())
  userId                String
  action                String    // 'subscription.created' | 'payment.succeeded'
  resourceType          String    // 'subscription' | 'payment'
  resourceId            String
  metadata              Json?
  ipAddress             String?
  userAgent             String?
  timestamp             DateTime  @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([timestamp])
}
```

**Log Critical Actions:**
```typescript
async function logAudit(data: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: any;
  req?: NextRequest;
}) {
  await db.auditLog.create({
    data: {
      ...data,
      ipAddress: data.req?.headers.get('x-forwarded-for') || data.req?.ip,
      userAgent: data.req?.headers.get('user-agent'),
    },
  });
}

// Use in subscription creation
await logAudit({
  userId: designUser.id,
  action: 'subscription.created',
  resourceType: 'subscription',
  resourceId: checkoutSession.id,
  metadata: { plan, priceId: priceIds[plan] },
  req,
});
```

---

### 5. Rate Limiting Per User (30 minutes)

**Install Package:**
```bash
npm install express-rate-limit
```

**Create Rate Limiter:**
```typescript
// lib/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: async (req) => {
    const tier = req.headers.get('x-user-tier');
    // Adjust limits based on tier
    if (tier === 'ultra') return 1000;
    if (tier === 'pro') return 100;
    return 20; // Free tier
  },
  keyGenerator: (req) => req.headers.get('x-user-id') || req.ip,
  message: { error: 'Too many requests, please upgrade your plan' },
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: async (req) => {
    const tier = req.headers.get('x-user-tier');
    if (tier === 'ultra') return 1000;
    if (tier === 'pro') return 50;
    return 5; // Free tier
  },
  keyGenerator: (req) => req.headers.get('x-user-id') || req.ip,
  message: { error: 'AI quota exceeded, please upgrade' },
});
```

**Apply to Routes:**
```typescript
// app/api/ai/generate-image/route.ts
import { aiLimiter } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  // Apply rate limit
  await aiLimiter(req);
  
  // ... rest of handler
}
```

---

## Migration Commands

```bash
# 1. Add new models
cd abscommerce
npx prisma migrate dev --name add-webhook-logging-and-audit

# 2. Generate Prisma client
npx prisma generate

# 3. Test changes
npm run dev

# 4. Verify database
npx prisma studio
```

---

## Testing Checklist

### Money Handling
- [ ] Create test order with quantity > 1
- [ ] Verify totalAmountCents = priceInCents * quantity
- [ ] Check no rounding errors in calculations
- [ ] Verify Stripe charges match database amounts

### Webhook Idempotency
- [ ] Send same webhook twice (use Stripe CLI)
- [ ] Verify only processed once
- [ ] Check WebhookLog table has entry
- [ ] Verify no duplicate subscription updates

### Tenant Context
- [ ] Make API request without auth → 401
- [ ] Make API request with auth → headers injected
- [ ] Verify x-tenant-id header present
- [ ] Check queries scoped to tenant

### Audit Logging
- [ ] Create subscription → check AuditLog
- [ ] Cancel subscription → check AuditLog
- [ ] Verify metadata captured correctly
- [ ] Check IP address and user agent logged

### Rate Limiting
- [ ] Make 21 requests as free user → 429 error
- [ ] Make 101 requests as pro user → 429 error
- [ ] Verify ultra users have higher limits
- [ ] Check error message suggests upgrade

---

## Rollback Plan

If something breaks:

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Or reset database (DEVELOPMENT ONLY!)
npx prisma migrate reset
```

---

## Next Steps After Quick Fixes

1. **Review SAAS_BUILDER_FOR_SAMPADA.md** for long-term improvements
2. **Implement multi-tenancy** (Phase 2) for team features
3. **Add usage-based billing** (Phase 3) for AI operations
4. **Consider serverless migration** (Phase 4) for scale

---

## Questions?

- Review saas-builder power: `C:\Users\Binod\.kiro\powers\installed\saas-builder\`
- Read steering files for detailed patterns
- Check MCP servers for Stripe integration tools
