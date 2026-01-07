// FallbackUI Usage Examples
// How to integrate the fallback components in your abscommerce application

import React, { useState, useEffect } from 'react';
import {
  LoadingFallback,
  NetworkErrorFallback,
  EmptyStateFallback,
  MaintenanceFallback,
  OfflineFallback
} from './FallbackUI';

// Example 1: Loading state for data fetching
const ProductList = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingFallback 
        message="Loading products..."
        size="medium"
        details="Fetching latest inventory"
      />
    );
  }

  if (error) {
    return (
      <NetworkErrorFallback 
        onRetry={fetchProducts}
        message="Failed to load products"
        showDiagnostics={true}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyStateFallback 
        title="No products found"
        message="We couldn't find any products matching your criteria."
        actionLabel="Browse All Categories"
        onAction={() => window.location.href = '/categories'}
        secondaryActionLabel="Clear Filters"
        onSecondaryAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          {/* Product content */}
        </div>
      ))}
    </div>
  );
};

// Example 2: Error boundary with fallback
const ErrorBoundaryWithFallback = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  if (hasError) {
    return (
      <NetworkErrorFallback 
        onRetry={handleRetry}
        message="Something went wrong while loading the page"
        showHomeButton={true}
      />
    );
  }

  return children;
};

// Example 3: Maintenance mode component
const MaintenanceMode = () => {
  return (
    <MaintenanceFallback 
      title="Store Temporarily Offline"
      message="We're updating our systems to serve you better. Thanks for your patience!"
      estimatedTime="30 minutes"
      maintenanceId="MAINT-2025-001"
      showProgress={true}
      progressMessage="Upgrading product catalog..."
      contactEmail="support@abscommerce.com"
      socialLinks={[
        { label: 'Twitter Updates', url: 'https://twitter.com/abscommerce' },
        { label: 'Status Page', url: 'https://status.abscommerce.com' }
      ]}
    />
  );
};

// Example 4: Offline detection wrapper
const OfflineWrapper = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true); // Always start as online to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag and actual online status
    setIsClient(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show offline fallback after client-side hydration is complete
  if (isClient && !isOnline) {
    return (
      <OfflineFallback 
        onRetry={() => window.location.reload()}
        showCacheStatus={true}
      />
    );
  }

  return children;
};

// Example 5: Search results with empty state
const SearchResults = ({ query, results, loading, error }) => {
  if (loading) {
    return (
      <LoadingFallback 
        message={`Searching for "${query}"...`}
        size="small"
      />
    );
  }

  if (error) {
    return (
      <NetworkErrorFallback 
        onRetry={() => window.location.reload()}
        message="Search failed"
      />
    );
  }

  if (!results || results.length === 0) {
    return (
      <EmptyStateFallback 
        title={`No results for "${query}"`}
        message="Try different keywords or browse our categories."
        actionLabel="Browse Categories"
        onAction={() => window.location.href = '/categories'}
        secondaryActionLabel="Clear Search"
        onSecondaryAction={() => window.location.href = '/search'}
        showBackButton={true}
      />
    );
  }

  return (
    <div className="search-results">
      {results.map(item => (
        <div key={item.id} className="search-result-item">
          {/* Search result content */}
        </div>
      ))}
    </div>
  );
};

export {
  ProductList,
  ErrorBoundaryWithFallback,
  MaintenanceMode,
  OfflineWrapper,
  SearchResults
};