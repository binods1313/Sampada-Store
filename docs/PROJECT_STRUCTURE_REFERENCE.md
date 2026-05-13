# Sampada Store - Complete Project Structure Reference

**Generated**: May 10, 2026  
**Location**: E:\Sampada-Store  
**Purpose**: Comprehensive reference for developers working on the project

---

## 📁 FOLDER LAYOUT

### Root Directory Structure

```
E:\Sampada-Store/
├── abscommerce/                    # Legacy folder (mostly unused)
├── agency-agents/                  # Agent templates and configurations
├── app/                            # Next.js App Router (minimal usage)
│   └── api/                        # Some API routes
├── components/                     # React components (main UI)
│   ├── HomePage/                   # Homepage-specific components
│   ├── Product/                    # Product-related components
│   ├── admin/                      # Admin dashboard components
│   ├── stories/                    # Stories page components
│   ├── ui/                         # Reusable UI components
│   └── [various components].jsx
├── config/                         # Configuration files
├── context/                        # React Context providers
│   ├── CartContext.js
│   ├── CurrencyContext.js
│   ├── StateContext.js
│   └── ThemeContext.js
├── docs/                           # Documentation
├── hooks/                          # Custom React hooks
├── lib/                            # Utility libraries
│   ├── client.js                   # Sanity client
│   ├── printifyClient.js           # Printify API
│   ├── email.js                    # Email service
│   └── [various utilities]
├── pages/                          # Next.js Pages Router (main routing)
│   ├── api/                        # API routes
│   ├── admin/                      # Admin pages
│   ├── collections/                # Collection pages
│   ├── product/                    # Product detail pages
│   ├── stories/                    # Stories pages
│   ├── index.js                    # Homepage
│   ├── shop.jsx                    # Shop page
│   ├── about.js                    # About page
│   ├── contact.js                  # Contact page
│   ├── support.js                  # Support page
│   ├── company.js                  # Company page
│   ├── team.js                     # Team page
│   ├── account.js                  # User account
│   ├── wishlist.js                 # Wishlist page
│   └── success.js                  # Order success
├── public/                         # Static assets
│   ├── images/                     # Public images
│   └── assets/                     # Other static files
├── sanity_abscommerce/             # Sanity CMS Studio (MAIN CMS)
│   ├── schemaTypes/                # Content schemas
│   ├── plugins/                    # Custom Sanity plugins
│   ├── components/                 # Sanity Studio components
│   ├── scripts/                    # Migration scripts
│   └── sanity.config.js            # Sanity configuration
├── scripts/                        # Build and utility scripts
├── services/                       # Business logic services
├── styles/                         # CSS and styling
│   ├── globals.css                 # Global styles
│   ├── sampada-brand.css           # Brand system (MAIN)
│   └── [various module.css]
├── utils/                          # Utility functions
├── .env                            # Environment variables (DO NOT COMMIT)
├── .env.example                    # Environment template
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── sanity.config.js                # Root Sanity config
└── tailwind.config.js              # Tailwind CSS config
```

---

## 🎨 SANITY_ABSCOMMERCE FOLDER (CMS)

### Complete Structure

```
sanity_abscommerce/
├── .sanity/                        # Sanity build cache
├── components/                     # Custom Studio components
│   └── AIDescriptionInput.jsx      # AI-powered description generator
├── dist/                           # Build output
├── node_modules/                   # Dependencies
├── plugins/                        # Custom Sanity plugins
│   ├── bulk-edit/                  # Bulk editing tools
│   │   ├── BulkEditTool.jsx
│   │   └── BulkPriceUpdate.jsx
│   └── usersByProviderId.js        # User management plugin
├── schemaTypes/                    # Content type definitions (MAIN)
│   ├── aboutUs.js                  # About page schema
│   ├── banner.js                   # Homepage banner schema
│   ├── blockContent.js             # Rich text schema
│   ├── category.js                 # Product category schema
│   ├── company.js                  # Company page schema
│   ├── contactMessage.js           # Contact form submissions
│   ├── contactPage.js              # Contact page schema
│   ├── footerSettings.js           # Footer configuration
│   ├── index.js                    # Schema registry (MAIN EXPORT)
│   ├── navigation.js               # Navigation menu schema
│   ├── newsletterSubscriber.js     # Newsletter subscriptions
│   ├── order.js                    # Order schema
│   ├── product.js                  # Product schema (MAIN)
│   ├── seoFields.js                # Reusable SEO fields
│   ├── storiesPage.js              # Stories page schema
│   ├── story.js                    # Individual story schema
│   ├── support.js                  # Support page schema
│   ├── team.js                     # Team page schema
│   └── user.js                     # User schema
├── scripts/                        # Utility scripts
│   └── migrate-images.js           # Image migration tool
├── static/                         # Static assets for Studio
├── utils/                          # Utility functions
│   ├── documentHelpers.js          # Document manipulation
│   └── sanityClient.js             # Sanity client instance
├── .env                            # Sanity environment variables
├── .env.example                    # Sanity env template
├── package.json                    # Sanity dependencies
├── sanity.cli.js                   # Sanity CLI config
├── sanity.config.js                # Sanity Studio config (MAIN)
├── structure.js                    # Studio structure customization
└── vite.config.js                  # Vite build config
```

---

## 📦 NEXT.JS APP STRUCTURE

### Components Folder

```
components/
├── HomePage/                       # Homepage components
│   ├── SampadaNavbar.jsx           # Main navigation
│   ├── SampadaFooter.jsx           # Footer
│   ├── HomeHeroBanner.jsx          # Hero section
│   ├── CollectionsSection.jsx      # Collections showcase
│   └── [various].module.css
├── Product/                        # Product components
│   ├── ProductCard.jsx             # Product card
│   ├── ProductCarousel.jsx         # Product carousel
│   └── ProductFilters.jsx          # Filter UI
├── admin/                          # Admin dashboard
│   ├── AdminDashboard.jsx
│   ├── ProductManager.jsx
│   └── OrderManager.jsx
├── stories/                        # Stories page
│   ├── StoriesGrid.jsx
│   └── StoryCard.jsx
├── ui/                             # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   └── Modal.jsx
├── Cart.jsx                        # Shopping cart
├── Navbar.jsx                      # Alternative navbar
├── Footer.jsx                      # Alternative footer
├── ProductFilterSection.jsx        # Product filtering
├── NewsletterSection.jsx           # Newsletter signup
├── WhySampada.jsx                  # Value propositions
├── TrustStrip.jsx                  # Trust badges
└── [100+ other components]
```

### Pages Folder (Main Routing)

```
pages/
├── api/                            # API routes
│   ├── auth/                       # Authentication
│   ├── products/                   # Product APIs
│   ├── orders/                     # Order APIs
│   ├── stripe/                     # Stripe webhooks
│   ├── razorpay/                   # Razorpay integration
│   └── [various endpoints]
├── admin/                          # Admin pages
│   ├── index.js                    # Admin dashboard
│   ├── products.js                 # Product management
│   └── orders.js                   # Order management
├── collections/                    # Collection pages
│   └── [slug].js                   # Dynamic collection page
├── product/                        # Product pages
│   └── [slug].js                   # Dynamic product page
├── stories/                        # Stories pages
│   └── index.js                    # Stories listing
├── _app.js                         # App wrapper (MAIN)
├── _document.js                    # HTML document
├── index.js                        # Homepage (MAIN)
├── shop.jsx                        # Shop page
├── about.js                        # About page
├── contact.js                      # Contact page
├── support.js                      # Support page
├── company.js                      # Company page
├── team.js                         # Team page
├── account.js                      # User account
├── wishlist.js                     # Wishlist
└── success.js                      # Order success
```

---

## 📋 SCHEMA FILES

### 1. Product Schema (`sanity_abscommerce/schemaTypes/product.js`)

**Key Fields**:
```javascript
{
  name: 'product',
  fields: [
    // Basic Info
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'image', type: 'array' of: 'image' },
    { name: 'price', type: 'number' },
    { name: 'discount', type: 'number' },
    { name: 'category', type: 'reference' to: 'category' },
    { name: 'details', type: 'text' },
    
    // Product Specifications
    { name: 'specifications', type: 'array' of: {
        feature: 'string',
        value: 'string'
      }
    },
    
    // Variants (Color + Size combinations)
    { name: 'variants', type: 'array' of: {
        colorName: 'string',
        colorHex: 'string',
        size: 'string',
        variantPrice: 'number',
        variantDiscount: 'number',
        variantStock: 'number',
        variantImage: 'image'
      }
    },
    
    // Size Chart
    { name: 'sizeChart', type: 'image' },
    
    // Insights
    { name: 'specialty', type: 'text' },
    { name: 'pros', type: 'array' of: 'string' },
    { name: 'cons', type: 'array' of: 'string' },
    { name: 'bestUseCases', type: 'array' of: 'string' },
    
    // Inventory
    { name: 'inventory', type: 'number' },
    
    // Printify Integration
    { name: 'printifyIntegration', type: 'object', fields: [
        { name: 'isPrintifyProduct', type: 'boolean' },
        { name: 'printifyProductId', type: 'string' },
        { name: 'printifyBlueprintId', type: 'number' },
        { name: 'printProviderName', type: 'string' }
      ]
    },
    
    // Status
    { name: 'status', type: 'string', options: ['draft', 'active', 'archived'] },
    
    // SEO
    { name: 'seo', type: 'object' },
    
    // Colors (Visual Picker)
    { name: 'availableColors', type: 'array' of: 'color' }
  ],
  
  // Field Groups (Tabs in Studio)
  groups: [
    'basic', 'media', 'pricing', 'variants', 'content', 'seo', 'settings'
  ]
}
```

**Variant Structure**:
- Each variant = unique color + size combination
- Has own price, discount, stock, and image
- Falls back to base product price/discount if not set

---

### 2. Category Schema (`sanity_abscommerce/schemaTypes/category.js`)

**Key Fields**:
```javascript
{
  name: 'category',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'description', type: 'text' },
    { name: 'image', type: 'image', with: 'alt' },
    { name: 'seo', type: 'object' }
  ]
}
```

---

### 3. Homepage/Banner Schema (`sanity_abscommerce/schemaTypes/banner.js`)

**Key Fields**:
```javascript
{
  name: 'banner',
  fields: [
    { name: 'image', type: 'image' },
    { name: 'logo', type: 'image' },
    { name: 'buttonText', type: 'string' },
    { name: 'product', type: 'string' },
    { name: 'desc', type: 'string' },
    { name: 'smallText', type: 'string' },
    { name: 'midText', type: 'string' },
    { name: 'largeText1', type: 'string' },
    { name: 'largeText2', type: 'string' },
    { name: 'discount', type: 'string' },
    { name: 'saleTime', type: 'string' }
  ]
}
```

---

### 4. Other Key Schemas

**About Page** (`aboutUs.js`):
- Hero section
- Mission, vision, values
- Team members
- Impact metrics
- Contact CTA

**Contact Page** (`contactPage.js`):
- Hero section
- Introduction
- Contact information cards
- Contact form settings
- Social media links
- FAQ section

**Support Page** (`support.js`):
- Hero section
- Quick links
- Business hours
- FAQ categories
- Resources
- Ticket system CTA

**Company Page** (`company.js`):
- Mission, vision, values
- Company story
- Statistics
- Partners
- CTA

**Team Page** (`team.js`):
- Hero section
- Team members grid
- Join CTA

**Stories Page** (`storiesPage.js`):
- Hero section
- Featured stories
- Story grid
- Behind the shoot section

**Order** (`order.js`):
- User reference
- Order items
- Shipping details
- Payment info
- Status tracking

**User** (`user.js`):
- Name, email
- Authentication provider
- Role (customer/admin)
- Addresses
- Order history

---

## 🔌 PRINTIFY API SETUP

### Current Implementation

**File**: `lib/printifyClient.js`

```javascript
const PRINTIFY_BASE_URL = 'https://api.printify.com/v1';

export const printifyAPI = {
  headers: {
    'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
    'Content-Type': 'application/json'
  },

  // Fetch catalog products
  getCatalog: async () => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/catalog/blueprints.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Get your shop's products
  getShopProducts: async (shopId) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/products.json`, {
      headers: printifyAPI.headers
    });
    return response.json();
  },

  // Create order
  createOrder: async (shopId, orderData) => {
    const response = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders.json`, {
      method: 'POST',
      headers: printifyAPI.headers,
      body: JSON.stringify(orderData)
    });
    return response.json();
  }
};
```

### Environment Variables Required

```bash
# Get from: https://printify.com/app/settings/api
PRINTIFY_API_KEY="..."

# Get from: https://printify.com/app/stores
PRINTIFY_SHOP_ID="..."
```

### Product Integration

Products can be marked as Printify products in Sanity:

```javascript
printifyIntegration: {
  isPrintifyProduct: true,
  printifyProductId: "abc123",
  printifyBlueprintId: 5,
  printProviderName: "Gooten"
}
```

### Mock Data Structure (if not connected)

```javascript
// Example product with Printify data
{
  _id: "product-1",
  name: "Custom T-Shirt",
  slug: { current: "custom-t-shirt" },
  price: 29.99,
  discount: 10,
  category: { _ref: "category-1" },
  variants: [
    {
      colorName: "Black",
      colorHex: "#000000",
      size: "M",
      variantStock: 50,
      variantPrice: 29.99
    }
  ],
  printifyIntegration: {
    isPrintifyProduct: true,
    printifyProductId: "5d39b411749d0a0007c6c30c",
    printifyBlueprintId: 5,
    printProviderName: "Gooten"
  }
}
```

---

## 📦 VERSIONS

### Next.js Version

**Current**: `16.1.6` (Latest)

```json
// package.json
{
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
```

**Features Used**:
- Pages Router (main routing)
- App Router (minimal usage)
- API Routes
- Image Optimization
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)

---

### Sanity Version

**Current**: `5.24.0` (Latest v5)

```json
// sanity_abscommerce/package.json
{
  "dependencies": {
    "sanity": "^5.24.0",
    "@sanity/cli": "^6.1.5",
    "@sanity/vision": "^5.24.0",
    "@sanity/image-url": "^1.1.0"
  }
}
```

**Sanity Project Details**:
- **Project ID**: `7lh35oho`
- **Dataset**: `production`
- **API Version**: `2024-05-18`
- **Studio URL**: `https://abscommerce.sanity.studio` (or local)

---

### Key Dependencies

**Frontend**:
- React: `19.1.0`
- Next.js: `16.1.6`
- Tailwind CSS: `4.1.6`
- Framer Motion: `12.7.4`
- Styled Components: `6.1.17`

**Sanity**:
- Sanity: `5.24.0`
- Next-Sanity: `9.10.2`
- @sanity/client: `6.29.1`
- @sanity/image-url: `1.1.0`

**Payment**:
- Stripe: `8.209.0`
- @stripe/stripe-js: `1.54.2`
- Razorpay: `2.9.6`

**Authentication**:
- NextAuth: `4.24.11`
- next-auth-sanity: `1.5.3`

**AI/ML**:
- @google/generative-ai: `0.24.1`
- @google-cloud/vision: `5.3.5`

**Email**:
- @sendgrid/mail: `8.1.5`

**Utilities**:
- date-fns: `4.1.0`
- lodash: `4.17.21`
- sharp: `0.34.5` (image processing)

---

## 🗂️ DATA FLOW

### Product Data Flow

```
Sanity CMS (sanity_abscommerce)
    ↓
Product Schema (product.js)
    ↓
Sanity Client (lib/client.js)
    ↓
Next.js API/SSR (pages/api/* or getServerSideProps)
    ↓
React Components (components/Product/*)
    ↓
User Interface
```

### Order Flow

```
User adds to cart (CartContext)
    ↓
Checkout (pages/api/checkout)
    ↓
Payment Gateway (Stripe/Razorpay)
    ↓
Webhook (pages/api/webhooks/*)
    ↓
Create Order in Sanity (order.js schema)
    ↓
Send to Printify (if applicable)
    ↓
Email Confirmation (SendGrid)
```

---

## 🎨 STYLING SYSTEM

### Brand System

**Main File**: `styles/sampada-brand.css`

**Colors**:
- Cream: `#FAF6F0` (light backgrounds)
- Crimson: `#8B1A1A` (primary brand color)
- Gold: `#C9A96E` (accents, buttons)
- Dark: `#1A0A08` (dark backgrounds, text)

**Typography**:
- Headings: Cormorant Garamond (serif)
- Body: Inter (sans-serif)

**Components**:
- `.section-light` - Cream background
- `.section-dark` - Dark background
- `.section-crimson` - Crimson background
- `.s-heading` - Serif headings
- `.s-label` - Uppercase labels
- `.s-card` - White cards
- `.btn-cta-primary` - Gold button

---

## 🔐 ENVIRONMENT VARIABLES

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Sanity (auto-configured in sanity_abscommerce/.env)
NEXT_PUBLIC_SANITY_PROJECT_ID="7lh35oho"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_DESIGNER_KEY="pk_test_..."

# Razorpay
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."

# Google AI
GOOGLE_AI_API_KEY="AIzaSy..."

# SendGrid
SENDGRID_API_KEY="SG...."

# Printify
PRINTIFY_API_KEY="..."
PRINTIFY_SHOP_ID="..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://..."

# Base URLs
NEXT_PUBLIC_BASE_URL="https://..."
```

See `.env.example` for complete list.

---

## 🚀 DEPLOYMENT

### Current Setup

**Platform**: Google Cloud Run  
**URL**: `https://sampada-xoa6kn2lwa-uc.a.run.app`  
**Database**: Cloud SQL PostgreSQL  
**Storage**: Google Cloud Storage

### Build Commands

```bash
# Install dependencies
npm install

# Build Next.js app
npm run build

# Start production server
npm start

# Build Sanity Studio
cd sanity_abscommerce
npm run build
```

---

## 📚 DOCUMENTATION FILES

Key documentation in `docs/` folder:
- `BRAND_CONSISTENCY_COMPLETE.md` - Brand system documentation
- `ADMIN_DASHBOARD.md` - Admin features
- `PUBLIC_APIS_IMPLEMENTATION.md` - API integrations
- `DEPLOYMENT_GUIDE_HOSTINGER.md` - Deployment guide
- `PROJECT_STRUCTURE_REFERENCE.md` - This file

---

## 🔗 USEFUL LINKS

- **Sanity Studio**: https://abscommerce.sanity.studio
- **Sanity Manage**: https://sanity.io/manage
- **Printify Dashboard**: https://printify.com/app
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Razorpay Dashboard**: https://dashboard.razorpay.com
- **Google Cloud Console**: https://console.cloud.google.com

---

## 📞 SUPPORT

For questions about this project structure, refer to:
1. This documentation
2. Code comments in key files
3. Sanity schema files for content structure
4. `.env.example` for configuration options

---

**Last Updated**: May 10, 2026  
**Maintained By**: Development Team  
**Version**: 1.0.0
