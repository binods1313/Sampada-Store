const { moderateImage } = require('../../services/contentModerationService');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { image, context } = req.body; // image as base64

        if (!image) {
            return res.status(400).json({ error: 'Image data required' });
        }

        // Decode base64
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');

        const result = await moderateImage(imageBuffer, context || 'review');

        res.json(result);

    } catch (error) {
        console.error('Moderation API error:', error);
        res.status(500).json({ error: 'Moderation failed' });
    }
}
