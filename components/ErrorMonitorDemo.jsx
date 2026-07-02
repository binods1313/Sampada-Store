// components/ErrorMonitorDemo.jsx
// Demo component showing how to use ErrorMonitor in development
import React, { useState } from 'react';
import { ErrorMonitor } from './';
import { errorHandler, ERROR_TYPES, ERROR_SEVERITY } from '../lib/errorHandler';

const ErrorMonitorDemo = () => {
  const [showMonitor, setShowMonitor] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Demo functions to generate different types of errors
  const generateNetworkError = () => {
    const error = new Error('Failed to fetch user data from API');
    errorHandler.handleError(error, false); // Don't show toast for demo
    errorHandler.reportError({
      type: ERROR_TYPES.NETWORK,
      message: 'Network request failed',
      severity: ERROR_SEVERITY.HIGH,
      context: { endpoint: '/api/users', method: 'GET' }
    });
  };

  const generateValidationError = () => {
    errorHandler.reportError({
      type: ERROR_TYPES.VALIDATION,
      message: 'Email format is invalid',
      severity: ERROR_SEVERITY.MEDIUM,
      context: { field: 'email', value: 'invalid-email' }
    });
  };

  const generateAuthError = () => {
    errorHandler.reportError({
      type: ERROR_TYPES.AUTHENTICATION,
      message: 'Authentication token expired',
      severity: ERROR_SEVERITY.CRITICAL,
      context: { token: 'expired', redirectTo: '/login' }
    });
  };

  const generateServerError = () => {
    errorHandler.reportError({
      type: ERROR_TYPES.SERVER,
      message: 'Internal server error occurred',
      severity: ERROR_SEVERITY.CRITICAL,
      context: { statusCode: 500, endpoint: '/api/orders' }
    });
  };

  const generateTimeoutError = () => {
    errorHandler.reportError({
      type: ERROR_TYPES.TIMEOUT,
      message: 'Request timeout after 30 seconds',
      severity: ERROR_SEVERITY.MEDIUM,
      context: { timeout: 30000, endpoint: '/api/products' }
    });
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '82px', 
      left: '20px', 
      zIndex: 10000,
      background: 'rgba(15, 23, 42, 0.95)',
      borderRadius: '8px',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      minWidth: isExpanded ? '280px' : '40px',
      minHeight: isExpanded ? 'auto' : '40px',
      border: '1px solid rgba(156, 163, 175, 0.3)'
    }}>
      {/* Collapsed state - just the icon */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          style={{
            padding: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          title="Error Monitor Demo (Click to expand)"
        >
          🔧
        </div>
      )}
      
      {/* Expanded state - full panel */}
      {isExpanded && (
        <div style={{ padding: '12px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '1px solid rgba(156, 163, 175, 0.3)',
            paddingBottom: '8px'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              🔧 Error Monitor Demo
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '3px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(156, 163, 175, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
              title="Minimize"
            >
              ➖
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ 
              fontSize: '10px', 
              opacity: '0.8',
              marginBottom: '5px',
              color: '#94a3b8'
            }}>
              Error Monitor & Testing:
            </div>
            <button 
              onClick={() => setShowMonitor(!showMonitor)}
              style={{ 
                padding: '5px 10px', 
                background: showMonitor ? '#dc2626' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {showMonitor ? '❌ Hide Monitor' : '👁️ Show Monitor'}
            </button>
            
            <button 
              onClick={generateNetworkError} 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#4b5563';
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6b7280';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🔌 Network Error
            </button>
            <button 
              onClick={generateValidationError} 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#4b5563';
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6b7280';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ✋ Validation Error
            </button>
            <button 
              onClick={generateAuthError} 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#4b5563';
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6b7280';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🔐 Auth Error
            </button>
            <button 
              onClick={generateServerError} 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#4b5563';
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6b7280';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ⚠️ Server Error
            </button>
            <button 
              onClick={generateTimeoutError} 
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = '#4b5563';
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6b7280';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ⏱️ Timeout Error
            </button>
          </div>
        </div>
      )}

      <ErrorMonitor
        isVisible={showMonitor}
        onClose={() => setShowMonitor(false)}
        position="bottom-right"
        maxErrors={50}
      />
    </div>
  );
};

const buttonStyle = {
  padding: '3px 8px',
  background: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '10px',
  transition: 'all 0.2s ease'
};

export default ErrorMonitorDemo;