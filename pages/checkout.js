// pages/checkout.js - Complete Checkout Page with All Payment Methods
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { useCartContext } from '../context/CartContext';
import { useCurrencyContext } from '../context/CurrencyContext';
import { COUNTRIES } from '../utils/countries';
import { INDIAN_STATES } from '../utils/indianStates';
import { CURRENCY_OPTIONS } from '../utils/currency';
import { urlFor } from '../lib/client';
import { toast } from 'react-hot-toast';
import CurrencySelector from '../components/CurrencySelector';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, totalPrice, totalQuantities, calculateItemPrice } = useCartContext();
  const { selectedCurrency, convertPrice } = useCurrencyContext();
  const currencySymbol = CURRENCY_OPTIONS.find(opt => opt.code === selectedCurrency)?.symbol || selectedCurrency;

  // Coupon handling
  const VALID_COUPONS = {
    SAMPADA10: { discount: 10, type: 'percentage' },
    WELCOME20: { discount: 20, type: 'percentage' },
  };
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  // const zipLabel = shippingAddress.country === 'IN' ? 'PIN' : (shippingAddress.country === 'US' ? 'ZIP' : 'Postcode'); // Removed to avoid reference error
  const [mounted, setMounted] = useState(false);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setDiscount(VALID_COUPONS[code].discount);
      toast.success(`Coupon ${code} applied!`);
    } else {
      setDiscount(0);
      toast.error('Invalid coupon');
    }
  };
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });
  
  // Payment state
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Shipping cost (you can make this dynamic based on location)
  const shippingCost = 10.00;
  const tax = totalPrice * 0.08; // 8% tax (adjust as needed)
  const discountAmount = (discount / 100) * totalPrice;
  const finalTotal = totalPrice - discountAmount + shippingCost + tax;

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
    setMounted(true);
  }, [cartItems, router]);
  
  // Pre-fill email from session
  useEffect(() => {
    if (session?.user?.email) {
      setShippingAddress(prev => ({ ...prev, email: session.user.email }));
    }
  }, [session]);
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingAddress.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingAddress.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingAddress.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = 'Email is invalid';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingAddress.address1.trim()) newErrors.address1 = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!shippingAddress.country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Submit Printify order after successful payment
  const submitPrintifyOrder = async (paymentId, paymentMethod) => {
    try {
      const printifyItems = cartItems.filter(item => item.isPrintifyProduct);
      
      if (printifyItems.length === 0) {
        console.log('No Printify products in cart');
        return;
      }
      
      const printifyOrderData = {
        external_id: `${paymentMethod.toUpperCase()}-${Date.now()}-${paymentId.substring(0, 8)}`,
        line_items: printifyItems.map(item => ({
          product_id: item.printifyProductId,
          variant_id: item.printifyVariantId,
          quantity: item.quantity
        })),
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          country: shippingAddress.country,
          region: shippingAddress.state,
          address1: shippingAddress.address1,
          address2: shippingAddress.address2 || '',
          city: shippingAddress.city,
          zip: shippingAddress.zip
        }
      };

      await printifyAPI.createOrder(
        process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID,
        printifyOrderData
      );
      
      console.log('Successfully submitted order to Printify');
      toast.success('Order sent to fulfillment!');
    } catch (error) {
      console.error('Error submitting to Printify:', error);
      toast.error('Warning: Order placed but fulfillment may be delayed');
    }
  };
  
  // Handle Stripe payment
  const handleStripePayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const stripe = await stripePromise;
      
      // Prepare line items for Stripe
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Create Stripe checkout session
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: lineItems,
          customerEmail: shippingAddress.email,
          shippingAddress: shippingAddress,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout`,
        }),
      });
      
      const session = await response.json();
      
      if (session.id) {
        // Store order data for success page
        sessionStorage.setItem('lastOrder', JSON.stringify({
          total: finalTotal,
          currency: 'USD',
          tax: tax,
          shipping: shippingCost,
          items: cartItems,
        }));
        
        // Redirect to Stripe checkout
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        
        if (result.error) {
          toast.error(result.error.message);
        }
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'USD',
          customerEmail: shippingAddress.email,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          cartItems: cartItems,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        toast.error('Failed to create payment order');
        setIsProcessing(false);
        return;
      }
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: 'Sampada Store',
          description: 'Order Payment',
          order_id: data.order_id,
          prefill: {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            email: shippingAddress.email,
            contact: shippingAddress.phone,
          },
          theme: {
            color: '#8B1A1A',
          },
          handler: async function (response) {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: cartItems,
                customerEmail: shippingAddress.email,
              }),
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              // Submit to Printify
              await submitPrintifyOrder(response.razorpay_payment_id, 'razorpay');
              
              // Store order data
              sessionStorage.setItem('lastOrder', JSON.stringify({
                total: finalTotal,
                currency: 'USD',
                tax: tax,
                shipping: shippingCost,
                items: cartItems,
              }));
              
              // Redirect to success
              router.push(`/success?payment_id=${response.razorpay_payment_id}&source=razorpay`);
            } else {
              toast.error('Payment verification failed');
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast.error('Payment cancelled');
            },
          },
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (error) {
      console.error('Razorpay payment error:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };
  
  // Handle PayPal payment
  const handlePayPalPayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: finalTotal,
          currency: 'USD',
          customerEmail: shippingAddress.email,
        }),
      });

      const data = await response.json();
      
      if (data.id) {
        // Store order data
        sessionStorage.setItem('lastOrder', JSON.stringify({
          total: finalTotal,
          currency: 'USD',
          tax: tax,
          shipping: shippingCost,
          items: cartItems,
        }));
        
        // Load PayPal SDK and redirect
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        document.body.appendChild(script);
        
        script.onload = () => {
          window.paypal.Buttons({
            createOrder: () => data.id,
            onApprove: async (data) => {
              // Capture the order
              const captureResponse = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID }),
              });
              
              const captureData = await captureResponse.json();
              
              if (captureData.status === 'COMPLETED') {
                // Submit to Printify
                await submitPrintifyOrder(data.orderID, 'paypal');
                
                // Redirect to success
                router.push(`/success?payment_id=${data.orderID}&source=paypal`);
              } else {
                toast.error('Payment capture failed');
              }
            },
            onError: (err) => {
              console.error('PayPal error:', err);
              toast.error('Payment failed');
              setIsProcessing(false);
            },
          }).render('#paypal-button-container');
        };
      } else {
        toast.error('Failed to create PayPal order');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Handle payment submission
  const handlePayment = () => {
    switch (selectedPayment) {
      case 'stripe':
        handleStripePayment();
        break;
      case 'razorpay':
        handleRazorpayPayment();
        break;
      case 'paypal':
        handlePayPalPayment();
        break;
      default:
        toast.error('Please select a payment method');
    }
  };
  
  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div>
      <Head>
        <title>Checkout - Sampada Store</title>
        <meta name="description" content="Complete your order" />
      </Head>
      
      {mounted && (
        <div className="progress-container">
            <div className="progress-step">Cart</div>
            <div className="progress-step inactive">Checkout</div>
            <div className="progress-step inactive">Confirmation</div>
        </div>
      )}
      
      <div style={{
        minHeight: '100vh',
        background: '#FAF6F0',
        padding: '80px 20px 40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '40px'
        }}>
          {/* Left Column - Shipping Form */}
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1a1a1a',
              marginBottom: '32px'
            }}>
              Checkout
            </h1>

            {/* Shipping Address Form */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '24px'
              }}>
                Shipping Address
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.firstName ? '1px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.firstName && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.firstName}</span>}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.lastName ? '1px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.lastName && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.lastName}</span>}
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.email ? '1px solid #e74c3c' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {errors.email && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.email}</span>}
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.phone ? '1px solid #e74c3c' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {errors.phone && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.phone}</span>}
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="address1"
                  value={shippingAddress.address1}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.address1 ? '1px solid #e74c3c' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {errors.address1 && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.address1}</span>}
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address2"
                  value={shippingAddress.address2}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.city ? '1px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.city && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.city}</span>}
                </div>
                
                <div>
                  {shippingAddress.country !== 'IN' && (
                    <div style={{ marginTop: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: errors.state ? '1px solid #e74c3c' : '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      {errors.state && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.state}</span>}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={shippingAddress.zip}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.zip ? '1px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  {errors.zip && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.zip}</span>}
                </div>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Country *</label>
                <select
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.country ? '1px solid #e74c3c' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="" disabled>Select Country</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                {errors.country && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.country}</span>}
                {shippingAddress.country === 'IN' && (
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>State *</label>
                    <select
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: errors.state ? '1px solid #e74c3c' : '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.state}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '24px'
              }}>
                Payment Method
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Stripe / Credit Card */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: selectedPayment === 'stripe' ? '2px solid #8B1A1A' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedPayment === 'stripe' ? 'rgba(139, 26, 26, 0.05)' : '#fff'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={selectedPayment === 'stripe'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>Credit / Debit Card</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>Powered by Stripe • Supports Google Pay & Apple Pay</div>
                  </div>
                </label>
                
                {/* Razorpay */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: selectedPayment === 'razorpay' ? '2px solid #8B1A1A' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedPayment === 'razorpay' ? 'rgba(139, 26, 26, 0.05)' : '#fff'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={selectedPayment === 'razorpay'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>Razorpay</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>UPI, Net Banking, Cards, Wallets</div>
                  </div>
                </label>

                {/* PayPal */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: selectedPayment === 'paypal' ? '2px solid #8B1A1A' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedPayment === 'paypal' ? 'rgba(139, 26, 26, 0.05)' : '#fff'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={selectedPayment === 'paypal'}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>PayPal</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>Pay with your PayPal account</div>
                  </div>
                </label>
              </div>
              
              {/* PayPal Button Container (shown when PayPal is selected) */}
              {selectedPayment === 'paypal' && (
                <div id="paypal-button-container" style={{ marginTop: '24px' }}></div>
              )}
              
              {/* Pay Button (for Stripe and Razorpay) */}
              {selectedPayment !== 'paypal' && (
                <>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    style={{
                      width: '100%',
                      padding: '16px',
                      marginTop: '24px',
                      background: isProcessing ? '#ccc' : 'linear-gradient(135deg, #8B1A1A 0%, #A52A2A 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {isProcessing ? 'Processing...' : `Pay ${convertPrice(finalTotal, selectedCurrency)}`}
                  </button>

                  {/* Premium Trust Badges */}
                  <div className="trust-badges-container">
                    {[
                      { icon: '🔒', text: 'Secure Payment' },
                      { icon: '🚚', text: 'Free Shipping ₹999+' },
                      { icon: '↩', text: '30-Day Returns' },
                      { icon: '⭐', text: '4.8 Rated' },
                    ].map((badge) => (
                      <div key={badge.text} className="trust-badge-item">
                        <span style={{ fontSize: '14px' }}>{badge.icon}</span>
                        <span>{badge.text}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="order-summary-card">
              <h2 className="order-summary-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Order Summary
                  <span className="item-count-badge">{totalQuantities}</span>
                </div>
                <div style={{ width: '130px' }}>
                  <CurrencySelector showLabel={false} />
                </div>
              </h2>
              
              {/* Cart Items */}
              <div style={{ marginBottom: '24px' }}>
                {cartItems.map((item, index) => (
                  <div key={index} className="order-summary-item">
                    {/* Determine which image to display for the checkout item */}
                    {(() => {
                      const displayImageUrl = item.variantImage && item.variantImage.asset
                        ? urlFor(item.variantImage).width(300).url()
                        : (item.baseImage && item.baseImage[0] && item.baseImage[0].asset
                          ? urlFor(item.baseImage[0]).width(300).url()
                          : (item.image && item.image[0] && item.image[0].asset
                            ? urlFor(item.image[0]).width(300).url()
                            : 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\'><rect width=\'80\' height=\'80\' fill=\'#8B1A1A\'/><text x=\'50%\' y=\'55%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'#F5E0C3\' font-family=\'serif\' font-size=\'40\' font-weight=\'bold\'>स</text></svg>'));
                      return (
                        <div className="order-summary-image-wrapper">
                          <img src={displayImageUrl} alt={item.name} />
                        </div>
                      );
                    })()}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        Qty: {item.quantity}
                      </div>
                      <div className="order-summary-price">
                        {(() => {
                          const itemPrice = calculateItemPrice(item);
                          const formattedPrice = convertPrice(itemPrice * item.quantity, selectedCurrency);
                          return parseFloat(itemPrice) === 0 ? (
                            <span style={{ 
                              color: '#cc0000', 
                              fontSize: '11px',
                              fontStyle: 'italic' 
                            }}>
                              Price not set — check Sanity
                            </span>
                          ) : (
                            <span style={{ color: '#8B1A1A', fontWeight: 700 }}>
                              {formattedPrice}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                {/* Coupon Code */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <button onClick={applyCoupon} style={{ padding: '8px 12px', background: '#8B1A1A', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Apply
                  </button>
                </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Subtotal ({totalQuantities} items)</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{convertPrice(totalPrice, selectedCurrency)}</span>
                </div>
                 {discount > 0 && (
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#10B981' }}>
                     <span style={{ fontSize: '14px' }}>Discount ({discount}% off)</span>
                     <span style={{ fontSize: '14px', fontWeight: '600' }}>- {convertPrice(discountAmount, selectedCurrency)}</span>
                   </div>
                 )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Shipping</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{convertPrice(shippingCost, selectedCurrency)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Tax (8%)</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{convertPrice(tax, selectedCurrency)}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '2px solid #f0f0f0'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#8B1A1A' }}>{convertPrice(finalTotal, selectedCurrency)}</span>
                </div>
              </div>
              
              {/* Security Badge */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(201, 168, 76, 0.08)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  🔒 Secure Checkout
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  Your payment information is encrypted and secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
