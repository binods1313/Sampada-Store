// Resend Email Service
// Location: lib/sendgrid.ts (renamed from sendgrid.ts for compatibility)
// 
// Transactional email service for Sampada using Resend
// Handles: order confirmations, welcome emails, password resets, etc.
//
// Free Plan: 3,000 emails/month (100/day)
// Docs: https://resend.com/docs

import { Resend } from 'resend';

// Initialize Resend with API key
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'Sampada';

let resend: Resend | null = null;

if (!RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY not configured - emails will not be sent');
} else {
  resend = new Resend(RESEND_API_KEY);
  console.log('✅ Resend initialized');
}

// ==================== Types ====================

export interface OrderConfirmationData {
  to: string;
  orderId: string;
  orderNumber: string;
  total: number; // in cents
  items: Array<{
    name: string;
    quantity: number;
    price: number; // in cents
    image?: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  estimatedDelivery?: string;
}

export interface WelcomeEmailData {
  to: string;
  name: string;
  designerTier?: 'free' | 'pro' | 'ultra';
}

export interface PasswordResetData {
  to: string;
  name: string;
  resetUrl: string;
}

export interface SubscriptionConfirmationData {
  to: string;
  name: string;
  plan: 'pro' | 'ultra';
  amount: number;
  nextBillingDate: string;
}

// ==================== Email Functions ====================

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  if (!resend) {
    console.warn('⚠️  Resend not configured - skipping order confirmation email');
    return;
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
      to: data.to,
      subject: `Order Confirmation #${data.orderNumber}`,
      html: createOrderConfirmationHTML(data),
      text: createOrderConfirmationText(data),
    });

    if (error) {
      console.error('❌ Failed to send order confirmation:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log(`✅ Order confirmation sent to ${data.to} (Order #${data.orderNumber})`, result);
  } catch (error) {
    console.error('❌ Failed to send order confirmation:', error);
    throw error;
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  if (!resend) {
    console.warn('⚠️  Resend not configured - skipping welcome email');
    return;
  }

  const tierBenefits = {
    free: '2 designs per month',
    pro: '50 designs per month + Multi-product preview',
    ultra: 'Unlimited designs + AI features + Custom branding',
  };

  try {
    const { data: result, error } = await resend.emails.send({
      from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
      to: data.to,
      subject: `Welcome to Sampada, ${data.name}!`,
      html: createWelcomeEmailHTML({ ...data, tierBenefits }),
      text: createWelcomeEmailText({ ...data, tierBenefits }),
    });

    if (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log(`✅ Welcome email sent to ${data.to}`, result);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(data: PasswordResetData): Promise<void> {
  if (!resend) {
    console.warn('⚠️  Resend not configured - skipping password reset email');
    return;
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
      to: data.to,
      subject: 'Reset Your Password - Sampada',
      html: createPasswordResetHTML(data),
      text: createPasswordResetText(data),
    });

    if (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log(`✅ Password reset email sent to ${data.to}`, result);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw error;
  }
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmation(
  data: SubscriptionConfirmationData
): Promise<void> {
  if (!resend) {
    console.warn('⚠️  Resend not configured - skipping subscription confirmation');
    return;
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
      to: data.to,
      subject: `Subscription Confirmed - Sampada ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}`,
      html: createSubscriptionConfirmationHTML(data),
      text: createSubscriptionConfirmationText(data),
    });

    if (error) {
      console.error('❌ Failed to send subscription confirmation:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log(`✅ Subscription confirmation sent to ${data.to}`, result);
  } catch (error) {
    console.error('❌ Failed to send subscription confirmation:', error);
    throw error;
  }
}

// ==================== HTML Templates ====================

function createOrderConfirmationHTML(data: OrderConfirmationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .item { border-bottom: 1px solid #eee; padding: 15px 0; }
    .item:last-child { border-bottom: none; }
    .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Order Confirmed!</h1>
    <p>Order #${data.orderNumber}</p>
  </div>
  
  <div class="content">
    <p>Hi ${data.shippingAddress.name},</p>
    <p>Thank you for your order! We've received it and will start processing it shortly.</p>
    
    <div class="order-details">
      <h2>Order Details</h2>
      ${data.items.map(item => `
        <div class="item">
          <strong>${item.name}</strong><br/>
          Quantity: ${item.quantity} × $${(item.price / 100).toFixed(2)} = <strong>$${((item.quantity * item.price) / 100).toFixed(2)}</strong>
        </div>
      `).join('')}
      
      <div class="total">
        Total: $${(data.total / 100).toFixed(2)}
      </div>
    </div>
    
    <div class="order-details">
      <h2>Shipping Address</h2>
      <p>
        ${data.shippingAddress.name}<br/>
        ${data.shippingAddress.address}${data.shippingAddress.address2 ? `<br/>${data.shippingAddress.address2}` : ''}<br/>
        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br/>
        ${data.shippingAddress.country}
      </p>
    </div>
    
    ${data.estimatedDelivery ? `
      <p style="text-align: center; color: #666;">
        📦 Estimated delivery: <strong>${data.estimatedDelivery}</strong>
      </p>
    ` : ''}
    
    <div style="text-align: center;">
      <a href="https://sampada-xoa6kn2lwa-uc.a.run.app/orders/${data.orderId}" class="button">Track Your Order</a>
    </div>
    
    <p style="margin-top: 30px;">
      We'll send you another email when your order ships. If you have any questions, just reply to this email.
    </p>
    
    <p>Thanks for choosing Sampada!</p>
    <p><strong>The Sampada Team</strong></p>
  </div>
  
  <div class="footer">
    <p>© 2026 Sampada. All rights reserved.</p>
    <p>Powered by creativity, delivered with love. 💜</p>
  </div>
</body>
</html>
  `.trim();
}

function createOrderConfirmationText(data: OrderConfirmationData): string {
  return `
Order Confirmed! #${data.orderNumber}

Hi ${data.shippingAddress.name},

Thank you for your order! We've received it and will start processing it shortly.

ORDER DETAILS:
${data.items.map(item => `- ${item.name} (x${item.quantity}) - $${((item.quantity * item.price) / 100).toFixed(2)}`).join('\n')}

Total: $${(data.total / 100).toFixed(2)}

SHIPPING TO:
${data.shippingAddress.name}
${data.shippingAddress.address}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
${data.shippingAddress.country}

Track your order: https://sampada-xoa6kn2lwa-uc.a.run.app/orders/${data.orderId}

We'll send you another email when your order ships.

Thanks for choosing Sampada!
The Sampada Team
  `.trim();
}

function createWelcomeEmailHTML(data: WelcomeEmailData & { tierBenefits: any }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
    .content { padding: 30px 20px; }
    .benefits { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎨 Welcome to Sampada!</h1>
    <p>Hi ${data.name}! Let's create something amazing.</p>
  </div>
  
  <div class="content">
    <p>You're all set! Your Sampada account is ready to use.</p>
    
    <div class="benefits">
      <h3>Your ${data.designerTier || 'free'} plan includes:</h3>
      <p><strong>${data.tierBenefits[data.designerTier || 'free']}</strong></p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sampada-xoa6kn2lwa-uc.a.run.app/designer" class="button">Start Creating Now</a>
    </div>
    
    <h3>What can you do on Sampada?</h3>
    <ul>
      <li>🎨 Design custom products with our studio</li>
      <li>🤖 Get AI-powered design suggestions</li>
      <li>👕 Order your creations on premium products</li>
      <li>📦 Share your designs with the community</li>
    </ul>
    
    <p>Need help? Check out our <a href="https://sampada-xoa6kn2lwa-uc.a.run.app/docs">documentation</a> or reply to this email.</p>
    
    <p>Happy creating!</p>
    <p><strong>The Sampada Team</strong></p>
  </div>
  
  <div class="footer">
    <p>© 2026 Sampada. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
}

function createWelcomeEmailText(data: WelcomeEmailData & { tierBenefits: any }): string {
  return `
Welcome to Sampada!

Hi ${data.name},

You're all set! Your Sampada account is ready to use.

Your ${data.designerTier || 'free'} plan includes:
${data.tierBenefits[data.designerTier || 'free']}

Start creating now: https://sampada-xoa6kn2lwa-uc.a.run.app/designer

What can you do on Sampada?
- Design custom products with our studio
- Get AI-powered design suggestions
- Order your creations on premium products
- Share your designs with the community

Need help? Check out our documentation or reply to this email.

Happy creating!
The Sampada Team
  `.trim();
}

function createPasswordResetHTML(data: PasswordResetData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px 20px; }
    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔐 Password Reset</h1>
  </div>
  
  <div class="content">
    <p>Hi ${data.name},</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.resetUrl}" class="button">Reset Password</a>
    </div>
    
    <div class="warning">
      <strong>⚠️ Important:</strong> This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
    </div>
    
    <p>Thanks,</p>
    <p><strong>The Sampada Team</strong></p>
  </div>
  
  <div class="footer">
    <p>© 2026 Sampada. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
}

function createPasswordResetText(data: PasswordResetData): string {
  return `
Password Reset Request

Hi ${data.name},

We received a request to reset your password. Click the link below to reset it:

${data.resetUrl}

⚠️ This link expires in 1 hour. If you didn't request this, you can safely ignore this email.

Thanks,
The Sampada Team
  `.trim();
}

function createSubscriptionConfirmationHTML(data: SubscriptionConfirmationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
    .content { padding: 30px 20px; }
    .plan-card { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .plan-name { font-size: 1.5em; font-weight: bold; color: #667eea; }
    .plan-price { font-size: 2em; font-weight: bold; margin: 10px 0; }
    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Subscription Activated!</h1>
    <p>Welcome to Sampada ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}</p>
  </div>
  
  <div class="content">
    <p>Hi ${data.name},</p>
    <p>Your subscription has been successfully activated. Thank you for upgrading!</p>
    
    <div class="plan-card">
      <div class="plan-name">Sampada ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}</div>
      <div class="plan-price">$${(data.amount / 100).toFixed(2)}/month</div>
      <p>Next billing: ${data.nextBillingDate}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sampada-xoa6kn2lwa-uc.a.run.app/designer" class="button">Start Creating</a>
    </div>
    
    <h3>What's included:</h3>
    <ul>
      ${data.plan === 'pro' ? `
        <li>✅ 50 designs per month</li>
        <li>✅ Multi-product preview</li>
        <li>✅ Priority support</li>
      ` : `
        <li>✅ Unlimited designs</li>
        <li>✅ AI-powered design assistant</li>
        <li>✅ AI image generation</li>
        <li>✅ Custom branding</li>
        <li>✅ Priority support</li>
      `}
    </ul>
    
    <p>Manage your subscription anytime from your <a href="https://sampada-xoa6kn2lwa-uc.a.run.app/designer/subscribe">account settings</a>.</p>
    
    <p>Happy creating!</p>
    <p><strong>The Sampada Team</strong></p>
  </div>
  
  <div class="footer">
    <p>© 2026 Sampada. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
}

function createSubscriptionConfirmationText(data: SubscriptionConfirmationData): string {
  return `
Subscription Activated!

Hi ${data.name},

Your Sampada ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)} subscription has been successfully activated.

Plan: Sampada ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}
Amount: $${(data.amount / 100).toFixed(2)}/month
Next billing: ${data.nextBillingDate}

What's included:
${data.plan === 'pro' ? `- 50 designs per month\n- Multi-product preview\n- Priority support` : `- Unlimited designs\n- AI-powered design assistant\n- AI image generation\n- Custom branding\n- Priority support`}

Manage your subscription: https://sampada-xoa6kn2lwa-uc.a.run.app/designer/subscribe

Happy creating!
The Sampada Team
  `.trim();
}

// ==================== Health Check ====================

/**
 * Test Resend connection
 */
export async function testResendConnection(): Promise<boolean> {
  if (!resend) {
    console.warn('⚠️  Resend not configured');
    return false;
  }

  try {
    // Send a test email to verify connection
    const { data, error } = await resend.emails.send({
      from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
      to: RESEND_FROM_EMAIL, // Send to self for testing
      subject: 'Resend Connection Test',
      html: '<p>If you received this, Resend is working correctly!</p>',
      text: 'Resend connection test successful',
    });
    
    if (error) {
      console.error('❌ Resend connection test failed:', error);
      return false;
    }
    
    console.log('✅ Resend connection test passed', data);
    return true;
  } catch (error) {
    console.error('❌ Resend connection test failed:', error);
    return false;
  }
}
