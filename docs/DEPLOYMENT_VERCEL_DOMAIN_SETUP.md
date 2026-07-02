# Sampada Store — Vercel + Domain Deployment Guide

## Status

- Step 1 ✅ Vercel domains added
- Step 2 ✅ Hostinger DNS configured
- Step 3 ⬜ Add env vars in Vercel
- Step 4 ⬜ Redeploy
- Step 5 ⬜ Update Stripe Webhook
- Step 6 ⬜ Verify live site

---

## Step 1 — Vercel: Domains Added

Project: `sampada-store-6x39`

| Domain | Environment | Redirect |
| :--- | :--- | :--- |
| `sampada.online` | Production | 307 → `www.sampada.online` |
| `www.sampada.online` | Production | — |

---

## Step 2 — Hostinger: DNS Records Configured

Panel: hPanel → domain/sampada.online → DNS / Nameservers

| Type | Name | Content/Target | TTL |
| :--- | :--- | :--- | :--- |
| A | @ | 216.198.79.114 | 400 |
| CNAME | www | 25e22518b49914f0.vercel-dns-017.com | 14400 |

Old conflicting records deleted before adding the above:

- A @ → 2.57.91.91
- CNAME www → sampada.online

---

## Step 3 — Add Env Vars in Vercel

Dashboard: <https://vercel.com/binods-projects-6cd5a358/sampada-store-6x39/settings/environment-variables>

Add all keys from `docs/VERCEL_ENV_CHECKLIST.md`. Start with these 3:

```text
NEXT_PUBLIC_BASE_URL = https://www.sampada.online
NEXT_PUBLIC_API_URL  = https://www.sampada.online
NEXTAUTH_URL         = https://www.sampada.online
```

---

## Step 4 — Redeploy

1. Go to **Deployments** tab in Vercel
2. Click the latest deployment
3. Click **Redeploy**

This ensures all new env vars are picked up.

---

## Step 5 — Update Stripe Webhook

1. Go to <https://dashboard.stripe.com/webhooks>
2. Update the endpoint URL to:

```text
https://www.sampada.online/api/subscriptions/designer/webhook
```

1. Copy the new `STRIPE_WEBHOOK_SECRET`
2. Update `STRIPE_WEBHOOK_SECRET` in Vercel env vars

---

## Step 6 — Verify

- Open <https://www.sampada.online> in browser after 5–30 mins
- You should see a green SSL lock and the site live
- DNS propagation can take up to 48h in worst case

Monitor domain status at:
<https://vercel.com/binods-projects-6cd5a358/sampada-store-6x39/settings/domains>

---

## Notes

- No code changes needed — this is purely DNS and infra
- Vercel auto-issues SSL once DNS propagation is detected
- Root domain `sampada.online` auto-redirects to `www.sampada.online` (307)
