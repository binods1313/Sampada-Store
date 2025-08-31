// components/HeroBanner.jsx
import React from 'react';
import Link from 'next/link';
import SanityImage from './SanityImage';

const HeroBanner = ({ heroBanner }) => {
  // 1. Handle empty or null banner data
  if (!heroBanner) {
    return null;
  }
  
  // 2. Safe default values
  const {
    smallText = '',
    midText = '',
    largeText1 = '',
    largeText2 = '',
    product = '',
    buttonText = 'Shop Now',
    image = null
  } = heroBanner;
  
  return (
    <div className="hero-banner-container">
      <div className="hero-banner-content">
        <div className="hero-banner-text">
          <p className="beats-solo hover-effect">{smallText}</p>
          <h3 className="hover-effect">{midText}</h3>
          <h1 className="hover-effect">{largeText1}</h1>
          <h1 className="large-text-2 hover-effect">{largeText2}</h1>
        </div>
        
        <div className="hero-banner-image-wrapper">
          {image ? (
            <SanityImage
              image={image}
              alt={midText || 'hero banner'}
              className="hero-banner-image hover-effect"
              priority={true}
              width={350}
              height={350}
            />
          ) : (
            <div
              className="hero-banner-image-placeholder"
              style={{ width: 350, height: 350, background: '#eee' }}
            ></div>
          )}
        </div>
        
        <div className="hero-banner-actions">
          {product ? (
            <Link href={`/product/${product}`}>
              <button type="button" className="shop-now-btn hover-effect">
                {buttonText}
              </button>
            </Link>
          ) : (
            <button type="button" className="shop-now-btn hover-effect" disabled>
              No Product Available
            </button>
          )}
          
          <div className="neon-description-container hover-effect">
            <h5 className="neon-heading">DESCRIPTION:</h5>
            <p className="neon-copy">
              Beyond Timekeeping: A Smartwatch<br />
              designed to power your<br />
              every move!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;