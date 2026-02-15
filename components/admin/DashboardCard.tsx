// components/admin/DashboardCard.tsx
import React from 'react';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    subtitle?: string;
    trend?: string;
    accentColor?: string; // Hex color for the icon background/accent
    onClick?: () => void;
}

export default function DashboardCard({
    title,
    value,
    icon,
    subtitle,
    trend,
    accentColor = '#1a1a2e',
    onClick
}: DashboardCardProps) {
    return (
        <div
            onClick={onClick}
            style={{
                background: `linear-gradient(135deg, white 40%, ${accentColor}08 100%)`, // Subtle tint
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #f3f4f6',
                borderLeft: `5px solid ${accentColor}`, // Color coded left border
                transition: 'all 0.2s ease',
                cursor: onClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden' // Ensure gradient stays within bounds
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                // Optional: Brighten background slightly on hover
                e.currentTarget.style.background = `linear-gradient(135deg, white 20%, ${accentColor}10 100%)`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.background = `linear-gradient(135deg, white 40%, ${accentColor}08 100%)`;
            }}
        >
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                }}>
                    {title}
                </div>

                <div style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#1a1a2e',
                    lineHeight: 1.2,
                    marginBottom: '0.5rem'
                }}>
                    {value}
                </div>

                {(subtitle || trend) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        {trend && (
                            <span style={{
                                color: trend.startsWith('+') ? '#059669' : '#dc2626',
                                fontWeight: 600,
                                background: trend.startsWith('+') ? '#ecfdf5' : '#fef2f2',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px'
                            }}>
                                {trend}
                            </span>
                        )}
                        {subtitle && <span style={{ color: '#9ca3af' }}>{subtitle}</span>}
                    </div>
                )}
            </div>

            {icon && (
                <div style={{
                    background: `${accentColor}15`, // 15% opacity version of accent
                    color: accentColor,
                    padding: '1rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '56px',
                    minHeight: '56px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {icon}
                </div>
            )}
        </div>
    );
}
