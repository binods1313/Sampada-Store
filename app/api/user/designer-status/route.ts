import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { authOptions } from '@/lib/nextAuthOptions';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get or create designer user
        let designUser = await db.designUser.findUnique({
            where: { email: session.user.email },
        });

        if (!designUser) {
            designUser = await db.designUser.create({
                data: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                    designerTier: 'free',
                },
            });
        }

        return NextResponse.json({
            tier: designUser.designerTier,
            designsCreatedThisMonth: designUser.designsCreatedThisMonth,
            designLimit: designUser.designLimit,
            features: designUser.features,
            subscriptionStatus: designUser.designerSubStatus,
            periodEnd: designUser.designerPeriodEnd,
        });
    } catch (error) {
        console.error('❌ Error fetching designer status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch designer status' },
            { status: 500 }
        );
    }
}
