import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import db from '@/lib/db';

/**
 * Create Stripe checkout for DESIGNER subscription
 * Separate product from main store products
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user?.id || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json(); // 'pro' or 'ultra'

    // Map to Stripe price IDs (DESIGNER specific, different from store)
    const priceIds: Record<string, string> = {
        pro: process.env.STRIPE_DESIGNER_PRO_PRICE_ID!,
        ultra: process.env.STRIPE_DESIGNER_ULTRA_PRICE_ID!,
    };

    if (!priceIds[plan]) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Get or create designer user in DB
    let designUser = await db.designUser.findUnique({
        where: { email: session.user.email },
    });

    if (!designUser) {
        designUser = await db.designUser.create({
            data: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
            },
        });
    }

    // Get or create Stripe customer
    let customerId = designUser.stripeDesignerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: session.user.email,
            metadata: { designUserId: designUser.id },
        });
        customerId = customer.id;

        await db.designUser.update({
            where: { id: designUser.id },
            data: { stripeDesignerId: customerId },
        });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
            {
                price: priceIds[plan],
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${req.nextUrl.origin}/designer?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.nextUrl.origin}/designer/subscribe`,
        metadata: {
            designUserId: designUser.id,
            planType: 'designer',
        },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
}
