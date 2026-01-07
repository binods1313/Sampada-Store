import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Bug,
  Shield,
  Activity,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import styles from '../styles/ErrorHandlingTestSuite.module.css';

// Enhanced Error Boundary with better error info
class EnhancedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
      timestamp: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Enhanced error logging
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: this.state.timestamp,
      level: this.props.level || 'component'
    });
  }

  render() {
    if (this.state.hasError) {
      const { level = 'component', name = 'Component' } = this.props;
      
      return (
        <div style={{
          padding: '24px',
          margin: '16px',
          border: '2px solid #fca5a5',
          backgroundColor: '#fef2f2',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle style={{ color: '#dc2626', flexShrink: 0, marginTop: '4px' }} size={24} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>
                {name} Error Boundary Triggered
              </h3>
              <p style={{ color: '#b91c1c', marginBottom: '12px' }}>
                Something went wrong in the {level} level. The error has been contained.
              </p>
              
              <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '0.875rem', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                  <div><strong>Error ID:</strong> {this.state.errorId}</div>
                  <div><strong>Level:</strong> {level}</div>
                  <div><strong>Time:</strong> {new Date(this.state.timestamp).toLocaleTimeString()}</div>
                  <div><strong>Component:</strong> {name}</div>
                </div>
                {this.state.error && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Message:</strong> {this.state.error.message}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Error Recovery Hook
const useErrorRecovery = ({ 
  maxRetries = 3, 
  baseDelay = 1000, 
  onError, 
  onRecovery,
  onMaxRetriesReached 
}) => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);
  const [history, setHistory] = useState([]);
  
  const retryTimeoutRef = useRef(null);
  const countdownRef = useRef(null);

  const executeWithRecovery = useCallback(async (operation) => {
    try {
      setError(null);
      const result = await operation();
      
      if (retryCount > 0) {
        setHistory(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: 'recovery',
          message: `Recovered after ${retryCount} retries`,
          retryCount
        }]);
        onRecovery?.({ retryCount, result });
        setRetryCount(0);
      }
      
      return result;
    } catch (err) {
      const errorInfo = {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: err.message,
        retryCount: retryCount + 1
      };
      
      setHistory(prev => [...prev, errorInfo]);
      setError(err);
      onError?.(err, errorInfo);
      
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        setNextRetryIn(delay / 1000);
        
        // Countdown timer
        countdownRef.current = setInterval(() => {
          setNextRetryIn(prev => {
            const next = prev - 1;
            if (next <= 0) {
              clearInterval(countdownRef.current);
              return 0;
            }
            return next;
          });
        }, 1000);
        
        retryTimeoutRef.current = setTimeout(async () => {
          setIsRetrying(false);
          await executeWithRecovery(operation);
        }, delay);
      } else {
        onMaxRetriesReached?.(err);
      }
      
      throw err;
    }
  }, [retryCount, maxRetries, baseDelay, onError, onRecovery, onMaxRetriesReached]);

  const manualRetry = useCallback((operation) => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setIsRetrying(false);
    setNextRetryIn(0);
    return executeWithRecovery(operation);
  }, [executeWithRecovery]);

  const reset = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
    setNextRetryIn(0);
    setHistory([]);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return {
    executeWithRecovery,
    manualRetry,
    reset,
    error,
    isRetrying,
    retryCount,
    maxRetries,
    nextRetryIn,
    history,
    canRetry: error && retryCount < maxRetries
  };
};

// Comprehensive Error Types for Testing
const ERROR_TYPES = {
  NETWORK: { 
    name: 'Network Error', 
    message: 'Failed to fetch data from server',
    recoverable: true,
    severity: 'medium'
  },
  VALIDATION: { 
    name: 'Validation Error', 
    message: 'Invalid input data provided',
    recoverable: false,
    severity: 'low'
  },
  AUTHENTICATION: { 
    name: 'Auth Error', 
    message: 'User authentication failed',
    recoverable: false,
    severity: 'high'
  },
  TIMEOUT: { 
    name: 'Timeout Error', 
    message: 'Request timed out after 30 seconds',
    recoverable: true,
    severity: 'medium'
  },
  SERVER: { 
    name: 'Server Error', 
    message: 'Internal server error occurred',
    recoverable: true,
    severity: 'high'
  },
  PARSE: { 
    name: 'Parse Error', 
    message: 'Failed to parse response data',
    recoverable: false,
    severity: 'medium'
  },
  CRITICAL: { 
    name: 'Critical System Error', 
    message: 'Critical system failure detected',
    recoverable: false,
    severity: 'critical'
  }
};

// Test Component that throws specific errors
const ErrorGenerator = ({ errorType, delay = 0 }) => {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldThrow(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShouldThrow(true);
    }
  }, [delay]);

  if (shouldThrow && errorType) {
    const errorConfig = ERROR_TYPES[errorType];
    const error = new Error(errorConfig.message);
    error.name = errorConfig.name;
    error.severity = errorConfig.severity;
    error.recoverable = errorConfig.recoverable;
    throw error;
  }

  return (
    <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px' }}>
      <CheckCircle style={{ display: 'inline', marginRight: '8px', color: '#16a34a' }} size={16} />
      Component rendered successfully
    </div>
  );
};

// Enhanced Resilient API Hook
const useResilientAPI = ({ baseURL = '/api', maxRetries = 3 }) => {
  const [isOnline, setIsOnline] = useState(true); // Safe default for SSR
  const [isClient, setIsClient] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  
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

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    const logRequest = (status, data = null, error = null) => {
      const duration = Date.now() - startTime;
      setRequestHistory(prev => [...prev.slice(-9), {
        id: requestId,
        endpoint,
        status,
        duration,
        timestamp: new Date().toISOString(),
        data: data ? 'Success' : null,
        error: error?.message || null
      }]);
    };

    try {
      if (!isOnline) {
        const queueItem = { endpoint, options, requestId, timestamp: Date.now() };
        setOfflineQueue(prev => [...prev, queueItem]);
        logRequest('queued');
        throw new Error('Request queued for when online');
      }

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate different response scenarios
          const scenarios = ['success', 'network_error', 'timeout', 'server_error'];
          const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
          
          switch (scenario) {
            case 'success':
              resolve({ data: 'Mock API response', endpoint });
              break;
            case 'network_error':
              reject(new Error('Network connection failed'));
              break;
            case 'timeout':
              reject(new Error('Request timeout'));
              break;
            case 'server_error':
              reject(new Error('Internal server error'));
              break;
          }
        }, 1000 + Math.random() * 2000);
      });

      const mockData = { 
        success: true, 
        data: `Response from ${endpoint}`,
        timestamp: new Date().toISOString(),
        requestId
      };
      
      logRequest('success', mockData);
      return mockData;
      
    } catch (error) {
      logRequest('error', null, error);
      throw error;
    }
  }, [isOnline]);

  return {
    makeRequest,
    isOnline: isClient ? isOnline : true, // Return safe value until client-side
    offlineQueue: offlineQueue.length,
    requestHistory
  };
};

// Main Test Suite Component
const ErrorHandlingTestSuite = () => {
  const [activeTest, setActiveTest] = useState('');
  const [testResults, setTestResults] = useState({});
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [testConfig, setTestConfig] = useState({
    autoRetry: true,
    maxRetries: 3,
    showDetails: true,
    simulateRecovery: true
  });
  
  const api = useResilientAPI({ maxRetries: testConfig.maxRetries });
  
  const errorRecovery = useErrorRecovery({
    maxRetries: testConfig.maxRetries,
    baseDelay: 1000,
    onError: (error, info) => {
      console.log('Recovery error:', { error: error.message, info });
    },
    onRecovery: (info) => {
      console.log('Recovery successful:', info);
    },
    onMaxRetriesReached: (error) => {
      console.log('Max retries reached:', error.message);
    }
  });

  // Test Operations
  const testOperations = {
    networkRequest: async () => {
      const success = testConfig.simulateRecovery 
        ? Math.random() > 0.3 // 70% chance of success
        : Math.random() > 0.8; // 20% chance of success
        
      if (!success) {
        throw new Error('Simulated network failure');
      }
      return 'Network request successful';
    },
    
    dataProcessing: async () => {
      const success = testConfig.simulateRecovery 
        ? Math.random() > 0.4
        : Math.random() > 0.7;
        
      if (!success) {
        throw new Error('Data processing failed');
      }
      return 'Data processed successfully';
    },
    
    apiCall: () => api.makeRequest('/test-endpoint')
  };

  // Run individual test
  const runTest = async (testName, operation) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status: 'running', startTime: Date.now() }
    }));

    try {
      const result = await errorRecovery.executeWithRecovery(operation);
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: 'success', 
          result: typeof result === 'string' ? result : JSON.stringify(result),
          duration: Date.now() - prev[testName].startTime,
          retryCount: errorRecovery.retryCount
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: 'failed', 
          error: error.message,
          duration: Date.now() - (prev[testName]?.startTime || Date.now()),
          retryCount: errorRecovery.retryCount
        }
      }));
    }
  };

  // Run batch tests
  const runBatchTests = async () => {
    setIsRunningBatch(true);
    setTestResults({});
    
    for (const [name, operation] of Object.entries(testOperations)) {
      await runTest(name, operation);
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between tests
    }
    
    setIsRunningBatch(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Clock className={styles.spin} style={{ color: '#3b82f6' }} size={16} />;
      case 'success': return <CheckCircle style={{ color: '#16a34a' }} size={16} />;
      case 'failed': return <XCircle style={{ color: '#dc2626' }} size={16} />;
      default: return null;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'running': return styles.testResultRunning;
      case 'success': return styles.testResultSuccess;
      case 'failed': return styles.testResultFailed;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Shield style={{ color: '#2563eb' }} size={32} />
          <div>
            <h1 className={styles.title}>Enhanced Error Handling Test Suite</h1>
            <p className={styles.subtitle}>Comprehensive testing for error boundaries, recovery mechanisms, and fallback UIs</p>
          </div>
        </div>

        {/* Test Configuration */}
        <div className={styles.configSection}>
          <div className={styles.configHeader}>
            <Settings size={18} />
            <h3 className={styles.configTitle}>Test Configuration</h3>
          </div>
          <div className={styles.configGrid}>
            <label className={styles.configItem}>
              <input
                type="checkbox"
                checked={testConfig.autoRetry}
                onChange={(e) => setTestConfig(prev => ({ ...prev, autoRetry: e.target.checked }))}
              />
              Auto Retry
            </label>
            <label className={styles.configItem}>
              <input
                type="checkbox"
                checked={testConfig.simulateRecovery}
                onChange={(e) => setTestConfig(prev => ({ ...prev, simulateRecovery: e.target.checked }))}
              />
              Simulate Recovery
            </label>
            <div className={styles.configItem}>
              <span style={{ fontSize: '0.875rem' }}>Max Retries:</span>
              <select
                value={testConfig.maxRetries}
                onChange={(e) => setTestConfig(prev => ({ ...prev, maxRetries: Number(e.target.value) }))}
                className={styles.configSelect}
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div className={styles.configItem}>
              <span className={`${styles.statusBadge} ${
                api.isOnline ? styles.statusOnline : styles.statusOffline
              }`}>
                {api.isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                {api.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gridLayout}>
        {/* Error Boundary Tests */}
        <div className={styles.testSection}>
          <div className={styles.sectionHeader}>
            <Bug style={{ color: '#9333ea' }} size={20} />
            <h2 className={styles.sectionTitle}>Error Boundary Tests</h2>
          </div>
          
          <div className={styles.testButtons}>
            {Object.entries(ERROR_TYPES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveTest(key)}
                className={`${styles.testButton} ${
                  activeTest === key ? styles.testButtonActive : ''
                }`}
              >
                <div className={styles.testButtonContent}>
                  <div className={styles.testButtonDetails}>
                    <div className={styles.testButtonName}>{config.name}</div>
                    <div className={styles.testButtonDescription}>{config.message}</div>
                  </div>
                  <div className={styles.testButtonMeta}>
                    <span className={`${styles.severityBadge} ${
                      config.severity === 'critical' ? styles.severityCritical :
                      config.severity === 'high' ? styles.severityHigh :
                      config.severity === 'medium' ? styles.severityMedium :
                      styles.severityLow
                    }`}>
                      {config.severity}
                    </span>
                    {config.recoverable ? (
                      <CheckCircle style={{ color: '#16a34a' }} size={14} />
                    ) : (
                      <XCircle style={{ color: '#dc2626' }} size={14} />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {activeTest && (
            <div className={styles.errorBoundaryContainer}>
              <h4 className={styles.errorBoundaryTitle}>Testing: {ERROR_TYPES[activeTest].name}</h4>
              <EnhancedErrorBoundary level="component" name={ERROR_TYPES[activeTest].name}>
                <ErrorGenerator errorType={activeTest} delay={1000} />
              </EnhancedErrorBoundary>
            </div>
          )}
        </div>

        {/* Error Recovery Tests */}
        <div className={styles.testSection}>
          <div className={styles.sectionHeader}>
            <Activity style={{ color: '#16a34a' }} size={20} />
            <h2 className={styles.sectionTitle}>Error Recovery Tests</h2>
          </div>

          <div className={styles.testButtons}>
            <button
              onClick={runBatchTests}
              disabled={isRunningBatch}
              className={styles.primaryButton}
            >
              {isRunningBatch ? <Clock className={styles.spin} size={16} /> : <Play size={16} />}
              {isRunningBatch ? 'Running Tests...' : 'Run All Recovery Tests'}
            </button>
            
            <button
              onClick={errorRecovery.reset}
              className={styles.secondaryButton}
            >
              <RotateCcw size={16} />
              Reset All Tests
            </button>
          </div>

          {/* Test Results */}
          <div className={styles.testResults}>
            {Object.entries(testOperations).map(([name, operation]) => {
              const result = testResults[name];
              return (
                <div
                  key={name}
                  className={`${styles.testResult} ${getStatusClasses(result?.status)}`}
                >
                  <div className={styles.testResultHeader}>
                    <div className={styles.testResultTitle}>
                      {getStatusIcon(result?.status)}
                      <span className={styles.testResultName}>{name.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                    <button
                      onClick={() => runTest(name, operation)}
                      disabled={result?.status === 'running'}
                      className={styles.testResultButton}
                    >
                      Test
                    </button>
                  </div>
                  
                  {result && (
                    <div className={styles.testResultDetails}>
                      {result.status === 'success' && (
                        <div className={styles.successMessage}>✓ {result.result}</div>
                      )}
                      {result.status === 'failed' && (
                        <div className={styles.errorMessage}>✗ {result.error}</div>
                      )}
                      <div className={styles.testResultMeta}>
                        <span>Duration: {result.duration}ms</span>
                        <span>Retries: {result.retryCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Recovery Status */}
      {(errorRecovery.isRetrying || errorRecovery.error) && (
        <div className={styles.recoveryStatus}>
          <h3 className={styles.recoveryTitle}>Recovery Status</h3>
          
          {errorRecovery.isRetrying && (
            <div className={styles.retryIndicator}>
              <Clock className={styles.spin} style={{ color: '#2563eb' }} size={16} />
              <span>Retrying in {errorRecovery.nextRetryIn}s... (Attempt {errorRecovery.retryCount}/{errorRecovery.maxRetries})</span>
            </div>
          )}

          {errorRecovery.history.length > 0 && (
            <div className={styles.historySection}>
              <h4 className={styles.historyTitle}>Recovery History</h4>
              <div className={styles.historyList}>
                {errorRecovery.history.slice(-5).map((entry, index) => (
                  <div key={index} className={styles.historyItem}>
                    <span className={styles.historyTime}>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className={entry.type === 'recovery' ? styles.historyRecovery : styles.historyError}>
                      {entry.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* API Request History */}
      {api.requestHistory.length > 0 && (
        <div className={styles.apiHistory}>
          <h3 className={styles.apiHistoryTitle}>API Request History</h3>
          <div className={styles.apiTable}>
            <table className={styles.apiTableElement}>
              <thead className={styles.apiTableHeader}>
                <tr>
                  <th className={styles.apiTableHeaderCell}>Time</th>
                  <th className={styles.apiTableHeaderCell}>Endpoint</th>
                  <th className={styles.apiTableHeaderCell}>Status</th>
                  <th className={styles.apiTableHeaderCell}>Duration</th>
                  <th className={styles.apiTableHeaderCell}>Result</th>
                </tr>
              </thead>
              <tbody>
                {api.requestHistory.slice(-10).map((req) => (
                  <tr key={req.id} className={styles.apiTableRow}>
                    <td className={styles.apiTableCell}>{new Date(req.timestamp).toLocaleTimeString()}</td>
                    <td className={`${styles.apiTableCell} ${styles.apiEndpoint}`}>{req.endpoint}</td>
                    <td className={styles.apiTableCell}>
                      <span className={`${
                        req.status === 'success' ? styles.apiStatusSuccess :
                        req.status === 'error' ? styles.apiStatusError :
                        styles.apiStatusQueued
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className={styles.apiTableCell}>{req.duration}ms</td>
                    <td className={`${styles.apiTableCell} ${styles.errorDetails}`}>{req.error || req.data || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorHandlingTestSuite;