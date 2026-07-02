// components/ImageOptimizerTestNavigator.jsx
// Development-only navigation component for Image Optimizer testing

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const ImageOptimizerTestNavigator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const router = useRouter();

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Track current page
  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  // Persist expansion state
  useEffect(() => {
    const saved = localStorage.getItem('imageOptimizer-nav-expanded');
    if (saved) {
      setIsExpanded(JSON.parse(saved));
    }
  }, []);

  const toggleExpanded = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('imageOptimizer-nav-expanded', JSON.stringify(newState));
  }, [isExpanded]);

  const testPages = [
    {
      id: 'demo',
      title: 'Image Optimizer Test',
      url: '/image-optimizer-test',
      icon: '🖼️',
      description: 'Interactive demo page for testing all image optimization features',
      status: 'active'
    },
    {
      id: 'examples',
      title: 'Usage Examples',
      url: '/image-optimizer-examples',
      icon: '📚',
      description: 'Comprehensive test suite for all 8 usage examples',
      status: 'active'
    },
    {
      id: 'performance',
      title: 'Performance Tests',
      url: '/image-optimizer-performance',
      icon: '⚡',
      description: 'Load testing and performance benchmarks',
      status: 'coming-soon'
    }
  ];

  const navigateToPage = useCallback((url, newTab = false) => {
    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(url);
    }
  }, [router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'i':
          case 'I':
            e.preventDefault();
            toggleExpanded();
            break;
          case '1':
            e.preventDefault();
            navigateToPage('/image-optimizer-test');
            break;
          case '2':
            e.preventDefault();
            navigateToPage('/image-optimizer-examples');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleExpanded, navigateToPage]);

  const getPageStatus = (page) => {
    if (page.status === 'coming-soon') return '🚧';
    if (currentPage === page.url) return '📍';
    return '';
  };

  const isCurrentPage = (url) => currentPage === url;

  const styles = {
    container: {
      position: 'fixed',
      top: '230px',
      left: '20px',
      zIndex: 10000,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      color: 'white',
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      fontSize: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      minWidth: isExpanded ? '320px' : '48px',
      minHeight: isExpanded ? 'auto' : '48px',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    header: {
      padding: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      transition: 'all 0.2s ease',
      borderRadius: '12px'
    },
    panel: {
      padding: '16px'
    },
    titleSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
      paddingBottom: '12px'
    },
    title: {
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#10b981',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: '#10b981',
      cursor: 'pointer',
      fontSize: '14px',
      padding: '4px 8px',
      borderRadius: '6px',
      transition: 'background 0.2s ease'
    },
    pageCard: (isActive, isComingSoon) => ({
      border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.3)'}`,
      borderRadius: '8px',
      padding: '12px',
      background: isComingSoon 
        ? 'rgba(64, 64, 64, 0.3)' 
        : isActive 
          ? 'rgba(16, 185, 129, 0.2)' 
          : 'rgba(16, 185, 129, 0.1)',
      transition: 'all 0.2s ease',
      opacity: isComingSoon ? 0.6 : 1,
      cursor: isComingSoon ? 'not-allowed' : 'pointer'
    }),
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '6px'
    },
    pageTitle: {
      fontWeight: 'bold',
      fontSize: '12px',
      color: '#e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    pageUrl: {
      fontSize: '10px',
      color: '#94a3b8',
      fontFamily: 'inherit'
    },
    pageDescription: {
      fontSize: '10px',
      color: '#cbd5e1',
      marginBottom: '8px',
      lineHeight: '1.4'
    },
    buttonGroup: {
      display: 'flex',
      gap: '6px'
    },
    button: {
      padding: '6px 10px',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '10px',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },
    primaryButton: {
      background: '#10b981',
      flex: 1
    },
    secondaryButton: {
      background: '#0ea5e9',
      minWidth: '70px'
    },
    shortcutsSection: {
      marginTop: '12px',
      padding: '10px',
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '6px',
      fontSize: '9px'
    },
    shortcutItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '2px',
      color: '#a7f3d0'
    },
    kbd: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '1px 4px',
      borderRadius: '3px',
      fontSize: '8px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Collapsed state */}
      {!isExpanded && (
        <div 
          onClick={toggleExpanded}
          style={styles.header}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.background = 'rgba(16, 185, 129, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.background = 'transparent';
          }}
          title="Image Optimizer Test Navigator (Ctrl/Cmd + I)"
        >
          🖼️
        </div>
      )}
      
      {/* Expanded state */}
      {isExpanded && (
        <div style={styles.panel}>
          <div style={styles.titleSection}>
            <div style={styles.title}>
              🖼️ Image Optimizer
              <span style={{ fontSize: '10px', color: '#64748b' }}>v2.0</span>
            </div>
            <button
              onClick={toggleExpanded}
              style={styles.closeButton}
              onMouseEnter={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
              title="Minimize (Ctrl/Cmd + I)"
            >
              ➖
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ 
              fontSize: '11px', 
              opacity: '0.9',
              marginBottom: '5px',
              color: '#94a3b8',
              fontWeight: '500'
            }}>
              Test Environments:
            </div>
            
            {testPages.map((page) => {
              const isActive = isCurrentPage(page.url);
              const isComingSoon = page.status === 'coming-soon';
              const status = getPageStatus(page);
              
              return (
                <div 
                  key={page.id}
                  style={styles.pageCard(isActive, isComingSoon)}
                  onMouseEnter={(e) => {
                    if (!isComingSoon) {
                      e.currentTarget.style.background = isActive 
                        ? 'rgba(16, 185, 129, 0.3)' 
                        : 'rgba(16, 185, 129, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isComingSoon) {
                      e.currentTarget.style.background = isActive 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : 'rgba(16, 185, 129, 0.1)';
                      e.currentTarget.style.borderColor = isActive 
                        ? 'rgba(16, 185, 129, 0.6)' 
                        : 'rgba(16, 185, 129, 0.3)';
                    }
                  }}
                >
                  <div style={styles.pageHeader}>
                    <div style={styles.pageTitle}>
                      {page.icon} {page.title} {status}
                    </div>
                    <div style={styles.pageUrl}>
                      {page.url}
                    </div>
                  </div>
                  
                  <div style={styles.pageDescription}>
                    {page.description}
                  </div>
                  
                  {!isComingSoon && (
                    <div style={styles.buttonGroup}>
                      <button
                        onClick={() => navigateToPage(page.url, false)}
                        disabled={isActive}
                        style={{
                          ...styles.button,
                          ...styles.primaryButton,
                          opacity: isActive ? 0.6 : 1,
                          cursor: isActive ? 'default' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.target.style.background = '#059669';
                            e.target.style.transform = 'scale(0.98)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.target.style.background = '#10b981';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                        title={isActive ? 'Currently active' : `Navigate to ${page.title}`}
                      >
                        {isActive ? '📍 Current' : '🚀 Go'}
                      </button>
                      
                      <button
                        onClick={() => navigateToPage(page.url, true)}
                        style={{
                          ...styles.button,
                          ...styles.secondaryButton
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#0284c7';
                          e.target.style.transform = 'scale(0.98)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#0ea5e9';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title={`Open ${page.title} in new tab`}
                      >
                        🔗 New Tab
                      </button>
                    </div>
                  )}
                  
                  {isComingSoon && (
                    <div style={{
                      padding: '6px',
                      background: 'rgba(64, 64, 64, 0.5)',
                      borderRadius: '4px',
                      fontSize: '9px',
                      color: '#9ca3af',
                      textAlign: 'center'
                    }}>
                      Coming Soon
                    </div>
                  )}
                </div>
              );
            })}
            
            <div style={styles.shortcutsSection}>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#10b981' }}>
                ⌨️ Keyboard Shortcuts:
              </div>
              <div style={styles.shortcutItem}>
                <span>Toggle Navigator</span>
                <span style={styles.kbd}>Ctrl/Cmd + I</span>
              </div>
              <div style={styles.shortcutItem}>
                <span>Demo Page</span>
                <span style={styles.kbd}>Ctrl/Cmd + 1</span>
              </div>
              <div style={styles.shortcutItem}>
                <span>Examples Page</span>
                <span style={styles.kbd}>Ctrl/Cmd + 2</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageOptimizerTestNavigator;