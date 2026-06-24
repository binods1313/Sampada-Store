// pages/support.js - SAMPADA CUSTOMER SUPPORT WITH SANITY INTEGRATION
import { useState } from 'react'
import Head from 'next/head'
import { client, urlFor } from '@/lib/client'
import styles from '../styles/Support.module.css'
import '../styles/hero-banner.css';
import SupportContactCard from '@/components/SupportContactCard';
import Modal from '@/components/Modal';
import SupportTicketForm from '@/components/SupportTicketForm';
import SpotlightRevealClean from '@/components/spotlight/SpotlightRevealClean';
import animStyles from '@/styles/animations.module.css';
import { useInView } from '@/hooks/useInView';

// ─── Main Support Page ────────────────────────────────────────────────────────
export default function SupportPage({ pageData }) {
  const [openFAQ, setOpenFAQ] = useState(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

  // useInView hooks
  const [contactRef, contactInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [availabilityRef, availabilityInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [faqRef, faqInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [resourcesRef, resourcesInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [ticketRef, ticketInView] = useInView({ threshold: 0.1, triggerOnce: true })

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
    heroTitle,
    heroDescription,
    heroDescription2,
    heroStyling,
    supportPromise,
    heroImage,
    heroRevealImage,
    contactMethodsTitle,
    contactMethods,
    supportHoursTitle,
    supportHours,
    faqTitle,
    faqDescription,
    faqs,
    helpfulResourcesTitle,
    helpfulResources,
    trustBadges,
    ticketDescription,
    ticketSystemEnabled,
    ctaHeading,
    ctaButtonLabel,
    seo,
    heroTagline,
    heroHeading,
    contactCards,
    businessHours,
    holidayNote,
    resources,
    podCards,
    ctaSubtext
  } = pageData

  const handleOpenModal = (modalId) => {
    if (modalId === 'ticket' || modalId === 'support-ticket' || modalId === 'chat') {
      setIsTicketModalOpen(true)
    }
  }

  // Dynamic mappings for data
  const displayHeroTitle = heroTitle || heroHeading || 'Your satisfaction is our legacy.'
  const displayHeroTagline = heroTagline || 'CUSTOMER SUPPORT'
  
  // Mapped Contact Cards
  const displayContactCards = contactCards && contactCards.length > 0
    ? contactCards
    : (contactMethods || []).map(method => ({
        title: method.title || (method.method === 'email' ? 'Email Support' : method.method === 'phone' ? 'Call Us' : method.method === 'whatsapp' ? 'WhatsApp' : 'Live Chat'),
        subtitle: method.value,
        description: method.description,
        icon: method.icon,
        method: method.method,
        value: method.value
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
        url: res.url,
        type: res.type
      }))

  // Resolve hero section height
  const heroHeight = '1350px'

  // Resolve hero image URLs
  const baseImgUrl = heroImage?.asset ? urlFor(heroImage).url() : (heroImage?.asset?.url || "/images/Kavya/Kav1.jpeg")
  const revealImgUrl = heroRevealImage?.asset ? urlFor(heroRevealImage).url() : (heroRevealImage?.asset?.url || "/images/Kavya/Kav2.jpeg")

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || displayHeroTitle || 'Customer Support - Sampada'}</title>
        <meta name="description" content={seo?.metaDescription || ctaSubtext || displayHeroDescription || heroDescription} />
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
              {supportPromise && (
                <p className="hero-support-promise" style={{ marginTop: '20px', color: 'var(--s-gold)' }}>
                  {supportPromise}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Contact Cards: LIGHT */}
        {displayContactCards && displayContactCards.length > 0 && (
          <section ref={contactRef} className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">GET IN TOUCH</p>
                <h2 className="s-heading">{contactSectionTitle}</h2>
                <span className="s-bar" />
              </div>
              
               <div className="support-cards">
                 {displayContactCards.map((card, index) => (
                   <div
                     key={card._key || index}
                     className={`${index % 2 === 0 ? animStyles.slideInLeft : animStyles.slideInRight} ${contactInView ? animStyles.visible : ''}`}
                     style={{ animationDelay: `${index * 0.1}s` }}
                   >
                     <SupportContactCard 
                       key={card._key || index} 
                       card={card} 
                       onOpenModal={handleOpenModal}
                     />
                   </div>
                 ))}
               </div>
            </div>
          </section>
        )}

        {/* 3. Business Hours & Trust Badges: DARK */}
        <section ref={availabilityRef} className="section-dark s-section">
          <div className="s-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'start' }}>
              {/* Business Hours */}
              <div className={`${animStyles.fadeUp} ${availabilityInView ? animStyles.visible : ''}`}>
                <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                  <p className="s-label">AVAILABILITY</p>
                  <h2 className="s-heading" style={{ fontSize: '1.8rem' }}>{hoursSectionTitle}</h2>
                </div>
                
                <div className={styles.hoursGrid} style={{ display: 'grid', gap: '16px' }}>
                  {displayHours.map((entry, index) => (
                    <div key={index} className="s-card-dark" style={{ padding: '20px' }}>
                      <h3 className="s-card-title" style={{ color: 'var(--s-gold)', marginBottom: '8px' }}>{entry.label}</h3>
                      <p className="s-card-hi" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{entry.hours}</p>
                      <p className="s-card-body">{entry.days}</p>
                    </div>
                  ))}
                </div>
                {displayHolidayNote && (
                  <p className={styles.hoursNote} style={{ marginTop: '20px', color: 'rgba(255,255,255,0.6)' }}>
                    <span className={styles.hoursIcon}>🗓️</span> {displayHolidayNote}
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              {trustBadges && trustBadges.length > 0 && (
                <div className={`${animStyles.fadeUp} ${availabilityInView ? animStyles.visible : ''}`} style={{ animationDelay: '0.2s' }}>
                  <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                    <p className="s-label">OUR COMMITMENT</p>
                    <h2 className="s-heading" style={{ fontSize: '1.8rem' }}>Trusted Service</h2>
                  </div>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {trustBadges.map((badge, index) => (
                      <div key={badge._key || index} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '2rem' }}>{badge.icon}</div>
                        <div>
                          <h4 style={{ color: 'var(--s-text-light)', margin: 0, fontSize: '1.1rem' }}>{badge.title}</h4>
                          <p style={{ color: 'var(--s-text-mid)', margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. FAQs: LIGHT (mid cream) */}
        {faqs && faqs.length > 0 && (
          <section ref={faqRef} className="section-mid s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">COMMON QUESTIONS</p>
                <h2 className="s-heading">{displayFaqTitle}</h2>
                {displayFaqDesc && <p style={{ color: '#5c4a3a', fontSize: '0.95rem', marginTop: '8px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>{displayFaqDesc}</p>}
                <span className="s-bar" />
              </div>
              
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={faq._key || index} className={`${styles.faqItem} ${openFAQ === index ? styles.faqItemOpen : ''} ${animStyles.fadeUp} ${faqInView ? animStyles.visible : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <span className={styles.faqToggle}>{openFAQ === index ? '▲' : '▼'}</span>
                    </button>
                     <div className={`${animStyles.accordionContent} ${openFAQ === index ? animStyles.open : ''}`}>
                       <div className={styles.faqAnswer} style={{ maxHeight: 'none', paddingBottom: '1rem' }}>
                         <p>{faq.answer}</p>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Helpful Resources: DARK */}
        {displayResources && displayResources.length > 0 && (
          <section ref={resourcesRef} className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">LEARN MORE</p>
                <h2 className="s-heading">{displayResourcesTitle}</h2>
                <span className="s-bar" />
              </div>
              
               <div className={styles.resourcesGrid}>
                 {displayResources.map((resource, index) => (
                   <div
                     key={resource._key || index}
                     className={`${animStyles.fadeUp} ${resourcesInView ? animStyles.visible : ''}`}
                     style={{ animationDelay: `${index * 0.08}s` }}
                   >
                     <a 
                       href={resource.url || resource.link} 
                       className={styles.resourceCard}
                       target="_blank"
                       rel="noopener noreferrer"
                     >
                       <div className={styles.resourceIcon}>
                         {resource.type === 'guide' ? '📚' : resource.type === 'docs' ? '📄' : '✍️'}
                       </div>
                       <h3 className={styles.resourceTitle}>{resource.title}</h3>
                       <p className={styles.resourceDesc}>{resource.description}</p>
                       <span className={styles.resourceArrow}>→</span>
                     </a>
                   </div>
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
        {ticketSystemEnabled && (
          <section ref={ticketRef} className="section-crimson s-section">
            <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
              <h2 className="s-heading">{ctaHeading || 'Still Need Help?'}</h2>
              <p style={{ color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7', margin: '16px 0 32px' }}>
                {ticketDescription || "Can't find what you're looking for? Submit a support ticket and our team will get back to you within 24 hours."}
              </p>
               <button 
                 className={`btn-cta-primary ${animStyles.breathingPulse}`} 
                 onClick={() => setIsTicketModalOpen(true)}
                 style={{ background: 'var(--s-gold)', color: 'var(--s-dark)', border: 'none' }}
               >
                 {ctaButtonLabel || 'Submit a Ticket'} <span className="arrow">→</span>
               </button>
            </div>
          </section>
        )}
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
    faqs[]{ question, answer, _key },
    resources[]{ title, description, link, icon{ asset->{ url } } },
    podCards[]{ title, description, icon{ asset->{ url } } },
    ctaHeading, ctaSubtext, ctaButtonLabel,
    seo,
    contactMethodsTitle,
    contactMethods[]{
      method, value, description, icon, _key
    },
    faqTitle,
    faqDescription,
    helpfulResourcesTitle,
    helpfulResources[]{ title, description, type, url, _key },
    heroTitle,
    heroDescription,
    heroDescription2,
    heroStyling,
    supportPromise,
    supportHoursTitle,
    supportHours{ weekdays, weekend, timezone, holidays },
    ticketDescription,
    ticketSystemEnabled,
    trustBadges[]{ title, description, icon, _key }
  }`;

  try {
    const data = await client.fetch(query);
    return { props: { pageData: data || {} } };
  } catch (error) {
    console.error('GROQ Fetch Error:', error);
    return { props: { pageData: {} } };
  }
}
