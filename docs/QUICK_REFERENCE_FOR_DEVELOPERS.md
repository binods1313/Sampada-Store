# Sampada Store - Quick Reference for Developers

**TL;DR**: Everything you need to know to start coding on Sampada Store

---

## 🚀 QUICK START

### Project Location
```
E:\Sampada-Store
```

### Tech Stack
- **Frontend**: Next.js 16.1.6 + React 19.1.0
- **CMS**: Sanity 5.24.0
- **Styling**: Tailwind CSS 4.1.6 + Custom CSS
- **Payments**: Stripe + Razorpay
- **Fulfillment**: Printify API
- **Deployment**: Google Cloud Run

---

## 📁 KEY FOLDERS

### 1. **`sanity_abscommerce/`** - The CMS (MOST IMPORTANT)
```
sanity_abscommerce/
├── schemaTypes/          # Content schemas (product, category, etc.)
│   ├── product.js        # ⭐ MAIN PRODUCT SCHEMA
│   ├── category.js       # Product categories
│   ├── banner.js         # Homepage banner
│   └── index.js          # Schema registry
├── sanity.config.js      # Sanity Studio configuration
└── package.json          # Sanity dependencies
```

**Sanity Project**:
- Project ID: `7lh35oho`
- Dataset: `production`
- API Version: `2024-05-18`

### 2. **`pages/`** - Next.js Pages (Main Routing)
```
pages/
├── index.js              # Homepage
├── shop.jsx              # Shop page
├── product/[slug].js     # Product detail page
├── collections/[slug].js # Collection page
├── about.js              # About page
├── contact.js            # Contact page
├── support.js            # Support page
└── api/                  # API routes
```

### 3. **`components/`** - React Components
```
components/
├── HomePage/             # Homepage components
│   ├── SampadaNavbar.jsx
│   ├── SampadaFooter.jsx
│   └── HomeHeroBanner.jsx
├── Product/              # Product components
└── admin/                # Admin dashboard
```

### 4. **`styles/`** - Styling
```
styles/
├── sampada-brand.css     # ⭐ MAIN BRAND SYSTEM
├── globals.css           # Global styles
└── [various].module.css  # Component styles
```

---

## 📋 PRODUCT SCHEMA (MOST IMPORTANT)

**File**: `sanity_abscommerce/schemaTypes/product.js`

### Core Fields
```javascript
{
  name: 'product',
  fields: [
    // Basic
    name: string,
    slug: slug,
    image: array<image>,
    price: number,
    discount: number,
    category: reference<category>,
    details: text,
    
    // Variants (Color + Size)
    variants: array<{
      colorName: string,
      colorHex: string,
      size: string,
      variantPrice: number,
      variantDiscount: number,
      variantStock: number,
      variantImage: image
    }>,
    
    // Printify Integration
    printifyIntegration: {
      isPrintifyProduct: boolean,
      printifyProductId: string,
      printifyBlueprintId: number,
      printProviderName: string
    },
    
    // Status
    status: 'draft' | 'active' | 'archived'
  ]
}
```

### Variant System
- Each variant = unique **color + size** combination
- Has own price, discount, stock, and image
- Falls back to base product values if not set

---

## 🔌 PRINTIFY API

**File**: `lib/printifyClient.js`

### Setup
```javascript
const PRINTIFY_BASE_URL = 'https://api.printify.com/v1';

export const printifyAPI = {
  getCatalog: async () => { ... },
  getShopProducts: async (shopId) => { ... },
  createOrder: async (shopId, orderData) => { ... }
};
```

### Environment Variables
```bash
PRINTIFY_API_KEY="..."        # From Printify settings
PRINTIFY_SHOP_ID="..."        # From Printify stores
```

### Product Integration
Mark products as Printify in Sanity:
```javascript
printifyIntegration: {
  isPrintifyProduct: true,
  printifyProductId: "abc123",
  printifyBlueprintId: 5,
  printProviderName: "Gooten"
}
```

---

## 🎨 BRAND SYSTEM

**File**: `styles/sampada-brand.css`

### Colors
```css
--s-cream:    #FAF6F0;  /* Light backgrounds */
--s-crimson:  #8B1A1A;  /* Primary brand */
--s-gold:     #C9A96E;  /* Accents, buttons */
--s-dark:     #1A0A08;  /* Dark backgrounds */
```

### Typography
```css
--s-serif:    'Cormorant Garamond';  /* Headings */
--s-sans:     'Inter';                /* Body text */
```

### Key Classes
```css
.section-light      /* Cream background */
.section-dark       /* Dark background */
.section-crimson    /* Crimson background */
.s-heading          /* Serif headings */
.s-card             /* White cards */
.btn-cta-primary    /* Gold button */
```

---

## 🔐 ENVIRONMENT VARIABLES

**File**: `.env` (copy from `.env.example`)

### Essential Variables
```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="7lh35oho"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_DESIGNER_KEY="pk_test_..."

# Razorpay
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."

# Printify
PRINTIFY_API_KEY="..."
PRINTIFY_SHOP_ID="..."

# Google AI
GOOGLE_AI_API_KEY="AIzaSy..."

# SendGrid
SENDGRID_API_KEY="SG...."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://..."
```

---

## 🗂️ DATA FLOW

### Product Display Flow
```
Sanity CMS
  ↓ (GROQ query)
lib/client.js
  ↓ (getServerSideProps)
pages/product/[slug].js
  ↓ (props)
Product Components
  ↓
User sees product
```

### Order Flow
```
User adds to cart
  ↓
CartContext
  ↓
Checkout API
  ↓
Stripe/Razorpay
  ↓
Webhook
  ↓
Create Order in Sanity
  ↓
Send to Printify (if applicable)
  ↓
Email confirmation
```

---

## 🛠️ COMMON TASKS

### 1. Add New Product Field
```javascript
// 1. Edit: sanity_abscommerce/schemaTypes/product.js
defineField({
  name: 'newField',
  title: 'New Field',
  type: 'string'
})

// 2. Restart Sanity Studio
cd sanity_abscommerce
npm run dev

// 3. Update frontend to display new field
// pages/product/[slug].js
```

### 2. Create New Page
```javascript
// 1. Create schema: sanity_abscommerce/schemaTypes/newPage.js
// 2. Add to index: sanity_abscommerce/schemaTypes/index.js
// 3. Create page: pages/new-page.js
// 4. Add to navigation: components/HomePage/SampadaNavbar.jsx
```

### 3. Update Styling
```css
/* Edit: styles/sampada-brand.css */
.new-component {
  background: var(--s-cream);
  color: var(--s-text-heading);
}
```

### 4. Add API Endpoint
```javascript
// Create: pages/api/new-endpoint.js
export default async function handler(req, res) {
  // Your logic here
  res.status(200).json({ success: true });
}
```

---

## 📦 VERSIONS

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.1.0 |
| Sanity | 5.24.0 |
| Tailwind CSS | 4.1.6 |
| Stripe | 8.209.0 |
| Razorpay | 2.9.6 |

---

## 🚀 DEVELOPMENT COMMANDS

```bash
# Install dependencies
npm install

# Run Next.js dev server
npm run dev

# Run Sanity Studio
cd sanity_abscommerce
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📚 DOCUMENTATION

Full documentation available in:
- `docs/PROJECT_STRUCTURE_REFERENCE.md` - Complete structure
- `docs/BRAND_CONSISTENCY_COMPLETE.md` - Brand system
- `docs/ADMIN_DASHBOARD.md` - Admin features
- `.env.example` - All environment variables

---

## 🔗 IMPORTANT LINKS

- **Sanity Studio**: https://abscommerce.sanity.studio
- **Sanity Manage**: https://sanity.io/manage
- **Printify**: https://printify.com/app
- **Stripe**: https://dashboard.stripe.com
- **Razorpay**: https://dashboard.razorpay.com
- **Live Site**: https://sampada-xoa6kn2lwa-uc.a.run.app

---

## 💡 TIPS

1. **Always check Sanity schemas first** - They define the data structure
2. **Use brand CSS classes** - Don't create custom colors
3. **Test with variants** - Products have color/size combinations
4. **Check .env.example** - For all required environment variables
5. **Read existing code** - Patterns are established, follow them

---

## 🆘 COMMON ISSUES

### Issue: Sanity data not showing
**Solution**: Check API token in `.env` and Sanity project ID

### Issue: Images not loading
**Solution**: Check Sanity image URL builder in `lib/client.js`

### Issue: Printify not working
**Solution**: Verify `PRINTIFY_API_KEY` and `PRINTIFY_SHOP_ID`

### Issue: Styles not applying
**Solution**: Check if `sampada-brand.css` is imported in `_app.js`

---

**Need More Details?** See `docs/PROJECT_STRUCTURE_REFERENCE.md`

**Last Updated**: May 10, 2026
