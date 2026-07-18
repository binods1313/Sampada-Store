/**
 * On-demand ISR revalidation (Sanity → Next.js)
 * POST /api/revalidate
 *
 * When a Sanity `post` document is published/updated/deleted, a webhook
 * hits this route so blog pages refresh within seconds — no redeploy.
 *
 * Paths revalidated:
 *   /blog              (listing)
 *   /blog/[slug]       (individual post)
 *
 * ── Sanity webhook (preferred — shared with product auto-tag) ───────────
 *   Use the merged handler (one plan slot):
 *     POST https://sampadaoriginals.in/api/webhooks/sanity
 *     Filter: _type in ["post", "product"]
 *   See pages/api/webhooks/sanity.js for full setup.
 *
 *   This /api/revalidate route remains for manual busts and post-only tests.
 *
 * ── Manual test (local or prod) ─────────────────────────────────────────
 *   GET  /api/revalidate?secret=YOUR_SECRET&path=/blog/my-slug
 *   POST /api/revalidate?secret=YOUR_SECRET
 *        body: { "slug": "my-slug" }  or  { "slug": { "current": "my-slug" } }
 *
 * Env (use one):
 *   SANITY_WEBHOOK_SECRET  — preferred (shared with other Sanity webhooks)
 *   REVALIDATE_SECRET      — optional alias
 */

import crypto from 'crypto'

export const config = {
  api: {
    // Raw body required for Sanity HMAC signature verification
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

/**
 * Sanity webhook signature: header "sanity-webhook-signature"
 * format: t=<unix_ts>,v1=<hex_hmac>
 * signed payload: `${timestamp}.${rawBody}`
 */
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

  // Reject stale signatures (5 minutes)
  const ts = Number(timestamp)
  if (!Number.isFinite(ts)) return false
  const ageMs = Math.abs(Date.now() - ts * 1000)
  if (ageMs > 5 * 60 * 1000) return false

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
  // Projection: "slug": slug.current
  if (typeof body.slug === 'string') return body.slug || null
  return null
}

function sanitizePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) return null
  // Prevent path traversal / open revalidate of arbitrary absolute URLs
  if (path.includes('..') || path.includes('//') || path.includes(':')) return null
  return path
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secrets = getSecrets()
  if (secrets.length === 0) {
    console.error('[revalidate] No SANITY_WEBHOOK_SECRET or REVALIDATE_SECRET configured')
    return res.status(500).json({ error: 'Revalidate secret not configured' })
  }

  const querySecret = typeof req.query.secret === 'string' ? req.query.secret : ''
  const secretFromQuery = secrets.includes(querySecret)

  let rawBody = ''
  let parsed = null

  if (req.method === 'POST') {
    try {
      rawBody = await readRawBody(req)
      if (rawBody) {
        parsed = JSON.parse(rawBody)
      }
    } catch (err) {
      console.warn('[revalidate] Failed to parse body:', err.message)
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
  }

  const signatureHeader =
    req.headers['sanity-webhook-signature'] ||
    req.headers['Sanity-Webhook-Signature'] ||
    ''

  const secretFromSignature =
    Boolean(signatureHeader) &&
    secrets.some((s) => isValidSanitySignature(rawBody, signatureHeader, s))

  if (!secretFromQuery && !secretFromSignature) {
    console.warn('[revalidate] Unauthorized request')
    return res.status(401).json({ error: 'Invalid revalidate secret or signature' })
  }

  // Optional type guard for Sanity payloads (skip non-post if _type present)
  if (parsed?._type && parsed._type !== 'post') {
    return res.status(200).json({
      skipped: true,
      reason: `Unsupported _type: ${parsed._type}`,
    })
  }

  const paths = new Set()

  // Manual: ?path=/blog/foo
  const manualPath = sanitizePath(
    typeof req.query.path === 'string' ? req.query.path : ''
  )
  if (manualPath) {
    paths.add(manualPath)
  }

  const slug = extractSlug(parsed) ||
    (typeof req.query.slug === 'string' ? req.query.slug : null)

  if (slug) {
    // Blog posts live at /blog/[slug] (not /stories)
    paths.add(`/blog/${slug}`)
  }

  // Always refresh the journal index when a post changes
  if (slug || parsed?._type === 'post' || paths.size > 0) {
    paths.add('/blog')
  }

  // If webhook fired for a post but slug missing, still bust listing
  if (parsed?._type === 'post' && !slug) {
    paths.add('/blog')
    console.warn('[revalidate] post payload missing slug — revalidated /blog only')
  }

  if (paths.size === 0) {
    return res.status(400).json({
      error: 'Nothing to revalidate. Provide slug in body or path/slug query param.',
    })
  }

  const revalidated = []
  const failed = []

  for (const path of paths) {
    try {
      await res.revalidate(path)
      revalidated.push(path)
    } catch (err) {
      console.error(`[revalidate] Failed for ${path}:`, err.message)
      failed.push({ path, error: err.message })
    }
  }

  if (failed.length && revalidated.length === 0) {
    return res.status(500).json({
      revalidated: false,
      failed,
    })
  }

  console.log('[revalidate] OK:', revalidated.join(', '))
  return res.status(200).json({
    revalidated: true,
    paths: revalidated,
    ...(failed.length ? { failed } : {}),
    now: Date.now(),
  })
}
