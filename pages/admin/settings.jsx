import AdminLayout from '@/components/admin/AdminLayout';
import Head from 'next/head';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import EmptyState from '@/components/admin/EmptyState';
import { Search, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Admin Settings page – displays store info, integration status, and a danger zone.
 * No data is persisted yet; all values are read from environment variables.
 */
export const getServerSideProps = async () => {
  const integrations = [
    { name: 'Sanity CMS', enabled: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID },
    { name: 'Stripe', enabled: !!process.env.STRIPE_SECRET_KEY },
    {
      name: 'Razorpay',
      enabled:
        !!process.env.RAZORPAY_KEY_SECRET &&
        !process.env.RAZORPAY_KEY_SECRET.includes('regenerate'),
    },
    { name: 'SendGrid', enabled: !!process.env.SENDGRID_API_KEY },
    { name: 'Mailchimp', enabled: !!process.env.MAILCHIMP_API_KEY },
    { name: 'xAI / Grok', enabled: !!process.env.XAI_API_KEY },
    { name: 'Google Auth', enabled: !!process.env.GOOGLE_CLIENT_ID },
    { name: 'NextAuth', enabled: !!process.env.NEXTAUTH_SECRET },
  ];
  return { props: { integrations } };
};

export default function SettingsPage({ integrations }) {
  return (
    <AdminLayout title="Settings">
      <Head>
        <title>Settings — Sampada Admin</title>
      </Head>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text-primary)' }}>
          Settings
        </h1>
        {/* Section A – Store Info */}
        <section className="clay-card" style={{ marginTop: '24px', borderTop: '4px solid var(--admin-gold)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Store Info</h2>
          <p><strong>Name:</strong> Sampada Originals</p>
          <p><strong>Domain:</strong> sampadaoriginals.in</p>
          <p><strong>Contact:</strong> binod1313@gmail.com</p>
          <p><strong>Currency:</strong> INR (primary)</p>
        </section>
        {/* Section B – Integration Status */}
        <section className="clay-card" style={{ marginTop: '24px', borderTop: '4px solid var(--admin-gold)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Integration Status</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--admin-surface-2)' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Integration</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((intg) => (
                <tr key={intg.name} style={{ borderBottom: '1px solid var(--admin-border-subtle)' }}>
                  <td style={{ padding: '8px' }}>{intg.name}</td>
                  <td style={{ padding: '8px' }}>{intg.enabled ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {/* Section C – Danger Zone */}
        <section className="clay-card" style={{ marginTop: '24px', borderTop: '4px solid var(--admin-gold)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>Danger Zone</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Clear all caches', 'Reset admin password', 'Export all data'].map((label) => (
              <button
                key={label}
                disabled
                title="Coming soon"
                style={{
                  padding: '8px 12px',
                  background: 'var(--admin-red)',
                  color: 'white',
                  borderRadius: '4px',
                  opacity: 0.5,
                  cursor: 'not-allowed',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
