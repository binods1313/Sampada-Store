The legal pages have three critical bugs visible on screen plus a full styling overhaul needed. Fix everything below.

Bug 1 — Duplicate Navbar and Footer
The navbar and footer are appearing twice on both legal pages. This means LegalPageLayout.jsx is wrapping content in <Layout> which already includes the navbar and footer, AND the page file is also wrapped in <Layout> — causing double rendering.
Fix: Open components/LegalPageLayout.jsx and remove the <Layout> wrapper from inside it entirely. The <Layout> wrapper must exist in only ONE place. Since pages/_app.js or the individual page file handles the Layout, LegalPageLayout should just return its own content with <Head> — no <Layout> tag inside it.
Check how other pages in the repo handle this. Open pages/about.js or pages/support.js and copy exactly the same pattern they use for Layout. Match that pattern for both legal pages.
Also check pages/_app.js — if Layout is applied globally there, remove it from the page files too. The rule is: Layout appears exactly once per page, never nested.

Bug 2 — Markdown Still Not Rendering
The content is still showing raw ##, {#acceptance}, *** symbols as plain text. The markdownToHtml function is not processing the content correctly.
Do this diagnostic right now:
Open lib/markdown.js and confirm it looks exactly like this:
jsimport matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function markdownToHtml(markdown) {
  const { content, data } = matter(markdown);
  const processed = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  return { html: processed.toString(), data };
}
Run: npm install gray-matter remark remark-html remark-gfm
Then open pages/terms-and-conditions.jsx and add this temporarily inside getStaticProps:
jsexport async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'content/legal/terms-and-conditions.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  console.log('RAW FILE:', raw.substring(0, 200));  // add this
  const { html: contentHtml, data } = await markdownToHtml(raw);
  console.log('PARSED HTML:', contentHtml.substring(0, 200));  // add this
  return { props: { contentHtml, lastUpdated: data.lastUpdated } };
}
Run npm run dev and check terminal output:

If PARSED HTML shows <h2> tags → bug is in rendering, check dangerouslySetInnerHTML
If PARSED HTML still shows ## → bug is in the parser or wrong file path
If you get a file not found error → the markdown files are in wrong directory

The markdown files must be at exactly: content/legal/privacy-policy.md and content/legal/terms-and-conditions.md from the project root. Verify this in the file explorer.
Remove the console.log lines after fixing.

Bug 3 — Full Visual Redesign
Once the above bugs are fixed, the pages need to look like a premium brand legal page, not a plain document. Here is the exact visual spec:
Overall layout — two column on desktop, single column on mobile:
┌─────────────────────────────────────────────────────┐
│                    HERO SECTION                     │
│         (cream gradient, centered, branded)         │
├─────────────────────────────────────────────────────┤
│    DARK TRUST STRIP (crimson/dark background)       │
├───────────────┬─────────────────────────────────────┤
│               │  📋 QUICK SUMMARY CARD              │
│  STICKY TOC   ├─────────────────────────────────────┤
│  (left side,  │  ┌─────────────────────────────┐   │
│  220px wide,  │  │   CONTENT CARD (white,      │   │
│  desktop)     │  │   rounded, shadow)           │   │
│               │  │   ## Section heading         │   │
│               │  │   Paragraph text...          │   │
│               │  │   ## Section heading         │   │
│               │  └─────────────────────────────┘   │
│               ├─────────────────────────────────────┤
│               │  CONTACT BOX (gold border)          │
└───────────────┴─────────────────────────────────────┘
Rewrite components/LegalPageLayout.jsx completely:
jsximport React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/legal.module.css';

export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  tocItems,
  contentHtml,
  meta,
}) {
  const [activeId, setActiveId] = useState(tocItems[0]?.id);
  const [tocOpen, setTocOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const headings = document.querySelectorAll('article h2[id]');
    if (!headings.length) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach((h) => observerRef.current.observe(h));
    return () => observerRef.current?.disconnect();
  }, []);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <>
      <Head>
        <title>{meta?.title ?? `${title} — Sampada Originals`}</title>
        <meta name="description" content={meta?.description ?? ''} />
        <link rel="canonical" href={meta?.canonical ?? 'https://sampadaoriginals.in'} />
        <meta name="robots" content="index,follow" />
      </Head>

      <div className={styles.pageWrapper}>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Sampada Originals</p>
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.goldRule} aria-hidden="true" />
          {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
          {lastUpdated && (
            <time className={styles.lastUpdated} dateTime={lastUpdated}>
              Last updated: {formattedDate}
            </time>
          )}
        </section>

        {/* Trust strip */}
        <div className={styles.trustStrip}>
          <span>🔒 Secure &amp; Encrypted</span>
          <span>🚫 Data Never Sold</span>
          <span>✏️ Updated June 2026</span>
          <span>📧 Direct Support</span>
        </div>

        {/* Body */}
        <div className={styles.bodyLayout}>

          {/* TOC */}
          <nav className={styles.toc} aria-label="Page contents">
            <button
              className={styles.tocToggle}
              onClick={() => setTocOpen((o) => !o)}
              aria-expanded={tocOpen}
              aria-controls="toc-list"
            >
              <span>Contents</span>
              <span aria-hidden="true">{tocOpen ? '▲' : '▼'}</span>
            </button>
            <ul
              id="toc-list"
              className={`${styles.tocList} ${tocOpen ? styles.tocOpen : ''}`}
            >
              {tocItems.map(({ id, label }) => (
                <li key={id}>
                  
                    href={`#${id}`}
                    className={`${styles.tocLink} ${activeId === id ? styles.tocActive : ''}`}
                    onClick={() => setTocOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right column */}
          <div className={styles.contentWrapper}>

            {/* Quick summary card */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryIcon}>📋</span>
                <strong>Quick Summary</strong>
              </div>
              <ul className={styles.summaryList}>
                <li>We collect only what's needed to process your orders</li>
                <li>We never sell your personal data to third parties</li>
                <li>You can request access or deletion at any time</li>
                <li>Contact us: <a href="mailto:binods1313@gmail.com">binods1313@gmail.com</a></li>
              </ul>
            </div>

            {/* Main content card */}
            <article
              className={styles.contentCard}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Contact box */}
            <aside className={styles.contactBox}>
              <strong className={styles.contactTitle}>Questions about this policy?</strong>
              <p>
                Email us at{' '}
                <a href="mailto:binods1313@gmail.com">binods1313@gmail.com</a>
                {' '}and we'll respond within 2 business days.
              </p>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
Important — no <Layout> inside this component. Zero. The Layout is handled by the page file or _app.js only.

Rewrite styles/legal.module.css completely:
css.pageWrapper {
  background: #FAF6F0;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Hero ── */
.hero {
  background: linear-gradient(160deg, #FAF6F0 0%, #F0E4D4 100%);
  text-align: center;
  padding: 52px 20px 44px;
  border-bottom: 1px solid rgba(201,168,76,0.2);
}

@media (min-width: 768px) {
  .hero { padding: 72px 40px 60px; }
}

.eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #C9A84C;
  margin: 0 0 14px;
}

.heroTitle {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: #8B1A1A;
  margin: 0 0 18px;
  line-height: 1.15;
  text-shadow: 0 1px 0 rgba(255,255,255,0.6);
}

.goldRule {
  width: 64px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  margin: 0 auto 18px;
  border-radius: 2px;
}

.heroSubtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #6B5C5A;
  max-width: 50ch;
  margin: 0 auto 12px;
  line-height: 1.65;
}

.lastUpdated {
  display: block;
  font-size: 0.78rem;
  color: #9B8580;
  font-style: italic;
}

/* ── Trust strip ── */
.trustStrip {
  background: #1A0A08;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 28px;
  padding: 13px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.76rem;
  color: #DCC9B0;
  letter-spacing: 0.04em;
}

@media (min-width: 768px) {
  .trustStrip { font-size: 0.82rem; gap: 6px 44px; }
}

/* ── Body layout ── */
.bodyLayout {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 1140px;
  margin: 36px auto 100px;
  padding: 0 16px;
  gap: 24px;
}

@media (min-width: 768px) {
  .bodyLayout { padding: 0 28px; }
}

@media (min-width: 1024px) {
  .bodyLayout {
    grid-template-columns: 224px 1fr;
    gap: 36px;
    margin-top: 52px;
    align-items: start;
  }
}

/* ── TOC ── */
.toc {
  background: #fff;
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 12px;
  padding: 18px 16px;
  box-shadow: 0 2px 16px rgba(26,10,8,0.06);
}

@media (min-width: 1024px) {
  .toc {
    position: sticky;
    top: 90px;
  }
}

.tocToggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  background: none;
  border: none;
  font-family: 'Libre Baskerville', serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #8B1A1A;
  cursor: pointer;
  padding: 0;
}

.tocToggle:focus-visible {
  outline: 2px solid #C9A84C;
  outline-offset: 3px;
  border-radius: 4px;
}

@media (min-width: 1024px) {
  .tocToggle { display: none; }
}

.tocList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: none;
}

.tocList.tocOpen { display: block; }

@media (min-width: 1024px) {
  .tocList { display: block; margin-top: 10px; }
}

.tocLink {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 3px 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.81rem;
  color: #6B5C5A;
  text-decoration: none;
  border-radius: 6px;
  border-left: 2px solid transparent;
  line-height: 1.4;
  transition: all 0.15s;
}

.tocLink:hover {
  background: rgba(139,26,26,0.05);
  color: #8B1A1A;
  border-left-color: #C9A84C;
}

.tocLink:focus-visible {
  outline: 2px solid #C9A84C;
  outline-offset: 2px;
}

.tocActive {
  color: #8B1A1A;
  font-weight: 600;
  background: rgba(139,26,26,0.05);
  border-left-color: #C9A84C;
}

/* ── Right column ── */
.contentWrapper {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Summary card ── */
.summaryCard {
  background: #fff;
  border: 1px solid rgba(201,168,76,0.3);
  border-left: 4px solid #C9A84C;
  border-radius: 0 12px 12px 0;
  padding: 22px 24px;
  box-shadow: 0 2px 16px rgba(26,10,8,0.05);
}

.summaryHeader {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-family: 'Libre Baskerville', serif;
  font-size: 0.95rem;
  color: #8B1A1A;
}

.summaryIcon { font-size: 1.1rem; }

.summaryList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summaryList li {
  font-family: 'Inter', sans-serif;
  font-size: 0.87rem;
  color: #4A3A38;
  line-height: 1.6;
  padding-left: 18px;
  position: relative;
}

.summaryList li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #C9A84C;
  font-weight: 700;
}

.summaryList a {
  color: #8B1A1A;
  text-underline-offset: 2px;
}

/* ── Content card ── */
.contentCard {
  background: #fff;
  border: 1px solid rgba(201,168,76,0.15);
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 4px 24px rgba(26,10,8,0.07);
}

@media (min-width: 768px) {
  .contentCard { padding: 44px 52px; }
}

/* Styles for rendered markdown inside the content card */
.contentCard :global(h2) {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(1.15rem, 3vw, 1.45rem);
  color: #8B1A1A;
  margin: 0 0 16px;
  padding: 32px 0 14px;
  border-bottom: 2px solid #C9A84C;
  scroll-margin-top: 70px;
}

@media (min-width: 1024px) {
  .contentCard :global(h2) { scroll-margin-top: 108px; }
}

.contentCard :global(h2:first-child) {
  padding-top: 0;
  margin-top: 0;
}

.contentCard :global(h3) {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.05rem;
  color: #1A0A08;
  margin: 24px 0 10px;
}

.contentCard :global(p) {
  font-family: 'Inter', sans-serif;
  font-size: 0.97rem;
  line-height: 1.8;
  color: #3A2A28;
  margin-bottom: 14px;
  max-width: 70ch;
}

.contentCard :global(ul),
.contentCard :global(ol) {
  padding-left: 0;
  margin: 0 0 16px;
  list-style: none;
}

.contentCard :global(li) {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.75;
  color: #3A2A28;
  padding-left: 20px;
  position: relative;
  margin-bottom: 6px;
}

.contentCard :global(ul li::before) {
  content: '•';
  position: absolute;
  left: 4px;
  color: #C9A84C;
  font-weight: 700;
}

.contentCard :global(ol) {
  counter-reset: item;
}

.contentCard :global(ol li) {
  counter-increment: item;
}

.contentCard :global(ol li::before) {
  content: counter(item) '.';
  position: absolute;
  left: 0;
  color: #8B1A1A;
  font-weight: 600;
  font-size: 0.85rem;
}

.contentCard :global(a) {
  color: #8B1A1A;
  text-underline-offset: 3px;
  text-decoration-color: rgba(139,26,26,0.35);
  transition: text-decoration-color 0.15s;
}

.contentCard :global(a:hover) {
  text-decoration-color: #8B1A1A;
}

.contentCard :global(a:focus-visible) {
  outline: 2px solid #C9A84C;
  outline-offset: 2px;
  border-radius: 2px;
}

.contentCard :global(strong) {
  color: #1A0A08;
  font-weight: 600;
}

/* ── Contact box ── */
.contactBox {
  background: #fff;
  border: 1px solid rgba(201,168,76,0.3);
  border-left: 4px solid #8B1A1A;
  border-radius: 0 12px 12px 0;
  padding: 24px 28px;
  box-shadow: 0 2px 16px rgba(26,10,8,0.05);
}

.contactTitle {
  display: block;
  font-family: 'Libre Baskerville', serif;
  font-size: 1rem;
  color: #8B1A1A;
  margin-bottom: 8px;
}

.contactBox p {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #4A3A38;
  margin: 0;
  line-height: 1.65;
}

.contactBox a {
  color: #8B1A1A;
  font-weight: 600;
  text-underline-offset: 2px;
}

.contactBox a:focus-visible {
  outline: 2px solid #C9A84C;
  outline-offset: 2px;
  border-radius: 2px;
}

How both page files should look
Both pages/privacy-policy.jsx and pages/terms-and-conditions.jsx must follow whichever Layout pattern the rest of the site uses. Check pages/about.js or pages/support.js and copy that exact pattern. The page file should look like one of these two patterns — pick whichever matches the repo:
Pattern A — if Layout is in _app.js globally:
jsx// No Layout import needed — just return LegalPageLayout directly
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
        description: 'Learn how Sampada Originals collects, uses, and safeguards your personal data.',
        canonical: 'https://sampadaoriginals.in/privacy-policy',
      }}
    />
  );
}
Pattern B — if each page imports Layout individually:
jsximport Layout from '../components/Layout';

export default function PrivacyPolicy({ contentHtml, lastUpdated }) {
  return (
    <Layout>
      <LegalPageLayout
        title="Privacy Policy"
        subtitle="How Sampada Originals collects, uses, and protects your information"
        lastUpdated={lastUpdated}
        tocItems={TOC_ITEMS}
        contentHtml={contentHtml}
        meta={{
          title: 'Privacy Policy — Sampada Originals',
          description: 'Learn how Sampada Originals collects, uses, and safeguards your personal data.',
          canonical: 'https://sampadaoriginals.in/privacy-policy',
        }}
      />
    </Layout>
  );
}
Do not use both patterns together. That is what caused the duplication.

Verification before pushing

 Navbar appears exactly once
 Footer appears exactly once
 No ##, *, or {#id} visible anywhere on either page
 Hero section shows eyebrow, crimson H1, gold rule, subtitle, date
 Dark trust strip below hero
 Summary card with gold left border and checkmarks
 Content in white card with rounded corners and shadow
 H2 headings in crimson with gold underline
 Gold bullet points on all lists
 Contact box with crimson left border at bottom
 TOC sticky on desktop, accordion on mobile
 No horizontal scroll at 320px
 npm run build passes before pushing

Do not push until navbar and footer duplication is fully resolved.