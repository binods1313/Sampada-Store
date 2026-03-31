/**
 * VirtualProductList - High-Performance Product Listing
 * 
 * Features:
 * - Pretext-powered accurate row height calculation
 * - Virtual scrolling for 1000+ products
 * - Zero layout shift
 * - 60fps scrolling performance
 * 
 * @see https://pretext.wiki/
 */

'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ProductCard from './ProductCard';
import { useTextsHeight } from '../hooks/usePretext';
import ProductCardSkeleton from './LoadingSkeletons';

const ROW_BASE_HEIGHT = 120; // Base height for image + padding + price
const ROW_GAP = 24; // Gap between cards

/**
 * VirtualProductList Component
 * 
 * @param {Array} products - Array of product objects
 * @param {number} columns - Number of columns (default: 4)
 * @param {string} cardWidth - Width of each card in px (default: 280)
 */
export default function VirtualProductList({ 
  products = [], 
  columns = 4,
  cardWidth = 280,
  loading = false 
}) {
  const [containerWidth, setContainerWidth] = useState(1200);
  const parentRef = React.useRef(null);

  // Calculate total width based on columns
  const totalWidth = columns * (cardWidth + ROW_GAP) - ROW_GAP;

  // Pre-calculate all product description heights using batch measurement
  const { measurements, loaded } = useTextsHeight(
    products.map(product => ({
      text: product.description || product.details || '',
      font: '14px Inter, system-ui, sans-serif',
      maxWidth: cardWidth - 24, // Account for padding
      lineHeight: 21,
    }))
  );

  // Calculate accurate row heights
  const rowHeights = useMemo(() => {
    if (!loaded || measurements.length === 0) {
      // Return estimated heights while measuring
      return products.map(() => ROW_BASE_HEIGHT + 60); // Estimate
    }

    return measurements.map((m, i) => {
      const descriptionHeight = m.height || 0;
      const nameLines = Math.ceil((products[i]?.name?.length || 0) / 30);
      const nameHeight = nameLines * 21;
      
      return ROW_BASE_HEIGHT + nameHeight + descriptionHeight;
    });
  }, [measurements, loaded, products]);

  // Create virtual items
  const virtualizer = useVirtualizer({
    count: Math.ceil(products.length / columns), // Number of rows
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      // Use pre-calculated heights or estimate
      const startIndex = index * columns;
      const endIndex = Math.min(startIndex + columns, products.length);
      const rowProducts = products.slice(startIndex, endIndex);
      
      if (rowProducts.length === 0) return ROW_BASE_HEIGHT;
      
      // Return max height in row
      const maxIndex = rowProducts.reduce((maxIdx, _, idx) => {
        const globalIdx = startIndex + idx;
        return (rowHeights[globalIdx] || 0) > (rowHeights[maxIdx] || 0) ? globalIdx : maxIdx;
      }, startIndex);
      
      return rowHeights[maxIndex] || ROW_BASE_HEIGHT + 60;
    },
    overscan: 3, // Render 3 rows extra for smooth scrolling
  });

  const virtualRows = virtualizer.getVirtualItems();

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) {
        setContainerWidth(parentRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (loading) {
    return (
      <div className="product-grid-loading" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${ROW_GAP}px`,
        padding: '24px 0',
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        color: '#666'
      }}>
        <p style={{ fontSize: '16px', marginBottom: '8px' }}>No products found</p>
        <p style={{ fontSize: '14px', color: '#999' }}>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        overflow: 'auto',
        contain: 'strict',
      }}
    >
      <div
        style={{
          width: '100%',
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const rowIndex = virtualRow.index;
          const startIndex = rowIndex * columns;
          const endIndex = Math.min(startIndex + columns, products.length);
          const rowProducts = products.slice(startIndex, endIndex);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${rowProducts.length}, ${cardWidth}px)`,
                gap: `${ROW_GAP}px`,
                justifyContent: 'center',
              }}
            >
              {rowProducts.map((product, colIndex) => {
                const globalIndex = startIndex + colIndex;
                return (
                  <div
                    key={product._id || globalIndex}
                    style={{
                      width: `${cardWidth}px`,
                      height: '100%',
                    }}
                  >
                    <ProductCard 
                      product={product}
                      cardWidth={cardWidth}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Scroll to top button */}
      <ScrollToTopButton parentRef={parentRef} />
    </div>
  );
}

/**
 * Scroll to Top Button
 */
function ScrollToTopButton({ parentRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;

    const handleScroll = () => {
      setVisible(element.scrollTop > 400);
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [parentRef]);

  const scrollToTop = useCallback(() => {
    parentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [parentRef]);

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #C9A227, #F0C93A)',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(201, 162, 39, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label="Scroll to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1E1E2E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

/**
 * Hook: Get estimated total height for virtual list
 * Useful for SSR or initial render
 */
export function useVirtualListHeight(productCount, columns = 4, avgHeight = 180) {
  const rows = Math.ceil(productCount / columns);
  return rows * avgHeight;
}
