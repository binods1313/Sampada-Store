// components/KlarnaPaymentButton.jsx
// Klarna Buy Now Pay Later (BNPL) payment button
// Features: Pay in 4, Pay in 30 days, Monthly financing

import React, { useState, useEffect } from 'react';
import { getAvailablePaymentMethods, calculateInstallment, isKlarnaConfigured } from '../lib/klarna';

export default function KlarnaPaymentButton({ cartItems, totalPrice, userEmail, selectedCurrency = 'USD', className = '' }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [klarnaConfigured, setKlarnaConfigured] = useState(false);

  useEffect(() => {
    // Check if Klarna is configured
    const configured = isKlarnaConfigured();
    setKlarnaConfigured(configured);

    if (configured) {
      // Load available payment methods
      const methods = getAvailablePaymentMethods('US', 'USD');
      setPaymentMethods(methods);
      setSelectedMethod(methods[0]); // Default to first method
    }
  }, []);

  // ⚠️ Klarna NOT available for India - Hide component for INR currency
  if (selectedCurrency === 'INR') {
    return null;
  }

  // Don't render if Klarna not configured or cart is empty
  if (!klarnaConfigured || cartItems.length === 0) {
    return null;
  }

  // Klarna typically works for orders between $10-$10,000
  if (totalPrice < 10 || totalPrice > 10000) {
    return null;
  }

  const handleKlarnaCheckout = async () => {
    if (!selectedMethod) return;

    setLoading(true);

    try {
      // Call Klarna API endpoint
      const response = await fetch('/api/klarna/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: totalPrice,
          currency: 'USD',
          customerEmail: userEmail,
          paymentMethod: selectedMethod.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Klarna session');
      }

      // Redirect to Klarna hosted checkout
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL received from Klarna');
      }
    } catch (error) {
      console.error('Klarna checkout error:', error);
      alert(`Klarna checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate installment display
  const installmentDisplay = {
    pay_in_4: {
      label: '4 payments',
      amount: calculateInstallment(totalPrice, 4),
      description: '4 interest-free payments of'
    },
    pay_in_3: {
      label: '3 payments',
      amount: calculateInstallment(totalPrice, 3),
      description: '3 interest-free payments of'
    },
    pay_in_30: {
      label: 'Pay in 30 days',
      amount: totalPrice.toFixed(2),
      description: 'Full payment due in 30 days'
    },
    financing: {
      label: 'Monthly',
      amount: calculateInstallment(totalPrice, 12),
      description: 'Starting at 12 monthly payments of'
    }
  };

  const currentInstallment = installmentDisplay[selectedMethod?.id] || installmentDisplay.pay_in_4;

  return (
    <>
      {/* Klarna Payment Button */}
      <div className={`klarna-payment-button ${className}`}>
        {/* Klarna Branding */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          padding: '12px',
          backgroundColor: '#FFF8F0',
          borderRadius: '8px',
          border: '1px solid #FFB380'
        }}>
          <span style={{ fontSize: '24px' }}>🛍️</span>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#1A1A1A',
              margin: 0
            }}>
              Buy Now, Pay Later with Klarna
            </p>
            <p style={{
              fontSize: '11px',
              color: '#666',
              margin: '2px 0 0 0'
            }}>
              No interest, no fees. Just flexible payments.
            </p>
          </div>
        </div>

        {/* Payment Method Selector */}
        {paymentMethods.length > 1 && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px',
              display: 'block'
            }}>
              Payment Plan
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  style={{
                    padding: '10px 12px',
                    border: `2px solid ${selectedMethod?.id === method.id ? '#1A1A1A' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    backgroundColor: selectedMethod?.id === method.id ? '#F9FAFB' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{method.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1F2937',
                        margin: 0
                      }}>
                        {method.name}
                      </p>
                      <p style={{
                        fontSize: '11px',
                        color: '#6B7280',
                        margin: '2px 0 0 0'
                      }}>
                        {method.description}
                      </p>
                    </div>
                    {selectedMethod?.id === method.id && (
                      <span style={{
                        fontSize: '18px',
                        color: '#1A1A1A'
                      }}>
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Installment Display */}
        <div style={{
          padding: '12px',
          backgroundColor: '#F0FDF4',
          borderRadius: '8px',
          border: '1px solid #86EFAC',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#065F46',
            margin: '0 0 4px 0'
          }}>
            {currentInstallment.description}
          </p>
          <p style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#059669',
            margin: 0,
            fontFamily: 'monospace'
          }}>
            ${currentInstallment.amount}
          </p>
          <p style={{
            fontSize: '11px',
            color: '#10B981',
            margin: '4px 0 0 0'
          }}>
            {currentInstallment.label} • 0% interest
          </p>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleKlarnaCheckout}
          disabled={loading || !selectedMethod}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: loading ? '#9CA3AF' : '#1A1A1A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span style={{ fontSize: '18px' }}>🛍️</span>
              Pay with Klarna
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '12px',
          fontSize: '10px',
          color: '#9CA3AF'
        }}>
          <span>🔒 Secure</span>
          <span>•</span>
          <span>0% Interest</span>
          <span>•</span>
          <span>No Hidden Fees</span>
        </div>
      </div>

      {/* Info Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }} onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>
              How Klarna Works
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>1️⃣</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    Shop as normal
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                    Add items to your cart and choose Klarna at checkout
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>2️⃣</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    Choose your plan
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                    Pay in 4, Pay in 30 days, or monthly financing
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>3️⃣</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    Get your order
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                    Your order ships immediately. Pay over time!
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '12px',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
