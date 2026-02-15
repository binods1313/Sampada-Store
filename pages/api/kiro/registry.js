// pages/api/kiro/registry.js
/**
 * API endpoint to access Kiro runtime registry
 */

import { getRuntime } from '../../../lib/startup';

export default async function handler(req, res) {
  try {
    const runtime = await getRuntime();

    if (req.method === 'GET') {
      const { type, name } = req.query;

      // Get specific item
      if (name) {
        const item = runtime.get(name);
        if (!item) {
          return res.status(404).json({ error: `Item not found: ${name}` });
        }
        return res.json(item);
      }

      // Get all items of a type
      if (type === 'powers') {
        return res.json({
          type: 'powers',
          items: runtime.getAllPowers(),
          count: runtime.getAllPowers().length
        });
      }

      if (type === 'skills') {
        return res.json({
          type: 'skills',
          items: runtime.getAllSkills(),
          count: runtime.getAllSkills().length
        });
      }

      // Get stats
      if (type === 'stats') {
        return res.json(runtime.getStats());
      }

      // Get everything
      return res.json({
        powers: runtime.getAllPowers(),
        skills: runtime.getAllSkills(),
        conflicts: runtime.getConflicts(),
        stats: runtime.getStats()
      });
    }

    if (req.method === 'POST') {
      const { action, path, args } = req.body;

      if (action === 'execute') {
        const result = await runtime.execute(path, ...(args || []));
        return res.json(result);
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Registry API error:', error);
    res.status(500).json({ error: error.message });
  }
}
