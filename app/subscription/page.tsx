'use client';

import { useState, useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import styles from './subscription.module.css';

// Only load Stripe if we have a key
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_DESIGNER_KEY || process.env.NEXT_PUBLIC_STRIPE_KEY;
let stripePromise: Promise<Stripe | null> | null = null;
if (stripeKey) {
    stripePromise = loadStripe(stripeKey);
}

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'forever',
        features: [
            '2 designs per month',
            'Basic design tools',
            'Standard templates',
            'Export to PNG',
            'Community support',
        ],
        limitations: [
            'No AI tools',
            'No custom branding',
            'Watermark on exports',
        ],
        buttonText: 'Current Plan',
        highlighted: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 30,
        period: '/month',
        features: [
            '50 designs per month',
            'All design tools',
            'Premium templates',
            'Export to all formats',
            'Multi-product preview',
            'Priority support',
            'No watermark',
        ],
        limitations: [
            'No AI tools',
        ],
        buttonText: 'Upgrade to Pro',
        highlighted: false,
    },
    {
        id: 'ultra',
        name: 'Ultra',
        price: 300,
        period: '/month',
        features: [
            'Unlimited designs',
            'All Pro features',
            'AI Image Generation',
            'AI Design Assistant',
            'AI Smart Suggestions',
            'Custom branding',
            'White-label exports',
            'Dedicated support',
            'Early access to features',
        ],
        limitations: [],
        buttonText: 'Go Ultra',
        highlighted: true,
    },
];

export default function SubscriptionPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [currentTier, setCurrentTier] = useState('free');

    const handleSubscribe = async (planId: string) => {
        if (!session?.user) {
            router.push('/api/auth/signin?callbackUrl=/subscription');
            return;
        }

        if (planId === 'free') return;

        setIsLoading(planId);
        try {
            const response = await fetch('/api/subscriptions/designer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId }),
            });

            const data = await response.json();

            if (data.sessionId) {
                const stripe = await stripePromise;
                await stripe?.redirectToCheckout({ sessionId: data.sessionId });
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to start subscription. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Choose Your Designer Plan</h1>
                <p>
                    Create custom t-shirt designs with our powerful designer tools.
                    Upgrade for more features and unlimited creativity.
                </p>
            </div>

            <div className={styles.plansGrid}>
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''} ${currentTier === plan.id ? styles.current : ''}`}
                    >
                        {plan.highlighted && (
                            <div className={styles.badge}>Most Popular</div>
                        )}
                        {currentTier === plan.id && (
                            <div className={styles.currentBadge}>Current Plan</div>
                        )}

                        <h2 className={styles.planName}>{plan.name}</h2>

                        <div className={styles.pricing}>
                            <span className={styles.currency}>$</span>
                            <span className={styles.price}>{plan.price}</span>
                            <span className={styles.period}>{plan.period}</span>
                        </div>

                        <ul className={styles.features}>
                            {plan.features.map((feature, index) => (
                                <li key={index} className={styles.feature}>
                                    <span className={styles.checkIcon}>✓</span>
                                    {feature}
                                </li>
                            ))}
                            {plan.limitations.map((limitation, index) => (
                                <li key={`lim-${index}`} className={styles.limitation}>
                                    <span className={styles.xIcon}>✗</span>
                                    {limitation}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`${styles.subscribeBtn} ${plan.highlighted ? styles.highlightedBtn : ''}`}
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isLoading !== null || currentTier === plan.id}
                        >
                            {isLoading === plan.id ? 'Processing...' : plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.faq}>
                <h3>Frequently Asked Questions</h3>
                <div className={styles.faqGrid}>
                    <div className={styles.faqItem}>
                        <h4>Can I cancel anytime?</h4>
                        <p>Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>What happens to my designs if I downgrade?</h4>
                        <p>Your existing designs will remain accessible. You just won&apos;t be able to create new ones beyond your new plan&apos;s limit.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>Do you offer refunds?</h4>
                        <p>We offer a 7-day money-back guarantee if you&apos;re not satisfied with your subscription.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>Can I upgrade mid-cycle?</h4>
                        <p>Yes! When you upgrade, you&apos;ll be charged the prorated difference for the remaining days in your billing cycle.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
