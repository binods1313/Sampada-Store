// components/Cart/CartItem.jsx
// OPTIMIZED: Memoized cart item component

import React, { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { urlFor } from '../../lib/client';
import { CART_CONFIG } from './config';

const CartItem = memo(({ 
  item, 
  onQuantityChange, 
  onRemove, 
  calculateItemPrice 
}) => {
  // OPTIMIZATION 1: Memoize image URL calculation
  const displayImageUrl = useMemo(() => {
    if (item.variantImage && item.variantImage.asset) {
      return urlFor(item.variantImage).width(CART_CONFIG.imageWidth).url();
    }
    if (item.baseImage && item.baseImage[0] && item.baseImage[0].asset) {
      return urlFor(item.baseImage[0]).width(CART_CONFIG.imageWidth).url();
    }
    if (item.image && item.image[0] && item.image[0].asset) {
      return urlFor(item.image[0]).width(CART_CONFIG.imageWidth).url();
    }
    return CART_CONFIG.placeholderImage;
  }, [item.variantImage, item.baseImage, item.image]);

  // OPTIMIZATION 2: Memoize price calculations
  const displayPrice = useMemo(() => 
    calculateItemPrice(item),
    [item, calculateItemPrice]
  );

  const originalPrice = useMemo(() => 
    item.variantPrice || item.basePrice || item.price,
    [item.variantPrice, item.basePrice, item.price]
  );

  const hasDiscount = useMemo(() => 
    (item.variantDiscount !== undefined && item.variantDiscount > 0) || 
    (item.baseDiscount !== undefined && item.baseDiscount > 0) || 
    (item.discount !== undefined && item.discount > 0),
    [item.variantDiscount, item.baseDiscount, item.discount]
  );

  // OPTIMIZATION 3: Memoize variant info display
  const variantInfo = useMemo(() => {
    if (!item.colorName && !item.size) return null;
    
    const parts = [];
    if (item.colorName) parts.push(`Color: ${item.colorName}`);
    if (item.size) parts.push(`Size: ${item.size}`);
    return parts.join(' | ');
  }, [item.colorName, item.size]);

  // OPTIMIZATION 4: useCallback for event handlers
  const handleIncrement = useCallback(() => {
    onQuantityChange(item.cartUniqueId, 'inc');
  }, [item.cartUniqueId, onQuantityChange]);

  const handleDecrement = useCallback(() => {
    onQuantityChange(item.cartUniqueId, 'dec');
  }, [item.cartUniqueId, onQuantityChange]);

  const handleRemove = useCallback(() => {
    onRemove(item.cartUniqueId);
  }, [item.cartUniqueId, onRemove]);

  return (
    <div className="product">
      {/* Item Image Container */}
      <div className="cart-product-image-container">
        <Image
          src={displayImageUrl}
          alt={item.name || 'Cart Item Image'}
          className="cart-product-image"
          width={CART_CONFIG.cartImageWidth}
          height={CART_CONFIG.cartImageHeight}
          style={{ 
            objectFit: 'contain',
            borderRadius: '8px'
          }}
          priority={false}
          placeholder="blur"
          blurDataURL={CART_CONFIG.blurDataURL}
        />
      </div>

      {/* Item Description and Controls */}
      <div className="item-desc">
        <div className="flex top">
          <div className="product-info">
            <h5 className="product-name">{item.name}</h5>
            {variantInfo && (
              <p className="variant-info">{variantInfo}</p>
            )}
          </div>
          <div className="price-info">
            {hasDiscount ? (
              <div className="price-container">
                <h4 className="original-price">${originalPrice.toFixed(2)}</h4>
                <h4 className="discounted-price">${displayPrice.toFixed(2)}</h4>
              </div>
            ) : (
              <h4 className="regular-price">${displayPrice.toFixed(2)}</h4>
            )}
          </div>
        </div>
        
        <div className="flex bottom">
          <div>
            {/* Quantity Controls */}
            <p className="quantity-desc">
              <span className="minus" onClick={handleDecrement}>
                <AiOutlineMinus />
              </span>
              <span className="num">{item.quantity}</span>
              <span className="plus" onClick={handleIncrement}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          
          {/* Remove Button */}
          <button
            type="button"
            className="remove-item"
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from cart`}
          >
            <TiDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
