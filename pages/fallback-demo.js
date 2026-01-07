// pages/fallback-demo.js
// Demo page to showcase all fallback UI components
import React, { useState } from 'react';
import Head from 'next/head';
import { 
  LoadingFallback, 
  NetworkErrorFallback, 
  EmptyStateFallback, 
  MaintenanceFallback, 
  OfflineFallback 
} from '../components';

const FallbackDemo = () => {
  const [activeDemo, setActiveDemo] = useState('loading');
  const [progress, setProgress] = useState(45);

  const handleRetry = () => {
    console.log('Retry triggered');
    // In a real app, this would reload data or retry the failed operation
  };

  const demos = {
    loading: (
      <LoadingFallback 
        message="Loading products..."
        size="medium"
        progress={progress}
        details="Fetching latest inventory data"
        showSpinner={true}
      />
    ),
    network: (
      <NetworkErrorFallback 
        onRetry={handleRetry}
        message="Failed to connect to the server"
        showHomeButton={true}
        showDiagnostics={true}
        errorCode={503}
        maxRetryAttempts={3}
      />
    ),
    empty: (
      <EmptyStateFallback 
        title="No products found"
        message="We couldn't find any products matching your search criteria. Try adjusting your filters or browse our categories."
        actionLabel="Browse All Products"
        onAction={() => console.log('Browse all clicked')}
        secondaryActionLabel="Clear Filters"
        onSecondaryAction={() => console.log('Clear filters clicked')}
        showBackButton={true}
        onBack={() => console.log('Back clicked')}
        icon="shopping"
      />
    ),
    maintenance: (
      <MaintenanceFallback 
        title="Store Under Maintenance"
        message="We're updating our systems to serve you better. Thanks for your patience!"
        estimatedTime="2 hours"
        maintenanceId="MAINT-2025-001"
        showProgress={true}
        progressMessage="Upgrading product catalog and payment systems..."
        contactEmail="support@abscommerce.com"
        socialLinks={[
          { label: 'Twitter Updates', url: 'https://twitter.com/abscommerce' },
          { label: 'Status Page', url: 'https://status.abscommerce.com' }
        ]}
        alternateUrl="https://m.abscommerce.com"
      />
    ),
    offline: (
      <OfflineFallback 
        onRetry={handleRetry}
        showCacheStatus={true}
      />
    )
  };

  return (
    <>
      <Head>
        <title>Fallback UI Demo - abscommerce</title>
        <meta name="description" content="Demo page showcasing all fallback UI components" />
      </Head>
      
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Fallback UI Components Demo
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Click on the buttons below to see different fallback states in action
        </p>

        {/* Control Panel */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {Object.keys(demos).map(demo => (
            <button
              key={demo}
              onClick={() => setActiveDemo(demo)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeDemo === demo ? '#ef4444' : '#f3f4f6',
                color: activeDemo === demo ? 'white' : '#374151'
              }}
            >
              {demo.charAt(0).toUpperCase() + demo.slice(1)} State
            </button>
          ))}
        </div>

        {/* Progress Control for Loading Demo */}
        {activeDemo === 'loading' && (
          <div style={{ 
            marginBottom: '2rem',
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px',
              fontWeight: '500'
            }}>
              Loading Progress: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              style={{
                width: '200px',
                margin: '0 10px'
              }}
            />
          </div>
        )}

        {/* Demo Area */}
        <div style={{ 
          border: '2px dashed #d1d5db',
          borderRadius: '12px',
          minHeight: '400px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {demos[activeDemo]}
        </div>

        {/* Integration Info */}
        <div style={{ 
          marginTop: '3rem',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #0ea5e9'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#0369a1'
          }}>
            Integration Status ✅
          </h2>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            color: '#0c4a6e'
          }}>
            <li style={{ marginBottom: '8px' }}>✅ LoadingFallback integrated in main product listings</li>
            <li style={{ marginBottom: '8px' }}>✅ EmptyStateFallback integrated for no products/orders scenarios</li>
            <li style={{ marginBottom: '8px' }}>✅ NetworkErrorFallback integrated for API and connection errors</li>
            <li style={{ marginBottom: '8px' }}>✅ OfflineWrapper integrated globally in _app.js</li>
            <li style={{ marginBottom: '8px' }}>✅ Enhanced ErrorBoundary with fallback UI for app crashes</li>
            <li style={{ marginBottom: '8px' }}>✅ MaintenanceFallback available for scheduled maintenance</li>
          </ul>
        </div>

        {/* Usage Examples */}
        <div style={{ 
          marginTop: '2rem',
          padding: '20px',
          backgroundColor: '#fefce8',
          borderRadius: '8px',
          border: '1px solid #eab308'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#92400e'
          }}>
            Where These Components Are Used:
          </h3>
          <ul style={{ 
            color: '#78350f',
            lineHeight: '1.6'
          }}>
            <li><strong>Home Page (/):</strong> LoadingFallback for product loading, EmptyStateFallback for no products</li>
            <li><strong>Account Page (/account):</strong> LoadingFallback for account loading, EmptyStateFallback for no orders, NetworkErrorFallback for errors</li>
            <li><strong>Global App:</strong> OfflineWrapper detects network status, Enhanced ErrorBoundary catches crashes</li>
            <li><strong>Error Monitoring:</strong> ErrorMonitor component for development debugging</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FallbackDemo;