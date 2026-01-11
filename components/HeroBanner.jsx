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
    image = null,
    desc = ''
  } = heroBanner;

  return (
    <div className="hero-banner-container">
      <div className="hero-banner-content">
        <div className="flex flex-col items-center justify-center text-center py-10 w-full">
          {desc && (
            <div className="rounded-xl text-center border-4 mx-auto mb-10 hover-effect-intense" style={{ marginTop: '-1cm', marginLeft: 'auto', marginRight: 'auto', maxWidth: 'fit-content', padding: '1rem 1.5rem', backgroundColor: '#FFFACD', borderColor: '#d97706', boxShadow: '0 0 10px #d97706', borderRadius: '1rem' }}>
              <p className="text-xl text-gray-900 leading-snug" style={{ fontWeight: 700 }}>
                {desc}
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto">
            <div className="hero-banner-text">
              <p className="beats-solo hover-effect">{smallText}</p>
              <h3 className="hover-effect">{midText}</h3>
              {/* Split largeText1: "WEAR YOUR" on line 1, "LEGACY" on line 2 */}
              {largeText1 && (() => {
                const words = largeText1.split(' ');
                const lastWord = words.pop(); // Get "LEGACY"
                const firstPart = words.join(' '); // Get "WEAR YOUR"
                return (
                  <>
                    <h1 className="hover-effect">{firstPart}</h1>
                    <h1 className="hover-effect">{lastWord}</h1>
                  </>
                );
              })()}
              {/* largeText2 on line 3 */}
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
          </div>

          <div className="hero-cta">
            {product ? (
              <Link href={`/product/${product}`}>
                <button type="button" className="shop-now-btn">
                  Shop Now
                </button>
              </Link>
            ) : (
              <button type="button" className="shop-now-btn" disabled>
                Shop Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;