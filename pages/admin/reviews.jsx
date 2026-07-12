// pages/admin/reviews.jsx
import AdminLayout from '@/components/admin/AdminLayout';
import Head from 'next/head';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import EmptyState from '@/components/admin/EmptyState';
import { Search, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Admin Reviews page – currently shows an empty state when no review data exists.
 * If a Sanity "review" schema is added later, this page can be expanded to
 * display a table with filtering, actions, and status tabs.
 */
export default function ReviewsPage() {
  // No data fetching yet – placeholder UI only.
  return (
    <AdminLayout title="Reviews">
      <Head>
        <title>Reviews — Sampada Admin</title>
      </Head>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>Reviews</h1>
          {/* Placeholder for future actions */}
        </div>
        {/* Empty State */}
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <EmptyState
            title="No reviews yet"
            description="Reviews will appear here once customers submit them."
          />
          <p style={{ marginTop: '12px', color: 'var(--admin-text-tertiary)', fontSize: '0.875rem' }}>
            To enable reviews, a Sanity "review" schema needs to be created.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
