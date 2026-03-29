/**
 * Get Available Free Models from OpenRouter
 * Returns list of currently available free models
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAvailableFreeModels } from '@/lib/openrouter';

interface ModelsResponse {
  success: boolean;
  models: Array<{
    id: string;
    name: string;
    contextLength: number;
  }>;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ModelsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, models: [], error: 'Method not allowed' });
  }

  try {
    const models = await getAvailableFreeModels();
    
    return res.status(200).json({
      success: true,
      models: models.map(m => ({
        id: m.id,
        name: m.name,
        contextLength: m.context_length,
      })),
    });
  } catch (error) {
    console.error('[Models API] Error:', error);
    return res.status(500).json({
      success: false,
      models: [],
      error: error instanceof Error ? error.message : 'Failed to fetch models',
    });
  }
}
