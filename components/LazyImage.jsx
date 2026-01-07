// components/LazyImage.jsx
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/EnhancedComponents.module.css';

const LazyImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  placeholder = '/asset/placeholder-image.jpg',
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // If we're not intersecting yet, show a skeleton
  if (!isIntersecting) {
    return (
      <div 
        ref={imgRef}
        className={`${styles.lazyImageSkeleton} ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div ref={imgRef} className={`${styles.lazyImageContainer} ${className}`}>
      {isLoading && !hasError && (
        <div className={styles.imagePlaceholder} style={{ width, height }}>
          <div className={styles.skeletonLoader} />
        </div>
      )}
      
      {hasError ? (
        <div className={styles.imageError} style={{ width, height }}>
          <span>Image not available</span>
        </div>
      ) : (
        <Image
          src={src || placeholder}
          alt={alt}
          width={width}
          height={height}
          onLoadingComplete={handleLoad}
          onError={handleError}
          style={{ 
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;