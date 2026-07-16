// pages/api/ai/generate-field-text.js
// Generic Studio field text generator (title, excerpt, specialty, etc.)

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
}

function stripJsonFence(text) {
  if (!text) return text
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function localFallback({fieldName, fieldTitle, productName, title, details}) {
  const base = (productName || title || 'Sampada Originals').trim()
  const f = (fieldName || fieldTitle || '').toLowerCase()
  if (f.includes('title') || f === 'name') return base.slice(0, 80)
  if (f.includes('excerpt') || f.includes('meta')) {
    return `${base} — premium heritage fashion from Sampada Originals.`.slice(0, 160)
  }
  if (f.includes('specialty')) return `Signature craftsmanship in ${base}.`
  if (f.includes('department')) return 'Design & Product'
  if (f.includes('location')) return 'India'
  if (f === 'type' || f.includes('employment')) return 'Full-time'
  return (details || `${base} from Sampada Originals`).toString().slice(0, 600)
}

export default async function handler(req, res) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'})

  try {
    const body = req.body || {}
    const {
      fieldName,
      fieldTitle,
      productName,
      title,
      details,
      currentValue,
    } = body

    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      return res.status(200).json({
        text: localFallback(body),
        source: 'local',
      })
    }

    const system = `You write concise copy for Sampada Originals, a premium Indian heritage fashion brand.
Return ONLY the field value as plain text (no quotes, no markdown, no labels).
Match the field purpose. Keep titles short; excerpts ~150 chars; descriptions 1-3 sentences.`

    const user = [
      `Field: ${fieldTitle || fieldName || 'text'}`,
      productName ? `Product/name: ${productName}` : null,
      title ? `Document title: ${title}` : null,
      details ? `Context: ${String(details).slice(0, 500)}` : null,
      currentValue ? `Current value (improve or replace): ${String(currentValue).slice(0, 300)}` : null,
      'Write the field value now.',
    ]
      .filter(Boolean)
      .join('\n')

    const model = process.env.XAI_TEXT_MODEL || 'grok-3-mini'
    const aiRes = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 400,
        messages: [
          {role: 'system', content: system},
          {role: 'user', content: user},
        ],
      }),
    })

    const data = await aiRes.json().catch(() => ({}))
    if (!aiRes.ok) {
      return res.status(200).json({
        text: localFallback(body),
        source: 'local',
        warning: data?.error?.message || `xAI ${aiRes.status}`,
      })
    }

    let text = data?.choices?.[0]?.message?.content || ''
    text = stripJsonFence(text).replace(/^["']|["']$/g, '').trim()
    if (!text) {
      text = localFallback(body)
    }

    return res.status(200).json({text, source: 'xai', model})
  } catch (error) {
    console.error('[generate-field-text]', error)
    return res.status(200).json({
      text: localFallback(req.body || {}),
      source: 'local',
      warning: error.message,
    })
  }
}
