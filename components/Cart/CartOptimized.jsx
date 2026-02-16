// components/Cart/CartOptimized.jsx
// OPTIMIZED VERSION with Quick Wins patterns applied

import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useCartContext } from '../../context/CartContext';
import { useUIContext } from '../../context/StateContext';
import getStripe from '../../lib/getStripe';
import { urlFor } from '../../lib/client';
import CartItem from './CartItem';
import GooglePayButton from '../GooglePayButton';
import { CART_CONFIG, TOAST_MESSAGES } from './config';

// OPTIMIZATION 1: Memoize EmptyCart component
const EmptyCart = memo(({ onContinueShopping }) => (
  <div className="empty-cart">
    <AiOutlineShopping size={150} />
    <h3>Your shopping bag is empty</h3>
    <Link href="/">
      <button
        type="button"
        onClick={onContinueShopping}
        className="btn"
      >
        Continue Shopping
      </button>
    </Link>
  </div>
));

EmptyCart.displayName = 'EmptyCart';

// OPTIMIZATION 2: Memoize CartHeader component
const CartHeader = memo(({ totalQuantities, onClose }) => (
  <button
    type="button"
    className="cart-heading"
    onClick={onClose}
  >
    <AiOutlineLeft />
    <span className="heading">Your Cart</span>
    <span className="cart-num-items">({totalQuantities} items)</span>
  </button>
));

CartHeader.displayName = 'CartHeader';

// OPTIMIZATION 3: Memoize CartTotal component
const CartTotal = memo(({ totalPrice }) => (
  <div className="total">
    <h3>Subtotal:</h3>
    <h3>${totalPrice.toFixed(2)}</h3>
  </div>
));

CartTotal.displayName = 'CartTotal';

// Main Cart component
const Cart = () => {
  const cartRef = useRef();
  const { data: session } = useSession();
  const { 
    cartItems, 
    totalPrice, 
    removeFromCart, 
    totalQuantities, 
    updateCartItemQuantity, 
    calculateItemPrice 
  } = useCartContext();
  const { setShowCart } = useUIContext();

  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);

  // OPTIMIZATION 4: Memoize cart state checks
  const hasItems = useMemo(() => cartItems.length >= 1, [cartItems.length]);
  const isEmpty = useMemo(() => cartItems.length < 1, [cartItems.length]);

  // OPTIMIZATION 5: useCallback for close handler
  const handleClose = useCallback(() => {
    setShowCart(false);
  }, [setShowCart]);

  // OPTIMIZATION 6: useCallback for quantity change handler
  const handleQuantityChange = useCallback((cartUniqueId, action) => {
    const item = cartItems.find(item => item.cartUniqueId === cartUniqueId);
    if (!item) return;

    let newQuantity = action === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    const availableStock = item.variantStock !== undefined ? item.variantStock : (item.inventory || 0);

    if (newQuantity > availableStock) {
      toast.error(TOAST_MESSAGES.stockLimit(availableStock));
      newQuantity = availableStock;
    }

    if (newQuantity !== item.quantity) {
      updateCartItemQuantity(cartUniqueId, newQuantity);
    }
  }, [cartItems, updateCartItemQuantity]);

  // OPTIMIZATION 7: Memoize line items preparation
  const prepareLineItems = useCallback(() => {
    return cartItems.map(item => {
      let imageUrl = null;
      if (item.variantImage && item.variantImage.asset) {
        imageUrl = urlFor(item.variantImage).width(400).url();
      } else if (item.baseImage && item.baseImage[0] && item.baseImage[0].asset) {
        imageUrl = urlFor(item.baseImage[0]).width(400).url();
      } else if (item.image && item.image[0] && item.image[0].asset) {
        imageUrl = urlFor(item.image[0]).width(400).url();
      } else {
        imageUrl = CART_CONFIG.placeholderImage;
      }

      const actualPrice = calculateItemPrice(item);
      let itemName = item.name;
      if (item.colorName || item.size) {
        itemName += ` (${item.colorName || ''}${item.colorName && item.size ? ' / ' : ''}${item.size || ''})`;
      }

      return {
        price_data: {
          currency: CART_CONFIG.currency,
          unit_amount: Math.round(actualPrice * 100),
          product_data: {
            name: itemName,
            images: imageUrl ? [imageUrl] : [],
          },
        },
        quantity: item.quantity,
      };
    });
  }, [cartItems, calculateItemPrice]);

  // OPTIMIZATION 8: useCallback for Stripe checkout
  const handleStripeCheckout = useCallback(async () => {
    if (isEmpty) {
      toast.error(TOAST_MESSAGES.emptyCart);
      return;
    }

    const loadingToast = toast.loading(TOAST_MESSAGES.preparingCheckout);

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error(TOAST_MESSAGES.stripeError);
      }

      if (!stripe.redirectToCheckout || typeof stripe.redirectToCheckout !== 'function') {
        console.error('Stripe object is missing redirectToCheckout method:', stripe);
        throw new Error(TOAST_MESSAGES.stripeNotLoaded);
      }

      const lineItems = prepareLineItems();

      const response = await fetch(CART_CONFIG.stripeApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: lineItems,
          customerEmail: session?.user?.email || null,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/?canceled=true`
        }),
      });

      if (!response.ok) {
        let errorMessage = `Checkout failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            console.error('Failed to parse error response:', textError);
          }
        }
        throw new Error(errorMessage);
      }

      const sessionData = await response.json();

      if (!sessionData || !sessionData.id) {
        throw new Error(TOAST_MESSAGES.invalidSession);
      }

      toast.dismiss(loadingToast);
      toast.success(TOAST_MESSAGES.redirecting);

      const result = await stripe.redirectToCheckout({
        sessionId: sessionData.id
      });

      if (result && result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || TOAST_MESSAGES.checkoutError);
    }
  }, [isEmpty, prepareLineItems, session]);

  // Check Google Pay availability
  useEffect(() => {
    const checkGooglePay = async () => {
      if (totalPrice <= 0) {
        setIsGooglePayAvailable(false);
        return;
      }

      try {
        const stripe = await (await import('@stripe/stripe-js')).loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        );
        
        if (!stripe) {
          console.error('Could not load Stripe for Google Pay check');
          return;
        }

        const paymentRequest = stripe.paymentRequest({
          country: CART_CONFIG.country,
          currency: CART_CONFIG.currency,
          total: {
            label: 'Total',
            amount: Math.round(totalPrice * 100),
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        const result = await paymentRequest.canMakePayment();
        const googlePayAvailable = result ? 
          (result.googlePay || result.applePay || result.methodName === 'google.com/pay') : 
          false;

        setIsGooglePayAvailable(googlePayAvailable);
      } catch (error) {
        console.error('Google Pay check error:', error);
        setIsGooglePayAvailable(false);
      }
    };

    checkGooglePay();
  }, [totalPrice]);

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <CartHeader totalQuantities={totalQuantities} onClose={handleClose} />

        {isEmpty && <EmptyCart onContinueShopping={handleClose} />}

        {hasItems && (
          <>
            <div className="product-container">
              {cartItems.map((item) => (
                <CartItem
                  key={item.cartUniqueId}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeFromCart}
                  calculateItemPrice={calculateItemPrice}
                />
              ))}
            </div>

            <div className="cart-bottom">
              <CartTotal totalPrice={totalPrice} />
              <div className="btn-container">
                <button
                  type="button"
                  className="btn"
                  onClick={handleStripeCheckout}
                >
                  Pay with Stripe
                </button>

                {isGooglePayAvailable && (
                  <GooglePayButton
                    cartItems={cartItems}
                    totalPrice={totalPrice}
                    userEmail={session?.user?.email}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        .cart-product-image-container {
          width: 120px;
          height: 160px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-product-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
        }

        .product {
          display: flex;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #ebebeb;
          align-items: flex-start;
        }

        .item-desc {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 160px;
        }

        .flex.top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .flex.bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          margin: 0 0 5px 0;
          font-size: 12px;
          font-weight: 600;
          color: #333;
          line-height: 1.2;
        }

        .variant-info {
          margin: 0;
          font-size: 12px;
          color: #666;
          line-height: 1.3;
        }

        .price-info {
          text-align: right;
          margin-left: 10px;
        }

        .price-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .original-price {
          margin: 0;
          font-size: 12px;
          color: #888;
          text-decoration: line-through;
          font-weight: 400;
        }

        .discounted-price {
          margin: 0;
          font-size: 16px;
          color: #f02d34;
          font-weight: 600;
        }

        .regular-price {
          margin: 0;
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }

        .quantity-desc {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .quantity-desc span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #ddd;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 18px;
        }

        .quantity-desc .minus {
          background: #ffebee;
          border-radius: 4px;
          color: #d32f2f;
          font-weight: bold;
          border-color: #f8bbd9;
        }

        .quantity-desc .minus:hover {
          background: #ffcdd2;
          border-color: #e57373;
          color: #b71c1c;
        }

        .quantity-desc .plus {
          background: #e8f5e8;
          border-radius: 4px;
          color: #2e7d32;
          font-weight: bold;
          border-color: #a5d6a7;
        }

        .quantity-desc .plus:hover {
          background: #c8e6c9;
          border-color: #66bb6a;
          color: #1b5e20;
        }

        .quantity-desc .num {
          background: white;
          font-weight: 600;
          cursor: default;
        }

        .remove-item {
          background: none;
          border: none;
          color: #f02d34;
          font-size: 24px;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .remove-item:hover {
          color: #d02030;
        }

        .btn-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        @media (max-width: 480px) {
          .cart-product-image-container {
            width: 100px;
            height: 130px;
          }

          .product {
            gap: 10px;
            padding: 10px 0;
          }

          .product-name {
            font-size: 11px;
          }

          .variant-info {
            font-size: 11px;
          }

          .regular-price,
          .discounted-price {
            font-size: 14px;
          }

          .original-price {
            font-size: 11px;
          }

          .item-desc {
            min-height: 130px;
          }

          .quantity-desc span {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(Cart);
