// Example: lib/email.js (using Resend)
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY); // Add key to .env.local

export async function sendOrderConfirmationEmail(toEmail, orderData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Binod Tech Ventures <orders@yourdomain.com>', // Replace with your verified domain
      to: [toEmail],
      subject: `Your Order Confirmation (#${orderData._id.substring(0,8)})`,
      // Use React Email or simple HTML for the body
      html: `<h1>Thanks for your order!</h1><p>Order ID: ${orderData._id}</p><p>Total: $${orderData.totalAmount.toFixed(2)}</p>`, // Add more details
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
    console.log("Confirmation email sent successfully:", data.id);
    return data;
  } catch (error) {
     console.error("Error sending email:", error);
     throw error; // Re-throw to be caught by webhook handler if needed
  }
}