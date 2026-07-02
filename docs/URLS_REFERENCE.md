# Sampada-Store URLs Reference

Complete list of all routes and URLs in the Sampada-Store application.

**Last Updated:** April 8, 2026  
**Version:** 2.0.0  

---

## 🆕 New Pretext Integration URLs

Added as part of the Pretext text layout engine integration.

| URL | Description | Status |
|-----|-------------|--------|
| `/shop` | Virtual scrolling product list with filters and sort | ✅ Live |
| `/pretext-demo` | Interactive Pretext features showcase with live demos | ✅ Live |

---

## 🆕 New AI Product Admin URLs (April 2026)

Added as part of the AI Product Admin integration.

| URL | Description | Status |
|-----|-------------|--------|
| `/admin/products/add` | Add new product with AI-powered description generator | ✅ Live |
| `/admin/products/edit/[id]` | Edit existing product with AI regeneration | ✅ Live |
| `/admin/seo/bulk-generate` | Bulk SEO generator for all products | ✅ Live |
| `/admin/ai-usage` | AI usage analytics dashboard | ✅ Live |
| `/admin/products` | Product list management | ✅ Live |
| `/admin/orders` | Order management | ✅ Live |
| `/admin/categories` | Category management | ✅ Live |
| `/admin/analytics` | Analytics dashboard | ✅ Live |
| `/admin/login` | Admin login page | ✅ Live |
| `/admin/bulk-tag` | Bulk tag products | ✅ Live |

---

## 🏠 Main Site URLs

Core pages of the e-commerce store.

| URL | Description | Status |
|-----|-------------|--------|
| `/` | Homepage with featured products | ✅ Live |
| `/about` | About page | ✅ Live |
| `/contact` | Contact page with SendGrid integration | ✅ Live |
| `/stories` | Stories/Blog page | ✅ Live |
| `/account` | User account dashboard | ✅ Live |
| `/wishlist` | User wishlist | ✅ Live |
| `/success` | Order success confirmation | ✅ Live |

---

## 🛍️ Product URLs

Product-related pages and routes.

| URL | Description | Status |
|-----|-------------|--------|
| `/product/[slug]` | Individual product detail page (SEO-friendly) | ✅ Live |
| `/products/[id]` | Product edit page (admin/internal) | ✅ Live |
| `/collections/[slug]` | Collection/Category pages | ✅ Live |

---

## 🤖 AI Feature URLs

AI-powered features and demos.

| URL | Description | Status |
|-----|-------------|--------|
| `/ai-demo` | AI features demonstration and testing | ✅ Live |
| `/api/ai` | AI API endpoint (OpenRouter integration) | ✅ Live |
| `/api/ai/models` | Available AI models endpoint | ✅ Live |

---

## 💬 Support & Chat URLs

Customer support and communication.

| URL | Description | Status |
|-----|-------------|--------|
| `/api/support-chat` | AI support chat API endpoint | ✅ Live |
| `/api/contact` | Contact form API (SendGrid) | ✅ Live |

---

## 🔧 Admin URLs

Backend and administrative routes.

### **Admin Dashboard**
| URL | Description | Status |
|-----|-------------|--------|
| `/admin` | Admin dashboard | ✅ Live |
| `/admin/login` | Admin authentication | ✅ Live |

### **Product Management**
| URL | Description | Status |
|-----|-------------|--------|
| `/admin/products` | Product list | ✅ Live |
| `/admin/products/add` | Add new product with AI | ✅ Live |
| `/admin/products/edit/[id]` | Edit product with AI | ✅ Live |

### **Order Management**
| URL | Description | Status |
|-----|-------------|--------|
| `/admin/orders` | Order list and management | ✅ Live |

### **Category Management**
| URL | Description | Status |
|-----|-------------|--------|
| `/admin/categories` | Category management | ✅ Live |

### **SEO Tools**
| URL | Description | Status |
|-----|-------------|--------|
| `/admin/seo/bulk-generate` | Bulk SEO generator | ✅ Live |

### **Analytics & Monitoring**
| URL | Description | Status |
|-----|-------------|--------|
| `/admin/analytics` | Analytics dashboard | ✅ Live |
| `/admin/ai-usage` | AI usage analytics | ✅ Live |

### **Bulk Operations**
| URL | Description | Status |
|-----|-------------|--------|
| `/admin/bulk-tag` | Bulk tag products | ✅ Live |

---

## 🔌 API Endpoints

All API routes and their purposes.

### **AI & Machine Learning**
| URL | Method | Description |
|-----|--------|-------------|
| `/api/ai` | POST | AI text generation (descriptions, chat, SEO) |
| `/api/ai/models` | GET | List available AI models |
| `/api/support-chat` | POST | AI customer support chat |

### **Products**
| URL | Method | Description |
|-----|--------|-------------|
| `/api/products` | GET | List all products |
| `/api/products/[id]` | GET | Get single product |
| `/api/products/bulk-update` | POST | Bulk update products |

### **Orders & Checkout**
| URL | Method | Description |
|-----|--------|-------------|
| `/api/checkout` | POST | Create checkout session (Stripe) |
| `/api/orders` | GET | List user orders |
| `/api/orders/[id]` | GET | Get order details |
| `/api/webhooks/stripe` | POST | Stripe webhook handler |

### **Communication**
| URL | Method | Description |
|-----|--------|-------------|
| `/api/contact` | POST | Contact form submission (SendGrid) |
| `/api/mailchimp/subscribe` | POST | Newsletter subscription |
| `/api/mailchimp/abandoned-cart` | POST | Track abandoned cart |
| `/api/mailchimp/post-purchase` | POST | Post-purchase email trigger |
| `/api/mailchimp/stats` | GET | Mailchimp audience stats |

### **Address & Validation**
| URL | Method | Description |
|-----|--------|-------------|
| `/api/lob/validate-address` | POST | Address validation (Lob.com) |
| `/api/klarna/create-session` | POST | Create Klarna payment session |

### **Authentication**
| URL | Method | Description |
|-----|--------|-------------|
| `/api/auth/[...nextauth]` | ALL | NextAuth authentication |

---

## 🧪 Test & Demo URLs

Development and testing pages.

| URL | Description | Status |
|-----|-------------|--------|
| `/ai-demo` | AI features demonstration | ✅ Live |
| `/error-test-suite` | Error handling test suite | ✅ Live |
| `/fallback-demo` | Fallback UI examples | ✅ Live |
| `/image-optimizer-test` | Image optimization tests | ✅ Live |
| `/enhanced-error-handler-demo` | Enhanced error handler demo | ✅ Live |
| `/simple-test` | Simple test page | ✅ Live |
| `/test-error-component` | Error component test | ✅ Live |
| `/test-error-api` | Error API test | ✅ Live |

---

## 📚 Documentation URLs

Internal documentation files.

| File | Description |
|------|-------------|
| `/docs/AI_PRODUCT_ADMIN_COMPLETE.md` | AI Product Admin implementation guide |
| `/docs/AGENCY_AGENTS_REFERENCE.md` | 147 AI agents reference |
| `/docs/PUBLIC_APIS_IMPLEMENTATION.md` | Public APIs implementation guide |
| `/docs/PUBLIC_APIS_PHASE1_COMPLETE.md` | Phase 1 APIs completion report |
| `/docs/PUBLIC_APIS_PHASE2_COMPLETE.md` | Phase 2 APIs completion report |
| `/docs/PUBLIC_APIS_PHASE3_COMPLETE.md` | Phase 3 APIs completion report |
| `/docs/PRETEXT_INTEGRATION.md` | Complete Pretext integration guide |
| `/docs/URLS_REFERENCE.md` | This file - URL reference |
| `/docs/AI_INTEGRATION_SUMMARY.md` | AI features documentation |
| `/docs/AI_MULTI_MODEL_SETUP.md` | Multi-model AI setup |
| `/docs/CONTACT_PAGE_IMPLEMENTATION.md` | Contact page implementation |
| `/docs/DYNAMIC_FOOTER_IMPLEMENTATION.md` | Dynamic footer guide |
| `/docs/GET_SANITY_WRITE_TOKEN.md` | Sanity token setup |
| `/docs/OPENROUTER_INTEGRATION.md` | OpenRouter AI integration |
| `/docs/ORDER_RESOLUTION.md` | Order handling documentation |
| `/docs/STORIES_PAGE_IMPLEMENTATION.md` | Stories page guide |
| `/docs/STRIPE_WEBHOOK_SETUP.md` | Stripe webhook setup |
| `/docs/VERCEL_DEPLOYMENT.md` | Vercel deployment guide |
| `/docs/NEXT_TASKS.md` | Next tasks and roadmap |

---

## 🔗 Quick Links

### External Resources
- **GitHub Repository:** https://github.com/binods1313/Sampada-Store
- **Pretext Library:** https://github.com/chenglou/pretext
- **Pretext Documentation:** https://pretext.wiki/
- **Sanity Studio:** https://www.sanity.io/
- **OpenRouter:** https://openrouter.ai/
- **Stripe:** https://stripe.com/
- **SendGrid:** https://sendgrid.com/
- **Mailchimp:** https://mailchimp.com/
- **Klarna:** https://www.klarna.com/
- **Lob.com:** https://lob.com/

### Local Development
- **Next.js Dev Server:** http://localhost:3000
- **Sanity Studio (local):** http://localhost:3333

---

## 📝 URL Patterns

### Dynamic Routes
```
/product/[slug]              → Single product by slug
/products/[id]               → Product edit by ID
/collections/[slug]          → Collection by slug
/admin/products/edit/[id]    → Edit product by ID
```

### Query Parameters
```
/shop?category=tshirts&sort=price-asc
/shop?priceRange=0-5000&sortBy=popular
/admin/seo/bulk-generate?type=meta-description
```

### API Endpoints
```
/api/ai                              → AI text generation
/api/ai/models                       → Available models
/api/products                        → Product list
/api/products/[id]                   → Single product
/api/products/bulk-update            → Bulk update
/api/checkout                        → Stripe checkout
/api/webhooks/stripe                 → Stripe webhook
/api/contact                         → SendGrid email
/api/mailchimp/[action]              → Mailchimp operations
/api/lob/validate-address            → Address validation
/api/klarna/create-session           → Klarna payment
/api/auth/[...nextauth]              → Authentication
```

---

## 🎯 Featured Implementations

### Pretext-Powered Components
The following URLs showcase Pretext text layout engine:

1. **`/shop`** - Virtual scrolling with accurate row heights
2. **`/pretext-demo`** - Full feature showcase
3. **Product Cards** (homepage) - Zero layout shift
4. **AI Chat Widget** (all pages) - 60fps streaming
5. **Review System** - Zero CLS in masonry layout

### AI-Powered Admin Features
The following URLs showcase AI integration:

1. **`/admin/products/add`** - AI description generator with tone/length/templates
2. **`/admin/products/edit/[id]`** - Edit products with AI regeneration
3. **`/admin/seo/bulk-generate`** - Bulk SEO for all products
4. **`/admin/ai-usage`** - AI usage analytics dashboard
5. **Support Chat Widget** (all pages) - 24/7 AI customer support

### Public API Integrations
The following integrations are complete and live:

1. **Currency Conversion** - 150+ currencies (cdn.jsdelivr.net)
2. **VAT Validation** - EU B2B compliance (VATlayer)
3. **IFSC Validation** - Indian banking (Razorpay)
4. **Mailchimp** - Email marketing automation
5. **Google Analytics 4** - E-commerce tracking
6. **Clearbit** - B2B company logo display
7. **Klarna** - Buy Now Pay Later (BNPL)
8. **Lob.com** - Address validation

---

## 🔐 Admin Dashboard Login Credentials

**Use these credentials to access the admin dashboard:**

| Field | Value |
|-------|-------|
| **Admin Email** | `admin@sampada.com` |
| **Admin Password** | `admin123` |

**⚠️ Security Note:** These are default credentials. Change them in production by updating `config/admin-auth.json`.

---

## 🌐 Full URLs for Testing (Copy-Paste Ready)

**Replace `http://localhost:3000` with your production URL when deployed.**

### 🏠 Main Site Pages

```
http://localhost:3000/                          # Homepage
http://localhost:3000/about                     # About Page
http://localhost:3000/contact                   # Contact Page
http://localhost:3000/stories                   # Stories/Blog Page
http://localhost:3000/account                   # User Account Dashboard
http://localhost:3000/wishlist                  # User Wishlist
http://localhost:3000/success                   # Order Success Page
http://localhost:3000/shop                      # Shop with Virtual Scrolling
http://localhost:3000/pretext-demo              # Pretext Features Demo
http://localhost:3000/ai-demo                   # AI Features Demo
```

### 🛍️ Product Pages

```
http://localhost:3000/product/aurora-sky-pulse  # Example Product (replace slug)
http://localhost:3000/collections/all           # All Products Collection
http://localhost:3000/collections/clothing      # Clothing Collection (example)
```

### 🔐 Admin Dashboard

```
http://localhost:3000/admin/login               # Admin Login Page
http://localhost:3000/admin                     # Admin Dashboard (requires login)
http://localhost:3000/admin/products            # Product List
http://localhost:3000/admin/products/add         # Add New Product with AI
http://localhost:3000/admin/products/edit/[ID]   # Edit Product (replace [ID] with actual product ID)
http://localhost:3000/admin/orders              # Order Management
http://localhost:3000/admin/categories          # Category Management
http://localhost:3000/admin/analytics           # Analytics Dashboard
http://localhost:3000/admin/ai-usage            # AI Usage Dashboard
http://localhost:3000/admin/seo/bulk-generate   # Bulk SEO Generator
http://localhost:3000/admin/bulk-tag            # Bulk Tag Products
```

### 💬 AI Features

```
http://localhost:3000/ai-demo                   # AI Demo Page
http://localhost:3000/api/ai                    # AI API Endpoint (POST)
http://localhost:3000/api/ai/models             # Available AI Models
```

### 🧪 Test & Demo Pages

```
http://localhost:3000/ai-demo                   # AI Features Demo
http://localhost:3000/error-test-suite          # Error Handling Test Suite
http://localhost:3000/fallback-demo             # Fallback UI Examples
http://localhost:3000/image-optimizer-test      # Image Optimization Tests
http://localhost:3000/enhanced-error-handler-demo  # Enhanced Error Handler Demo
http://localhost:3000/simple-test               # Simple Test Page
http://localhost:3000/test-error-component      # Error Component Test
http://localhost:3000/test-error-api            # Error API Test
```

### 📚 Local Development Tools

```
http://localhost:3000                           # Main Site
http://localhost:3333                           # Sanity Studio (if running locally)
```

---

## 📊 Route Statistics

| Category | Count | Status |
|----------|-------|--------|
| Main Site Pages | 10 | ✅ All Live |
| Product Pages | 3+ | ✅ All Live |
| Admin Pages | 11 | ✅ All Live |
| AI Feature Pages | 3 | ✅ All Live |
| Test/Demo Pages | 8 | ✅ All Live |
| API Endpoints | 15+ | ✅ All Live |
| **Total Routes** | **50+** | ✅ **All Live** |

---

**Last Updated:** April 8, 2026  
**Version:** 2.1.0  
**Maintained By:** Development Team
