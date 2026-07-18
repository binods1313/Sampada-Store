# Canonical domain: sampadaoriginals.in

## Confirmed (no DNS changes)

| Host | Behavior |
|------|----------|
| https://sampadaoriginals.in | **200 primary** (canonical) |
| https://www.sampadaoriginals.in | 301 → apex via vercel.json |
| https://sampadaoriginals.com / www | 301 → apex via vercel.json |
| https://sampada.online | 307 → https://www.sampada.online |
| https://www.sampada.online | 200, same Next app (legacy alias) |

Repo `vercel.json` only defines redirects **to** `sampadaoriginals.in` for www/.com variants.

## Sanity webhooks (plan limit: 2)

1. **Product Sync to Prisma** (external Cloud Run) — keep
2. **Merged CMS webhook** (post ISR + product Gemini auto-tag):
   - URL: `https://sampadaoriginals.in/api/webhooks/sanity`
   - Filter: `_type in ["post", "product"]`
   - Route: `pages/api/webhooks/sanity.js`

Manual blog revalidate (not a Sanity webhook):  
`GET/POST https://sampadaoriginals.in/api/revalidate?secret=…&path=/blog/…`

## You must set in Vercel UI (we cannot without CLI login)

Production environment variables:

- NEXTAUTH_URL = https://sampadaoriginals.in
- NEXT_PUBLIC_BASE_URL = https://sampadaoriginals.in
- NEXT_PUBLIC_API_URL = https://sampadaoriginals.in
- NEXT_PUBLIC_SITE_URL = https://sampadaoriginals.in (optional)

Then **Redeploy** so NextAuth and client bundles pick up values.

## Optional external dashboards (browser)

If callbacks still point at .online, update to .in:

- Google OAuth authorized origins / redirect URIs
- GitHub OAuth App homepage + callback URL
- Stripe / PayPal / Razorpay webhook endpoints
- SendGrid verified sender domain (if still on @sampada.online)
