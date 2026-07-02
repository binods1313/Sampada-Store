import { useState, useEffect, useRef } from 'react';

/**
 * Hook to determine if an element is in the viewport
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, isInView]
 */
export function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (!options.triggerOnce) {
        setIsInView(false);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.triggerOnce, options.rootMargin]);

  return [ref, isInView];
}
