// pages/api/newsletter/subscribe.js
import sgMail from '@sendgrid/mail';
import { client } from '../../../lib/client';

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG....') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, agreed } = req.body;

  // Validation
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (!agreed) {
    return res.status(400).json({ message: 'You must agree to receive offers' });
  }

  try {
    // Check if email already exists
    const existingQuery = `*[_type == "newsletterSubscriber" && email == $email][0]`;
    const existing = await client.fetch(existingQuery, { email });

    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    // Create new subscriber
    const subscriber = {
      _type: 'newsletterSubscriber',
      email,
      subscribedAt: new Date().toISOString(),
      source: 'homepage_footer',
      agreedToMarketing: true
    };

    await client.create(subscriber);

    // Send welcome email using SendGrid
    const welcomeCode = 'WELCOME10';
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@sampada.com';
    const fromName = process.env.SENDGRID_FROM_NAME || 'Sampada';

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG....') {
      const msg = {
        to: email,
        from: { email: fromEmail, name: fromName },
        subject: 'Welcome to the Sampada Legacy ✦',
        html: `
<div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #3D2B1F;">
  <h2 style="color: #8B1A1A; font-size: 24px;">Welcome to Sampada Originals</h2>
  <p>Thank you for joining our legacy. You are now part of a community that wears heritage with pride.</p>
  <p>As a welcome gift, use code <strong style="color: #8B1A1A;">${welcomeCode}</strong> for 10% off your first order.</p>
  <p style="color: #C9A84C; font-size: 13px;">— The Sampada Team</p>
</div>
        `.trim(),
      };

      await sgMail.send(msg);
      console.log(`Welcome email sent to ${email}`);
    } else {
      console.log(`SendGrid not configured - skipping welcome email to ${email}`);
    }

    res.status(200).json({
      success: true,
      welcomeCode: welcomeCode
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}