# Sampada Store — Project Structure Reference

**Last updated:** July 18, 2026
**Framework:** Next.js 16 (Pages Router)
**Live URL:** https://sampadaoriginals.in
**GitHub:** https://github.com/binods1313/Sampada-Store
**Sanity Project ID:** 7lh35oho

---

## Recent Changes (July 2026)

- **Portable Text: inline image blocks supported** — `sanity_abscommerce/schemaTypes/blockContent.js` and several document schemas were updated to allow inline `{ type: 'image' }` blocks with `alt` and `caption` fields. This enables authors to insert images directly into rich text.
- **Frontend renderer: PortableText image handler added** — A shared renderer component was added at `components/PortableTextComponents.jsx` and wired into existing renderers (`pages/blog/[slug].jsx`, `pages/about.js`, `pages/stories/[slug].js`, `components/ProductTabs.jsx`). It uses `lib/client.js`'s `urlFor()` helper to build image URLs and renders `<figure>/<img>/<figcaption>` for `_type: 'image'` blocks.
- **Sanity schema root clarified** — The active Studio imports `sanity_abscommerce/schemaTypes`. A duplicate path exists under `abscommerce/sanity_abscommerce/schemaTypes`; make edits in the active `sanity_abscommerce/` folder.
- **Other fixes and improvements** — minor styling and accessibility updates across hero cards, legal pages, and mobile overflow.

---


```css
--sampada-crimson: #8B1A1A;
--sampada-gold:    #C9A84C;
--sampada-cream:   #FAF6F0;
--sampada-dark:    #1A0A08;
```

---

## Top-Level Directory Map

```
E:\Sampada-Store\
├── .agents/            ← local Copilot/agent files
├── .claude/            ← Claude-related tooling
├── .dockerignore
├── .env*               ← local environment files
├── .eslintrc.json
├── .kiro/              ← Kiro specs
├── .kilo/
├── .markdownlint.json
├── .npmrc
├── .planning/
├── .qwen/
├── .stylelintrc.json
├── abscommerce/        ← legacy subproject / performance improvements
├── agency-agents/
├── analyze/
├── app/                ← experimental/app directory (Next.js structure)
├── babel.config.js
├── components/         ← React components
├── components.json
├── content/            ← Markdown content files (e.g., legal pages)
├── context/            ← React context providers
├── controllers/        ← API controller logic
├── data/               ← Static data files
├── design-system/      ← design tokens and style system
├── docs/               ← Documentation
├── hooks/              ← Custom React hooks
├── images/             ← source image assets
├── lib/                ← Utility libraries (Sanity client, analytics, etc.)
├── middleware.ts
├── next.config.js
├── pages/              ← Next.js Pages Router (all routes)
├── postcss.config.js
├── public/             ← Static assets served publicly
├── sanity_abscommerce/ ← Sanity Studio (CMS)
├── scripts/            ← One-off scripts (image list gen, seed, etc.)
├── services/           ← Server-side service modules (AI, vision, etc.)
├── skills-lock.json
├── styles/             ← CSS modules + global styles
├── tailwind.config.js
├── tsconfig.json
├── ui/
├── utils/              ← Helper utilities
└── vercel.json
```

---

## Pages (`pages/`)

| Route | File | Description |
|---|---|---|
| `/` | `pages/index.js` | Homepage — hero, products, banners |
| `/shop` | `pages/shop.jsx` | All products listing |
| `/stories` | `pages/stories/index.js` | Kavya lookbook + Stories page |
| `/product/[slug]` | `pages/product/[slug].js` | Product detail page |
| `/collections/[slug]` | `pages/collections/[slug].js` | Collection listing |
| `/account` | `pages/account.js` | User account + order history |
| `/checkout` | `pages/checkout.js` | Checkout flow |
| `/success` | `pages/success.js` | Order success page |
| `/wishlist` | `pages/wishlist.js` | Wishlist page |
| `/about` | `pages/about.js` | About Us |
| `/company` | `pages/company.js` | Company page |
| `/team` | `pages/team.js` | Team page |
| `/support` | `pages/support.js` | Support page |
| `/contact` | `pages/contact.js` | Contact page |
| `/creative-studio` | `pages/creative-studio.jsx` | Sampada Creative Studio |
| `/ai-demo` | `pages/ai-demo.tsx` | AI demo page |
| `/careers` | `pages/careers.jsx` | Careers page |
| `/refund-policy` | `pages/refund-policy.jsx` | Refund policy page |
| `/fallback-demo` | `pages/fallback-demo.js` | Fallback UI demo |
| `/privacy-policy` | `pages/privacy-policy.jsx` | Privacy Policy page |
| `/terms-and-conditions` | `pages/terms-and-conditions.jsx` | Terms and Conditions page |

### Admin Pages (`pages/admin/`)
- `pages/admin/index.jsx` — Dashboard
- `pages/admin/products/` — Product management (add, edit, list)
- `pages/admin/categories/` — Category management
- `pages/admin/orders/` — Order management
- `pages/admin/users/` — User management
- `pages/admin/analytics/` — Analytics
- `pages/admin/ai-tools.jsx` — AI Product Description Generator
- `pages/admin/bulk-tag.js` — Bulk auto-tagging (Gemini Vision)
- `pages/admin/seo/bulk-generate.jsx` — Bulk SEO generator

### API Routes (`pages/api/`)
- `pages/api/auth/[...nextauth].js` — NextAuth (Google + GitHub OAuth)
- `pages/api/stripe.js` — Stripe checkout
- `pages/api/ai/describe-product.js` — Gemini Vision product description
- `pages/api/ai/smart-search.js` — Natural language product search
- `pages/api/ai/style-assistant.js` — Style chat assistant
- `pages/api/ai/lookbook-search.js` — Lookbook RAG search
- `pages/api/products/gemini-auto-tag.js` — Auto-tag product via Gemini
- `pages/api/products/search.js` — Keyword product search
- `pages/api/products/colors.js` — Product color aggregation
- `pages/api/products/list-ids.js` — List all product IDs
- `pages/api/webhooks/sanity-auto-tag.js` — Sanity webhook → auto-tag
- `pages/api/webhooks/stripe.js` — Stripe webhook
- `pages/api/webhooks/paypal.js` — PayPal webhook
- `pages/api/printify/sync-product.js` — Printify product sync

---

## Components (`components/`)

### Key Components
| Component | File | Description |
|---|---|---|
| Navbar | `components/HomePage/SampadaNavbar.jsx` | Main site navbar with mega dropdowns + More menu |
| Hero Banner | `components/HeroBanner.jsx` | Homepage hero |
| Spotlight Hero | `components/spotlight/SpotlightReveal.jsx` | Mouse-following spotlight hero (Stories page) |
| Echo Canvas | `components/spotlight/EchoCanvas.jsx` | Velocity ring canvas overlay |
| Stories Gallery | `components/stories/SelectedWorksGallery.jsx` | 117-image masonry gallery with RAG search |
| Style Assistant | `components/StyleAssistant/StyleAssistant.jsx` | Floating AI chat widget (all pages) |
| Visual Search | `components/VisualSearch.jsx` | Upload photo → find matching products |
| Smart Search | `components/SmartSearch/SmartSearch.jsx` | Ctrl+K search with live results |
| Creative Studio | `components/CreativeStudio/` | Sampada Creative Studio component |
| Cart | `components/Cart.jsx` | Shopping cart |
| Product | `components/Product.jsx` | Product card |
| Footer | `components/Footer.jsx` | Site footer |
| Layout | `components/Layout.jsx` | Page wrapper |
| Legal Page Layout | `components/LegalPageLayout.jsx` | Wrapper for markdown-based legal pages |
| Admin Layout | `components/admin/AdminLayout.jsx` | Admin panel wrapper |
| Bulk Auto Tag | `components/admin/BulkAutoTag.jsx` | Gemini bulk tagger UI |
| Fallback UI | `components/FallbackUI.jsx` | Loading/error/empty state components |

---

## Styles (`styles/`)

| File | Purpose |
|---|---|
| `styles/globals.css` | Global reset + animations + story card styles + `.sampada-cards` / `.s-card` hero feature card styles |
| `styles/sampada-brand.css` | Core brand CSS variables + button classes |
| `styles/sampada-brand-global.css` | Global brand overrides |
| `styles/sampada-premium-brand.css` | Premium brand styles |
| `styles/admin-tokens.css` | Admin panel design tokens |
| `styles/Support.module.css` | Support page styles |
| `styles/HomePage.module.css` | Homepage module styles |

### Google Fonts loaded (in `pages/_document.js`)
- `Inter` — main UI font
- `Libre Baskerville` (700) — hero card titles
- `Tiro Devanagari Sanskrit` (400) — hero card subtext (Vedic calligraphic feel)
- `Playfair Display` — Stories page headings (loaded via Sanity/global CSS)
- `Montserrat` — Stories page labels (loaded via Sanity/global CSS)

### Key CSS Variables (from `sampada-brand.css`)
```css
--sampada-crimson: #8B1A1A
--sampada-gold: #C9A84C
--sampada-cream: #FAF6F0
--sampada-dark: #1A0A08
```

---

## Library (`lib/`)

| File | Purpose |
|---|---|
| `lib/client.js` | Sanity read/write/authenticated clients + image URL builder |
| `lib/analytics.js` | GA4 tracking (trackPurchase, trackViewItem, etc.) |
| `lib/printifyClient.js` | Printify API client |
| `lib/mailchimp.js` | Mailchimp email integration |
| `lib/getLocalStories.js` | Local Kavya image data for Stories page |
| `lib/utils.js` | `cn()` utility + `runFireworks()` |
| `lib/openrouter.ts` | OpenRouter AI API client |
| `lib/creativeStudioApi.js` | Creative Studio API helpers |
| `lib/sanity.js` | Alternative Sanity client (some pages use this) |
| `lib/markdown.js` | Markdown parser for static content |

---

## Data (`data/`)

| File | Purpose |
|---|---|
| `data/kavyaPortfolioImages.js` | Auto-generated list of 117 Kavya portfolio images |

---

## Hooks (`hooks/`)

| File | Purpose |
|---|---|
| `hooks/useAI.ts` | AI generation hook (`useAIGeneration`) |
| `hooks/useFadeIn.js` | IntersectionObserver scroll fade-in |
| `hooks/useAdminData.js` | Admin data fetching |
| `hooks/useAnalytics.js` | Analytics hook |
| `hooks/useCurrency.js` | Currency conversion |

---

## Services (`services/`)

| File | Purpose |
|---|---|
| `services/autoTaggingService.js` | Cloud Vision auto-tagging (legacy) |
| `services/visualSearchService.js` | Gemini Vision image analysis |
| `services/productMatchingService.js` | Product similarity scoring |
| `services/colorExtractionService.js` | Color extraction from images |
| `services/colorSearchService.js` | Search products by color |
| `services/contentModerationService.js` | Image content moderation |

---

## Sanity CMS (`sanity_abscommerce/`)

**Studio URL:** Run `npm run dev` inside `sanity_abscommerce/`

### Schema Types (active `sanity_abscommerce/schemaTypes`)
- `product` — Products with variants, SEO, Printify integration
- `category` — Product categories
- `order` — Orders
- `user` — Users
- `banner` — Hero banners
- `post` — Blog posts (now supports inline image blocks in `body`)
- `aboutUs` — About page content (storyContent now supports inline images)
- `company` — Company page (storyContent now supports inline images)
- `career` — Career listings (description supports inline images)
- `story` — Story documents (description supports inline images)
- `productTabs` — Product tab rich text (`tabContent` supports inline images)
- `navigation` — Navbar navigation data
- `footerSettings` — Footer content

Notes:
- If editing schemas, modify files under `sanity_abscommerce/schemaTypes` — that is the Studio import used by `sanity.config.js`.
- When adding inline images to Portable Text, include `alt` and (optional) `caption` fields in the image block for accessibility and caption rendering.

---

## Environment Variables (`.env`)

Key variables (values in `.env` file, never commit):

```
NEXTAUTH_SECRET          — NextAuth session secret
NEXTAUTH_URL             — https://sampadaoriginals.in (production canonical)
GOOGLE_CLIENT_ID         — Google OAuth (binods111@gmail.com console)
GOOGLE_CLIENT_SECRET     — Google OAuth secret
GITHUB_ID                — GitHub OAuth App client ID
GITHUB_SECRET            — GitHub OAuth App secret
NEXT_PUBLIC_SANITY_PROJECT_ID  — 7lh35oho
NEXT_PUBLIC_SANITY_DATASET     — production
SANITY_API_WRITE_TOKEN   — Sanity Editor token (for auto-tagging)
SANITY_WEBHOOK_SECRET    — Sanity webhook verification
GEMINI_API_KEY           — Google Gemini API (binods111@gmail.com)
GOOGLE_AI_API_KEY        — Same as GEMINI_API_KEY
PRINTIFY_API_KEY         — Printify JWT token
PRINTIFY_SHOP_ID         — 25358004
SENDGRID_API_KEY         — Email sending
NEXT_PUBLIC_GA_ID        — G-X6FZZGWFFJ
NEXT_PUBLIC_FIREBASE_*   — Firebase config (gen-lang-client-0132215006)
GCS_BUCKET_NAME          — sampada-storage-87848430
GCS_KEY_FILE             — ./gcs-service-account.json
STRIPE_DESIGNER_SECRET   — Stripe test secret key
ADMIN_EMAIL              — admin@sampada.com
ADMIN_PASSWORD_HASH      — bcrypt hash
JWT_SECRET               — Admin JWT secret
NEXT_PUBLIC_FEATURE_VISUAL_SEARCH — true
```

---

## AI Features Built

| Feature | Entry Point | API Route |
|---|---|---|
| Product Description Generator | `/admin/ai-tools` | `/api/ai/describe-product` |
| Auto-Tagging Pipeline | Sanity webhook | `/api/webhooks/sanity-auto-tag` → `/api/products/gemini-auto-tag` |
| Smart Search | Navbar (Ctrl+K) | `/api/ai/smart-search` |
| Style Assistant Chat | Floating widget (all pages) | `/api/ai/style-assistant` |
| Lookbook RAG | Stories page gallery search bar | `/api/ai/lookbook-search` |
| Visual Product Search | Camera icon in navbar | `/api/search/visual` |
| Bulk Auto-Tagger | `/admin/bulk-tag` | `/api/products/gemini-auto-tag` |

---

## Public Images (`public/images/`)

- `public/images/Kavya/` — 7 original Kavya lookbook images (kavya-1.jpg to kavya-7.jpg)
- `public/images/kavya-portfolio/` — 117 Kavya portfolio images (WhatsApp exports)
- `public/images/collections/` — Collection banner images
- `public/images/Kavya/Kav1.jpeg`, `Kav2.jpeg`, `Kav3.jpeg` — Additional Kavya images

---

## Key Configuration Files

| File | Purpose |
|---|---|
| `next.config.js` | Next.js config — webpack mode, image domains, security headers |
| `tsconfig.json` | TypeScript config — `module`/`moduleResolution` set to `nodenext` where applicable; `ignoreDeprecations` added to suppress legacy TS warnings |
| `tailwind.config.js` | Tailwind CSS config |
| `package.json` | Dependencies — build script: `next build --webpack` |
| `middleware.ts` | Next.js middleware (deprecated, use proxy) |
| `sanity.config.js` | Root Sanity config (imports `sanity_abscommerce/schemaTypes`) |

Developer notes:
- `lib/client.js` exposes `urlFor()` (Sanity image builder). Prefer using it to build image URLs across components and Portable Text renderers.
- If you see TypeScript deprecation warnings from module options, check root `tsconfig.json` and `abscommerce/tsconfig.json` (they were updated to `nodenext` and `ignoreDeprecations`).

---

## Deployment

- **Platform:** Vercel
- **Canonical domain:** `https://sampadaoriginals.in` (www / `.com` variants redirect via `vercel.json`)
- **Legacy alias:** `sampada.online` / `www.sampada.online` may still serve the app — do not use for `NEXTAUTH_URL`
- **Build command:** `npm run build` (`next build --webpack`)
- **Auto-deploy:** On push to `main` branch
- **Sanity webhooks:**
  - Blog ISR: `https://sampadaoriginals.in/api/revalidate` (`_type == "post"`)
  - Product auto-tag (optional, plan-limited): `https://sampadaoriginals.in/api/webhooks/sanity-auto-tag`
