// lib/imageOptimizer.d.ts
// TypeScript definitions for imageOptimizer.js

interface DeviceConfig {
  maxWidth: number;
  quality: {
    webp: number;
    avif: number;
    jpeg: number;
  };
  formats: string[];
  sizes: number[];
  densities: number[];
}

interface ImageCacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  memoryUsage: number;
  maxMemory: number;
  memoryUtilization: string;
}

interface PerformanceMetrics {
  totalRequests: number;
  averageLoadTime: number;
  cacheHitRatio: number;
}

interface PictureSource {
  format: string;
  srcSet: string;
}

interface PictureElement {
  sources: PictureSource[];
  fallback: {
    srcSet: string;
    src: string;
    alt: string;
    className: string;
    loading: 'lazy' | 'eager';
  };
}

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: string;
  dpr?: number;
  progressive?: boolean;
  sharpen?: number;
  [key: string]: any;
}

interface PreloadOptions {
  priority?: number;
  quality?: number;
  concurrent?: number;
  timeout?: number;
}

interface ObserverOptions {
  rootMargin?: string;
  threshold?: number | number[];
  trackPerformance?: boolean;
}

interface LQIPOptions {
  type?: 'blur' | 'blurhash';
  quality?: number;
}

export const DEVICE_CONFIGS: {
  mobile: DeviceConfig;
  tablet: DeviceConfig;
  desktop: DeviceConfig;
};

export const FormatDetector: {
  supportsFormat(format: string): Promise<boolean>;
  getBestFormat(preferredFormats?: string[]): Promise<string>;
};

export function generateResponsiveUrls(
  image: any,
  options?: ImageOptions
): { mobile: string; tablet: string; desktop: string };

export function getOptimizedImageUrl(
  image: any,
  options?: ImageOptions
): string;

export function generatePictureElement(
  image: any,
  options?: {
    sizes?: string[];
    alt?: string;
    className?: string;
    loading?: 'lazy' | 'eager';
  }
): Promise<PictureElement | null>;

export function getLQIP(
  image: any,
  options?: LQIPOptions
): string;

export function preloadImages(
  images: any[],
  options?: PreloadOptions
): Promise<void>;

export function createImageObserver(
  callback: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void,
  options?: ObserverOptions
): IntersectionObserver & {
  getMetrics?: () => [Element, number][];
  clearMetrics?: () => void;
};

export function generateSrcSet(
  image: any,
  options?: {
    sizes?: number[];
    densities?: number[];
    aspectRatio?: number;
    format?: string;
  }
): string;

export function clearImageCache(): void;

export function getCacheStats(): ImageCacheStats;

export function optimizeCache(): ImageCacheStats;

export function getPerformanceMetrics(): PerformanceMetrics;

const imageOptimizer = {
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
  FormatDetector
};

export default imageOptimizer;