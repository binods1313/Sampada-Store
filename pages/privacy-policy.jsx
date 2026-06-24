import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import LegalPageLayout from '../components/LegalPageLayout';
import { markdownToHtml } from '../lib/markdown';

const TOC_ITEMS = [
  { id: 'who-we-are',             label: 'Who We Are' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use-it',          label: 'How We Use It' },
  { id: 'google-signin',          label: 'Google Sign-In' },
  { id: 'third-parties',          label: 'Third-Party Processors' },
  { id: 'cookies',                label: 'Cookies & Tracking' },
  { id: 'data-retention',         label: 'Data Retention' },
  { id: 'your-rights',            label: 'Your Rights' },
  { id: 'security',               label: 'Security' },
  { id: 'children',               label: "Children's Privacy" },
  { id: 'international',          label: 'International Transfers' },
  { id: 'changes',                label: 'Changes to This Policy' },
];

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'content/legal/privacy-policy.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { html: contentHtml, data } = await markdownToHtml(raw);
  return { props: { contentHtml, lastUpdated: data.lastUpdated } };
}

export default function PrivacyPolicy({ contentHtml, lastUpdated }) {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How Sampada Originals collects, uses, and protects your information"
      lastUpdated={lastUpdated}
      tocItems={TOC_ITEMS}
      contentHtml={contentHtml}
      meta={{
        title: 'Privacy Policy — Sampada Originals',
        description:
          'Learn how Sampada Originals collects, uses, and safeguards your personal data when you shop with us.',
        canonical: 'https://sampadaoriginals.in/privacy-policy',
      }}
    />
  );
}
