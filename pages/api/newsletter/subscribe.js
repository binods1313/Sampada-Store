// pages/api/newsletter/subscribe.js
import { client } from '../../../lib/client';

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

    // TODO: Send welcome email with 10% discount code
    // You can integrate with email services like:
    // - SendGrid
    // - Mailchimp
    // - Resend
    // - AWS SES

    res.status(200).json({
      message: 'Successfully subscribed',
      discountCode: 'WELCOME10' // You can generate this dynamically
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
