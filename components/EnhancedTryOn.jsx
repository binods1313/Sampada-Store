import React, { useState } from 'react';

function EnhancedTryOn({ productId, color, size }) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [faceDetectionResult, setFaceDetectionResult] = useState(null);
    const [tryOnResults, setTryOnResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            setError('Please upload JPG, JPEG, or PNG files only');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            setUploadedImage(e.target.result);

            // Check for inappropriate content
            const modRes = await fetch('/api/moderate/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: e.target.result, context: 'tryon' })
            });
            const modData = await modRes.json();

            if (!modData.approved) {
                setError(`Image rejected: ${modData.reasons.join(', ')}`);
                return;
            }

            await processTryOn(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const processTryOn = async (base64Image) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/virtual-tryon/enhanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_image: base64Image,
                    product_id: productId,
                    color,
                    size
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Processing failed');
            }

            setFaceDetectionResult(data.face_data);
            setTryOnResults(data.try_on_results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enhanced-tryon-container" style={{ margin: '20px 0', padding: '20px', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <button
                className="tryon-trigger-btn"
                onClick={() => document.getElementById('image-upload').click()}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                👗 Try On Virtually (Enhanced)
            </button>

            <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />

            {loading && (
                <div className="loading-state" style={{ marginTop: '15px' }}>
                    <div className="spinner" style={{ marginBottom: '10px' }}>Loading...</div>
                    <p>Analyzing your photo and generating try-on...</p>
                    <p className="sub-text" style={{ fontSize: '12px', color: '#666' }}>This may take 15-30 seconds</p>
                </div>
            )}

            {error && (
                <div className="error-message" style={{ color: 'red', marginTop: '15px' }}>
                    <p>{error}</p>
                    <button onClick={() => setError(null)} style={{ marginTop: '5px' }}>Try Again</button>
                </div>
            )}

            {faceDetectionResult && !loading && (
                <div className="face-detection-feedback" style={{ marginTop: '15px', color: 'green' }}>
                    <p>✓ Face detected with {(faceDetectionResult.confidence * 100).toFixed(0)}% confidence</p>
                    {faceDetectionResult.angles && (
                        <p className="quality-tip" style={{ fontSize: '14px', color: '#333' }}>Image Quality: Excellent for try-on</p>
                    )}
                </div>
            )}

            {tryOnResults && (
                <div className="tryon-results">
                    <img src={tryOnResults.result_url} alt="Virtual Try-On Result" style={{ maxWidth: '100%', marginTop: '20px', borderRadius: '8px' }} />
                </div>
            )}
        </div>
    );
}

export default EnhancedTryOn;
