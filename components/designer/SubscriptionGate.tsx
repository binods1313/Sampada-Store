'use client';

import { useDesigner } from '@/context/DesignerContext';
import Link from 'next/link';
import styles from '@/styles/designer/SubscriptionGate.module.css';

interface SubscriptionGateProps {
    feature: string;
    requiredTier: 'pro' | 'ultra';
    children: React.ReactNode;
}

export default function SubscriptionGate({
    feature,
    requiredTier,
    children,
}: SubscriptionGateProps) {
    const { designerTier } = useDesigner();

    const tiers = { free: 0, pro: 1, ultra: 2 };
    const requiredLevel = tiers[requiredTier as keyof typeof tiers];
    const currentLevel = tiers[designerTier as keyof typeof tiers];

    if (currentLevel >= requiredLevel) {
        return <>{children}</>;
    }

    return (
        <div className={styles.gate}>
            <div className={styles.icon}>🔒</div>
            <h3>Upgrade Required</h3>
            <p>{feature} is available for {requiredTier} subscribers</p>

            <div className={styles.comparison}>
                <div className={styles.current}>
                    <strong>Your Plan: {designerTier}</strong>
                </div>
                <div className={styles.required}>
                    <strong>Required: {requiredTier}</strong>
                </div>
            </div>

            <Link href="/designer/subscribe" className={styles.upgradeBtn}>
                ✨ Upgrade Now
            </Link>
        </div>
    );
}
