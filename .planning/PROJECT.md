# Sampada (ABSCommerce) - Project Overview

**Analysis Date:** 2026-03-05  
**Project Type:** Full-stack E-commerce Platform  
**Stage:** Production-ready with active development

---

## Core Value Proposition

**Sampada** is a modern e-commerce platform specializing in:
- Custom design studio (Fabric.js-based) with AI-powered elements
- Tech products (headphones, smartwatches, space suits, sunglasses)
- "Aurora Sky Pulse™" product line
- Subscription tiers for designers (Free/Pro/Ultra)

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.2.4 | App Router, SSR/SSG hybrid |
| React | 19.1.0 | UI framework |
| Tailwind CSS | 4.1.6 | Styling |
| Framer Motion | 12.7.4 | Animations |
| Lucide React | 0.542.0 | Icons |
| Three.js | 0.176.0 | 3D rendering |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| Prisma | 5.22.0 | ORM |
| PostgreSQL | - | Primary database (Cloud SQL) |
| Next.js API Routes | - | Serverless functions |
| NextAuth.js | 4.24.11 | Authentication (GitHub OAuth) |

### CMS & Content
| Technology | Version | Purpose |
|------------|---------|---------|
| Sanity CMS | 5.4.0 | Headless CMS, product catalog |
| GROQ | - | Query language |
| Portable Text | 3.2.1 | Rich text |

### Payments & External Services
| Service | Purpose |
|---------|---------|
| Stripe | Payment processing (designer subscriptions + store) |
| Google Cloud Storage | File storage (designs, thumbnails) |
| Google Vision AI | Visual search, image analysis |
| Google Generative AI (Gemini) | AI design suggestions, image generation |
| SendGrid | Email notifications |
| Printify | T-shirt fulfillment integration |
| Redis | Rate limiting, caching |

### Monitoring & Quality
| Technology | Purpose |
|------------|---------|
| Winson | Logging |
| @next/bundle-analyzer | Bundle optimization |
| ESLint + Prettier | Code quality |
| Stylelint | CSS linting |

---

## Architecture Overview

### Directory Structure
```
abscommerce/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── designer/          # Design studio (pro feature)
│   ├── stories/           # Content pages
│   ├── subscription/      # Subscription management
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── Cart/              # Cart functionality
│   ├── designer/          # Design studio components
│   ├── Navbar/            # Navigation
│   ├── Product/           # Product components
│   ├── VisualSearch/      # AI visual search
│   └── VoiceAssistant/    # Voice search
├── lib/                   # Utilities
├── prisma/                # Database schema
├── services/              # Business logic
├── hooks/                 # Custom React hooks
├── context/               # React Context providers
└── config/                # Configuration files
```

### Key Architectural Patterns
- **Hybrid Rendering:** SSG for product pages, SSR for user content
- **API-first:** RESTful endpoints for all operations
- **Headless CMS:** Sanity for content, PostgreSQL for transactional data
- **Serverless-ready:** `output: 'standalone'` for Docker/Cloud Run deployment

---

## Database Schema (Prisma)

### Core Models
1. **DesignUser** - Designer accounts with subscription tiers
2. **CustomDesign** - User-created designs (Fabric.js canvas data)
3. **CustomOrder** - Orders linking to Sanity products
4. **DesignTemplate** - Reusable design templates
5. **DesignUsageLog** - Usage tracking for quota management
6. **ProductCache** - Fast Sanity product lookups
7. **SearchLog** - AI dynamic collection search history
8. **PersonalizedContent** - Cached AI-generated product taglines

---

## Current Features

### ✅ Implemented
- [x] Product catalog with Sanity CMS
- [x] Shopping cart with persistent state
- [x] User authentication (GitHub OAuth via NextAuth)
- [x] Wishlist system
- [x] Review & rating system (5-star + written reviews)
- [x] Stripe payment integration (test mode)
- [x] Design studio with Fabric.js
- [x] Designer subscription tiers (Free/Pro/Ultra)
- [x] AI-powered design suggestions (Gemini)
- [x] Visual search (Google Vision)
- [x] Voice assistant
- [x] Printify integration for custom products
- [x] Google Cloud Storage for design assets
- [x] SendGrid email notifications
- [x] Rate limiting (Redis + express-rate-limit)
- [x] Comprehensive error boundaries
- [x] Dark mode toggle
- [x] Responsive mobile-first design

### 🚧 In Progress / Needs Work
- [ ] Production Stripe webhook setup
- [ ] Cloud SQL database migration
- [ ] Cloud Run deployment pipeline
- [ ] Designer subscription product creation in Stripe
- [ ] E2E test coverage
- [ ] Performance optimization (bundle size, LCP)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## Known Issues & Technical Debt

### Critical
1. **Stripe Webhook Not Configured** - Blocks production subscription handling
2. **No E2E Tests** - Critical user flows untested
3. **Database Not Migrated to Cloud SQL** - Still using local/dev setup

### Moderate
1. **Bundle Size** - Needs optimization (lazy loading, code splitting)
2. **Hydration Issues** - Some components have hydration mismatches
3. **Error Handling** - Inconsistent error boundaries across features

### Minor
1. **Documentation Gaps** - API docs, deployment guide incomplete
2. **Code Duplication** - Some component logic could be extracted to hooks
3. **TypeScript Coverage** - Mixed JS/TS, needs full migration

---

## Performance Metrics

### Current State
- **Bundle Size:** Not analyzed recently (needs `npm run build -- --analyze`)
- **LCP:** Unknown (needs Web Vitals measurement)
- **CLS:** Unknown
- **FID:** Unknown

### Targets
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
- Bundle < 200KB initial

---

## Security Considerations

### Implemented
- [x] GitHub OAuth authentication
- [x] Rate limiting on API routes
- [x] Input sanitization (DOMPurify)
- [x] Helmet.js security headers (partial)
- [x] Environment variable protection

### Needs Attention
- [ ] OWASP Top 10 audit
- [ ] Payment security (PCI DSS compliance review)
- [ ] CSRF protection on all forms
- [ ] Rate limiting on authentication endpoints
- [ ] Secrets rotation policy

---

## Deployment Target

### Current
- **Development:** Local (`npm run dev`)
- **Production:** Google Cloud Run (planned)

### Required for Production
1. Cloud SQL PostgreSQL instance
2. Google Cloud Storage bucket
3. Stripe webhook endpoint
4. Environment variables configured
5. Docker containerization
6. CI/CD pipeline

---

## Next Strategic Priorities

### Phase 1: Production Readiness (2-3 weeks)
1. Complete Stripe production setup (webhooks, products)
2. Migrate database to Cloud SQL
3. Deploy to Cloud Run
4. E2E test coverage for critical flows

### Phase 2: Performance & SEO (2 weeks)
1. Bundle optimization
2. Core Web Vitals optimization
3. SEO meta tags + structured data
4. Sitemap + robots.txt

### Phase 3: Feature Enhancement (3-4 weeks)
1. Enhanced designer dashboard
2. Social sharing features
3. Advanced analytics
4. Mobile app (React Native potential)

---

## Constraints & Decisions

### Fixed Constraints
- Must support GitHub OAuth (user requirement)
- Must use Sanity CMS (existing content)
- Must use Stripe for payments
- Must deploy to Google Cloud (existing infrastructure)

### Flexible Decisions
- E2E testing framework (Playwright vs Cypress)
- State management (Context vs Zustand vs Redux)
- Additional authentication providers (Google, Email)

---

*Project analysis created via GSD workflow - 2026-03-05*
