// pages/success.js - Order Success Page with Sampada Premium Branding
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

// Import Context hooks
import { useCartContext } from '../context/CartContext';
import { runFireworks } from '../lib/utils';

// Import Analytics & Marketing
import { trackPurchase } from '@/lib/analytics';
import { subscribeUser, triggerPostPurchaseEmail } from '@/lib/mailchimp';
import { clearAbandonedCart } from '@/utils/cartRecovery';

const Success = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { clearCart } = useCartContext();
  const { session_id, payment_id, source } = router.query;
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    if (clearCart && !hasCleared) {
      console.log('Success page mounted. Clearing cart...');
      clearCart();
      clearAbandonedCart(); // Clear abandoned cart tracking
      setHasCleared(true);
    }

    if (runFireworks) {
      runFireworks();
    }

    // Track purchase with GA4 (Handle both Stripe and PayPal)
    const transactionId = session_id || payment_id;
    if (transactionId) {
      // Try to get order details from session storage
      const orderData = typeof window !== 'undefined' ?
        JSON.parse(sessionStorage.getItem('lastOrder') || '{}') : {};

      trackPurchase({
        id: transactionId,
        total: orderData.total || 0,
        currency: orderData.currency || 'USD',
        tax: orderData.tax || 0,
        shipping: orderData.shipping || 0,
        items: orderData.items || [],
        source: source || 'stripe'
      });

      // Trigger Mailchimp post-purchase email
      if (session?.user?.email) {
        triggerPostPurchaseEmail({
          email: session.user.email,
          orderId: transactionId,
          orderTotal: orderData.total || 0,
          items: orderData.items || []
        }).catch(err => console.warn('Mailchimp post-purchase failed:', err));

        // Auto-subscribe to newsletter
        subscribeUser({
          email: session.user.email,
          status: 'subscribed'
        }).catch(err => console.warn('Mailchimp subscribe failed:', err));
      }
    }

    // Manual order creation fallback for Stripe
    if (session_id && !hasCleared) {
      console.log('Creating order manually for session:', session_id);
      fetch('/api/orders/create-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session_id }),
      }).catch(err => console.error('Manual order creation error:', err));
    }

    // Handle order linking for both Stripe and PayPal
    if (session?.user?.email && !hasCleared) {
      console.log('Fixing user links for orders with email:', session.user.email);

      setTimeout(() => {
        fetch('/api/orders/fix-user-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: session.user.email }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log(`✅ Fixed ${data.ordersFixed} order links`);
          } else {
            console.error('❌ Failed to fix order links:', data.error);
          }
        })
        .catch(error => {
          console.error('❌ Error fixing order links:', error);
        });
      }, 2000);
    }

    const redirectTimeout = setTimeout(() => {
      router.push('/account?tab=orders&from=success');
    }, 5000);

    return () => clearTimeout(redirectTimeout);
  }, [session_id, hasCleared]);

  return (
    <>
      <Head>
        <title>Order Confirmed - Sampada</title>
        <meta name="description" content="Your order has been successfully placed!" />
      </Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f8f4ef 0%, #ffffff 100%)'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '12px',
          padding: '48px 40px',
          boxShadow: '0 12px 48px rgba(139, 26, 26, 0.15)',
          border: '2px solid rgba(201, 168, 76, 0.3)',
          textAlign: 'center'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B1A1A, #6B1414)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(139, 26, 26, 0.3)'
          }}>
            <CheckCircle size={40} color="#ffffff" />
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1a1a1a',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            Order Confirmed!
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#4a4a4a',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Thank you for your order! We've sent a confirmation email to your inbox.
          </p>

          {/* Info Card */}
          <div style={{
            background: 'rgba(201, 168, 76, 0.08)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderLeft: '3px solid #C9A84C',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '32px'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#555',
              margin: '0 0 12px',
              fontWeight: '600'
            }}>
              📧 Check your email for the receipt
            </p>
            <p style={{
              fontSize: '13px',
              color: '#666',
              margin: 0,
              lineHeight: '1.5'
            }}>
              If you have any questions, please email:{' '}
              <a href="mailto:hello@sampada.com" style={{
                color: '#8B1A1A',
                fontWeight: '600',
                textDecoration: 'underline'
              }}>
                hello@sampada.com
              </a>
            </p>
          </div>

          {/* Redirect Notice */}
          <p style={{
            fontSize: '13px',
            color: '#999',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '12px',
              height: '12px',
              border: '2px solid #C9A84C',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></span>
            Redirecting to your order history...
          </p>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center'
          }}>
            <Link href="/" passHref>
              <button type="button" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                color: '#8B1A1A',
                border: '2px solid #8B1A1A',
                borderRadius: '4px',
                padding: '14px 28px',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8B1A1A';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#8B1A1A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <Home size={18} />
                Continue Shopping
              </button>
            </Link>

            <Link href="/account?tab=orders" passHref>
              <button type="button" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #8B1A1A, #6B1414)',
                color: '#ffffff',
                border: '2px solid #C9A84C',
                borderRadius: '4px',
                padding: '14px 28px',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 15px rgba(139, 26, 26, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #C9A84C, #a88535)';
                e.currentTarget.style.color = '#1a0a00';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #8B1A1A, #6B1414)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                View Orders
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Success;