// pages/terms-and-conditions.jsx
import LegalPageLayout from '../components/legal/LegalPageLayout';

const QUICK_SUMMARY = [
  'You must be 18 or older to make a purchase',
  'Payments are processed securely by Stripe — we never store card details',
  'Returns accepted within 7 days of delivery on unused, unwashed items',
  'All disputes are governed by the laws of India (jurisdiction: Bengaluru)',
];

const SECTIONS = [
  {
    id: 'acceptance',
    heading: 'Acceptance of Terms',
    content: [
      'By accessing sampadaoriginals.in you agree to be bound by these Terms and Conditions.',
      'If you do not agree with any part of these terms, please do not use the site.',
      'These Terms apply to all visitors, users, and customers of Sampada Originals.',
    ],
  },
  {
    id: 'site-use',
    heading: 'Site Use and Account Responsibilities',
    content: [
      'You must be 18 years of age or older to make a purchase on our site.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.',
      'Please notify us immediately at binod1313@gmail.com of any unauthorised use of your account.',
    ],
  },
  {
    id: 'products-pricing',
    heading: 'Products and Pricing',
    content: [
      'We do our best to display accurate product images, descriptions, and prices. Colours may vary slightly on different screens.',
      'All prices are shown in Indian Rupees and are subject to change without prior notice.',
      'We reserve the right to cancel orders placed at incorrect prices and will issue a full refund in such cases.',
    ],
  },
  {
    id: 'orders',
    heading: 'Orders and Cancellations',
    content: [
      'Placing an order on our site is an offer to purchase. We may accept or reject your order at our discretion.',
      'If we are unable to fulfil an order due to stock unavailability or a payment issue, we will notify you promptly.',
      'In such cases, we will issue a full refund to your original payment method without delay.',
    ],
  },
  {
    id: 'payments',
    heading: 'Payments',
    content: [
      'Payments are processed securely by Stripe. We do not store your full card details on our servers at any time.',
      'All transactions are subject to the payment processor\'s own terms and conditions.',
    ],
  },
  {
    id: 'shipping',
    heading: 'Shipping and Delivery',
    content: [
      'We aim to dispatch orders within 3 to 5 business days of confirmed payment.',
      'Delivery timelines are estimates and may be affected by factors outside our control, including carrier delays, public holidays, and weather conditions.',
      'We will notify you of any significant delays and work to resolve them as quickly as possible.',
    ],
  },
  {
    id: 'returns',
    heading: 'Returns and Refunds',
    content: [
      'We accept returns of unused, unwashed, and undamaged items in their original packaging within 7 days of delivery.',
      'To initiate a return, please contact us at binod1313@gmail.com with your order number and reason for return.',
      'Refunds will be processed within 7 to 10 business days of receiving and inspecting the returned item.',
    ],
  },
  {
    id: 'ip',
    heading: 'Intellectual Property',
    content: [
      'All content on this site — including images, text, branding, logos, and design — belongs to Sampada Originals or its licensors.',
      'You may not reproduce, redistribute, or use any content without our prior written permission.',
    ],
  },
  {
    id: 'third-party',
    heading: 'Third-Party Links',
    content: [
      'Our site may contain links to third-party websites for your convenience.',
      'We are not responsible for the content, privacy practices, or availability of those sites.',
      'Visiting third-party sites is at your own risk and subject to their own terms and policies.',
    ],
  },
  {
    id: 'warranty',
    heading: 'Warranty Disclaimer',
    content: [
      'Products are provided as described on their product pages.',
      'We make no additional warranties beyond what is required by applicable Indian consumer protection law.',
      'We do not guarantee that the site will be uninterrupted, error-free, or free from viruses at all times.',
    ],
  },
  {
    id: 'liability',
    heading: 'Limitation of Liability',
    content: [
      'To the extent permitted by applicable law, Sampada Originals\' total liability for any claim arising from your use of our site or products is limited to the amount you paid for the relevant order.',
      'We are not liable for indirect, incidental, or consequential damages of any kind.',
    ],
  },
  {
    id: 'indemnity',
    heading: 'Indemnity',
    content: [
      'You agree to indemnify and hold harmless Sampada Originals and its operators from any claims, losses, or expenses.',
      'This applies to claims arising from your breach of these Terms or your misuse of our site or services.',
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law',
    content: [
      'These Terms are governed by the laws of India.',
      'Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to These Terms',
    content: [
      'We may update these Terms at any time. The Last Updated date at the top of this page will reflect the most recent revision.',
      'Continued use of our site after changes are posted constitutes your acceptance of the updated Terms.',
      'For questions about any updates, email binod1313@gmail.com.',
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <LegalPageLayout
      pageTitle="Terms and Conditions"
      pageSubtitle="The rules and guidelines governing your use of Sampada Originals"
      lastUpdated="2026-06-23"
      canonicalSlug="terms-and-conditions"
      quickSummaryItems={QUICK_SUMMARY}
      sections={SECTIONS}
      contactEmail="binod1313@gmail.com"
    />
  );
}
