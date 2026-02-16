// components/VisualSearch/VisualSearchOptimized.jsx
// OPTIMIZED VERSION with Quick Wins patterns applied

import React, { useState, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { VISUAL_SEARCH_CONFIG, STYLES } from './config';

// OPTIMIZATION 1: Memoize ProductCard component to prevent unnecessary re-renders
const ProductCard = memo(({ product }) => {
  const productUrl = `/product/${product.slug?.current || product.product_id}`;
  const matchPercentage = (product.similarity_score * 100).toFixed(0);

  return (
    <Link href={productUrl} passHref style={STYLES.productLink}>
      <div className="product-card" style={STYLES.productCard}>
        <img 
          src={product.image_url} 
          alt={product.name} 
          style={STYLES.productImage}
          loading="lazy"
        />
        <div>
          <h4 style={STYLES.productName}>{product.name}</h4>
          <p className="price" style={STYLES.productPrice}>${product.price}</p>
          <p className="match-score" style={STYLES.matchScore}>
            {matchPercentage}% match
          </p>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

// OPTIMIZATION 2: Memoize ColorSwatch component
const ColorSwatch = memo(({ color }) => (
  <span
    className="color-swatch"
    style={{ ...STYLES.colorSwatch, backgroundColor: color.hex }}
    title={color.name}
  />
));

ColorSwatch.displayName = 'ColorSwatch';

// OPTIMIZATION 3: Memoize StyleTag component
const StyleTag = memo(({ tag }) => (
  <span className="tag" style={STYLES.tag}>{tag}</span>
));

StyleTag.displayName = 'StyleTag';

// OPTIMIZATION 4: Memoize DetectedInfo component
const DetectedInfo = memo(({ colors, tags }) => (
  <div className="detected-info" style={STYLES.detectedInfo}>
    <h3 style={STYLES.detectedTitle}>Detected:</h3>
    
    {colors && colors.length > 0 && (
      <div className="colors" style={STYLES.colorsContainer}>
        {colors.map((color, i) => (
          <ColorSwatch key={i} color={color} />
        ))}
      </div>
    )}
    
    {tags && tags.length > 0 && (
      <div className="tags" style={STYLES.tagsContainer}>
        {tags.slice(0, VISUAL_SEARCH_CONFIG.maxStyleTags).map((tag, i) => (
          <StyleTag key={i} tag={tag} />
        ))}
      </div>
    )}
  </div>
));

DetectedInfo.displayName = 'DetectedInfo';

// OPTIMIZATION 5: Memoize ErrorMessage component
const ErrorMessage = memo(({ error, details }) => (
  <div className="error-message" style={STYLES.errorMessage}>
    Error: {error}
    {details && (
      <div style={STYLES.errorDetails}>
        Details: {typeof details === 'object' ? JSON.stringify(details) : details}
      </div>
    )}
  </div>
));

ErrorMessage.displayName = 'ErrorMessage';

// Main VisualSearch component
function VisualSearch() {
  const [searchImage, setSearchImage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // OPTIMIZATION 6: Use useCallback for event handlers to prevent recreation
  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSearch = useCallback(async (file) => {
    if (!file) return;

    // OPTIMIZATION 7: Use functional setState updates
    setLoading(true);

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      setSearchImage(base64Image);

      try {
        const response = await fetch(VISUAL_SEARCH_CONFIG.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image })
        });

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults({ error: 'Failed to search. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      console.error('File reading error');
      setLoading(false);
      setResults({ error: 'Failed to read image file.' });
    };

    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSearch(file);
    }
  }, [handleSearch]);

  // OPTIMIZATION 8: Memoize expensive computations
  const hasResults = useMemo(() => results && !results.error, [results]);
  
  const hasProducts = useMemo(() => 
    hasResults && results.matching_products && results.matching_products.length > 0,
    [hasResults, results]
  );

  const totalMatches = useMemo(() => 
    hasResults ? results.total_matches : 0,
    [hasResults, results]
  );

  // OPTIMIZATION 9: Memoize button text
  const uploadButtonText = useMemo(() => 
    searchImage ? 'Change Image' : '📷 Upload Image',
    [searchImage]
  );

  return (
    <div className="visual-search-container" style={STYLES.container}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggleModal}
        style={STYLES.toggleButton}
        title="Search by Image"
        aria-label="Search by Image"
      >
        📷
      </button>

      {/* Modal/Dropdown */}
      {isOpen && (
        <div className="visual-search-modal" style={STYLES.modal}>
          <div className="search-header" style={STYLES.header}>
            <h2 style={STYLES.title}>🔍 Search by Image</h2>
            <p style={STYLES.subtitle}>Upload a photo to find similar items</p>
          </div>

          <div className="upload-area" style={STYLES.uploadArea}>
            <input
              type="file"
              accept={VISUAL_SEARCH_CONFIG.acceptedFormats}
              onChange={handleFileChange}
              id={VISUAL_SEARCH_CONFIG.inputId}
              style={STYLES.fileInput}
            />
            <label 
              htmlFor={VISUAL_SEARCH_CONFIG.inputId} 
              className="upload-btn" 
              style={STYLES.uploadLabel}
            >
              {uploadButtonText}
            </label>
          </div>

          {searchImage && (
            <img 
              src={searchImage} 
              alt="Search Preview" 
              style={STYLES.previewImage}
            />
          )}

          {loading && <div className="loading">Analyzing image...</div>}

          {results && (
            <div className="search-results">
              {results.error ? (
                <ErrorMessage error={results.error} details={results.details} />
              ) : (
                <>
                  <DetectedInfo 
                    colors={results.detected_colors}
                    tags={results.style_tags}
                  />

                  <div className="products-grid" style={STYLES.productsGrid}>
                    <h3 style={STYLES.productsTitle}>
                      Found {totalMatches} similar items:
                    </h3>
                    
                    {hasProducts ? (
                      results.matching_products.map(product => (
                        <ProductCard 
                          key={product.product_id} 
                          product={product} 
                        />
                      ))
                    ) : (
                      <p>No similar products found.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(VisualSearch);
