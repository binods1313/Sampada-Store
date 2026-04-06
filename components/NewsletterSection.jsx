// components/NewsletterSection.jsx
// Updated with Sampada brand identity: logo watermark, "Join the Legacy" copy
"use client";

import React, { useState } from 'react';
import { Mail, Check, AlertCircle, ArrowRight } from 'lucide-react';

/**
 * NewsletterSection Component
 * Sampada Brand: "Join the Legacy" with logo watermark
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!agreed) {
      setStatus('error');
      setErrorMessage('You must agree to receive offers');
      return;
    }

    // Submit
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, agreed })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setAgreed(false);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      style={{
        background: `linear-gradient(135deg, #1E1E2E 0%, #1A1A1A 100%)`,
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `2px solid rgba(201, 162, 39, 0.3)`
      }}
    >
      {/* Large "स" Logo Watermark Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '400px',
          fontWeight: '900',
          color: 'rgba(201, 162, 39, 0.08)',
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
          zIndex: 0,
          lineHeight: 1
        }}
      >
        स
      </div>

      {/* Subtle background pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(201, 162, 39, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(201, 162, 39, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2
            id="newsletter-heading"
            style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: '800',
              color: '#F5F0E8',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}
          >
            Join the Legacy
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(245, 240, 232, 0.7)',
              lineHeight: 1.7,
              maxWidth: '500px',
              margin: '0 auto 16px'
            }}
          >
            Get 10% off your first drop + early access to new collections
          </p>
          {/* Social Proof */}
          <p
            style={{
              fontSize: '13px',
              color: '#C9A227',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span style={{ color: '#22c55e' }}>●</span>
            12,000+ members already in
          </p>
        </div>

        {/* Form */}
        {status === 'success' ? (
          /* Success State */
          <div
            role="alert"
            aria-live="polite"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideIn 300ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Check size={20} style={{ color: '#22c55e' }} />
            </div>
            <div>
              <p style={{ color: '#ffffff', fontWeight: '600', marginBottom: '4px' }}>
                You're subscribed!
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Check your inbox for your 10% discount code.
              </p>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '16px'
              }}
            >
              {/* Email Field */}
              <div style={{ position: 'relative' }}>
                <label
                  htmlFor="newsletter-email"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#e5e7eb',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') {
                        setStatus('idle');
                        setErrorMessage('');
                      }
                    }}
                    disabled={status === 'loading'}
                    placeholder="you@example.com"
                    aria-invalid={status === 'error' && !isValidEmail(email)}
                    aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 44px',
                      fontSize: '15px',
                      color: '#ffffff',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${status === 'error' && !isValidEmail(email) ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)',
                      backdropFilter: 'blur(8px)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C9A84C';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(201, 168, 76, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = status === 'error' && !isValidEmail(email) ? '#ef4444' : 'rgba(255, 255, 255, 0.1)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <Mail
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                      pointerEvents: 'none'
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Checkbox */}
              <div>
                <label
                  htmlFor="newsletter-agree"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#9ca3af',
                    lineHeight: 1.5
                  }}
                >
                  <input
                    id="newsletter-agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (status === 'error' && !agreed) {
                        setStatus('idle');
                        setErrorMessage('');
                      }
                    }}
                    disabled={status === 'loading'}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginTop: '2px',
                      accentColor: '#c0392b',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    aria-describedby={status === 'error' && !agreed ? 'newsletter-error' : undefined}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid #C9A84C';
                      e.currentTarget.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none';
                    }}
                  />
                  <span>
                    I agree to the{' '}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#e5e7eb',
                        textDecoration: 'underline',
                        textDecorationThickness: '1px',
                        textUnderlineOffset: '2px'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = '2px solid #C9A84C';
                        e.currentTarget.style.outlineOffset = '2px';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                      }}
                    >
                      Privacy Policy
                    </a>{' '}
                    and want to receive exclusive offers.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '15px',
                fontWeight: '700',
                color: '#F5F0E8',
                background: `linear-gradient(135deg, #8B0000 0%, #6B0000 100%)`,
                border: `2px solid rgba(201, 162, 39, 0.3)`,
                borderRadius: '10px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: status === 'loading' ? 0.7 : 1,
                transform: status === 'loading' ? 'scale(0.98)' : 'scale(1)',
                boxShadow: '0 4px 14px rgba(139, 0, 0, 0.5)'
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading') {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 20px rgba(201, 162, 39, 0.4)`;
                  e.target.style.borderColor = '#C9A227';
                }
              }}
              onMouseLeave={(e) => {
                if (status !== 'loading') {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(139, 0, 0, 0.5)';
                  e.target.style.borderColor = 'rgba(201, 162, 39, 0.3)';
                }
              }}
              onMouseDown={(e) => {
                if (status !== 'loading') {
                  e.target.style.transform = 'scale(0.97)';
                }
              }}
              onMouseUp={(e) => {
                if (status !== 'loading') {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #C9A84C';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              {status === 'loading' ? (
                <>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#F5F0E8',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}
                    aria-hidden="true"
                  />
                  Subscribing...
                </>
              ) : (
                <>
                  Get 10% off
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Error Message */}
            {status === 'error' && errorMessage && (
              <div
                id="newsletter-error"
                role="alert"
                aria-live="assertive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '12px 14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  animation: 'shake 300ms cubic-bezier(0.23, 1, 0.32, 1)'
                }}
              >
                <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                <p style={{ color: '#fca5a5', fontSize: '14px', margin: 0 }}>
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Trust Reassurance */}
            <p
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#6b7280',
                marginTop: '16px',
                marginBottom: 0
              }}
            >
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          section {
            padding: 60px 20px;
          }
        }
      `}</style>
    </section>
  );
}
