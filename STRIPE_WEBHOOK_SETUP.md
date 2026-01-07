# Stripe Webhook Setup Instructions

## 🚨 Critical: Your Stripe webhook is not receiving events

Based on the logs, orders are not being created because the Stripe webhook is not being called. Here's how to fix this:

## 1. Install Stripe CLI (if not already installed)

```bash
# Windows (using winget)
winget install stripe.stripe-cli

# Or download from: https://stripe.com/docs/stripe-cli

## 1.1 Open a terminal and type, cd C:\Program Files

C:\WINDOWS\system32>cd C:\Program Files
```

## 2. Login to Stripe CLI

```bash
stripe login
```

## 3. Set up webhook forwarding for development

```bash
# Forward webhooks to your local endpoint
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

This command will:
- Start listening for webhook events
- Forward them to your local development server
- Display the webhook signing secret

## 4. Copy the webhook signing secret

The CLI will display something like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

## 5. Update your .env.local file

Add or update this line in your `.env.local` file:
```
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

## 6. Restart your Next.js development server

```bash
npm run dev
```

## 7. Test a purchase

Now when you complete a purchase, you should see webhook logs in your terminal like:
```
🔔 Webhook endpoint hit: { method: 'POST', headers: [...], hasWebhookSecret: true }
✅ Stripe Webhook Event Received: checkout.session.completed
🛒 Checkout Session Completed! Session ID: cs_test_...
```

## Alternative: Manual Order Creation

If webhooks are still not working, the success page will automatically create orders using the manual fallback API we just implemented.

## Production Setup

For production, you'll need to:
1. Set up webhook endpoints in your Stripe dashboard
2. Configure the webhook URL to point to your deployed application
3. Set the production webhook secret in your environment variables

## Troubleshooting

If you still don't see webhook events:
1. Check that `STRIPE_WEBHOOK_SECRET` is set correctly
2. Make sure the Stripe CLI is running and forwarding to the correct port
3. Verify your firewall isn't blocking the webhook endpoint
4. Check the Stripe dashboard for webhook delivery attempts