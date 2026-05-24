// pages/support.js - SAMPADA CUSTOMER SUPPORT WITH SANITY INTEGRATION
import { useState } from 'react'
import Head from 'next/head'
import { client } from '@/lib/client'
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
    seo
  } = pageData

  const handleOpenModal = (modalId) => {
    if (modalId === 'ticket' || modalId === 'support-ticket') {
      setIsTicketModalOpen(true)
    }
  }

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || heroHeading || 'Customer Support - Sampada'}</title>
        <meta name="description" content={seo?.metaDescription || ctaSubtext} />
        {heroImage?.asset?.url && <meta property="og:image" content={heroImage.asset.url} />}
      </Head>

      <main>
        {/* 1. Hero Section: DARK - Spotlight Reveal */}
        <section className="section-dark" style={{ padding: 0, minHeight: '100svh' }}>
          <div className={styles.heroSpotlight}>
            <SpotlightRevealClean
              baseImage={heroImage?.asset?.url || "/images/Kavya/Kav1.jpeg"}
              revealImage={heroRevealImage?.asset?.url || "/images/Kavya/Kav2.jpeg"}
            />
            
            {/* Quote/Heading overlay on left side */}
            <div className={styles.heroQuoteOverlay}>
              <span className="s-label">{heroTagline || 'CUSTOMER SUPPORT'}</span>
              <h1 className={styles.heroQuote} style={{ borderLeft: 'none', fontStyle: 'normal', fontSize: '2.5rem', fontWeight: 700 }}>
                {heroHeading || 'Your satisfaction is our legacy.'}
              </h1>
            </div>
          </div>
        </section>

        {/* 2. Contact Cards: LIGHT */}
        {contactCards && contactCards.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">GET IN TOUCH</p>
                <h2 className="s-heading">Connect With Us</h2>
                <span className="s-bar" />
              </div>
              
              <div className="support-cards">
                {contactCards.map((card, index) => (
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
        {businessHours && businessHours.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">AVAILABILITY</p>
                <h2 className="s-heading">When We&apos;re Available</h2>
                <span className="s-bar" />
              </div>
              
              <div className={styles.hoursGrid}>
                {businessHours.map((entry, index) => (
                  <div key={index} className="s-card-dark">
                    <h3 className="s-card-title">{entry.label}</h3>
                    <p className="s-card-hi">{entry.hours}</p>
                    <p className="s-card-body">{entry.days}</p>
                  </div>
                ))}
              </div>
              
              {holidayNote && (
                <p className={styles.hoursNote}>
                  <span className={styles.hoursIcon}>🗓️</span>
                  {holidayNote}
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
                <h2 className="s-heading">Frequently Asked Questions</h2>
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
        {resources && resources.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">LEARN MORE</p>
                <h2 className="s-heading">Helpful Resources</h2>
                <span className="s-bar" />
              </div>
              
              <div className={styles.resourcesGrid}>
                {resources.map((resource, index) => (
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
    heroImage{ asset->{ url } },
    heroRevealImage{ asset->{ url } },
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
    seo
  }`;

  try {
    const data = await client.fetch(query);
    return { props: { pageData: data || {} } };
  } catch (error) {
    console.error('GROQ Fetch Error:', error);
    return { props: { pageData: {} } };
  }
}
