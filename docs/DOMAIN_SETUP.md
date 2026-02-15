# 🌐 Domain Setup: Sampada.shop + SampadaStore.com

## Primary & Backup Domain Strategy

### **Primary Domain:** `Sampada.shop`  
**Backup Domain:** `SampadaStore.com`  
**Strategy:** Use .shop for main site, .com for brand protection and regional redirects

---

## Domain Portfolio

| Domain | Purpose | Annual Cost | Priority |
|--------|---------|-------------|----------|
| **Sampada.shop** | Primary e-commerce site | $25 | HIGH |
| **SampadaStore.com** | Backup/Brand protection | $12 | MEDIUM |
| **Total Annual** | | **$37** | |

---

## Why This Dual-Domain Strategy?

### Primary: Sampada.shop
✅ **Google Shopping Priority** - .shop domains get featured in product searches  
✅ **E-commerce Signal** - Instantly recognized as a shopping destination  
✅ **Modern & Professional** - .shop is the new standard for online stores  
✅ **SEO Advantage** - Rich snippets and better SERP positioning

### Backup: SampadaStore.com
✅ **Brand Protection** - Prevents competitors from taking it  
✅ **Traditional Trust** - .com still trusted by older demographics  
✅ **Failover** - Backup if .shop has issues  
✅ **Regional Marketing** - Use .com for India-focused campaigns  
✅ **Email** - Professional emails: hello@sampadastore.com

---

## Why Sampada.shop is Perfect

### 1. **E-Commerce Optimized**
- `.shop` domains are recognized by Google as e-commerce sites
- Preferential treatment in Google Shopping results
- Trust signal for online shoppers

### 2. **SEO Advantages**
- **Google Shopping Priority**: `.shop` domains get featured snippets in product searches
- **Rich Results**: Better chance of getting product rich results in SERP
- **Mobile Optimization**: `.shop` is mobile-friendly and loads faster on Google's infrastructure

### 3. **Professional & Memorable**
- Short, clean, easy to remember
- Directly communicates: "This is a shopping destination"
- Perfect for cultural/artisan products like Sampada

### 4. **Cost-Effective**
- Typical price: $20-40/year
- Available at: Google Domains, Namecheap, GoDaddy, Cloudflare

---

## Multi-Domain Configuration Strategy

### Recommended Setup

```
Sampada.shop (Primary)
├── Main e-commerce site
├── Product pages
├── Custom designer tool
└── Admin dashboard

SampadaStore.com (Secondary)
├── Redirects to Sampada.shop
├── Brand protection
└── Optional: Regional landing page for India
```

### DNS Configuration for Both Domains

#### Sampada.shop (Primary - Vercel)

```
Type    Name    Value                          TTL
A       @       76.76.21.21                    Auto
CNAME   www     cname.vercel-dns.com          Auto
```

#### SampadaStore.com (Backup - Redirect to Primary)

**Option A: Simple Redirect (Recommended)**
```
Type    Name    Value                          TTL
A       @       76.76.21.21                    Auto
CNAME   www     cname.vercel-dns.com          Auto
```

Then in Vercel:
- Add both domains
- Set Sampada.shop as primary
- Auto-redirect SampadaStore.com → Sampada.shop

**Option B: Regional Landing Page**
```
# Keep separate Vercel project for SampadaStore.com
# Simple landing: "Shop at Sampada.shop" + redirect button
# Useful for India-specific marketing campaigns
```

---

## Purchase Guide (Both Domains)

### Recommended: Buy Both Together

```bash
# Estimated Cost
Domain: Sampada.shop - $25/year
Privacy Protection: Included
SSL Certificate: Free (via Cloudflare or Vercel)
```

**Alternative Registrars:**
- **Google Domains**: $40/year (includes privacy, easy Google integration)
- **Namecheap**: $25/year + $3/year privacy
- **GoDaddy**: $30/year (not recommended - upsell heavy)

### Step 2: DNS Configuration

Once purchased, configure these DNS records:

#### For Vercel Deployment

```
Type    Name    Value                          TTL
A       @       76.76.21.21                    Auto
CNAME   www     cname.vercel-dns.com          Auto
```

#### For Custom Email (Google Workspace - Optional)

```
Type    Name    Value                          Priority
MX      @       smtp.google.com                1
TXT     @       v=spf1 include:_spf.google.com ~all
```

### Step 3: Environment Variables

Update your `.env.local` and `.env.production`:

```bash
# Primary Domain Configuration
NEXT_PUBLIC_SITE_URL="https://sampada.shop"
NEXT_PUBLIC_DOMAIN="sampada.shop"

# Backup Domain (for redirects/references)
NEXT_PUBLIC_BACKUP_DOMAIN="sampadastore.com"

# Webhook URLs (primary domain)
SANITY_WEBHOOK_URL="https://sampada.shop/api/webhooks/sanity"
STRIPE_WEBHOOK_URL="https://sampada.shop/api/stripe/webhook"

# Auth (primary domain)
NEXTAUTH_URL="https://sampada.shop"

# Alternative URLs (if using backup for certain features)
ALTERNATIVE_CHECKOUT_URL="https://sampadastore.com/checkout"
```

### Step 4: Update Sanity Configuration

```bash
# In sanity_abscommerce directory
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\sanity_abscommerce

# Add CORS origins for BOTH domains
npx sanity cors add https://sampada.shop --credentials
npx sanity cors add https://www.sampada.shop --credentials
npx sanity cors add https://sampadastore.com --credentials
npx sanity cors add https://www.sampadastore.com --credentials
```

### Step 5: Vercel Multi-Domain Configuration

In your Vercel project settings:

1. **Domains**
   - Add: `sampada.shop` (PRIMARY)
   - Add: `www.sampada.shop` (redirect to sampada.shop)
   - Add: `sampadastore.com` (redirect to sampada.shop)
   - Add: `www.sampadastore.com` (redirect to sampada.shop)

2. **Redirect Configuration**
   ```javascript
   // vercel.json (optional - auto-handled by Vercel)
   {
     "redirects": [
       {
         "source": "/:path*",
         "has": [
           {
             "type": "host",
             "value": "sampadastore.com"
           }
         ],
         "destination": "https://sampada.shop/:path*",
         "permanent": true
       }
     ]
   }
   ```

3. **Environment Variables**
   - Update `NEXT_PUBLIC_SITE_URL` to `https://sampada.shop`
   - Update `NEXTAUTH_URL` to `https://sampada.shop`
   - Add `SANITY_WEBHOOK_SECRET`

3. **Build Settings**
   ```json
   {
     "buildCommand": "npx prisma generate && npm run build",
     "installCommand": "npm install",
     "outputDirectory": ".next"
   }
   ```

---

## SEO Configuration for Sampada.shop

### Update `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ],
      },
    ]
  },
  
  // Enable image optimization
  images: {
    domains: ['cdn.sanity.io', 'sampada.shop'],
  },
}

module.exports = nextConfig
```

### Update Site Metadata

```typescript
// app/layout.tsx or app/metadata.ts
export const metadata = {
  metadataBase: new URL('https://sampada.shop'),
  title: {
    default: 'Sampada - Cultural Clothing & Custom Designs',
    template: '%s | Sampada.shop'
  },
  description: 'Discover authentic cultural clothing and create custom designs. Shop Sampada for unique ethnic wear and personalized fashion.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sampada.shop',
    siteName: 'Sampada',
    images: [{
      url: 'https://sampada.shop/og-image.jpg',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sampada_shop',
    creator: '@sampada_shop',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
}
```

---

## Google Shopping Integration

### Enable in Google Search Console

1. **Add Property**: `https://sampada.shop`
2. **Verify Ownership**: Via DNS TXT record
3. **Submit Sitemap**: `https://sampada.shop/sitemap.xml`
4. **Enable Shopping Annotations**

### Add Product Schema Markup

```typescript
// For each product page
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "image": urlFor(product.image[0]).url(),
  "description": product.details,
  "brand": {
    "@type": "Brand",
    "name": "Sampada"
  },
  "offers": {
    "@type": "Offer",
    "url": `https://sampada.shop/product/${product.slug.current}`,
    "priceCurrency": "INR",
    "price": product.price,
    "availability": product.inStock ? "InStock" : "OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": "Sampada"
    }
  }
}
```

---

## Monitoring & Analytics

### Google Analytics 4

```html
<!-- Add to app/layout.tsx -->
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
<Script id="google-analytics">
  {`window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');`}
</Script>
```

### Google Merchant Center

1. **Create Account**: https://merchants.google.com
2. **Add Website**: `sampada.shop`
3. **Upload Product Feed**: Via Sanity API integration
4. **Submit for Review**: Google verifies .shop domains faster

---

## SSL/HTTPS Configuration

### Automatic with Vercel

✅ Free SSL certificate (Let's Encrypt)  
✅ Auto-renewal every 90 days  
✅ HTTP → HTTPS redirect  
✅ HSTS enabled  

### Verify SSL

After deployment:
```bash
# Check SSL grade
https://www.ssllabs.com/ssltest/analyze.html?d=sampada.shop

# Expected: A+ rating
```

---

## Email Configuration (Optional)

### Option 1: Google Workspace
```
Cost: $6/user/month
Email: hello@sampada.shop, support@sampada.shop
Features: Gmail, Drive, Calendar
```

### Option 2: Cloudflare Email Routing (Free)
```
Cost: Free
Features: Email forwarding only
Forward: hello@sampada.shop → your@gmail.com
```

---

## Performance Checklist

- [ ] Enable Vercel Analytics
- [ ] Configure Cloudflare CDN (optional)
- [ ] Set up image optimization
- [ ] Enable ISR (Incremental Static Regeneration)
- [ ] Configure cache headers
- [ ] Add service worker for PWA
- [ ] Enable compression (Brotli/Gzip)

---

## Cost Breakdown (Annual)

| Item | Cost |
|------|------|
| Sampada.shop domain | $25 |
| SSL Certificate | $0 (Free via Vercel) |
| Hosting (Vercel Pro) | $0-240 (optional) |
| Google Workspace | $0-72 (optional) |
| **Total Minimum** | **$25/year** |

---

## Quick Start Commands

```bash
# 1. Update environment variables
echo 'NEXT_PUBLIC_SITE_URL="https://sampada.shop"' >> .env.local

# 2. Test locally with production env
npm run build
npm run start

# 3. Deploy to Vercel
vercel --prod

# 4. Configure domain in Vercel dashboard
# Dashboard → Settings → Domains → Add sampada.shop

# 5. Set up Sanity webhook
# URL: https://sampada.shop/api/webhooks/sanity
```

---

## Next Steps

1. ✅ Purchase `Sampada.shop` from recommended registrar
2. ✅ Configure DNS records
3. ✅ Update environment variables
4. ✅ Deploy to Vercel
5. ✅ Add domain in Vercel dashboard
6. ✅ Configure Sanity CORS and webhooks
7. ✅ Set up Google Search Console
8. ✅ Submit to Google Merchant Center
9. ✅ Monitor analytics

---

**Ready to dominate Google Shopping with Sampada.shop! 🚀**
