// pages/api/apply-bundle-as-drafts.js
// Manually apply a Sanity Content Release bundle into drafts.* documents.
// POST { "releaseId": "agent-5aoCGu" } — no cron/webhook/auto-trigger.
// Auth: SANITY_PUBLISH_TOKEN (Editor)

import { createClient } from '@sanity/client';

const API_VERSION = '2025-02-19';

function getConfig() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production';
  const token = process.env.SANITY_PUBLISH_TOKEN;
  return { projectId, dataset, token };
}

/**
 * Plain release id only (e.g. "agent-5aoCGu").
 * Strips accidental "_.releases." prefix if present.
 */
function normalizeReleaseId(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('_.releases.')) {
    return trimmed.slice('_.releases.'.length);
  }
  return trimmed;
}

/**
 * versions.<releaseId>.<baseId> → baseId
 * drafts.<baseId> → baseId
 * otherwise → id as-is
 */
function toBaseId(id, releaseId) {
  if (!id || typeof id !== 'string') return null;
  const versionPrefix = `versions.${releaseId}.`;
  if (id.startsWith(versionPrefix)) {
    return id.slice(versionPrefix.length);
  }
  if (id.startsWith('drafts.')) {
    return id.slice('drafts.'.length);
  }
  return id;
}

function toDraftDocument(doc, releaseId) {
  const baseId = toBaseId(doc._id, releaseId);
  if (!baseId) return null;

  const next = { ...doc, _id: `drafts.${baseId}` };
  // createOrReplace should not carry the previous revision
  delete next._rev;
  return next;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { projectId, dataset, token } = getConfig();

  if (!projectId) {
    return res.status(500).json({
      error: 'Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_PROJECT_ID)',
    });
  }
  if (!token) {
    return res.status(500).json({
      error:
        'Missing SANITY_PUBLISH_TOKEN. Add an Editor token to .env / .env.local',
    });
  }

  const releaseId = normalizeReleaseId(req.body?.releaseId);
  if (!releaseId) {
    return res.status(400).json({
      error: 'releaseId is required (plain string, e.g. "agent-5aoCGu")',
    });
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: API_VERSION,
    useCdn: false,
  });

  try {
    // Fetch all documents that are part of this release (version layer)
    const releaseClient = client.withConfig({ perspective: releaseId });
    const docs = await releaseClient.fetch(
      `*[sanity::partOfRelease("${releaseId}")]`
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return res.status(200).json({
        message: 'No documents found',
        count: 0,
      });
    }

    const tx = client.transaction();
    const appliedIds = [];

    for (const doc of docs) {
      const draftDoc = toDraftDocument(doc, releaseId);
      if (!draftDoc) continue;
      // Skip pure system/release docs if any slip in
      if (draftDoc._type === 'system.release') continue;
      tx.createOrReplace(draftDoc);
      appliedIds.push(draftDoc._id);
    }

    if (appliedIds.length === 0) {
      return res.status(200).json({
        message: 'No documents found',
        count: 0,
      });
    }

    const result = await tx.commit({ visibility: 'async' });

    return res.status(200).json({
      success: true,
      documentsApplied: appliedIds.length,
      draftIds: appliedIds,
      transaction: {
        transactionId: result?.transactionId || result?.results?.[0]?.id || null,
      },
      releaseId,
    });
  } catch (error) {
    console.error('[apply-bundle-as-drafts]', error);
    return res.status(500).json({
      error: error.message || 'Failed to apply release as drafts',
      releaseId,
      details: error.response?.body || error.details || undefined,
    });
  }
}
