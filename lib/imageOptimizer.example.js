// lib/imageOptimizer.example.js
// Example usage of the imageOptimizer.js module

import {
  getOptimizedImageUrl,
  generateResponsiveUrls,
  generatePictureElement,
  generateSrcSet,
  preloadImages,
  createImageObserver,
  getLQIP,
  getCacheStats,
  clearImageCache
} from './imageOptimizer';

// Example 1: Basic image optimization
const optimizedImageUrl = getOptimizedImageUrl(image, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp'
});

// Example 2: Responsive image URLs for different devices
const responsiveUrls = generateResponsiveUrls(image, {
  width: 1200,
  height: 800,
  format: 'avif'
});
// Usage: responsiveUrls.mobile, responsiveUrls.tablet, responsiveUrls.desktop

// Example 3: Generate a modern <picture> element
const pictureElement = await generatePictureElement(image, {
  sizes: ['400', '800', '1200'],
  alt: 'Product image',
  className: 'product-image',
  loading: 'lazy'
});

// Example 4: Generate srcSet for responsive images
const srcSet = generateSrcSet(image, {
  sizes: [400, 800, 1200],
  densities: [1, 2],
  aspectRatio: 0.75,
  format: 'webp'
});

// Example 5: Preload critical images
preloadImages([image1, image2, image3], {
  priority: 3,
  quality: 70,
  concurrent: 2
});

// Example 6: Create an intersection observer for lazy loading
const observer = createImageObserver((entry) => {
  if (entry.isIntersecting) {
    // Load the image
    const img = entry.target;
    img.src = getOptimizedImageUrl(img.dataset.image, {
      width: img.dataset.width,
      height: img.dataset.height
    });
    observer.unobserve(img);
  }
}, {
  rootMargin: '50px',
  threshold: 0.1
});

// Example 7: Get low-quality image placeholder (LQIP)
const lqip = getLQIP(image, {
  type: 'blur',
  quality: 20
});

// Example 8: Cache management
const stats = getCacheStats();
console.log('Image cache stats:', stats);

// Clear cache when needed (e.g., on logout)
// clearImageCache();