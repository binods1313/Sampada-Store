import { tagSingleProduct, tagBulkProducts } from '../../../controllers/autoTagController';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Check header or query param to distinguish bulk vs single if needed
        // For simplicity, check body content
        if (req.body.product_ids) {
            await tagBulkProducts(req, res);
        } else {
            await tagSingleProduct(req, res);
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
