/**
 * Merged Sanity webhook — one plan slot for post ISR + product Gemini auto-tag
 * POST /api/webhooks/sanity
 *
 * Routes by payload `_type`:
 *   post     → on-demand ISR: res.revalidate('/blog') + /blog/[slug]
 *   product  → fire-and-forget Gemini auto-tag
 *
 * ── Sanity webhook setup (single webhook) ───────────────────────────────────
 *   sanity.io/manage → project → API → Webhooks
 *
 *   Name:       Sanity CMS (post ISR + product auto-tag)
 *   URL:        https://sampadaoriginals.in/api/webhooks/sanity
 *   Dataset:    production
 *   Trigger:    Create, Update, Delete
 *   Filter:     _type in ["post", "product"]
 *   Projection: { _id, _type, "slug": slug.current }
 *   Secret:     SANITY_WEBHOOK_SECRET (same as Vercel / .env.local)
 *   HTTP:       POST
 *   Drafts:     off (recommended)
 *
 * Manual blog revalidate still available at POST/GET /api/revalidate?secret=…
 * Legacy product-only path: POST /api/webhooks/sanity-auto-tag
 */

import crypto from 'crypto'

export const config = {
  api: {
    // Raw body required for Sanity HMAC (t=…,v1=…)
    bodyParser: false,
  },
}

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function isValidSanitySignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false

  const parts = Object.fromEntries(
    String(signatureHeader)
      .split(',')
      .map((pair) => {
        const i = pair.indexOf('=')
        if (i === -1) return [pair, '']
        return [pair.slice(0, i), pair.slice(i + 1)]
      })
  )

  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature) return false

  const ts = Number(timestamp)
  if (!Number.isFinite(ts)) return false
  if (Math.abs(Date.now() - ts * 1000) > 5 * 60 * 1000) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')

  try {
    const a = Buffer.from(signature, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

function getSecrets() {
  return [
    process.env.SANITY_WEBHOOK_SECRET,
    process.env.REVALIDATE_SECRET,
  ].filter(Boolean)
}

function extractSlug(body) {
  if (!body || typeof body !== 'object') return null
  if (typeof body.slug === 'string' && body.slug) return body.slug
  if (body.slug && typeof body.slug.current === 'string' && body.slug.current) {
    return body.slug.current
  }
  return null
}

function toBaseId(id) {
  if (typeof id !== 'string' || !id) return null
  return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
}

function getAppBaseUrl(req) {
  const fromEnv =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  const proto = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  if (host) return `${proto}://${host}`
  return 'http://localhost:3000'
}

async function revalidatePost(res, body) {
  const paths = new Set()
  const slug = extractSlug(body)

  if (slug) paths.add(`/blog/${slug}`)
  paths.add('/blog')

  if (!slug) {
    console.warn('[sanity-webhook] post missing slug — revalidating /blog only')
  }

  const revalidated = []
  const failed = []

  for (const path of paths) {
    try {
      await res.revalidate(path)
      revalidated.push(path)
    } catch (err) {
      console.error(`[sanity-webhook] revalidate failed ${path}:`, err.message)
      failed.push({ path, error: err.message })
    }
  }

  return { revalidated, failed }
}

function triggerProductAutoTag(req, productId) {
  const baseUrl = getAppBaseUrl(req)
  const id = toBaseId(productId)

  // Fire-and-forget — Sanity webhooks time out ~30s
  fetch(`${baseUrl}/api/products/gemini-auto-tag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: id }),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}))
      if (data.success) {
        console.log(`[sanity-webhook] Tagged product ${id}:`, data.applied?.tags)
      } else {
        console.error(`[sanity-webhook] Tagging failed for ${id}:`, data.error || r.status)
      }
    })
    .catch((err) => {
      console.error(`[sanity-webhook] Auto-tag fetch error for ${id}:`, err.message)
    })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const secrets = getSecrets()
  if (secrets.length === 0) {
    console.error('[sanity-webhook] No SANITY_WEBHOOK_SECRET configured')
    return res.status(500).json({ error: 'Webhook secret not configured' })
  }

  let rawBody = ''
  let body = null
  try {
    rawBody = await readRawBody(req)
    body = rawBody ? JSON.parse(rawBody) : null
  } catch (err) {
    console.warn('[sanity-webhook] Invalid JSON:', err.message)
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const signatureHeader =
    req.headers['sanity-webhook-signature'] ||
    req.headers['Sanity-Webhook-Signature'] ||
    ''

  // Prefer Sanity HMAC; allow ?secret= for manual smoke tests
  const querySecret = typeof req.query.secret === 'string' ? req.query.secret : ''
  const okQuery = secrets.includes(querySecret)
  const okSig =
    Boolean(signatureHeader) &&
    secrets.some((s) => isValidSanitySignature(rawBody, signatureHeader, s))

  if (!okQuery && !okSig) {
    console.warn('[sanity-webhook] Invalid signature/secret')
    return res.status(401).json({ error: 'Invalid webhook signature' })
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Empty payload' })
  }

  const type = body._type
  const id = body._id

  // ── post → ISR ────────────────────────────────────────────────────────────
  if (type === 'post') {
    const { revalidated, failed } = await revalidatePost(res, body)
    if (failed.length && revalidated.length === 0) {
      return res.status(500).json({
        ok: false,
        action: 'revalidate',
        _type: 'post',
        failed,
      })
    }
    console.log('[sanity-webhook] post revalidated:', revalidated.join(', '))
    return res.status(200).json({
      ok: true,
      action: 'revalidate',
      _type: 'post',
      _id: id || null,
      paths: revalidated,
      ...(failed.length ? { failed } : {}),
      now: Date.now(),
    })
  }

  // ── product → Gemini auto-tag ─────────────────────────────────────────────
  if (type === 'product') {
    if (!id) {
      return res.status(400).json({ error: 'Missing document _id for product' })
    }
    const productId = toBaseId(id)
    console.log(`[sanity-webhook] product auto-tag: ${productId} (rev: ${body._rev || 'n/a'})`)

    // Respond first so Sanity does not wait on Gemini
    res.status(200).json({
      ok: true,
      action: 'auto-tag',
      _type: 'product',
      productId,
      received: true,
    })

    triggerProductAutoTag(req, productId)
    return
  }

  // Unknown type — acknowledge so Sanity does not retry forever
  console.log(`[sanity-webhook] skipped _type=${type}`)
  return res.status(200).json({
    ok: true,
    skipped: true,
    reason: `Unsupported _type: ${type || '(missing)'}`,
  })
}
