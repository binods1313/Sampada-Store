// Test Resend Email Service
// Run: node test-resend-email.js

const { sendWelcomeEmail } = require('./lib/sendgrid');

async function test() {
  console.log('🧪 Testing Resend email service...\n');
  
  try {
    // Replace with YOUR email address
    const YOUR_EMAIL = 'binods1313@gmail.com'; // ← Change this!
    
    console.log(`📧 Sending test welcome email to: ${YOUR_EMAIL}\n`);
    
    await sendWelcomeEmail({
      to: YOUR_EMAIL,
      name: 'Test User',
      designerTier: 'free'
    });
    
    console.log('✅ Test email sent successfully!\n');
    console.log('📬 Check your inbox at:', YOUR_EMAIL);
    console.log('📊 Also check Resend dashboard: https://resend.com/emails\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check RESEND_API_KEY is set in Cloud Run');
    console.error('2. Verify API key is valid: https://resend.com/api-keys');
    console.error('3. Check Resend dashboard for errors: https://resend.com/dashboard\n');
  }
}

test();
