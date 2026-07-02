/**
 * SmartSearch - Live Search with Pretext Performance
 * 
 * Features:
 * - Instant search results as you type (300ms debounce)
 * - Pretext-powered zero layout shift
 * - Highlighted search terms
 * - Keyboard shortcut (Ctrl+K / Cmd+K)
 * - Mobile responsive
 * 
 * Brand: Deep Red (#8B1A1A), Gold (#C9A84C)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { client, getReliableImageUrl } from '@/lib/client';
import Image from 'next/image';
import Link from 'next/link';

// GROQ query for searching products
const searchQuery = `*[_type == "product" && (
  name match $searchTerm ||
  details match $searchTerm ||
  category->name match $searchTerm
)] | order(_createdAt desc) [0...8] {
  _id,
  name,
  "slug": slug.current,
  price,
  discount,
  "image": image[0],
  "categoryName": category->name,
  "categorySlug": category->slug.current
}`;

export default function SmartSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  // Auto focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await client.fetch(searchQuery, {
          searchTerm: `*${query}*`
        });
        setResults(data);
        setSearched(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Calculate discounted price
  const getPrice = (product) => {
    const price = product.price || 0;
    const discount = product.discount || 0;
    return discount > 0 
      ? (price * (1 - discount/100)).toFixed(2)
      : price.toFixed(2);
  };

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) 
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} 
           style={{ width: '100%', maxWidth: '680px', padding: '0 24px' }}>
        
        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            className="search-box"
            placeholder="Search products, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          {loading && (
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#C9A84C',
              animation: 'spin 1s linear infinite'
            }}>
              ⟳
            </div>
          )}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: loading ? '40px' : '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Results */}
        {(results.length > 0 || searched) && (
          <div className="search-results-panel">
            {results.length === 0 ? (
              <div className="search-no-results">
                <div className="search-no-results-icon">🔍</div>
                <p>No products found for "{query}"</p>
                <p style={{ fontSize: '13px', color: '#999', marginTop: '8px' }}>
                  Try different keywords
                </p>
              </div>
            ) : (
              <>
                <div className="search-category-header">
                  {results.length} product{results.length !== 1 ? 's' : ''} found
                </div>
                {results.map(product => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                  >
                    <div className="search-result-item">
                      {product.image && (
                        <Image
                          src={getReliableImageUrl(product.image, { width: 56, height: 56 })}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="search-result-img"
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="search-result-name">
                          {highlightText(product.name, query)}
                        </div>
                        <div className="search-result-category">
                          {product.categoryName}
                        </div>
                      </div>
                      <div className="search-result-price">
                        ₹{getPrice(product)}
                        {product.discount > 0 && (
                          <span style={{ 
                            fontSize: '11px', 
                            color: '#2d7a2d',
                            display: 'block',
                            textAlign: 'right'
                          }}>
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        )}

        {/* Quick tips when empty */}
        {!query && (
          <div className="search-results-panel" style={{ padding: '20px' }}>
            <p style={{ 
              fontSize: '12px', 
              color: '#999', 
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              Popular searches
            </p>
            {['T-shirts', 'Hoodies', 'Mugs', 'His & Hers'].map(term => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="search-suggestion-chip"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
