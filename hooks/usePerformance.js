// hooks/usePerformance.js
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Lazy loading hook
export const useLazyLoading = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isIntersecting];
};

// Debounced search hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Loading state management
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
    if (loading) setError(null);
  }, []);

  const setErrorState = useCallback((errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    setLoading,
    setError: setErrorState,
    reset
  };
};

// Image preloader hook
export const useImagePreloader = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, hasError };
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    if (!items.length) return [];

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      offsetY: (startIndex + index) * itemHeight
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({});

  const measurePerformance = useCallback((name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      [name]: {
        duration: end - start,
        timestamp: new Date().toISOString()
      }
    }));

    return result;
  }, []);

  const measureAsyncPerformance = useCallback(async (name, asyncFn) => {
    const start = performance.now();
    const result = await asyncFn();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      [name]: {
        duration: end - start,
        timestamp: new Date().toISOString()
      }
    }));

    return result;
  }, []);

  return {
    metrics,
    measurePerformance,
    measureAsyncPerformance
  };
};

// Memory optimization hook
export const useMemoryOptimization = () => {
  const cache = useRef(new Map());

  const memoize = useCallback((key, computeFn) => {
    if (cache.current.has(key)) {
      return cache.current.get(key);
    }

    const result = computeFn();
    cache.current.set(key, result);
    return result;
  }, []);

  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  const getCacheSize = useCallback(() => {
    return cache.current.size;
  }, []);

  return {
    memoize,
    clearCache,
    getCacheSize
  };
};

const performanceHooks = {
  useLazyLoading,
  useDebounce,
  useLoadingState,
  useImagePreloader,
  useVirtualScrolling,
  usePerformanceMonitor,
  useMemoryOptimization
};

export default performanceHooks;