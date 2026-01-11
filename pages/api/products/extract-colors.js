const { extractColors } = require('../../services/colorExtractionService');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { image_url } = req.body;

        if (!image_url) {
            return res.status(400).json({ error: 'Missing image_url' });
        }

        const result = await extractColors(image_url);

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        res.json(result);

    } catch (error) {
        console.error('Color extraction endpoint error:', error);
        res.status(500).json({ error: 'Process failed' });
    }
}
