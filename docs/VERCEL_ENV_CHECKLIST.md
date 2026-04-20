# Vercel Environment Variables Checklist
> Add these in Vercel → Project → Settings → Environment Variables
> **DELETE THIS FILE after you're done!**

---

## URLs (Update to your new domain)

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BASE_URL` | `https://sampada.online` |
| `NEXT_PUBLIC_API_URL` | `https://sampada.online` |
| `NEXTAUTH_URL` | `https://sampada.online` |

---

## Database

| Key | Where to get it |
|-----|----------------|
| `DATABASE_URL` | Your Cloud SQL / PostgreSQL connection string |

---

## NextAuth

| Key | Where to get it |
|-----|----------------|
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` (or use any random 32+ char string) |

---

## Stripe

| Key | Where to get it |
|-----|----------------|
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_DESIGNER_KEY` | Same page (publishable key) |
| `STRIPE_DESIGNER_PRO_PRICE_ID` | [dashboard.stripe.com/products](https://dashboard.stripe.com/products) |
| `STRIPE_DESIGNER_ULTRA_PRICE_ID` | Same page |
| `STRIPE_WEBHOOK_SECRET` | [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks) → create endpoint: `https://sampada.online/api/subscriptions/designer/webhook` |

---

## Razorpay

| Key | Where to get it |
|-----|----------------|
| `RAZORPAY_KEY_ID` | [dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | Same page |

---

## Google Cloud

| Key | Value / Where to get it |
|-----|------------------------|
| `GOOGLE_CLOUD_PROJECT_ID` | `sampada-store-2026` |
| `GCS_BUCKET_NAME` | `sampada-storage-87848430` |
| `GOOGLE_AI_API_KEY` | [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) |

---

## OpenRouter (AI)

| Key | Where to get it |
|-----|----------------|
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) |

---

## SendGrid (Email)

| Key | Where to get it |
|-----|----------------|
| `SENDGRID_API_KEY` | [app.sendgrid.com/settings/api_keys](https://app.sendgrid.com/settings/api_keys) |
| `SENDGRID_FROM_EMAIL` | e.g. `noreply@sampada.online` |
| `SENDGRID_FROM_NAME` | `Sampada` |

---

## Printify (Fulfillment)

| Key | Where to get it |
|-----|----------------|
| `PRINTIFY_API_KEY` | [printify.com/app/settings/api](https://printify.com/app/settings/api) |
| `PRINTIFY_SHOP_ID` | [printify.com/app/stores](https://printify.com/app/stores) |

---

## Stability AI (Image Generation)

| Key | Where to get it |
|-----|----------------|
| `STABILITY_API_KEY` | [platform.stability.ai/account/keys](https://platform.stability.ai/account/keys) |
| `STABILITY_API_KEY_2` | Same page (backup key) |

---

## Analytics & Marketing

| Key | Where to get it |
|-----|----------------|
| `NEXT_PUBLIC_GA_ID` | [analytics.google.com](https://analytics.google.com) → format: `G-XXXXXXXXXX` |
| `MAILCHIMP_API_KEY` | [mailchimp.com/help/about-api-keys](https://mailchimp.com/help/about-api-keys) |
| `MAILCHIMP_AUDIENCE_ID` | Mailchimp → Audience → Settings → Audience ID |
| `MAILCHIMP_SERVER_PREFIX` | From your API key suffix e.g. `us1`, `us2` |

---

## Misc APIs

| Key | Where to get it |
|-----|----------------|
| `LOB_API_KEY` | [dashboard.lob.com](https://dashboard.lob.com) |
| `VAT_API_KEY` | [vatlayer.com/product](https://vatlayer.com/product) |

---

## Checklist

- [ ] All keys added in Vercel
- [ ] `NEXT_PUBLIC_BASE_URL` set to `https://sampada.online`
- [ ] `NEXTAUTH_URL` set to `https://sampada.online`
- [ ] Stripe webhook endpoint updated to `https://sampada.online/...`
- [ ] SendGrid sender domain verified for `sampada.online`
- [ ] **Delete this file!**
