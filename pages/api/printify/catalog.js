import { printifyAPI } from '../../../lib/printifyClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const catalog = await printifyAPI.getCatalog();
    res.status(200).json(catalog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}