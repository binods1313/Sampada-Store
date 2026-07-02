// components/LoadingSkeletons.jsx
import React from 'react';

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="product-skeleton-image skeleton-shimmer"></div>
      <div className="product-skeleton-content">
        <div className="product-skeleton-title skeleton-shimmer"></div>
        <div className="product-skeleton-price skeleton-shimmer"></div>
        <div className="product-skeleton-button skeleton-shimmer"></div>
      </div>
    </div>
  );
};

// Products Grid Skeleton
export const ProductsGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="products-container">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Hero Banner Skeleton
export const HeroBannerSkeleton = () => {
  return (
    <div className="hero-banner-skeleton">
      <div className="hero-banner-skeleton-content">
        <div className="hero-banner-skeleton-text">
          <div className="skeleton-line skeleton-shimmer hero-text-line-1"></div>
          <div className="skeleton-line skeleton-shimmer hero-text-line-2"></div>
          <div className="skeleton-line skeleton-shimmer hero-text-line-3"></div>
          <div className="skeleton-line skeleton-shimmer hero-text-line-4"></div>
        </div>
        <div className="hero-banner-skeleton-image skeleton-shimmer"></div>
      </div>
    </div>
  );
};

// Filter Skeleton
export const FilterSkeleton = () => {
  return (
    <div className="filter-skeleton">
      <div className="filter-skeleton-search skeleton-shimmer"></div>
      <div className="filter-skeleton-controls">
        <div className="filter-skeleton-button skeleton-shimmer"></div>
        <div className="filter-skeleton-sort skeleton-shimmer"></div>
      </div>
    </div>
  );
};

// Page Loading Component
export const PageLoadingSkeleton = () => {
  return (
    <div className="page-loading-skeleton">
      <HeroBannerSkeleton />
      <div className="page-skeleton-heading skeleton-shimmer"></div>
      <FilterSkeleton />
      <ProductsGridSkeleton count={6} />
    </div>
  );
};

// Text Skeleton
export const TextSkeleton = ({ lines = 3, width = '100%' }) => {
  return (
    <div className="text-skeleton">
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`skeleton-line skeleton-shimmer text-skeleton-line-${index === lines - 1 ? 'last' : 'normal'}`}
        ></div>
      ))}
    </div>
  );
};

// Image Skeleton
export const ImageSkeleton = ({ width = '100%', height = '200px', className = '' }) => {
  return (
    <div 
      className={`image-skeleton skeleton-shimmer ${className}`}
    ></div>
  );
};

// Button Skeleton
export const ButtonSkeleton = ({ width = '120px', height = '40px' }) => {
  return (
    <div 
      className="button-skeleton skeleton-shimmer"
    ></div>
  );
};

export default {
  ProductCardSkeleton,
  ProductsGridSkeleton,
  HeroBannerSkeleton,
  FilterSkeleton,
  PageLoadingSkeleton,
  TextSkeleton,
  ImageSkeleton,
  ButtonSkeleton
};