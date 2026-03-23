// components/ProductCard.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../lib/client";
import { Heart, ShoppingCart, Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    _id,
    name,
    slug,
    price,
    discount,
    image,
    category
  } = product || {};

  const hasDiscount = discount && discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - (discount / 100)) : price;
  const firstImage = image && image[0] ? image[0] : null;

  const imageUrl = firstImage?.asset
    ? urlFor(firstImage).width(600).url()
    : '/asset/placeholder-image.jpg';

  const productSlug = slug?.current || _id;
  const categorySlug = category?.slug?.current || 'products';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      {/* % OFF Badge - Centered Red Badge */}
      {hasDiscount && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: '#ef4444',
          color: 'white',
          fontSize: '11px',
          fontWeight: '700',
          borderRadius: '999px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '22px',
          lineHeight: '1',
          textAlign: 'center'
        }}>
          {discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: isHovered ? 'white' : 'transparent',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0
        }}
        aria-label="Add to wishlist"
      >
        <Heart size={18} style={{ color: isHovered ? '#ef4444' : 'white', fill: isHovered ? 'none' : 'none' }} />
      </button>

      {/* Quick View Overlay */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
          transition: 'opacity 0.2s ease'
        }}>
          <Link
            href={`/product/${productSlug}`}
            style={{
              backgroundColor: 'white',
              color: '#1f2937',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Eye size={16} /> Quick View
          </Link>
        </div>
      )}

      {/* Product Image */}
      <Link href={`/product/${productSlug}`} style={{ textDecoration: 'none' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '120%',
          backgroundColor: imageLoaded ? 'transparent' : '#f3f4f6',
          overflow: 'hidden'
        }}>
          <Image
            src={imageUrl}
            alt={name || 'Product Image'}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)'
            }}
            onLoadingComplete={() => setImageLoaded(true)}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div style={{
        padding: '16px'
      }}>
        {/* Category */}
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '6px',
          fontWeight: '600'
        }}>
          {category?.name || categorySlug}
        </div>

        {/* Product Name */}
        <Link
          href={`/product/${productSlug}`}
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1f2937',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '8px',
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {name}
        </Link>

        {/* Price */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {hasDiscount ? (
            <>
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ef4444'
              }}>
                ${discountedPrice.toFixed(2)}
              </span>
              <span style={{
                fontSize: '14px',
                color: '#9ca3af',
                textDecoration: 'line-through'
              }}>
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              ${price?.toFixed(2) || '0.00'}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Shows on Hover */}
        <div style={{
          marginTop: '12px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.2s ease',
          pointerEvents: isHovered ? 'auto' : 'none'
        }}>
          <button
            style={{
              width: '100%',
              backgroundColor: '#1f2937',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1f2937';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
