import React from 'react';
import Head from 'next/head';
import BulkAutoTag from '../../components/admin/BulkAutoTag';
import Link from 'next/link';

export default function BulkTagPage() {
    return (
        <div className="admin-page" style={{ padding: '40px 20px', minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
            <Head>
                <title>Admin - Bulk Auto Tagging</title>
            </Head>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>← Back to Home</Link>
                </div>

                <h1 style={{ marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Admin Dashboard</h1>

                <BulkAutoTag />

                <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3>Instructions</h3>
                    <ul style={{ lineHeight: '1.6', color: '#555' }}>
                        <li>This tool uses Google Cloud Vision API to analyze all product images.</li>
                        <li>It will generate <strong>Tags, Colors, Patterns, Materials</strong>, and <strong>Descriptions</strong>.</li>
                        <li>Updates are applied directly to your Sanity database.</li>
                        <li><strong>Warning:</strong> This may consume a significant amount of Google Cloud API quota if you have many products.</li>
                        <li>Ensure your <code>SANITY_API_WRITE_TOKEN</code> is correctly configured in Vercel/Locally.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
