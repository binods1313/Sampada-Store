// components/FooterBanner.jsx
import React from 'react';
import Link from 'next/link';
import { urlFor, getImageProps } from '../lib/client';
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

  // Define a sensible height to request the image from Sanity.
  // This value should be large enough to ensure good quality, but not excessively large.
  // The actual display size will be controlled by CSS.
  const sanityImageFetchHeight = 450; // Request a high-resolution image, preserving aspect ratio

  // Initialize imageProps with placeholder values
  let imageProps = {
    src: '/asset/placeholder-image.jpg',
    width: 300, // Placeholder dimensions
    height: 300, // Placeholder dimensions
    alt: 'footer banner'
  };

  // Try to get image props from Sanity image if available
  if (image && image.asset) {
    try {
      // Request the image with a specific height from Sanity.
      // Sanity will automatically calculate the correct width to maintain the aspect ratio.
      // This ensures the full smartwatch image is fetched, not a cropped square.
      const props = getImageProps(image, {
        height: sanityImageFetchHeight,
        alt: 'footer banner'
      });
      
      // Use the dimensions returned by getImageProps directly for Next/Image
      if (props && props.src && props.width && props.height) {
        imageProps = {
          ...props,
          width: parseInt(props.width, 10), // Ensure width is a number
          height: parseInt(props.height, 10) // Ensure height is a number
        };
      }
    } catch (error) {
      console.error('Error getting image props for footer banner:', error);
    }
  }

  // 5. Conditional product link rendering
  const shouldRenderLink = product && product.trim() !== '';

  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="left">
          <p>{discount}</p>
          <h3>{largeText1}</h3>
          <h3>{largeText2}</h3>
          <p>{saleTime}</p>
        </div>
        
        <div className="image-container">
          <Image
            src={imageProps.src}
            alt={imageProps.alt}
            width={imageProps.width}
            height={imageProps.height}
            priority // Prioritize loading for LCP
            className="footer-banner-image"
            onError={(e) => {
              console.error('Banner image load failed');
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
    </div>
  );
};

export default FooterBanner;