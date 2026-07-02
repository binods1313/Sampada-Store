// context/CurrencyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getExchangeRate, CURRENCY_LOCALES } from '../utils/currency';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Selected currency, default to INR
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedCurrency') || 'INR';
    }
    return 'INR';
  });

  // Exchange rates state
  const [exchangeRates, setExchangeRates] = useState({});

  // Load exchange rates on mount
  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch live rates, falling back to hard‑coded rates', error);
        setExchangeRates({ INR: 83.5, USD: 1, EUR: 0.92, GBP: 0.79, AED: 3.67, SGD: 1.34 });
      }
    }
    fetchRates();
  }, []);

  // Persist selected currency to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCurrency', selectedCurrency);
    }
  }, [selectedCurrency]);

  const changeCurrency = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };

  // Helper to convert price using loaded rates and format with currency style
  const convertPrice = (value, targetCurrency = selectedCurrency) => {
    const numeric = Number(value);
    if (!numeric || isNaN(numeric)) return '0.00';
    const rate = exchangeRates[targetCurrency] || 1;
    const converted = numeric * rate;
    // Format using Intl.NumberFormat with currency style
    const formatter = new Intl.NumberFormat(CURRENCY_LOCALES[targetCurrency] || 'en-US', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(converted);
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        changeCurrency,
        exchangeRates,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);

export default CurrencyContext;
