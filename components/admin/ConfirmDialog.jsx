/**
 * ConfirmDialog Component
 * 
 * Accessible confirmation dialog to replace window.confirm()
 * Features:
 * - Focus trap
 * - Escape key to cancel
 * - Backdrop click to cancel
 * - ARIA dialog attributes
 * - Keyboard navigation
 * 
 * Usage:
 * <ConfirmDialog
 *   isOpen={showDeleteConfirm}
 *   title="Delete Product"
 *   message="Are you sure you want to delete this product? This action cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 */

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconColor: '#ff6b6b',
    confirmBg: 'linear-gradient(135deg, #8B1A1A 0%, #6B1414 100%)',
    confirmHover: 'linear-gradient(135deg, #6B1414 0%, #8B1A1A 100%)',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: '#fbbf24',
    confirmBg: 'linear-gradient(135deg, #C9A84C 0%, #a8882e 100%)',
    confirmHover: 'linear-gradient(135deg, #a8882e 0%, #C9A84C 100%)',
  },
  info: {
    icon: AlertTriangle,
    iconColor: '#60a5fa',
    confirmBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    confirmHover: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info', // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel,
  isLoading = false
}) {
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus trap and escape handler
  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus
    previousFocusRef.current = document.activeElement;

    // Focus confirm button
    setTimeout(() => confirmRef.current?.focus(), 50);

    // Escape key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    // Focus trap
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = [confirmRef.current, cancelRef.current];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('keydown', handleTab);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', handleTab);
      
      // Restore focus
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantConfig = VARIANTS[variant];
  const IconComponent = variantConfig.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--admin-space-4)'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease'
        }}
        aria-hidden="true"
      />

      {/* Dialog Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--admin-surface-2)',
          border: '1px solid var(--admin-border-default)',
          borderRadius: 'var(--admin-radius-xl)',
          padding: 'var(--admin-space-8)',
          boxShadow: 'var(--admin-shadow-lg)',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: 'var(--admin-space-4)',
            right: 'var(--admin-space-4)',
            background: 'transparent',
            border: 'none',
            color: 'var(--admin-text-secondary)',
            cursor: 'pointer',
            padding: 'var(--admin-space-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--admin-radius-sm)',
            transition: 'var(--admin-transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--admin-text-primary)';
            e.currentTarget.style.backgroundColor = 'var(--admin-bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--admin-text-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: variant === 'danger' ? 'var(--admin-red-subtle)' : 'rgba(201, 168, 76, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--admin-space-5)',
            margin: '0 auto var(--admin-space-5)',
            color: variantConfig.iconColor
          }}
        >
          <IconComponent style={{ width: '24px', height: '24px' }} />
        </div>

        {/* Title */}
        <h2
          id="confirm-dialog-title"
          style={{
            fontSize: 'var(--admin-text-xl)',
            fontWeight: 'var(--admin-font-bold)',
            color: 'var(--admin-text-primary)',
            marginBottom: 'var(--admin-space-3)',
            textAlign: 'center'
          }}
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="confirm-dialog-description"
          style={{
            fontSize: 'var(--admin-text-base)',
            color: 'var(--admin-text-secondary)',
            lineHeight: 'var(--admin-leading-relaxed)',
            textAlign: 'center',
            marginBottom: 'var(--admin-space-6)'
          }}
        >
          {message}
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--admin-space-3)',
            justifyContent: 'center'
          }}
        >
          {/* Cancel Button */}
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={isLoading}
            className="admin-btn admin-btn-secondary"
            style={{
              flex: 1,
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {cancelLabel}
          </button>

          {/* Confirm Button */}
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: 'var(--admin-space-3) var(--admin-space-5)',
              background: variantConfig.confirmBg,
              color: 'var(--admin-text-primary)',
              fontWeight: 'var(--admin-font-semibold)',
              fontSize: 'var(--admin-text-md)',
              borderRadius: 'var(--admin-radius-md)',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'var(--admin-transition-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--admin-space-2)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = variantConfig.confirmHover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = variantConfig.confirmBg;
            }}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin"
                  style={{ width: '16px', height: '16px' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
