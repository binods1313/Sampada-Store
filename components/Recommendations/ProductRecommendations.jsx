/**
 * ProductRecommendations - "You May Also Like"
 * 
 * Features:
 * - Shows products from same category
 * - Uses Pretext for zero layout shift
 * - Smooth horizontal scroll on mobile
 * - Skeleton loading state
 * 
 * Brand: Deep Red (#8B1A1A), Gold (#C9A84C)
 */

'use client';

import { useState, useEffect } from 'react';
import { client, getReliableImageUrl } from '@/lib/client';
import Link from 'next/link';
import Image from 'next/image';

// GROQ query for recommendations
const recommendationsQuery = `
  *[_type == "product" && 
    category._ref == $categoryId && 
    _id != $currentId &&
    status == "active"
  ] | order(_createdAt desc) [0...6] {
    _id,
    name,
    "slug": slug.current,
    price,
    discount,
    "image": image[0],
    "categoryName": category->name,
    "categorySlug": category->slug.current
  }
`;

export default function ProductRecommendations({ 
  categoryId, 
  currentProductId 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    
    client.fetch(recommendationsQuery, {
      categoryId,
      currentId: currentProductId
    }).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [categoryId, currentProductId]);

  if (loading) return (
    <div className="recommendations-section">
      <h2 className="section-title" 
          style={{ fontSize: '22px', marginBottom: '24px' }}>
        You May Also Like
      </h2>
      <div className="recommendations-scroll">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="rec-card">
            <div className="product-card-skeleton" 
                 style={{ aspectRatio: '1' }} />
            <div style={{ padding: '12px' }}>
              <div className="product-card-skeleton" 
                   style={{ height: '16px', marginBottom: '8px' }} />
              <div className="product-card-skeleton" 
                   style={{ height: '16px', width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (products.length === 0) return null;

  return (
    <div className="recommendations-section">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h2 className="section-title" 
            style={{ fontSize: '22px', marginBottom: 0 }}>
          You May Also Like
        </h2>
        <Link 
          href={`/collections/${products[0]?.categorySlug || ''}`}
          style={{ 
            color: '#C9A84C', 
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#8B1A1A'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#C9A84C'}
        >
          View All →
        </Link>
      </div>
      
      <div className="recommendations-scroll">
        {products.map(product => {
          const finalPrice = product.discount > 0
            ? (product.price * (1 - product.discount/100)).toFixed(2)
            : product.price?.toFixed(2);
            
          return (
            <Link 
              key={product._id} 
              href={`/product/${product.slug}`}
            >
              <div className="rec-card">
                {product.discount > 0 && (
                  <div style={{ padding: '8px 8px 0' }}>
                    <span className="rec-card-badge">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
                {product.image && (
                  <Image
                    src={getReliableImageUrl(product.image, { width: 220, height: 220 })}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="rec-card-image"
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <div className="rec-card-body">
                  <div className="rec-card-name">
                    {product.name}
                  </div>
                  <div>
                    <span className="rec-card-price">
                      ₹{finalPrice}
                    </span>
                    {product.discount > 0 && (
                      <span className="rec-card-original">
                        ₹{product.price?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
