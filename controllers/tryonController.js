const { detectFaceFeatures } = require('../services/faceDetectionService');
const { generateTryOnImage } = require('../services/tryonService'); // existing service

async function enhancedTryOn(req, res) {
    const { user_image, product_id, color, size } = req.body;

    // Validate input
    if (!user_image || !product_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(user_image.split(',')[1], 'base64');

    // Step 1: Detect face features
    const faceData = await detectFaceFeatures(imageBuffer);

    if (!faceData.success) {
        return res.status(400).json({
            error: faceData.error,
            suggestion: "For best results, ensure your face is clearly visible and well-lit"
        });
    }

    // Step 2: Quality checks
    const qualityCheck = validateImageQuality(faceData);
    if (!qualityCheck.passed) {
        return res.status(400).json({
            error: "Image quality issue",
            details: qualityCheck.issues,
            suggestions: qualityCheck.suggestions
        });
    }

    // Step 3: Generate try-on with enhanced positioning
    const tryOnResults = await generateTryOnImage({
        imageBuffer,
        productId: product_id,
        color,
        size,
        faceLandmarks: faceData.landmarks,
        faceBox: faceData.boundingBox,
        poses: [1, 2, 3, 4, 5]
    });

    // Step 4: Return results
    res.json({
        success: true,
        face_detected: true,
        face_data: faceData,
        try_on_results: tryOnResults,
        quality_score: qualityCheck.score
    });
}

function validateImageQuality(faceData) {
    const issues = [];
    const suggestions = [];
    let score = 100;

    // Check face angle (should be frontal)
    if (Math.abs(faceData.angles.pan) > 15) {
        issues.push("Face turned too much to the side");
        suggestions.push("Face the camera directly");
        score -= 20;
    }

    if (Math.abs(faceData.angles.tilt) > 10) {
        issues.push("Head tilted");
        suggestions.push("Keep your head straight");
        score -= 10;
    }

    // Check confidence
    if (faceData.confidence < 0.8) {
        issues.push("Face detection confidence low");
        suggestions.push("Ensure good lighting and clear image");
        score -= 30;
    }

    return {
        passed: score >= 60,
        score,
        issues,
        suggestions
    };
}

module.exports = { enhancedTryOn };
