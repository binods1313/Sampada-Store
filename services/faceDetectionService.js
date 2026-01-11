const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function detectFaceFeatures(imageBuffer) {
    try {
        const [result] = await client.faceDetection(imageBuffer);
        const faces = result.faceAnnotations;

        if (!faces || faces.length === 0) {
            return {
                success: false,
                error: "No face detected. Please upload a clear front-facing photo."
            };
        }

        const face = faces[0]; // Use first detected face

        return {
            success: true,
            landmarks: {
                leftEye: face.landmarks.find(l => l.type === 'LEFT_EYE')?.position,
                rightEye: face.landmarks.find(l => l.type === 'RIGHT_EYE')?.position,
                noseTip: face.landmarks.find(l => l.type === 'NOSE_TIP')?.position,
                mouthCenter: face.landmarks.find(l => l.type === 'MOUTH_CENTER')?.position,
                chinBottom: face.landmarks.find(l => l.type === 'CHIN_GNATHION')?.position
            },
            boundingBox: face.boundingPoly,
            confidence: face.detectionConfidence,
            angles: {
                roll: face.rollAngle,
                pan: face.panAngle,
                tilt: face.tiltAngle
            },
            emotions: {
                joy: face.joyLikelihood,
                sorrow: face.sorrowLikelihood,
                anger: face.angerLikelihood,
                surprise: face.surpriseLikelihood
            }
        };
    } catch (error) {
        console.error('Face detection error:', error);
        return {
            success: false,
            error: "Failed to process image. Please try again."
        };
    }
}

module.exports = { detectFaceFeatures };
