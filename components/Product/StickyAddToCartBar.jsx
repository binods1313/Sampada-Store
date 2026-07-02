// components/Product/StickyAddToCartBar.jsx
// Sticky bottom bar for mobile - shows when scrolled past price
import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import stickyStyles from '../../styles/stickyAddToCartBar.module.css';

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
      className={`${stickyStyles.bar} ${isVisible ? stickyStyles.visible : ''}`}
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
        className={stickyStyles.button}
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
