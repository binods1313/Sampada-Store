// lib/email.js - Sampada Email Service
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Sampada prosperity-themed order confirmation email template
const getOrderConfirmationHtml = (orderData, customerName) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sampada Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; background-color: #faf9f6; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; background: #fff; border-radius: 8px; }
    .header { text-align: center; color: #d97706; font-size: 24px; font-weight: bold; }
    .subheader { text-align: center; font-size: 16px; color: #6b7280; margin-bottom: 20px; }
    .order-details { margin: 20px 0; background: #fefce8; padding: 15px; border-radius: 8px; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #d97706; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🌸 Sampada – Prosperity in Every Print 🌸</div>
    <div class="subheader">Your order has been received with blessings of abundance</div>

    <p>Dear ${customerName || 'Valued Customer'},</p>
    <p>Thank you for shopping with <strong>Sampada</strong>. Your order <strong>#${orderData._id.substring(0, 8).toUpperCase()}</strong> has been successfully placed.</p>

    <div class="order-details">
      <h3 style="margin-top: 0;">Order Summary:</h3>
      <ul>
        <li><strong>Order ID:</strong> ${orderData._id}</li>
        <li><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</li>
        <li><strong>Items:</strong> ${orderData.orderItems?.length || 1} product(s)</li>
      </ul>
    </div>

    <p>Your items will be <strong>fulfilled via Printify</strong> and shipped securely. You'll receive tracking details once your package is on its way.</p>

    <p style="text-align: center; font-size: 1.1em;">✨ May this purchase bring prosperity, health, and joy to you and your family. ✨</p>

    <p style="text-align:center; margin-top: 25px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://sampada.vercel.app'}/account?tab=orders" class="btn">View Your Order</a>
    </p>

    <div class="footer">
      © 2026 Sampada. Powered by Printify & Stripe<br>
      For support, contact <a href="mailto:support@sampada.com">support@sampada.com</a>
    </div>
  </div>
</body>
</html>
`;

// Sampada shipping confirmation email template
const getShippingConfirmationHtml = (orderData, customerName, trackingInfo) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sampada Shipping Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; background-color: #faf9f6; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; background: #fff; border-radius: 8px; }
    .header { text-align: center; color: #d97706; font-size: 24px; font-weight: bold; }
    .subheader { text-align: center; font-size: 16px; color: #6b7280; margin-bottom: 20px; }
    .order-details { margin: 20px 0; background: #ecfdf5; padding: 15px; border-radius: 8px; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #d97706; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🚚 Sampada – Your Order is on the Way 🚚</div>
    <div class="subheader">Blessings of prosperity accompany your shipment</div>

    <p>Dear ${customerName || 'Valued Customer'},</p>
    <p>We're delighted to let you know that your order <strong>#${orderData._id.substring(0, 8).toUpperCase()}</strong> has been shipped!</p>

    <div class="order-details">
      <h3 style="margin-top: 0;">Shipment Details:</h3>
      <ul>
        <li><strong>Carrier:</strong> ${trackingInfo?.carrier || 'Standard Shipping'}</li>
        <li><strong>Tracking Number:</strong> ${trackingInfo?.trackingNumber || 'Will be provided shortly'}</li>
        <li><strong>Estimated Delivery:</strong> ${trackingInfo?.estimatedDelivery || '5-10 business days'}</li>
      </ul>
    </div>

    <p>You can track your package anytime using the link below:</p>

    <p style="text-align:center; margin-top: 25px;">
      <a href="${trackingInfo?.trackingUrl || '#'}" class="btn">Track Your Shipment</a>
    </p>

    <p style="text-align: center; font-size: 1.1em;">✨ May this delivery bring abundance, health, and joy to your household. ✨</p>

    <div class="footer">
      © 2026 Sampada. Powered by Printify & Stripe<br>
      For support, contact <a href="mailto:support@sampada.com">support@sampada.com</a>
    </div>
  </div>
</body>
</html>
`;

export async function sendOrderConfirmationEmail(toEmail, orderData, customerName) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Sampada <orders@sampada.com>',
      to: [toEmail],
      subject: `🌸 Order Confirmed #${orderData._id.substring(0, 8).toUpperCase()} – Sampada`,
      html: getOrderConfirmationHtml(orderData, customerName),
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
    console.log("Order confirmation email sent successfully:", data.id);
    return data;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
}

export async function sendShippingConfirmationEmail(toEmail, orderData, customerName, trackingInfo) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Sampada <orders@sampada.com>',
      to: [toEmail],
      subject: `🚚 Your Sampada Order is Shipped! #${orderData._id.substring(0, 8).toUpperCase()}`,
      html: getShippingConfirmationHtml(orderData, customerName, trackingInfo),
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
    console.log("Shipping confirmation email sent successfully:", data.id);
    return data;
  } catch (error) {
    console.error("Error sending shipping confirmation email:", error);
    throw error;
  }
}