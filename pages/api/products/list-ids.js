import { client } from '../../../lib/client'; // Read client is enough for listing IDs

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const ids = await client.fetch(`*[_type == "product" && !(_id in path("drafts.**"))]._id`);
        res.json({ ids });
    } catch (error) {
        console.error('Failed to list product IDs:', error);
        res.status(500).json({ error: 'Failed to fetch product IDs' });
    }
}
