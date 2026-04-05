// components/CurrencySelector.jsx
// Global currency selector component

import React from 'react';
import { useCurrencyContext } from '../context/CurrencyContext';
import { CURRENCY_OPTIONS } from '../utils/currency';

export default function CurrencySelector({ className = '', showLabel = true }) {
  const { selectedCurrency, changeCurrency } = useCurrencyContext();

  const handleCurrencyChange = (e) => {
    changeCurrency(e.target.value);
  };

  const selectedOption = CURRENCY_OPTIONS.find(opt => opt.code === selectedCurrency);

  return (
    <div className={`currency-selector ${className}`}>
      {showLabel && (
        <label
          htmlFor="currency-select"
          style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '4px',
            display: 'block'
          }}
        >
          Display Currency
        </label>
      )}
      <select
        id="currency-select"
        value={selectedCurrency}
        onChange={handleCurrencyChange}
        style={{
          width: '100%',
          padding: showLabel ? '8px 12px' : '6px 10px',
          border: '1px solid #D1D5DB',
          borderRadius: '6px',
          fontSize: showLabel ? '14px' : '13px',
          backgroundColor: '#FFFFFF',
          cursor: 'pointer',
          fontWeight: '600',
          color: '#1F2937'
        }}
        aria-label="Select display currency"
      >
        {CURRENCY_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.symbol} {option.code} - {option.name}
          </option>
        ))}
      </select>

      {/* Current Selection Display */}
      {selectedOption && (
        <div
          style={{
            marginTop: '6px',
            padding: '4px 8px',
            backgroundColor: '#F3F4F6',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#6B7280',
            textAlign: 'center'
          }}
        >
          Showing prices in {selectedOption.symbol} {selectedOption.code}
        </div>
      )}
    </div>
  );
}
