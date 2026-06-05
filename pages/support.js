// pages/support.js - SAMPADA CUSTOMER SUPPORT WITH SANITY INTEGRATION
import { useState } from 'react'
import Head from 'next/head'
import { client, urlFor } from '@/lib/client'
import styles from '../styles/Support.module.css'
import '../styles/hero-banner.css';
import SpotlightRevealClean from '@/components/spotlight/SpotlightRevealClean';
import SupportContactCard from '@/components/SupportContactCard';
import Modal from '@/components/Modal';
import SupportTicketForm from '@/components/SupportTicketForm';

// ─── Main Support Page ────────────────────────────────────────────────────────
export default function SupportPage({ pageData }) {
  const [openFAQ, setOpenFAQ] = useState(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  if (!pageData || Object.keys(pageData).length === 0) {
    return (
      <div className={styles.main}>
        <div className={styles.empty}>
          <h1>Support page not configured</h1>
          <p>Please configure the support page in Sanity Studio.</p>
        </div>
      </div>
    )
  }

  const {
    heroImage,
    heroRevealImage,
    heroTagline,
    heroHeading,
    contactCards,
    businessHours,
    holidayNote,
    faqs,
    resources,
    podCards,
    ctaHeading,
    ctaSubtext,
    ctaButtonLabel,
    seo,
    contactMethodsTitle,
    contactMethods,
    faqTitle,
    faqDescription,
    helpfulResourcesTitle,
    helpfulResources,
    heroTitle,
    heroDescription,
    heroDescription2,
    heroStyling,
    supportPromise,
    supportHoursTitle,
    supportHours,
    ticketDescription,
    ticketSystemEnabled,
    trustBadges
  } = pageData

  const handleOpenModal = (modalId) => {
    if (modalId === 'ticket' || modalId === 'support-ticket') {
      setIsTicketModalOpen(true)
    }
  }

  // Dynamic mappings for data from the 16 missing fields or original fields
  const displayHeroTitle = heroTitle || heroHeading || 'Your satisfaction is our legacy.'
  const displayHeroTagline = heroTagline || 'CUSTOMER SUPPORT'
  
  // Mapped Contact Cards (prioritize database contactMethods)
  const displayContactCards = contactCards && contactCards.length > 0
    ? contactCards
    : (contactMethods || []).map(method => ({
        title: method.title || (method.method === 'email' ? 'Email Support' : method.method === 'phone' ? 'Call Us' : method.method === 'whatsapp' ? 'WhatsApp' : 'Live Chat'),
        subtitle: method.value,
        description: method.description,
        icon: method.icon, // string or image
        actionType: method.method,
        actionValue: method.value
      }))

  const contactSectionTitle = contactMethodsTitle || 'Connect With Us'

  // Mapped Business Hours
  const displayHours = businessHours && businessHours.length > 0
    ? businessHours
    : (supportHours ? [
        { label: 'Weekdays', hours: supportHours.weekdays, days: 'Monday – Friday' },
        { label: 'Weekend', hours: supportHours.weekend, days: 'Saturday – Sunday' },
        { label: 'Timezone', hours: supportHours.timezone, days: 'Standard Time' }
      ].filter(h => h.hours) : [])

  const hoursSectionTitle = supportHoursTitle || "When We're Available"
  const displayHolidayNote = holidayNote || supportHours?.holidays

  // Mapped FAQs
  const displayFaqTitle = faqTitle || 'Frequently Asked Questions'
  const displayFaqDesc = faqDescription || 'Find quick answers to common questions about orders, shipping, returns, and our heritage collections.'

  // Mapped Helpful Resources
  const displayResourcesTitle = helpfulResourcesTitle || 'Helpful Resources'
  const displayResources = resources && resources.length > 0
    ? resources
    : (helpfulResources || []).map(res => ({
        title: res.title,
        description: res.description,
        link: res.url,
        icon: null
      }))

  // Resolve hero section height dynamically (1350px to show Kavya's full body)
  const heroHeight = '1350px'

  // Resolve hero image URLs using urlFor to apply hotspots/cropping configured in Sanity Studio
  const baseImgUrl = heroImage?.asset ? urlFor(heroImage).url() : (heroImage?.asset?.url || "/images/Kavya/Kav1.jpeg")
  const revealImgUrl = heroRevealImage?.asset ? urlFor(heroRevealImage).url() : (heroRevealImage?.asset?.url || "/images/Kavya/Kav2.jpeg")

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || displayHeroTitle || 'Customer Support - Sampada'}</title>
        <meta name="description" content={seo?.metaDescription || ctaSubtext || displayHeroDescription} />
        {heroImage?.asset?.url && <meta property="og:image" content={heroImage.asset.url} />}
      </Head>

      <main>
        {/* 1. Hero Section: DARK - Spotlight Reveal */}
        <section className="section-dark" style={{ padding: 0, minHeight: heroHeight }}>
          <div className={styles.heroSpotlight} style={{ height: heroHeight, minHeight: heroHeight }}>
            <SpotlightRevealClean
              baseImage={baseImgUrl}
              revealImage={revealImgUrl}
            />
            
            {/* Quote/Heading overlay on left side */}
            <div className={styles.heroQuoteOverlay}>
              <span className="s-label">{displayHeroTagline}</span>
              <h1 className={styles.heroQuote} style={{ borderLeft: 'none', fontStyle: 'normal', fontSize: '2.5rem', fontWeight: 700 }}>
                {displayHeroTitle}
              </h1>
              {(heroDescription || heroDescription2) && (
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '12px', lineHeight: '1.6' }}>
                  {heroDescription || heroDescription2}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Contact Cards: LIGHT */}
        {displayContactCards && displayContactCards.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">GET IN TOUCH</p>
                <h2 className="s-heading">{contactSectionTitle}</h2>
                <span className="s-bar" />
              </div>
              
              <div className="support-cards">
                {displayContactCards.map((card, index) => (
                  <SupportContactCard 
                    key={index} 
                    card={card} 
                    onOpenModal={handleOpenModal}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. Business Hours: DARK */}
        {displayHours && displayHours.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">AVAILABILITY</p>
                <h2 className="s-heading">{hoursSectionTitle}</h2>
                <span className="s-bar" />
              </div>
              
              <div className={styles.hoursGrid}>
                {displayHours.map((entry, index) => (
                  <div key={index} className="s-card-dark">
                    <h3 className="s-card-title">{entry.label}</h3>
                    <p className="s-card-hi">{entry.hours}</p>
                    <p className="s-card-body">{entry.days}</p>
                  </div>
                ))}
              </div>
              
              {displayHolidayNote && (
                <p className={styles.hoursNote}>
                  <span className={styles.hoursIcon}>🗓️</span>
                  {displayHolidayNote}
                </p>
              )}
            </div>
          </section>
        )}

        {/* 4. FAQs: LIGHT (mid cream) */}
        {faqs && faqs.length > 0 && (
          <section className="section-mid s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">COMMON QUESTIONS</p>
                <h2 className="s-heading">{displayFaqTitle}</h2>
                {displayFaqDesc && <p style={{ color: '#5c4a3a', fontSize: '0.95rem', marginTop: '8px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>{displayFaqDesc}</p>}
                <span className="s-bar" />
              </div>
              
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={`${styles.faqItem} ${openFAQ === index ? styles.faqItemOpen : ''}`}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <span className={styles.faqToggle}>{openFAQ === index ? '▲' : '▼'}</span>
                    </button>
                    <div className={`${styles.faqAnswer} ${openFAQ === index ? styles.faqAnswerOpen : ''}`}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Helpful Resources: DARK */}
        {displayResources && displayResources.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">LEARN MORE</p>
                <h2 className="s-heading">{displayResourcesTitle}</h2>
                <span className="s-bar" />
              </div>
              
              <div className={styles.resourcesGrid}>
                {displayResources.map((resource, index) => (
                  <a 
                    key={index} 
                    href={resource.link} 
                    className={styles.resourceCard}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.icon?.asset?.url ? (
                      <div className={styles.resourceIcon}>
                        <img src={resource.icon.asset.url} alt="" style={{ width: '32px', height: '32px' }} />
                      </div>
                    ) : (
                      <div className={styles.resourceIcon}>📖</div>
                    )}
                    <h3 className={styles.resourceTitle}>{resource.title}</h3>
                    <p className={styles.resourceDesc}>{resource.description}</p>
                    <span className={styles.resourceArrow}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Printify Fulfillment Section: LIGHT */}
        {podCards && podCards.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">FULFILLMENT</p>
                <h2 className="s-heading">Print-on-Demand Products</h2>
                <span className="s-bar" />
              </div>
 
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
                {podCards.map((card, index) => (
                  <div key={index} className="s-card">
                    {card.icon?.asset?.url ? (
                      <div className="s-card-icon">
                        <img src={card.icon.asset.url} alt="" style={{ width: '24px', height: '24px' }} />
                      </div>
                    ) : (
                      <div className="s-card-icon">📦</div>
                    )}
                    <h3 className="s-card-title">{card.title}</h3>
                    <p className="s-card-body">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. Ticket System CTA: CRIMSON */}
        <section className="section-crimson s-section">
          <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 className="s-heading">{ctaHeading || 'Still Need Help?'}</h2>
            <p style={{ color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7', margin: '16px 0 32px' }}>
              {ctaSubtext || "Can't find what you're looking for? Submit a support ticket and our team will get back to you within 24 hours."}
            </p>
            <button 
              className="btn-cta-primary" 
              onClick={() => setIsTicketModalOpen(true)}
              style={{ background: 'var(--s-gold)', color: 'var(--s-dark)', border: 'none' }}
            >
              {ctaButtonLabel || 'Submit a Ticket'} <span className="arrow">→</span>
            </button>
          </div>
        </section>
      </main>

      {/* Ticket Modal */}
      <Modal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)}
        title="Submit a Support Ticket"
      >
        <SupportTicketForm onSuccess={() => setIsTicketModalOpen(false)} />
      </Modal>
    </>
  )
}

// ─── Get Server Side Props ───────────────────────────────────────────────────
export async function getServerSideProps() {
  const query = `*[_type == "support"][0]{
    heroImage,
    heroRevealImage,
    heroTagline,
    heroHeading,
    contactCards[]{
      title, subtitle, description,
      icon{ asset->{ url } },
      actionType, actionValue
    },
    businessHours[]{ label, hours, days },
    holidayNote,
    faqs[]{ question, answer },
    resources[]{ title, description, link, icon{ asset->{ url } } },
    podCards[]{ title, description, icon{ asset->{ url } } },
    ctaHeading, ctaSubtext, ctaButtonLabel,
    seo,
    contactMethodsTitle,
    contactMethods,
    faqTitle,
    faqDescription,
    helpfulResourcesTitle,
    helpfulResources,
    heroTitle,
    heroDescription,
    heroDescription2,
    heroStyling,
    supportPromise,
    supportHoursTitle,
    supportHours,
    ticketDescription,
    ticketSystemEnabled,
    trustBadges
  }`;

  try {
    const data = await client.fetch(query);
    return { props: { pageData: data || {} } };
  } catch (error) {
    console.error('GROQ Fetch Error:', error);
    return { props: { pageData: {} } };
  }
}
