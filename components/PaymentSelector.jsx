// components/PaymentSelector.jsx
// Payment method selector with auto-selection based on currency
// Shows both Stripe, Razorpay and PayPal options with beautiful UI

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaGooglePay, FaApplePay, FaPaypal } from 'react-icons/fa';
import { MdOutlineAccountBalance, MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { SiGooglepay, SiPhonepe, SiPaytm, SiPaypal } from 'react-icons/si';
import { BsBank } from 'react-icons/bs';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';

// Razorpay payment method icons
const razorpayMethods = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: <SiGooglepay size={20} />,
    color: '#4285F4',
    bgColor: '#E8F0FE',
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major Indian banks',
    icon: <BsBank size={20} />,
    color: '#1A73E8',
    bgColor: '#E3F2FD',
  },
  {
    id: 'card',
    name: 'Cards',
    description: 'Visa, Mastercard, RuPay, Amex',
    icon: <FaCreditCard size={20} />,
    color: '#1F2937',
    bgColor: '#F3F4F6',
  },
  {
    id: 'wallet',
    name: 'Wallets',
    description: 'Paytm, Mobikwik, Freecharge',
    icon: <MdOutlineAccountBalanceWallet size={20} />,
    color: '#00B8D4',
    bgColor: '#E0F7FA',
  },
  {
    id: 'emi',
    name: 'EMI',
    description: '3, 6, 9, 12 month options',
    icon: <MdOutlineAccountBalance size={20} />,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    minAmount: 3000, // Minimum 3000 INR
  },
];

// Stripe payment methods
const stripeMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, Amex',
    icon: <FaCreditCard size={20} />,
    color: '#1F2937',
    bgColor: '#F3F4F6',
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    description: 'Fast, secure checkout',
    icon: <FaGooglePay size={20} />,
    color: '#4285F4',
    bgColor: '#E8F0FE',
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'Quick checkout on Apple devices',
    icon: <FaApplePay size={20} />,
    color: '#000000',
    bgColor: '#F3F4F6',
  },
];

// PayPal payment methods
const paypalMethods = [
  {
    id: 'paypal',
    name: 'PayPal Checkout',
    description: 'PayPal Balance, Bank, Cards',
    icon: <SiPaypal size={20} />,
    color: '#003087',
    bgColor: '#E5F0FF',
  },
  {
    id: 'paylater',
    name: 'Pay Later',
    description: 'Buy now, pay later with PayPal',
    icon: <FaPaypal size={20} />,
    color: '#0070BA',
    bgColor: '#E5F7FF',
  },
];

// Currencies that should use Razorpay
const RAZORPAY_CURRENCIES = ['INR'];

// Currencies that should use Stripe/PayPal
const STRIPE_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY', 'NZD', 'CHF', 'SEK', 'SGD'];

/**
 * Auto-select payment processor based on currency
 * @param {string} currency - Currency code
 * @returns {string} 'razorpay', 'stripe', or 'paypal'
 */
export const autoSelectPaymentProcessor = (currency) => {
  const upperCurrency = currency?.toUpperCase();
  if (RAZORPAY_CURRENCIES.includes(upperCurrency)) {
    // For INR, Razorpay is still the primary recommendation for local UPI/Banking
    return 'razorpay';
  }
  return 'paypal'; // Default to PayPal for international
};

const PaymentSelector = ({
  currency = 'INR',
  totalPrice = 0,
  selectedProcessor: externalSelectedProcessor,
  onProcessorChange,
}) => {
  // Auto-select based on currency
  const defaultProcessor = autoSelectPaymentProcessor(currency);
  const [selectedProcessor, setSelectedProcessor] = useState(externalSelectedProcessor || defaultProcessor);

  // ... (useEffect hooks remain the same)

  return (
    <div className="payment-selector-container">
      {/* ... (Security Badge remains the same) */}

      {/* Payment Processor Tabs */}
      <div className="processor-tabs">
        <button
          type="button"
          className={`processor-tab ${selectedProcessor === 'razorpay' ? 'active' : ''}`}
          onClick={() => handleProcessorChange('razorpay')}
          disabled={currency !== 'INR'}
        >
          <div className="processor-info">
            <span className="processor-name">
              {currency === 'INR' ? '🇮🇳 Razorpay' : 'Razorpay'}
            </span>
            {currency === 'INR' && (
              <span className="processor-badge">Local Best</span>
            )}
          </div>
          <div className="processor-methods">
            <span className="method-tag">UPI</span>
            <span className="method-tag">Banking</span>
            <span className="method-tag">Cards</span>
          </div>
        </button>

        <button
          type="button"
          className={`processor-tab ${selectedProcessor === 'paypal' ? 'active' : ''}`}
          onClick={() => handleProcessorChange('paypal')}
        >
          <div className="processor-info">
            <span className="processor-name">
              {currency === 'INR' ? '💙 PayPal (Testing)' : '💙 PayPal'}
            </span>
            {currency !== 'INR' && (
              <span className="processor-badge">International Best</span>
            )}
          </div>
          <div className="processor-methods">
            <span className="method-tag">PayPal Balance</span>
            <span className="method-tag">INR Support</span>
          </div>
        </button>

        <button
          type="button"
          className={`processor-tab ${selectedProcessor === 'stripe' ? 'active' : ''}`}
          onClick={() => handleProcessorChange('stripe')}
        >
          <div className="processor-info">
            <span className="processor-name">
              Stripe
            </span>
          </div>
          <div className="processor-methods">
            <span className="method-tag">Cards</span>
            <span className="method-tag">Wallet</span>
          </div>
        </button>
      </div>

      {/* Payment Methods Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedProcessor}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="payment-methods-container"
        >
          {selectedProcessor === 'razorpay' && (
            <div className="payment-methods-grid">
              <div className="payment-methods-header">
                <h4>Available Payment Methods</h4>
                <span className="methods-count">({filteredRazorpayMethods.length} options)</span>
              </div>
              <div className="payment-methods-list">
                {filteredRazorpayMethods.map((method) => (
                  <div key={method.id} className="payment-method-item">
                    <div
                      className="method-icon"
                      style={{
                        backgroundColor: method.bgColor,
                        color: method.color,
                      }}
                    >
                      {method.icon}
                    </div>
                    <div className="method-details">
                      <span className="method-name">{method.name}</span>
                      <span className="method-description">{method.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedProcessor === 'paypal' && (
            <div className="payment-methods-grid">
              <div className="payment-methods-header">
                <h4>Available Payment Methods</h4>
                <span className="methods-count">({paypalMethods.length} options)</span>
              </div>
              <div className="payment-methods-list">
                {paypalMethods.map((method) => (
                  <div key={method.id} className="payment-method-item">
                    <div
                      className="method-icon"
                      style={{
                        backgroundColor: method.bgColor,
                        color: method.color,
                      }}
                    >
                      {method.icon}
                    </div>
                    <div className="method-details">
                      <span className="method-name">{method.name}</span>
                      <span className="method-description">{method.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedProcessor === 'stripe' && (
            <div className="payment-methods-grid">
              <div className="payment-methods-header">
                <h4>Available Payment Methods</h4>
                <span className="methods-count">({stripeMethods.length} options)</span>
              </div>
              <div className="payment-methods-list">
                {stripeMethods.map((method) => (
                  <div key={method.id} className="payment-method-item">
                    <div
                      className="method-icon"
                      style={{
                        backgroundColor: method.bgColor,
                        color: method.color,
                      }}
                    >
                      {method.icon}
                    </div>
                    <div className="method-details">
                      <span className="method-name">{method.name}</span>
                      <span className="method-description">{method.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Currency Info */}
      {currency === 'INR' && (
        <div className="currency-info">
          <span className="currency-flag">🇮🇳</span>
          <span>Paying in Indian Rupees (INR) with Razorpay</span>
        </div>
      )}
      {currency !== 'INR' && selectedProcessor === 'paypal' && (
        <div className="currency-info">
          <span>Paying in {currency} with PayPal</span>
        </div>
      )}
      {currency !== 'INR' && selectedProcessor === 'stripe' && (
        <div className="currency-info">
          <span>Paying in {currency} with Stripe</span>
        </div>
      )}

      <style jsx>{`
        .payment-selector-container {
          width: 100%;
          padding: 16px;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          margin-bottom: 16px;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 12px;
          color: #166534;
          font-weight: 500;
        }

        .security-badge svg {
          color: #22C55E;
        }

        .processor-tabs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .processor-tab {
          padding: 12px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 10px;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
        }

        .processor-tab:hover:not(:disabled) {
          border-color: #3B82F6;
          background: #F8FAFC;
        }

        .processor-tab.active {
          border-color: #3B82F6;
          background: #EFF6FF;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .processor-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .processor-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .processor-name {
          font-size: 14px;
          font-weight: 600;
          color: #1F2937;
        }

        .processor-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          background: #10B981;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .processor-methods {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .method-tag {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          background: #F3F4F6;
          color: #6B7280;
          font-weight: 500;
        }

        .processor-tab.active .method-tag {
          background: #DBEAFE;
          color: #1E40AF;
        }

        .payment-methods-container {
          margin-top: 12px;
        }

        .payment-methods-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .payment-methods-header h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: #1F2937;
        }

        .methods-count {
          font-size: 11px;
          color: #6B7280;
        }

        .payment-methods-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .payment-method-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: #F9FAFB;
          border-radius: 8px;
          border: 1px solid #F3F4F6;
        }

        .method-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .method-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .method-name {
          font-size: 13px;
          font-weight: 600;
          color: #1F2937;
        }

        .method-description {
          font-size: 11px;
          color: #6B7280;
        }

        .currency-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #F9FAFB;
          border-radius: 8px;
          margin-top: 12px;
          font-size: 12px;
          color: #6B7280;
        }

        .currency-flag {
          font-size: 16px;
        }

        @media (max-width: 480px) {
          .payment-selector-container {
            padding: 12px;
          }

          .processor-tab {
            padding: 10px 12px;
          }

          .payment-method-item {
            padding: 8px 10px;
          }

          .method-icon {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSelector;
