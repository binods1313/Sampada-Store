// components/NewsletterSignup.jsx
// Newsletter subscription component with Mailchimp integration
// Features: Email validation, success/error states, loading states, discount code display

import React, { useState } from 'react';

export default function NewsletterSignup({ className = '', variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mailchimp/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          lastName: undefined,
          status: 'subscribed'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setSuccess(true);
      setDiscountCode('WELCOME10');

      // Reset form
      setEmail('');
      setFirstName('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className={`newsletter-signup ${className}`}>
        <div style={{
          padding: '24px',
          backgroundColor: '#F0FDF4',
          borderRadius: '12px',
          border: '1px solid #10B981',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <svg style={{ width: '24px', height: '24px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', margin: 0 }}>
              Welcome to the Family! 🎉
            </h3>
          </div>
          <p style={{ fontSize: '14px', color: '#065F46', marginBottom: '16px' }}>
            You've been subscribed to our newsletter. Check your inbox for exclusive deals!
          </p>
          {discountCode && (
            <div style={{
              padding: '12px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '2px dashed #10B981'
            }}>
              <p style={{ fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                Here's your welcome discount:
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#10B981',
                fontFamily: 'monospace',
                margin: 0
              }}>
                {discountCode}
              </p>
              <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Use this code at checkout for 10% off!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact variant (for footer/sidebar)
  if (variant === 'compact') {
    return (
      <div className={`newsletter-signup ${className}`}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: loading ? '#9CA3AF' : '#1F2937',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
          {error && (
            <p style={{ fontSize: '12px', color: '#EF4444', margin: 0 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }

  // Default variant (full featured)
  return (
    <div className={`newsletter-signup ${className}`}>
      <div style={{
        padding: '32px',
        backgroundColor: '#F9FAFB',
        borderRadius: '16px',
        border: '1px solid #E5E7EB'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
            📬 Stay in the Loop!
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Subscribe to our newsletter for exclusive deals, new arrivals, and design inspiration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px', margin: '0 auto' }}>
          {/* First Name */}
          <div>
            <label htmlFor="newsletter-first-name" style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              First Name (Optional)
            </label>
            <input
              id="newsletter-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="newsletter-email" style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              Email Address *
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="john@example.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: error ? '1px solid #EF4444' : '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#FEF2F2',
              borderRadius: '6px',
              border: '1px solid #FECACA'
            }}>
              <p style={{ fontSize: '13px', color: '#991B1B', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* Benefits List */}
          <div style={{ textAlign: 'left', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              What you'll get:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6B7280', lineHeight: '1.8' }}>
              <li>Exclusive 10% welcome discount</li>
              <li>Early access to new collections</li>
              <li>Design tips and inspiration</li>
              <li>Special promotions and deals</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: loading ? '#9CA3AF' : '#1F2937',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <svg className="animate-spin" style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
            ) : (
              '🚀 Subscribe & Get 10% Off'
            )}
          </button>

          {/* Privacy Note */}
          <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
}
