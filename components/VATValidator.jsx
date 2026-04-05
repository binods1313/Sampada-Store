// components/VATValidator.jsx
// VAT number validation component for EU B2B customers

import React, { useState } from 'react';
import { validateVAT, COUNTRY_NAMES, EU_COUNTRIES } from '../utils/vat';

export default function VATValidator({ onValidate, className = '' }) {
  const [vatNumber, setVatNumber] = useState('');
  const [countryCode, setCountryCode] = useState('DE');
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vatNumber.trim()) {
      return;
    }

    setValidating(true);
    setResult(null);

    try {
      const validation = await validateVAT(vatNumber, countryCode);
      setResult(validation);

      if (validation.valid && onValidate) {
        onValidate(validation);
      }
    } catch (error) {
      console.error('VAT validation error:', error);
      setResult({
        valid: false,
        error: 'Validation failed. Please try again.'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleReset = () => {
    setVatNumber('');
    setResult(null);
  };

  return (
    <div className={`vat-validator ${className}`}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
        VAT Number Validation (EU B2B)
      </h3>
      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
        Enter your VAT number to receive tax-free B2B orders
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Country Selector */}
        <div>
          <label htmlFor="country-select" style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
            Country
          </label>
          <select
            id="country-select"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setResult(null);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            {EU_COUNTRIES.map((code) => (
              <option key={code} value={code}>
                {COUNTRY_NAMES[code] || code}
              </option>
            ))}
          </select>
        </div>

        {/* VAT Number Input */}
        <div>
          <label htmlFor="vat-input" style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
            VAT Number
          </label>
          <input
            id="vat-input"
            type="text"
            value={vatNumber}
            onChange={(e) => {
              setVatNumber(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase());
              setResult(null);
            }}
            placeholder={`e.g., DE123456789`}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
            required
          />
        </div>

        {/* Validate Button */}
        <button
          type="submit"
          disabled={validating || !vatNumber.trim()}
          style={{
            padding: '10px 16px',
            backgroundColor: validating ? '#9CA3AF' : '#1F2937',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: validating ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {validating ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="animate-spin" style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validating...
            </span>
          ) : (
            'Validate VAT Number'
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${result.valid ? '#10B981' : '#EF4444'}`,
            backgroundColor: result.valid ? '#F0FDF4' : '#FEF2F2'
          }}
        >
          {result.valid ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontWeight: '600', color: '#065F46' }}>
                  Valid VAT Number
                </span>
              </div>
              {result.company_name && (
                <p style={{ fontSize: '13px', color: '#065F46', margin: '4px 0' }}>
                  <strong>Company:</strong> {result.company_name}
                </p>
              )}
              {result.company_address && (
                <p style={{ fontSize: '12px', color: '#065F46', margin: '4px 0' }}>
                  <strong>Address:</strong> {result.company_address}
                </p>
              )}
              <p style={{ fontSize: '12px', color: '#065F46', margin: '4px 0' }}>
                <strong>VAT:</strong> {result.country_code}{result.vat_number}
              </p>
              <p style={{ fontSize: '11px', color: '#10B981', marginTop: '8px', fontStyle: 'italic' }}>
                ✓ VAT will be removed from your order total
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontWeight: '600', color: '#991B1B' }}>
                  Invalid VAT Number
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#991B1B', margin: '4px 0' }}>
                {result.error || 'The VAT number could not be validated. Please check and try again.'}
              </p>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            Try Another VAT Number
          </button>
        </div>
      )}
    </div>
  );
}
