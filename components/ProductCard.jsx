// components/ProductCard.jsx
// Sampada Homepage Homepage Design - With Urgency & Quick-Add
// Applied: emil-design-eng, ui-ux-pro-max, vercel-react-best-practices

"use client";

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../lib/client';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import { useTextHeight } from '../hooks/usePretext';
import { useCurrency } from '../hooks/useCurrency';
import { formatCurrency } from '../utils/currency';

const ProductCard = memo(function ProductCard({ product, displayCurrency = 'USD' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { onAdd } = useCartContext();

  const {
    _id,
    name,
    slug,
    price,
    discount,
    image,
    category,
    inventory,
    soldCount
  } = product || {};

  const hasDiscount = discount && discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - (discount / 100)) : price;

  // Currency conversion hooks
  const { formattedAmount: formattedBasePrice, loading: basePriceLoading } = useCurrency(
    price,
    'USD',
    displayCurrency
  );
  
  const { formattedAmount: formattedDiscountedPrice, loading: discountedPriceLoading } = useCurrency(
    discountedPrice,
    'USD',
    displayCurrency
  );

  // Pre-calculate product name height to prevent layout shift
  const { height: nameHeight, loaded: nameMeasured } = useTextHeight(
    name || '',
    {
      font: '500 14px Inter, system-ui, sans-serif',
      maxWidth: 280, // Adjust based on your card width
      lineHeight: 21,
    }
  );

  const firstImage = image && image[0] ? image[0] : null;
  const isLowStock = inventory && inventory < 5;
  const hasSoldCount = soldCount && soldCount > 0;

  // Get image URL - prioritize direct URL field (for demo/external images)
  let imageUrl = '/asset/placeholder-image.jpg';
  
  if (firstImage?.url) {
    // Use direct URL if available (Unsplash, external, etc.)
    imageUrl = firstImage.url;
  } else if (firstImage?.asset) {
    // Try Sanity URL
    try {
      imageUrl = urlFor(firstImage).width(600).url();
    } catch (error) {
      // Use placeholder for invalid image references
      console.warn('Invalid Sanity image reference, using placeholder:', firstImage?.asset?._ref);
    }
  }

  const productSlug = slug?.current || _id;

  const handleWishlistClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(prev => !prev);
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd(product, 1);
    
    // Track add to cart with GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: product.price || 0,
        items: [{
          item_id: product._id,
          item_name: product.name,
          item_category: product.category,
          price: product.price || 0,
          quantity: 1
        }]
      });
    }
  }, [onAdd, product]);

  // Handle image load error
  const handleImageError = useCallback((e) => {
    console.warn('Product image failed to load, using placeholder:', imageUrl);
    e.target.src = '/asset/placeholder-image.jpg';
  }, [imageUrl]);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-white)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        willChange: 'transform, box-shadow',
        cursor: 'pointer'
      }}
      aria-label={`Product: ${name}`}
    >
      {/* % OFF Badge - Top Right Corner, ALWAYS VISIBLE */}
      {hasDiscount && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 20,
          backgroundColor: '#ef4444',
          color: 'white',
          fontSize: '10px',
          fontWeight: '700',
          borderRadius: '12px',
          padding: '4px 8px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
          letterSpacing: '0.02em'
        }} aria-label={`${discount}% off`}>
          {discount}% OFF
        </div>
      )}

      {/* Heart Icon - Top Left Corner, hidden by default, shown on hover */}
      <button
        onClick={handleWishlistClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleWishlistClick(e);
          }
        }}
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 20,
          backgroundColor: 'var(--color-bg-white)',
          border: '1px solid #e5e7eb',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.95)',
          pointerEvents: isHovered ? 'auto' : 'none'
        }}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = '#fef2f2';
          e.currentTarget.style.borderColor = '#ef4444';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = 'var(--color-bg-white)';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid #C9A84C';
          e.currentTarget.style.outlineOffset = '2px';
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.pointerEvents = 'auto';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = 'var(--color-bg-white)';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        <Heart
          size={14}
          style={{
            color: isWishlisted ? '#ef4444' : '#6b7280',
            fill: isWishlisted ? '#ef4444' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </button>

      {/* Quick View Button - Center Overlay, hidden by default, shown on hover */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: isHovered ? 'translate(-50%, -50%)' : 'translate(-50%, -45%)',
        zIndex: 20,
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isHovered ? 'auto' : 'none'
      }}>
        <Link
          href={`/product/${productSlug}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            letterSpacing: '0.01em',
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #C9A84C';
            e.currentTarget.style.outlineOffset = '2px';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Quick View
        </Link>
      </div>

      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '125%',
        backgroundColor: imageLoaded ? 'transparent' : '#f3f4f6',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        margin: '12px 12px 0 12px'
      }}>
        <Image
          src={imageUrl}
          alt={name || 'Product image'}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            willChange: 'transform'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div style={{ padding: '12px', position: 'relative' }}>
        {/* Product Name - Zero layout shift with Pretext height */}
        <Link
          href={`/product/${productSlug}`}
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '8px',
            lineHeight: '1.5',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            // Use Pretext-calculated height to prevent layout shift
            minHeight: nameMeasured ? `${nameHeight}px` : '42px',
            transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.color = '#C9A84C';
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.textDecorationColor = '#C9A84C';
            e.currentTarget.style.textUnderlineOffset = '3px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {name}
        </Link>

        {/* Social Proof - "X sold this week" */}
        {hasSoldCount && (
          <p style={{
            fontSize: '11px',
            color: '#6B7280',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#22c55e', fontWeight: '600' }} aria-hidden="true">●</span>
            {soldCount} sold this week
          </p>
        )}

        {/* Low Stock Warning */}
        {isLowStock && (
          <p style={{
            fontSize: '11px',
            color: '#dc2626',
            fontWeight: '600',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#dc2626', fontWeight: '600' }} aria-hidden="true">●</span>
            Only {inventory} left in stock!
          </p>
        )}

        {/* Price - Original above (struck-through), discounted below (red, bold, centered) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          marginTop: '8px'
        }}>
          {hasDiscount ? (
            <>
              <span style={{
                fontSize: '13px',
                color: '#9ca3af',
                textDecoration: 'line-through',
                textDecorationColor: '#9ca3af',
                fontWeight: '400'
              }}>
                {basePriceLoading ? '$' + price.toFixed(2) : formattedBasePrice}
              </span>
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#dc2626',
                letterSpacing: '-0.01em'
              }}>
                {discountedPriceLoading ? '$' + discountedPrice.toFixed(2) : formattedDiscountedPrice}
              </span>
              {/* Show original currency if different from display currency */}
              {displayCurrency !== 'USD' && (
                <span style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                  fontWeight: '400'
                }}>
                  ${discountedPrice.toFixed(2)} USD
                </span>
              )}
            </>
          ) : (
            <>
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em'
              }}>
                {basePriceLoading ? '$' + (price?.toFixed(2) || '0.00') : formattedBasePrice}
              </span>
              {/* Show original currency if different from display currency */}
              {displayCurrency !== 'USD' && (
                <span style={{
                  fontSize: '10px',
                  color: '#9ca3af',
                  fontWeight: '400'
                }}>
                  ${price?.toFixed(2) || '0.00'} USD
                </span>
              )}
            </>
          )}
        </div>

        {/* Quick-Add Button - Slides up on hover, also always visible on focus */}
        <button
          onClick={handleAddToCart}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAddToCart(e);
            }
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(90deg, #8B0000 0%, #6B0000 100%)`,
            color: '#F5F0E8',
            border: 'none',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderTop: `1px solid rgba(201, 162, 39, 0.3)`,
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(90deg, #6B0000 0%, #8B0000 100%)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(90deg, #8B0000 0%, #6B0000 100%)`;
          }}
          onFocus={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.outline = '2px solid #C9A84C';
            e.currentTarget.style.outlineOffset = '-2px';
          }}
          onBlur={(e) => {
            if (!isHovered) {
              e.currentTarget.style.transform = 'translateY(100%)';
              e.currentTarget.style.opacity = '0';
            }
            e.currentTarget.style.outline = 'none';
          }}
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </article>
  );
});

export default ProductCard;
