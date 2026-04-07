// components/ExitIntentPopup.jsx
// Exit-intent popup with 10% discount offer
// Triggers when mouse leaves viewport toward address bar/tabs

import React, { useState, useEffect, useCallback } from 'react';
import { X, Gift, ArrowRight, Check } from 'lucide-react';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track exit intent (mouse leaves viewport top)
  const handleMouseLeave = useCallback((e) => {
    if (e.clientY <= 0 && !dismissed) {
      setVisible(true);
    }
  }, [dismissed]);

  // Also trigger on back button / tab switch attempt
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && !dismissed) {
      setVisible(true);
    }
  }, [dismissed]);

  useEffect(() => {
    // Check if user already dismissed in this session
    const dismissedAt = sessionStorage.getItem('sampada_exit_dismissed');
    if (dismissedAt) {
      const minutesSince = (Date.now() - parseInt(dismissedAt)) / 60000;
      if (minutesSince < 30) return; // Don't show again for 30 minutes
    }

    // Check if user already subscribed
    const subscribed = localStorage.getItem('sampada_subscribed');
    if (subscribed) return;

    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleMouseLeave, handleVisibilityChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);

    try {
      // Subscribe via Mailchimp API
      await fetch('/api/mailchimp/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          status: 'subscribed',
        }),
      });

      localStorage.setItem('sampada_subscribed', 'true');
      setSubmitted(true);
    } catch (error) {
      console.warn('Exit intent subscription failed:', error);
      // Still show discount even if API fails
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('sampada_exit_dismissed', String(Date.now()));
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '90%',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          aria-label="Close offer"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#FFFFFF',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'}
        >
          <X size={16} />
        </button>

        {!submitted ? (
          <>
            {/* Header with gradient */}
            <div style={{
              background: 'linear-gradient(135deg, #8B1A1A 0%, #6B1414 100%)',
              padding: '32px 24px 24px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Gift size={28} color="#C9A84C" />
              </div>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '800',
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}>
                Wait! Don't Miss Out
              </h2>
              <p style={{
                margin: '8px 0 0',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
              }}>
                Get 10% off your first order
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <label
                htmlFor="exit-email"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Enter your email for instant discount
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="exit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C9A84C'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: loading ? '#9CA3AF' : '#8B1A1A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#6B1414';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#8B1A1A';
                  }}
                >
                  {loading ? 'Sending...' : (
                    <>
                      Get Code
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              {/* Trust signals */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '16px',
                fontSize: '11px',
                color: '#9CA3AF',
              }}>
                <span>No spam</span>
                <span>•</span>
                <span>Unsubscribe anytime</span>
              </div>
            </form>
          </>
        ) : (
          /* Success state */
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Check size={32} color="#10B981" />
            </div>
            <h3 style={{
              margin: '0 0 8px',
              fontSize: '20px',
              fontWeight: '700',
              color: '#1F2937',
            }}>
              You're In! 🎉
            </h3>
            <p style={{
              margin: '0 0 16px',
              fontSize: '14px',
              color: '#6B7280',
            }}>
              Your 10% discount code:
            </p>
            <div style={{
              padding: '16px',
              backgroundColor: '#FFF8F0',
              borderRadius: '12px',
              border: '2px dashed #C9A84C',
              marginBottom: '16px',
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#8B1A1A',
                fontFamily: 'monospace',
                letterSpacing: '2px',
              }}>
                WELCOME10
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#9CA3AF',
            }}>
              Apply at checkout • Valid for 7 days
            </p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
