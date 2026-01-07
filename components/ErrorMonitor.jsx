// components/ErrorMonitor.jsx
// Development error monitoring dashboard
import React, { useState, useEffect } from 'react';
import { errorHandler } from '../lib/errorHandler';
import { HiXMark, HiEye, HiTrash, HiChevronDown, HiChevronRight } from 'react-icons/hi2';
import { BiError, BiTime, BiCode } from 'react-icons/bi';

const ErrorMonitor = ({ 
  isVisible = false, 
  onClose,
  position = 'bottom-right',
  maxErrors = 50 
}) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [errors, setErrors] = useState([]);
  const [expandedErrors, setExpandedErrors] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  useEffect(() => {
    if (!isVisible) return;
    
    // Poll for new errors
    const interval = setInterval(() => {
      const newErrors = errorHandler.getErrorReports()
        .slice(-maxErrors)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setErrors(newErrors);
    }, 1000);

    return () => clearInterval(interval);
  }, [maxErrors, isVisible]);

  const toggleErrorExpansion = (errorId) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(errorId)) {
      newExpanded.delete(errorId);
    } else {
      newExpanded.add(errorId);
    }
    setExpandedErrors(newExpanded);
  };

  const clearAllErrors = () => {
    errorHandler.clearErrorReports();
    setErrors([]);
    setExpandedErrors(new Set());
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#0891b2';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'NETWORK_ERROR': return '🔌';
      case 'AUTH_ERROR': return '🔐';
      case 'AUTHORIZATION_ERROR': return '🚫';
      case 'VALIDATION_ERROR': return '✋';
      case 'SERVER_ERROR': return '⚠️';
      case 'TIMEOUT_ERROR': return '⏱️';
      case 'CLIENT_ERROR': return '💻';
      case 'NOT_FOUND_ERROR': return '❓';
      case 'RATE_LIMIT_ERROR': return '🚦';
      case 'MAINTENANCE_ERROR': return '🔧';
      default: return '❌';
    }
  };

  const filteredErrors = errors
    .filter(error => {
      if (filter === 'all') return true;
      return error.severity === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'severity') {
        const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`error-monitor ${positionClasses[position]}`}>
      <div className="error-monitor-header">
        <div className="header-title">
          <BiError size={20} />
          <span>Error Monitor</span>
          <span className="error-count">({filteredErrors.length})</span>
        </div>
        <div className="header-actions">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="timestamp">By Time</option>
            <option value="severity">By Severity</option>
            <option value="type">By Type</option>
          </select>
          <button onClick={clearAllErrors} className="clear-btn" title="Clear all errors">
            <HiTrash size={16} />
          </button>
          <button onClick={onClose} className="close-btn" title="Close monitor">
            <HiXMark size={16} />
          </button>
        </div>
      </div>

      <div className="error-list">
        {filteredErrors.length === 0 ? (
          <div className="no-errors">
            <span>🎉 No errors found!</span>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <div key={error.id} className="error-item">
              <div 
                className="error-summary" 
                onClick={() => toggleErrorExpansion(error.id)}
              >
                <div className="error-main">
                  <div className="error-icon">
                    {getTypeIcon(error.type)}
                  </div>
                  <div className="error-info">
                    <div className="error-message">{error.message}</div>
                    <div className="error-meta">
                      <span 
                        className="severity-badge"
                        style={{ backgroundColor: getSeverityColor(error.severity) }}
                      >
                        {error.severity}
                      </span>
                      <span className="error-type">{error.type}</span>
                      <span className="error-time">
                        <BiTime size={12} />
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="expand-icon">
                  {expandedErrors.has(error.id) ? (
                    <HiChevronDown size={16} />
                  ) : (
                    <HiChevronRight size={16} />
                  )}
                </div>
              </div>

              {expandedErrors.has(error.id) && (
                <div className="error-details">
                  <div className="detail-section">
                    <h4>Context</h4>
                    <pre className="context-data">
                      {JSON.stringify(error.context, null, 2)}
                    </pre>
                  </div>
                  
                  {error.stack && (
                    <div className="detail-section">
                      <h4>Stack Trace</h4>
                      <pre className="stack-trace">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  <div className="detail-section">
                    <h4>Technical Details</h4>
                    <div className="tech-details">
                      <div><strong>ID:</strong> {error.id}</div>
                      <div><strong>Timestamp:</strong> {error.timestamp}</div>
                      <div><strong>URL:</strong> {error.url || 'Unknown'}</div>
                      <div><strong>User Agent:</strong> {error.userAgent || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .error-monitor {
          position: fixed;
          width: 400px;
          max-height: 600px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }

        .error-monitor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 12px 12px 0 0;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #111827;
        }

        .error-count {
          background: #dc2626;
          color: white;
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-select {
          font-size: 0.75rem;
          padding: 4px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
        }

        .clear-btn, .close-btn {
          padding: 4px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .clear-btn:hover, .close-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .error-list {
          flex: 1;
          overflow-y: auto;
          max-height: 500px;
        }

        .no-errors {
          padding: 40px 20px;
          text-align: center;
          color: #6b7280;
        }

        .error-item {
          border-bottom: 1px solid #f3f4f6;
        }

        .error-item:last-child {
          border-bottom: none;
        }

        .error-summary {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .error-summary:hover {
          background: #f9fafb;
        }

        .error-main {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
        }

        .error-icon {
          font-size: 1.25rem;
          margin-top: 2px;
        }

        .error-info {
          flex: 1;
        }

        .error-message {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .error-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .severity-badge {
          font-size: 0.625rem;
          font-weight: 600;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          text-transform: uppercase;
        }

        .error-type {
          font-size: 0.75rem;
          color: #6b7280;
          font-family: monospace;
        }

        .error-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .expand-icon {
          color: #6b7280;
          margin-top: 2px;
        }

        .error-details {
          padding: 0 16px 16px 16px;
          background: #f9fafb;
        }

        .detail-section {
          margin-bottom: 16px;
        }

        .detail-section:last-child {
          margin-bottom: 0;
        }

        .detail-section h4 {
          margin: 0 0 8px 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .context-data, .stack-trace {
          font-size: 0.75rem;
          background: #1f2937;
          color: #f9fafb;
          padding: 8px;
          border-radius: 4px;
          overflow-x: auto;
          white-space: pre-wrap;
          margin: 0;
          max-height: 200px;
          overflow-y: auto;
        }

        .tech-details {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .tech-details div {
          margin-bottom: 4px;
        }

        .tech-details strong {
          color: #374151;
        }

        @media (max-width: 640px) {
          .error-monitor {
            width: calc(100vw - 32px);
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorMonitor;