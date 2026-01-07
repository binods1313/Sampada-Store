// lib/imageOptimizer.js
// Enhanced image optimization service for Sanity CDN performance
import { urlFor } from './client';

// Polyfill for btoa in Node.js environments
const encodeBase64 = (str) => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof btoa !== 'undefined') {
    // Browser environment with btoa available
    try {
      return btoa(str);
    } catch (e) {
      // Fallback if btoa fails
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(str, 'binary').toString('base64');
      }
      // Last resort fallback
      return str;
    }
  } else if (typeof Buffer !== 'undefined') {
    // Node.js environment
    try {
      return Buffer.from(str, 'binary').toString('base64');
    } catch (e) {
      // Fallback if Buffer fails
      return str;
    }
  } else {
    // Neither btoa nor Buffer available, return original string
    return str;
  }
};

/**
 * Enhanced image cache with LRU eviction and size limits
 */
class ImageCache {
  constructor(maxSize = 100, maxMemory = 25 * 1024 * 1024) { // Reduced from 500 to 100 entries, 50MB to 25MB
    this.cache = new Map();
    this.maxSize = maxSize;
    this.maxMemory = maxMemory;
    this.currentMemory = 0;
    this.accessOrder = new Set();
  }

  // Add memory checks before creating large buffers
  safeBufferAllocation(size) {
    const MAX_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB limit
    if (size > MAX_BUFFER_SIZE) {
      throw new Error(`Buffer size ${size} exceeds maximum allowed ${MAX_BUFFER_SIZE}`);
    }
    return size; // Return size instead of creating buffer, as we're estimating
  }

  // Monitor memory usage in image processing functions
  checkMemoryUsage() {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      const used = window.performance.memory.usedJSHeapSize;
      const limit = window.performance.memory.jsHeapSizeLimit;
      console.log(`Memory usage: ${(used/1024/1024).toFixed(2)}MB / ${(limit/1024/1024).toFixed(2)}MB`);
      
      if (used / limit > 0.9) {
        console.warn('High memory usage detected!');
        return false;
      }
    }
    return true;
  }

  estimateSize(data) {
    // More conservative size estimation to prevent memory issues
    try {
      // For strings, estimate more conservatively
      if (typeof data === 'string') {
        // Cap string size estimation
        return Math.min(data.length * 2, 1024 * 1024); // Max 1MB per string
      }
      
      // For objects, stringify with limits
      const str = JSON.stringify(data, (key, value) => {
        // Limit depth and size of objects
        if (typeof value === 'object' && value !== null) {
          // Prevent circular references
          try {
            JSON.stringify(value);
          } catch (e) {
            return '[Circular]';
          }
        }
        // Limit string length
        if (typeof value === 'string' && value.length > 10000) {
          return value.substring(0, 10000) + '...';
        }
        return value;
      });
      
      // Check if Blob is available
      if (typeof Blob !== 'undefined') {
        const size = new Blob([str]).size;
        return Math.min(size, 2 * 1024 * 1024); // Max 2MB per item
      } else {
        // Fallback estimation for environments without Blob
        const size = new TextEncoder().encode(str).length;
        return Math.min(size, 2 * 1024 * 1024); // Max 2MB per item
      }
    } catch (e) {
      // Fallback estimation
      const size = String(data).length * 2;
      return Math.min(size, 1024 * 1024); // Max 1MB per item
    }
  }

  get(key) {
    // Check memory usage before getting from cache
    if (!this.checkMemoryUsage()) {
      // If memory usage is high, clean up cache
      this.clear();
      return null;
    }

    const item = this.cache.get(key);
    if (!item) return null;

    // Check expiry
    if (Date.now() - item.timestamp > CACHE_EXPIRY) {
      this.delete(key);
      return null;
    }

    // Update access order for LRU
    this.accessOrder.delete(key);
    this.accessOrder.add(key);
    return item;
  }

  set(key, data) {
    // Prevent setting undefined or null data
    if (data === undefined || data === null) {
      return;
    }

    // Check memory usage before setting
    if (!this.checkMemoryUsage()) {
      // If memory usage is high, don't add to cache
      return;
    }

    const size = this.estimateSize(data);
    
    // Use safe buffer allocation check
    try {
      this.safeBufferAllocation(size);
    } catch (error) {
      console.warn('ImageCache: Buffer allocation check failed:', error.message);
      return;
    }
    
    // Reject items that are too large
    if (size > this.maxMemory * 0.1) { // No single item should be more than 10% of total cache
      console.warn('ImageCache: Rejecting item that is too large for cache:', size);
      return;
    }
    
    // Remove oldest entries if needed
    this.evictIfNeeded(size);
    
    const item = { data, timestamp: Date.now(), size };
    this.cache.set(key, item);
    this.currentMemory += size;
    this.accessOrder.add(key);
    
    // If we've exceeded memory limits, force eviction
    if (this.currentMemory > this.maxMemory) {
      this.evictIfNeeded(0);
    }
  }

  evictIfNeeded(newItemSize) {
    // Check if accessOrder has values before trying to evict
    if (this.accessOrder.size === 0) {
      return;
    }

    // Evict by size limit - more aggressive eviction
    while (this.cache.size >= this.maxSize && this.accessOrder.size > 0) {
      const oldestKey = this.accessOrder.values().next().value;
      if (oldestKey !== undefined) {
        this.delete(oldestKey);
      } else {
        break; // Break if we can't get a valid key
      }
    }

    // Evict by memory limit - more aggressive eviction
    while (this.currentMemory + newItemSize > this.maxMemory && this.accessOrder.size > 0) {
      const oldestKey = this.accessOrder.values().next().value;
      if (oldestKey !== undefined) {
        this.delete(oldestKey);
      } else {
        break; // Break if we can't get a valid key
      }
      
      // If we're still over the limit and have more than 10 items, continue evicting
      if (this.currentMemory + newItemSize > this.maxMemory && this.accessOrder.size > 10) {
        continue;
      }
      break;
    }
  }

  delete(key) {
    const item = this.cache.get(key);
    if (item) {
      this.currentMemory -= item.size;
      // Ensure memory doesn't go negative
      if (this.currentMemory < 0) {
        this.currentMemory = 0;
      }
      this.cache.delete(key);
      this.accessOrder.delete(key);
    }
  }

  clear() {
    this.cache.clear();
    this.accessOrder.clear();
    this.currentMemory = 0;
  }

  // Implement cache size limits and cleanup
  cleanup() {
    if (this.cache.size > this.maxSize) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.slice(0, entries.length - this.maxSize).forEach(([key]) => {
        this.delete(key);
      });
    }
  }

  getStats() {
    // Check if cache is available
    if (!this.cache) {
      return {
        totalEntries: 0,
        validEntries: 0,
        expiredEntries: 0,
        memoryUsage: 0,
        maxMemory: this.maxMemory || 0,
        memoryUtilization: '0%'
      };
    }

    const now = Date.now();
    const validEntries = Array.from(this.cache.values()).filter(
      item => item && item.timestamp && (now - item.timestamp) < CACHE_EXPIRY
    );

    const validCount = validEntries.length;
    const totalCount = this.cache.size;
    const expiredCount = totalCount - validCount;
    const memoryUsage = this.currentMemory || 0;
    const maxMemory = this.maxMemory || 0;
    const memoryUtilization = maxMemory > 0 ? (Math.min(memoryUsage, maxMemory) / maxMemory * 100).toFixed(2) + '%' : '0%';

    return {
      totalEntries: totalCount,
      validEntries: validCount,
      expiredEntries: expiredCount,
      memoryUsage: Math.min(memoryUsage, maxMemory), // Cap at maxMemory
      maxMemory: maxMemory,
      memoryUtilization: memoryUtilization
    };
  }
}

const imageCache = new ImageCache();
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

/**
 * Enhanced device configurations with modern formats and WebP fallbacks
 */
export const DEVICE_CONFIGS = {
  mobile: {
    maxWidth: 640,
    quality: { webp: 75, avif: 70, jpeg: 80 },
    formats: ['avif', 'webp', 'jpeg'],
    sizes: [320, 640],
    densities: [1, 2]
  },
  tablet: {
    maxWidth: 1024,
    quality: { webp: 80, avif: 75, jpeg: 85 },
    formats: ['avif', 'webp', 'jpeg'],
    sizes: [640, 768, 1024],
    densities: [1, 2]
  },
  desktop: {
    maxWidth: 1920,
    quality: { webp: 85, avif: 80, jpeg: 90 },
    formats: ['avif', 'webp', 'jpeg'],
    sizes: [1024, 1366, 1920],
    densities: [1, 2]
  }
};

/**
 * Image format support detection
 */
export const FormatDetector = {
  _cache: new Map(),
  
  async supportsFormat(format) {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return false;
    
    // Check if canvas is available
    if (typeof document === 'undefined' || typeof document.createElement === 'undefined') {
      return false;
    }
    
    if (this._cache.has(format)) return this._cache.get(format);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      // Check if toDataURL is available
      if (typeof canvas.toDataURL !== 'function') {
        this._cache.set(format, false);
        return false;
      }
      
      const dataUrl = canvas.toDataURL(`image/${format}`, 0.1);
      const isSupported = dataUrl.indexOf(`data:image/${format}`) === 0;
      this._cache.set(format, isSupported);
      return isSupported;
    } catch {
      this._cache.set(format, false);
      return false;
    }
  },

  async getBestFormat(preferredFormats = ['avif', 'webp', 'jpeg']) {
    for (const format of preferredFormats) {
      if (await this.supportsFormat(format)) {
        return format;
      }
    }
    return 'jpeg'; // Ultimate fallback
  }
};

/**
 * Enhanced cache key generation with better hashing and size limits
 */
const getCacheKey = (image, options) => {
  // Ensure we have valid image data
  const assetId = (image && image.asset) ? (image.asset._ref || image.asset._id || 'placeholder') : 'placeholder';
  
  // Ensure options is an object
  const optionsObj = options && typeof options === 'object' ? options : {};
  
  try {
    // Limit the depth and size of the options object to prevent memory issues
    const safeOptions = {};
    const maxDepth = 3;
    const maxSize = 1000;
    
    const copyWithLimits = (obj, depth = 0) => {
      if (depth > maxDepth || typeof obj !== 'object' || obj === null) {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.slice(0, Math.min(obj.length, 50)).map(item => copyWithLimits(item, depth + 1));
      }
      
      const result = {};
      let size = 0;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const serialized = JSON.stringify(value);
          size += (key.length + (serialized ? serialized.length : 0));
          
          if (size > maxSize) {
            break;
          }
          
          result[key] = copyWithLimits(value, depth + 1);
        }
      }
      return result;
    };
    
    const limitedOptions = copyWithLimits(optionsObj);
    const optionsStr = JSON.stringify(limitedOptions, Object.keys(limitedOptions).sort());
    
    // Limit the length of the encoded string
    const encodedStr = encodeBase64(optionsStr).substring(0, 50);
    return `${assetId}-${encodedStr}`;
  } catch (e) {
    // Fallback to simple key generation if JSON.stringify fails
    return `${assetId}-${Date.now()}`;
  }
};

/**
 * Error boundary for image operations
 */
const withErrorHandling = (fn, fallback) => {
  return (...args) => {
    // Wrap all image processing in error handlers
    try {
      // Check memory usage before processing
      if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
        const used = window.performance.memory.usedJSHeapSize;
        const limit = window.performance.memory.jsHeapSizeLimit;
        
        if (used / limit > 0.9) {
          throw new Error('Insufficient memory for image processing');
        }
      }
      
      return fn(...args);
    } catch (error) {
      console.error('Image optimizer error:', error);
      // Add memory usage information to error logging
      if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.error('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB'
        });
      }
      return fallback;
    }
  };
};

/**
 * Smart quality adjustment based on image characteristics
 */
const getSmartQuality = (width, height, baseQuality, format) => {
  // Ensure we have valid numbers
  const validWidth = typeof width === 'number' && !isNaN(width) ? width : 400;
  const validHeight = typeof height === 'number' && !isNaN(height) ? height : 600;
  const validBaseQuality = typeof baseQuality === 'number' && !isNaN(baseQuality) ? baseQuality : 85;
  
  const pixelCount = validWidth * validHeight;
  const formatMultiplier = {
    avif: 0.85,
    webp: 0.9,
    jpeg: 1.0
  };
  
  let quality = validBaseQuality * (formatMultiplier[format] || 1);
  
  // Adjust based on pixel density
  if (pixelCount > 2000000) quality = Math.max(quality - 25, 50);
  else if (pixelCount > 1000000) quality = Math.max(quality - 15, 60);
  else if (pixelCount > 500000) quality = Math.max(quality - 10, 70);
  
  return Math.round(Math.max(Math.min(quality, 100), 30));
};

/**
 * Generate responsive image URLs with modern format support
 */
export const generateResponsiveUrls = withErrorHandling((image, options = {}) => {
  if (!image?.asset) {
    return {
      mobile: '/asset/placeholder-image.jpg',
      tablet: '/asset/placeholder-image.jpg',
      desktop: '/asset/placeholder-image.jpg'
    };
  }

  const cacheKey = getCacheKey(image, { ...options, responsive: true });
  const cached = imageCache.get(cacheKey);

  if (cached) return cached.data;

  const baseWidth = options.width || 400;
  const baseHeight = options.height || 600;
  const aspectRatio = baseWidth / baseHeight;
  const preferredFormat = options.format || 'webp';

  const urls = {};

  Object.entries(DEVICE_CONFIGS).forEach(([device, config]) => {
    const deviceWidth = Math.min(baseWidth, config.maxWidth);
    const deviceHeight = Math.round(deviceWidth / aspectRatio);
    const quality = config.quality[preferredFormat] || config.quality.webp;

    urls[device] = urlFor(image)
      .width(deviceWidth)
      .height(deviceHeight)
      .quality(getSmartQuality(deviceWidth, deviceHeight, quality, preferredFormat))
      .format(preferredFormat)
      .auto('format')
      .fit('fill')
      .url();
  });

  imageCache.set(cacheKey, urls);
  return urls;
}, {
  mobile: '/asset/placeholder-image.jpg',
  tablet: '/asset/placeholder-image.jpg',
  desktop: '/asset/placeholder-image.jpg'
});

/**
 * Generate optimized image URL with advanced options and memory safeguards
 */
export const getOptimizedImageUrl = withErrorHandling((image, options = {}) => {
  if (!image?.asset) {
    return '/asset/placeholder-image.jpg';
  }

  const cacheKey = getCacheKey(image, options);
  const cached = imageCache.get(cacheKey);

  if (cached) return cached.data;

  const {
    width = 400,
    height = 600,
    quality = 85,
    format = 'webp',
    fit = 'fill',
    dpr = 1,
    progressive = true,
    sharpen = options.sharpen || (dpr > 1 ? 10 : 0)
  } = options;

  // Validate inputs and set reasonable limits to prevent memory issues
  const validWidth = Math.min(typeof width === 'number' && !isNaN(width) ? width : 400, 4000); // Max 4000px
  const validHeight = Math.min(typeof height === 'number' && !isNaN(height) ? height : 600, 4000); // Max 4000px
  const validDpr = Math.min(typeof dpr === 'number' && !isNaN(dpr) ? dpr : 1, 3); // Max 3x density
  const validQuality = Math.min(Math.max(quality, 10), 95); // Between 10-95
  
  const actualWidth = Math.round(validWidth * validDpr);
  const actualHeight = Math.round(validHeight * validDpr);
  const smartQuality = getSmartQuality(actualWidth, actualHeight, validQuality, format);

  // Check if resulting image would be too large
  if (actualWidth * actualHeight > 12000000) { // Max 12MP
    console.warn('Image dimensions too large, reducing size');
    // Reduce dimensions proportionally
    const ratio = Math.sqrt(12000000 / (actualWidth * actualHeight));
    const newWidth = Math.round(actualWidth * ratio);
    const newHeight = Math.round(actualHeight * ratio);
    return getOptimizedImageUrl(image, {
      ...options,
      width: newWidth,
      height: newHeight,
      dpr: 1
    });
  }

  let urlBuilder = urlFor(image)
    .width(actualWidth)
    .height(actualHeight)
    .quality(smartQuality)
    .format(format)
    .auto('format')
    .fit(fit);

  // Add progressive flag for JPEG and WebP
  if (progressive && (format === 'jpeg' || format === 'webp')) {
    urlBuilder = urlBuilder.format(`${format}progressive`);
  }

  // Add sharpening if requested and within limits
  if (sharpen > 0 && sharpen <= 20) {
    urlBuilder = urlBuilder.sharpen(sharpen);
  }

  const url = urlBuilder.url();
  imageCache.set(cacheKey, url);
  return url;
}, '/asset/placeholder-image.jpg');

/**
 * Generate modern picture element with multiple formats
 */
export const generatePictureElement = async (image, options = {}) => {
  if (!image?.asset) return null;

  // Check if we're in a browser environment for FormatDetector
  if (typeof window === 'undefined') {
    // Server-side fallback - return a simple object
    return {
      sources: [],
      fallback: {
        src: getOptimizedImageUrl(image, { ...options, format: 'jpeg' }),
        alt: options.alt || '',
        className: options.className || '',
        loading: options.loading || 'lazy'
      }
    };
  }

  const {
    sizes = ['400', '800', '1200'],
    alt = '',
    className = '',
    loading = 'lazy'
  } = options;

  const supportedFormats = [];
  for (const format of ['avif', 'webp', 'jpeg']) {
    if (await FormatDetector.supportsFormat(format)) {
      supportedFormats.push(format);
    }
  }

  // If no formats are supported, fallback to jpeg
  if (supportedFormats.length === 0) {
    supportedFormats.push('jpeg');
  }

  const sources = supportedFormats.slice(0, -1).map(format => {
    const srcSet = sizes.map(size => {
      const url = getOptimizedImageUrl(image, {
        ...options,
        width: parseInt(size, 10), // Ensure size is parsed as integer
        format
      });
      return `${url} ${size}w`;
    }).join(', ');

    return { format, srcSet };
  });

  const fallbackFormat = supportedFormats[supportedFormats.length - 1] || 'jpeg';
  const fallbackSrcSet = sizes.map(size => {
    const url = getOptimizedImageUrl(image, {
      ...options,
      width: parseInt(size, 10), // Ensure size is parsed as integer
      format: fallbackFormat
    });
    return `${url} ${size}w`;
  }).join(', ');

  return {
    sources,
    fallback: {
      srcSet: fallbackSrcSet,
      src: getOptimizedImageUrl(image, { ...options, format: fallbackFormat }),
      alt,
      className,
      loading
    }
  };
};

/**
 * Enhanced LQIP with blurhash support
 */
export const getLQIP = withErrorHandling((image, options = {}) => {
  if (!image?.asset) {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
  }

  const { type = 'blur', quality = 20 } = options;
  const cacheKey = getCacheKey(image, { lqip: true, type, quality });
  const cached = imageCache.get(cacheKey);

  if (cached) return cached.data;

  // Check for blurhash support
  if (type === 'blurhash' && image.asset?.metadata?.blurHash) {
    // Return blurhash if available
    imageCache.set(cacheKey, image.asset.metadata.blurHash);
    return image.asset.metadata.blurHash;
  }

  // Generate blur image
  const lqipUrl = urlFor(image)
    .width(40)
    .height(40)
    .quality(quality)
    .blur(type === 'blur' ? 10 : 0)
    .format('webp')
    .url();

  imageCache.set(cacheKey, lqipUrl);
  return lqipUrl;
}, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//2Q==');

/**
 * Batch preload with priority queue
 */
export const preloadImages = (images, options = {}) => {
  // Check if we're in a browser environment
  if (!Array.isArray(images) || images.length === 0 || typeof window === 'undefined') {
    return Promise.resolve();
  }

  // Check if document is available
  if (typeof document === 'undefined' || typeof document.createElement === 'undefined' || typeof document.head === 'undefined') {
    return Promise.resolve();
  }

  const {
    priority = 3,
    quality = 70,
    concurrent = 3,
    timeout = 10000
  } = options;

  // Limit the number of images to preload to prevent memory issues
  const preloadQueue = images.slice(0, Math.min(priority, 10)); // Cap at 10 images
  const links = [];
  const cleanupTimers = [];

  // Return a promise that can be cancelled
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
    // Clean up all resources immediately
    links.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      // Clean up timeout if exists
      if (link.cleanup) {
        link.cleanup();
      }
    });
    // Clear all timers
    cleanupTimers.forEach(timerId => clearTimeout(timerId));
  };

  return new Promise((resolve, reject) => {
    // If cancelled before promise starts, resolve immediately
    if (cancelled) {
      resolve();
      return;
    }

    let completed = 0;
    let processed = 0;
    let activeRequests = 0;

    // Around line 553, improve dimension checking
    function validateImageDimensions(width, height) {
      const MAX_WIDTH = 4000;
      const MAX_HEIGHT = 4000;
      const MAX_PIXELS = 16000000; // 16MP
      
      if (width > MAX_WIDTH || height > MAX_HEIGHT || (width * height) > MAX_PIXELS) {
        console.log(`📐 Image dimensions too large (${width}x${height}), will be resized`);
        
        // Calculate new dimensions maintaining aspect ratio
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        return {
          width: Math.floor(width * ratio),
          height: Math.floor(height * ratio),
          wasResized: true
        };
      }
      
      return { width, height, wasResized: false };
    }

    const cleanup = () => {
      // Clean up links after timeout or completion
      const timerId = setTimeout(() => {
        links.forEach(link => {
          // Check if link still has a parent before trying to remove
          if (link.parentNode) {
            try {
              link.parentNode.removeChild(link);
            } catch (e) {
              // Ignore errors during cleanup
            }
          }
        });
        // Remove timer from cleanup list
        const index = cleanupTimers.indexOf(timerId);
        if (index > -1) {
          cleanupTimers.splice(index, 1);
        }
        // Call general cleanup
        cleanupUnusedResources();
      }, timeout);
      cleanupTimers.push(timerId);
    };

    const processNext = () => {
      // If cancelled, stop processing
      if (cancelled) {
        resolve();
        return;
      }

      if (processed >= preloadQueue.length) {
        // If all processed, schedule cleanup and resolve
        if (completed >= preloadQueue.length) {
          cleanup();
          resolve();
        }
        return;
      }

      // Respect concurrency limit
      if (activeRequests >= concurrent) {
        return;
      }

      const image = preloadQueue[processed++];
      if (!image?.asset) {
        // Skip invalid images
        completed++;
        activeRequests--;
        // Check if all completed
        if (completed >= preloadQueue.length) {
          cleanup();
          resolve();
        } else {
          // Process next if available
          processNext();
        }
        return;
      }

      activeRequests++;

      // Use the enhanced preloadImage function
      const imageUrl = getOptimizedImageUrl(image, {
        width: 400,
        height: 600,
        quality,
        format: 'webp'
      });

      // Add error handling for link creation
      if (!imageUrl || imageUrl === 'undefined') {
        activeRequests--;
        completed++;
        if (completed >= preloadQueue.length) {
          cleanup();
          resolve();
        } else {
          processNext();
        }
        return;
      }

      // Use safe preload with immediate usage
      safePreloadImage(imageUrl).then(link => {
        if (link) {
          links.push(link);
          // Immediately create and use the image to prevent "not used" warnings
          setTimeout(() => safeUsePreloadedImage(imageUrl), 100);
        }
        
        activeRequests--;
        completed++;
        if (completed >= preloadQueue.length) {
          cleanup();
          resolve();
        } else {
          // Process next if slots available
          processNext();
        }
      }).catch(error => {
        console.warn('Preload error:', error);
        activeRequests--;
        completed++;
        if (completed >= preloadQueue.length) {
          cleanup();
          resolve();
        } else {
          // Process next if slots available
          processNext();
        }
      });
    };

    // Start concurrent preloading
    for (let i = 0; i < Math.min(concurrent, preloadQueue.length); i++) {
      processNext();
    }

    // Add cancel method to promise for cleanup
    resolve.cancel = cancel;
  });
};

// Replace the current preload function around line 853
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.crossOrigin = 'anonymous'; // Add if needed for CORS
    
    // Track if callbacks were called to prevent timeout conflicts
    let called = false;
    
    link.onload = () => {
      if (called) return;
      called = true;
      console.log(`✅ Preload success: ${src}`);
      resolve(link);
    };
    
    link.onerror = (error) => {
      if (called) return;
      called = true;
      console.warn(`❌ Preload failed: ${src}`, error);
      // Don't reject, just resolve with null to continue
      resolve(null);
    };
    
    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!called) {
        called = true;
        console.warn(`⏰ Preload timeout: ${src}`);
        // Clean up the link if it still exists
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        resolve(null);
      }
    }, 5000);
    
    // Add cleanup function to remove timeout if needed
    link.cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    
    document.head.appendChild(link);
  });
}

// Add this function to use preloaded resources immediately
export function usePreloadedImage(src) {
  // Create image element that will use the preloaded resource
  const img = new Image();
  img.loading = 'eager'; // Force immediate loading
  img.src = src;
  
  // Ensure it's actually processed/displayed
  return new Promise((resolve) => {
    img.onload = () => {
      console.log(`🖼️ Image loaded from preload: ${src}`);
      resolve(img);
    };
    img.onerror = () => {
      console.warn(`🚫 Failed to load preloaded image: ${src}`);
      resolve(null);
    };
  });
}

// The withErrorHandling function is already defined earlier in the file

// Wrap critical functions
const safePreloadImage = withErrorHandling(preloadImage, 'preloadImage');
const safeUsePreloadedImage = withErrorHandling(usePreloadedImage, 'usePreloadedImage');

// Add cleanup function
function cleanupUnusedResources() {
  // Remove unused preload links after 10 seconds
  setTimeout(() => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
    preloadLinks.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
  }, 10000);
}

/**
 * Advanced intersection observer with performance monitoring
 */
export const createImageObserver = (callback, options = {}) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Fallback for server-side rendering
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
      getMetrics: () => [],
      clearMetrics: () => {}
    };
  }

  // Check if IntersectionObserver is available
  if (typeof window.IntersectionObserver === 'undefined') {
    // Fallback for browsers that don't support IntersectionObserver
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
      getMetrics: () => [],
      clearMetrics: () => {}
    };
  }

  const {
    rootMargin = '50px',
    threshold = 0.1,
    trackPerformance = false
  } = options;

  const performanceMetrics = trackPerformance ? new Map() : null;

  const enhancedCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (trackPerformance && typeof performance !== 'undefined' && typeof performance.now === 'function') {
        const startTime = performance.now();
        callback(entry, observer);
        const duration = performance.now() - startTime;
        performanceMetrics.set(entry.target, duration);
      } else {
        callback(entry, observer);
      }
    });
  };

  const observer = new IntersectionObserver(enhancedCallback, {
    rootMargin,
    threshold
  });

  if (trackPerformance) {
    observer.getMetrics = () => Array.from(performanceMetrics.entries());
    observer.clearMetrics = () => performanceMetrics.clear();
  }

  return observer;
};

/**
 * Generate enhanced srcSet with density descriptors
 */
export const generateSrcSet = withErrorHandling((image, options = {}) => {
  if (!image?.asset) return '';

  const {
    sizes = [400, 800, 1200],
    densities = [1, 2],
    aspectRatio = 0.75,
    format = 'webp'
  } = options;

  // Validate inputs
  if (!Array.isArray(sizes) || !Array.isArray(densities)) {
    return '';
  }

  const srcSetEntries = [];

  sizes.forEach(size => {
    // Ensure size is a valid number
    const validSize = typeof size === 'number' ? size : parseInt(size, 10);
    if (isNaN(validSize)) return;
    
    densities.forEach(density => {
      // Ensure density is a valid number
      const validDensity = typeof density === 'number' ? density : parseFloat(density);
      if (isNaN(validDensity)) return;
      
      const actualSize = validSize * validDensity;
      const url = getOptimizedImageUrl(image, {
        width: actualSize,
        height: Math.round(actualSize * aspectRatio),
        quality: 85,
        format,
        dpr: validDensity
      });
      
      if (validDensity === 1) {
        srcSetEntries.push(`${url} ${validSize}w`);
      } else {
        srcSetEntries.push(`${url} ${validSize}w ${validDensity}x`);
      }
    });
  });

  return srcSetEntries.join(', ');
}, '');

/**
 * Memory and performance utilities
 */
export const clearImageCache = () => {
  imageCache.clear();
  // Implement resource cleanup
  cleanup();
};

// Implement resource cleanup
function cleanup() {
  // Clear any large arrays/buffers
  // Remove unused DOM elements
  // Force garbage collection if possible
  if (typeof window !== 'undefined' && window.gc) {
    try {
      window.gc();
    } catch (e) {
      // Ignore if gc is not available
    }
  }
}

export const getCacheStats = () => imageCache.getStats();

export const optimizeCache = () => {
  const stats = imageCache.getStats();
  if (stats.expiredEntries > 0) {
    // Force cleanup of expired entries
    const keysToDelete = [];
    const now = Date.now();
    
    imageCache.cache.forEach((value, key) => {
      // Check if value and timestamp exist
      if (value && value.timestamp && (now - value.timestamp > CACHE_EXPIRY)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => imageCache.delete(key));
  }
  
  // Call cleanup method
  imageCache.cleanup();
  
  return imageCache.getStats();
};

// Performance monitoring
export const getPerformanceMetrics = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof performance === 'undefined') {
    return {
      totalRequests: 0,
      averageLoadTime: 0,
      cacheHitRatio: 0
    };
  }
  
  // Check if performance API is available
  if (typeof performance.getEntriesByType !== 'function') {
    return {
      totalRequests: 0,
      averageLoadTime: 0,
      cacheHitRatio: 0
    };
  }
  
  const entries = performance.getEntriesByType('resource')
    .filter(entry => entry.name.includes('sanity') && entry.name.includes('images'));
  
  return {
    totalRequests: entries.length,
    averageLoadTime: entries.length > 0 ? 
      entries.reduce((sum, entry) => sum + entry.duration, 0) / entries.length : 0,
    cacheHitRatio: imageCache.cache.size > 0 ? 
      (imageCache.cache.size / (imageCache.cache.size + entries.length)) * 100 : 0
  };
};

export const ImageOptimizer = {
  generateResponsiveUrls,
  getOptimizedImageUrl,
  generatePictureElement,
  getLQIP,
  preloadImages,
  clearImageCache,
  getCacheStats,
  optimizeCache,
  createImageObserver,
  generateSrcSet,
  getPerformanceMetrics,
  FormatDetector,
  preloadImage,
  usePreloadedImage
};

export default ImageOptimizer;
