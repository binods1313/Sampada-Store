// components/SanityImage.jsx
import React from 'react';
import Image from 'next/image';
import { urlFor, getImageProps } from '../lib/client';

/**
 * A component that renders a Sanity image with proper width and height properties
 */
const SanityImage = ({
  image,
  alt = 'Product image',
  width: customWidth,
  height: customHeight,
  className = '',
  priority = false,
  style = {},
  ...rest
}) => {
  // Default dimensions - always provide these
  const defaultWidth = 400;
  const defaultHeight = 600;
  
  // Ensure we always have explicit width and height values
  const finalWidth = parseInt(customWidth || defaultWidth, 10);
  const finalHeight = parseInt(customHeight || defaultHeight, 10);
  
  // If no image or asset, render a placeholder
  if (!image || !image.asset) {
    return (
      <div className={`missing-image ${className}`}>
        <Image
          src="/asset/placeholder-image.jpg"
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          className={className}
          priority={priority}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            height: 'auto',
            ...style
          }}
          {...rest}
        />
      </div>
    );
  }
  
  try {
    // Get image props directly from helper function
    // This handles width, height, and URL generation
    const imgProps = getImageProps(image, {
      width: finalWidth,
      height: finalHeight,
      alt: alt
    });
    
    if (!imgProps || !imgProps.src) {
      throw new Error("Failed to get image properties");
    }
    
    // Ensure width and height are always explicitly defined numbers (never undefined)
    const imageWidth = parseInt(imgProps.width || finalWidth, 10);
    const imageHeight = parseInt(imgProps.height || finalHeight, 10);
    
    return (
      <Image
        src={imgProps.src}
        alt={imgProps.alt || alt}
        width={imageWidth}
        height={imageHeight}
        blurDataURL={imgProps.blurDataURL}
        className={className}
        priority={priority}
        style={{
          objectFit: 'contain',
          maxWidth: '100%',
          height: 'auto',
          ...style
        }}
        onError={(e) => {
          console.error('Image load failed:', imgProps.src);
          e.target.src = '/asset/placeholder-image.jpg';
        }}
        {...rest}
      />
    );
  } catch (error) {
    console.error('Error rendering Sanity image:', error);
    // Fallback to placeholder on error
    return (
      <div className={`error-image ${className}`}>
        <Image
          src="/asset/placeholder-image.jpg"
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          className={className}
          priority={priority}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            height: 'auto',
            ...style
          }}
          {...rest}
        />
      </div>
    );
  }
};

export default SanityImage;