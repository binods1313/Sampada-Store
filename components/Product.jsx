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
    // Here you can implement quick view modal functionality
    console.log('Quick view for product:', name);
    // For now, we'll just navigate to the product page
    window.open(`/product/${slug?.current}`, '_blank');
  };
    
  return (
    <div ref={ref} className={`product-card ${!isIntersecting ? 'loading-pulse' : ''}`}>
      <Link href={`/product/${slug?.current}`}>
        <div className="product-content-wrapper"> 
          
          {/* Sale Badge */}             
          {hasDiscount && (               
            <div className="sale-badge">                 
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
              aria-label={`Quick view ${name}`}
            >
              Quick View
            </button>
          </div>

          {/* Image Container with Enhanced Loading State */}           
          <div className="product-image-container" style={{ 
              position: 'relative',
              width: '100%', 
              height: '240px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: imageLoaded ? 'transparent' : '#f9f9f9'
            }}>
            
            {/* Enhanced Loading Skeleton */}
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
                      
          {/* Product Name with Loading State */}           
          {isIntersecting ? (
            <h2 className="product-card-name">{name}</h2>
          ) : (
            <div className="skeleton-line skeleton-shimmer" style={{ width: '80%', height: '20px', marginTop: '12px' }}></div>
          )}
                      
          {/* Price Display with Loading State */}           
          {isIntersecting ? (
            hasDiscount ? (             
              <div className="price-container">               
                <p className="original-price">                 
                  ${price?.toFixed(2)}               
                </p>               
                <p className="discounted-price">                 
                  ${discountedPrice?.toFixed(2)}               
                </p>             
              </div>           
            ) : (             
              <p className="price">               
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