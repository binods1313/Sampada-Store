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
import { useCurrencyContext } from '../context/CurrencyContext';
import { useCurrency } from '../hooks/useCurrency';
import { formatCurrency } from '../utils/currency';
import CurrencySelector from './CurrencySelector';
import PaymentSelector, { autoSelectPaymentProcessor } from './PaymentSelector';
import VATValidator from './VATValidator';
import IFSCValidator from './IFSCValidator';
import AddressValidator from './AddressValidator';
import B2BCustomerDisplay from './B2BCustomerDisplay';
import { trackBeginCheckout } from '../lib/analytics';

// Import your Stripe utility function
import getStripe from '../lib/getStripe';
import GooglePayButton from './GooglePayButton';
import KlarnaPaymentButton from './KlarnaPaymentButton';

const Cart = () => {
  const cartRef = useRef();
  const { data: session } = useSession();
  const { cartItems, totalPrice, removeFromCart, totalQuantities, updateCartItemQuantity, calculateItemPrice } = useCartContext();
  const { setShowCart } = useUIContext();
  const { selectedCurrency } = useCurrencyContext();

  // Currency conversion for cart total
  const { formattedAmount: formattedTotalPrice, loading: currencyLoading } = useCurrency(
    totalPrice,
    'USD',
    selectedCurrency
  );

  // State for Google Pay availability
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);

  // State for selected payment processor (auto-selected based on currency)
  const [selectedPaymentProcessor, setSelectedPaymentProcessor] = useState(
    autoSelectPaymentProcessor(selectedCurrency)
  );

  // State for Razorpay checkout loading
  const [isRazorpayProcessing, setIsRazorpayProcessing] = useState(false);

  // Load Razorpay checkout script dynamically
  useEffect(() => {
    if (selectedPaymentProcessor === 'razorpay' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay checkout script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay checkout script');
        toast.error('Failed to load payment gateway. Please refresh the page.');
      };
      document.body.appendChild(script);
    }
  }, [selectedPaymentProcessor]);

  // Auto-switch payment processor when currency changes
  useEffect(() => {
    const autoSelected = autoSelectPaymentProcessor(selectedCurrency);
    setSelectedPaymentProcessor(autoSelected);
  }, [selectedCurrency]);

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
            currency: selectedCurrency.toLowerCase(),
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
          currency: selectedCurrency, // Pass selected currency
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

      // 🎯 GA4: Track begin_checkout event
      trackBeginCheckout(cartItems, totalPrice);

      // 📧 Mailchimp: Track abandoned cart (fire and forget)
      if (session?.user?.email) {
        try {
          fetch('/api/mailchimp/abandoned-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              cartItems: cartItems.map(item => ({
                id: item._id || item.cartUniqueId,
                name: item.name,
                quantity: item.quantity,
                price: calculateItemPrice(item)
              })),
              cartTotal: totalPrice,
              cartUrl: `${window.location.origin}/cart`
            }),
            keepalive: true // Send even if page unloads
          });
        } catch (err) {
          console.warn('Abandoned cart tracking failed:', err);
        }
      }

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

  // Razorpay checkout handler
  const handleRazorpayCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh the page and try again.');
      return;
    }

    const loadingToast = toast.loading('Preparing payment...');
    setIsRazorpayProcessing(true);

    try {
      // 🎯 GA4: Track begin_checkout event
      trackBeginCheckout(cartItems, totalPrice);

      // 📧 Mailchimp: Track abandoned cart (fire and forget)
      if (session?.user?.email) {
        try {
          fetch('/api/mailchimp/abandoned-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              cartItems: cartItems.map(item => ({
                id: item._id || item.cartUniqueId,
                name: item.name,
                quantity: item.quantity,
                price: calculateItemPrice(item)
              })),
              cartTotal: totalPrice,
              cartUrl: `${window.location.origin}/cart`
            }),
            keepalive: true
          });
        } catch (err) {
          console.warn('Abandoned cart tracking failed:', err);
        }
      }

      // Step 1: Create order on server
      console.log('Creating Razorpay order...');
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice, // Amount in INR (already converted)
          currency: selectedCurrency,
          customerEmail: session?.user?.email || '',
          customerName: session?.user?.name || '',
          cartItems: cartItems.map(item => ({
            id: item._id || item.cartUniqueId,
            name: item.name,
            quantity: item.quantity,
            price: calculateItemPrice(item)
          })),
        }),
      });

      if (!orderResponse.ok) {
        let errorMessage = 'Failed to create payment order.';
        try {
          const errorData = await orderResponse.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const orderData = await orderResponse.json();

      if (!orderData.order_id) {
        throw new Error('Invalid order response from server.');
      }

      console.log('Razorpay order created:', orderData.order_id);
      toast.dismiss(loadingToast);

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sampada Store',
        description: `Order ${orderData.receipt}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          // Step 3: Verify payment on server
          const verifyToast = toast.loading('Verifying payment...');

          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: cartItems,
                customerEmail: session?.user?.email || '',
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            toast.dismiss(verifyToast);
            toast.success('Payment successful! Redirecting to confirmation...');

            // Clear cart and redirect to success page
            // Note: Cart context should have a clearCart function
            setTimeout(() => {
              window.location.href = `/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
            }, 1500);
          } catch (error) {
            toast.dismiss(verifyToast);
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: {
          color: '#3B82F6', // Match your brand color
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay checkout dismissed by user');
            setIsRazorpayProcessing(false);
            toast.error('Payment cancelled.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Razorpay Checkout Error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'An error occurred during payment processing.');
    } finally {
      setIsRazorpayProcessing(false);
    }
  };

  // Unified checkout handler
  const handleCheckout = async () => {
    if (selectedPaymentProcessor === 'razorpay') {
      await handleRazorpayCheckout();
    } else {
      await handleStripeCheckout();
    }
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

        {/* B2B Customer Display */}
        {session?.user?.email && (
          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            <B2BCustomerDisplay
              email={session.user.email}
              showDetails={true}
            />
          </div>
        )}

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
            {/* Currency Selector */}
            <div style={{ marginBottom: '16px' }}>
              <CurrencySelector showLabel={false} />
            </div>

            {/* Subtotal Display with Converted Currency */}
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>
                {currencyLoading ? (
                  '$' + totalPrice.toFixed(2)
                ) : (
                  formattedTotalPrice
                )}
              </h3>
            </div>

            {/* Original USD display if not USD */}
            {selectedCurrency !== 'USD' && (
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                  (${totalPrice.toFixed(2)} USD)
                </p>
              </div>
            )}

            <div className="btn-container">
              {/* Payment Selector */}
              <PaymentSelector
                currency={selectedCurrency}
                totalPrice={totalPrice}
                selectedProcessor={selectedPaymentProcessor}
                onProcessorChange={setSelectedPaymentProcessor}
              />

              {/* Main Checkout Button */}
              <button
                type="button"
                className="btn checkout-btn"
                onClick={handleCheckout}
                disabled={isRazorpayProcessing}
              >
                {isRazorpayProcessing ? (
                  <>
                    <span className="spinner" />
                    Processing Payment...
                  </>
                ) : selectedPaymentProcessor === 'razorpay' ? (
                  <>
                    🇮🇳 Pay with Razorpay
                    <span className="payment-methods-hint">
                      (UPI, Net Banking, Cards, Wallets, EMI)
                    </span>
                  </>
                ) : (
                  <>
                    💳 Pay with Stripe
                    <span className="payment-methods-hint">
                      (Cards, Google Pay, Apple Pay)
                    </span>
                  </>
                )}
              </button>

              {/* Google Pay button (shown alongside Stripe) */}
              {isGooglePayAvailable && selectedPaymentProcessor === 'stripe' && (
                <GooglePayButton
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  userEmail={session?.user?.email}
                />
              )}

              {/* Klarna Buy Now Pay Later (Not available for India) */}
              {selectedPaymentProcessor === 'stripe' && (
                <KlarnaPaymentButton
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  userEmail={session?.user?.email}
                  selectedCurrency={selectedCurrency}
                />
              )}

              {/* Stripe EMI for Indian Customers (shown when Stripe is selected) */}
              {selectedCurrency === 'INR' && totalPrice > 3000 && selectedPaymentProcessor === 'stripe' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#FFF8F0',
                  borderRadius: '12px',
                  border: '2px solid #FFB380',
                  marginTop: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1A1A1A',
                    margin: '0 0 6px 0'
                  }}>
                    💳 Pay with EMI
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#666',
                    margin: '0 0 8px 0'
                  }}>
                    Convert to 3, 6, 9, or 12 month EMI at checkout
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      HDFC ✓
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      ICICI ✓
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      SBI ✓
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      Axis ✓
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#F3F4F6',
                      color: '#6B7280',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      +more
                    </span>
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: '#10B981',
                    margin: '8px 0 0 0',
                    fontWeight: '600'
                  }}>
                    ✨ Available at checkout • Instant approval • 0% down payment
                  </p>
                </div>
              )}
            </div>

            {/* VAT Validator for EU B2B Customers */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <VATValidator
                onValidate={(validation) => {
                  toast.success(`VAT validated successfully: ${validation.company_name}`);
                  // TODO: Apply VAT exemption to checkout
                }}
              />
            </div>

            {/* IFSC Validator for Indian Customers */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <IFSCValidator
                onValidate={(validation) => {
                  toast.success(`IFSC validated: ${validation.bank} - ${validation.branch}`);
                  // TODO: Store bank details for NEFT/RTGS payment
                }}
              />
            </div>

            {/* Address Validator (Lob.com) for International Customers */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <AddressValidator
                onValidate={(correctedAddress) => {
                  toast.success('Address validated successfully!');
                  // TODO: Store validated address for checkout
                }}
              />
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

        /* Checkout Button Styles */
        .checkout-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px 24px;
        }

        .payment-methods-hint {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 400;
        }

        .checkout-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
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