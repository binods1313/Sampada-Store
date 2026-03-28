// components/ActiveFilters.jsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

// Custom easing curve from Emil Kowalski's design system
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/**
 * ActiveFilters Component
 * Enhanced with Emil Kowalski's design engineering principles:
 * - Stagger animations for filter tags
 * - Hardware-accelerated transitions
 * - Responsive button feedback
 * - Reduced motion support
 * - Touch-device considerations
 */
export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
  const { searchQuery, selectedCategory, priceRange, minDiscount } = filters;
  const [mounted, setMounted] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build array of active filter tags
  const activeFilters = [];

  if (searchQuery) {
    activeFilters.push({
      id: 'search',
      label: `Search: "${searchQuery}"`,
      value: searchQuery
    });
  }

  if (selectedCategory) {
    activeFilters.push({
      id: 'category',
      label: `Category: ${selectedCategory}`,
      value: selectedCategory
    });
  }

  if (priceRange[0] > 0 || priceRange[1] < 500) {
    activeFilters.push({
      id: 'price',
      label: `Price: $${priceRange[0]} – $${priceRange[1]}`,
      value: { min: priceRange[0], max: priceRange[1] }
    });
  }

  if (minDiscount > 0) {
    activeFilters.push({
      id: 'discount',
      label: `${minDiscount}%+ off`,
      value: minDiscount
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      onRemoveFilter(id);
      setRemovingId(null);
    }, 160);
  };

  // Inline styles with Emil Kowalski's design principles
  const styles = {
    container: {
      backgroundColor: '#f9fafb',
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '24px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center',
      border: '1px solid #f3f4f6',
      animation: mounted ? 'fadeInUp 250ms' : 'none',
    },
    label: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginRight: '4px',
    },
    filterTag: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '6px 10px',
      fontSize: '13px',
      color: '#374151',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: `transform 160ms ${EASE_OUT}, box-shadow 160ms ${EASE_OUT}`,
      animation: 'tagEnter 200ms',
    },
    removeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      borderRadius: '4px',
      transition: `color 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}, transform 160ms ${EASE_OUT}`,
    },
    clearAllButton: {
      marginLeft: 'auto',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#dc2626',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: `background-color 160ms ${EASE_OUT}, transform 160ms ${EASE_OUT}`,
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes tagEnter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes tagExit {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        @media (hover: hover) and (pointer: fine) {
          .filter-tag-hover:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.06);
          }
          
          .remove-button-hover:hover {
            background-color: #fef2f2;
            color: #dc2626;
          }
          
          .clear-all-button-hover:hover {
            background-color: #fef2f2;
          }
        }
        
        .remove-button-hover:active {
          transform: scale(0.9);
        }
        
        .clear-all-button-hover:active {
          transform: scale(0.97);
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        <span style={styles.label}>Filters:</span>

        {activeFilters.map((filter, index) => (
          <div
            key={filter.id}
            className="filter-tag-hover"
            style={{
              ...styles.filterTag,
              animationDelay: `${index * 40}ms`,
              opacity: removingId === filter.id ? 0 : 1,
              transform: removingId === filter.id ? 'scale(0.95)' : 'scale(1)',
              transition: removingId === filter.id 
                ? `opacity 160ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` 
                : undefined,
            }}
          >
            {filter.label}
            <button
              onClick={() => handleRemove(filter.id)}
              style={styles.removeButton}
              className="remove-button-hover"
              aria-label={`Remove ${filter.label} filter`}
              disabled={removingId === filter.id}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        ))}

        <button
          onClick={onClearAll}
          className="clear-all-button-hover"
          style={styles.clearAllButton}
          disabled={removingId !== null}
        >
          Clear All
        </button>
      </div>
    </>
  );
}
