// pages/success.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// Import Context hooks
import { useCartContext } from '../context/CartContext';
import { runFireworks } from '../lib/utils';

const Success = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { clearCart } = useCartContext();
  const { session_id } = router.query;
  // Add a state flag to track whether cart has been cleared
  const [hasCleared, setHasCleared] = useState(false);
  
  useEffect(() => {
    // Only clear the cart if it hasn't been cleared already
    if (clearCart && !hasCleared) {
      console.log('Success page mounted. Clearing cart...');
      clearCart();
      setHasCleared(true); // Mark as cleared to prevent infinite loop
    }
    
    // Run confetti effect
    if (runFireworks) {
      runFireworks();
    }
    
    // Create order manually if session_id is present (fallback for webhook failures)
    if (session_id && !hasCleared) {
      console.log('Creating order manually for session:', session_id);
      
      fetch('/api/orders/create-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: session_id }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('✅ Order created manually:', data.orderId);
        } else {
          console.error('❌ Failed to create order manually:', data.error);
        }
      })
      .catch(error => {
        console.error('❌ Error creating manual order:', error);
      });
    }
    
    // Fix user linking for orders (link orders to current logged-in user)
    if (session?.user?.email && !hasCleared) {
      console.log('Fixing user links for orders with email:', session.user.email);
      
      // Add a small delay to ensure order is created first
      setTimeout(() => {
        fetch('/api/orders/fix-user-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      }, 2000); // 2 second delay
    }
    
    // Redirect to the account page (order history tab) after a delay
    const redirectTimeout = setTimeout(() => {
      router.push('/account?tab=orders&from=success');
    }, 3000); // Redirect after 3 seconds
    
    return () => clearTimeout(redirectTimeout);
  }, [session_id, hasCleared]); // Remove clearCart from dependencies, add hasCleared
  
  return (
    <div className="success-wrapper" style={{}}>
      <div className="success" style={{}}>
        <p className="icon" style={{}}>
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check your email inbox for the receipt.</p>
        <p className="description" style={{}}>
          If you have any questions, please email: {' '}
          <a className="email" href="mailto:ABMS@gmail.com" style={{}}>
            ABMS@gmail.com
          </a>
        </p>
        <p style={{}}>
          Redirecting you to your order history...
        </p>
        <Link href="/">
          <button type="button" className="btn" style={{}}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;