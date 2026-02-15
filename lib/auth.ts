import { getServerSession } from 'next-auth/next';
import db from './db';

/**
 * Get user's designer subscription status
 * Returns null if user not enrolled in designer feature
 */
export async function getDesignerUser(userId: string) {
    return await db.designUser.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            designerTier: true,
            designsCreatedThisMonth: true,
            designLimit: true,
            features: true,
            designerSubStatus: true,
            designerPeriodEnd: true,
        },
    });
}

/**
 * Get designer user by email
 */
export async function getDesignerUserByEmail(email: string) {
    return await db.designUser.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            designerTier: true,
            designsCreatedThisMonth: true,
            designLimit: true,
            features: true,
            designerSubStatus: true,
            designerPeriodEnd: true,
        },
    });
}

/**
 * Check if user can create another design
 */
export async function canCreateDesign(userId: string): Promise<boolean> {
    const user = await getDesignerUser(userId);
    if (!user) return false; // Not enrolled

    if (user.designLimit === null) return true; // Ultra = unlimited
    return user.designsCreatedThisMonth < user.designLimit;
}

/**
 * Check if user has specific feature enabled
 */
export async function hasFeature(userId: string, feature: string): Promise<boolean> {
    const user = await getDesignerUser(userId);
    if (!user) return false;

    const features = user.features as Record<string, boolean>;
    return features[feature] === true;
}

/**
 * Create or get designer user
 */
export async function getOrCreateDesignerUser(
    userId: string,
    email: string,
    name?: string | null
) {
    let designUser = await db.designUser.findUnique({
        where: { email },
    });

    if (!designUser) {
        designUser = await db.designUser.create({
            data: {
                id: userId,
                email,
                name: name || undefined,
                designLimit: 2, // Free tier default
            },
        });
    }

    return designUser;
}

/**
 * Tier limits and features
 */
export const TIER_CONFIG = {
    free: {
        designLimit: 2,
        features: {
            aiAssistant: false,
            aiImageGen: false,
            multiProductPreview: false,
            customBranding: false,
        },
    },
    pro: {
        designLimit: 50,
        features: {
            aiAssistant: false,
            aiImageGen: false,
            multiProductPreview: true,
            customBranding: false,
        },
    },
    ultra: {
        designLimit: null, // Unlimited
        features: {
            aiAssistant: true,
            aiImageGen: true,
            multiProductPreview: true,
            customBranding: true,
        },
    },
};
