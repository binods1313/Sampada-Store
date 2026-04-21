import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import BulkAutoTag from '../../components/admin/BulkAutoTag';

export default function BulkTagPage() {
  return (
    <AdminLayout title="Bulk Auto Tag">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Bulk Tag', current: true }
      ]} />

      <div style={{ maxWidth: 'var(--admin-content-max-width)', margin: '0 auto', padding: '0 var(--admin-space-8)' }}>
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            padding: 'var(--admin-space-6)',
            borderBottom: 'var(--admin-border-width-sm) solid var(--admin-border-subtle)',
            background: 'var(--admin-surface-1)'
          }}>
            <h2 className="admin-heading" style={{ margin: '0 0 var(--admin-space-1) 0' }}>
              Bulk Auto-Tag Products
            </h2>
            <p className="admin-text-secondary admin-text-sm" style={{ margin: 0 }}>
              Automatically generate AI tags, descriptions, and SEO keywords for your entire catalog
            </p>
          </div>

          {/* Bulk Tag Component */}
          <div style={{ padding: 'var(--admin-space-6)' }}>
            <BulkAutoTag />
          </div>

          {/* Instructions */}
          <div style={{
            padding: 'var(--admin-space-6)',
            borderTop: 'var(--admin-border-width-sm) solid var(--admin-border-subtle)',
            background: 'var(--admin-surface-1)'
          }}>
            <h3 className="admin-text-md admin-font-semibold" style={{ color: 'var(--admin-text-primary)', marginBottom: 'var(--admin-space-3)' }}>
              Instructions
            </h3>
            <ul style={{ lineHeight: 'var(--admin-leading-relaxed)', color: 'var(--admin-text-secondary)', paddingLeft: 'var(--admin-space-5)', margin: 0 }}>
              <li>This tool uses Google Cloud Vision API to analyze all product images.</li>
              <li>It will generate <strong style={{ color: 'var(--admin-text-primary)' }}>Tags, Colors, Patterns, Materials</strong>, and <strong style={{ color: 'var(--admin-text-primary)' }}>Descriptions</strong>.</li>
              <li>Updates are applied directly to your Sanity database.</li>
              <li><strong style={{ color: 'var(--admin-error-text)' }}>Warning:</strong> This may consume a significant amount of Google Cloud API quota if you have many products.</li>
              <li>Ensure your <code style={{ backgroundColor: 'var(--admin-surface-0)', padding: '2px 6px', borderRadius: 'var(--admin-radius-sm)', color: 'var(--admin-gold)', fontFamily: 'var(--admin-font-mono)' }}>SANITY_API_WRITE_TOKEN</code> is correctly configured.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
