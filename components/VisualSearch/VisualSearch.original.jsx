import React, { useState } from 'react';
import Link from 'next/link';

function VisualSearch() {
    const [searchImage, setSearchImage] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Toggle visibility

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
        <div className="visual-search-container" style={{ position: 'relative', zIndex: 10 }}>
            {/* Toggle Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    padding: '10px'
                }}
                title="Search by Image"
            >
                📷
            </button>

            {/* Modal/Dropdown */}
            {isOpen && (
                <div className="visual-search-modal" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '400px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 1000
                }}>
                    <div className="search-header" style={{ marginBottom: '15px' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: '0 0 5px 0' }}>🔍 Search by Image</h2>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Upload a photo to find similar items</p>
                    </div>

                    <div className="upload-area" style={{ marginBottom: '20px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSearch(e.target.files[0])}
                            id="visual-search-input"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="visual-search-input" className="upload-btn" style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#f1f1f1',
                            border: '2px dashed #ddd',
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}>
                            {searchImage ? 'Change Image' : '📷 Upload Image'}
                        </label>
                    </div>

                    {searchImage && (
                        <img src={searchImage} alt="Search Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '15px' }} />
                    )}

                    {loading && <div className="loading">Analyzing image...</div>}

                    {results && (
                        <div className="search-results">
                            {results.error ? (
                                <div className="error-message" style={{ color: 'red', padding: '10px' }}>
                                    Error: {results.error}
                                    {results.details && (
                                        <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#666' }}>
                                            Details: {typeof results.details === 'object' ? JSON.stringify(results.details) : results.details}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="detected-info" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                                        <h3 style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Detected:</h3>
                                        <div className="colors" style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                            {results.detected_colors && results.detected_colors.map((color, i) => (
                                                <span
                                                    key={i}
                                                    className="color-swatch"
                                                    style={{ backgroundColor: color.hex, width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc' }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                        <div className="tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {results.style_tags && results.style_tags.slice(0, 5).map((tag, i) => (
                                                <span key={i} className="tag" style={{ fontSize: '11px', backgroundColor: '#eef', padding: '2px 6px', borderRadius: '4px' }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="products-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <h3 style={{ fontSize: '1rem', margin: '0' }}>Found {results.total_matches} similar items:</h3>
                                        {results.matching_products && results.matching_products.length > 0 ? results.matching_products.map(product => (
                                            <Link href={`/product/${product.slug?.current || product.product_id}`} key={product.product_id} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div className="product-card" style={{ display: 'flex', gap: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                                                    <img src={product.image_url} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                                    <div>
                                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>{product.name}</h4>
                                                        <p className="price" style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>${product.price}</p>
                                                        <p className="match-score" style={{ margin: '0', fontSize: '0.8rem', color: 'green' }}>
                                                            {(product.similarity_score * 100).toFixed(0)}% match
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        )) : (
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

export default VisualSearch;
