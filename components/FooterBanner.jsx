// components/FooterBanner.jsx
import React from 'react';
import Link from 'next/link';
import { urlFor } from '../lib/client';
import Image from 'next/image';

const FooterBanner = ({ footerBanner }) => {
  // 1. Safe default values with full schema structure
  const defaultBanner = {
    discount: '20% OFF',
    largeText1: 'Special Offer',
    largeText2: 'Limited Time',
    saleTime: 'Today Only',
    desc: 'Shop now for amazing deals!',
    smallText: "Don't Miss Out",
    midText: 'Flash Sale',
    product: '',
    buttonText: 'Shop Now',
    image: null
  };

  // 2. Null-check and merge with defaults
  const safeBanner = footerBanner ? { ...defaultBanner, ...footerBanner } : defaultBanner;

  // 3. Destructure after ensuring data structure
  const { discount, largeText1, largeText2, saleTime, desc, smallText, midText, product, buttonText, image } = safeBanner;

  // Generate image URL using urlFor builder - properly handles Sanity image objects
  const imageUrl = image?.asset 
    ? urlFor(image).width(450).height(450).url()
    : '/asset/placeholder-image.jpg';

  // 5. Conditional product link rendering
  const shouldRenderLink = product && product.trim() !== '';

  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="left">
          <p>{discount}</p>
          {/* Split largeText1: "WEAR YOUR" on line 1, "LEGACY" on line 2 */}
          {largeText1 && (() => {
            const words = largeText1.split(' ');
            const lastWord = words.pop(); // Get "LEGACY"
            const firstPart = words.join(' '); // Get "WEAR YOUR"
            return (
              <>
                <h3>{firstPart}</h3>
                <h3>{lastWord}</h3>
              </>
            );
          })()}
          {/* largeText2 on line 3 */}
          <h3>{largeText2}</h3>
          <p>{saleTime}</p>
        </div>

        <div className="image-container">
          <Image
            src={imageUrl}
            alt={midText || 'footer banner'}
            width={450}
            height={450}
            priority // Prioritize loading for LCP
            className="footer-banner-image"
            onError={(e) => {
              console.error('Banner image load failed:', imageUrl);
              e.target.src = '/asset/placeholder-image.jpg';
              // Fallback image styling to ensure it fits well
              e.target.style.width = 'auto';
              e.target.style.height = 'auto';
              e.target.style.maxWidth = '100%';
              e.target.style.maxHeight = '100%';
              e.target.style.objectFit = 'contain';
            }}
          />
        </div>

        <div className="right">
          <p>{smallText}</p>
          {/* Enhanced styling for Aurora Sky Pulse text */}
          <h3 className="product-name">{midText}</h3>
          <p>{desc}</p>
        </div>
      </div>
      <div className="footer-cta">
        {shouldRenderLink ? (
          <Link href={`/product/${product}`}>
            <button type="button" className="shop-now-btn hover-effect">
              {buttonText}
            </button>
          </Link>
        ) : (
          <button type="button" className="shop-now-btn hover-effect" disabled>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default FooterBanner;