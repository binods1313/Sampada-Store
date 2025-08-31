// lib/emailService.js

import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send order confirmation email to customer
 * @param {Object} orderData - The order details
 * @returns {Promise} - SendGrid API response
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  // Validate required data
  if (!orderData?.customerEmail || !orderData?.orderItems || orderData.orderItems.length === 0) {
    throw new Error('Missing required order data for sending email');
  }

  try {
    // Format order items for email
    const itemsList = orderData.orderItems.map(item => {
      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.name || 'Product'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.pricePerItem.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.quantity * item.pricePerItem).toFixed(2)}</td>
      </tr>
      `;
    }).join('');

    // Format shipping address
    const shippingAddressHtml = orderData.shippingAddress ? `
      <p><strong>Shipping Address:</strong><br>
      ${orderData.shippingAddress.line1 || ''}<br>
      ${orderData.shippingAddress.line2 ? `${orderData.shippingAddress.line2}<br>` : ''}
      ${orderData.shippingAddress.city || ''}, ${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.postal_code || ''}<br>
      ${orderData.shippingAddress.country || ''}
      </p>
    ` : '<p><strong>Shipping Address:</strong> Not provided</p>';

    // Create email HTML
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f8f8; padding: 20px; text-align: center; }
        .footer { background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 10px; border-bottom: 2px solid #ddd; }
        .total { font-weight: bold; text-align: right; padding: 10px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${orderData.stripeSessionId}</p>
          <p><strong>Date:</strong> ${new Date(orderData.paidAt).toLocaleDateString()}</p>
          <p><strong>Customer Name:</strong> ${orderData.customerName}</p>
          
          ${shippingAddressHtml}
          
          <h3>Items Ordered</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total">Total:</td>
                <td class="total">$${orderData.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursiteurl.com'}/orders/${orderData.stripeSessionId}" class="button">View Order Status</a>
          </div>
          
          <p>If you have any questions about your order, please contact our customer service team.</p>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
          <p>This email was sent to ${orderData.customerEmail}.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Prepare email data
    const msg = {
      to: orderData.customerEmail,
      from: process.env.EMAIL_FROM || 'orders@yourstorename.com', // Verified sender in SendGrid
      subject: `Order Confirmation - #${orderData.stripeSessionId.substring(0, 8)}`,
      text: `Thank you for your order! Order ID: ${orderData.stripeSessionId}. Total Amount: $${orderData.totalAmount.toFixed(2)}`,
      html: emailHtml,
    };

    // Send email
    const response = await sgMail.send(msg);
    console.log(`✉️ Confirmation email sent to ${orderData.customerEmail}`);
    return response;
    
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't rethrow the error to prevent webhook processing from failing
    return null;
  }
};

/**
 * Send notification email to store admin
 * @param {Object} orderData - The order details
 * @returns {Promise} - SendGrid API response
 */
export const sendAdminNotificationEmail = async (orderData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourstorename.com';
    
    // Create email content
    const msg = {
      to: adminEmail,
      from: process.env.EMAIL_FROM || 'orders@yourstorename.com',
      subject: `New Order Received - #${orderData.stripeSessionId.substring(0, 8)}`,
      text: `
        New order received!
        
        Order ID: ${orderData.stripeSessionId}
        Customer: ${orderData.customerName} (${orderData.customerEmail})
        Total Amount: $${orderData.totalAmount.toFixed(2)}
        Items: ${orderData.orderItems.length}
        
        View in dashboard: ${process.env.SANITY_STUDIO_URL || 'https://yoursanityurl.com'}/desk/order;${orderData.stripeSessionId}
      `,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Order ID:</strong> ${orderData.stripeSessionId}</p>
        <p><strong>Customer:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
        <p><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</p>
        <p><strong>Items:</strong> ${orderData.orderItems.length}</p>
        <p><a href="${process.env.SANITY_STUDIO_URL || 'https://yoursanityurl.com'}/desk/order;${orderData.stripeSessionId}">View in dashboard</a></p>
      `,
    };

    // Send email
    const response = await sgMail.send(msg);
    console.log(`✉️ Admin notification email sent to ${adminEmail}`);
    return response;
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    return null;
  }
};