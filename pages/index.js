// pages/index.js
import React from 'react';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '@/components';

const Home = ({ products, bannerData }) => {
  // Create a custom banner object for the current sale
  // This merges any data from Sanity with our hardcoded promotional data
  const customBannerData = {
    ...bannerData,
    largeText1: 'PEACE',
    largeText2: 'SMILE',
    midText: 'Summer Sale',
    product: 'Smart Watch',
    saleTime: '01 Jun to 20 Jun 2025',
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
          <p>Now you're all set for style, sound, and intergalactic adventures! 🚀🔥</p>
        </div>
        <div className="aurora-product-tag">
          <span>Featured: <span className="aurora-highlight">Aurora Sky Pulse™</span> Collection</span>
        </div>
      </div>
      
      <div className="products-container">
        {products?.length > 0 ? (
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <p className="no-products-message">No products available at the moment.</p>
        )}
      </div>
      
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
  // Define queries with error handling
  const productQuery = '*[_type == "product"] | order(_createdAt desc)[0...12]';
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