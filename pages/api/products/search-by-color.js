const { searchByColor } = require('../../services/colorSearchService');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { hex, tolerance } = req.query;

        if (!hex) {
            return res.status(400).json({ error: 'Missing hex code' });
        }

        const matches = await searchByColor(hex, tolerance ? parseInt(tolerance) : 50);

        res.json({ success: true, count: matches.length, matches });

    } catch (error) {
        console.error('Color search endpoint error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
}
