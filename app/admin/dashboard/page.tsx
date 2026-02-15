'use client';

// app/admin/dashboard/page.tsx
// Unified Admin Dashboard - Innovation #2
// Part of STUDIO_FINAL Billionaire Protocol Implementation
// REDESIGNED: Premium UI matching Homepage Aesthetic

import React, { useEffect, useState } from 'react';
import styles from '@/styles/AdminDashboard.module.css';
import DashboardCard from '@/components/admin/DashboardCard';
import RecentOrders from '@/components/admin/RecentOrders';
import LowStockAlerts from '@/components/admin/LowStockAlerts';
import {
    IndianRupee,
    Package,
    Tag,
    AlertTriangle,
    Users,
    Palette,
    Sparkles,
    Search,
    Brain,
    Zap
} from 'lucide-react';

/**
 * Unified Admin Dashboard
 * Premium redesign matching Sampada's modern aesthetic
 */
export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/admin/stats');
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className={styles.dashboardContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <div className="animate-spin" style={{ marginBottom: '1rem' }}>
                        <Package size={32} color="#1a1a2e" />
                    </div>
                    <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.dashboardContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#ef4444' }}>
                    <AlertTriangle size={32} style={{ marginBottom: '1rem', margin: '0 auto' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Error Loading Dashboard</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className={styles.dashboardContainer}>
            {/* Page Header */}
            <header className={styles.headerGroup}>
                <h1 className={styles.title}>Sampada Admin Dashboard</h1>
                <p className={styles.subtitle}>
                    Unified view of sales, inventory, and content across Prisma & Sanity
                </p>
            </header>

            {/* Key Metrics Grid */}
            <div className={styles.mainGrid}>
                <DashboardCard
                    title="Revenue (30 days)"
                    value={`₹${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                    icon={<IndianRupee size={28} strokeWidth={2.5} />}
                    trend={stats.revenueTrend}
                    accentColor="#f59e0b" // Gold
                />
                <DashboardCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<Package size={28} strokeWidth={2.5} />}
                    subtitle={`${stats.pendingOrders} pending`}
                    accentColor="#3b82f6" // Blue
                />
                <DashboardCard
                    title="Active Products"
                    value={stats.totalProducts}
                    icon={<Tag size={28} strokeWidth={2.5} />}
                    subtitle={`${stats.draftProducts} drafts`}
                    accentColor="#10b981" // Green
                />
                <DashboardCard
                    title="Low Stock Alerts"
                    value={stats.lowStockCount}
                    icon={<AlertTriangle size={28} strokeWidth={2.5} />}
                    subtitle={stats.lowStockCount > 0 ? "Action needed" : "Healthy"}
                    accentColor="#ef4444" // Red
                />
                <DashboardCard
                    title="Designer Users"
                    value={stats.designerUsers}
                    icon={<Users size={28} strokeWidth={2.5} />}
                    subtitle={`${stats.proUsers} pro tier`}
                    accentColor="#8b5cf6" // Purple
                />
                <DashboardCard
                    title="Custom Designs"
                    value={stats.customDesigns}
                    icon={<Palette size={28} strokeWidth={2.5} />}
                    subtitle={`${stats.liveDesigns} live`}
                    accentColor="#ec4899" // Pink
                />
            </div>

            {/* Main Content Area: Tables */}
            <div className={styles.splitGrid}>
                {/* Left: Recent Orders */}
                <RecentOrders orders={stats.recentOrders} />

                {/* Right: Low Stock Alerts */}
                <LowStockAlerts products={stats.lowStockProducts} />
            </div>

            {/* AI Insights Section */}
            <div className={styles.aiSection}>
                <div className={styles.aiTitle}>
                    <Brain size={28} />
                    AI Insights & Analytics
                </div>

                <div className={styles.aiGrid}>
                    <div className={styles.aiCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>AI Collections</div>
                            <Sparkles size={20} color="#60a5fa" />
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.aiCollections}</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '0.5rem' }}>Auto-generated based on trends</div>
                    </div>

                    <div className={styles.aiCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>Personalized Products</div>
                            <Zap size={20} color="#f59e0b" />
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.personalizedProducts}</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '0.5rem' }}>Tailored via Gemini AI</div>
                    </div>

                    <div className={styles.aiCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>Search Volume (7d)</div>
                            <Search size={20} color="#34d399" />
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.searchQueries}</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '0.5rem' }}>High intent keywords tracked</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
