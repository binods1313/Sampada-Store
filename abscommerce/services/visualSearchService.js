/**
 * Visual Search Service using Google Gemini 1.5 Flash
 * Analyzes images to extract product attributes for search matching
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * Analyzes an image and extracts product-relevant attributes
 * @param {Object} imageSource - Image data (base64 or URL)
 * @returns {Object} Analysis results with labels, colors, objects
 */
async function analyzeImage(imageSource) {
    try {
        // Prepare image data for Gemini
        let imagePart;

        if (imageSource.content) {
            // Image data (handle both Buffer and base64 string)
            const base64Data = Buffer.isBuffer(imageSource.content)
                ? imageSource.content.toString('base64')
                : imageSource.content;

            imagePart = {
                inlineData: {
                    data: base64Data,
                    mimeType: imageSource.mimeType || "image/jpeg"
                }
            };
        } else if (imageSource.source?.imageUri) {
            // URL-based image - fetch and convert to base64
            const response = await fetch(imageSource.source.imageUri);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = response.headers.get('content-type') || 'image/jpeg';

            imagePart = {
                inlineData: {
                    data: base64,
                    mimeType: contentType
                }
            };
        } else {
            throw new Error("Invalid image source format");
        }

        // Create analysis prompt for e-commerce product matching
        const analysisPrompt = `Analyze this image for e-commerce product search. Return a JSON object with these fields:
        
1. "labels": Array of descriptive labels/tags (e.g., "dress", "floral", "summer", "casual", "bohemian")
2. "colors": Array of dominant colors with name and hex code (e.g., [{"name": "burgundy", "hex": "#722F37"}, {"name": "gold", "hex": "#FFD700"}])
3. "objects": Array of detected objects/items (e.g., ["tunic", "tassel", "embroidery"])
4. "category": Product category (e.g., "Women's Clothing", "Accessories", "Home Decor")
5. "style": Style descriptors (e.g., ["bohemian", "ethnic", "casual"])
6. "material": Detected or likely materials (e.g., ["cotton", "silk"])

Return ONLY valid JSON, no markdown or explanation.`;

        // Call Gemini with image and prompt
        const result = await model.generateContent([analysisPrompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        let analysisData;
        try {
            // Clean up response (remove markdown code blocks if present)
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            // Fallback: extract what we can
            analysisData = {
                labels: extractArrayFromText(text, 'labels'),
                colors: [{ name: "unknown", hex: "#808080" }],
                objects: [],
                category: "General",
                style: [],
                material: []
            };
        }

        // Format response to match expected structure
        return {
            success: true,
            labels: (analysisData.labels || []).map(label => ({
                description: typeof label === 'string' ? label.toLowerCase() : label,
                confidence: 0.85
            })),
            colors: (analysisData.colors || []).map((color, index) => ({
                name: color.name || "unknown",
                hex: color.hex || "#808080",
                percentage: Math.round(100 / (analysisData.colors?.length || 1))
            })),
            objects: (analysisData.objects || []).map(obj => ({
                name: typeof obj === 'string' ? obj.toLowerCase() : obj,
                confidence: 0.80
            })),
            category: analysisData.category || "General",
            style: analysisData.style || [],
            material: analysisData.material || [],
            webEntities: [] // Gemini doesn't provide web entities like Vision API
        };
    } catch (error) {
        console.error('Visual analysis error:', error);
        return {
            success: false,
            error: error.message,
            details: error.toString()
        };
    }
}

/**
 * Helper function to extract arrays from text (fallback parser)
 */
function extractArrayFromText(text, key) {
    try {
        const regex = new RegExp(`"${key}"\\s*:\\s*\\[([^\\]]+)\\]`, 'i');
        const match = text.match(regex);
        if (match) {
            return match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
    } catch (e) {
        console.warn(`Failed to extract ${key} from text`);
    }
    return [];
}

module.exports = { analyzeImage };
