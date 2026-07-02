// hooks/useCurrency.js
// React hook for currency conversion with loading and error states

import { useState, useEffect, useCallback } from 'react';
import { getExchangeRate, convertPrice, formatCurrency } from '../utils/currency';

/**
 * Custom hook for currency conversion
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency (default: 'USD')
 * @param {string} to - Target currency (default: 'INR')
 * @returns {Object} Conversion result with loading and error states
 */
export const useCurrency = (amount, from = 'USD', to = 'INR') => {
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchConversion = async () => {
      // Skip conversion if currencies are the same
      if (from === to) {
        if (mounted) {
          setConvertedAmount(amount);
          setExchangeRate(1);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [rate, converted] = await Promise.all([
          getExchangeRate(from, to),
          convertPrice(amount, from, to)
        ]);

        if (mounted) {
          setExchangeRate(rate);
          setConvertedAmount(converted);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Currency conversion error:', err);
          setError(err.message);
          setConvertedAmount(amount); // Fallback to original amount
          setExchangeRate(1);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (amount) {
      fetchConversion();
    }

    return () => {
      mounted = false;
    };
  }, [amount, from, to]);

  const formattedAmount = convertedAmount !== null 
    ? formatCurrency(convertedAmount, to) 
    : null;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [rate, converted] = await Promise.all([
        getExchangeRate(from, to),
        convertPrice(amount, from, to)
      ]);
      setExchangeRate(rate);
      setConvertedAmount(converted);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [amount, from, to]);

  return {
    convertedAmount,
    exchangeRate,
    formattedAmount,
    loading,
    error,
    refresh
  };
};

/**
 * Custom hook for multi-currency display
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency (default: 'USD')
 * @param {string[]} currencies - Array of target currencies
 * @returns {Object} Multi-currency conversion results
 */
export const useMultiCurrency = (amount, from = 'USD', currencies = ['INR', 'EUR', 'GBP']) => {
  const [conversions, setConversions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchAllConversions = async () => {
      setLoading(true);
      setError(null);

      const results = {};
      
      try {
        await Promise.all(
          currencies.map(async (currency) => {
            try {
              const converted = await convertPrice(amount, from, currency);
              results[currency] = {
                amount: converted,
                formatted: formatCurrency(converted, currency)
              };
            } catch (err) {
              results[currency] = {
                amount: amount,
                formatted: formatCurrency(amount, currency),
                error: err.message
              };
            }
          })
        );

        if (mounted) {
          setConversions(results);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (amount && currencies.length > 0) {
      fetchAllConversions();
    }

    return () => {
      mounted = false;
    };
  }, [amount, from, currencies]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const results = {};
    
    try {
      await Promise.all(
        currencies.map(async (currency) => {
          const converted = await convertPrice(amount, from, currency);
          results[currency] = {
            amount: converted,
            formatted: formatCurrency(converted, currency)
          };
        })
      );
      setConversions(results);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [amount, from, currencies]);

  return {
    conversions,
    loading,
    error,
    refresh
  };
};

export default useCurrency;
