// components/TestSuiteNavigator.jsx
// Navigation component for accessing error handling test pages
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const TestSuiteNavigator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Test pages configuration
  const testPages = [
    {
      id: 'simple-test',
      title: 'Simple Test',
      url: '/simple-test',
      icon: '🧪',
      description: 'Basic component test with lucide-react icons'
    },
    {
      id: 'test-error-component',
      title: 'Debug Test',
      url: '/test-error-component',
      icon: '🔍',
      description: 'Debug test page with console logging'
    },
    {
      id: 'error-test-suite',
      title: 'Error Test Suite',
      url: '/error-test-suite',
      icon: '🛡️',
      description: 'Main ErrorHandlingTestSuite component'
    }
  ];

  const navigateToPage = (url) => {
    router.push(url);
    setIsExpanded(false); // Close the navigator after navigation
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank');
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '130px', // Position below ErrorMonitorDemo
      left: '20px', 
      zIndex: 10000,
      background: 'rgba(15, 23, 42, 0.95)', // Slightly different color scheme
      borderRadius: '8px',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      minWidth: isExpanded ? '280px' : '40px',
      minHeight: isExpanded ? 'auto' : '40px',
      border: '1px solid rgba(59, 130, 246, 0.3)'
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
            transition: 'transform 0.2s ease',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.background = 'rgba(59, 130, 246, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.background = 'transparent';
          }}
          title="Test Suite Navigator (Click to expand)"
        >
          🧭
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
            borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
            paddingBottom: '8px'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '12px',
              color: '#60a5fa'
            }}>
              🧭 Test Suite Navigator
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#60a5fa',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '3px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(96, 165, 250, 0.2)'}
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
              Error Handling Test Pages:
            </div>
            
            {testPages.map((page) => (
              <div 
                key={page.id}
                style={{
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '8px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
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
                    onClick={() => navigateToPage(page.url)}
                    style={{
                      ...testPageButtonStyle,
                      background: '#3b82f6',
                      flex: 1
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#2563eb';
                      e.target.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#3b82f6';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title={`Navigate to ${page.title}`}
                  >
                    🚀 Go
                  </button>
                  
                  <button
                    onClick={() => openInNewTab(page.url)}
                    style={{
                      ...testPageButtonStyle,
                      background: '#059669',
                      minWidth: '60px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#047857';
                      e.target.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#059669';
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
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '4px',
              fontSize: '9px',
              color: '#a7f3d0'
            }}>
              💡 Tip: Use these pages to test error handling, recovery mechanisms, and component functionality.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const testPageButtonStyle = {
  padding: '4px 8px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '9px',
  fontWeight: 'bold',
  transition: 'all 0.2s ease'
};

export default TestSuiteNavigator;