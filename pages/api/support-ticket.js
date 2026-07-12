// pages/api/support-ticket.js
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // Send email to admin using SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG....') {
      const adminEmail = 'binod1313@gmail.com';
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@sampada.com';

      const msg = {
        to: adminEmail,
        from: fromEmail,
        replyTo: email,
        subject: `Support Ticket from ${name} <${email}>`,
        text: `
Name: ${name}
Email: ${email}
Message: ${message}

---
Submitted: ${new Date().toISOString()}
        `.trim(),
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #8B1A1A; color: white; padding: 20px; text-align: center; }
    .field { margin-bottom: 16px; }
    .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 16px; margin-top: 4px; }
    .message-box { background: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 4px solid #8B1A1A; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Support Ticket</h1>
    </div>
    <div style="padding: 20px;">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="footer">
        Submitted: ${new Date().toISOString()}
      </div>
    </div>
  </div>
</body>
</html>
        `.trim(),
      };

      await sgMail.send(msg);
      console.log(`Support ticket email sent to ${adminEmail}`);
    } else {
      // Fallback: log the ticket if SendGrid is not configured
      console.log('Support Ticket (SendGrid not configured):', { name, email, message });
    }

    return res.status(200).json({ message: 'Ticket received' });
  } catch (error) {
    console.error('Support ticket error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}