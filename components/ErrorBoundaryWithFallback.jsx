// components/ErrorBoundaryWithFallback.jsx
// Enhanced error boundary with fallback UI integration
import React from 'react';
import { NetworkErrorFallback, MaintenanceFallback } from './FallbackUI';

class ErrorBoundaryWithFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and any error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report to error monitoring service if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  }

  handleRetry = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Reload the page to restart the application
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
      
      if (isMaintenanceMode) {
        return (
          <MaintenanceFallback 
            title="Site Under Maintenance"
            message="We're currently updating our systems to serve you better. Please check back shortly!"
            estimatedTime={process.env.NEXT_PUBLIC_MAINTENANCE_DURATION || "30 minutes"}
            maintenanceId={process.env.NEXT_PUBLIC_MAINTENANCE_ID || "MAINT-2025-001"}
            showProgress={true}
            progressMessage="Upgrading system components..."
            contactEmail="support@abscommerce.com"
            socialLinks={[
              { label: 'Twitter Updates', url: 'https://twitter.com/abscommerce' },
              { label: 'Status Page', url: 'https://status.abscommerce.com' }
            ]}
          />
        );
      }

      // Check if it's a network error
      const isNetworkError = this.state.error?.message?.includes('fetch') ||
                            this.state.error?.message?.includes('network') ||
                            this.state.error?.message?.includes('Failed to fetch');

      if (isNetworkError) {
        return (
          <NetworkErrorFallback 
            onRetry={this.handleRetry}
            message="Something went wrong while loading the page"
            showHomeButton={true}
            showDiagnostics={true}
          />
        );
      }

      // Generic error fallback
      return (
        <NetworkErrorFallback 
          onRetry={this.handleRetry}
          message={`Application Error: ${this.state.error?.message || 'Something went wrong'}`}
          showHomeButton={true}
          showDiagnostics={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithFallback;