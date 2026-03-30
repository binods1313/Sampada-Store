/**
 * RelatedProductsCarousel - Auto-scrolling "You May Also Like"
 * 
 * Features:
 * - Continuous auto-scroll left to right
 * - Pauses on hover, resumes on mouse leave
 * - Seamless infinite loop (no visible jump)
 * - Touch swipeable on mobile
 * - No visible scrollbar
 */

'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/client';

export default function RelatedProductsCarousel({ products = [] }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  // Double products for seamless loop
  const doubled = [...products, ...products];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || products.length === 0) return;

    const SPEED = 0.6; // px per frame

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        // Reset at halfway point for seamless loop
        if (posRef.current >= track.scrollWidth / 2) {
          posRef.current = 0;
        }
        track.scrollLeft = posRef.current;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
      track.removeEventListener('touchstart', pause, { passive: true });
      track.removeEventListener('touchend', resume, { passive: true });
    };
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div
      ref={trackRef}
      style={{
        display: 'flex',
        gap: '16px',
        overflow: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '8px 24px 16px',
        cursor: 'grab',
      }}
    >
      {doubled.map((product, i) => (
        <div
          key={`${product._id}-${i}`}
          style={{
            flexShrink: 0,
            width: '220px',
          }}
        >
          {product && product.slug && product.slug.current ? (
            <Link href={`/product/${product.slug.current}`}>
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  overflow: 'hidden',
                  height: '300px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                }}
              >
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#e53935',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '5px',
                    fontSize: '0.75em',
                    fontWeight: 'bold',
                    zIndex: 10,
                    lineHeight: '1',
                    whiteSpace: 'nowrap',
                  }}>
                    {product.discount}% OFF
                  </div>
                )}
                <div style={{
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                }}>
                  <Image
                    src={
                      product.image && product.image[0] && product.image[0].asset
                        ? urlFor(product.image[0]).width(200).url()
                        : '/asset/placeholder-image.jpg'
                    }
                    alt={product.name || 'Product Image'}
                    width={200}
                    height={180}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                    onError={(e) => {
                      e.target.src = '/asset/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div style={{
                  padding: '0 5px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between',
                  minHeight: '90px',
                }}>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '5px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '40px',
                  }}>
                    {product.name}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {product.discount > 0 ? (
                      <>
                        <span style={{
                          fontSize: '0.85rem',
                          color: '#999',
                          textDecoration: 'line-through',
                        }}>
                          ${product.price?.toFixed(2)}
                        </span>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: '#e53935',
                        }}>
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#333',
                      }}>
                        ${product.price?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
