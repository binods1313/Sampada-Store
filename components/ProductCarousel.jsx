/**
 * ProductCarousel - Auto-Scrolling Conveyor Belt
 * 
 * Continuous left-to-right scroll like a conveyor belt
 * Pauses on hover, resumes on mouse leave
 * Seamless infinite loop
 * 
 * Accessibility:
 * - Keyboard navigation (arrow keys)
 * - ARIA labels
 * - Reduced motion support
 */

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import Product from './Product';

const ProductCarousel = ({ products = [], speed = 0.5 }) => {
  const scrollRef = useRef(null);
  const pauseRef = useRef(false);
  const animationRef = useRef(null);

  useEffect(() => {
    const track = scrollRef.current;
    if (!track || products.length === 0) return;

    let scrollPos = 0;

    const scroll = () => {
      if (!pauseRef.current) {
        scrollPos += speed;
        // Reset when we've scrolled half (one complete set)
        if (scrollPos >= track.scrollWidth / 2) {
          scrollPos = 0;
        }
        track.scrollLeft = scrollPos;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    // Pause handlers
    const handleMouseEnter = () => { pauseRef.current = true; };
    const handleMouseLeave = () => { pauseRef.current = false; };

    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        track.scrollLeft -= 280;
        pauseRef.current = true;
      } else if (e.key === 'ArrowRight') {
        track.scrollLeft += 280;
        pauseRef.current = true;
      }
    };

    track.addEventListener('keydown', handleKeyDown);

    // Reduced motion check
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      pauseRef.current = true;
    }

    const handleReducedMotionChange = () => {
      pauseRef.current = mediaQuery.matches;
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
      track.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [speed, products.length]);

  if (!products || products.length === 0) {
    return (
      <div
        role="region"
        aria-label="Related products"
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#9E9E9E',
          background: '#1E1E2E',
          borderRadius: '16px',
        }}
      >
        No related products available
      </div>
    );
  }

  // Duplicate products 4 times for seamless loop
  const displayProducts = [...products, ...products, ...products, ...products];

  return (
    <div
      ref={scrollRef}
      role="region"
      aria-label="Related products carousel"
      tabIndex={0}
      style={{
        display: 'flex',
        gap: '16px',
        overflow: 'hidden',
        overflowX: 'hidden',
        scrollBehavior: 'auto',
        padding: '16px 0',
        cursor: 'grab',
        WebkitOverflowScrolling: 'touch',
        outline: 'none',
      }}
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { pauseRef.current = false; }}
    >
      {displayProducts.map((product, index) => (
        <div
          key={`${product._id}-${index}`}
          style={{
            flex: '0 0 auto',
            width: '280px',
            maxWidth: '280px',
          }}
        >
          <Product product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductCarousel;
