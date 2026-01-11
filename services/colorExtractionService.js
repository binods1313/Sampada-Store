// services/colorExtractionService.js

const vision = require('@google-cloud/vision');
let colorNameList = []; // Initialize empty
const client = new vision.ImageAnnotatorClient();

// Load color list async
(async () => {
    try {
        const mod = await import('color-name-list');
        colorNameList = mod.default || mod;
    } catch (e) {
        console.warn('Failed to load color-name-list', e);
    }
})();

async function extractColors(imageUrl) {
    try {
        const [result] = await client.imageProperties({ source: { imageUri: imageUrl } });

        if (!result.imagePropertiesAnnotation || !result.imagePropertiesAnnotation.dominantColors) {
            return {
                success: true,
                colors: [],
                color_family: 'neutral',
                suggested_complementary: []
            };
        }

        const colors = result.imagePropertiesAnnotation.dominantColors.colors;

        // Process and enrich color data
        const processedColors = colors
            .filter(c => c.pixelFraction > 0.01) // At least 1% of image
            .slice(0, 5) // Top 5 colors
            .map((colorInfo, index) => {
                const hex = rgbToHex(colorInfo.color);
                const name = getColorName(hex); // Custom helper

                return {
                    hex,
                    rgb: {
                        r: Math.round(colorInfo.color.red || 0),
                        g: Math.round(colorInfo.color.green || 0),
                        b: Math.round(colorInfo.color.blue || 0)
                    },
                    name: name,
                    percentage: Math.round(colorInfo.pixelFraction * 1000) / 10,
                    score: colorInfo.score,
                    is_dominant: index === 0
                };
            });

        if (processedColors.length === 0) {
            return { success: true, colors: [], color_family: 'neutral', suggested_complementary: [] };
        }

        // Determine color family using the dominant color
        const colorFamily = determineColorFamily(processedColors[0].rgb);

        // Generate complementary colors
        const complementary = generateComplementaryColors(processedColors[0].hex);

        return {
            success: true,
            colors: processedColors,
            color_palette: processedColors.map(c => c.hex),
            color_family: colorFamily,
            suggested_complementary: complementary
        };

    } catch (error) {
        console.error('Color extraction error:', error);
        return { success: false, error: error.message };
    }
}

function getColorName(hex) {
    // Simple closest match logic
    const nearest = colorNameList.find(c => c.hex === hex);
    if (nearest) return nearest.name;
    // Fallback? We could use nearest-color lib but for now return Hex if strict match fails, or implement simple distance
    // Implementing simple distance for better names:
    let minDistance = Infinity;
    let closestName = hex;

    // Check first 1000 common colors to save perf, or all if feasible.
    // Optimization: Just check exact first. If not found, iterate.
    for (const color of colorNameList) {
        const d = colorDistance(hexToRgb(hex), hexToRgb(color.hex));
        if (d < minDistance) {
            minDistance = d;
            closestName = color.name;
            if (d === 0) break;
        }
    }
    return closestName;
}

function colorDistance(rgb1, rgb2) {
    if (!rgb1 || !rgb2) return 1000;
    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}

function rgbToHex(color) {
    const r = Math.round(color.red || 0).toString(16).padStart(2, '0');
    const g = Math.round(color.green || 0).toString(16).padStart(2, '0');
    const b = Math.round(color.blue || 0).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function determineColorFamily(rgb) {
    const { r, g, b } = rgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Grayscale
    if (max - min < 30) {
        if (max < 50) return 'black';
        if (max > 200) return 'white';
        return 'gray';
    }

    // Color families
    if (r > g && r > b) {
        if (g > b) return 'warm'; // Red-orange-yellow
        return 'red';
    }
    if (g > r && g > b) return 'green';
    if (b > r && b > g) {
        if (r > g) return 'purple';
        return 'blue';
    }

    return 'neutral';
}

function generateComplementaryColors(hex) {
    // Simple complementary color generation
    const rgb = hexToRgb(hex);
    if (!rgb) return ['#FFFFFF', '#000000'];

    // Complementary (opposite on color wheel)
    const comp1 = rgbToHex({
        red: 255 - rgb.r,
        green: 255 - rgb.g,
        blue: 255 - rgb.b
    });

    // Analogous colors (adjacent on wheel - roughly)
    // Simplification: Shift hue
    // A better way would be HSL conversion. For now, simple RGB shift can suffice for demo.
    const comp2 = rgbToHex({
        red: Math.min(255, rgb.r + 50),
        green: Math.max(0, rgb.g - 30),
        blue: rgb.b
    });

    return [comp1, comp2];
}

module.exports = { extractColors };
