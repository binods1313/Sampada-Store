const { client } = require('../../lib/client');

export default async function handler(req, res) {
    try {
        // Aggregate unique colors from all products (variants + AI tags)
        // GROQ doesn't support easy complex aggregation on string arrays across documents efficiently without plugins
        // For now, we fetch a subset or use a known list. 
        // Optimization: Store a "global_colors" document that is updated periodically.
        // Here: Fetch products and distinct in code.

        const products = await client.fetch(`*[_type == "product"][0...100]{ "colors": variants[].colorHex, "ai_colors": ai_metadata.colors }`);

        const colorSet = new Set();
        const uniqueColors = [];

        products.forEach(p => {
            (p.colors || []).forEach(c => colorSet.add(c));
            (p.ai_colors || []).forEach(c => {
                // ai_colors are usually names or hexes. If hex, add.
                if (c && c.startsWith('#')) colorSet.add(c);
            });
        });

        // Convert to array
        const result = Array.from(colorSet).map(hex => ({ hex, name: hex })); // Ideally resolve name

        // Return a curated list if empty or too massive
        if (result.length === 0) {
            // Fallback default palette
            res.json({
                colors: [
                    { hex: '#000000', name: 'Black' },
                    { hex: '#FFFFFF', name: 'White' },
                    { hex: '#FF0000', name: 'Red' },
                    { hex: '#0000FF', name: 'Blue' },
                    { hex: '#00FF00', name: 'Green' },
                    { hex: '#FFFF00', name: 'Yellow' }
                ]
            });
        } else {
            res.json({ colors: result.slice(0, 20) }); // Limit to 20
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
