// components/admin/LowStockAlerts.tsx
// Low stock products alert component

import React from 'react';
import { urlFor } from '@/lib/sanity';

interface Product {
    _id: string;
    name: string;
    inventory: number;
    image?: any;
}

interface LowStockAlertsProps {
    products: Product[];
}

export default function LowStockAlerts({ products }: LowStockAlertsProps) {
    return (
        <div style={{
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            background: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#1a1a2e' }}>
                Low Stock Alerts
            </h3>

            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {products.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#10b981', background: '#ecfdf5', borderRadius: '12px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
                        <div style={{ fontWeight: 600 }}>All products are well stocked!</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Inventory levels look healthy</div>
                    </div>
                ) : (
                    products.map((product) => (
                        <div
                            key={product._id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                marginBottom: '0.75rem',
                                background: '#fff1f2',
                                borderRadius: '12px',
                                border: '1px solid #fecdd3',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {product.image && product.image[0] && (
                                <img
                                    src={urlFor(product.image[0]).width(80).height(80).url()}
                                    alt={product.name}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                            )}

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#991b1b', marginBottom: '0.25rem' }}>
                                    {product.name}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                                    Only {product.inventory} left
                                </div>
                            </div>

                            <button
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    background: '#FF3B3B', // Primary Red
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(255, 59, 59, 0.2)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#dc2626';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#FF3B3B';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Restock
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
