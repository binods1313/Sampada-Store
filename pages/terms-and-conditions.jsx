import fs from 'fs';
import path from 'path';
import LegalPageLayout from '../components/LegalPageLayout';
import { markdownToHtml } from '../lib/markdown';

const TOC_ITEMS = [
  { id: 'acceptance',        label: 'Acceptance of Terms' },
  { id: 'site-use',          label: 'Site Use & Accounts' },
  { id: 'products-pricing',  label: 'Products & Pricing' },
  { id: 'orders',            label: 'Orders & Cancellations' },
  { id: 'payments',          label: 'Payments' },
  { id: 'shipping',          label: 'Shipping & Delivery' },
  { id: 'returns',           label: 'Returns & Refunds' },
  { id: 'ip',                label: 'Intellectual Property' },
  { id: 'third-party',       label: 'Third-Party Links' },
  { id: 'warranty',          label: 'Warranty Disclaimer' },
  { id: 'liability',         label: 'Limitation of Liability' },
  { id: 'indemnity',         label: 'Indemnity' },
  { id: 'governing-law',     label: 'Governing Law' },
  { id: 'changes',           label: 'Changes to Terms' },
];

export async function getStaticProps() {
  const filePath = path.join(
    process.cwd(),
    'content/legal/terms-and-conditions.md'
  );
  const raw = fs.readFileSync(filePath, 'utf8');
  const { html: contentHtml, data } = await markdownToHtml(raw);
  return { props: { contentHtml, lastUpdated: data.lastUpdated } };
}

export default function TermsAndConditions({ contentHtml, lastUpdated }) {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      subtitle="The rules and guidelines governing your use of Sampada Originals"
      lastUpdated={lastUpdated}
      tocItems={TOC_ITEMS}
      contentHtml={contentHtml}
      meta={{
        title: 'Terms and Conditions — Sampada Originals',
        description:
          'Terms and conditions governing your use of the Sampada Originals website and services.',
        canonical: 'https://sampadaoriginals.in/terms-and-conditions',
      }}
    />
  );
}
