// components/IFSCValidator.jsx
// IFSC code validation component for Indian bank transfers (COD/NEFT)

import React, { useState } from 'react';
import { validateIFSC, getAvailablePaymentMethods } from '../utils/ifsc';

export default function IFSCValidator({ onValidate, className = '' }) {
  const [ifscCode, setIfscCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ifscCode.trim()) {
      return;
    }

    setValidating(true);
    setResult(null);

    try {
      const validation = await validateIFSC(ifscCode);
      setResult(validation);

      if (validation.valid && onValidate) {
        onValidate(validation);
      }
    } catch (error) {
      console.error('IFSC validation error:', error);
      setResult({
        valid: false,
        error: 'Validation failed. Please try again.'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleReset = () => {
    setIfscCode('');
    setResult(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setIfscCode(value);
    setResult(null);
  };

  const paymentMethods = result?.valid ? getAvailablePaymentMethods(result) : null;

  return (
    <div className={`ifsc-validator ${className}`}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
        IFSC Code Validator
      </h3>
      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
        Validate your bank's IFSC code for NEFT/RTGS payments
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* IFSC Code Input */}
        <div>
          <label htmlFor="ifsc-input" style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
            IFSC Code
          </label>
          <input
            id="ifsc-input"
            type="text"
            value={ifscCode}
            onChange={handleInputChange}
            placeholder="e.g., SBIN0001234"
            maxLength={11}
            pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            required
          />
          <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
            Format: 4 letters + 0 + 6 alphanumeric characters
          </p>
        </div>

        {/* Validate Button */}
        <button
          type="submit"
          disabled={validating || ifscCode.length !== 11}
          style={{
            padding: '10px 16px',
            backgroundColor: validating || ifscCode.length !== 11 ? '#9CA3AF' : '#1F2937',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: validating || ifscCode.length !== 11 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {validating ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="animate-spin" style={{ width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span>
          ) : (
            'Validate IFSC Code'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontWeight: '600', color: '#065F46' }}>
                  Valid IFSC Code
                </span>
              </div>

              {/* Bank Details */}
              <div style={{ fontSize: '13px', color: '#065F46', spaceY: '4px' }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>Bank:</strong> {result.bank}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Branch:</strong> {result.branch}
                </p>
                {result.address && (
                  <p style={{ margin: '4px 0', fontSize: '12px' }}>
                    <strong>Address:</strong> {result.address}
                  </p>
                )}
                {result.city && result.state && (
                  <p style={{ margin: '4px 0', fontSize: '12px' }}>
                    <strong>Location:</strong> {result.city}, {result.state}
                  </p>
                )}
              </div>

              {/* Available Payment Methods */}
              {paymentMethods && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #D1FAE5' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#065F46', marginBottom: '8px' }}>
                    Available Payment Methods:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {paymentMethods.upi && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        UPI ✓
                      </span>
                    )}
                    {paymentMethods.neft && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        NEFT ✓
                      </span>
                    )}
                    {paymentMethods.rtgs && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        RTGS ✓
                      </span>
                    )}
                    {paymentMethods.imps && (
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        IMPS ✓
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={handleReset}
                style={{
                  marginTop: '12px',
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                Check Another IFSC
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg style={{ width: '20px', height: '20px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontWeight: '600', color: '#991B1B' }}>
                  Invalid IFSC Code
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#991B1B', margin: '4px 0' }}>
                {result.error || 'The IFSC code could not be validated. Please check and try again.'}
              </p>

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
                Try Another IFSC Code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
