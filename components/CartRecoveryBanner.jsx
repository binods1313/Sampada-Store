// components/CartRecoveryBanner.jsx
// Cart recovery banner - shows when user returns with abandoned cart

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecoveryBannerConfig, clearAbandonedCart } from '../utils/cartRecovery';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';

export default function CartRecoveryBanner() {
  const [banner, setBanner] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const config = getRecoveryBannerConfig();
    if (config) {
      setBanner(config);
      // Show after a short delay for better UX
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    clearAbandonedCart();
  };

  if (!banner || !visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto 16px',
          marginLeft: '16px',
          marginRight: '16px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '2px solid #C9A84C',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #8B1A1A, #C9A84C, #8B1A1A)',
        }} />

        <div style={{ padding: '20px' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFF8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ShoppingCart size={20} color="#C9A84C" />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1F2937',
                  lineHeight: 1.3,
                }}>
                  {banner.title}
                </h3>
                <p style={{
                  margin: '4px 0 0',
                  fontSize: '13px',
                  color: '#6B7280',
                }}>
                  {banner.message}
                </p>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss cart recovery"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#9CA3AF',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Item thumbnails */}
          {banner.items.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}>
              {banner.items.slice(0, 3).map((item, i) => (
                <div
                  key={item.id || i}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: '#F3F4F6',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <ShoppingCart size={20} color="#D1D5DB" />
                  )}
                </div>
              ))}
              {banner.items.length > 3 && (
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  flexShrink: 0,
                }}>
                  +{banner.items.length - 3}
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div>
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#8B1A1A',
              }}>
                ₹{banner.total?.toFixed(2)}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#6B7280',
                marginLeft: '4px',
              }}>
                total
              </span>
            </div>

            <Link
              href="/cart?recover=true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                backgroundColor: '#8B1A1A',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6B1414';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8B1A1A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {banner.actionText}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
