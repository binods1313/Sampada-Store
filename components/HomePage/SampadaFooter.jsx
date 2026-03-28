// components/HomePage/SampadaFooter.jsx
import React from 'react';
import Link from 'next/link';
import {
  AiFillInstagram,
  AiOutlineTwitter,
  AiFillFacebook,
  AiFillYoutube,
  AiFillLinkedin,
  AiFillTikTok,
  AiFillPinterest
} from 'react-icons/ai';
import { client } from '../../lib/client';
import styles from './SampadaFooter.module.css';

// Icon mapping for social platforms
const socialIcons = {
  instagram: AiFillInstagram,
  twitter: AiOutlineTwitter,
  facebook: AiFillFacebook,
  youtube: AiFillYoutube,
  linkedin: AiFillLinkedin,
  tiktok: AiFillTikTok,
  pinterest: AiFillPinterest
};

const SampadaFooter = ({ footerData }) => {
  if (!footerData) {
    return null;
  }

  const {
    brandName = 'Sampada',
    brandTagline = 'Prosperity in Every Print – Custom products for every occasion',
    socialLinks = [],
    productLinks = [],
    companyLinks = [],
    supportLinks = [],
    legalLinks = [],
    copyrightText = '© 2026 Sampada',
    poweredByText = 'Powered by Printify & Stripe'
  } = footerData;

  // Get icon component for platform
  const getSocialIcon = (platform) => {
    const IconComponent = socialIcons[platform] || AiFillInstagram;
    return <IconComponent />;
  };

  // Render link list
  const renderLinks = (links, indexOffset = 0) => {
    if (!links || links.length === 0) return null;
    
    return links.map((link, index) => (
      <li key={`${link.url}-${indexOffset}-${index}`}>
        <Link 
          href={link.url || '#'} 
          className={styles.footerLink}
        >
          {link.label}
        </Link>
      </li>
    ));
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <h4 className={styles.brandName}>{brandName}</h4>
          <p className={styles.brandDesc}>{brandTagline}</p>
          
          {/* Social Icons */}
          {socialLinks && socialLinks.length > 0 && (
            <div className={styles.socialIcons}>
              {socialLinks.map((social, index) => (
                <a
                  key={`${social.platform}-${index}`}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform || 'Social media link'}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Product Column */}
        {productLinks && productLinks.length > 0 && (
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Product</h4>
            <ul className={styles.colLinks}>
              {renderLinks(productLinks, 1)}
            </ul>
          </div>
        )}

        {/* Company Column */}
        {companyLinks && companyLinks.length > 0 && (
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.colLinks}>
              {renderLinks(companyLinks, 2)}
            </ul>
          </div>
        )}

        {/* Support Column */}
        {supportLinks && supportLinks.length > 0 && (
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Support</h4>
            <ul className={styles.colLinks}>
              {renderLinks(supportLinks, 3)}
            </ul>
          </div>
        )}
      </div>

      {/* Legal Row */}
      <div className={styles.legalRow}>
        <div className={styles.legalLinks}>
          {legalLinks && legalLinks.map((link, index) => (
            <Link 
              key={`legal-${index}`} 
              href={link.url || '#'} 
              className={styles.legalLink}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className={styles.copyright}>
          {copyrightText}
          {poweredByText && ` . ${poweredByText}`}
        </p>
      </div>
    </footer>
  );
};

// Fetch footer data from Sanity (client-side compatible)
export async function getFooterData() {
  try {
    // Use Sanity client if available (server-side)
    if (client && typeof client.fetch === 'function') {
      const footerQuery = `*[_type == "footerSettings"][0]{
        brandName,
        brandTagline,
        socialLinks[] {
          platform,
          url
        },
        productLinks[] {
          label,
          url
        },
        companyLinks[] {
          label,
          url
        },
        supportLinks[] {
          label,
          url
        },
        legalLinks[] {
          label,
          url
        },
        copyrightText,
        poweredByText
      }`;

      const footerData = await client.fetch(footerQuery);
      return footerData || null;
    }
    
    // Fallback: use fetch API for client-side
    const sanityId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    
    if (!sanityId) {
      console.warn('Sanity Project ID not configured');
      return get_default_footer_data();
    }
    
    const url = `https://${sanityId}.api.sanity.io/v1/data/query/${sanityDataset}?query=*[_type == "footerSettings"][0]`;
    const response = await fetch(url);
    const json = await response.json();
    
    return json.result || get_default_footer_data();
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return get_default_footer_data();
  }
}

// Default footer data as fallback
export function get_default_footer_data() {
  return {
    brandName: 'Sampada',
    brandTagline: 'Prosperity in Every Print – Custom products for every occasion',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com' },
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'facebook', url: 'https://facebook.com' },
      { platform: 'youtube', url: 'https://youtube.com' }
    ],
    productLinks: [
      { label: 'Features', url: '/features' },
      { label: 'Pricing', url: '/pricing' },
      { label: 'Use Cases', url: '/use-cases' },
      { label: 'Roadmap', url: '/roadmap' }
    ],
    companyLinks: [
      { label: 'About', url: '/about' },
      { label: 'Blog', url: '/blog' },
      { label: 'Careers', url: '/careers' },
      { label: 'Contact', url: '/contact' }
    ],
    supportLinks: [
      { label: 'Documentation', url: '/documentation' },
      { label: 'API Reference', url: '/api-reference' },
      { label: 'Community', url: '/community' },
      { label: 'Status', url: '/status' }
    ],
    legalLinks: [
      { label: 'Privacy Policy', url: '/privacy-policy' },
      { label: 'Terms of Service', url: '/terms-of-service' },
      { label: 'Cookie Policy', url: '/cookie-policy' }
    ],
    copyrightText: '© 2026 Sampada',
    poweredByText: 'Powered by Printify & Stripe'
  };
}

export default SampadaFooter;
