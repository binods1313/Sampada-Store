// components/Cart.jsx - Clean cart drawer (no payment widgets)
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import Image from 'next/image';
import { useCartContext } from '../context/CartContext';
import { urlFor } from '../lib/client';
import { useUIContext } from '../context/StateContext';

const Cart = () => {
  const cartRef = useRef();
  const { cartItems, totalPrice, removeFromCart, totalQuantities, updateCartItemQuantity, calculateItemPrice } = useCartContext();
  const { showCart, setShowCart } = useUIContext();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (showCart) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }
    return () => {
      document.body.classList.remove('cart-open');
    };
  }, [showCart]);

  // Helper function to handle item quantity updates
  const toggleCartItemQuantity = (cartUniqueId, action) => {
    const item = cartItems.find(item => item.cartUniqueId === cartUniqueId);
    if (!item) return;

    let newQuantity = action === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    // Determine available stock for the item in the cart
    const availableStock = item.variantStock !== undefined ? item.variantStock : (item.inventory || 0);

    if (newQuantity > availableStock) {
      // Toast is handled in context
      newQuantity = availableStock; // Cap quantity at available stock
    }

    if (newQuantity !== item.quantity) { // Only update if quantity actually changes
      updateCartItemQuantity(cartUniqueId, newQuantity);
    }
  };

  const closeCart = () => {
    setShowCart(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${showCart ? 'active' : ''}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${showCart ? 'open' : ''}`}>
        {/* Cart Header with Close Button */}
        <div className="cart-drawer-header">
          <h2>
            Your Cart
            <span className="cart-count-badge">({totalQuantities} items)</span>
          </h2>
          <button
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Empty Cart Message */}
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Cart Items List */}
        <div className="product-container">
          {cartItems.length >= 1 && cartItems.map((item) => {
            // Determine which image to display for the cart item
            const displayImageUrl = item.variantImage && item.variantImage.asset
              ? urlFor(item.variantImage).width(300).url()
              : (item.baseImage && item.baseImage[0] && item.baseImage[0].asset
                ? urlFor(item.baseImage[0]).width(300).url()
                : (item.image && item.image[0] && item.image[0].asset // Fallback for old schema products
                  ? urlFor(item.image[0]).width(300).url()
                  : 'data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27><rect width=%2780%27 height=%2780%27 fill=%238B1A1A%27/><text x=%2750%25%27 y=%2755%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%23F5E0C3%27 font-family=%27serif%27 font-size=%2740%27 font-weight=%27bold%27>स</text></svg>'
                )
              );

            // Calculate the display price (with discount if applicable)
            const displayPrice = calculateItemPrice(item);

            // Determine original price for strikethrough display in cart
            // Use variant price if available, else base product price, else legacy price
            const originalPrice = item.variantPrice || item.basePrice || item.price;

            // Determine if there's a discount for display
            const hasDiscount = (item.variantDiscount !== undefined && item.variantDiscount > 0) || (item.baseDiscount !== undefined && item.baseDiscount > 0) || (item.discount !== undefined && item.discount > 0);

            return (
              <div className="product" key={item.cartUniqueId}> {/* Use cartUniqueId as key */}
                {/* Item Image Container with Fixed Aspect Ratio */}
                <div className="cart-product-image-container">
                  <Image
                    src={displayImageUrl}
                    alt={item.name || 'Cart Item Image'}
                    className="cart-product-image"
                    width={120}
                    height={160}
                    style={{
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                    priority={false}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChECCwkICRAFBAcQEAwABgcBBANTBQcUDgcJBQ0IEhMKFBcPGRESFBIFDhcWGBwYFBgRGA=="
                  />
                </div>

                {/* Item Description and Controls */}
                <div className="item-desc">
                  <div className="flex top">
                    <div className="product-info">
                      <h5 className="product-name">{item.name}</h5>
                      {/* Display Variant Info if available */}
                      {(item.colorName || item.size) && (
                        <p className="variant-info">
                          {item.colorName ? `Color: ${item.colorName}` : ''}
                          {item.colorName && item.size ? ' | ' : ''}
                          {item.size ? `Size: ${item.size}` : ''}
                        </p>
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
                    {/* Quantity Controls - Clean version with no rogue icons */}
                    <div className="cart-qty-control">
                      <button
                        className="cart-qty-btn minus"
                        onClick={() => toggleCartItemQuantity(item.cartUniqueId, 'dec')}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn plus"
                        onClick={() => toggleCartItemQuantity(item.cartUniqueId, 'inc')}
                      >
                        +
                      </button>
                    </div>
                    {/* Remove Button - Separate from quantity controls */}
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.cartUniqueId)}
                      aria-label="Remove item"
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Bottom Section (Subtotal and Checkout Button ONLY) */}
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            {/* Subtotal Display */}
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice.toFixed(2)}</h3>
            </div>

            <p className="cart-tax-note">
              Taxes and shipping calculated at checkout
            </p>

            <div className="btn-container">
              {/* Proceed to Checkout Button - Sampada Style */}
              <Link href="/checkout" style={{ textDecoration: 'none', width: '100%' }}>
                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={() => setShowCart(false)}
                >
                  Proceed to Checkout →
                </button>
              </Link>

              {/* Continue Shopping Button - Sampada Style */}
              <button
                type="button"
                className="cart-continue-btn"
                onClick={closeCart}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
