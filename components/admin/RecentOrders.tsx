// components/admin/RecentOrders.tsx
// Recent orders table component

import React from 'react';

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number | null;
    paymentStatus: string;
    createdAt: Date;
    user: {
        name: string | null;
        email: string;
    };
}

interface RecentOrdersProps {
    orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <div style={{
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            background: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#1a1a2e' }}>
                Recent Orders
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Customer
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Amount
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                    No recent orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} style={{ transition: 'all 0.2s' }}>
                                    <td style={{ padding: '1rem', background: '#f9fafb', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                                        <div style={{ fontWeight: 600, color: '#1f2937' }}>
                                            {order.customerName || order.user.name || 'Unknown'}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {order.customerEmail || order.user.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, background: '#f9fafb', color: '#1a1a2e' }}>
                                        ₹{(order.totalAmount || 0).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', background: '#f9fafb', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                                        <span style={{
                                            padding: '0.375rem 1rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: order.paymentStatus === 'completed' ? '#ecfdf5' : '#fffbeb',
                                            color: order.paymentStatus === 'completed' ? '#059669' : '#d97706',
                                            textTransform: 'capitalize'
                                        }}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
