export const TIER_FEATURES = {
    free: {
        designLimit: 2,
        canExport: false,
        canUseAI: false,
        canSharePublic: false,
        maxImageSize: '5MB',
        previewResolution: '800x800',
        processingTime: '3-5 days',
    },
    pro: {
        designLimit: 50,
        canExport: true,
        canUseAI: false,
        canSharePublic: false,
        maxImageSize: '10MB',
        previewResolution: '2400x2400',
        processingTime: '24 hours',
    },
    ultra: {
        designLimit: null, // unlimited
        canExport: true,
        canUseAI: true,
        canSharePublic: true,
        maxImageSize: '50MB',
        previewResolution: 'unlimited',
        processingTime: '4 hours (priority)',
    },
};

export function getFeatureStatus(tier: string, feature: string): boolean {
    const tierFeatures = TIER_FEATURES[tier as keyof typeof TIER_FEATURES];
    if (!tierFeatures) return false;
    return (tierFeatures as any)[feature] !== false;
}

export function checkTierAccess(tier: string, feature: string): { allowed: boolean; reason?: string } {
    if (getFeatureStatus(tier, feature)) {
        return { allowed: true };
    }

    const featureNames: Record<string, string> = {
        canExport: 'Printify export',
        canUseAI: 'AI design assistant',
        canSharePublic: 'Public design sharing',
    };

    return {
        allowed: false,
        reason: `${featureNames[feature] || feature} is locked for your current plan`,
    };
}
