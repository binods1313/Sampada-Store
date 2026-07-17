// pages/api/publish-release.js
// Manually publish a Sanity Content Release via the Actions API.
// No cron, webhook, or auto-trigger — invoke with POST { releaseId } only.
//
// Docs: https://www.sanity.io/docs/apis-and-sdks/content-releases-api
// Auth: SANITY_PUBLISH_TOKEN (Editor-scoped; do not reuse SANITY_API_WRITE_TOKEN)

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
 * Normalize releaseId: prefer plain id (e.g. "new-bikes-release" or "rSC2jjcUJ").
 * Strip accidental "_.releases." prefix if a client sends it.
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
  if (!dataset) {
    return res.status(500).json({
      error: 'Missing NEXT_PUBLIC_SANITY_DATASET (or SANITY_DATASET)',
    });
  }
  if (!token) {
    return res.status(500).json({
      error:
        'Missing SANITY_PUBLISH_TOKEN. Create an Editor API token at sanity.io/manage → API → Tokens and add it to .env.local',
    });
  }

  const releaseId = normalizeReleaseId(req.body?.releaseId);
  if (!releaseId) {
    return res.status(400).json({
      error: 'releaseId is required (plain string, e.g. "rSC2jjcUJ" or your release name)',
    });
  }

  const actionsUrl = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/actions/${dataset}`;
  const payload = {
    actions: [
      {
        actionType: 'sanity.action.release.publish',
        releaseId, // plain — no "_.releases." prefix
      },
    ],
  };

  try {
    const sanityRes = await fetch(actionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await sanityRes.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    // Surface Sanity's status and body as-is for manual debugging
    return res.status(sanityRes.status).json({
      ok: sanityRes.ok,
      status: sanityRes.status,
      releaseId,
      request: {
        url: actionsUrl,
        actionType: 'sanity.action.release.publish',
        releaseIdFormat: 'plain',
      },
      sanity: data,
    });
  } catch (error) {
    console.error('[publish-release]', error);
    return res.status(500).json({
      error: error.message || 'Failed to call Sanity Actions API',
      releaseId,
    });
  }
}
