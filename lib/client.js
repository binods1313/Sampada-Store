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

// New authenticated client for reading private data
export const authenticatedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN, // Use read token if available, otherwise general token
  useCdn: false, // Use false for consistency when reading user-specific data
});

const builder = imageUrlBuilder(client);

/**
 * Mock builder for invalid image sources
 * Implements all methods used in imageOptimizer.js
 */
class MockImageBuilder {
  constructor() {
    this.options = {};
  }

  width(w) {
    this.options.width = w;
    return this;
  }

  height(h) {
    this.options.height = h;
    return this;
  }

  quality(q) {
    this.options.quality = q;
    return this;
  }

  format(f) {
    this.options.format = f;
    return this;
  }

  auto(a) {
    this.options.auto = a;
    return this;
  }

  fit(f) {
    this.options.fit = f;
    return this;
  }

  rect(r) {
    this.options.rect = r;
    return this;
  }

  sharpen(s) {
    this.options.sharpen = s;
    return this;
  }

  dpr(d) {
    this.options.dpr = d;
    return this;
  }

  url() {
    return '/asset/placeholder-image.jpg';
  }
}

/**
 * Generates an image URL builder for a Sanity image source.
 * This function returns an instance of imageUrlBuilder, allowing chaining (e.g., .width().url()).
 * It provides a robust fallback if the source is invalid.
 * @param {Object} source - The Sanity image object (e.g., product.image[0] or variant.variantImage).
 * @returns {Object} An imageUrlBuilder instance or a mock object for invalid sources.
 */
export const urlFor = (source) => {
  if (!source?.asset) {
    // Return a mock builder that implements all needed methods
    return new MockImageBuilder();
  }

  try {
    return builder.image(source); // Return the actual builder for valid sources
  } catch (error) {
    console.error('Error initializing Sanity image builder with source:', source, error);
    // Fallback in case builder.image(source) itself throws an error for some reason
    return new MockImageBuilder();
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