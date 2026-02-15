# 🧵 Sampada Project Story - Complete Guide (Jan 2026)

> **Single Source of Truth** for deployment, database management, running the app, troubleshooting, and future features.

*Om Namah Sivaya* 🙏

**Last Updated:** Jan 19, 2026 | 1:45 PM IST

---

## 📋 Project Status

| Feature | Status | Notes |
|---------|--------|-------|
| Firebase Migration | ✅ Complete | Moved to Cloud Run + Cloud SQL PostgreSQL (Prisma) |
| DB Setup | ✅ Complete | DATABASE_URL configured in .env.local |
| Designer Feature | ✅ Complete | Canvas, Toolbar, LayerPanel, PropertiesPanel, AIToolsPanel |
| Subscription Tiers | ✅ Complete | Free (2/mo), Pro ($30, 50/mo), Ultra ($300, unlimited) |
| Templates Gallery | ✅ Complete | Browse & use design templates |
| AI Integration | ✅ Complete | Gemini Pro suggestions, Nano Banana image gen (Ultra) |
| Stripe Integration | ✅ Complete | Webhooks + Checkout + Tier Auto-Upgrade |
| Google Pay | ⏳ Pending | Stripe live, Google Pay API queued |
| Printify Export | ✅ Complete | Export modal + API, product creation & publishing |
| Tier Gating | ✅ Complete | Feature locks for Free/Pro tiers |
| Env Configuration | ✅ Complete | All required env vars set, verification passes |
| Homepage | ✅ Complete | New 3-category layout with lifestyle images |
| Stories Hub | ✅ Complete | /stories tab, Sanity integration, filtering, and article pages |
| Sanity Post Schema | ✅ Complete | post.js schema created and registered |
| Navigation | ✅ Complete | Updated megamenu with dropdowns and mobile support |
| Seed Script | ✅ Ready | Test users & templates (npm run db:seed) |
| Next.js 15 Fixes | ✅ Complete | Async params fixed for dynamic routes |
| API Import Paths | ✅ Complete | Fixed relative import paths for services |
| Production Build | ✅ Complete | Builds successfully with --no-lint |
| Sanity Studio (embedded) | ❌ Removed | React version conflict - Use standalone studio instead |
| **Admin Dashboard Design** | ✅ Complete | Modern color-coded cards, professional UI |
| **Studio Integration Docs** | ✅ Complete | STUDIO.md created with full architecture |
| **Prisma Studio Access** | ✅ Complete | Database management at localhost:5555 |
| **Sanity Studio Setup** | ✅ Complete | Content management at localhost:3333 |
| **Dual Studio Architecture** | ✅ Complete | Prisma for data, Sanity for content |
| **Color-Coded Metrics** | ✅ Complete | 6 unique card colors with accents |
| **Homepage Quality Match** | ✅ Complete | Dashboard now matches homepage design |
| Deployment | ⏳ Pending | Cloud Run URL to be generated |
| OAuth Keys | ✅ Complete | GitHub & Google Credentials Configured |

**Project ID:** `sampada-store-2026`  
**Region:** `us-central1`

---

## � STUDIO_FINAL - Billionaire Protocol: DEPLOYMENT COMPLETE!

**Implementation Period:** January 18-20, 2026  
**Status:** ✅ **FULLY OPERATIONAL & DEPLOYED TO PRODUCTION**  
**Production URL:** https://sampada-315704971004.us-central1.run.app

### **🏆 Major Achievements**

#### **✅ Database & Schema (Jan 18-19)**
- Prisma migration `add_studio_final_models` applied successfully
- New models created: `ProductCache`, `SearchLog`, `PersonalizedContent`
- Bridge field added: `CustomOrder.sanityProductId`
- Database seeded with 3 test users (free/pro/ultra) and 4 design templates

#### **✅ Integration Architecture (Jan 18-19)**
- Unified Data Layer implemented (`lib/unifiedData.ts`)
  - `getProductWithOrders()` - Sanity + Prisma integration
  - `getOrderWithProduct()` - Order details with product info
  - `getAllProductsWithInventory()` - Complete inventory view
  - `getPersonalizedRecommendations()` - AI-powered suggestions
- Webhook endpoint created (`app/api/webhooks/sanity/route.ts`)
  - Real-time Sanity → Prisma synchronization
  - ProductCache auto-updates on product changes
  - **Status: WORKING!** ✨

#### **✅ AI Innovations (Jan 18-19)**
- AI Dynamic Collections (`services/ai/dynamicCollections.ts`)
- AI Personalization Engine (`services/ai/personalization.ts`)
- AI Virtual Stylist (`services/ai/stylist.ts`)
- Unified Admin Dashboard with AI insights

#### **✅ Production Deployment (Jan 19-20)**
- **9 Cloud Run revisions deployed** (latest: `sampada-00009`)
- Cloud SQL connection configured via Unix socket
- Environment variables configured:
  - `DATABASE_URL` - PostgreSQL connection string
  - `SANITY_WEBHOOK_SECRET` - Webhook authentication
  - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth
  - `NEXTAUTH_URL` & `NEXTAUTH_SECRET` - Authentication
  - All AI API keys (Google AI, Perplexity)
  - Stripe, Printify, Sanity credentials

#### **✅ Webhook Configuration (Jan 20)**
- Sanity webhook "Product Sync to Prisma" created
- URL: `https://sampada-315704971004.us-central1.run.app/api/webhooks/sanity`
- Events: CREATE, UPDATE, DELETE for `product` type
- Secret: `5fb1c79233788d4a843cf6ae22d52ed23fc511963aed631b8e2761d074985c0c`
- **Verification:** Products successfully syncing to ProductCache table!

#### **✅ OAuth & Authentication (Jan 20)**
- Google OAuth configured for production
- Authorized JavaScript origins: Production URL added
- Authorized redirect URIs: `/api/auth/callback/google` configured
- **Verification:** Users can sign in to production site! ✅

### **📊 Production Metrics**
```
Production URL:     https://sampada-315704971004.us-central1.run.app
Database:           Cloud SQL (sampada-db) via Unix socket
Webhook Status:     ✅ OPERATIONAL
OAuth Status:       ✅ WORKING
Total Deployments:  9 revisions
Latest Revision:    sampada-00009
Region:             us-central1
```

### **🎯 What's Working Now**
1. ✅ **Real-time Product Sync** - Sanity products auto-cache to Prisma
2. ✅ **User Authentication** - Google OAuth sign-in functional
3. ✅ **Unified Data Access** - Single API for Sanity + Prisma data
4. ✅ **AI Services Ready** - Dynamic collections, personalization, styling tips
5. ✅ **Admin Dashboard** - Unified metrics from both data sources
6. ✅ **Production Deployment** - Live and accessible globally

### **⏳ Optional Enhancements (Future)**
- ~~Sanity Studio plugin installations~~ ✅ **COMPLETED JAN 20, 2026**
- ~~Sanity Studio Schema Enhancements~~ ✅ **COMPLETED JAN 20, 2026**
- ~~Performance Optimization~~ ✅ **COMPLETED JAN 20, 2026**
- ~~Enhanced monitoring and alerting~~ ✅ **COMPLETED JAN 20, 2026**
- Additional unified API routes
- Custom domain mapping
- Comprehensive end-to-end testing

---

## 🎨 Sanity Studio Enhancements - COMPLETED!

**Implementation Date:** January 20, 2026  
**Status:** ✅ **PLUGINS INSTALLED & CONFIGURED**  
**Sanity Studio URL:** http://localhost:3333/

### **✅ Plugins Successfully Installed:**

1. ✅ **sanity-plugin-media** - Enhanced media library
   - Better search and filtering
   - Grid/List view toggle
   - Bulk operations
   - Advanced metadata editing
   - Folder organization

2. ✅ **@sanity/table** - Table fields for structured data
   - Added to product schema as "Technical Specifications Table"
   - Allows structured product specs (Battery Life, Weight, Connectivity, etc.)
   - Easy-to-use table interface in Studio

3. ✅ **@sanity/code-input** - Code blocks (pre-installed)
   - Syntax highlighting
   - Multiple language support

4. ✅ **@sanity/vision** - GROQ query testing tool (pre-installed)
   - Real-time query testing
   - Instant results preview
   - API version selector
   - Parameter support

### **📊 Product Schema Updates:**

**New Field Added:**
```javascript
technicalSpecs: {
  type: 'table',
  title: 'Technical Specifications Table',
  description: 'Detailed product specifications in table format'
}
```

**Use Cases:**
- Electronics: Battery life, connectivity, screen size, weight
- Clothing: Material composition, care instructions, origin
- Any product requiring structured specifications

### **📖 Documentation Created:**

**Guide File:** `docs_1/SANITY_PLUGINS_GUIDE.md`

**Includes:**
- How to add table fields
- How to use Vision tool for GROQ queries
- 8+ example GROQ queries
- Media library usage guide
- Tips and best practices

### **🚀 What You Can Do Now:**

1. **Use Enhanced Media Library**
   - Better organization and search
   - Bulk image operations
   - Advanced metadata

2. **Add Product Specifications**
   - Use table fields for structured data
   - Easy to maintain and update
   - Professional presentation

3. **Test GROQ Queries**
   - Use Vision tool at http://localhost:3333/
   - Test data queries in real-time
   - Debug and optimize queries

### **❌ Plugins Not Installed (Compatibility Issues):**

- ❌ @sanity/color-input - Requires React 19 (project uses React 18)
- ❌ @sanity/document-internationalization - Not available in npm registry
- ❌ @sanity/asset-source-unsplash - Not available in npm registry

**Note:** These plugins require newer versions of React/Sanity. Can be added in future when upgrading to Sanity v5 and React 19.

---

## �🎨 Admin Dashboard - Current State

### Visual Design Update (Jan 19, 2026)
The admin dashboard has been completely redesigned to match the professional quality of our homepage.

**Current Design Features:**
- ✅ Modern card-based layout with rounded corners
- ✅ Color-coded stat cards with unique accents:
  - 💛 Revenue (30 Days): Gold/Yellow border & icon background
  - 💙 Total Orders: Blue border & package icon
  - 💚 Active Products: Green/Teal border & tag icon
  - ❤️ Low Stock Alerts: Red border & warning icon
  - 💜 Designer Users: Purple border & users icon
  - 💗 Custom Designs: Pink border & palette icon
- ✅ Subtle left border accents (5px) on each card
- ✅ Light background tints matching accent colors
- ✅ Clean shadows and professional typography
- ✅ Navy blue AI Insights section (matches homepage footer)
- ✅ Responsive grid layout
- ✅ Recent Orders table with clean white card design
- ✅ Low Stock Alerts with product thumbnails
- ✅ Red "Restock" button matching homepage CTA style
- ✅ Lucide React icons (professional, not emojis)

**Dashboard Metrics Tracked:**
```
┌─────────────────────────────────────────────────────────────┐
│  REVENUE (30 DAYS)  │  TOTAL ORDERS  │  ACTIVE PRODUCTS    │
│       ₹0.00         │       0        │         9           │
│      +12%           │   0 pending    │     0 drafts        │
├─────────────────────────────────────────────────────────────┤
│  LOW STOCK ALERTS   │ DESIGNER USERS │  CUSTOM DESIGNS     │
│         1           │       0        │         0           │
│  Action needed      │   0 pro tier   │     0 live          │
└─────────────────────────────────────────────────────────────┘
```

**Access URL:** `http://localhost:3000/admin/dashboard`

**Still Needed:**
- ⏳ Connect real-time data from Prisma database (IP whitelisting configured)
- ⏳ Add interactive charts/graphs for revenue trends
- ⏳ Implement date range filters
- ⏳ Add export functionality for reports
- ⏳ Create detailed analytics views

---

## 🚀 Quick Start - Run Sampada (Three Terminal Setup)

### Prerequisites Check
```bash
# Verify installations
node --version    # Should be v18 or higher
npm --version
gcloud --version  # For database access
```

### Terminal 1: Main Application
```bash
# Navigate to main project
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce

# Install dependencies (first time only)
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# Generate Prisma client (first time only)
npx prisma generate

# Push database schema (first time only)
npx prisma db push

# Start development server
npm run dev

# ✅ Opens at: http://localhost:3000
```

### Terminal 2: Sanity Studio (Content Management)
```bash
# Navigate to Sanity folder
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\sanity_abscommerce

# Install dependencies (first time only)
npm install

# Start Sanity Studio
npx sanity dev

# ✅ Opens at: http://localhost:3333
```

### Terminal 3: Prisma Studio (Database Management)
```bash
# Navigate to main project
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce

# Open Prisma Studio
npx prisma studio

# ✅ Opens at: http://localhost:5555
```

### Quick Access URLs
| Service | URL | Purpose |
|---------|-----|---------|
| 🏠 Main Website | http://localhost:3000 | Customer-facing site |
| 🎨 Admin Dashboard | http://localhost:3000/admin/dashboard | Business metrics |
| ✏️ Designer Tool | http://localhost:3000/designer | Custom t-shirt creator |
| 📝 Sanity Studio | http://localhost:3333 | Content management |
| 🗄️ Prisma Studio | http://localhost:5555 | Database viewer/editor |

### Verification
```bash
# Verify setup is correct
npm run verify

# Should show:
✅ All required environment variables present
✅ Database connection successful
✅ Sanity configuration valid
```

---

## 🗄️ Database Guide (Cloud SQL PostgreSQL)

### Connection Details
```
Host: 34.28.88.114 (Cloud SQL IP)
Port: 5432
Database: sampada
User: sampada-user
Password: sampadabinod
```

### DATABASE_URL Format
```
postgresql://sampada-user:sampadabinod@34.28.88.114:5432/sampada
```

### Prisma Schemas

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `DesignUser` | User profiles & tiers | email, designerTier, designLimit, features |
| `CustomDesign` | Canvas designs | name, canvasData (JSON), thumbnail, status |
| `CustomOrder` | Printify orders | designId, printifyOrderId, status, sanityProductId |
| `DesignTemplate` | Pre-made templates | name, category, canvasData, isPublic |
| `ProductCache` | Sanity product cache | sanityProductId, name, price, inventory |
| `SearchLog` | Search analytics | query, userId, resultsCount |
| `PersonalizedContent` | AI personalization | productId, userId, tagline |

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (visual editor)
npx prisma studio

# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database (⚠️ destroys data)
npx prisma migrate reset

# Seed test data
npx prisma db seed
```

### Cloud SQL Console
- URL: https://console.cloud.google.com/sql/instances/sampada-db
- Direct connect: `gcloud sql connect sampada-db --user=sampada-user`

### Monthly Limit Reset
```bash
# Reset all users' monthly design counts (run via Cloud Scheduler)
curl -X POST https://YOUR_CLOUD_RUN_URL/api/reset-limits
```

---

## 🏗️ Studio Integration - Dual System Architecture

Sampada uses **TWO complementary studio interfaces** for different purposes:

### Quick Reference Table

| Studio | Purpose | URL | Access Command | When to Use |
|--------|---------|-----|----------------|-------------|
| **Prisma Studio** | Database operations | `http://localhost:5555` | `npx prisma studio` | User data, orders, designs, subscriptions |
| **Sanity Studio** | Content management | `http://localhost:3333` | `npx sanity dev` | Products, banners, blog posts, marketing |

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                   SAMPADA DATA FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SANITY STUDIO           NEXT.JS APP           PRISMA STUDIO│
│  (localhost:3333)        (localhost:3000)      (localhost:5555)│
│        │                      │                      │       │
│        │                      │                      │       │
│   [Products]            [Website UI]           [Orders]     │
│   [Blog Posts]          [Designer]             [Users]      │
│   [Banners]             [API Routes]           [Designs]    │
│        │                      │                      │       │
│        ▼                      ▼                      ▼       │
│   SANITY CDN            Components            PostgreSQL    │
│   (Content Lake)        Context/State         (Cloud SQL)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why Two Studios?

**They serve DIFFERENT purposes and CANNOT be merged:**

| Aspect | Prisma Studio | Sanity Studio |
|--------|---------------|---------------|
| **Data Type** | Relational (SQL) | Document-based |
| **Storage** | Your PostgreSQL | Sanity's Cloud |
| **Best For** | Transactions, User accounts | Marketing content, Products |
| **Query Language** | Prisma ORM | GROQ |
| **Real-time** | Manual refresh | Live updates |
| **Cost** | Database hosting | Sanity tier plan |

### Data Ownership Matrix
```
SANITY (Content Lake)          PRISMA (PostgreSQL)
═══════════════════            ═══════════════════
- Product catalog               • User accounts
- Product images                • Custom designs
- Categories                    • Order transactions
- Blog posts/Stories           • Payment records
- Banners/Promos               • Subscriptions
- About/Contact pages          • Design templates
- Marketing content            • Analytics data

READ-HEAVY                     WRITE-HEAVY
+ CDN CACHED                   + ACID COMPLIANCE
```

### How to#### **Phase 5: Production Deployment** ✅ **COMPLETED JAN 20, 2026**
- ✅ Prisma Migration Applied (`npx prisma migrate dev --name add_studio_final_models`)
  - ProductCache, SearchLog, PersonalizedContent models created
  - Database schema updated successfully
- ✅ Database Seeded
  - 3 test users (free, pro, ultra tiers)
  - 4 design templates
- ✅ SANITY_WEBHOOK_SECRET Generated
  - Secret: `5fb1c79233788d4a843cf6ae22d52ed23fc511963aed631b8e2761d074985c0c`
  - Added to `.env.local` and `.env`
- ✅ Production Deployment to Cloud Run
  - URL: https://sampada-315704971004.us-central1.run.app
  - 9 revisions deployed (latest: sampada-00009)
  - Cloud SQL connection configured via Unix socket
  - All environment variables set (DATABASE_URL, OAuth, Sanity, etc.)
- ✅ Sanity Webhook Configured
  - Webhook: "Product Sync to Prisma"
  - URL: `https://sampada-315704971004.us-central1.run.app/api/webhooks/sanity`
  - Events: CREATE, UPDATE, DELETE for `product` type
  - **Status: WORKING!** ✨ (Products syncing to ProductCache)
- ✅ OAuth Configuration
  - Google OAuth redirect URIs added for production
  - NEXTAUTH_URL set to production URL
  - **Authentication working on production site** ✅

### **⏳ REMAINING TASKS (Optional Enhancements)**
### How to Use Each Studio

**Prisma Studio - For Operations:**
```bash
# 1. Open Prisma Studio
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce
npx prisma studio

# 2. Opens at http://localhost:5555

# 3. What you can do:
- View all database tables (DesignUser, CustomDesign, CustomOrder)
- Edit user subscription tiers
- Manually add/delete records
- Check design canvas data (JSON)
- Track order status and payments
- Reset monthly design limits
```

**Sanity Studio - For Content:**
```bash
# 1. Open Sanity Studio
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\sanity_abscommerce
npx sanity dev

# 2. Opens at http://localhost:3333

# 3. What you can do:
- Add new products with images
- Create blog posts/stories
- Update banner promotions
- Manage product categories
- Edit About/Contact pages
- Upload and organize media assets
```

### Integration Strategy - Reference by ID

Products created in Sanity are referenced by ID in Prisma orders:
```javascript
// Example: Custom Order in Prisma references Sanity Product
{
  "id": "order_abc123",
  "sanityProductId": "product_xyz789",  // ← Reference to Sanity
  "userId": "user_def456",              // ← Reference to Prisma User
  "quantity": 2,
  "status": "paid"
}

// On render, fetch from both sources:
const order = await prisma.customOrder.findUnique({ where: { id } });
const product = await sanityClient.fetch(
  `*[_type == "product" && _id == $id][0]`,
  { id: order.sanityProductId }
);
```

For complete integration details, see: **STUDIO.md**

---

## 📋 Complete Workflows - Step by Step

### Workflow 1: Adding a New Product

**Goal:** Add "Premium Cotton T-Shirt" to the store
```
1. Open Sanity Studio
   Terminal: cd sanity_abscommerce
   Command: npx sanity dev
   URL: http://localhost:3333

2. Create Product
   - Click "Products" in sidebar
   - Click "+ Create" button
   - Fill in fields:
     * Name: "Premium Cotton T-Shirt"
     * Slug: "premium-cotton-tshirt" (auto-generated)
     * Price: 899
     * Discounted Price: 699
     * Upload images (front, back, colors)
     * Description: Add product story
     * Category: Select "Men's Clothing"
     * Tags: cotton, premium, comfortable
   - Add Variants:
     * Sizes: S, M, L, XL, XXL
     * Colors: Black, White, Navy
   - Check "In Stock" = true
   - Click "Publish"

3. Verify on Website
   - Open: http://localhost:3000/products
   - Should see new product appear
   - Click to view product detail page
   - Verify all images and info display correctly

4. Optional: Add to Featured
   - Create new banner in Sanity
   - Link to product slug
   - Set display dates
```

### Workflow 2: Processing Custom Design Order

**Goal:** Handle a customer's custom t-shirt order
```
1. Customer Creates Design
   - Customer visits: http://localhost:3000/designer
   - Creates custom design using canvas
   - Clicks "Save Design"
   - Design stored in Prisma database

2. Customer Places Order
   - Clicks "Order Now"
   - Stripe checkout opens
   - Customer completes payment
   - Webhook triggers: /api/subscriptions/designer/webhook

3. Admin Checks Order (Prisma Studio)
   Terminal: cd abscommerce
   Command: npx prisma studio
   URL: http://localhost:5555
   
   Actions:
   - Click "CustomOrder" table
   - Find latest order (sort by createdAt)
   - View fields:
     * Customer info
     * Design ID (click to see design details)
     * Payment status
     * Order amount
   - Click "CustomDesign" to view canvas data

4. Export to Printify
   - From Prisma Studio, note design ID
   - Open website admin panel
   - Navigate to Orders section
   - Click "Export to Printify" for that order
   - Confirm product details
   - Submit to Printify for fulfillment

5. Update Status
   - Return to Prisma Studio
   - Find the order in CustomOrder table
   - Edit "status" field: "processing" → "shipped"
   - Add "printifyOrderId" if provided
   - Save changes

6. Customer Notification
   - System automatically sends email (if configured)
   - Or manually notify via admin panel
```

### Workflow 3: Managing Subscription Tiers

**Goal:** Upgrade a user from Free to Pro tier
```
1. Check Current Status (Prisma Studio)
   - Open: http://localhost:5555
   - Click "DesignUser" table
   - Search for user by email
   - Note current fields:
     * designerTier: "free"
     * designLimit: 2
     * designsUsed: 1 (example)

2. Customer Subscribes
   - Customer visits: http://localhost:3000/subscription
   - Selects "Pro Plan - $30/month"
   - Completes Stripe checkout
   - Stripe webhook fires: /api/subscriptions/designer/webhook

3. Verify Upgrade (Prisma Studio)
   - Refresh DesignUser table
   - Find same user
   - Confirm updated fields:
     * designerTier: "pro"
     * designLimit: 50
     * stripeCustomerId: "cus_xxxxx"
     * features: { JSON with pro features }
   - Check subscription date: updatedAt

4. Manual Override (if webhook fails)
   - In Prisma Studio, click user row
   - Edit fields manually:
     * designerTier: Change to "pro"
     * designLimit: Change to 50
   - Click "Save 1 change"
   - User immediately gets new limits

5. Monthly Reset (Automated)
   - Cloud Scheduler runs: /api/reset-limits
   - All users' designsUsed reset to 0
   - Tier limits remain unchanged
   - Schedule: 1st of every month, 00:00 UTC
```

### Workflow 4: Creating Blog Post/Story

**Goal:** Publish "Winter Fashion Trends 2026" article
```
1. Open Sanity Studio
   URL: http://localhost:3333
   
2. Create Post
   - Click "Post" in sidebar
   - Click "+ Create"
   - Fill fields:
     * Title: "Winter Fashion Trends 2026"
     * Slug: "winter-fashion-trends-2026"
     * Author: Select or create author
     * Main Image: Upload hero image
     * Body: Use rich text editor
       - Add headings, paragraphs
       - Embed images within content
       - Add bullet points, quotes
     * Excerpt: Short preview (150 chars)
     * Categories: Fashion, Trends, Winter
     * Tags: winter, 2026, trends, style
     * Published At: Set date/time
   - Click "Publish"

3. Verify on Website
   - Visit: http://localhost:3000/stories
   - Should see new post in grid
   - Click to open full article
   - Verify:
     * Images load correctly
     * Formatting is preserved
     * Author info displays
     * Related posts show (if configured)

4. SEO Check
   - View page source
   - Verify meta title and description
   - Check Open Graph tags
   - Confirm canonical URL
```

### Workflow 5: Updating Homepage Banner

**Goal:** Change "Winter Drop 2026" to "Spring Collection 2026"
```
1. Open Sanity Studio
   URL: http://localhost:3333

2. Edit Banner
   - Click "Banner" content type
   - Select "Winter Drop 2026" banner
   - Update fields:
     * Title: "Spring Collection 2026"
     * Subtitle: "Fresh styles for the new season"
     * Image: Upload new spring theme image
     * Button Text: "Explore Spring"
     * Button Link: /collections/spring-2026
     * Active Dates: Set start/end dates
     * Priority: Set display order
   - Click "Publish"

3. Verify Changes
   - Visit: http://localhost:3000
   - Homepage hero should update immediately
   - Verify button links to correct page
   - Check mobile responsiveness

4. Schedule Future Banners
   - Create new banner documents
   - Set future "Active From" dates
   - System auto-displays based on date range
```

---

## 🎓 For Complete Beginners - ELI5 (Explain Like I'm 5)

### What is Sampada?
Sampada is like an online t-shirt store with a special twist: customers can design their own shirts!

Think of it like:
- **Regular Store** = You buy pre-made shirts (Sanity has these)
- **Design Studio** = You create custom art on shirts (Prisma tracks this)
- **Print Shop** = Printify actually makes and ships the shirts

### What Are These "Studios"?

**Imagine a Restaurant:**
```
🏪 SANITY STUDIO = The Menu Board
- Shows all available dishes (products)
- Pictures of food (product images)
- Prices and descriptions
- Daily specials (banners)
- You update this when you add new items

📋 PRISMA STUDIO = The Order Book
- Customer names and table numbers (users)
- What they ordered (designs)
- Payment status (transactions)
- Special requests (custom features)
- You check this to track everything

🏠 ADMIN DASHBOARD = Manager's Office
- See today's revenue (money earned)
- How many orders (busy or slow?)
- What's running low (stock alerts)
- Overall business health
```

### How Does Data Flow?
```
1. YOU (Admin) add product to SANITY
   ↓
2. CUSTOMER sees it on WEBSITE
   ↓
3. CUSTOMER designs custom version in DESIGNER
   ↓
4. Design saves to PRISMA database
   ↓
5. CUSTOMER pays via STRIPE
   ↓
6. Order goes to PRISMA
   ↓
7. PRINTIFY makes and ships shirt
   ↓
8. YOU check ADMIN DASHBOARD for stats
```

### Where Is Everything Stored?
```
SANITY CLOUD (California, USA)
├─ Product photos
├─ Blog articles
├─ Banner images
└─ About/Contact pages
    → Fast worldwide (uses CDN)

GOOGLE CLOUD SQL (Your PostgreSQL)
├─ User accounts
├─ Custom designs (canvas data)
├─ Order records
└─ Payment info
    → Your control, your data

YOUR COMPUTER (Development)
├─ Website code (Next.js)
├─ Design tools (Fabric.js)
└─ API routes (connects everything)
```

### What Happens When You Run Commands?
```bash
# npm run dev
→ Starts the website on your computer
→ You can visit http://localhost:3000
→ Like opening a store for testing

# npx sanity dev
→ Opens the content editor
→ Visit http://localhost:3333
→ Like opening the back office to update the menu

# npx prisma studio
→ Opens the database viewer
→ Visit http://localhost:5555
→ Like opening your ledger book to see orders

# npm run build
→ Packages everything for production
→ Like preparing to open a real store (not practice)
```

### Simple Workflow Example

**Scenario: Add a new "Summer Vibes" t-shirt**
```
Step 1: Open Sanity Studio
cd sanity_abscommerce
npx sanity dev
→ Opens content editor at localhost:3333

Step 2: Create Product
Click "Products" → Click "Create"
Fill in:
- Name: Summer Vibes T-Shirt
- Price: $25
- Upload: Photo of the shirt
Click "Publish"

Step 3: Check Website
Open: http://localhost:3000/products
→ Your new shirt appears automatically!

Step 4: Customer Buys It
Customer clicks "Add to Cart"
Customer pays $25 via Stripe

Step 5: You See It
Open: http://localhost:3000/admin/dashboard
→ Revenue goes up by $25
→ Total Orders increases by 1

Step 6: Check Details
Open Prisma Studio: npx prisma studio
Click "CustomOrder" table
→ See customer name, address, what they bought
```

### Key Terms Explained

| Term | What It Means | Example |
|------|---------------|---------|
| **Database** | Where data lives | Like a filing cabinet |
| **API** | How parts talk to each other | Like a phone line between rooms |
| **Studio** | Visual editor | Like Microsoft Word vs Notepad |
| **Schema** | Database structure | Like organizing folders in cabinet |
| **Route** | Web page URL | Like an address: /products, /designer |
| **Webhook** | Automatic notification | Like a doorbell when someone arrives |
| **CDN** | Fast file delivery | Like Amazon same-day delivery for images |

### "I Broke Something!" - Quick Fixes
```
Problem: Website won't start
Solution: npm install
         npm run dev

Problem: Database error
Solution: npx prisma generate
         npx prisma db push

Problem: Sanity won't load
Solution: cd sanity_abscommerce
         npm install
         npx sanity dev

Problem: Everything is broken
Solution: Ask the developer (me!)
         Or check Errors.md file
```

---

## 🔧 Google Cloud Setup

### Install gcloud CLI
```bash
# Windows
winget install Google.CloudSDK
# Or download: https://cloud.google.com/sdk/docs/install#windows

# Verify
gcloud --version
```

### Authenticate & Configure
```bash
gcloud auth login
gcloud config set project sampada-store-2026
```

### Create Cloud SQL Instance
```bash
gcloud sql instances create sampada-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB

gcloud sql databases create sampada --instance=sampada-db
gcloud sql users create sampada-user --instance=sampada-db --password=YOUR_PASSWORD
```

### Create Cloud Storage Bucket
```bash
gsutil mb -l us-central1 gs://sampada-storage-87848430/
gsutil iam ch allUsers:objectViewer gs://sampada-storage-87848430
```

### Automated Setup Script
```powershell
# Run the setup script (after installing gcloud)
.\scripts\setup-cloud-sql.ps1
```

---

## ⚠️ Common Errors & Fixes

### 1. Prisma Connection Failed (ECONNREFUSED)
```
Error: Can't reach database server at `IP:5432`
```
**FIX:** 
- Verify DATABASE_URL is correct
- Authorize your IP: `gcloud sql instances patch sampada-db --authorized-networks=YOUR_IP/32`
- Or use Cloud SQL Proxy:
```bash
cloud_sql_proxy -instances=sampada-store-2026:us-central1:sampada-db=tcp:5432
```

### 2. Cannot find module '.prisma/client/default'
```
Error: Cannot find module '.prisma/client/default'
```
**FIX:**
```bash
npx prisma generate
```

### 3. Prisma v7 Breaking Change
```
Error: The datasource property `url` is no longer supported
```
**FIX:** Downgrade Prisma
```bash
npm install prisma@5.22.0 @prisma/client@5.22.0
npx prisma generate
```

### 4. Cloud Run 403 Auth Error
```
403 Forbidden - Your client does not have permission
```
**FIX:** Add IAM role
```bash
gcloud run services add-iam-policy-binding sampada \
  --member="allUsers" --role="roles/run.invoker"
```

### 5. Stripe Webhook Signature Failed
```
Error: Webhook signature verification failed
```
**FIX:** Set webhook secret in Secret Manager
```bash
gcloud secrets create stripe-webhook --data-file=secret.txt
```

### 6. Fabric.js Canvas Not Saving
```
Error: Failed to upload thumbnail to GCS
```
**FIX:** Check GCS permissions
```bash
gsutil iam ch allUsers:objectCreator gs://sampada-storage-87848430
```

### 7. Tier Limit Not Enforcing
**FIX:** Set up monthly reset cron in Cloud Scheduler:
- Target: `https://YOUR_URL/api/reset-limits`
- Schedule: `0 0 1 * *` (1st of each month)

### 8. Path Alias Not Working (@/components)
```
Error: Module not found: Can't resolve '@/components/...'
```
**FIX:** Already fixed in `tsconfig.json` with:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```

### 9. Admin Dashboard Shows All Zeros
```
Issue: Dashboard metrics show 0 for revenue, orders, etc.
```
**FIX:** This is normal for fresh installation
```bash
# Option 1: Add test data
npx prisma db seed

# Option 2: Wait for real transactions
# Once users place orders/create designs, metrics will populate

# Option 3: Manual test data via Prisma Studio
npx prisma studio
# Manually add records to CustomOrder, CustomDesign tables
```

### 10. Sanity Studio Shows Empty Content
```
Error: No products/posts visible in Sanity Studio
```
**FIX:** Create your first content
```bash
# 1. Open Sanity Studio
npx sanity dev

# 2. Click "Products" → "Create"
# 3. Fill required fields and publish
# 4. Content appears immediately on website
```

### 11. Cannot Access Prisma Studio (Port 5555 Busy)
```
Error: Port 5555 is already in use
```
**FIX:** Kill the process
```bash
# Windows
npx kill-port 5555

# Or use different port
npx prisma studio --port 5556
```

### 12. Changes in Sanity Not Reflecting on Website
```
Issue: Updated product in Sanity, but website shows old data
```
**FIX:** Clear Next.js cache
```bash
# Option 1: Restart dev server
# Ctrl+C to stop, then npm run dev

# Option 2: Hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# Option 3: Clear .next folder
rm -rf .next
npm run dev
```

---

## 📦 Environment Variables

```env
# Database (Cloud SQL)
DATABASE_URL="postgresql://sampada-user:sampadabinod@34.28.88.114:5432/sampada"

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=sampada-store-2026
GCS_BUCKET_NAME=sampada-storage-87848430
GCS_KEY_FILE=./gcs-key.json

# Stripe (Main Store)
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Stripe (Designer Subscriptions)
NEXT_PUBLIC_STRIPE_DESIGNER_KEY=pk_live_xxx
STRIPE_DESIGNER_SECRET=sk_live_xxx
STRIPE_DESIGNER_PRO_PRICE_ID=price_xxx
STRIPE_DESIGNER_ULTRA_PRICE_ID=price_xxx
STRIPE_DESIGNER_WEBHOOK_SECRET=whsec_xxx

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Printify
PRINTIFY_API_KEY=your_printify_api_key
PRINTIFY_SHOP_ID=your_shop_id

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
SANITY_API_TOKEN=your_sanity_token

# Google AI
GOOGLE_AI_API_KEY=your_gemini_api_key
```

---

## 📱 Usage Instructions

### Free User Flow
1. Sign up/Login
2. Go to Designer (`/designer`)
3. Create design (2/month limit)
4. Save design
5. Preview on t-shirt

### Pro User Flow ($30/month)
1. Subscribe at `/subscription`
2. Create up to 50 designs/month
3. Export to Printify
4. Access analytics dashboard
5. No watermarks

### Ultra User Flow ($300/month)
1. Subscribe at `/subscription`
2. Unlimited designs
3. AI Image Generation
4. AI Design Assistant
5. Custom branding
6. Priority fulfillment

### Admin Access
- Admin Dashboard: `/admin/dashboard`
- Sanity Studio: `npx sanity dev` (localhost:3333)
- Prisma Studio: `npx prisma studio` (localhost:5555)
- Cloud Console: https://console.cloud.google.com

---

## 🔮 Future Roadmap (Q1 2026)

### Phase 1 (Week 1-2) - Stabilization
- [ ] Install Sanity plugins (Media Library, SEO Pane, Color Input)
- [ ] Create unified admin dashboard pulling from both Prisma + Sanity
- [ ] Set up Sanity webhooks for real-time inventory sync
- [ ] Implement AI-powered product recommendations (Prisma + Sanity)
- [ ] Complete Google Cloud SQL setup
- [ ] Google Pay UPI (India focus)
- [ ] Claude 4.5 Opus integration (Ultra AI assistant)
- [ ] Multi-product previews (hoodies/mugs)

### Phase 2 (Week 3-4) - Scale
- [ ] Redis caching (design templates)
- [ ] Analytics dashboard (Pro+)
- [ ] Bulk API (Ultra enterprise)
- [ ] CDN for thumbnails

### Phase 3 (Week 5+) - Revenue
- [ ] Affiliate program
- [ ] White-label stores
- [ ] 10k user load testing
- [ ] Mobile app (React Native)

### Revenue Goal
**$6K/month** = 100 Pro ($3K) + 10 Ultra ($3K) subscriptions

---

## 🔧 Maintenance Commands

```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND sampada" --limit=50

# Scale instances
gcloud run services update sampada --max-instances=10 --min-instances=0

# Backup database
gcloud sql backups create --instance=sampada-db

# List backups
gcloud sql backups list --instance=sampada-db

# Rollback deployment
gcloud run services update-traffic sampada --to-revisions=REVISION_ID=100%

# View current revisions
gcloud run revisions list --service=sampada
```

---

## 📁 Project Structure

```
Sampada-Store/
├── app/
│   ├── api/
│   │   ├── admin/stats/        # Dashboard metrics
│   │   ├── designs/            # Design CRUD
│   │   ├── templates/          # Template listing
│   │   ├── subscriptions/      # Stripe checkout
│   │   ├── webhooks/sanity/    # Sanity sync
│   │   └── user/               # User status
│   ├── admin/
│   │   └── dashboard/          # Admin dashboard
│   ├── designer/
│   │   ├── page.tsx            # Dashboard
│   │   ├── [id]/page.tsx       # Edit design
│   │   └── templates/page.tsx  # Gallery
│   ├── stories/                # Blog/Stories
│   └── subscription/page.tsx   # Pricing plans
├── components/
│   ├── admin/
│   │   ├── DashboardCard.tsx   # Metric cards
│   │   ├── RecentOrders.tsx    # Orders table
│   │   └── LowStockAlerts.tsx  # Stock alerts
│   └── designer/
│       ├── Canvas.tsx          # Fabric.js canvas
│       ├── Toolbar.tsx         # Design tools
│       ├── LayerPanel.tsx      # Layer management
│       ├── PropertiesPanel.tsx # Object properties
│       └── AIToolsPanel.tsx    # AI features (Ultra)
├── context/
│   └── DesignerContext.js      # State management
├── lib/
│   ├── auth.ts                 # Auth helpers
│   ├── db.ts                   # Prisma client
│   ├── gcs.ts                  # Cloud Storage
│   ├── sanity.js               # Sanity client
│   ├── sanityStories.js        # Stories queries
│   ├── stripe.ts               # Stripe client
│   └── unifiedData.ts          # Prisma + Sanity bridge
├── services/
│   └── ai/
│       ├── dynamicCollections.ts  # AI collections
│       ├── personalization.ts     # AI personalization
│       └── stylist.ts             # AI stylist
├── prisma/
│   └── schema.prisma           # Database schema
├── sanity_abscommerce/         # Sanity Studio
│   ├── schemaTypes/
│   │   ├── product.js
│   │   ├── post.js
│   │   └── banner.js
│   └── sanity.config.js
├── scripts/
│   ├── setup-cloud-sql.ps1     # Automated setup
│   ├── setup-cloud-sql.bat     # Batch version
│   └── verify-setup.js         # Config checker
├── docs/
│   ├── GOOGLE_CLOUD_DEPLOYMENT.md
│   ├── STANDARD_OPERATING_PROCEDURES.md
│   ├── MONITORING_AND_LOGGING.md
│   ├── TESTING_GUIDE.md
│   └── STUDIO.md               # Studio integration guide
├── styles/
│   └── AdminDashboard.module.css  # Dashboard styles
├── .env.example                # Template env vars
├── SETUP_GUIDE.md              # Quick setup guide
├── Errors.md                   # Error tracking
└── Story.md                    # This file!
```

---

## 💰 Cost Estimate (Monthly)

| Resource | Cost | Purpose |
|----------|------|---------|
| Cloud SQL (db-f1-micro) | ~$7-10 | PostgreSQL database (Prisma) |
| Cloud Storage (10GB) | ~$1-2 | Design thumbnails, assets |
| Cloud Run (low traffic) | ~$0-5 | Website hosting |
| Sanity (Free tier) | $0 | Up to 10K API calls/month |
| Domain (sampada.shop) | ~$1 | Domain registration |
| **Total** | **~$10-20/month** | Development phase |

**At Scale (1000+ users):**
- Cloud SQL: ~$50/month (connection pooling)
- Sanity Team Plan: ~$99/month (unlimited calls)
- CDN: ~$10/month (cached thumbnails)
- **Total: ~$160/month**

---

## ✅ Things Completed

### Infrastructure & Setup
- ✅ Google Cloud SQL PostgreSQL database configured
- ✅ Cloud Storage bucket for design assets
- ✅ Prisma ORM with complete schema
- ✅ Sanity CMS with product/post schemas
- ✅ Next.js 15 application structure
- ✅ Three-terminal development workflow
- ✅ IP whitelisting for database access

### Core Features
- ✅ Custom t-shirt designer with Fabric.js
- ✅ Subscription tiers (Free/Pro/Ultra)
- ✅ Stripe payment integration
- ✅ Printify export functionality
- ✅ Template gallery system
- ✅ User authentication (NextAuth)
- ✅ Design limit enforcement

### Content & UI
- ✅ Homepage with 3-category layout
- ✅ Stories/Blog hub with Sanity integration
- ✅ Navigation with megamenu
- ✅ Product catalog system
- ✅ Responsive mobile design

### Admin & Analytics
- ✅ **Premium Admin Dashboard** (Jan 19, 2026)
  - Color-coded metric cards (6 unique colors)
  - Left border accents (5px)
  - Subtle background tints
  - Lucide React icons
  - Navy blue AI Insights section
  - Recent Orders table
  - Low Stock Alerts with thumbnails
  - Red "Restock" button
- ✅ Prisma Studio integration (localhost:5555)
- ✅ Sanity Studio setup (localhost:3333)
- ✅ Dual studio architecture documented

### Documentation
- ✅ STUDIO.md - Complete integration guide
- ✅ GOOGLE_CLOUD_DEPLOYMENT.md
- ✅ STANDARD_OPERATING_PROCEDURES.md
- ✅ MONITORING_AND_LOGGING.md
- ✅ TESTING_GUIDE.md
- ✅ Story.md (this file) - Comprehensive guide
- ✅ Workflow examples for all major operations
- ✅ Beginner-friendly ELI5 section

### AI Integration
- ✅ Gemini Pro AI suggestions
- ✅ AI-powered dynamic collections
- ✅ AI personalization engine
- ✅ AI virtual stylist
- ✅ Product cache for fast lookups

---

## ⏳ Things To Be Done

### Immediate Priority (Week 1)
- [ ] Connect admin dashboard to live Prisma data (currently shows zeros)
- [ ] Install Sanity plugins (Media Library, SEO Pane, Color Input, Table)
- [ ] Set up Sanity webhooks for real-time sync
- [ ] Configure Cloud Scheduler for monthly limit resets
- [ ] Add interactive charts to admin dashboard
- [ ] Implement date range filters for metrics

### Short Term (Week 2-3)
- [ ] Deploy to Google Cloud Run
- [ ] Configure custom domains (sampada.shop, sampadastore.com)
- [ ] Set up Cloud DNS and SSL certificates
- [ ] Configure Google Cloud Logging
- [ ] Set up monitoring alerts
- [ ] Implement error tracking (Sentry)
- [ ] Add export functionality for reports

### Medium Term (Month 1-2)
- [ ] Google Pay UPI integration
- [ ] Redis caching for templates
- [ ] Analytics dashboard for Pro users
- [ ] Bulk design API for Ultra users
- [ ] CDN setup for thumbnails
- [ ] Email notification system
- [ ] Customer review system

### Long Term (Month 3+)
- [ ] Affiliate program
- [ ] White-label store functionality
- [ ] Mobile app (React Native)
- [ ] Multi-product support (hoodies, mugs)
- [ ] Advanced AI features (Claude 4.5 Opus)
- [ ] Load testing for 10K users
- [ ] International payment methods

### Nice to Have
- [ ] Dark mode for admin dashboard
- [ ] Real-time collaboration on designs
- [ ] Design version history
- [ ] Advanced analytics (heatmaps, user flow)
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG 2.1)

---

## 📞 Support & Contacts

| Role | Contact |
|------|---------|
| Developer | Binod (@binods1313) |
| Project Repo | github.com/binods1313/Sampada-Store |
| Cloud Project | sampada-store-2026 |
| Database | Cloud SQL (us-central1) |

---

## 📝 Changelog

### Jan 19, 2026
- ✅ **Major UI Update**: Admin dashboard redesigned to match homepage quality
- ✅ Added color-coded stat cards with unique accents (gold, blue, green, red, purple, pink)
- ✅ Implemented 5px left border accents and subtle background tints on cards
- ✅ Navy blue AI Insights section matching homepage footer
- ✅ Professional "Restock" button matching homepage CTA style
- ✅ Replaced emojis with Lucide React icons
- ✅ **Created STUDIO.md**: Comprehensive documentation of Prisma + Sanity integration
- ✅ Documented dual studio architecture with full workflows
- ✅ Added complete step-by-step workflows for all major operations
- ✅ Updated Story.md with studio integration details
- ✅ Visual parity achieved: Dashboard now matches homepage design standards
- ✅ Added "For Complete Beginners" ELI5 section
- ✅ Created comprehensive workflow examples
- ✅ Added "Things Completed" and "Things To Be Done" sections
- ✅ Fixed admin dashboard syntax error (pending Orders → pendingOrders)
- ✅ Created API route for dashboard stats (/api/admin/stats)
- ✅ Whitelisted IP (122.172.84.119) for Cloud SQL access

### Jan 16, 2026
- ✅ Fixed DATABASE_URL - Uncommented in .env.local to enable database connection
- ✅ Created Sanity `post` schema for Stories content (`sanity_abscommerce/schemaTypes/post.js`)
- ✅ Registered post schema in `schemaTypes/index.js`
- ✅ Created `lib/sanityStories.js` - Sanity query functions for stories
- ✅ Updated Stories page (`app/stories/page.tsx`) to fetch from Sanity
- ✅ Updated Story detail page (`app/stories/[slug]/page.tsx`) to fetch from Sanity
- ✅ Fixed API import paths (`pages/api/moderate/image.js`, `pages/api/products/*.js`)
- ✅ Fixed Next.js 15 async params in `app/designer/[id]/page.tsx`
- ✅ Fixed Next.js 15 async params in `app/stories/[slug]/page.tsx`
- ✅ Fixed Next.js 15 async params in `app/api/designs/[id]/route.ts`
- ✅ Updated `verify-setup.js` to check for `STRIPE_DESIGNER_SECRET`
- ✅ Removed embedded Sanity Studio route due to React 19.1 vs 19.2 compatibility issue
- ✅ Production build passes with `npx next build --no-lint`
- ⚠️ ESLint warnings exist but don't block functionality

### Jan 13, 2026
- ✅ Created designer dashboard with stats
- ✅ Implemented subscription page with pricing
- ✅ Built templates gallery
- ✅ Added PropertiesPanel and AIToolsPanel
- ✅ Created Cloud SQL setup scripts
- ✅ Fixed Prisma v7 compatibility (downgraded to 5.22.0)
- ✅ Added graceful error handling for missing database
- ✅ Created Story.md (this file)

### Jan 12, 2026
- ✅ Implemented Canvas, Toolbar, LayerPanel
- ✅ Created DesignerContext
- ✅ Set up API routes for designs
- ✅ Fixed tsconfig path aliases

---

**Next Check:** Weekly deploys  
**Last Updated:** Jan 20, 2026 | 7:30 PM IST
*Om Namah Sivaya* 🙏
