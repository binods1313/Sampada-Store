/**
 * EmptyState Component
 * 
 * Reusable empty state illustration with call-to-action
 * Used across all admin pages when no data exists
 * 
 * Usage:
 * <EmptyState
 *   icon={Package}
 *   title="No products yet"
 *   description="Get started by adding your first product"
 *   actionLabel="Add Product"
 *   onAction={() => router.push('/admin/products/new')}
 * />
 */

import React from 'react';
import { Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary', // 'primary' | 'secondary'
  illustration = 'default', // 'default' | 'search' | 'filter'
  children
}) {
  return (
    <div className="admin-empty">
      {/* Icon/Illustration */}
      <div className="admin-empty-icon">
        {Icon ? (
          <Icon style={{ width: '64px', height: '64px', strokeWidth: 1.5 }} />
        ) : (
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {illustration === 'search' ? (
              <>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </>
            ) : illustration === 'filter' ? (
              <>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </>
            ) : (
              <>
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </>
            )}
          </svg>
        )}
      </div>

      {/* Title */}
      {title && (
        <h3 className="admin-empty-title">
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className="admin-empty-description">
          {description}
        </p>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`admin-btn admin-btn-${actionVariant}`}
          style={{ marginTop: 'var(--admin-space-4)' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          {actionLabel}
        </button>
      )}

      {/* Children (for custom content) */}
      {children}
    </div>
  );
}

// Pre-configured variants for common use cases
export function ProductEmptyState({ onAdd, ...props }) {
  return (
    <EmptyState
      icon={null}
      illustration="default"
      title="No products yet"
      description="Get started by adding your first product to the catalog"
      actionLabel="Add Product"
      onAction={onAdd}
      {...props}
    />
  );
}

export function CategoryEmptyState({ onAdd, ...props }) {
  return (
    <EmptyState
      icon={null}
      illustration="default"
      title="No categories yet"
      description="Create your first category to organize products"
      actionLabel="Add Category"
      onAction={onAdd}
      {...props}
    />
  );
}

export function SearchEmptyState({ onClear, ...props }) {
  return (
    <EmptyState
      icon={null}
      illustration="search"
      title="No results found"
      description="Try adjusting your search or filters"
      actionLabel="Clear Filters"
      onAction={onClear}
      actionVariant="secondary"
      {...props}
    />
  );
}

export function FilterEmptyState({ onClear, ...props }) {
  return (
    <EmptyState
      icon={null}
      illustration="filter"
      title="No matching results"
      description="No products match the current filters"
      actionLabel="Clear All Filters"
      onAction={onClear}
      actionVariant="secondary"
      {...props}
    />
  );
}
