// pages/api/support-ticket.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // In a real application, you would send an email or save to a database here.
    // For now, we'll just log it and return success.
    console.log('New Support Ticket:', { name, email, message });
    
    // Simulate some delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return res.status(200).json({ message: 'Ticket received' });
  } catch (error) {
    console.error('Ticket API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
