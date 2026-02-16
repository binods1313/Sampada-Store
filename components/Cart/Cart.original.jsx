// components/Cart.jsx
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useCartContext } from '../context/CartContext';
import { urlFor } from '../lib/client';
import { useUIContext } from '../context/StateContext';

// Import your Stripe utility function
import getStripe from '../lib/getStripe';
import GooglePayButton from './GooglePayButton';

const Cart = () => {
  const cartRef = useRef();
  const { data: session } = useSession();
  const { cartItems, totalPrice, removeFromCart, totalQuantities, updateCartItemQuantity, calculateItemPrice } = useCartContext();
  const { setShowCart } = useUIContext();

  // State for Google Pay availability
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);

  // Check Google Pay availability on component mount
  useEffect(() => {
    const checkGooglePay = async () => {
      console.log('Checking Google Pay availability, totalPrice:', totalPrice);

      // Load Stripe directly instead of using getStripe to avoid redirect method conflicts
      const stripe = await (await import('@stripe/stripe-js')).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        console.error('Could not load Stripe for Google Pay check');
        return;
      }

      const paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: Math.round(totalPrice * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await paymentRequest.canMakePayment();
      console.log('Google Pay canMakePayment result:', result);

      // Handle different response formats from canMakePayment
      // Google Pay may return null if not available or if served over HTTP instead of HTTPS
      let googlePayAvailable = false;
      if (result) {
        // Check for Google Pay specifically
        googlePayAvailable = result.googlePay || result.applePay || result.methodName === 'google.com/pay';
      }
      // Note: If result is null, googlePayAvailable remains false which is the correct behavior
      // Google Pay is only shown if it's actually available via canMakePayment

      console.log('Google Pay availability determined:', googlePayAvailable);
      setIsGooglePayAvailable(googlePayAvailable);
    };

    if (totalPrice > 0) {
      checkGooglePay();
    } else {
      setIsGooglePayAvailable(false); // Don't show if cart is empty
    }
  }, [totalPrice]);

  // Helper function to handle item quantity updates
  const toggleCartItemQuantity = (cartUniqueId, action) => {
    const item = cartItems.find(item => item.cartUniqueId === cartUniqueId);
    if (!item) return;

    let newQuantity = action === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    // Determine available stock for the item in the cart
    const availableStock = item.variantStock !== undefined ? item.variantStock : (item.inventory || 0);

    if (newQuantity > availableStock) {
        toast.error(`Only ${availableStock} of this item are in stock.`);
        newQuantity = availableStock; // Cap quantity at available stock
    }

    if (newQuantity !== item.quantity) { // Only update if quantity actually changes
        updateCartItemQuantity(cartUniqueId, newQuantity);
    }
  };

  // Enhanced handleStripeCheckout function with corrected Stripe validation
  const handleStripeCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const loadingToast = toast.loading('Preparing checkout...');

    try {
      // Get Stripe instance
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Could not initialize Stripe. Please check if the Stripe key is configured.');
      }

      // --- CORRECTED VALIDATION: Check for redirectToCheckout method ---
      console.log('Stripe object initialized:', stripe);
      
      // Proper validation - check if redirectToCheckout exists and is a function
      if (!stripe.redirectToCheckout || typeof stripe.redirectToCheckout !== 'function') {
          console.error('Stripe object is missing redirectToCheckout method:', stripe);
          throw new Error('Stripe.js not properly loaded - redirectToCheckout method unavailable.');
      }

      console.log('Stripe validation passed - redirectToCheckout method is available');

      // Prepare the items with properly formatted image URLs and calculated prices
      const lineItems = cartItems.map(item => {
        // Determine the image to send to Stripe
        let imageUrl = null;
        if (item.variantImage && item.variantImage.asset) { // Prefer variant image
          imageUrl = urlFor(item.variantImage).width(400).url();
        } else if (item.baseImage && item.baseImage[0] && item.baseImage[0].asset) { // Fallback to base product image (if stored as baseImage)
          imageUrl = urlFor(item.baseImage[0]).width(400).url();
        } else if (item.image && item.image[0] && item.image[0].asset) { // Fallback to original image (for old schema products)
          imageUrl = urlFor(item.image[0]).width(400).url();
        } else {
          imageUrl = '/asset/placeholder-image.jpg'; // Final fallback
        }

        // Calculate the actual price (considering discount)
        const actualPrice = calculateItemPrice(item);

        // Construct item name with variant details for Stripe description
        let itemName = item.name;
        if (item.colorName || item.size) {
            itemName += ` (${item.colorName || ''}${item.colorName && item.size ? ' / ' : ''}${item.size || ''})`;
        }

        return {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(actualPrice * 100), // Convert to cents
            product_data: {
              name: itemName,
              images: imageUrl ? [imageUrl] : [], // Ensure images is an array, even if empty
            },
          },
          quantity: item.quantity,
        };
      });

      console.log('Sending line items to API:', lineItems);

      // Call API with properly structured data and user email
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: lineItems,
          customerEmail: session?.user?.email || null, // Pass logged-in user's email
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/?canceled=true`
        }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `Checkout failed: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch (e) {
          try {
            const errorText = await response.text();
            console.error('API Error Text:', errorText);
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            console.error('Failed to parse error response:', textError);
          }
        }

        throw new Error(errorMessage);
      }

      const sessionData = await response.json();

      if (!sessionData || !sessionData.id) {
        throw new Error('Invalid session data received from server.');
      }

      console.log(`Redirecting to checkout: ${sessionData.id}`);
      
      // Dismiss the loading toast BEFORE attempting redirect
      toast.dismiss(loadingToast);
      toast.success('Redirecting to checkout...');

      // --- CORRECTED: Call redirectToCheckout with proper error handling ---
      console.log('Attempting Stripe redirect...');
      const result = await stripe.redirectToCheckout({
        sessionId: sessionData.id
      });

      console.log('stripe.redirectToCheckout returned:', result);

      // If redirectToCheckout returns with an error, handle it
      if (result && result.error) {
        console.error('Stripe redirect error:', result.error.message);
        throw new Error(result.error.message);
      }

      // If we reach here, the redirect should have happened but didn't
      // This is unusual but can happen with popup blockers or other browser restrictions
      console.warn('Redirect initiated but browser navigation may not have completed');
      
    } catch (error) {
      console.error('Checkout Error:', error);
      toast.dismiss(loadingToast); // Ensure loading toast is dismissed on error
      toast.error(error.message || 'An error occurred during checkout.');
    }
    // Removed the finally block since we're handling toast dismissal explicitly
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        {/* Cart Heading */}
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

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
                        : '/asset/placeholder-image.jpg'
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
                    <div>
                      {/* Quantity Controls */}
                      <p className="quantity-desc">
                        <span className="minus" onClick={() => toggleCartItemQuantity(item.cartUniqueId, 'dec')}>
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span className="plus" onClick={() => toggleCartItemQuantity(item.cartUniqueId, 'inc')}>
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    {/* Remove Button */}
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => removeFromCart(item.cartUniqueId)} // Use cartUniqueId
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Cart Bottom Section (Subtotal and Checkout Button) */}
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice.toFixed(2)}</h3>
            </div>
            <div className="btn-container">
              <button
                type="button"
                className="btn"
                onClick={handleStripeCheckout}
              >
                Pay with Stripe
              </button>

              {/* Google Pay button */}
              {isGooglePayAvailable && (
                <GooglePayButton
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  userEmail={session?.user?.email}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CSS Styles for proper image display */}
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
          font-size: 12px; /* Reduced from 14px to 12px */
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
          width: 40px; /* Increased from 36px to 40px */
          height: 40px; /* Increased from 36px to 40px */
          border: 1px solid #ddd;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 18px; /* Increased from 16px to 18px */
        }

        .quantity-desc .minus {
          background: #ffebee; /* Light red background */
          border-radius: 4px;
          color: #d32f2f; /* Red color for minus icon */
          font-weight: bold;
          border-color: #f8bbd9;
        }

        .quantity-desc .minus:hover {
          background: #ffcdd2; /* Darker red on hover */
          border-color: #e57373;
          color: #b71c1c;
        }

        .quantity-desc .plus {
          background: #e8f5e8; /* Light green background */
          border-radius: 4px;
          color: #2e7d32; /* Green color for plus icon */
          font-weight: bold;
          border-color: #a5d6a7;
        }

        .quantity-desc .plus:hover {
          background: #c8e6c9; /* Darker green on hover */
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

        /* Google Pay Button Styles */
        .btn-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .google-pay-button-container {
          width: 100%;
        }

        .google-pay-button {
          background-color: #000;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .google-pay-button:hover {
          opacity: 0.9;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }

        /* Responsive adjustments */
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
            font-size: 11px; /* Reduced for mobile as well */
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
            width: 36px; /* Slightly smaller on mobile */
            height: 36px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;