/**
 * Shop/Category Page - Virtual Product List
 * 
 * Features:
 * - Virtual scrolling for 1000+ products
 * - Pretext-powered accurate row heights
 * - Filter and sort functionality
 * - Zero layout shift
 * - Sampada premium brand styling
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import VirtualProductList from '@/components/VirtualProductList';
import ProductFilterSection from '@/components/ProductFilterSection';
import { ProductCardSkeleton } from '@/components/LoadingSkeletons';

// Sample products for demo (replace with real API call from Sanity)
const SAMPLE_PRODUCTS = Array.from({ length: 100 }, (_, i) => ({
  _id: `product-${i}`,
  name: generateProductName(i),
  slug: { current: `product-${i}` },
  price: Math.floor(Math.random() * 5000) + 999,
  discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0,
  description: generateProductDescription(i),
  category: { name: i % 2 === 0 ? 'T-Shirts' : 'Hoodies' },
  image: [{
    _key: `img-${i}`,
    _type: 'image',
    // Use Picsum for reliable, diverse placeholder images
    url: `https://picsum.photos/seed/product${i}/600/600`
  }],
}));

// Generate diverse product names
function generateProductName(index) {
  const adjectives = [
    'Premium', 'Classic', 'Modern', 'Elegant', 'Vintage', 
    'Urban', 'Casual', 'Chic', 'Bohemian', 'Minimalist',
    'Artisan', 'Heritage', 'Contemporary', 'Timeless', 'Signature'
  ];
  const nouns = [
    'T-Shirt', 'Hoodie', 'Polo', 'Tank Top', 'Sweatshirt',
    'Jacket', 'Cardigan', 'Tunic', 'Blouse', 'Shirt'
  ];
  const adj = adjectives[index % adjectives.length];
  const noun = nouns[Math.floor(index / adjectives.length) % nouns.length];
  return `${adj} ${noun} ${Math.floor(index / 10) + 1}`;
}

// Generate diverse product descriptions
function generateProductDescription(index) {
  const descriptions = [
    'Crafted from premium organic cotton for all-day comfort and breathability.',
    'Features a modern fit with reinforced stitching for long-lasting durability.',
    'Perfect for casual outings or layering during cooler evenings.',
    'Made with sustainable materials and eco-friendly dyes.',
    'Classic design meets contemporary style in this versatile piece.',
    'Soft, lightweight fabric ideal for everyday wear.',
    'Tailored fit with attention to detail and quality craftsmanship.',
    'Versatile wardrobe essential that pairs well with any outfit.',
    'Premium quality fabric with excellent color retention.',
    'Designed for comfort without compromising on style.'
  ];
  return descriptions[index % descriptions.length];
}

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    sortBy: 'popular',
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(SAMPLE_PRODUCTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category?.name === filters.category);
    }

    // Price filter
    result = result.filter(p => {
      const price = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 'popular' - keep original order
    }

    return result;
  }, [products, filters]);

  const categories = useMemo(() => {
    if (!products || products.length === 0) {
      return [{ _id: 'all', name: 'All Categories', slug: { current: 'all' } }];
    }
    const cats = new Set(products.map(p => p.category?.name).filter(Boolean));
    return [
      { _id: 'all', name: 'All Categories', slug: { current: 'all' } },
      ...Array.from(cats).map(name => ({ _id: name, name, slug: { current: name } }))
    ];
  }, [products]);

  return (
    <div className="shop-page" style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header with Sampada brand styling */}
      <header style={{ 
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '800', 
          marginBottom: '12px',
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
          position: 'relative',
          display: 'inline-block'
        }}>
          Shop All Products
        </h1>
        <div style={{
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, #8B1A1A, #C9A84C)',
          margin: '16px auto',
          borderRadius: '2px'
        }} />
        <p style={{ 
          color: '#666', 
          fontSize: '15px',
          marginTop: '16px'
        }}>
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '16px', height: '16px', border: '2px solid #C9A84C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
              Loading products...
            </span>
          ) : (
            `${filteredProducts.length} products`
          )}
        </p>
      </header>

      {/* Filters with premium styling */}
      <ProductFilterSection
        products={filteredProducts}
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
        title="Shop All Products"
      />

      {/* Virtual Product List */}
      <div style={{ marginTop: '32px' }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid rgba(201, 168, 76, 0.2)'
          }}>
            <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>No products found</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <VirtualProductList
            products={filteredProducts}
            columns={4}
            cardWidth={280}
            loading={loading}
          />
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
