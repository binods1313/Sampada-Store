// pages/refund-policy.jsx
import LegalPageLayout from '../components/legal/LegalPageLayout';

const QUICK_SUMMARY = [
  'Returns accepted within 7 days of delivery',
  'Refunds processed within 7–10 business days',
  'Items must be unused, unwashed, and in original packaging',
  'Contact us at binod1313@gmail.com to initiate a return',
];

const SECTIONS = [
  {
    id: 'eligibility',
    heading: 'Return Eligibility',
    content: [
      'We accept returns on unused, unwashed, and undamaged items in their original packaging within 7 days of delivery.',
      'Items that have been worn, washed, altered, or damaged after delivery are not eligible for return.',
      'Sale items and customised products are non-returnable unless they arrive damaged or defective.',
    ],
  },
  {
    id: 'process',
    heading: 'How to Initiate a Return',
    content: [
      'To start a return, email us at binod1313@gmail.com with your order number and reason for return.',
      'We will respond within 2 business days with a return authorisation and shipping instructions.',
      'Please do not ship items back without receiving a return authorisation — unauthorised returns may not be processed.',
    ],
  },
  {
    id: 'refunds',
    heading: 'Refund Processing',
    content: [
      'Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund.',
      'Approved refunds are processed within 7 to 10 business days to your original payment method.',
      'Shipping charges are non-refundable unless the return is due to our error or a defective product.',
    ],
  },
  {
    id: 'exchanges',
    heading: 'Exchanges',
    content: [
      'We currently offer exchanges on a case-by-case basis, subject to stock availability.',
      'If you would like to exchange an item, mention this in your return email and we will do our best to accommodate.',
      'Exchange items are dispatched only after the original item is received and inspected.',
    ],
  },
  {
    id: 'damaged',
    heading: 'Damaged or Defective Items',
    content: [
      'If your order arrives damaged or defective, please email us within 48 hours of delivery with photos of the item and packaging.',
      'We will arrange a replacement or full refund at no additional cost to you.',
      'Sampada Originals takes full responsibility for items damaged during transit.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact Us',
    content: [
      'For all return and refund queries, reach us at binod1313@gmail.com.',
      'We aim to respond to all enquiries within 2 business days.',
      'Our goal is to make every Sampada experience positive — we will always work with you to find a fair resolution.',
    ],
  },
];

export default function RefundPolicy() {
  return (
    <LegalPageLayout
      pageTitle="Refund Policy"
      pageSubtitle="Our commitment to fair returns and hassle-free refunds"
      lastUpdated="2026-06-23"
      canonicalSlug="refund-policy"
      quickSummaryItems={QUICK_SUMMARY}
      sections={SECTIONS}
      contactEmail="binod1313@gmail.com"
    />
  );
}
