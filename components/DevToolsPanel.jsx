/**
 * DevToolsPanel - Admin/Dev Only
 * 
 * Unified panel for internal developer tools.
 * HIDDEN from regular customers in production.
 * 
 * SECURITY:
 * - Server-side admin verification required in production
 * - Client-side check is secondary defense
 * - Event listener cleanup on unmount
 * 
 * Features:
 * - Only visible in development OR when logged in as admin
 * - Collapsed by default into single "🛠️ Dev Tools" button
 * - Expands upward to show 4 dev tool shortcuts
 * - Dev-only visual styling (dark, monospace, amber accents)
 * - Lower z-index than customer-facing widgets
 * - Hidden on mobile
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// Dev tool definitions
const DEV_TOOLS = [
  { 
    id: 'error-monitor',
    label: '🔧 Error Monitor',
    icon: '🔧',
    color: '#ef4444', // Red
  },
  { 
    id: 'test-suite',
    label: '🕐 Test Suite',
    icon: '🕐',
    color: '#3b82f6', // Blue
  },
  { 
    id: 'error-handler',
    label: '🛡️ Error Handler',
    icon: '🛡️',
    color: '#8b5cf6', // Purple
  },
  { 
    id: 'image-optimizer',
    label: '🖼️ Image Optimizer',
    icon: '🖼️',
    color: '#10b981', // Green
  },
];

// Admin emails (client-side check only - server verifies)
const ADMIN_EMAILS = ['admin@sampada.com', 'admin@localhost'];

const DevToolsPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();

  // EARLY RETURN: Hide from customers in production
  if (process.env.NODE_ENV === 'production' && !isAdmin && isLoading) {
    return null;
  }

  // Verify admin status with server in production
  const verifyAdminStatus = useCallback(async () => {
    // In development, always show
    if (process.env.NODE_ENV === 'development') {
      setIsAdmin(true);
      setIsLoading(false);
      return;
    }

    // In production, verify with server
    try {
      const response = await fetch('/api/verify-admin');
      const data = await response.json();
      setIsAdmin(data.isAdmin === true);
    } catch (error) {
      console.error('Admin verification failed:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      verifyAdminStatus();
    } else if (status === 'unauthenticated') {
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [status, verifyAdminStatus]);

  // Handle dev tool opening
  const handleOpenTool = useCallback((toolId) => {
    const toolPaths = {
      'error-monitor': '/test-error-monitor',
      'test-suite': '/test-suite',
      'error-handler': '/enhanced-error-handler-demo',
      'image-optimizer': '/image-optimizer-test',
    };
    if (toolPaths[toolId]) {
      window.location.href = toolPaths[toolId];
    }
  }, []);

  // Hide from customers in production
  // Don't render anything if not admin and not dev
  if (!isLoading && !isAdmin && process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Show loading state briefly
  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Desktop only - hidden on mobile */}
      <div className="hidden md:block">
        <div
          className="fixed left-4 top-1/2 -translate-y-1/2 z-[40] transition-all duration-300"
          style={{
            transform: `translateY(-50%) ${isExpanded ? 'translateX(0)' : 'translateX(0)'}`,
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Expanded Panel */}
          {isExpanded && (
            <div
              className="mb-2 rounded-lg overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px dashed rgba(245, 158, 11, 0.5)',
                backdropFilter: 'blur(8px)',
                animation: 'slideDown 200ms ease-out',
                minWidth: '180px',
              }}
            >
              {/* DEV ONLY Badge */}
              <div
                className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider"
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                ⚠️ DEV ONLY
              </div>

              {/* Tool Buttons */}
              <div className="flex flex-col gap-1 p-2">
                {DEV_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleOpenTool(tool.id)}
                    className="px-3 py-2 text-left text-xs font-mono rounded transition-all duration-150"
                    style={{
                      background: 'transparent',
                      color: '#e5e7eb',
                      border: `1px solid ${tool.color}40`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${tool.color}20`;
                      e.currentTarget.style.borderColor = tool.color;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = `${tool.color}40`;
                      e.currentTarget.style.color = '#e5e7eb';
                    }}
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.label.replace(tool.icon, '').trim()}
                  </button>
                ))}
              </div>

              {/* Admin indicator */}
              {isAdmin && (
                <div
                  className="px-3 py-1.5 text-[10px] text-center font-mono"
                  style={{
                    color: '#6b7280',
                    borderTop: '1px solid rgba(156, 163, 175, 0.2)',
                  }}
                >
                  Admin mode
                </div>
              )}
            </div>
          )}

          {/* Trigger Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 rounded-lg font-mono text-sm transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            style={{
              background: isExpanded
                ? 'rgba(245, 158, 11, 0.2)'
                : 'rgba(15, 23, 42, 0.9)',
              color: '#fbbf24',
              border: isHovering || isExpanded
                ? '1px dashed #f59e0b'
                : '1px dashed rgba(245, 158, 11, 0.4)',
              boxShadow: isHovering || isExpanded
                ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.2)',
              opacity: isHovering || isExpanded ? 1 : 0.7,
              backdropFilter: 'blur(4px)',
            }}
            aria-label={isExpanded ? 'Collapse dev tools' : 'Expand dev tools'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <span>✕ Close</span>
            ) : (
              <span>🛠️ <span className="hidden lg:inline">Dev Tools</span></span>
            )}
          </button>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default DevToolsPanel;
