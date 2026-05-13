// pages/support.js - SAMPADA CUSTOMER SUPPORT WITH SPOTLIGHT REVEAL
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { client, urlFor } from '@/lib/client'
import styles from '../styles/Support.module.css'
import SpotlightRevealClean from '@/components/spotlight/SpotlightRevealClean'

// ─── Main Support Page ────────────────────────────────────────────────────────
export default function SupportPage({ supportData, banner }) {
  const [openFAQ, setOpenFAQ] = useState(null)

  // Helper functions for icons and labels
  const getMethodLabel = (method) => {
    const labels = {
      email: 'Email Support',
      phone: 'Phone Support',
      whatsapp: 'WhatsApp Chat',
      chat: 'Live Chat',
      form: 'Contact Form'
    }
    return labels[method] || method
  }

  const getMethodIcon = (method) => {
    const icons = {
      email: '📧',
      phone: '📞',
      whatsapp: '💬',
      chat: '💬',
      form: '📝'
    }
    return icons[method] || '📞'
  }

  const getTypeIcon = (type) => {
    const icons = {
      guide: '📏',
      tutorial: '🎓',
      blog: '📝',
      video: '🎥',
      docs: '📖'
    }
    return icons[type] || '📄'
  }

  if (!supportData) {
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
    heroImage,
    heroStyling,
    supportPromise,
    contactMethodsTitle,
    contactMethods,
    faqTitle,
    faqDescription,
    faqs,
    supportHoursTitle,
    supportHours,
    helpfulResourcesTitle,
    helpfulResources,
    ticketSystemEnabled,
    ticketDescription,
    seo
  } = supportData

  const heroImageUrl = heroImage ? urlFor(heroImage).width(1920).height(1080).url() : null

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || 'Customer Support - Sampada'}</title>
        <meta name="description" content={seo?.metaDescription || heroDescription} />
        <meta property="og:title" content={seo?.metaTitle || heroTitle} />
        <meta property="og:description" content={seo?.metaDescription || heroDescription} />
        {heroImageUrl && <meta property="og:image" content={heroImageUrl} />}
      </Head>

      <main>
        {/* Hero Section: DARK - Spotlight Reveal */}
        <section className="section-dark" style={{ padding: 0, minHeight: '100vh' }}>
          <div className={styles.heroSpotlight}>
            <SpotlightRevealClean
              baseImage="/images/Kavya/Kav1.jpeg"
              revealImage="/images/Kavya/Kav2.jpeg"
            />
            
            {/* Quote overlay on left side */}
            <div className={styles.heroQuoteOverlay}>
              <span className="s-label">CUSTOMER SUPPORT</span>
              <blockquote className={styles.heroQuote}>
                Your satisfaction is our legacy. Every inquiry is treated with the care and <em>attention</em> that defines the Sampada experience.
              </blockquote>
            </div>
          </div>
        </section>

        {/* Support Quote */}
        {banner?.collectionQuote?.supportQuote && (
          <section className="section-light s-section">
            <div className="s-container" style={{ textAlign: 'center', maxWidth: '700px' }}>
              <p style={{
                fontFamily: 'var(--s-serif)',
                fontSize: '1.8rem',
                fontStyle: 'italic',
                color: 'var(--s-crimson)',
                lineHeight: '1.4'
              }}>
                "{banner.collectionQuote.supportQuote}"
              </p>
            </div>
          </section>
        )}

        {/* Contact Methods: LIGHT */}
        {contactMethods && contactMethods.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">GET IN TOUCH</p>
                <h2 className="s-heading">
                  {contactMethodsTitle || 'Connect With Us'}
                </h2>
                <span className="s-bar" />
              </div>
              <div className={styles.contactGrid}>
                {contactMethods.map((method, index) => (
                  <div key={index} className="s-card">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(139,26,26,0.08)',
                      border: '1px solid rgba(139,26,26,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}>
                      <span className="s-card-icon" style={{ margin: 0 }}>{getMethodIcon(method.method)}</span>
                    </div>
                    <h3 className="s-card-title">{getMethodLabel(method.method)}</h3>
                    <p className="s-card-hi">{method.value}</p>
                    {method.description && <p className="s-card-body">{method.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Support Hours: DARK */}
        {supportHours && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">AVAILABILITY</p>
                <h2 className="s-heading">
                  {supportHoursTitle || "When We're Available"}
                </h2>
                <span className="s-bar" />
              </div>
              <div className={styles.hoursGrid}>
                {supportHours.weekdays && (
                  <div className="s-card-dark">
                    <h3 className="s-card-title">Weekdays</h3>
                    <p className="s-card-hi">{supportHours.weekdays}</p>
                    <p className="s-card-body">Monday - Friday</p>
                  </div>
                )}
                {supportHours.weekend && (
                  <div className="s-card-dark">
                    <h3 className="s-card-title">Weekend</h3>
                    <p className="s-card-hi">{supportHours.weekend}</p>
                    <p className="s-card-body">Saturday - Sunday</p>
                  </div>
                )}
                {supportHours.timezone && (
                  <div className="s-card-dark">
                    <h3 className="s-card-title">Timezone</h3>
                    <p className="s-card-hi">{supportHours.timezone}</p>
                    <p className="s-card-body">All times shown in</p>
                  </div>
                )}
              </div>
              {supportHours.holidays && (
                <p style={{ 
                  maxWidth: '600px', 
                  margin: '24px auto 0', 
                  padding: '12px 20px', 
                  background: 'rgba(201,169,110,0.1)', 
                  borderLeft: '3px solid var(--s-gold)', 
                  borderRadius: '4px', 
                  color: 'var(--s-text-mid)', 
                  fontSize: '0.85rem', 
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <span>🗓️</span>
                  {supportHours.holidays}
                </p>
              )}
            </div>
          </section>
        )}

        {/* FAQs: LIGHT (mid cream) */}
        {faqs && faqs.length > 0 && (
          <section className="section-mid s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">COMMON QUESTIONS</p>
                <h2 className="s-heading">
                  {faqTitle || 'Frequently Asked Questions'}
                </h2>
                {faqDescription && <p style={{ color: 'var(--s-text-body)', maxWidth: '600px', margin: '12px auto 0' }}>{faqDescription}</p>}
                <span className="s-bar" />
              </div>
              <div style={{ maxWidth: '740px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {faqs.map((faq, index) => (
                  <div key={index} className={`${styles.faqItem} ${openFAQ === index ? styles.faqItemOpen : ''}`} style={{
                    background: '#FDFAF6',
                    border: '1px solid rgba(139,26,26,0.15)',
                    borderRadius: '8px',
                    borderLeft: '3px solid var(--s-crimson)',
                    overflow: 'hidden'
                  }}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 1.25rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--s-text-heading)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{faq.question}</span>
                      <span style={{ color: 'var(--s-crimson)', marginLeft: '12px' }}>{openFAQ === index ? '▲' : '▼'}</span>
                    </button>
                    <div
                      className={`${styles.faqAnswer} ${openFAQ === index ? styles.faqAnswerOpen : ''}`}
                      style={{
                        maxHeight: openFAQ === index ? '300px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.35s ease',
                        padding: openFAQ === index ? '0 1.25rem 1rem' : '0 1.25rem',
                        color: 'var(--s-text-body)',
                        fontSize: '0.85rem',
                        lineHeight: '1.7'
                      }}
                    >
                      <p style={{ margin: 0 }}>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Helpful Resources: DARK */}
        {helpfulResources && helpfulResources.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">LEARN MORE</p>
                <h2 className="s-heading">
                  {helpfulResourcesTitle || 'Helpful Resources'}
                </h2>
                <span className="s-bar" />
              </div>
              <div className={styles.resourcesGrid}>
                {helpfulResources.map((resource, index) => (
                  <Link key={index} href={resource.url} className="s-card-dark" style={{ textDecoration: 'none', display: 'block', position: 'relative' }}>
                    <div className="s-card-icon">{getTypeIcon(resource.type)}</div>
                    <h3 className="s-card-title">{resource.title}</h3>
                    <p className="s-card-body">{resource.description}</p>
                    <span style={{ 
                      position: 'absolute', 
                      bottom: '12px', 
                      right: '12px', 
                      fontSize: '1rem', 
                      color: 'var(--s-gold)', 
                      opacity: 0,
                      transition: 'all 0.25s ease'
                    }} className={styles.resourceArrow}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Printify Fulfillment Information: LIGHT */}
        <section className="section-light s-section">
          <div className="s-container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p className="s-label">FULFILLMENT</p>
              <h2 className="s-heading">Print-on-Demand Products</h2>
              <span className="s-bar" />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {/* Shipping */}
              <div className="s-card">
                <div className="s-card-icon">🚚</div>
                <h3 className="s-card-title">Shipping Times</h3>
                <p className="s-card-body">
                  Print-on-demand products are made to order. Standard shipping: 5-7 business days for production + 3-5 days for delivery.
                </p>
              </div>

              {/* Returns */}
              <div className="s-card">
                <div className="s-card-icon">↩️</div>
                <h3 className="s-card-title">Returns Policy</h3>
                <p className="s-card-body">
                  We accept returns within 30 days for defective or damaged items. Custom printed products cannot be returned unless defective.
                </p>
              </div>

              {/* Quality */}
              <div className="s-card">
                <div className="s-card-icon">✨</div>
                <h3 className="s-card-title">Quality Guarantee</h3>
                <p className="s-card-body">
                  Every product is inspected before shipping. We partner with premium print providers to ensure the highest quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket System CTA: CRIMSON */}
        {ticketSystemEnabled && (
          <section className="section-crimson s-section">
            <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
              <h2 className="s-heading">Still Need Help?</h2>
              <p style={{ color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7', margin: '16px 0 32px' }}>
                {ticketDescription ||
                  "Can't find what you're looking for? Submit a support ticket and our team will get back to you within 24 hours."}
              </p>
              <Link href="/contact" className="btn-cta-primary">
                Submit a Ticket <span className="arrow">→</span>
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

// ─── Get Static Props ─────────────────────────────────────────────────────────
export async function getStaticProps() {
  const query = `*[_type == "support"][0]{
    ...,
    heroImage {
      ...,
      asset->
    }
  }`

  const bannerQuery = `*[_type == "banner"][0]{
    collectionQuote
  }`

  try {
    const [supportData, banner] = await Promise.all([
      client.fetch(query),
      client.fetch(bannerQuery)
    ])
    
    return {
      props: {
        supportData: supportData || null,
        banner: banner || null
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching support data:', error)
    return {
      props: {
        supportData: null,
        banner: null
      },
      revalidate: 60
    }
  }
}
