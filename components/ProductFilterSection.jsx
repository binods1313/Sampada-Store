// components/ProductFilterSection.jsx
"use client";

import React, { useState, useMemo } from "react";
import FilterBar from "./FilterBar";
import ActiveFilters from "./ActiveFilters";
import Product from "./Product";

/**
 * ProductFilterSection Component
 * Wraps the filter system with product grid for homepage integration
 * Manages filter state and applies filters to products
 */
export default function ProductFilterSection({ products, categories, title = "Featured Products" }) {
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedCategory: '',
    priceRange: [0, 5000],
    minDiscount: 0,
    sortBy: 'newest'
  });

  // Handle filter changes from FilterBar component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Remove a specific filter
  const handleRemoveFilter = (filterId) => {
    setFilters(prev => {
      switch (filterId) {
        case 'search':
          return { ...prev, searchQuery: '' };
        case 'category':
          return { ...prev, selectedCategory: '' };
        case 'price':
          return { ...prev, priceRange: [0, 5000] };
        case 'discount':
          return { ...prev, minDiscount: 0 };
        default:
          return prev;
      }
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: '',
      priceRange: [0, 5000],
      minDiscount: 0,
      sortBy: 'newest'
    });
  };

  // Filter and sort products based on applied filters
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.details?.toLowerCase().includes(query) ||
        p.category?.name?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.selectedCategory) {
      result = result.filter(p =>
        p.category?.slug?.current === filters.selectedCategory ||
        p.category?.name?.toLowerCase() === filters.selectedCategory.toLowerCase()
      );
    }

    // Filter by price range (using discounted price)
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
      result = result.filter(p => {
        const price = p.price || 0;
        const discount = p.discount || 0;
        const finalPrice = price * (1 - (discount / 100));
        return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
      });
    }

    // Filter by minimum discount
    if (filters.minDiscount > 0) {
      result = result.filter(p => (p.discount || 0) >= filters.minDiscount);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => {
          const priceA = (a.price || 0) * (1 - ((a.discount || 0) / 100));
          const priceB = (b.price || 0) * (1 - ((b.discount || 0) / 100));
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const priceA = (a.price || 0) * (1 - ((a.discount || 0) / 100));
          const priceB = (b.price || 0) * (1 - ((b.discount || 0) / 100));
          return priceB - priceA;
        });
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => {
          const dateA = new Date(a._createdAt || 0);
          const dateB = new Date(b._createdAt || 0);
          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [products, filters]);

  return (
    <section style={{
      padding: '60px 20px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Section Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#1f2937',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '15px',
          color: '#6b7280',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {filteredAndSortedProducts.length === products.length 
            ? 'Discover our curated collection' 
            : `Showing ${filteredAndSortedProducts.length} of ${products.length} products`}
        </p>
      </div>

      {/* FilterBar Component */}
      <FilterBar
        categories={categories || []}
        onFilterChange={handleFilterChange}
        totalProducts={filteredAndSortedProducts.length}
      />

      {/* ActiveFilters Component */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          animation: 'productsFadeIn 400ms',
          justifyContent: 'center'
        }}>
          {filteredAndSortedProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            No products found
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={handleClearAll}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 160ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes productsFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
