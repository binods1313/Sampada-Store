/**
 * Shared xAI Grok helpers for Sampada Originals
 */

export const MODE_CONFIG = {
  style_assistant: {
    systemPrompt:
      'You are Kavya, Sampada Originals personal style guide. Warm, expert in Indian heritage fashion. Under 120 words. Recommend specific products when possible.',
    maxTokens: 300,
  },
  search: {
    systemPrompt:
      'Extract search intent. Return ONLY JSON: { keywords[], category, occasion, priceRange, colors[], style }',
    maxTokens: 150,
  },
  description: {
    systemPrompt:
      'Luxury Indian fashion copywriter. Heritage hook, materials, 3 occasions, brand value. 150 words max.',
    maxTokens: 200,
  },
  blog: {
    systemPrompt:
      'Editorial voice of Sampada Journal. Rich, cultural, modern Indian identity. Return JSON: { title, excerpt, body(markdown), category, tags[] }',
    maxTokens: 1000,
  },
  caption: {
    systemPrompt:
      'Lookbook caption writer. Lyrical, heritage-inspired, 40 words max. No hashtags.',
    maxTokens: 80,
  },
  size_advisor: {
    systemPrompt: `You are a size advisor for Indian fashion brand Sampada Originals.
Given customer measurements, recommend the best size.
Consider Indian sizing conventions — Indian sizes run slightly smaller than Western.
Return ONLY valid JSON, no explanation, no markdown:
{ "recommended": "M", "confidence": "high", "note": "fits true to size for slim fit kurtas" }`,
    maxTokens: 150,
  },
};

const GROK_CHAT_MODEL = process.env.GROK_MODEL_CHAT || 'grok-3';
const XAI_CHAT_URL = 'https://api.x.ai/v1/chat/completions';

/**
 * Strip markdown code fences before JSON.parse().
 * Grok sometimes wraps JSON in ```json blocks even when told not to.
 */
export function sanitizeJSON(text) {
  if (!text || typeof text !== 'string') return text;
  let cleaned = text.trim();
  const fenced = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) cleaned = fenced[1].trim();
  return cleaned;
}

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];

  return history
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      let role = item.role;
      if (role === 'model') role = 'assistant';
      if (role !== 'user' && role !== 'assistant') return null;

      let content = item.content;
      if (typeof content !== 'string') {
        if (Array.isArray(item.parts)) {
          content = item.parts.map((p) => p?.text || '').join('');
        } else if (typeof item.text === 'string') {
          content = item.text;
        } else if (typeof item.message === 'string') {
          content = item.message;
        } else {
          content = String(content ?? '');
        }
      }

      content = content.trim();
      if (!content) return null;

      return { role, content };
    })
    .filter(Boolean);
}

/**
 * Call xAI chat completions. Returns raw reply string — no parsing.
 * @param {{ mode: string, message: string, history?: Array, maxTokens?: number }} params
 */
export async function callGrokChat({ mode, message, history = [], maxTokens }) {
  const config = MODE_CONFIG[mode];
  if (!config) {
    const err = new Error('Invalid mode');
    err.code = 'INVALID_MODE';
    throw err;
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    const err = new Error('XAI_API_KEY not found in environment');
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const trimmedMessage = message?.trim();
  if (!trimmedMessage) {
    const err = new Error('message is required');
    err.code = 'MISSING_MESSAGE';
    throw err;
  }

  const normalizedHistory = normalizeHistory(history);
  const tokenLimit = maxTokens ?? config.maxTokens;

  const messages = [
    { role: 'system', content: config.systemPrompt },
    ...normalizedHistory,
    { role: 'user', content: trimmedMessage },
  ];

  console.log('[grok-chat] Request:', {
    mode,
    model: GROK_CHAT_MODEL,
    maxTokens: tokenLimit,
    historyLength: normalizedHistory.length,
    messageLength: trimmedMessage.length,
  });

  const response = await fetch(XAI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROK_CHAT_MODEL,
      messages,
      max_tokens: tokenLimit,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[grok-chat] API error:', data);
    const err = new Error(
      data?.error?.message || data?.error || data?.message || 'Grok chat request failed'
    );
    err.code = 'API_ERROR';
    err.status = response.status;
    err.detail = data;
    throw err;
  }

  const reply = data?.choices?.[0]?.message?.content;
  if (typeof reply !== 'string' || !reply.trim()) {
    const err = new Error('Empty reply from Grok');
    err.code = 'EMPTY_REPLY';
    err.detail = data;
    throw err;
  }

  console.log('[grok-chat] Success:', { mode, replyLength: reply.length });
  return { reply, usage: data?.usage || null };
}