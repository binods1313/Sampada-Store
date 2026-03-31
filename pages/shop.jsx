/**
 * Shop/Category Page - Virtual Product List
 * 
 * Features:
 * - Virtual scrolling for 1000+ products
 * - Pretext-powered accurate row heights
 * - Filter and sort functionality
 * - Zero layout shift
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import VirtualProductList from '@/components/VirtualProductList';
import ProductFilterSection from '@/components/ProductFilterSection';
import { ProductCardSkeleton } from '@/components/LoadingSkeletons';

// Sample products for demo (replace with real API call)
// Using Unsplash placeholder images for demo purposes
const SAMPLE_PRODUCTS = Array.from({ length: 100 }, (_, i) => ({
  _id: `product-${i}`,
  name: `Premium Product ${i + 1}`,
  slug: { current: `product-${i}` },
  price: Math.floor(Math.random() * 5000) + 999,
  discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0,
  description: 'This is a sample product description that demonstrates the virtual scrolling capability with Pretext height calculation.',
  category: { name: i % 2 === 0 ? 'T-Shirts' : 'Hoodies' },
  // Use direct Unsplash image URLs (bypass Sanity image pipeline for demo)
  image: [{
    _key: `img-${i}`,
    _type: 'image',
    // Direct URL - ProductCard will use this instead of Sanity URL
    url: `https://images.unsplash.com/photo-${getUnsplashId(i)}?w=600&h=600&fit=crop`
  }],
}));

// Helper to get different Unsplash image IDs
function getUnsplashId(index) {
  const ids = [
    '1523381210434-271e8be1f52b', // Clothing
    '1576566588028-4147f3842f27', // T-shirt
    '1562157873-9182d2484753', // Fashion
    '1583743814966-8936f5b7be1a', // Black shirt
    '1576995950047-24d844a4aff7', // Product
    '1542272454315-4db0a6f718c7', // Style
    '1589330180430-efc1e69c89b9', // Fashion
    '1618354691373-d851c5c3a990', // Product
  ];
  return ids[index % ids.length];
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Shop All Products
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {loading ? 'Loading...' : `${filteredProducts.length} products`}
        </p>
      </header>

      {/* Filters */}
      <ProductFilterSection
        products={filteredProducts}
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
        title="Shop All Products"
      />

      {/* Virtual Product List */}
      <div style={{ marginTop: '24px' }}>
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
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No products found</p>
            <p style={{ fontSize: '14px', color: '#999' }}>Try adjusting your filters</p>
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
    </div>
  );
}
