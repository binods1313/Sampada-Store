// components/FilterBar.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";

// Custom easing curves from Emil Kowalski's design system
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

/**
 * FilterBar Component
 * Enhanced with Emil Kowalski's design engineering principles:
 * - Taste-driven spacing and typography
 * - Hardware-accelerated animations
 * - Responsive button feedback
 * - Origin-aware dropdowns
 * - Reduced motion support
 * - Touch-device considerations
 */
export default function FilterBar({
  categories,
  onFilterChange,
  totalProducts
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const sortDropdownRef = useRef(null);
  const filtersContentRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search to avoid filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        searchQuery,
        selectedCategory,
        priceRange,
        minDiscount,
        sortBy
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, minDiscount, sortBy, onFilterChange]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 1000]);
    setMinDiscount(0);
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000 || minDiscount > 0;

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'discount', label: 'Biggest Discount' }
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Newest First';

  // Inline styles with Emil Kowalski's design principles
  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      marginBottom: '32px',
      border: '1px solid #f3f4f6',
      transition: `box-shadow 200ms ${EASE_OUT}`,
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 44px',
      fontSize: '14px',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      outline: 'none',
      backgroundColor: '#fafafa',
      transition: `border-color 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}, box-shadow 160ms ${EASE_OUT}`,
      color: '#1f2937',
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none',
      transition: `color 160ms ${EASE_OUT}`,
    },
    clearButton: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      transition: `background-color 160ms ${EASE_OUT}, transform 160ms ${EASE_OUT}`,
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 14px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: `transform 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}, border-color 160ms ${EASE_OUT}`,
    },
    sortButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 14px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: `transform 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}, border-color 160ms ${EASE_OUT}`,
    },
    sortDropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
      zIndex: 50,
      minWidth: '200px',
      padding: '6px',
      transformOrigin: 'top right',
      animation: mounted ? 'slideDown 200ms' : 'none',
    },
    sortOption: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      color: '#4b5563',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      borderRadius: '8px',
      transition: `background-color 160ms ${EASE_OUT}, color 160ms ${EASE_OUT}`,
      fontWeight: '500',
    },
    filtersSection: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #f3f4f6',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      animation: mounted ? 'filterExpand 250ms' : 'none',
    },
    filterField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    filterLabel: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      backgroundColor: '#fafafa',
      cursor: 'pointer',
      outline: 'none',
      color: '#374151',
      transition: `border-color 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}`,
    },
    priceInput: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      outline: 'none',
      color: '#374151',
      backgroundColor: '#fafafa',
      transition: `border-color 160ms ${EASE_OUT}`,
    },
    clearAllButton: {
      width: '100%',
      padding: '10px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: `transform 160ms ${EASE_OUT}, background-color 160ms ${EASE_OUT}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    resultsCount: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500',
    },
    activeIndicator: {
      backgroundColor: '#ef4444',
      color: 'white',
      fontSize: '11px',
      fontWeight: '700',
      borderRadius: '999px',
      minWidth: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'scaleIn 160ms',
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes filterExpand {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
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
        
        @media (hover: hover) and (pointer: fine) {
          .filter-button-hover:hover {
            transform: translateY(-1px);
            background-color: #f9fafb;
            border-color: #d1d5db;
          }
          
          .sort-button-hover:hover {
            transform: translateY(-1px);
            background-color: #f9fafb;
            border-color: #d1d5db;
          }
          
          .sort-option-hover:hover {
            background-color: #f9fafb;
            color: #1f2937;
          }
          
          .clear-button-hover:hover {
            background-color: #fee2e2;
            transform: scale(0.98);
          }
          
          .search-input-hover:focus {
            background-color: white;
            border-color: #d1d5db;
            box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.15);
          }
          
          .select-hover:focus {
            background-color: white;
            border-color: #d1d5db;
            box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.15);
          }
          
          .price-input-hover:focus {
            background-color: white;
            border-color: #d1d5db;
            box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.15);
          }
        }
        
        .filter-button-hover:active {
          transform: scale(0.97);
        }
        
        .sort-button-hover:active {
          transform: scale(0.97);
        }
        
        .clear-all-button-hover:active {
          transform: scale(0.97);
        }
        
        .clear-btn-hover:hover {
          background-color: #f3f4f6;
        }
        
        .clear-btn-hover:active {
          transform: scale(0.9);
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* Search Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              className="search-input-hover"
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={styles.clearButton}
                className="clear-btn-hover"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={styles.filterButton}
            className="filter-button-hover"
            aria-expanded={showFilters}
            aria-controls="filters-section"
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span style={styles.activeIndicator}>•</span>
            )}
          </button>

          {/* Results Count */}
          <span style={styles.resultsCount}>
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
          </span>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative', marginLeft: 'auto' }} ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={styles.sortButton}
              className="sort-button-hover"
              aria-expanded={showSortDropdown}
              aria-haspopup="true"
              aria-label="Sort products"
            >
              {currentSortLabel}
              <ChevronDown 
                size={14} 
                style={{
                  transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: `transform 160ms ${EASE_OUT}`,
                  color: '#9ca3af'
                }} 
              />
            </button>

            {showSortDropdown && (
              <div style={styles.sortDropdown}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    style={{
                      ...styles.sortOption,
                      backgroundColor: sortBy === option.value ? '#f9fafb' : 'transparent',
                      color: sortBy === option.value ? '#1f2937' : '#4b5563',
                      fontWeight: sortBy === option.value ? '600' : '500',
                    }}
                    className="sort-option-hover"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expandable Filters Section */}
        {showFilters && (
          <div style={styles.filtersSection} ref={filtersContentRef} id="filters-section">
            {/* Category Filter */}
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.select}
                className="select-hover"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug?.current || cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>Price Range</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  placeholder="Min"
                  style={styles.priceInput}
                  className="price-input-hover"
                />
                <span style={{ color: '#d1d5db', fontSize: '14px' }}>—</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                  placeholder="Max"
                  style={styles.priceInput}
                  className="price-input-hover"
                />
              </div>
            </div>

            {/* Discount Filter */}
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>Min Discount</label>
              <select
                value={minDiscount}
                onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                style={styles.select}
                className="select-hover"
              >
                <option value={0}>Any Discount</option>
                <option value={10}>10%+ off</option>
                <option value={20}>20%+ off</option>
                <option value={30}>30%+ off</option>
                <option value={40}>40%+ off</option>
                <option value={50}>50%+ off</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={clearAllFilters}
                  style={styles.clearAllButton}
                  className="clear-all-button-hover"
                >
                  <X size={14} /> Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
