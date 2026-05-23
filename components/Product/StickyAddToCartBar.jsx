// components/Product/StickyAddToCartBar.jsx
// Sticky bottom bar for mobile - shows when scrolled past price
import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const StickyAddToCartBar = ({ 
  productName, 
  displayPrice, 
  currentDiscount, 
  currentPrice,
  onAddToCart, 
  isOutOfStock 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 400px (roughly past the price section)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div
      className={`sticky-add-to-cart-bar ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '2px solid #C9A84C',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 999,
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Product Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#1a1a1a',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: '4px'
        }}>
          {productName}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: '800',
            color: '#8B1A1A'
          }}>
            ${displayPrice.toFixed(2)}
          </span>
          {currentDiscount > 0 && (
            <span style={{
              fontSize: '13px',
              color: '#999',
              textDecoration: 'line-through'
            }}>
              ${currentPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button
        onClick={onAddToCart}
        disabled={isOutOfStock}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: isOutOfStock ? '#ccc' : 'linear-gradient(135deg, #8B1A1A 0%, #A52A2A 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '700',
          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          boxShadow: isOutOfStock ? 'none' : '0 4px 12px rgba(139, 26, 26, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          if (!isOutOfStock) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 26, 26, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOutOfStock) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 26, 26, 0.3)';
          }
        }}
      >
        <ShoppingBag size={18} />
        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
    </div>
  );
};

export default StickyAddToCartBar;
