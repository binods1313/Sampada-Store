// components/HomePage/SampadaFooter.jsx
import React from 'react';
import Link from 'next/link';
import {
  AiFillInstagram,
  AiOutlineTwitter,
  AiFillFacebook,
  AiFillYoutube,
} from 'react-icons/ai';
import styles from './SampadaFooter.module.css';

const footerColumns = [
  {
    id: 'product',
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Use Cases', href: '/use-cases' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    links: [
      { label: 'Documentation', href: '/documentation' },
      { label: 'API Reference', href: '/api-reference' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status' },
    ],
  },
];

const SampadaFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <h4 className={styles.brandName}>Sampada</h4>
          <p className={styles.brandDesc}>
            Prosperity in Every Print – Custom T-shirts, Mugs &amp; Blankets
          </p>
          <div className={styles.socialIcons}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <AiFillInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <AiOutlineTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <AiFillFacebook />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <AiFillYoutube />
            </a>
          </div>
        </div>

        {/* Link Columns */}
        {footerColumns.map((col) => (
          <div key={col.id} className={styles.linkCol}>
            <h4 className={styles.colTitle}>{col.title}</h4>
            <ul className={styles.colLinks}>
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal Row */}
      <div className={styles.legalRow}>
        <div className={styles.legalLinks}>
          <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
          <Link href="/terms-of-service" className={styles.legalLink}>Terms of Service</Link>
          <Link href="/cookie-policy" className={styles.legalLink}>Cookie Policy</Link>
        </div>
        <p className={styles.copyright}>
          © 2026 Sampada. Powered by Printify &amp; Stripe
        </p>
      </div>
    </footer>
  );
};

export default SampadaFooter;
