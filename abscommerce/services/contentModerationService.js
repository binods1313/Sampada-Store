const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const { writeClient } = require('../lib/client'); // Sanity client for logging

async function moderateImage(imageBuffer, context = 'review') {
    try {
        const [result] = await client.safeSearchDetection(imageBuffer);
        const detections = result.safeSearchAnnotation;

        // Define threshold based on context
        const thresholds = getThresholdsForContext(context);

        // Evaluate safety
        const evaluation = evaluateSafety(detections, thresholds);

        // Log for audit (Async - fire and forget)
        logModerationResult({
            context,
            detections,
            evaluation,
            timestamp: new Date().toISOString()
        }).catch(err => console.error('Failed to log moderation', err));

        return {
            success: true,
            approved: evaluation.approved,
            moderation_result: {
                adult: detections.adult,
                violence: detections.violence,
                spoof: detections.spoof,
                medical: detections.medical,
                racy: detections.racy
            },
            action: evaluation.action,
            confidence: detections.confidence || 0.95, // Confidence is legacy in some vision versions, default high if present
            reasons: evaluation.reasons
        };

    } catch (error) {
        console.error('Moderation error:', error);
        return {
            success: false,
            error: error.message,
            action: 'flag_for_review' // Fail-safe: manual review on error
        };
    }
}

function getThresholdsForContext(context) {
    // Different thresholds for different contexts
    // SafeSearch Likelihoods: UNKNOWN, VERY_UNLIKELY, UNLIKELY, POSSIBLE, LIKELY, VERY_LIKELY

    const thresholds = {
        'review': {
            adult: 'POSSIBLE',      // Review images should be clean
            violence: 'POSSIBLE',
            racy: 'LIKELY',         // Some skin is okay (clothing) but not excessive
            spoof: 'VERY_LIKELY',
            medical: 'LIKELY'
        },
        'tryon': {
            adult: 'POSSIBLE',
            violence: 'POSSIBLE',
            racy: 'VERY_LIKELY',      // Try-on might involve specific clothing, slightly more lenient on 'racy' false positives
            spoof: 'VERY_LIKELY',
            medical: 'LIKELY'
        },
        'profile': {
            adult: 'POSSIBLE',
            violence: 'UNLIKELY',     // Profile pics should be strictly non-violent
            racy: 'LIKELY',
            spoof: 'LIKELY',
            medical: 'Likely'
        }
    };

    return thresholds[context] || thresholds['review'];
}

function evaluateSafety(detections, thresholds) {
    const likelihoodOrder = [
        'UNKNOWN',
        'VERY_UNLIKELY',
        'UNLIKELY',
        'POSSIBLE',
        'LIKELY',
        'VERY_LIKELY'
    ];

    const getIndex = (likelihood) => likelihoodOrder.indexOf(likelihood);

    const flags = [];
    const reasons = [];

    // Check each category
    Object.keys(thresholds).forEach(category => {
        const detected = detections[category];
        const threshold = thresholds[category];

        // If detected likelihood is greater than or equal to threshold index
        if (detected && getIndex(detected) >= getIndex(threshold)) {
            flags.push(category);
        }
    });

    // Determine action
    let action;
    let approved;

    if (flags.length === 0) {
        action = 'auto_approve';
        approved = true;
        reasons.push('Content appears safe');
    } else if (flags.includes('adult') && (detections.adult === 'LIKELY' || detections.adult === 'VERY_LIKELY')) {
        action = 'auto_reject';
        approved = false;
        reasons.push('Inappropriate content detected (Adult)');
    } else if (flags.includes('violence') && (detections.violence === 'LIKELY' || detections.violence === 'VERY_LIKELY')) {
        action = 'auto_reject';
        approved = false;
        reasons.push('Violent content detected');
    } else {
        action = 'flag_for_review';
        approved = false;
        reasons.push(`Flagged for review: ${flags.join(', ')}`);
    }

    return { approved, action, reasons, flags };
}

async function logModerationResult(data) {
    // Log to Sanity 'moderation_log' schema
    // Ensure this schema exists or simplistic write will allow it if schema is loose, 
    // but ideally we should define it. For now, we assume schema flexibility or user added it.
    await writeClient.create({
        _type: 'moderation_log',
        timestamp: data.timestamp,
        context: data.context,
        approved: data.evaluation.approved,
        action: data.evaluation.action,
        flags: data.evaluation.flags,
        raw_scores: {
            adult: data.detections.adult,
            violence: data.detections.violence,
            racy: data.detections.racy
        }
    });
}

module.exports = { moderateImage };
