# 🚀 SAMPADA: GOOGLE CLOUD MIGRATION & "CREATE YOUR OWN T-SHIRT" FEATURE
## Non-Breaking Integration Guide for Existing E-Commerce Platform

---

## 📌 EXECUTIVE SUMMARY

We're migrating **Sampada** from Firebase to **Google Cloud Platform** while **preserving all existing functionality** (homepage, product listings, product detail pages, cart, checkout).

**New Feature:** "Create Your Own T-shirt" designer (separate module, optional for users)

**Migration Strategy:** 
- Keep existing Sanity CMS + product catalog intact
- Add new Google Cloud services **alongside** current stack
- Custom t-shirt designer = **optional add-on**, not required for core shopping
- Users can browse & buy pre-made products OR design custom ones

**Project ID:** `sampada-store-87848430`  
**Region:** `us-central1`  
**Database:** PostgreSQL v15 (Cloud SQL) - *For custom designs & subscriptions only*

---

## 🏗️ ARCHITECTURE: PARALLEL SYSTEMS

```
┌─────────────────────────────────────────────────────────────┐
│                   SAMPADA FRONTEND (Next.js)                 │
│                                                              │
│  ┌──────────────────────┬────────────────────────────────┐   │
│  │ EXISTING STORE       │ NEW: DESIGNER FEATURE         │   │
│  │ (Unmodified)         │ (Isolated Module)             │   │
│  │                      │                               │   │
│  │ • Homepage           │ • Design Canvas               │   │
│  │ • Product Listing    │ • AI Tools (Ultra)            │   │
│  │ • Product Details    │ • Export to Printify          │   │
│  │ • Cart               │ • Subscription Gating         │   │
│  │ • Checkout           │                               │   │
│  │ • Sanity CMS Sync    │                               │   │
│  └──────────────────────┴────────────────────────────────┘   │
│                                                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────────┐
        │                         │
   ┌────▼────────────┐    ┌──────▼──────────────┐
   │ EXISTING APIs   │    │ NEW: Cloud Run APIs │
   │                 │    │ (Designer Only)     │
   │ • Sanity        │    │ • /api/designs      │
   │ • Stripe        │    │ • /api/ai/*         │
   │ • Printify      │    │ • /api/export       │
   │ • Analytics     │    │ • /api/orders-custom│
   └────┬────────────┘    └──────┬──────────────┘
        │                        │
        └────────────┬───────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼──┐   ┌────▼──────┐   ┌─▼──────────┐
   │Sanity │   │Cloud SQL  │   │Cloud       │
   │(exists)   │PostgreSQL │   │Storage     │
   │        │   │(new)      │   │(new)       │
   └────────┘   └───────────┘   └────────────┘
```

---

## ⚠️ COMPATIBILITY MATRIX

| Component | Existing | Status | Impact |
|-----------|----------|--------|--------|
| Homepage | Yes | ✅ No changes | Zero impact |
| Product listings | Yes | ✅ No changes | Zero impact |
| Product detail page | Yes | ✅ No changes | Zero impact |
| Cart system | Yes | ✅ No changes | Zero impact |
| Checkout (Stripe) | Yes | ✅ No changes | Zero impact |
| Sanity CMS | Yes | ✅ No changes | Zero impact |
| Printify integration | Yes | ✅ Reused | Existing fulfillment works |
| Authentication | NextAuth/Supabase | ✅ Extended | Add design-specific auth |
| Cloud Functions | Existing | ✅ Parallel | New Cloud Run APIs added |
| Database | Firestore | ✅ Preserved | PostgreSQL for designer only |

**Bottom Line:** Existing store works 100% as-is. Designer is bolt-on feature.

---

## 📁 PROJECT STRUCTURE

Keep your existing structure, add new folder:

```
sampada/
├── app/
│   ├── page.tsx                    # EXISTING: Homepage
│   ├── products/
│   │   ├── page.tsx                # EXISTING: Product listing
│   │   └── [id]/
│   │       └── page.tsx            # EXISTING: Product detail
│   ├── cart/
│   │   └── page.tsx                # EXISTING: Cart & checkout
│   ├── api/
│   │   ├── products/               # EXISTING: Sanity sync
│   │   ├── stripe/                 # EXISTING: Payments
│   │   ├── printify/               # EXISTING: Fulfillment
│   │   │
│   │   └── designs/                # NEW: Custom designer
│   │       ├── route.ts            # CRUD operations
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       ├── export/
│   │       │   └── route.ts        # To Printify
│   │       └── share/
│   │           └── route.ts        # Share designs
│   │
│   ├── designer/                   # NEW: Designer page
│   │   ├── page.tsx                # Main canvas
│   │   ├── [id]/
│   │   │   └── page.tsx            # Edit existing
│   │   └── templates/
│   │       └── page.tsx            # Browse templates
│   │
│   └── subscription/               # NEW: Plans & billing
│       ├── page.tsx
│       └── checkout/
│           └── route.ts
│
├── components/
│   ├── (existing store components)
│   │
│   └── designer/                   # NEW: Designer components
│       ├── Canvas.tsx
│       ├── Toolbar.tsx
│       ├── LayerPanel.tsx
│       ├── PropertiesPanel.tsx
│       └── AIToolsPanel.tsx
│
├── lib/
│   ├── (existing: sanity.ts, stripe.ts, etc)
│   │
│   └── db.ts                       # NEW: Prisma client
│
├── prisma/                         # NEW: Database schema
│   ├── schema.prisma
│   └── migrations/
│
├── env.local                       # Add new vars
└── dockerfile                      # NEW: Cloud Run deployment
```

---

## 💾 DATABASE SCHEMA (Prisma) - DESIGNER ONLY

**Important:** This runs in parallel with existing Sanity/Firestore. Designer data isolated.

Create `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============ DESIGNER FEATURE (NEW) ============

model DesignUser {
  id                    String    @id @default(cuid())
  email                 String    @unique
  
  // Designer subscription (separate from store purchases)
  designerTier          String    @default("free") // 'free'|'pro'|'ultra'
  stripeDesignerId      String?   @unique // Separate Stripe customer
  designerSubStatus     String?
  designerPeriodEnd     DateTime?
  
  // Usage tracking (designer-specific)
  designsCreatedThisMonth Int     @default(0)
  designLimit           Int?      // 2 (free), 50 (pro), null (ultra)
  
  // Features
  features              Json      @default("{\"aiAssistant\": false, \"aiImageGen\": false, \"multiProductPreview\": false, \"customBranding\": false}")
  
  // Relations
  customDesigns         CustomDesign[]
  customOrders          CustomOrder[]
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([email])
}

model CustomDesign {
  id                    String    @id @default(cuid())
  userId                String
  user                  DesignUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name                  String
  description           String?
  
  // Canvas data
  canvasData            Json      // Fabric.js state
  thumbnail             String?   // Cloud Storage URL
  
  // Printify
  printifyProductId     String?
  
  // Status
  status                String    @default("draft") // 'draft'|'processing'|'live'|'archived'
  tier                  String    // 'free'|'pro'|'ultra' when created
  version               Int       @default(1)
  
  // AI tracking
  aiGeneratedElements   Json[]    @default([])
  
  // Relations
  customOrders          CustomOrder[]
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@index([status])
}

model CustomOrder {
  id                    String    @id @default(cuid())
  userId                String
  user                  DesignUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  customDesignId        String
  design                CustomDesign @relation(fields: [customDesignId], references: [id], onDelete: Restrict)
  
  // Printify (reusing existing integration)
  printifyOrderId       String?   @unique
  status                String    @default("pending") // 'pending'|'production'|'shipped'
  trackingNumber        String?
  
  // Shipping
  customerEmail         String
  customerName          String
  shippingAddress       Json
  
  // Order details
  variantId             String
  quantity              Int       @default(1)
  price                 Int       // In cents
  
  createdAt             DateTime  @default(now())

  @@index([userId])
  @@index([customDesignId])
}

model DesignTemplate {
  id                    String    @id @default(cuid())
  name                  String
  description           String?
  canvasData            Json
  thumbnail             String?
  category              String    // 'minimal'|'bohemian'|'sports'
  isPublic              Boolean   @default(false)
  createdAt             DateTime  @default(now())

  @@index([category])
}

model DesignUsageLog {
  id                    String    @id @default(cuid())
  userId                String
  action                String    // 'design_created'|'ai_used'|'export'
  tier                  String
  metadata              Json?
  timestamp             DateTime  @default(now())

  @@index([userId])
  @@index([action])
}
```

**Migration:**
```bash
npx prisma db push
npx prisma generate
```

---

## 🔐 AUTH: EXTEND EXISTING SETUP

Your store likely uses NextAuth or Supabase. Extend it for designer:

**`lib/db.ts`** - Prisma client:

```typescript
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
```

**`lib/auth.ts`** - Add to existing auth:

```typescript
import { getServerSession } from 'next-auth/next';
import db from './db';

/**
 * Get user's designer subscription status
 * Returns null if user not enrolled in designer feature
 */
export async function getDesignerUser(userId: string) {
  return await db.designUser.findUnique({
    where: { id: userId },
    select: {
      designerTier: true,
      designsCreatedThisMonth: true,
      designLimit: true,
      features: true,
    },
  });
}

/**
 * Check if user can create another design
 */
export async function canCreateDesign(userId: string): Promise<boolean> {
  const user = await getDesignerUser(userId);
  if (!user) return false; // Not enrolled
  
  if (user.designLimit === null) return true; // Ultra = unlimited
  return user.designsCreatedThisMonth < user.designLimit;
}

/**
 * Middleware: protect designer routes
 */
export async function requireDesignerAuth(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401 
    });
  }

  const designUser = await getDesignerUser(session.user.id);
  if (!designUser) {
    // User exists in store but not enrolled in designer
    // This is fine - they just can't use designer features
    return null;
  }

  return designUser;
}
```

---

## 📦 API ROUTES: ISOLATED ENDPOINTS

All new routes in `app/api/designs/` - existing endpoints untouched.

### Design CRUD

**`app/api/designs/route.ts`** - List & create:

```typescript
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireDesignerAuth, canCreateDesign } from '@/lib/auth';
import { storage } from '@/lib/gcs'; // Google Cloud Storage
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const designs = await db.customDesign.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      status: true,
      tier: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ designs });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const designUser = await requireDesignerAuth(req);
  if (!designUser) {
    return NextResponse.json(
      { error: 'You must subscribe to the designer feature' },
      { status: 403 }
    );
  }

  // Check limit
  const canCreate = await canCreateDesign(session.user.id);
  if (!canCreate) {
    return NextResponse.json(
      { error: 'Design limit reached. Upgrade your plan.' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { name, canvasData, thumbnail } = body;

  // Upload thumbnail to Cloud Storage
  let thumbnailUrl = null;
  if (thumbnail) {
    const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);
    const fileName = `designs/${session.user.id}/${uuidv4()}.png`;
    const file = bucket.file(fileName);

    const base64Data = thumbnail.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    await file.save(buffer, { contentType: 'image/png' });
    thumbnailUrl = `gs://${process.env.GCS_BUCKET_NAME}/${fileName}`;
  }

  // Create design
  const design = await db.customDesign.create({
    data: {
      userId: session.user.id,
      name: name || `Design ${new Date().toLocaleDateString()}`,
      canvasData,
      thumbnail: thumbnailUrl,
      tier: designUser.designerTier,
    },
  });

  // Increment counter
  await db.designUser.update({
    where: { id: session.user.id },
    data: { designsCreatedThisMonth: { increment: 1 } },
  });

  // Log usage
  await db.designUsageLog.create({
    data: {
      userId: session.user.id,
      action: 'design_created',
      tier: designUser.designerTier,
    },
  });

  return NextResponse.json(design, { status: 201 });
}
```

**`app/api/designs/[id]/route.ts`** - Get/update/delete:

```typescript
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const design = await db.customDesign.findUnique({
    where: { id: params.id },
  });

  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(design);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const design = await db.customDesign.findUnique({
    where: { id: params.id },
  });

  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const updated = await db.customDesign.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const design = await db.customDesign.findUnique({
    where: { id: params.id },
  });

  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await db.customDesign.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
```

---

### Subscription Management

**`app/api/subscriptions/designer/route.ts`** - Separate from store subscriptions:

```typescript
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';

/**
 * Create Stripe checkout for DESIGNER subscription
 * Separate product from main store products
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await req.json(); // 'pro' or 'ultra'

  // Map to Stripe price IDs (DESIGNER specific, different from store)
  const priceIds: Record<string, string> = {
    pro: process.env.STRIPE_DESIGNER_PRO_PRICE_ID!,
    ultra: process.env.STRIPE_DESIGNER_ULTRA_PRICE_ID!,
  };

  if (!priceIds[plan]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  // Get or create designer user in DB
  let designUser = await db.designUser.findUnique({
    where: { email: session.user.email },
  });

  if (!designUser) {
    designUser = await db.designUser.create({
      data: {
        id: session.user.id,
        email: session.user.email,
      },
    });
  }

  // Get or create Stripe customer
  let customerId = designUser.stripeDesignerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { designUserId: designUser.id },
    });
    customerId = customer.id;

    await db.designUser.update({
      where: { id: designUser.id },
      data: { stripeDesignerId: customerId },
    });
  }

  // Create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceIds[plan],
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${req.nextUrl.origin}/designer?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/designer/subscribe`,
    metadata: {
      designUserId: designUser.id,
      planType: 'designer',
    },
  });

  return NextResponse.json({ sessionId: checkoutSession.id });
}
```

**`app/api/subscriptions/designer/webhook/route.ts`** - Designer subscription webhooks:

```typescript
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const DESIGNER_TIER_MAP: Record<string, { tier: string; limit: number | null }> = {
  [process.env.STRIPE_DESIGNER_PRO_PRICE_ID!]: { tier: 'pro', limit: 50 },
  [process.env.STRIPE_DESIGNER_ULTRA_PRICE_ID!]: { tier: 'ultra', limit: null },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_DESIGNER_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  const subscription = event.data.object as any;

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const priceId = subscription.items.data[0].price.id;
      const tierInfo = DESIGNER_TIER_MAP[priceId] || { tier: 'free', limit: 2 };

      // Find designer user by Stripe customer ID
      const designUser = await db.designUser.findUnique({
        where: { stripeDesignerId: subscription.customer },
      });

      if (designUser) {
        await db.designUser.update({
          where: { id: designUser.id },
          data: {
            designerTier: tierInfo.tier,
            designerSubStatus: subscription.status,
            designerPeriodEnd: new Date(subscription.current_period_end * 1000),
            designLimit: tierInfo.limit,
            features: {
              aiAssistant: tierInfo.tier === 'ultra',
              aiImageGen: tierInfo.tier === 'ultra',
              multiProductPreview: tierInfo.tier === 'ultra',
              customBranding: tierInfo.tier === 'ultra',
            },
          },
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const designUser = await db.designUser.findUnique({
        where: { stripeDesignerId: subscription.customer },
      });

      if (designUser) {
        await db.designUser.update({
          where: { id: designUser.id },
          data: {
            designerTier: 'free',
            designerSubStatus: 'canceled',
            designLimit: 2,
            features: {
              aiAssistant: false,
              aiImageGen: false,
              multiProductPreview: false,
              customBranding: false,
            },
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

## 🎨 DESIGNER COMPONENT

**`components/designer/Canvas.tsx`** - Fabric.js editor:

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DesignCanvasProps {
  designId?: string;
  onSave?: (designId: string) => void;
}

export default function DesignCanvas({ designId, onSave }: DesignCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [designName, setDesignName] = useState(`Design ${new Date().toLocaleDateString()}`);

  // Initialize Fabric.js
  useEffect(() => {
    if (!canvasRef.current || !session?.user?.id) return;

    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 1000,
      backgroundColor: '#ffffff',
    });

    // Load existing design if editing
    if (designId) {
      loadDesign(designId);
    }

    return () => {
      fabricRef.current?.dispose();
    };
  }, [designId, session?.user?.id]);

  async function loadDesign(id: string) {
    try {
      const res = await fetch(`/api/designs/${id}`);
      const design = await res.json();

      if (fabricRef.current) {
        fabricRef.current.loadFromJSON(design.canvasData, () => {
          fabricRef.current?.renderAll();
        });
        setDesignName(design.name);
      }
    } catch (error) {
      console.error('Failed to load design:', error);
      alert('Failed to load design');
    }
  }

  async function saveDesign() {
    if (!fabricRef.current || !session?.user?.id) {
      alert('You must be logged in');
      return;
    }

    setIsSaving(true);

    try {
      const canvasData = fabricRef.current.toJSON();
      const thumbnail = fabricRef.current.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 0.2,
      });

      const payload = {
        name: designName,
        canvasData,
        thumbnail,
      };

      const url = designId ? `/api/designs/${designId}` : '/api/designs';
      const method = designId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Save failed');
      }

      const design = await res.json();
      alert('Design saved!');

      if (onSave) onSave(design.id);
      if (!designId) router.push(`/designer/${design.id}`);
    } catch (error) {
      console.error('Save error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Save failed'}`);
    } finally {
      setIsSaving(false);
    }
  }

  function addText() {
    if (!fabricRef.current) return;

    const text = new fabric.IText('Your Text Here', {
      left: 100,
      top: 100,
      fontSize: 40,
      fill: '#000000',
      fontFamily: 'Arial',
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    fabricRef.current.renderAll();
  }

  function addRectangle() {
    if (!fabricRef.current) return;

    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 200,
      height: 150,
      fill: '#3b82f6',
    });

    fabricRef.current.add(rect);
    fabricRef.current.setActiveObject(rect);
    fabricRef.current.renderAll();
  }

  function addCircle() {
    if (!fabricRef.current) return;

    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 75,
      fill: '#ef4444',
    });

    fabricRef.current.add(circle);
    fabricRef.current.setActiveObject(circle);
    fabricRef.current.renderAll();
  }

  async function uploadImage(file: File) {
    if (!fabricRef.current) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/designs/upload-image', {
        method: 'POST',
        body: formData,
      });

      const { imageUrl } = await res.json();

      fabric.Image.fromURL(imageUrl, (img) => {
        img.scaleToWidth(300);
        img.set({ left: 50, top: 50 });
        fabricRef.current!.add(img);
        fabricRef.current!.renderAll();
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Design Canvas</h1>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="mt-2 px-3 py-2 border rounded"
              placeholder="Design name"
            />
          </div>
          <button
            onClick={saveDesign}
            disabled={isSaving}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save Design'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-4">Tools</h2>
            <div className="space-y-2">
              <button
                onClick={addText}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Text
              </button>
              <button
                onClick={addRectangle}
                className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Rectangle
              </button>
              <button
                onClick={addCircle}
                className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Add Circle
              </button>
              <label className="w-full block">
                <span className="w-full px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer text-center">
                  Upload Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-3 bg-white p-4 rounded shadow">
            <canvas ref={canvasRef} className="border-2 border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 DESIGNER PAGE STRUCTURE

**`app/designer/page.tsx`** - Main designer hub:

```typescript
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import DesignCanvas from '@/components/designer/Canvas';

export default async function DesignerPage() {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <DesignCanvas />
    </div>
  );
}
```

**`app/designer/[id]/page.tsx`** - Edit existing design:

```typescript
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import DesignCanvas from '@/components/designer/Canvas';

export default async function EditDesignPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <DesignCanvas designId={params.id} />
    </div>
  );
}
```

---

## 📡 PRINTIFY EXPORT (Reusing Existing Integration)

**`app/api/designs/export/route.ts`** - Export to Printify:

```typescript
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import axios from 'axios';

const PRINTIFY_API = 'https://api.printify.com/v1';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { designId } = await req.json();

  const design = await db.customDesign.findUnique({
    where: { id: designId },
  });

  if (!design || design.userId !== session.user.id) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  try {
    // Step 1: Upload image to Printify
    const imageRes = await axios.post(
      `${PRINTIFY_API}/uploads/images.json`,
      {
        file_name: `${design.id}.png`,
        url: design.thumbnail,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    const imageId = imageRes.data.id;

    // Step 2: Create product
    const productRes = await axios.post(
      `${PRINTIFY_API}/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`,
      {
        title: design.name,
        description: `Custom design by ${session.user.email}`,
        blueprint_id: 3, // T-shirt
        print_provider_id: 1,
        variants: [
          { id: 17386, price: 2999, is_enabled: true },
          { id: 17387, price: 2999, is_enabled: true },
          { id: 17388, price: 2999, is_enabled: true },
          { id: 17389, price: 2999, is_enabled: true },
        ],
        print_areas: [
          {
            variant_ids: [17386, 17387, 17388, 17389],
            placeholders: [
              {
                position: 'front',
                images: [
                  {
                    id: imageId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    const productId = productRes.data.id;

    // Step 3: Publish
    await axios.post(
      `${PRINTIFY_API}/shops/${process.env.PRINTIFY_SHOP_ID}/products/${productId}/publish.json`,
      {
        title: true,
        description: true,
        images: true,
        variants: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    // Step 4: Update design in DB
    await db.customDesign.update({
      where: { id: designId },
      data: {
        printifyProductId: productId,
        status: 'live',
      },
    });

    // Log usage
    await db.designUsageLog.create({
      data: {
        userId: session.user.id,
        action: 'export',
        tier: design.tier,
        metadata: { printifyProductId: productId },
      },
    });

    return NextResponse.json({ success: true, productId });
  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json(
      { error: 'Failed to export to Printify' },
      { status: 500 }
    );
  }
}
```

---

## ✅ DEPLOYMENT CHECKLIST

**Phase 1: Setup (No breaking changes)**
- [ ] Create Cloud SQL PostgreSQL instance
- [ ] Set up VPC connector
- [ ] Create Cloud Storage bucket
- [ ] Configure Prisma + run migrations
- [ ] **Verify:** Homepage, products, checkout still work ✅

**Phase 2: Designer Feature (Isolated)**
- [ ] Extend NextAuth for designer auth
- [ ] Deploy designer API routes
- [ ] Create designer components
- [ ] Set up Stripe for designer subscriptions (separate product)
- [ ] **Verify:** Designer routes don't interfere with store ✅

**Phase 3: Integration**
- [ ] Connect Printify export
- [ ] Set up Printify webhooks
- [ ] Add custom order tracking
- [ ] **Verify:** Designs export correctly ✅

**Phase 4: Monitoring**
- [ ] Add logging to designer APIs
- [ ] Monitor Cloud Run costs
- [ ] Track designer user adoption
- [ ] **Live to beta users**

---

## 🚀 ENVIRONMENT VARIABLES

Add to `.env.local` (existing vars remain):

```bash
# EXISTING (unchanged)
NEXT_PUBLIC_SANITY_PROJECT_ID=...
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRINTIFY_API_KEY=...
PRINTIFY_SHOP_ID=...

# NEW: Designer Feature
DATABASE_URL="postgresql://user:pass@cloudsql-ip:5432/sampada"
GOOGLE_CLOUD_PROJECT_ID="sampada-store-87848430"
GCS_BUCKET_NAME="sampada-storage-87848430"

# Designer Stripe (SEPARATE from store)
STRIPE_DESIGNER_PRO_PRICE_ID="price_designer_pro"
STRIPE_DESIGNER_ULTRA_PRICE_ID="price_designer_ultra"
STRIPE_DESIGNER_WEBHOOK_SECRET="whsec_designer_..."

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL="https://sampada.com"
```

---

## 📋 MIGRATION STEPS

```bash
# 1. Install dependencies
npm install @prisma/client prisma @google-cloud/storage

# 2. Init Prisma
npx prisma init

# 3. Copy schema from this guide to prisma/schema.prisma

# 4. Push to Cloud SQL
npx prisma db push
npx prisma generate

# 5. Create API routes (copy-paste from this guide)

# 6. Create designer component

# 7. Test designer locally
npm run dev

# 8. Deploy to Cloud Run (existing store unaffected)
gcloud run deploy sampada \
  --region=us-central1 \
  --add-cloudsql-instances=sampada-store-87848430:us-central1:sampada-db \
  --vpc-connector=sampada-connector

# 9. Verify store still works: https://sampada.com
# 10. Access designer: https://sampada.com/designer
```

---

## ⚡ KEY PRINCIPLES

✅ **No Breaking Changes**
- All existing store pages untouched
- New routes in `/api/designs/` only
- New component in `/designer/` only
- Sanity CMS continues to manage product catalog

✅ **Isolated Database**
- Designer data in PostgreSQL (Cloud SQL)
- Existing Firestore + product catalog untouched
- Two separate subscription systems (optional)

✅ **Reuse Existing Services**
- Printify: Same API, new product types
- Stripe: New Stripe product for designer subscriptions
- NextAuth: Extended, not replaced

✅ **Easy to Disable**
- Remove `/designer` route → feature gone
- Designer users can still browse store normally
- No conflicts with existing functionality

---

## 🎯 SUCCESS CRITERIA

After deployment:
- ✅ Homepage loads in <2s
- ✅ Product listing works
- ✅ Checkout process unchanged
- ✅ Designer users can create & save designs
- ✅ Export to Printify works
- ✅ No impact on store visitors
- ✅ Designer feature optional (users choose to use it)