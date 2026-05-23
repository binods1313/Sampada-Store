Google Cloud Vision API Integration - Development Prompt for Coder
Project Overview
Integrate Google Cloud Vision API to add 5 powerful features to the e-commerce platform. This will enhance user experience, automate workflows, and provide competitive advantages. All existing functionalities must remain intact.

Prerequisites & Setup
1. Google Cloud Vision API Setup
bash# Install the client library
npm install @google-cloud/vision

# Set up authentication
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-service-account-key.json"
Required API Key Configuration:

Create service account in Google Cloud Console
Download JSON key file
Enable Vision API in your project
Set appropriate IAM permissions
Store credentials securely (use environment variables)


Phase 1: Core Features Implementation (Priority Order)

FEATURE 1: Enhanced Virtual Try-On with Face Detection
Objective
Improve existing virtual try-on accuracy by adding precise face detection and landmark identification.
Technical Specification
API Endpoint to Create:
javascriptPOST /api/virtual-tryon/enhanced

Request Body:
{
  "user_image": "base64_encoded_image",
  "product_id": "12345",
  "color": "pale_peach",
  "size": "XS"
}

Response:
{
  "success": true,
  "face_detected": true,
  "face_landmarks": {
    "left_eye": { "x": 120, "y": 150 },
    "right_eye": { "x": 180, "y": 150 },
    "nose": { "x": 150, "y": 200 },
    "mouth_center": { "x": 150, "y": 250 }
  },
  "face_bounds": {
    "width": 200,
    "height": 250,
    "top": 100,
    "left": 50
  },
  "confidence": 0.95,
  "poses": [
    {
      "pose_id": 1,
      "image_url": "https://cdn.example.com/tryon/session_123_pose_1.jpg",
      "alignment_quality": "excellent"
    }
    // ... 4 more poses
  ]
}
Implementation Steps
Step 1: Face Detection Service
javascript// services/faceDetectionService.js

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
        leftEye: face.landmarks.find(l => l.type === 'LEFT_EYE').position,
        rightEye: face.landmarks.find(l => l.type === 'RIGHT_EYE').position,
        noseTip: face.landmarks.find(l => l.type === 'NOSE_TIP').position,
        mouthCenter: face.landmarks.find(l => l.type === 'MOUTH_CENTER').position,
        chinBottom: face.landmarks.find(l => l.type === 'CHIN_GNATHION').position
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
Step 2: Integration with Existing Try-On
javascript// controllers/tryonController.js

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
Step 3: Frontend Integration
javascript// components/EnhancedTryOn.jsx

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
    <div className="enhanced-tryon-container">
      <button className="tryon-trigger-btn" onClick={() => document.getElementById('image-upload').click()}>
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
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing your photo and generating try-on...</p>
          <p className="sub-text">This may take 15-30 seconds</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Try Again</button>
        </div>
      )}

      {faceDetectionResult && !loading && (
        <div className="face-detection-feedback">
          <p>✓ Face detected with {(faceDetectionResult.confidence * 100).toFixed(0)}% confidence</p>
          {faceDetectionResult.angles && (
            <p className="quality-tip">Image Quality: Excellent for try-on</p>
          )}
        </div>
      )}

      {tryOnResults && (
        <div className="tryon-results">
          {/* Display results - your existing UI */}
        </div>
      )}
    </div>
  );
}

export default EnhancedTryOn;

FEATURE 2: Visual Search (Shop by Image)
Objective
Allow users to upload any fashion image and find similar products in your catalog.
Technical Specification
API Endpoint:
javascriptPOST /api/search/visual

Request Body:
{
  "image": "base64_encoded_image" or "image_url": "https://..."
}

Response:
{
  "success": true,
  "detected_items": [
    {
      "type": "dress",
      "confidence": 0.92,
      "description": "Coral bohemian tunic dress"
    }
  ],
  "detected_colors": [
    { "hex": "#FF7F50", "name": "Coral", "percentage": 45 },
    { "hex": "#FFD700", "name": "Gold", "percentage": 30 }
  ],
  "style_tags": ["bohemian", "casual", "summer", "embroidered"],
  "matching_products": [
    {
      "product_id": 12345,
      "name": "Enhanced Bohemian-Inspired Tunic",
      "image_url": "https://...",
      "price": 38.00,
      "similarity_score": 0.88,
      "match_reasons": ["Similar color", "Same style", "Matching pattern"]
    }
    // ... more matches
  ]
}
Implementation
Step 1: Visual Analysis Service
javascript// services/visualSearchService.js

const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function analyzeImage(imageSource) {
  try {
    // Prepare request with multiple features
    const request = {
      image: imageSource,
      features: [
        { type: 'LABEL_DETECTION', maxResults: 20 },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
        { type: 'WEB_DETECTION' }
      ]
    };

    const [result] = await client.annotateImage(request);

    // Extract and process results
    return {
      success: true,
      labels: processLabels(result.labelAnnotations),
      colors: processColors(result.imagePropertiesAnnotation),
      objects: processObjects(result.localizedObjectAnnotations),
      webEntities: result.webDetection?.webEntities || []
    };
  } catch (error) {
    console.error('Visual analysis error:', error);
    return { success: false, error: error.message };
  }
}

function processLabels(labelAnnotations) {
  if (!labelAnnotations) return [];
  
  return labelAnnotations
    .filter(label => label.score > 0.7) // High confidence only
    .map(label => ({
      description: label.description.toLowerCase(),
      confidence: label.score
    }));
}

function processColors(imageProperties) {
  if (!imageProperties?.dominantColors?.colors) return [];
  
  return imageProperties.dominantColors.colors
    .slice(0, 5) // Top 5 colors
    .map(colorInfo => ({
      hex: rgbToHex(colorInfo.color),
      rgb: colorInfo.color,
      percentage: Math.round(colorInfo.pixelFraction * 100),
      name: getColorName(colorInfo.color) // You'll need a color-name library
    }));
}

function processObjects(objectAnnotations) {
  if (!objectAnnotations) return [];
  
  return objectAnnotations
    .filter(obj => obj.score > 0.6)
    .map(obj => ({
      name: obj.name.toLowerCase(),
      confidence: obj.score,
      boundingBox: obj.boundingPoly
    }));
}

function rgbToHex(color) {
  const r = Math.round(color.red || 0).toString(16).padStart(2, '0');
  const g = Math.round(color.green || 0).toString(16).padStart(2, '0');
  const b = Math.round(color.blue || 0).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

module.exports = { analyzeImage };
Step 2: Product Matching Logic
javascript// services/productMatchingService.js

async function findMatchingProducts(analysisResult, limit = 20) {
  const { labels, colors, objects } = analysisResult;
  
  // Build search query
  const searchCriteria = {
    categories: extractCategories(objects, labels),
    colors: colors.map(c => c.hex),
    styles: extractStyles(labels),
    minScore: 0.6
  };

  // Query database
  const products = await searchProductCatalog(searchCriteria);
  
  // Calculate similarity scores
  const scoredProducts = products.map(product => ({
    ...product,
    similarity_score: calculateSimilarity(product, searchCriteria),
    match_reasons: getMatchReasons(product, searchCriteria)
  }));

  // Sort by similarity and return top results
  return scoredProducts
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);
}

function extractCategories(objects, labels) {
  const clothingTypes = ['dress', 'tunic', 'shirt', 'pants', 'skirt', 'top'];
  const categories = [];

  // From objects
  objects.forEach(obj => {
    if (clothingTypes.some(type => obj.name.includes(type))) {
      categories.push(obj.name);
    }
  });

  // From labels
  labels.forEach(label => {
    if (clothingTypes.some(type => label.description.includes(type))) {
      categories.push(label.description);
    }
  });

  return [...new Set(categories)]; // Remove duplicates
}

function extractStyles(labels) {
  const styleKeywords = [
    'bohemian', 'casual', 'formal', 'vintage', 'modern',
    'ethnic', 'western', 'traditional', 'contemporary'
  ];

  return labels
    .filter(label => 
      styleKeywords.some(style => label.description.includes(style))
    )
    .map(label => label.description);
}

function calculateSimilarity(product, criteria) {
  let score = 0;
  let maxScore = 0;

  // Category match (40% weight)
  maxScore += 40;
  if (criteria.categories.some(cat => 
    product.category?.toLowerCase().includes(cat)
  )) {
    score += 40;
  }

  // Color match (30% weight)
  maxScore += 30;
  const colorMatch = criteria.colors.some(searchColor =>
    product.colors?.some(productColor => 
      colorDistance(searchColor, productColor) < 50
    )
  );
  if (colorMatch) {
    score += 30;
  }

  // Style match (30% weight)
  maxScore += 30;
  const styleMatch = criteria.styles.some(style =>
    product.tags?.includes(style) || product.description?.toLowerCase().includes(style)
  );
  if (styleMatch) {
    score += 30;
  }

  return score / maxScore;
}

function colorDistance(hex1, hex2) {
  // Simple RGB distance calculation
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

function getMatchReasons(product, criteria) {
  const reasons = [];
  
  if (criteria.categories.some(cat => product.category?.includes(cat))) {
    reasons.push('Similar item type');
  }
  
  if (criteria.colors.some(c => product.colors?.includes(c))) {
    reasons.push('Matching colors');
  }
  
  if (criteria.styles.some(s => product.tags?.includes(s))) {
    reasons.push('Same style');
  }
  
  return reasons;
}

module.exports = { findMatchingProducts };
Step 3: Visual Search Controller
javascript// controllers/visualSearchController.js

const { analyzeImage } = require('../services/visualSearchService');
const { findMatchingProducts } = require('../services/productMatchingService');

async function visualSearch(req, res) {
  try {
    const { image, image_url } = req.body;
    
    if (!image && !image_url) {
      return res.status(400).json({ error: 'Image or image URL required' });
    }

    // Prepare image source
    let imageSource;
    if (image_url) {
      imageSource = { source: { imageUri: image_url } };
    } else {
      const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
      imageSource = { content: imageBuffer };
    }

    // Step 1: Analyze image with Vision API
    const analysis = await analyzeImage(imageSource);
    
    if (!analysis.success) {
      return res.status(500).json({ error: 'Image analysis failed' });
    }

    // Step 2: Find matching products
    const matches = await findMatchingProducts(analysis);

    // Step 3: Return results
    res.json({
      success: true,
      detected_items: analysis.objects,
      detected_colors: analysis.colors,
      style_tags: analysis.labels.map(l => l.description),
      matching_products: matches,
      total_matches: matches.length
    });

  } catch (error) {
    console.error('Visual search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

module.exports = { visualSearch };
Step 4: Frontend Component
javascript// components/VisualSearch.jsx

import React, { useState } from 'react';

function VisualSearch() {
  const [searchImage, setSearchImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (file) => {
    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      setSearchImage(base64Image);

      try {
        const response = await fetch('/api/search/visual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image })
        });

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="visual-search">
      <div className="search-header">
        <h2>🔍 Search by Image</h2>
        <p>Upload a photo to find similar items</p>
      </div>

      <div className="upload-area">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleSearch(e.target.files[0])}
          id="visual-search-input"
          style={{ display: 'none' }}
        />
        <label htmlFor="visual-search-input" className="upload-btn">
          📷 Upload Image
        </label>
      </div>

      {loading && <div className="loading">Searching...</div>}

      {results && (
        <div className="search-results">
          <div className="detected-info">
            <h3>Detected:</h3>
            <div className="colors">
              {results.detected_colors.map((color, i) => (
                <span
                  key={i}
                  className="color-swatch"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="tags">
              {results.style_tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="products-grid">
            <h3>Found {results.total_matches} similar items:</h3>
            {results.matching_products.map(product => (
              <div key={product.product_id} className="product-card">
                <img src={product.image_url} alt={product.name} />
                <h4>{product.name}</h4>
                <p className="price">${product.price}</p>
                <p className="match-score">
                  {(product.similarity_score * 100).toFixed(0)}% match
                </p>
                <div className="match-reasons">
                  {product.match_reasons.map((reason, i) => (
                    <span key={i} className="reason">✓ {reason}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualSearch;

FEATURE 3: Automated Product Tagging
Objective
Automatically generate tags, categories, and descriptions for products when images are uploaded.
Technical Specification
API Endpoint:
javascriptPOST /api/products/auto-tag

Request Body:
{
  "product_id": 12345,
  "image_url": "https://cdn.example.com/products/tunic.jpg"
}

Response:
{
  "success": true,
  "product_id": 12345,
  "generated_tags": {
    "categories": ["tunic", "dress", "women's clothing"],
    "style": ["bohemian", "casual", "ethnic"],
    "features": ["embroidered", "long sleeve", "v-neck"],
    "occasions": ["beach", "casual", "summer"],
    "colors": ["coral", "peach", "orange"],
    "patterns": ["floral", "embroidered"],
    "materials": ["cotton", "voile"]
  },
  "confidence": 0.89,
  "suggested_description": "Elegant coral bohemian tunic featuring intricate embroidered details...",
  "seo_keywords": ["bohemian tunic", "coral dress", "embroidered top", "summer wear"]
}
Implementation
Step 1: Auto-Tagging Service
javascript// services/autoTaggingService.js

const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function autoTagProduct(imageUrl) {
  try {
    const [result] = await client.annotateImage({
      image: { source: { imageUri: imageUrl } },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 30 },
        { type: 'IMAGE_PROPERTIES' },
        { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
        { type: 'TEXT_DETECTION' } // For reading labels/tags in image
      ]
    });

    // Process all detection results
    const tags = {
      categories: extractCategories(result),
      style: extractStyles(result.labelAnnotations),
      features: extractFeatures(result.labelAnnotations),
      occasions: extractOccasions(result.labelAnnotations),
      colors: extractColors(result.imagePropertiesAnnotation),
      patterns: extractPatterns(result.labelAnnotations),
      materials: extractMaterials(result.textDetections)
    };

    const confidence = calculateOverallConfidence(result);

    return {
      success: true,
      tags,
      confidence,
      suggested_description: generateDescription(tags),
      seo_keywords: generateSEOKeywords(tags)
    };

  } catch (error) {
    console.error('Auto-tagging error:', error);
    return { success: false, error: error.message };
  }
}

function extractCategories(result) {
  const categoryKeywords = [
    'dress', 'tunic', 'top', 'shirt', 'blouse', 'kurta',
    'pants', 'jeans', 'skirt', 'shorts', 'jacket', 'coat'
  ];

  const categories = [];

  // From objects
  if (result.localizedObjectAnnotations) {
    result.localizedObjectAnnotations.forEach(obj => {
      if (categoryKeywords.some(kw => obj.name.toLowerCase().includes(kw))) {
        categories.push(obj.name.toLowerCase());
      }
    });
  }

  // From labels
  if (result.labelAnnotations) {
    result.labelAnnotations
      .filter(label => label.score > 0.75)
      .forEach(label => {
        const desc = label.description.toLowerCase();
        if (categoryKeywords.some(kw => desc.includes(kw))) {
          categories.push(desc);
        }
      });
  }

  return [...new Set(categories)];
}

function extractStyles(labels) {
  const styleKeywords = {
    'bohemian': ['bohemian', 'boho', 'hippie'],
    'casual': ['casual', 'everyday', 'relaxed'],
    'formal': ['formal', 'elegant', 'sophisticated'],
    'ethnic': ['ethnic', 'traditional', 'cultural'],
    'modern': ['modern', 'contemporary', 'trendy'],
    'vintage': ['vintage', 'retro', 'classic'],
    'minimalist': ['minimalist', 'simple', 'clean']
  };

  const styles = [];

  labels.filter(l => l.score > 0.7).forEach(label => {
    const desc = label.description.toLowerCase();
    Object.entries(styleKeywords).forEach(([style, keywords]) => {
      if (keywords.some(kw => desc.includes(kw))) {
        styles.push(style);
      }
    });
  });

  return [...new Set(styles)];
}

function extractFeatures(labels) {
  const featureKeywords = [
    'embroidered', 'printed', 'sequined', 'ruffled',
    'pleated', 'belted', 'buttoned', 'zippered',
    'long sleeve', 'short sleeve', 'sleeveless',
    'v-neck', 'round neck', 'collar', 'hood'
  ];

  const features = [];

  labels.filter(l => l.score > 0.65).forEach(label => {
    const desc = label.description.toLowerCase();
    featureKeywords.forEach(feature => {
      if (desc.includes(feature) || desc.includes(feature.replace(' ', ''))) {
        features.push(feature);
      }
    });
  });

  return [...new Set(features)];
}

function extractOccasions(labels) {
  const occasionMap = {
    'beach': ['beach', 'resort', 'vacation', 'tropical'],
    'casual': ['casual', 'everyday', 'weekend'],
    'party': ['party', 'celebration', 'festive'],
    'formal': ['formal', 'business', 'office', 'professional'],
    'wedding': ['wedding', 'bridal', 'ceremony'],
    'summer': ['summer', 'warm', 'sunny'],
    'winter': ['winter', 'cold', 'warm']
  };

  const occasions = [];

  labels.filter(l => l.score > 0.6).forEach(label => {
    const desc = label.description.toLowerCase();
    Object.entries(occasionMap).forEach(([occasion, keywords]) => {
      if (keywords.some(kw => desc.includes(kw))) {
        occasions.push(occasion);
      }
    });
  });

  return [...new Set(occasions)];
}

function extractColors(imageProperties) {
  if (!imageProperties?.dominantColors?.colors) return [];

  const colorNames = require('color-name-list'); // npm install color-name-list
  
  return imageProperties.dominantColors.colors
    .slice(0, 3)
    .map(colorInfo => {
      const hex = rgbToHex(colorInfo.color);
      const nearest = colorNames.find(c => c.hex === hex);
      return nearest ? nearest.name.toLowerCase() : hex;
    });
}

function extractPatterns(labels) {
  const patternKeywords = [
    'floral', 'geometric', 'striped', 'dotted', 'checked',
    'plaid', 'paisley', 'animal print', 'solid', 'embroidered'
  ];

  const patterns = [];

  labels.filter(l => l.score > 0.65).forEach(label => {
    const desc = label.description.toLowerCase();
    patternKeywords.forEach(pattern => {
      if (Continue8:42 PMdesc.includes(pattern)) {
patterns.push(pattern);
}
});
});
return [...new Set(patterns)];
}
function extractMaterials(textDetections) {
if (!textDetections || textDetections.length === 0) return [];
const materialKeywords = [
'cotton', 'silk', 'polyester', 'linen', 'wool',
'rayon', 'viscose', 'chiffon', 'georgette', 'voile'
];
const materials = [];
const fullText = textDetections[0]?.description?.toLowerCase() || '';
materialKeywords.forEach(material => {
if (fullText.includes(material)) {
materials.push(material);
}
});
return materials;
}
function calculateOverallConfidence(result) {
if (!result.labelAnnotations || result.labelAnnotations.length === 0) {
return 0;
}
const topScores = result.labelAnnotations
.slice(0, 5)
.map(l => l.score);
return topScores.reduce((a, b) => a + b, 0) / topScores.length;
}
function generateDescription(tags) {
const parts = [];
if (tags.style.length > 0) {
parts.push(${tags.style[0]} style);
}
if (tags.colors.length > 0) {
parts.push(in ${tags.colors[0]});
}
if (tags.categories.length > 0) {
parts.push(tags.categories[0]);
}
if (tags.features.length > 0) {
parts.push(featuring ${tags.features.slice(0, 2).join(' and ')});
}
if (tags.occasions.length > 0) {
parts.push(perfect for ${tags.occasions[0]} wear);
}
return Elegant ${parts.join(' ')}.;
}
function generateSEOKeywords(tags) {
const keywords = [];
// Combine style + category
tags.style.forEach(style => {
tags.categories.forEach(cat => {
keywords.push(${style} ${cat});
});
});
// Combine color + category
tags.colors.forEach(color => {
tags.categories.forEach(cat => {
keywords.push(${color} ${cat});
});
});
// Add features
tags.features.forEach(feature => {
keywords.push(feature);
});
return keywords.slice(0, 10); // Top 10 keywords
}
module.exports = { autoTagProduct };

**Step 2: Bulk Processing Controller**
```javascript
// controllers/autoTagController.js

const { autoTagProduct } = require('../services/autoTaggingService');
const Product = require('../models/Product');

// Single product tagging
async function tagSingleProduct(req, res) {
  try {
    const { product_id, image_url } = req.body;

    if (!product_id || !image_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get AI-generated tags
    const tagging = await autoTagProduct(image_url);

    if (!tagging.success) {
      return res.status(500).json({ error: 'Tagging failed' });
    }

    // Update product in database
    await Product.update(product_id, {
      tags: [
        ...tagging.tags.categories,
        ...tagging.tags.style,
        ...tagging.tags.features,
        ...tagging.tags.occasions
      ],
      colors: tagging.tags.colors,
      patterns: tagging.tags.patterns,
      materials: tagging.tags.materials,
      ai_description: tagging.suggested_description,
      seo_keywords: tagging.seo_keywords,
      tagging_confidence: tagging.confidence,
      auto_tagged: true,
      tagged_at: new Date()
    });

    res.json({
      success: true,
      product_id,
      generated_tags: tagging.tags,
      confidence: tagging.confidence
    });

  } catch (error) {
    console.error('Tag controller error:', error);
    res.status(500).json({ error: 'Tagging failed' });
  }
}

// Bulk tagging for entire catalog
async function tagBulkProducts(req, res) {
  try {
    const { product_ids } = req.body; // Array of product IDs
    const results = [];
    const errors = [];

    for (const product_id of product_ids) {
      try {
        const product = await Product.findById(product_id);
        if (!product || !product.image_url) {
          errors.push({ product_id, error: 'Product or image not found' });
          continue;
        }

        const tagging = await autoTagProduct(product.image_url);
        
        if (tagging.success) {
          await Product.update(product_id, {
            tags: [
              ...tagging.tags.categories,
              ...tagging.tags.style,
              ...tagging.tags.features
            ],
            auto_tagged: true
          });
          results.push({ product_id, success: true });
        } else {
          errors.push({ product_id, error: tagging.error });
        }

        // Rate limiting - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        errors.push({ product_id, error: error.message });
      }
    }

    res.json({
      success: true,
      total_processed: product_ids.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors
    });

  } catch (error) {
    console.error('Bulk tag error:', error);
    res.status(500).json({ error: 'Bulk tagging failed' });
  }
}

module.exports = { tagSingleProduct, tagBulkProducts };
```

**Step 3: Admin Interface for Bulk Tagging**
```javascript
// components/admin/BulkAutoTag.jsx

import React, { useState } from 'react';

function BulkAutoTag() {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(null);

  const startBulkTagging = async () => {
    setStatus('running');
    
    try {
      // Get all untagged products
      const response = await fetch('/api/products?auto_tagged=false');
      const products = await response.json();
      
      const productIds = products.map(p => p.id);
      
      // Process in batches of 50
      const batchSize = 50;
      let completed = 0;
      
      for (let i = 0; i < productIds.length; i += batchSize) {
        const batch = productIds.slice(i, i + batchSize);
        
        await fetch('/api/products/auto-tag/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_ids: batch })
        });
        
        completed += batch.length;
        setProgress({
          total: productIds.length,
          completed,
          percentage: Math.round((completed / productIds.length) * 100)
        });
      }
      
      setStatus('completed');
    } catch (error) {
      setStatus('error');
      console.error('Bulk tagging error:', error);
    }
  };

  return (
    <div className="bulk-tag-admin">
      <h2>Bulk Auto-Tag Products</h2>
      <p>Automatically generate tags for all products using AI</p>
      
      <button 
        onClick={startBulkTagging} 
        disabled={status === 'running'}
        className="start-btn"
      >
        {status === 'running' ? 'Processing...' : 'Start Bulk Tagging'}
      </button>

      {progress && (
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
          <p>{progress.completed} / {progress.total} products tagged ({progress.percentage}%)</p>
        </div>
      )}

      {status === 'completed' && (
        <div className="success-message">
          ✓ Bulk tagging completed successfully!
        </div>
      )}
    </div>
  );
}

export default BulkAutoTag;
```

---

## FEATURE 4: Content Moderation for User-Generated Content

### Objective
Automatically screen user-uploaded photos (reviews, try-on images) for inappropriate content before displaying.

### Technical Specification

**API Endpoint**:
```javascript
POST /api/moderate/image

Request Body:
{
  "image": "base64_encoded_image",
  "context": "review" | "tryon" | "profile"
}

Response:
{
  "success": true,
  "approved": true | false,
  "moderation_result": {
    "adult": "VERY_UNLIKELY",
    "violence": "UNLIKELY",
    "spoof": "UNLIKELY",
    "medical": "UNLIKELY",
    "racy": "POSSIBLE"
  },
  "action": "auto_approve" | "flag_for_review" | "auto_reject",
  "confidence": 0.95,
  "reasons": ["Content appears safe"]
}
```

### Implementation

**Step 1: Moderation Service**
```javascript
// services/contentModerationService.js

const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function moderateImage(imageBuffer, context = 'review') {
  try {
    const [result] = await client.safeSearchDetection(imageBuffer);
    const detections = result.safeSearchAnnotation;

    // Define threshold based on context
    const thresholds = getThresholdsForContext(context);

    // Evaluate safety
    const evaluation = evaluateSafety(detections, thresholds);

    // Log for audit
    await logModerationResult({
      context,
      detections,
      evaluation,
      timestamp: new Date()
    });

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
      confidence: detections.confidence || 0.95,
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
  const thresholds = {
    'review': {
      adult: 'POSSIBLE',      // Stricter for reviews
      violence: 'POSSIBLE',
      racy: 'LIKELY',
      spoof: 'VERY_LIKELY'
    },
    'tryon': {
      adult: 'LIKELY',        // More lenient for try-on (clothing context)
      violence: 'POSSIBLE',
      racy: 'VERY_LIKELY',
      spoof: 'VERY_LIKELY'
    },
    'profile': {
      adult: 'POSSIBLE',      // Strict for profile pictures
      violence: 'UNLIKELY',
      racy: 'POSSIBLE',
      spoof: 'LIKELY'
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

    if (getIndex(detected) >= getIndex(threshold)) {
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
  } else if (flags.includes('adult') && detections.adult === 'VERY_LIKELY') {
    action = 'auto_reject';
    approved = false;
    reasons.push('Inappropriate content detected');
  } else if (flags.includes('violence') && detections.violence === 'VERY_LIKELY') {
    action = 'auto_reject';
    approved = false;
    reasons.push('Violent content detected');
  } else {
    action = 'flag_for_review';
    approved = false;
    reasons.push(`Flagged categories: ${flags.join(', ')}`);
  }

  return { approved, action, reasons, flags };
}

async function logModerationResult(data) {
  // Log to database for audit trail
  const ModerationLog = require('../models/ModerationLog');
  await ModerationLog.create(data);
}

module.exports = { moderateImage };
```

**Step 2: Integration with Review System**
```javascript
// controllers/reviewController.js

const { moderateImage } = require('../services/contentModerationService');

async function submitReview(req, res) {
  try {
    const { product_id, rating, comment, images } = req.body;

    const moderatedImages = [];
    const rejectedImages = [];

    // Moderate each uploaded image
    for (const image of images) {
      const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
      const moderation = await moderateImage(imageBuffer, 'review');

      if (moderation.action === 'auto_approve') {
        // Upload to CDN and save
        const imageUrl = await uploadImageToCDN(imageBuffer);
        moderatedImages.push({
          url: imageUrl,
          moderation_status: 'approved'
        });
      } else if (moderation.action === 'flag_for_review') {
        // Save but don't display until manual review
        const imageUrl = await uploadImageToCDN(imageBuffer);
        moderatedImages.push({
          url: imageUrl,
          moderation_status: 'pending_review',
          moderation_flags: moderation.reasons
        });
      } else {
        // Auto-rejected
        rejectedImages.push({
          reason: moderation.reasons.join(', ')
        });
      }
    }

    // Create review with moderated images
    const review = await Review.create({
      product_id,
      user_id: req.user.id,
      rating,
      comment,
      images: moderatedImages,
      status: moderatedImages.some(i => i.moderation_status === 'pending_review') 
        ? 'pending_moderation' 
        : 'approved'
    });

    res.json({
      success: true,
      review_id: review.id,
      images_approved: moderatedImages.filter(i => i.moderation_status === 'approved').length,
      images_pending: moderatedImages.filter(i => i.moderation_status === 'pending_review').length,
      images_rejected: rejectedImages.length,
      message: rejectedImages.length > 0 
        ? 'Some images were rejected due to content policy' 
        : 'Review submitted successfully'
    });

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
}

module.exports = { submitReview };
```

**Step 3: Admin Moderation Dashboard**
```javascript
// components/admin/ModerationQueue.jsx

import React, { useState, useEffect } from 'react';

function ModerationQueue() {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    const response = await fetch('/api/admin/moderation/pending');
    const data = await response.json();
    setPendingItems(data.items);
    setLoading(false);
  };

  const handleDecision = async (itemId, decision) => {
    await fetch(`/api/admin/moderation/${itemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }) // 'approve' or 'reject'
    });

    // Remove from queue
    setPendingItems(items => items.filter(i => i.id !== itemId));
  };

  return (
    <div className="moderation-queue">
      <h2>Content Moderation Queue</h2>
      <p>{pendingItems.length} items pending review</p>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="pending-items">
          {pendingItems.map(item => (
            <div key={item.id} className="moderation-item">
              <img src={item.image_url} alt="Pending moderation" />
              <div className="item-info">
                <p><strong>Type:</strong> {item.context}</p>
                <p><strong>User:</strong> {item.user_email}</p>
                <p><strong>Flags:</strong> {item.flags.join(', ')}</p>
                <p><strong>Submitted:</strong> {new Date(item.created_at).toLocaleString()}</p>
              </div>
              <div className="moderation-scores">
                <p>Adult: {item.scores.adult}</p>
                <p>Violence: {item.scores.violence}</p>
                <p>Racy: {item.scores.racy}</p>
              </div>
              <div className="actions">
                <button 
                  onClick={() => handleDecision(item.id, 'approve')}
                  className="approve-btn"
                >
                  ✓ Approve
                </button>
                <button 
                  onClick={() => handleDecision(item.id, 'reject')}
                  className="reject-btn"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModerationQueue;
```

---

## FEATURE 5: Smart Color Extraction & Filters

### Objective
Extract exact colors from product images and create accurate, shoppable color filters.

### Technical Specification

**API Endpoint**:
```javascript
POST /api/products/extract-colors

Request Body:
{
  "image_url": "https://cdn.example.com/products/tunic.jpg"
}

Response:
{
  "success": true,
  "colors": [
    {
      "hex": "#FF7F50",
      "rgb": { "r": 255, "g": 127, "b": 80 },
      "name": "Coral",
      "percentage": 45.3,
      "is_dominant": true
    },
    {
      "hex": "#FFD700",
      "rgb": { "r": 255, "g": 215, "b": 0 },
      "name": "Gold",
      "percentage": 28.7,
      "is_dominant": false
    }
  ],
  "color_palette": ["#FF7F50", "#FFD700", "#FFFFFF"],
  "color_family": "warm",
  "suggested_complementary": ["#50C8FF", "#7F50FF"]
}
```

### Implementation

**Step 1: Color Extraction Service**
```javascript
// services/colorExtractionService.js

const vision = require('@google-cloud/vision');
const nearestColor = require('nearest-color').from(require('color-name-list'));
const client = new vision.ImageAnnotatorClient();

async function extractColors(imageUrl) {
  try {
    const [result] = await client.imageProperties(imageUrl);
    const colors = result.imagePropertiesAnnotation.dominantColors.colors;

    // Process and enrich color data
    const processedColors = colors
      .filter(c => c.pixelFraction > 0.01) // At least 1% of image
      .slice(0, 5) // Top 5 colors
      .map((colorInfo, index) => {
        const hex = rgbToHex(colorInfo.color);
        const colorName = nearestColor(hex);

        return {
          hex,
          rgb: {
            r: Math.round(colorInfo.color.red || 0),
            g: Math.round(colorInfo.color.green || 0),
            b: Math.round(colorInfo.color.blue || 0)
          },
          name: colorName.name,
          percentage: Math.round(colorInfo.pixelFraction * 1000) / 10,
          score: colorInfo.score,
          is_dominant: index === 0
        };
      });

    // Determine color family
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

function rgbToHex(color) {
  const r = Math.round(color.red || 0).toString(16).padStart(2, '0');
  const g = Math.round(color.green || 0).toString(16).padStart(2, '0');
  const b = Math.round(color.blue || 0).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
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
  
  // Complementary (opposite on color wheel)
  const comp1 = rgbToHex({
    red: 255 - rgb.r,
    green: 255 - rgb.g,
    blue: 255 - rgb.b
  });

  // Analogous colors (adjacent on wheel)
  const comp2 = rgbToHex({
    red: Math.min(255, rgb.r + 30),
    green: Math.max(0, rgb.g - 30),
    blue: rgb.b
  });

  return [comp1, comp2];
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

module.exports = { extractColors };
```

**Step 2: Color-Based Product Search**
```javascript
// services/colorSearchService.js

async function searchByColor(colorHex, tolerance = 50) {
  const targetRgb = hexToRgb(colorHex);
  
  // Query products from database
  const allProducts = await Product.findAll();

  // Filter by color similarity
  const matches = allProducts.filter(product => {
    if (!product.dominant_color) return false;

    const productRgb = hexToRgb(product.dominant_color);
    const distance = colorDistance(targetRgb, productRgb);

    return distance <= tolerance;
  });

  // Sort by similarity
  return matches
    .map(product => ({
      ...product,
      color_similarity: 1 - (colorDistance(targetRgb, hexToRgb(product.dominant_color)) / 441) // Max distance is sqrt(255^2 * 3)
    }))
    .sort((a, b) => b.color_similarity - a.color_similarity);
}

function colorDistance(rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

module.exports = { searchByColor };
```

**Step 3: Color Filter Component**
```javascript
// components/ColorFilter.jsx

import React, { useState, useEffect } from 'react';

function ColorFilter({ onColorSelect }) {
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    fetchAvailableColors();
  }, []);

  const fetchAvailableColors = async () => {
    // Get all unique colors from products
    const response = await fetch('/api/products/colors');
    const data = await response.json();
    setAvailableColors(data.colors);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  return (
    <div className="color-filter">
      <h3>Shop by Color</h3>
      <div className="color-swatches">
        {availableColors.map(color => (
          <div
            key={color.hex}
            className={`color-swatch ${selectedColor?.hex === color.hex ? 'selected' : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleColorClick(color)}
            title={color.name}
          >
            {selectedColor?.hex === color.hex && <span className="checkmark">✓</span>}
          </div>
        ))}
      </div>
      {selectedColor && (
        <div className="selected-color-info">
          <p>Showing products in <strong>{selectedColor.name}</strong></p>
          <button onClick={() => {
            setSelectedColor(null);
            onColorSelect(null);
          }}>
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}

export default ColorFilter;
```

---

## DATABASE SCHEMA UPDATES

### Required Tables
```sql
-- Table 1: Face Detection Data
CREATE TABLE face_detection_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(255) NOT NULL,
    landmarks JSON,
    bounding_box JSON,
    confidence DECIMAL(3,2),
    angles JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(session_id)
);

-- Table 2: Visual Search History
CREATE TABLE visual_searches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    search_image_url VARCHAR(500),
    detected_items JSON,
    detected_colors JSON,
    style_tags JSON,
    results_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id),
    INDEX(created_at)
);

-- Table 3: Auto-Generated Tags
CREATE TABLE product_ai_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    categories JSON,
    styles JSON,
    features JSON,
    occasions JSON,
    colors JSON,
    patterns JSON,
    materials JSON,
    confidence DECIMAL(3,2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY (product_id)
);

-- Table 4: Content Moderation Log
CREATE TABLE content_moderation_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(500),
    user_id INT,
    context ENUM('review', 'tryon', 'profile'),
    adult_score VARCHAR(20),
    violence_score VARCHAR(20),
    racy_score VARCHAR(20),
    spoof_score VARCHAR(20),
    action ENUM('auto_approve', 'flag_for_review', 'auto_reject'),
    approved BOOLEAN,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id),
    INDEX(context),
    INDEX(action),
    INDEX(created_at)
);

-- Table 5: Product Colors
CREATE TABLE product_colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    hex_code VARCHAR(7),
    rgb_values JSON,
    color_name VARCHAR(50),
    percentage DECIMAL(5,2),
    is_dominant BOOLEAN DEFAULT FALSE,
    color_family VARCHAR(30),
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX(product_id),
    INDEX(hex_code),
    INDEX(color_family)
);

-- Update Products Table
ALTER TABLE products ADD COLUMN auto_tagged BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN tagging_confidence DECIMAL(3,2);
ALTER TABLE products ADD COLUMN tagged_at TIMESTAMP NULL;
ALTER TABLE products ADD COLUMN ai_description TEXT;
ALTER TABLE products ADD COLUMN seo_keywords JSON;
ALTER TABLE products ADD COLUMN dominant_color VARCHAR(7);
ALTER TABLE products ADD COLUMN color_palette JSON;
```

---

## API ROUTES TO CREATE
```javascript
// routes/api.js

const express = require('express');
const router = express.Router();

// Virtual Try-On
router.post('/virtual-tryon/enhanced', tryonController.enhancedTryOn);

// Visual Search
router.post('/search/visual', visualSearchController.visualSearch);
router.get('/search/visual/history', visualSearchController.getSearchHistory);

// Auto-Tagging
router.post('/products/auto-tag', autoTagController.tagSingleProduct);
router.post('/products/auto-tag/bulk', autoTagController.tagBulkProducts);
router.get('/products/untagged', autoTagController.getUntaggedProducts);

// Content Moderation
router.post('/moderate/image', moderationController.moderateImage);
router.get('/admin/moderation/pending', moderationController.getPendingItems);
router.post('/admin/moderation/:id', moderationController.reviewItem);

// Color Extraction
router.post('/products/extract-colors', colorController.extractColors);
router.get('/products/colors', colorController.getAvailableColors);
router.post('/search/color', colorController.searchByColor);

module.exports = router;Continue8:45 PM
---

## CONFIGURATION & ENVIRONMENT VARIABLES
```bash
# .env file

# Google Cloud Vision API
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account-key.json
VISION_API_ENDPOINT=https://vision.googleapis.com/v1

# Rate Limiting (prevent API overuse)
VISION_API_RATE_LIMIT=100  # requests per minute
VISION_API_DAILY_LIMIT=10000  # requests per day

# Image Processing
MAX_IMAGE_SIZE_MB=5
ALLOWED_IMAGE_FORMATS=jpg,jpeg,png
IMAGE_COMPRESSION_QUALITY=85

# CDN Configuration
CDN_URL=https://cdn.yoursite.com
CDN_BUCKET=product-images

# Feature Flags (enable/disable features)
FEATURE_ENHANCED_TRYON=true
FEATURE_VISUAL_SEARCH=true
FEATURE_AUTO_TAGGING=true
FEATURE_CONTENT_MODERATION=true
FEATURE_COLOR_EXTRACTION=true

# Moderation Settings
AUTO_APPROVE_THRESHOLD=0.9
MANUAL_REVIEW_THRESHOLD=0.6
AUTO_REJECT_THRESHOLD=0.3

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=password
```

---

## TESTING REQUIREMENTS

### Unit Tests
```javascript
// tests/services/faceDetection.test.js

const { detectFaceFeatures } = require('../../services/faceDetectionService');

describe('Face Detection Service', () => {
  test('should detect face in valid image', async () => {
    const imageBuffer = loadTestImage('valid-face.jpg');
    const result = await detectFaceFeatures(imageBuffer);
    
    expect(result.success).toBe(true);
    expect(result.landmarks).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  test('should fail gracefully for no-face image', async () => {
    const imageBuffer = loadTestImage('no-face.jpg');
    const result = await detectFaceFeatures(imageBuffer);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('No face detected');
  });
});

// tests/services/visualSearch.test.js

const { analyzeImage } = require('../../services/visualSearchService');

describe('Visual Search Service', () => {
  test('should extract labels and colors', async () => {
    const imageUrl = 'https://example.com/test-product.jpg';
    const result = await analyzeImage({ source: { imageUri: imageUrl } });
    
    expect(result.success).toBe(true);
    expect(result.labels.length).toBeGreaterThan(0);
    expect(result.colors.length).toBeGreaterThan(0);
  });
});

// tests/services/contentModeration.test.js

const { moderateImage } = require('../../services/contentModerationService');

describe('Content Moderation Service', () => {
  test('should approve safe content', async () => {
    const imageBuffer = loadTestImage('safe-content.jpg');
    const result = await moderateImage(imageBuffer, 'review');
    
    expect(result.approved).toBe(true);
    expect(result.action).toBe('auto_approve');
  });

  test('should flag inappropriate content', async () => {
    const imageBuffer = loadTestImage('inappropriate-content.jpg');
    const result = await moderateImage(imageBuffer, 'review');
    
    expect(result.approved).toBe(false);
    expect(result.action).toMatch(/flag_for_review|auto_reject/);
  });
});
```

### Integration Tests
```javascript
// tests/integration/visualSearch.test.js

describe('Visual Search Integration', () => {
  test('complete visual search flow', async () => {
    // Upload image
    const response = await request(app)
      .post('/api/search/visual')
      .send({ image: testImageBase64 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.matching_products.length).toBeGreaterThan(0);
  });
});
```

### Manual Testing Checklist
[ ] Upload valid face photo → Try-on works
[ ] Upload no-face photo → Error message shown
[ ] Upload product image → Visual search returns results
[ ] Bulk tag 10 products → All tagged successfully
[ ] Upload inappropriate review image → Flagged for review
[ ] Extract colors from product → Accurate colors returned
[ ] Filter products by color → Correct products shown
[ ] Test with slow internet → Loading states work
[ ] Test on mobile device → Responsive design works
[ ] Test API rate limits → Proper error handling

---

## PERFORMANCE OPTIMIZATION

### Caching Strategy
```javascript
// middleware/cacheMiddleware.js

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour default

function cacheVisionResults(req, res, next) {
  const cacheKey = generateCacheKey(req.body);
  const cachedResult = cache.get(cacheKey);

  if (cachedResult) {
    return res.json(cachedResult);
  }

  // Store original res.json
  const originalJson = res.json.bind(res);
  
  // Override res.json to cache results
  res.json = (data) => {
    cache.set(cacheKey, data);
    originalJson(data);
  };

  next();
}

function generateCacheKey(requestBody) {
  const crypto = require('crypto');
  return crypto
    .createHash('md5')
    .update(JSON.stringify(requestBody))
    .digest('hex');
}

module.exports = { cacheVisionResults };
```

### Rate Limiting
```javascript
// middleware/rateLimitMiddleware.js

const rateLimit = require('express-rate-limit');

const visionApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { visionApiLimiter };
```

### Image Optimization
```javascript
// utils/imageOptimization.js

const sharp = require('sharp');

async function optimizeImage(imageBuffer, maxWidth = 1024) {
  return await sharp(imageBuffer)
    .resize(maxWidth, null, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 85 })
    .toBuffer();
}

module.exports = { optimizeImage };
```

---

## ERROR HANDLING & LOGGING
```javascript
// middleware/errorHandler.js

function visionAPIErrorHandler(error, req, res, next) {
  console.error('Vision API Error:', {
    message: error.message,
    stack: error.stack,
    endpoint: req.path,
    timestamp: new Date()
  });

  // Log to monitoring service (e.g., Sentry)
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error);
  }

  // User-friendly error messages
  const errorMessages = {
    'PERMISSION_DENIED': 'API authentication failed. Please contact support.',
    'QUOTA_EXCEEDED': 'Service temporarily unavailable. Please try again later.',
    'INVALID_ARGUMENT': 'Invalid image format. Please upload JPG, JPEG, or PNG.',
    'DEADLINE_EXCEEDED': 'Request timeout. Please try with a smaller image.'
  };

  const message = errorMessages[error.code] || 'An error occurred. Please try again.';

  res.status(500).json({
    success: false,
    error: message,
    request_id: req.id // For support reference
  });
}

module.exports = { visionAPIErrorHandler };
```

---

## DEPLOYMENT CHECKLIST
Pre-Deployment
[ ] Google Cloud Vision API enabled and tested
[ ] Service account key securely stored
[ ] Environment variables configured
[ ] Database migrations run
[ ] All tests passing
[ ] Rate limiting configured
[ ] Caching implemented
[ ] Error logging setup
Post-Deployment
[ ] Monitor API usage and costs
[ ] Check error logs for issues
[ ] Verify all features working in production
[ ] Test with real user data
[ ] Monitor performance metrics
[ ] Set up alerts for API quota
[ ] Review moderation queue regularly
Monitoring
[ ] API request count
[ ] Success/failure rates
[ ] Response times
[ ] User engagement metrics
[ ] Cost per feature
[ ] Cache hit rates

---

## COST ESTIMATION & MONITORING

### Monthly Cost Calculator
```javascript
// utils/costCalculator.js

function estimateMonthlyCost(usage) {
  const pricing = {
    faceDetection: 1.50 / 1000,      // $1.50 per 1000 units
    labelDetection: 1.50 / 1000,
    imageProperties: 1.50 / 1000,
    safeSearch: 1.50 / 1000,
    webDetection: 3.50 / 1000,
    objectLocalization: 1.50 / 1000
  };

  let totalCost = 0;

  Object.keys(usage).forEach(feature => {
    const units = usage[feature];
    const freeUnits = 1000; // First 1000 free per month
    
    if (units > freeUnits) {
      totalCost += (units - freeUnits) * pricing[feature];
    }
  });

  return {
    totalCost: totalCost.toFixed(2),
    breakdown: usage,
    savings: (1000 * Object.keys(usage).length * 1.50).toFixed(2) // Free tier savings
  };
}

module.exports = { estimateMonthlyCost };
```

---

## SUCCESS METRICS TO TRACK
```javascript
// analytics/metricsTracking.js

async function trackFeatureUsage(feature, userId, metadata = {}) {
  await Analytics.track({
    event: `vision_api_${feature}_used`,
    userId,
    properties: {
      ...metadata,
      timestamp: new Date(),
      feature
    }
  });
}

// Track these events:
// - virtual_tryon_enhanced_used
// - visual_search_performed
// - product_auto_tagged
// - content_moderated
// - color_filter_used
// - conversion_from_tryon
// - conversion_from_visual_search
```

---

## NEXT STEPS FOR CODER

1. **Set up Google Cloud Vision API** (15 mins)
   - Create service account
   - Download credentials
   - Add to project

2. **Install dependencies** (5 mins)
```bash
   npm install @google-cloud/vision color-name-list nearest-color sharp express-rate-limit node-cache
```

3. **Implement features in order** (1-2 weeks)
   - Day 1-2: Enhanced Virtual Try-On
   - Day 3-4: Visual Search
   - Day 5-6: Auto-Tagging
   - Day 7: Content Moderation
   - Day 8: Color Extraction

4. **Testing phase** (3-4 days)
   - Unit tests
   - Integration tests
   - Manual testing
   - Performance testing

5. **Deploy to staging** (1 day)
   - Test with real data
   - Monitor costs
   - Fix any issues

6. **Production deployment** (1 day)
   - Gradual rollout
   - Monitor metrics
   - Iterate based on feedback

---

## QUESTIONS TO CLARIFY BEFORE STARTING

1. Which feature should we prioritize first?
2. What's the expected monthly user volume?
3. Should we implement all features at once or phase-by-phase?
4. Do we need admin approval for auto-tagging before going live?
5. What's the acceptable API cost budget per month?
6. Should visual search be on the homepage or separate page?
7. Do we need email notifications for moderation queue?
