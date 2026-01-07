// pages/index.js
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner, ProductFilters, LoadingFallback, EmptyStateFallback } from '@/components';
import { ProductsGridSkeleton } from '@/components/LoadingSkeletons';
import { useLoadingState } from '../hooks/usePerformance';

const Home = ({ products, bannerData }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilters, setActiveFilters] = useState({});
  const { isLoading, setLoading } = useLoadingState(false);
  
  // Initialize filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  
  // Filter logic
  const applyFilters = useCallback((filters) => {
    setLoading(true);
    
    // Simulate processing time for large datasets
    setTimeout(() => {
      let filtered = [...products];
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(product => {
          // Defensive programming - safely access properties
          const productName = product.name?.toLowerCase() || '';
          const productDetails = product.details?.toLowerCase() || '';
          
          // Handle category reference safely
          let categoryName = '';
          if (product.category) {
            // Check if category is a reference object with name property
            if (typeof product.category === 'object' && product.category.name) {
              categoryName = product.category.name.toLowerCase();
            }
            // Check if category is a string (fallback)
            else if (typeof product.category === 'string') {
              categoryName = product.category.toLowerCase();
            }
          }
          
          return productName.includes(searchTerm) ||
                 productDetails.includes(searchTerm) ||
                 categoryName.includes(searchTerm);
        });
      }
      
      // Category filter
      if (filters.category) {
        filtered = filtered.filter(product => {
          // Handle category reference safely
          if (product.category) {
            // Check if category is a reference object with name property
            if (typeof product.category === 'object' && product.category.name) {
              return product.category.name === filters.category;
            }
            // Check if category is a string (fallback)
            else if (typeof product.category === 'string') {
              return product.category === filters.category;
            }
          }
          return false;
        });
      }
      
      // Price range filter
      if (filters.priceMin || filters.priceMax) {
        filtered = filtered.filter(product => {
          const price = product.price || 0;
          const min = filters.priceMin ? parseFloat(filters.priceMin) : 0;
          const max = filters.priceMax ? parseFloat(filters.priceMax) : Infinity;
          return price >= min && price <= max;
        });
      }
      
      // Sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price-low':
              return (a.price || 0) - (b.price || 0);
            case 'price-high':
              return (b.price || 0) - (a.price || 0);
            case 'name-asc':
              return (a.name || '').localeCompare(b.name || '');
            case 'name-desc':
              return (b.name || '').localeCompare(a.name || '');
            case 'oldest':
              return new Date(a._createdAt || 0) - new Date(b._createdAt || 0);
            case 'newest':
            default:
              return new Date(b._createdAt || 0) - new Date(a._createdAt || 0);
          }
        });
      }
      
      setFilteredProducts(filtered);
      setLoading(false);
    }, 300); // Small delay to show loading state
  }, [products, setLoading]);
  
  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
    applyFilters(filters);
  }, [applyFilters]);
  
  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setFilteredProducts(products);
  }, [products]);
  // Create a custom banner object for the current sale
  // This merges any data from Sanity with our hardcoded promotional data
  const customBannerData = {
    ...bannerData,
    largeText1: 'PEACE',
    largeText2: 'SMILE',
    midText: 'Summer Sale',
    product: 'Smart Watch',
    saleTime: '01 Sep to 30 sep 2025',
    smallText: 'Aurora Sky Pulse™',
    desc: 'Beyond Timekeeping: A Smartwatch Designed to Power Your Every Move!',
    buttonText: bannerData?.buttonText || 'Shop Now',
    // Preserve the image from Sanity if it exists
    image: bannerData?.image || null
  };
  
  return (
    <div>
      <HeroBanner heroBanner={customBannerData} />
      
      <div className="products-heading best-selling-heading">
        <h2>Best Selling Products</h2>
        <div className="categories-description">
          <div className="emoji-wrap">🎧🎶 Headphones</div>
          <div className="emoji-wrap">⌚✨ Watches</div>
          <div className="emoji-wrap">🚀🌌 Space Suits</div>
          <div className="emoji-wrap">🕶😎 Sunglasses</div>
          <p>Now you are all set for style, sound, and intergalactic adventures! 🚀🔥</p>
        </div>
        <div className="aurora-product-tag">
          <span>Featured: <span className="aurora-highlight">Aurora Sky Pulse™</span> Collection</span>
        </div>
      </div>
      
      {/* Product Filters */}
      <ProductFilters 
        products={products}
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
        onClearFilters={handleClearFilters}
      />
      
      {/* Products Container with Loading State */}
      {isLoading ? (
        <LoadingFallback 
          message="Loading products..."
          size="medium"
          details="Fetching latest inventory"
        />
      ) : (
        <div className="products-container staggered-loading">
          {filteredProducts?.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Product 
                key={product._id} 
                product={product} 
                isLoading={false}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))
          ) : (
            <EmptyStateFallback 
              title="No products found"
              message="Try adjusting your filters or search terms to find what you are looking for."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
              secondaryActionLabel="Browse All Categories"
              onSecondaryAction={() => window.location.href = '/categories'}
              icon="shopping"
            />
          )}
        </div>
      )}
      
      {/* Enhanced Eye-Catching Product Description Section */}
      <div className="product-description-section">
        <div className="aurora-brand-container">
          <div className="aurora-logo-pulse"></div>
          <h2>Experience Next-Gen Audio with <span className="aurora-highlight">Aurora Sky Pulse™</span></h2>
        </div>
        <p>
          Immerse yourself in crystal-clear 3D sound that brings your music, movies, and games to life. The <span className="aurora-highlight">Aurora Sky Pulse™</span> 
          headphones represent the pinnacle of audio engineering, featuring 4K sound processing technology and
          adaptive noise cancellation that adjusts to your environment.
        </p>
        <p>
          Crafted with premium materials for durability and comfort, these headphones are designed for extended wear
          during your longest gaming sessions or audio adventures.
        </p>
        <div className="features">
          <span className="feature-item">🔊 4K Sound Processing</span>
          <span className="feature-item">🔋 40-Hour Battery Life</span>
          <span className="feature-item">🎮 Ultra-Low Latency</span>
          <span className="feature-item">🌈 Customizable RGB</span>
          <span className="feature-item">☁️ Cloud Audio Profiles</span>
        </div>
        <div className="aurora-brand-badge">
          <span className="badge-text">AURORA SKY PULSE™</span>
          <span className="badge-tagline">Beyond Sound. Beyond Limits.</span>
        </div>
      </div>
      
      <FooterBanner footerBanner={customBannerData} />
    </div>
  );
};

export const getServerSideProps = async () => {
  // Define queries with error handling - properly dereference category
  const productQuery = `*[_type == "product"] {
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
  } | order(_createdAt desc)[0...12]`;
  const bannerQuery = '*[_type == "banner"][0]';
  
  try {
    // Fetch data with Promise.all for parallel fetching
    const [products, bannerData] = await Promise.all([
      client.fetch(productQuery).catch(error => {
        console.error('Error fetching products:', error);
        return [];
      }),
      client.fetch(bannerQuery).catch(error => {
        console.error('Error fetching banner:', error);
        return {};
      })
    ]);
    
    // Log for debugging
    console.log(`Fetched ${products?.length || 0} products`);
    console.log('Banner data:', bannerData);
    
    return {
      props: {
        products: products || [],
        bannerData: bannerData || {}
      }
    };
  } catch (error) {
    // Global error handler
    console.error('Data fetch error:', error);
    return {
      props: {
        products: [],
        bannerData: {}
      }
    };
  }
};
 
export default Home;