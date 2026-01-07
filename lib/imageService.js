// lib/imageService.js
import { urlFor as sanityUrlFor } from './sanityImageBuilder';

/**
 * Extract dimensions from a Sanity image URL
 * @param {string} url - The Sanity image URL
 * @returns {Object} - The width and height
 */
const extractDimensionsFromUrl = (url) => {
  if (!url) return { width: 400, height: 600 };
  
  // Try to extract dimensions from the URL format (filename-WIDTHxHEIGHT.ext)
  const dimensionsMatch = url.match(/-(\d+)x(\d+)\.[a-zA-Z]+$/);
  
  if (dimensionsMatch) {
    return {
      width: parseInt(dimensionsMatch[1], 10),
      height: parseInt(dimensionsMatch[2], 10)
    };
  }
  
  // Return default dimensions if can't extract
  return { width: 400, height: 600 };
};

/**
 * Get image props for Next.js Image component from a Sanity image
 * 
 * @param {Object} image - The Sanity image object
 * @param {Object} options - Additional options
 * @param {number} options.width - Override width
 * @param {number} options.height - Override height
 * @param {string} options.alt - Alt text
 * @param {string} options.className - CSS class
 * @param {boolean} options.priority - Whether to prioritize loading
 * @returns {Object} - Props for Next.js Image component
 */
export const getImageProps = (image, options = {}) => {
  if (!image || !image.asset) {
    return {
      src: '/placeholder-image.jpg',
      alt: options.alt || 'Placeholder image',
      width: options.width || 400,
      height: options.height || 600,
      className: options.className,
      priority: options.priority
    };
  }

  try {
    // Determine image dimensions before URL generation
    const width = options.width || 400;
    const height = options.height || 600;
    
    // Get the URL builder from sanityImageBuilder
    const builder = sanityUrlFor(image);
    
    // Configure the URL with specified dimensions
    const imageUrl = builder
      .width(width)
      .height(height)
      .fit('clip') // Use 'clip' to maintain aspect ratio
      .url();
    
    // Return props for Next.js Image component
    return {
      src: imageUrl,
      alt: options.alt || image.alt || 'Image',
      width: width,
      height: height,
      className: options.className,
      priority: options.priority
    };
  } catch (error) {
    console.error('Error generating image props:', error);
    return {
      src: '/placeholder-image.jpg',
      alt: options.alt || 'Placeholder image',
      width: options.width || 400,
      height: options.height || 600,
      className: options.className,
      priority: options.priority
    };
  }
};

/**
 * Check if a URL is from Sanity's CDN
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether the URL is from Sanity's CDN
 */
export const isSanityUrl = (url) => {
  return typeof url === 'string' && url.includes('cdn.sanity.io');
};

/**
 * Get dimensions from a URL string
 * @param {string} url - The URL to parse
 * @returns {Object|null} - The dimensions or null if not found
 */
export const getDimensionsFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  return extractDimensionsFromUrl(url);
};