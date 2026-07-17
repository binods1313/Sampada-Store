// pages/api/publish-drafts.js
// Manually publish one or more Sanity draft documents via the Actions API.
// POST { "draftIds": ["id1", "id2", ...] } — base IDs only (no "drafts." prefix required).
// No cron, webhook, or auto-trigger — same manual pattern as publish-release / apply-bundle-as-drafts.
// Auth: SANITY_PUBLISH_TOKEN (Editor)

import { createClient } from '@sanity/client'

const API_VERSION = '2025-02-19'
const PROJECT_ID = '7lh35oho'

function getConfig() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    PROJECT_ID
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production'
  const token = process.env.SANITY_PUBLISH_TOKEN
  return { projectId, dataset, token }
}

/**
 * Normalize to base document id (strip accidental "drafts." prefix).
 */
function toBaseId(raw) {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('drafts.')) {
    return trimmed.slice('drafts.'.length)
  }
  return trimmed
}

function buildPublishAction(baseId) {
  return {
    actionType: 'sanity.action.document.publish',
    draftId: `drafts.${baseId}`,
    publishedId: baseId,
  }
}

/**
 * POST one or more publish actions to the Actions API.
 * @returns {{ ok: boolean, status: number, body: any }}
 */
async function runActions(client, actions) {
  const dataset = client.config().dataset
  const response = await client.request({
    uri: `/data/actions/${dataset}`,
    method: 'POST',
    body: { actions },
  })
  // client.request throws on non-2xx; success body is returned
  return { ok: true, status: 200, body: response }
}

async function runActionsSafe(client, actions) {
  try {
    const result = await runActions(client, actions)
    return result
  } catch (error) {
    const status = error.statusCode || error.response?.statusCode || 500
    const body =
      error.response?.body ||
      error.details ||
      { message: error.message || 'Actions API request failed' }
    return { ok: false, status, body, error }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { projectId, dataset, token } = getConfig()

  if (!projectId) {
    return res.status(500).json({
      error: 'Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_PROJECT_ID)',
    })
  }
  if (!token) {
    return res.status(500).json({
      error:
        'Missing SANITY_PUBLISH_TOKEN. Add an Editor token to .env / .env.local',
    })
  }

  const rawIds = req.body?.draftIds
  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    return res.status(400).json({
      error:
        'draftIds is required and must be a non-empty array of document IDs',
    })
  }

  // Dedupe while preserving order; drop empties
  const seen = new Set()
  const baseIds = []
  const invalid = []
  for (const raw of rawIds) {
    const id = toBaseId(raw)
    if (!id) {
      invalid.push({ id: raw, error: 'Invalid or empty id' })
      continue
    }
    if (seen.has(id)) continue
    seen.add(id)
    baseIds.push(id)
  }

  if (baseIds.length === 0) {
    return res.status(400).json({
      error: 'No valid draftIds after normalization',
      failed: invalid,
    })
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: API_VERSION,
    useCdn: false,
  })

  const published = []
  const failed = [...invalid]

  try {
    // 1) Prefer ONE batched Actions request for all IDs
    const batchActions = baseIds.map(buildPublishAction)
    const batch = await runActionsSafe(client, batchActions)

    if (batch.ok) {
      published.push(...baseIds)
      return res.status(200).json({
        success: true,
        published: published.length,
        ids: published,
        failed: failed.length ? failed : undefined,
        mode: 'batch',
        sanity: batch.body ?? null,
      })
    }

    // 2) Batch failed — publish one-by-one so one bad ID does not block the rest
    console.warn(
      '[publish-drafts] batch failed, falling back to per-document:',
      batch.body?.message || batch.body
    )

    for (const id of baseIds) {
      const single = await runActionsSafe(client, [buildPublishAction(id)])
      if (single.ok) {
        published.push(id)
      } else {
        const reason =
          single.body?.message ||
          single.body?.error ||
          (typeof single.body === 'string' ? single.body : null) ||
          single.error?.message ||
          `Actions API status ${single.status}`
        failed.push({
          id,
          draftId: `drafts.${id}`,
          status: single.status,
          error: reason,
          details: single.body,
        })
      }
    }

    const allOk = failed.length === 0 && published.length > 0
    const partial = published.length > 0 && failed.length > 0

    return res.status(allOk ? 200 : partial ? 207 : 500).json({
      success: allOk,
      partial: partial || undefined,
      published: published.length,
      ids: published,
      failed: failed.length ? failed : undefined,
      mode: 'per-document',
      batchError: batch.body,
    })
  } catch (error) {
    console.error('[publish-drafts]', error)
    return res.status(500).json({
      error: error.message || 'Failed to publish drafts',
      details: error.response?.body || error.details || undefined,
    })
  }
}
