import { visualSearch } from '../../../controllers/visualSearchController';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Increase limit for image uploads
        },
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await visualSearch(req, res);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
