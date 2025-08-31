// lib/client.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-05-18'; // Keep your latest API version

if (!projectId) {
  console.error("Error: Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env");
}
if (!dataset) {
  console.error("Error: Missing NEXT_PUBLIC_SANITY_DATASET in .env");
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

/**
 * Generates an image URL builder for a Sanity image source.
 * This function returns an instance of imageUrlBuilder, allowing chaining (e.g., .width().url()).
 * It provides a robust fallback if the source is invalid.
 * @param {Object} source - The Sanity image object (e.g., product.image[0] or variant.variantImage).
 * @returns {Object} An imageUrlBuilder instance or a mock object for invalid sources.
 */
export const urlFor = (source) => {
  if (!source?.asset) {
    // Return a mock builder that can respond to .url(), .width(), etc., with a placeholder
    return {
      url: () => '/asset/placeholder-image.jpg', // Always returns placeholder URL
      width: () => ({ url: () => '/asset/placeholder-image.jpg' }),
      height: () => ({ url: () => '/asset/placeholder-image.jpg' }),
      // Add other chained methods if your code uses them, returning `this` for chaining
      // and eventually `url()` for the final string.
      // Example: .auto('format') etc.
      auto: () => ({ url: () => '/asset/placeholder-image.jpg' }),
      format: () => ({ url: () => '/asset/placeholder-image.jpg' }),
    };
  }

  try {
    return builder.image(source); // Return the actual builder for valid sources
  } catch (error) {
    console.error('Error initializing Sanity image builder with source:', source, error);
    // Fallback in case builder.image(source) itself throws an error for some reason
    return {
      url: () => '/asset/placeholder-image.jpg',
      width: () => ({ url: () => '/asset/placeholder-image.jpg' }),
      height: () => ({ url: () => '/asset/placeholder-image.jpg' }),
      auto: () => ({ url: () => '/asset/placeholder-image.jpg' }),
      format: () => ({ url: () => '/asset/placeholder-image.jpg' }),
    };
  }
};

/**
 * Get image props for Next.js Image component.
 * Uses the consolidated urlFor function to generate the image URL.
 * @param {Object} image - The Sanity image object.
 * @param {Object} options - Options (width, height, alt).
 * @returns {Object} - Props for Next.js Image component.
 */
export function getImageProps(image, options = {}) {
  const defaultWidth = options.width || 400;
  const defaultHeight = options.height || 600;
  const placeholderSrc = '/asset/placeholder-image.jpg';

  if (!image || !image.asset) {
    return {
      src: placeholderSrc,
      alt: options.alt || 'Placeholder image',
      width: defaultWidth,
      height: defaultHeight,
    };
  }

  try {
    const imageUrl = urlFor(image).width(defaultWidth).height(defaultHeight).url();
    
    return {
      src: imageUrl,
      alt: options.alt || 'Image',
      width: defaultWidth, // Ensure explicit numbers for Next/Image
      height: defaultHeight, // Ensure explicit numbers for Next/Image
    };
  } catch (error) {
    console.error('Error generating image props for Next.js Image:', image, error);
    return {
      src: placeholderSrc,
      alt: options.alt || 'Placeholder image',
      width: defaultWidth,
      height: defaultHeight,
    };
  }
}

/**
 * Creates a more resilient URL for Sanity images with fallback handling.
 * This is similar to urlFor but explicitly targets returning a URL string.
 * @param {Object} source - The Sanity image object.
 * @param {Object} options - Image options (width, height, etc.).
 * @returns {string} - A valid image URL or a placeholder.
 */
export const getReliableImageUrl = (source, options = {}) => {
  const placeholderSrc = '/asset/placeholder-image.jpg';

  if (!source?.asset) {
    return placeholderSrc;
  }
  
  try {
    let imageBuilder = urlFor(source); // Get the builder
    
    if (options.width) imageBuilder = imageBuilder.width(options.width);
    if (options.height) imageBuilder = imageBuilder.height(options.height);
    if (options.rect) imageBuilder = imageBuilder.rect(options.rect); // Assuming rect is a builder method
    if (options.quality) imageBuilder = imageBuilder.quality(options.quality);
    if (options.format) imageBuilder = imageBuilder.format(options.format);

    const imageUrl = imageBuilder.url(); // Get the final URL string
    
    return imageUrl || placeholderSrc; // Fallback if url() somehow returns null/empty
  } catch (error) {
    console.error('Failed to generate reliable image URL:', source, error);
    return placeholderSrc;
  }
};

// Add this useful debugging function
export const logImageProps = (componentName, image, props) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${componentName}] Image props:`, {
      hasImage: !!image,
      hasAsset: !!(image?.asset),
      width: props.width,
      height: props.height, 
      src: props.src?.substring(0, 50) + '...', // Log truncated URL
    });
  }
};