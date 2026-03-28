// components/Product.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../lib/client';
import { useLazyLoading, useImagePreloader } from '../hooks/usePerformance';
import { ProductCardSkeleton } from './LoadingSkeletons';
import { WishlistButton } from './WishlistSystem';

const Product = ({ product: { image, name, slug, price, discount, _id }, isLoading = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [ref, isIntersecting] = useLazyLoading(0.1);

  // Show skeleton while loading
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  const hasDiscount = discount && discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - (discount / 100)) : price;
  const firstImage = image && image[0] ? image[0] : null;

  // Use urlFor to get a higher quality image URL for better visibility
  const imageUrl = firstImage?.asset
    ? urlFor(firstImage).width(800).url()
    : '/asset/placeholder-image.jpg';

  // Preload image
  const { isLoaded: imageIsLoaded, hasError: imageHasError } = useImagePreloader(imageUrl);

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Quick view for product:', name);
    window.open(`/product/${slug?.current}`, '_blank');
  };

  return (
    <div ref={ref} className={`product-card ${!isIntersecting ? 'loading-pulse' : ''}`}>
      <Link href={`/product/${slug?.current}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-content-wrapper">

          {/* Discount Badge - Top Right Corner */}
          {hasDiscount && (
            <div 
              className="sale-badge" 
              role="status" 
              aria-label={`${discount} percent discount`}
            >
              {discount}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <div className="wishlist-button-container">
            <WishlistButton product={{ _id, name, slug, price, discount, image }} size="medium" />
          </div>

          {/* Quick View Overlay */}
          <div className="quick-view-overlay">
            <button
              className="quick-view-btn"
              onClick={handleQuickView}
              type="button"
              aria-label={`Quick view ${name}`}
            >
              Quick View
            </button>
          </div>

          {/* Image Container */}
          <div 
            className="product-image-container"
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: imageLoaded ? 'transparent' : '#f9f9f9',
              borderRadius: '12px'
            }}
          >
            {/* Loading Skeleton */}
            {(!imageLoaded || !isIntersecting) && (
              <div className="product-skeleton skeleton-shimmer" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '12px'
              }} />
            )}

            {/* Product Image with Lazy Loading */}
            {isIntersecting && (
              <Image
                src={imageUrl}
                alt={name || 'Product Image'}
                fill
                sizes="(max-width: 768px) 100vw, 260px"
                className="product-image"
                priority={false}
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.error('Product card image load failed for:', name);
                  e.target.src = '/asset/placeholder-image.jpg';
                  setImageLoaded(true);
                }}
              />
            )}
          </div>

          {/* Product Name */}
          {isIntersecting ? (
            <h2 className="product-card-name">{name}</h2>
          ) : (
            <div className="skeleton-line skeleton-shimmer" style={{ width: '80%', height: '20px', marginTop: '12px' }}></div>
          )}

          {/* Price Display - Horizontal layout with struck-through original price */}
          {isIntersecting ? (
            hasDiscount ? (
              <div 
                className="price-container" 
                role="group" 
                aria-label="Product pricing"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  gap: '10px',
                  marginTop: '8px',
                  marginBottom: '5px'
                }}
              >
                <span 
                  className="original-price" 
                  aria-label={`Original price: $${price?.toFixed(2)}`}
                  style={{
                    textDecoration: 'line-through',
                    color: '#888',
                    fontSize: '0.9em',
                    fontWeight: '400'
                  }}
                >
                  ${price?.toFixed(2)}
                </span>
                <span 
                  className="discounted-price" 
                  aria-label={`Sale price: $${discountedPrice?.toFixed(2)}`}
                  style={{
                    color: '#ff4757',
                    fontWeight: '700',
                    fontSize: '1.3em'
                  }}
                >
                  ${discountedPrice?.toFixed(2)}
                </span>
              </div>
            ) : (
              <p 
                className="price" 
                aria-label={`Price: $${price?.toFixed(2)}`}
                style={{
                  fontWeight: '700',
                  fontSize: '1.2em',
                  color: '#333',
                  marginTop: '8px',
                  marginBottom: '5px',
                  textAlign: 'center'
                }}
              >
                ${price?.toFixed(2)}
              </p>
            )
          ) : (
            <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', height: '16px', marginTop: '8px' }}></div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Product;
