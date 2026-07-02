// components/EnhancedErrorHandlerNavigator.jsx
// Development-only navigation component for Enhanced API Error Handler testing

import React, { useState } from 'react';
import { useRouter } from 'next/router';

const EnhancedErrorHandlerNavigator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const testPages = [
    {
      id: 'demo',
      title: 'Error Handler Demo',
      url: '/enhanced-error-handler-demo',
      icon: '🛡️',
      description: 'Interactive demo page for testing all error handling features'
    },
    {
      id: 'api',
      title: 'Test API Endpoint',
      url: '/api/test-enhanced-error-handler',
      icon: '⚡',
      description: 'Direct API testing with enterprise-grade error handling'
    }
  ];

  const navigateToPage = (url, newTab = false) => {
    if (newTab) {
      window.open(url, '_blank');
    } else {
      router.push(url);
    }
  };

  const containerStyle = {
    position: 'fixed',
    top: '180px', // Positioned below TestSuiteNavigator
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
  };

  const headerStyle = {
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'transform 0.2s ease',
    borderRadius: '8px'
  };

  const panelStyle = {
    padding: '12px'
  };

  const buttonStyle = {
    padding: '4px 8px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '9px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={containerStyle}>
      {/* Collapsed state - just the icon */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          style={headerStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.background = 'rgba(156, 163, 175, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.background = 'transparent';
          }}
          title="Enhanced Error Handler Navigator (Click to expand)"
        >
          🛡️
        </div>
      )}
      
      {/* Expanded state - full panel */}
      {isExpanded && (
        <div style={panelStyle}>
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
              🛡️ Error Handler
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
              Enhanced API Error Handler:
            </div>
            
            {testPages.map((page) => (
              <div 
                key={page.id}
                style={{
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                  borderRadius: '6px',
                  padding: '8px',
                  background: 'rgba(156, 163, 175, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(156, 163, 175, 0.2)';
                  e.target.style.borderColor = 'rgba(156, 163, 175, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(156, 163, 175, 0.1)';
                  e.target.style.borderColor = 'rgba(156, 163, 175, 0.3)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '11px',
                    color: '#e2e8f0'
                  }}>
                    {page.icon} {page.title}
                  </div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                    {page.url}
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '9px', 
                  color: '#cbd5e1',
                  marginBottom: '6px',
                  lineHeight: '1.3'
                }}>
                  {page.description}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '6px'
                }}>
                  <button
                    onClick={() => navigateToPage(page.url, false)}
                    style={{
                      ...buttonStyle,
                      background: '#9ca3af',
                      flex: 1
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#6b7280';
                      e.target.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#9ca3af';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title={`Navigate to ${page.title}`}
                  >
                    🚀 Go
                  </button>
                  
                  <button
                    onClick={() => navigateToPage(page.url, true)}
                    style={{
                      ...buttonStyle,
                      background: '#3b82f6',
                      minWidth: '60px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#2563eb';
                      e.target.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#3b82f6';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title={`Open ${page.title} in new tab`}
                  >
                    🔗 New Tab
                  </button>
                </div>
              </div>
            ))}
            
            <div style={{
              marginTop: '8px',
              padding: '6px',
              background: 'rgba(156, 163, 175, 0.1)',
              border: '1px solid rgba(156, 163, 175, 0.3)',
              borderRadius: '4px',
              fontSize: '9px',
              color: '#d1d5db'
            }}>
              💡 Tip: Test enterprise-grade error handling with Winston logging, rate limiting, and security features.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedErrorHandlerNavigator;