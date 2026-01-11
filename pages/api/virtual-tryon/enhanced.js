import { enhancedTryOn } from '../../../controllers/tryonController';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await enhancedTryOn(req, res);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
