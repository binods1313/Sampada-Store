/**
 * Breadcrumbs Component
 * 
 * Navigation trail showing current page location
 * Features:
 * - Automatic route detection
 * - Clickable links
 * - Current page highlighted
 * - Responsive (collapses on mobile)
 * 
 * Usage:
 * <Breadcrumbs
 *   items={[
 *     { label: 'Dashboard', href: '/admin' },
 *     { label: 'Products', href: '/admin/products' },
 *     { label: 'Edit Product', current: true }
 *   ]}
 * />
 */

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items, className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`admin-breadcrumbs ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--admin-space-2)',
        marginBottom: 'var(--admin-space-6)',
        flexWrap: 'wrap'
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={item.href || item.label}>
            {/* Separator (except first item) */}
            {!isFirst && (
              <ChevronRight
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'var(--admin-text-muted)',
                  flexShrink: 0
                }}
                aria-hidden="true"
              />
            )}

            {/* Breadcrumb Item */}
            {isLast ? (
              // Current page (not a link)
              <span
                aria-current="page"
                style={{
                  fontSize: 'var(--admin-text-sm)',
                  color: 'var(--admin-text-primary)',
                  fontWeight: 'var(--admin-font-semibold)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </span>
            ) : item.href ? (
              // Link to parent page
              <Link
                href={item.href}
                style={{
                  fontSize: 'var(--admin-text-sm)',
                  color: 'var(--admin-text-secondary)',
                  textDecoration: 'none',
                  transition: 'var(--admin-transition-fast)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--admin-space-1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--admin-gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--admin-text-secondary)';
                }}
              >
                {isFirst && <Home style={{ width: '14px', height: '14px' }} />}
                {item.label}
              </Link>
            ) : (
              // Text only (no href)
              <span
                style={{
                  fontSize: 'var(--admin-text-sm)',
                  color: 'var(--admin-text-secondary)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// Helper to generate breadcrumbs from route
export function useBreadcrumbs() {
  const generateBreadcrumbs = (pathname) => {
    if (!pathname) return [];

    const parts = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always add Dashboard as first item
    breadcrumbs.push({
      label: 'Dashboard',
      href: '/admin'
    });

    // Build breadcrumb for each path segment
    let href = '';
    parts.forEach((part, index) => {
      href += `/${part}`;
      
      // Skip 'admin' part (already have Dashboard)
      if (part === 'admin') return;

      // Format label
      const label = part
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      // Check if this is the current page
      const isCurrent = index === parts.length - 1;

      breadcrumbs.push({
        label,
        href: isCurrent ? undefined : href,
        current: isCurrent
      });
    });

    return breadcrumbs;
  };

  return { generateBreadcrumbs };
}
