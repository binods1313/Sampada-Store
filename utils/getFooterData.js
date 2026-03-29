// utils/getFooterData.js
// Server-side utility to fetch footer data for Next.js getStaticProps or getServerSideProps

import { createClient } from '@sanity/client';

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-18';

// Create client for server-side use
const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lh35oho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion,
  useCdn: false, // Always fetch fresh data for footer
});

/**
 * Fetch footer data with dynamic links from published pages
 * @returns {Promise<Object>} Footer data object
 */
export async function getFooterData() {
  try {
    // Fetch footer settings
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
      legalLinks[] {
        label,
        url
      },
      copyrightText,
      poweredByText
    }`;

    // Fetch Company page for company links
    const companyQuery = `*[_type == "company"][0]{
      _id,
      title,
      "slug": "company"
    }`;

    // Fetch Support page for support links
    const supportQuery = `*[_type == "support"][0]{
      _id,
      title,
      "slug": "support"
    }`;

    // Fetch Team page for team/careers links
    const teamQuery = `*[_type == "team"][0]{
      _id,
      title,
      "slug": "team",
      "hasCareers": defined(careersCTALink)
    }`;

    // Fetch About Us page
    const aboutQuery = `*[_type == "aboutUs"][0]{
      _id,
      title,
      "slug": "about"
    }`;

    // Fetch Stories page
    const storiesQuery = `*[_type == "storiesPage"][0]{
      _id,
      title,
      "slug": "stories"
    }`;

    const [footerData, companyPage, supportPage, teamPage, aboutPage, storiesPage] = await Promise.all([
      serverClient.fetch(footerQuery),
      serverClient.fetch(companyQuery),
      serverClient.fetch(supportQuery),
      serverClient.fetch(teamQuery),
      serverClient.fetch(aboutQuery),
      serverClient.fetch(storiesQuery)
    ]);

    // Build dynamic company links based on published pages
    const dynamicCompanyLinks = [];
    
    if (aboutPage) {
      dynamicCompanyLinks.push({ label: 'About Us', url: '/about' });
    }
    if (companyPage) {
      dynamicCompanyLinks.push({ label: 'Company', url: '/company' });
    }
    if (teamPage) {
      dynamicCompanyLinks.push({ label: 'Team', url: '/team' });
    }
    // Add Stories link if published
    if (storiesPage) {
      dynamicCompanyLinks.push({ label: 'Sampada Stories', url: '/stories' });
    }
    // Blog is typically static unless you have a blog schema
    dynamicCompanyLinks.push({ label: 'Blog', url: '/blog' });
    // Show Careers only if team page has careers CTA enabled
    if (teamPage?.hasCareers) {
      dynamicCompanyLinks.push({ label: 'Careers', url: '/careers' });
    }

    // Build dynamic support links based on published pages
    const dynamicSupportLinks = [];
    
    if (supportPage) {
      dynamicSupportLinks.push({ label: 'Support Center', url: '/support' });
    }
    dynamicSupportLinks.push({ label: 'Documentation', url: '/documentation' });
    dynamicSupportLinks.push({ label: 'Contact Us', url: '/contact' });
    dynamicSupportLinks.push({ label: 'FAQs', url: '/faq' });

    return {
      ...(footerData || {}),
      companyLinks: dynamicCompanyLinks,
      supportLinks: dynamicSupportLinks
    };
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return getDefaultFooterData();
  }
}

/**
 * Get default footer data as fallback
 * @returns {Object} Default footer data
 */
export function getDefaultFooterData() {
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
      { label: 'About Us', url: '/about' },
      { label: 'Company', url: '/company' },
      { label: 'Team', url: '/team' },
      { label: 'Blog', url: '/blog' },
      { label: 'Careers', url: '/careers' }
    ],
    supportLinks: [
      { label: 'Support Center', url: '/support' },
      { label: 'Documentation', url: '/documentation' },
      { label: 'Contact Us', url: '/contact' },
      { label: 'FAQs', url: '/faq' }
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

/**
 * Generate footer navigation links for use in layout or pages
 * @param {Object} footerData - Footer data object
 * @returns {Object} Structured navigation links
 */
export function getFooterNavigation(footerData) {
  const {
    companyLinks = [],
    supportLinks = [],
    productLinks = [],
    legalLinks = [],
    socialLinks = []
  } = footerData || {};

  return {
    company: companyLinks,
    support: supportLinks,
    product: productLinks,
    legal: legalLinks,
    social: socialLinks
  };
}
