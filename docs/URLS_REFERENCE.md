# Sampada-Store URLs Reference

Complete list of all routes and URLs in the Sampada-Store application.

---

## 🆕 New Pretext Integration URLs

Added as part of the Pretext text layout engine integration.

| URL | Description | Status |
|-----|-------------|--------|
| `/shop` | Virtual scrolling product list with filters and sort | ✅ Live |
| `/pretext-demo` | Interactive Pretext features showcase with live demos | ✅ Live |

---

## 🏠 Main Site URLs

Core pages of the e-commerce store.

| URL | Description | Status |
|-----|-------------|--------|
| `/` | Homepage with featured products | ✅ Live |
| `/about` | About page | ✅ Live |
| `/contact` | Contact page | ✅ Live |
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

## 🔧 Admin & API URLs

Backend and administrative routes.

| URL | Description | Status |
|-----|-------------|--------|
| `/admin` | Admin dashboard (Sanity Studio) | ✅ Live |
| `/api/*` | API endpoints | ✅ Live |

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

---

## 📚 Documentation URLs

Internal documentation files.

| File | Description |
|------|-------------|
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

---

## 🔗 Quick Links

### External Resources
- **GitHub Repository:** https://github.com/binods1313/Sampada-Store
- **Pretext Library:** https://github.com/chenglou/pretext
- **Pretext Documentation:** https://pretext.wiki/
- **Sanity Studio:** https://www.sanity.io/

### Local Development
- **Next.js Dev Server:** http://localhost:3000
- **Sanity Studio (local):** http://localhost:3333

---

## 📝 URL Patterns

### Dynamic Routes
```
/product/[slug]       → Single product by slug
/products/[id]        → Product edit by ID
/collections/[slug]   → Collection by slug
```

### Query Parameters
```
/shop?category=tshirts&sort=price-asc
/shop?priceRange=0-5000&sortBy=popular
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

---

**Last Updated:** March 31, 2026  
**Version:** 1.0.0
