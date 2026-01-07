// components/FallbackUI.jsx
// Comprehensive fallback UI components for different error scenarios
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AiOutlineReload as RefreshCw,
  AiOutlineHome as Home,
  AiOutlineShopping as ShoppingBag,
  AiOutlineWifi as Wifi,
  AiOutlineExclamationCircle as AlertTriangle,
  AiOutlineArrowLeft as ArrowLeft,
  AiOutlineExclamationCircle as AlertCircle,
  AiOutlineLoading3Quarters as Loader2,
  AiOutlineCloudServer as CloudOff
} from 'react-icons/ai';
import { RiWifiOffLine as WifiOff } from 'react-icons/ri';

// Enhanced hook for online status with better detection
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true); // Always start as online to avoid hydration mismatch
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag and actual online status
    setIsClient(true);
    setIsOnline(navigator.onLine);
    
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    // Detect connection speed if available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      setConnectionSpeed(connection.effectiveType || 'unknown');
      
      const updateConnection = () => {
        setConnectionSpeed(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', updateConnection);
      
      return () => {
        connection.removeEventListener('change', updateConnection);
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return { isOnline: isClient ? isOnline : true, connectionSpeed };
};

// Enhanced retry logic with exponential backoff
const useRetryLogic = (onRetry, maxAttempts = 3) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [nextRetryDelay, setNextRetryDelay] = useState(1000);

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxAttempts || !onRetry) return;

    setIsRetrying(true);
    
    try {
      await onRetry();
      // Reset on success
      setRetryCount(0);
      setNextRetryDelay(1000);
    } catch (error) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 8000);
      setNextRetryDelay(delay);
      
      console.warn(`Retry attempt ${newRetryCount} failed:`, error);
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry, retryCount, maxAttempts]);

  const canRetry = retryCount < maxAttempts;
  
  return {
    handleRetry,
    isRetrying,
    retryCount,
    canRetry,
    nextRetryDelay,
    maxAttempts
  };
};

/**
 * Enhanced Loading fallback with progress indication and timeout
 */
export const LoadingFallback = ({ 
  message = "Loading...", 
  size = "medium",
  showSpinner = true,
  className = "",
  progress = null, // 0-100 for progress bar
  timeout = null, // Auto-timeout in ms
  onTimeout = null,
  details = null // Additional loading details
}) => {
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  useEffect(() => {
    if (timeout && onTimeout) {
      const timer = setTimeout(() => {
        setTimeoutReached(true);
        onTimeout();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  const sizeClasses = {
    small: "h-20",
    medium: "h-40", 
    large: "h-60",
    full: "h-screen"
  };

  if (timeoutReached) {
    return (
      <div className={`loading-fallback ${sizeClasses[size]} ${className}`}>
        <div className="loading-content">
          <AlertTriangle size={32} className="text-yellow-500 mb-2" />
          <p className="loading-message text-gray-600">Loading is taking longer than expected...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-fallback ${sizeClasses[size]} ${className} flex items-center justify-center bg-gray-50 rounded-lg m-2`}>
      <div className="loading-content text-center text-gray-600">
        {showSpinner && (
          <div className="loading-spinner mb-3">
            <Loader2 
              size={size === 'small' ? 24 : size === 'large' ? 48 : 32} 
              className="animate-spin mx-auto"
              style={{ animation: 'spin 1s linear infinite' }}
            />
          </div>
        )}
        <p className="loading-message text-sm font-medium mb-2">{message}</p>
        
        {progress !== null && (
          <div className="progress-container w-48 mx-auto mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 mt-1 block">{Math.round(progress)}%</span>
          </div>
        )}
        
        {details && (
          <p className="loading-details text-xs text-gray-500">{details}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Enhanced Network error fallback with better diagnostics
 */
export const NetworkErrorFallback = ({ 
  onRetry, 
  message = "Unable to connect to the internet",
  showHomeButton = true,
  showDiagnostics = true,
  errorCode = null,
  maxRetryAttempts = 3
}) => {
  const { isOnline, connectionSpeed } = useOnlineStatus();
  const { handleRetry, isRetrying, retryCount, canRetry } = useRetryLogic(onRetry, maxRetryAttempts);

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const getConnectionAdvice = () => {
    if (!isOnline) return "Check your internet connection";
    if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') {
      return "Your connection seems slow. Try a better network.";
    }
    if (errorCode >= 500) return "Server is experiencing issues. Please try again later.";
    return "There might be a temporary network issue.";
  };

  return (
    <div className="network-error-fallback flex items-center justify-center min-h-80 p-10 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl m-5">
      <div className="error-content text-center max-w-md">
        <div className="error-icon text-red-600 mb-4">
          <WifiOff size={48} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Problem</h3>
        <p className="error-message text-gray-600 mb-4 leading-relaxed">{message}</p>
        
        {showDiagnostics && (
          <div className="diagnostics bg-white/70 rounded-lg p-3 mb-6 text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            {connectionSpeed !== 'unknown' && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Connection:</span>
                <span className="text-gray-800 capitalize">{connectionSpeed}</span>
              </div>
            )}
            
            {errorCode && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Error Code:</span>
                <span className="text-gray-800">{errorCode}</span>
              </div>
            )}
            
            <div className="text-blue-600 text-xs mt-2">
              {getConnectionAdvice()}
            </div>
          </div>
        )}
        
        <div className="error-actions flex gap-3 justify-center flex-wrap">
          <button 
            onClick={handleRetry} 
            disabled={isRetrying || !canRetry}
            className="btn-retry flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:transform hover:-translate-y-0.5"
          >
            {isRetrying ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            {isRetrying ? 'Retrying...' : canRetry ? `Try Again ${retryCount > 0 ? `(${maxRetryAttempts - retryCount} left)` : ''}` : 'Max Retries Reached'}
          </button>
          
          {showHomeButton && (
            <button 
              onClick={handleGoHome} 
              className="btn-home flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 hover:transform hover:-translate-y-0.5"
            >
              <Home size={16} />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Empty state with better actions and customization
 */
export const EmptyStateFallback = ({ 
  title = "No items found",
  message = "There are no items to display at the moment.",
  actionLabel = "Browse Products",
  onAction,
  secondaryActionLabel = null,
  onSecondaryAction = null,
  icon = "shopping",
  className = "",
  showBackButton = false,
  onBack = null,
  illustration = null // Custom illustration component
}) => {
  const icons = {
    shopping: <ShoppingBag size={48} />,
    wifi: <Wifi size={48} />,
    error: <AlertCircle size={48} />
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className={`empty-state-fallback flex items-center justify-center min-h-64 p-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl m-5 ${className}`}>
      <div className="empty-content text-center max-w-md">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="back-button flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 mx-auto transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        
        <div className="empty-icon text-gray-400 mb-4">
          {illustration || icons[icon] || icons.shopping}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="empty-message text-gray-600 mb-6 leading-relaxed">{message}</p>
        
        <div className="actions flex gap-3 justify-center flex-wrap">
          {actionLabel && (
            <button 
              onClick={handleAction} 
              className="btn-action px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:transform hover:-translate-y-0.5"
            >
              {actionLabel}
            </button>
          )}
          
          {secondaryActionLabel && (
            <button 
              onClick={handleSecondaryAction} 
              className="btn-secondary px-6 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 hover:transform hover:-translate-y-0.5"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced Maintenance fallback with better information display
 */
export const MaintenanceFallback = ({ 
  title = "Under Maintenance",
  message = "We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!",
  estimatedTime,
  contactEmail = "support@abscommerce.com",
  maintenanceId = null,
  showProgress = false,
  progressMessage = "Updating systems...",
  socialLinks = null,
  alternateUrl = null
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="maintenance-fallback flex items-center justify-center min-h-screen p-10 bg-gradient-to-br from-yellow-100 to-yellow-200 text-center">
      <div className="maintenance-content max-w-lg">
        <div className="maintenance-icon text-yellow-600 mb-6">
          <CloudOff size={64} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="maintenance-message text-lg text-gray-700 mb-5 leading-relaxed">{message}</p>
        
        {showProgress && (
          <div className="progress-section bg-white/70 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="animate-spin text-yellow-600" size={20} />
              <span className="text-gray-700 font-medium">{progressMessage}</span>
            </div>
          </div>
        )}
        
        <div className="info-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {estimatedTime && (
            <div className="estimated-time bg-white/70 rounded-lg p-4">
              <strong className="block text-gray-800">Estimated time:</strong>
              <span className="text-gray-700">{estimatedTime}</span>
            </div>
          )}
          
          <div className="current-time bg-white/70 rounded-lg p-4">
            <strong className="block text-gray-800">Current time:</strong>
            <span className="text-gray-700">{currentTime.toLocaleTimeString()}</span>
          </div>
          
          {maintenanceId && (
            <div className="maintenance-id bg-white/70 rounded-lg p-4 md:col-span-2">
              <strong className="block text-gray-800">Maintenance ID:</strong>
              <code className="text-sm text-gray-700 bg-gray-200 px-2 py-1 rounded">{maintenanceId}</code>
            </div>
          )}
        </div>
        
        <div className="maintenance-actions flex gap-4 justify-center flex-wrap mb-6">
          <button 
            onClick={() => window.location.reload()} 
            className="btn-refresh flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-200 hover:transform hover:-translate-y-0.5"
          >
            <RefreshCw size={20} />
            Refresh Page
          </button>
          
          <a 
            href={`mailto:${contactEmail}`} 
            className="btn-contact flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 hover:transform hover:-translate-y-0.5 no-underline"
          >
            Contact Support
          </a>
          
          {alternateUrl && (
            <a 
              href={alternateUrl} 
              className="btn-alternate flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:transform hover:-translate-y-0.5 no-underline"
            >
              Visit Mobile Site
            </a>
          )}
        </div>
        
        {socialLinks && (
          <div className="social-links">
            <p className="text-gray-700 mb-3">Follow us for updates:</p>
            <div className="flex gap-4 justify-center">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Enhanced Offline fallback with better connectivity handling
 */
export const OfflineFallback = ({ onRetry, showCacheStatus = false }) => {
  const { isOnline, connectionSpeed } = useOnlineStatus();
  const [cacheSize, setCacheSize] = useState(null);
  
  useEffect(() => {
    // Check cache size if supported
    if ('storage' in navigator && showCacheStatus) {
      navigator.storage.estimate().then(estimate => {
        setCacheSize(estimate.usage || 0);
      }).catch(() => {
        // Ignore errors
      });
    }
  }, [showCacheStatus]);

  const handleRetry = () => {
    if (isOnline && onRetry) {
      onRetry();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="offline-fallback flex items-center justify-center min-h-52 p-10 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl m-5">
      <div className="offline-content text-center max-w-md">
        <div className="offline-icon text-gray-600 mb-4">
          <WifiOff size={48} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">You're Offline</h3>
        <p className="offline-message text-gray-600 mb-4 leading-relaxed">
          {isOnline 
            ? "Connection restored! You can try again now."
            : "Please check your internet connection and try again."
          }
        </p>
        
        <div className="connection-status bg-white/70 rounded-lg p-4 mb-5">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          {isOnline && connectionSpeed !== 'unknown' && (
            <div className="text-sm text-gray-600">
              Connection: <span className="capitalize font-medium">{connectionSpeed}</span>
            </div>
          )}
          
          {showCacheStatus && cacheSize !== null && (
            <div className="text-xs text-gray-500 mt-2">
              Cache: {formatBytes(cacheSize)}
            </div>
          )}
        </div>
        
        {isOnline && onRetry && (
          <button 
            onClick={handleRetry} 
            className="btn-retry flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 hover:transform hover:-translate-y-0.5 mx-auto"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

// Example usage component showing all enhanced fallbacks
const FallbackShowcase = () => {
  const [activeDemo, setActiveDemo] = useState('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (activeDemo === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 10));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [activeDemo]);

  const handleRetry = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Retry completed');
  };

  const demos = {
    loading: (
      <LoadingFallback 
        message="Loading your content..."
        progress={progress}
        details="Fetching latest data"
        timeout={10000}
        onTimeout={() => console.log('Loading timeout!')}
      />
    ),
    network: (
      <NetworkErrorFallback 
        onRetry={handleRetry}
        message="Connection failed while loading content"
        errorCode={503}
        showDiagnostics={true}
      />
    ),
    empty: (
      <EmptyStateFallback 
        title="No products found"
        message="Try adjusting your search filters or browse our featured collections."
        actionLabel="Browse All Products"
        secondaryActionLabel="Clear Filters"
        showBackButton={true}
      />
    ),
    maintenance: (
      <MaintenanceFallback 
        estimatedTime="2 hours"
        maintenanceId="MAINT-2025-001"
        showProgress={true}
        progressMessage="Upgrading database systems..."
        socialLinks={[
          { label: 'Twitter', url: '#' },
          { label: 'Status Page', url: '#' }
        ]}
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Enhanced Fallback UI Components</h1>
      
      <div className="demo-controls mb-6">
        <div className="flex gap-2 flex-wrap">
          {Object.keys(demos).map(demo => (
            <button
              key={demo}
              onClick={() => setActiveDemo(demo)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeDemo === demo 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {demo.charAt(0).toUpperCase() + demo.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="demo-container">
        {demos[activeDemo]}
      </div>
    </div>
  );
};

// Basic CSS styles for fallback components
const fallbackStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .fallback-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .loading-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
    border-radius: 8px;
    margin: 8px;
    padding: 20px;
  }
  
  .network-error-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 320px;
    padding: 40px;
    background: linear-gradient(to bottom right, #fef2f2, #fee2e2);
    border: 1px solid #fecaca;
    border-radius: 12px;
    margin: 20px;
  }
  
  .empty-state-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 256px;
    padding: 40px;
    background-color: #f9fafb;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    margin: 20px;
  }
  
  .maintenance-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 40px;
    background: linear-gradient(to bottom right, #fefce8, #fef3c7);
    text-align: center;
  }
  
  .offline-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 208px;
    padding: 40px;
    background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
    border: 1px solid #d1d5db;
    border-radius: 12px;
    margin: 20px;
  }
  
  .btn-retry, .btn-home, .btn-action, .btn-secondary, .btn-refresh, .btn-contact, .btn-alternate {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }
  
  .btn-retry {
    background-color: #dc2626;
    color: white;
  }
  
  .btn-retry:hover {
    background-color: #b91c1c;
    transform: translateY(-1px);
  }
  
  .btn-retry:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-home, .btn-secondary {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .btn-home:hover, .btn-secondary:hover {
    background-color: #e5e7eb;
    transform: translateY(-1px);
  }
  
  .btn-action {
    background-color: #2563eb;
    color: white;
  }
  
  .btn-action:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
  }
  
  .btn-refresh {
    background-color: #d97706;
    color: white;
  }
  
  .btn-refresh:hover {
    background-color: #b45309;
    transform: translateY(-1px);
  }
  
  .btn-contact {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .btn-contact:hover {
    background-color: #e5e7eb;
    transform: translateY(-1px);
  }
  
  .btn-alternate {
    background-color: #2563eb;
    color: white;
  }
  
  .btn-alternate:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('fallback-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'fallback-styles';
  styleElement.textContent = fallbackStyles;
  document.head.appendChild(styleElement);
}

export default FallbackShowcase;