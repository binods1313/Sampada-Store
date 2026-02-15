'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDesigner } from '../../context/DesignerContext';
import Canvas from '../../components/designer/Canvas';
import styles from '../../styles/designer/DesignerPage.module.css';

export default function DesignerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { designs, designerTier, isLoading, fetchDesigns } = useDesigner();
    const [view, setView] = useState<'dashboard' | 'canvas'>('dashboard');
    const [userStatus, setUserStatus] = useState<any>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin?callbackUrl=/designer');
        }
    }, [status, router]);

    useEffect(() => {
        async function loadStatus() {
            try {
                const res = await fetch('/api/user/designer-status');
                const data = await res.json();
                setUserStatus(data);
            } catch (error) {
                console.error('Failed to load status:', error);
            }
        }
        if (session?.user) {
            loadStatus();
        }
    }, [session?.user]);

    if (status === 'loading') {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading designer...</p>
            </div>
        );
    }

    if (view === 'canvas') {
        return <Canvas />;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>T-Shirt Designer</h1>
                    <div className={styles.headerActions}>
                        <Link href="/designer/templates" className={styles.templatesBtn}>
                            Browse Templates
                        </Link>
                        <button
                            className={styles.createBtn}
                            onClick={() => setView('canvas')}
                            disabled={userStatus && !userStatus.canCreateDesign}
                        >
                            + Create New Design
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className={styles.statsBar}>
                <div className={styles.stat}>
                    <span className={styles.statValue}>{userStatus?.totalDesigns || 0}</span>
                    <span className={styles.statLabel}>Total Designs</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statValue}>
                        {userStatus?.designsCreatedThisMonth || 0}
                        {userStatus?.designLimit !== null && (
                            <span className={styles.statLimit}>/ {userStatus?.designLimit}</span>
                        )}
                    </span>
                    <span className={styles.statLabel}>This Month</span>
                </div>
                <div className={styles.stat}>
                    <span className={`${styles.statValue} ${styles.tierBadge} ${styles[designerTier]}`}>
                        {designerTier.charAt(0).toUpperCase() + designerTier.slice(1)}
                    </span>
                    <span className={styles.statLabel}>Your Plan</span>
                </div>
                {designerTier !== 'ultra' && (
                    <Link href="/subscription" className={styles.upgradeLink}>
                        Upgrade Plan →
                    </Link>
                )}
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2>Your Designs</h2>
                    <button onClick={fetchDesigns} className={styles.refreshBtn}>
                        🔄 Refresh
                    </button>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : designs.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>👕</div>
                        <h3>No designs yet</h3>
                        <p>Create your first custom t-shirt design!</p>
                        <button
                            className={styles.createBtn}
                            onClick={() => setView('canvas')}
                        >
                            Create Your First Design
                        </button>
                    </div>
                ) : (
                    <div className={styles.designsGrid}>
                        {designs.map((design: any) => (
                            <div key={design.id} className={styles.designCard}>
                                <div className={styles.designThumbnail}>
                                    {design.thumbnail ? (
                                        <img src={design.thumbnail} alt={design.name} />
                                    ) : (
                                        <div className={styles.placeholderThumb}>👕</div>
                                    )}
                                    <span className={`${styles.statusBadge} ${styles[design.status]}`}>
                                        {design.status}
                                    </span>
                                </div>
                                <div className={styles.designInfo}>
                                    <h3>{design.name}</h3>
                                    <p className={styles.designDate}>
                                        {new Date(design.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={styles.designActions}>
                                    <Link
                                        href={`/designer/${design.id}`}
                                        className={styles.editBtn}
                                    >
                                        Edit
                                    </Link>
                                    {design.status === 'draft' && (
                                        <button className={styles.exportBtn}>
                                            Export
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Features Section */}
            {designerTier === 'free' && (
                <section className={styles.featuresPromo}>
                    <h3>Unlock More Features</h3>
                    <div className={styles.featuresList}>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>🎨</span>
                            <span>50+ Designs/mo with Pro</span>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>🤖</span>
                            <span>AI Tools with Ultra</span>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>✨</span>
                            <span>No Watermarks</span>
                        </div>
                    </div>
                    <Link href="/subscription" className={styles.upgradeBtn}>
                        View Plans
                    </Link>
                </section>
            )}
        </div>
    );
}
