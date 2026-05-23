// components/CurrencySelector.jsx
// Updated Currency Selector with pill UI and flag emojis

import React from 'react';
import { useCurrencyContext } from '../context/CurrencyContext';
import { CURRENCY_OPTIONS } from '../utils/currency';

// Mapping of currency codes to flag emojis
const FLAG_EMOJIS = {
  INR: '🇮🇳',
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  AED: '🇦🇪',
  SGD: '🇸🇬',
};

export default function CurrencySelector({ className = '', showLabel = true }) {
  const { selectedCurrency, changeCurrency } = useCurrencyContext();

  const handleCurrencyChange = (e) => {
    changeCurrency(e.target.value);
  };

  const selectedOption = CURRENCY_OPTIONS.find((opt) => opt.code === selectedCurrency);

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
            display: 'block',
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
          maxWidth: '90px',
          padding: showLabel ? '8px 12px' : '6px 10px',
          border: 'none',
          borderRadius: '9999px', // pill shape
          backgroundColor: '#8B1A1A', // brand maroon
          color: '#FFFFFF',
          fontSize: showLabel ? '14px' : '13px',
          fontWeight: '600',
          cursor: 'pointer',
          appearance: 'none', // remove default arrow style
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 20 20'><path d='M5.25 7.5L10 12.25l4.75-4.75'/></svg>")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '10px',
        }}
        aria-label="Select display currency"
      >
        {CURRENCY_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} style={{ color: '#000000' }}>
            {FLAG_EMOJIS[option.code] || ''} {option.code}
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
            textAlign: 'center',
          }}
        >
          Showing prices in {FLAG_EMOJIS[selectedOption.code] || ''} {selectedOption.symbol}{' '}{selectedOption.code}
        </div>
      )}
    </div>
  );
}
