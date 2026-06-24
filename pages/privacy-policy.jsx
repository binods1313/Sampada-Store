// pages/privacy-policy.jsx
import LegalPageLayout from '../components/legal/LegalPageLayout';

const QUICK_SUMMARY = [
  'We collect only what is needed to process your orders',
  'We never sell your personal data to third parties',
  'You can request access or deletion at any time',
  'Google Sign-In only accesses your name, email, and profile picture',
];

const SECTIONS = [
  {
    id: 'who-we-are',
    heading: 'Who We Are',
    content: [
      'Sampada Originals is an online store operated by Binod S, selling premium Indian fashion and lifestyle products at sampadaoriginals.in.',
      'You can reach us at binod1313@gmail.com for any queries related to your data or this policy.',
    ],
  },
  {
    id: 'information-we-collect',
    heading: 'Information We Collect',
    content: [
      'We collect information you provide directly — your name, email address, shipping address, and phone number when you create an account or place an order.',
      'We also collect order history, payment confirmation data (we do not store full card details), and messages you send to our support team.',
      'We automatically collect device and browser data, IP address, pages visited, and session duration through cookies and analytics tools.',
    ],
  },
  {
    id: 'how-we-use-it',
    heading: 'How We Use Your Information',
    content: [
      'We use your data to process and fulfil orders, send shipping updates, and respond to support queries.',
      'We also use it to detect fraud, improve our website experience, and comply with applicable Indian law.',
      'We do not sell your personal data to any third party under any circumstances.',
    ],
  },
  {
    id: 'google-signin',
    heading: 'Google Sign-In',
    content: [
      'If you choose to sign in with Google, we receive your name, email address, and profile picture from Google.',
      'We use this only to create and manage your Sampada account.',
      'We do not access your Google Drive, Gmail, or any other Google services beyond the basic profile information.',
    ],
  },
  {
    id: 'third-parties',
    heading: 'Third-Party Processors',
    content: [
      'We share data only with vendors necessary to operate our business — including our payment gateway (Stripe), hosting provider (Vercel), and email delivery service (SendGrid).',
      'We also use Google Analytics to understand site usage patterns.',
      'Each processor is bound by their own data protection terms and is not permitted to use your data for any other purpose.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies and Tracking',
    content: [
      'We use essential cookies to keep you logged in and remember your cart across sessions.',
      'We use analytics cookies to understand how visitors interact with our site, which helps us improve the experience.',
      'You can disable non-essential cookies in your browser settings at any time without affecting your ability to shop with us.',
    ],
  },
  {
    id: 'data-retention',
    heading: 'Data Retention',
    content: [
      'We retain your account and order data for as long as your account is active.',
      'After account closure, we keep data for up to seven years to meet legal and tax obligations under Indian law.',
      'You may request deletion at any time by contacting us — we will action your request promptly within the bounds of our legal obligations.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your Rights',
    content: [
      'You may request access to, correction of, or deletion of your personal data at any time.',
      'To exercise your rights, simply email binod1313@gmail.com with your request.',
      'We will respond within 30 days and keep you informed throughout the process.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    content: [
      'We use industry-standard encryption (HTTPS) and strict access controls to protect your data at all times.',
      'No system is perfectly secure and we cannot guarantee absolute security, but we take all reasonable precautions to safeguard your information.',
    ],
  },
  {
    id: 'children',
    heading: "Children's Privacy",
    content: [
      'Our services are not directed at children under 13 and we do not knowingly collect personal data from minors.',
      'If you believe a child has provided us with their data, please contact us immediately and we will delete it promptly.',
    ],
  },
  {
    id: 'international',
    heading: 'International Transfers',
    content: [
      'Your data is stored and processed in India.',
      'If you access our site from outside India, your data may be transferred to and processed within India in accordance with applicable law.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to This Policy',
    content: [
      'We will post any updates to this page and revise the Last Updated date accordingly.',
      'Continued use of our site after changes are posted means you accept the updated policy.',
      'For questions about any changes, email binod1313@gmail.com and we will explain them clearly.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      pageTitle="Privacy Policy"
      pageSubtitle="How Sampada Originals collects, uses, and protects your information"
      lastUpdated="2026-06-23"
      canonicalSlug="privacy-policy"
      quickSummaryItems={QUICK_SUMMARY}
      sections={SECTIONS}
      contactEmail="binod1313@gmail.com"
    />
  );
}
