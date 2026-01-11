// pages/index.js
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner, ProductFilters, LoadingFallback, EmptyStateFallback } from '@/components';
import { ProductsGridSkeleton } from '@/components/LoadingSkeletons';
import { useLoadingState } from '../hooks/usePerformance';

import venturesStyles from '../styles/VenturesFooter.module.css';
import ColorFilter from '../components/ColorFilter';

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

  const handleColorFilter = async (color) => {
    setLoading(true);
    if (!color) {
      setFilteredProducts(products); // Reset
      setLoading(false);
      return;
    }

    // Fetch products matching color
    try {
      const res = await fetch(`/api/products/search-by-color?hex=${encodeURIComponent(color.hex)}`);
      const data = await res.json();
      if (data.success) {
        // We got matching product IDs/Slugs (assuming endpoint returns full object or we match ID)
        // The search-by-color endpoint returns "matches" which are product objects
        // We can replace the filtered list directly
        setFilteredProducts(data.matches);
      }
    } catch (e) {
      console.error("Color filter failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
    applyFilters(filters);
  }, [applyFilters]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setFilteredProducts(products);
  }, [products]);


  return (
    <div>
      <Head>
        <title>Sampada – Custom Print-on-Demand | Prosperity in Every Print</title>
        <meta name="description" content="Discover Sampada custom print-on-demand T-shirts, mugs, and blankets. Inspired by Vedic prosperity, designed for abundance and style." />
        <meta property="og:title" content="Sampada – Custom Print-on-Demand" />
        <meta property="og:description" content="Complete Wealth in Every Print – Ashta Sampada. Shop custom T-shirts, mugs, blankets." />
      </Head>
      <HeroBanner heroBanner={bannerData} />

      <div className="products-heading best-selling-heading">
        <h2>Best Selling Products</h2>
        <div className="category-nav-wrapper">
          {/* Category Navigation */}
          <div className="category-nav">
            <Link href="/collections/mens-tshirts" className="category-link">
              <span className="emoji">👕</span>
              <span className="text">Men's T-Shirts</span>
            </Link>

            <Link href="/collections/womens-tshirts" className="category-link">
              <span className="emoji">👚</span>
              <span className="text">Women's T-Shirts</span>
            </Link>

            <Link href="/collections/new-arrivals" className="category-link featured">
              <span className="emoji">✨</span>
              <span className="text">New Arrivals</span>
            </Link>

            <Link href="/collections/bestsellers" className="category-link">
              <span className="emoji">🔥</span>
              <span className="text">Bestsellers</span>
            </Link>

            <Link href="/collections/sale" className="category-link sale">
              <span className="emoji">💰</span>
              <span className="text">Sale</span>
            </Link>
          </div>

          {/* Tagline */}
          <div className="tagline">
            <p>✨ Express Yourself – Premium T-Shirts for Every Style ✨</p>
          </div>
        </div>
      </div>

      {/* Product Filters */}
      <ProductFilters
        products={products}
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Smart Color Filter */}
      {process.env.NEXT_PUBLIC_FEATURE_COLOR_EXTRACTION === 'true' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <ColorFilter onColorSelect={handleColorFilter} />
        </div>
      )}

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

      <section className="tshirt-collection-promo">
        <div className="container">
          <div className="promo-content">
            <h2>Discover Your Perfect Tee</h2>
            <p className="subtitle">Premium quality t-shirts that blend comfort, style, and self-expression</p>

            <div className="collection-grid">
              {/* Men's Collection */}
              <div className="collection-card mens">
                <div className="card-icon">👕</div>
                <h3>Men's Collection</h3>
                <p>Bold graphics, minimalist designs, and everything in between</p>
                <ul className="features">
                  <li>✓ 100% Premium Cotton</li>
                  <li>✓ Graphic & Minimal Styles</li>
                  <li>✓ Regular & Oversized Fits</li>
                  <li>✓ Sizes: S to 3XL</li>
                </ul>
                <Link href="/collections/mens-tshirts" className="cta-btn">
                  Shop Men's
                </Link>
              </div>

              {/* Women's Collection */}
              <div className="collection-card womens">
                <div className="card-icon">👚</div>
                <h3>Women's Collection</h3>
                <p>Stylish, comfortable tees designed for the modern woman</p>
                <ul className="features">
                  <li>✓ Soft Breathable Fabric</li>
                  <li>✓ Trendy Prints & Solids</li>
                  <li>✓ Fitted & Relaxed Cuts</li>
                  <li>✓ Sizes: XS to XXL</li>
                </ul>
                <Link href="/collections/womens-tshirts" className="cta-btn">
                  Shop Women's
                </Link>
              </div>
            </div>

            <div className="value-props">
              <div className="prop">
                <span className="icon">🚚</span>
                <span className="text">Free Shipping Above ₹999</span>
              </div>
              <div className="prop">
                <span className="icon">↩️</span>
                <span className="text">7-Day Easy Returns</span>
              </div>
              <div className="prop">
                <span className="icon">⭐</span>
                <span className="text">4.8/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterBanner footerBanner={bannerData} />

      {/* New Ventures Footer */}
      <footer className={venturesStyles['ventures-footer']}>
        <div className={venturesStyles['footer-column']}>
          <h4>Sampada</h4>
          <p>Prosperity in Every Print – Custom T-shirts, Mugs & Blankets</p>
        </div>

        <div className={venturesStyles['footer-column']}>
          <h4>Product</h4>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/use-cases">Use Cases</Link>
          <Link href="/roadmap">Roadmap</Link>
        </div>

        <div className={venturesStyles['footer-column']}>
          <h4>Company</h4>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className={venturesStyles['footer-column']}>
          <h4>Support</h4>
          <Link href="/documentation">Documentation</Link>
          <Link href="/api-reference">API Reference</Link>
          <Link href="/community">Community</Link>
          <Link href="/status">Status</Link>
        </div>

        <div className={venturesStyles['footer-column']}>
          <h4>Legal</h4>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/cookie-policy">Cookie Policy</Link>
        </div>


      </footer>
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