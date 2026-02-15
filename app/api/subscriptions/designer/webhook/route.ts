import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const DESIGNER_TIER_MAP: Record<string, { tier: string; limit: number | null }> = {
    [process.env.STRIPE_DESIGNER_PRO_PRICE_ID!]: { tier: 'pro', limit: 50 },
    [process.env.STRIPE_DESIGNER_ULTRA_PRICE_ID!]: { tier: 'ultra', limit: null },
};

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig!,
            process.env.STRIPE_DESIGNER_WEBHOOK_SECRET!
        );
    } catch (err) {
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    const subscription = event.data.object as any;

    try {
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                console.log('Updating subscription...');

                const priceId = subscription.items.data[0].price.id;
                const tierInfo = DESIGNER_TIER_MAP[priceId] || { tier: 'free', limit: 2 };

                // Find designer user by Stripe customer ID
                const designUser = await db.designUser.findUnique({
                    where: { stripeDesignerId: subscription.customer },
                });

                if (!designUser) {
                    console.warn(`⚠️ Designer user not found for customer ${subscription.customer}`);
                    break;
                }

                await db.designUser.update({
                    where: { id: designUser.id },
                    data: {
                        designerTier: tierInfo.tier,
                        designerSubStatus: subscription.status,
                        designerPeriodEnd: new Date(subscription.current_period_end * 1000),
                        designLimit: tierInfo.limit,
                        features: {
                            aiAssistant: tierInfo.tier === 'ultra',
                            aiImageGen: tierInfo.tier === 'ultra',
                            multiProductPreview: tierInfo.tier === 'ultra',
                            customBranding: tierInfo.tier === 'ultra',
                        },
                    },
                });

                console.log(`✅ Updated ${designUser.email} to ${tierInfo.tier}`);
                break;
            }

            case 'customer.subscription.deleted': {
                console.log('Downgrading subscription...');

                const designUser = await db.designUser.findUnique({
                    where: { stripeDesignerId: subscription.customer },
                });

                if (!designUser) {
                    console.warn(`⚠️ Designer user not found for customer ${subscription.customer}`);
                    break;
                }

                await db.designUser.update({
                    where: { id: designUser.id },
                    data: {
                        designerTier: 'free',
                        designerSubStatus: 'canceled',
                        designLimit: 2,
                        features: {
                            aiAssistant: false,
                            aiImageGen: false,
                            multiProductPreview: false,
                            customBranding: false,
                        },
                    },
                });

                console.log(`✅ Downgraded ${designUser.email} to free tier`);
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Processing failed' },
            { status: 500 }
        );
    }
}
