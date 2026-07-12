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

import React, { useState, useMemo } from 'react';
import { client, fetchOptions } from '../lib/client';
import VirtualProductList from '@/components/VirtualProductList';
import ProductFilterSection from '@/components/ProductFilterSection';
import { ProductCardSkeleton } from '@/components/LoadingSkeletons';

// GROQ query to fetch all published products from Sanity
const productsQuery = `*[_type == "product" && status in ["published", "active"]] {
  _id,
  _createdAt,
  name,
  slug,
  image,
  price,
  discount,
  details,
  category->{
    _id,
    name,
    slug
  },
  inventory,
  status
} | order(_createdAt desc)`;

// Fetch products at build time with incremental static regeneration
export async function getStaticProps() {
  try {
    const products = await client.fetch(productsQuery, {}, fetchOptions(3600));
    return {
      props: {
        initialProducts: products || [],
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        initialProducts: [],
      },
      revalidate: 60,
    };
  }
}

export default function ShopPage({ initialProducts }) {
  const [loading] = useState(false);
  const [products] = useState(initialProducts);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 10000],
    sortBy: 'popular',
  });

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
      <div className="section-light" style={{ minHeight: '100vh' }}>
      <div className="s-container" style={{ 
        maxWidth: '1400px', 
        padding: '80px 20px'
      }}>
        {/* Header with Sampada brand styling */}
        <header style={{ 
          marginBottom: '48px',
          textAlign: 'center'
        }}>
          <p className="s-label">DISCOVER</p>
          <h1 className="s-heading" style={{ fontSize: '2.5rem' }}>
            Shop All Products
          </h1>
          <span className="s-bar" />
          <p style={{ 
            color: 'var(--s-text-body)', 
            fontSize: '1rem',
            marginTop: '24px'
          }}>
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid var(--s-gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
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
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid rgba(139,26,26,0.12)',
              boxShadow: '0 2px 12px rgba(139,26,26,0.05)'
            }}>
              <p style={{ fontFamily: 'var(--s-serif)', fontSize: '1.3rem', fontWeight: '600', marginBottom: '8px', color: 'var(--s-text-heading)' }}>No products found</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--s-text-body)' }}>Try adjusting your filters or search criteria</p>
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
    </div>
  );
}
