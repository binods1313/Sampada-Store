// pages/contact.js
// Contact Page - Dynamically fetches content from Sanity
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { urlFor } from '@/lib/client';
import { client, writeClient } from '@/lib/client';

// Social media icons mapping
const socialIcons = {
  instagram: '📷',
  facebook: '👍',
  twitter: '🐦',
  linkedin: '💼',
  youtube: '📺',
  whatsapp: '💬',
  tiktok: '🎵',
  pinterest: '📌'
};

const Contact = ({ contactPage, notFound = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await writeClient.create({
        _type: 'contactMessage',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        submitDate: new Date().toISOString()
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(contactPage?.contactFormSection?.errorMessage || 'There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (notFound || !contactPage) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--s-serif)', fontSize: '2rem', marginBottom: '16px' }}>Contact Page Not Published</h1>
          <p style={{ marginBottom: '12px' }}>Our contact page is coming soon!</p>
          <p style={{ marginBottom: '24px' }}>In the meantime, email us at: <a href="mailto:hello@sampada.com" style={{ color: 'var(--s-crimson)' }}>hello@sampada.com</a></p>
          <Link href="/" className="btn-cta-primary">Back to Home <span className="arrow">→</span></Link>
        </div>
      </div>
    );
  }

  const {
    title,
    heroSection,
    introductionSection,
    contactInformation = [],
    contactFormSection,
    socialMediaSection,
    faqSection
  } = contactPage;

  return (
    <>
      <Head>
        <title>{contactPage.seo?.metaTitle || `Contact Us – ${title || 'Sampada'}`}</title>
        <meta name="description" content={contactPage.seo?.metaDescription || introductionSection?.description || ''} />
        {contactPage.seo?.keywords && (
          <meta name="keywords" content={contactPage.seo.keywords.join(', ')} />
        )}
        {contactPage.seo?.ogImage?.asset && (
          <meta property="og:image" content={urlFor(contactPage.seo.ogImage).width(1200).height(630).url()} />
        )}
      </Head>

      <main>
        {/* Hero Section: DARK */}
        <section className="section-dark s-section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
          <div className="s-container" style={{ textAlign: 'center' }}>
            <p className="s-label">GET IN TOUCH</p>
            <h1 className="s-heading" style={{ fontSize: '2.8rem' }}>
              {heroSection?.title || title || 'Contact Us'}
            </h1>
            {heroSection?.subtitle && (
              <p style={{ color: 'var(--s-text-mid)', fontSize: '1.1rem', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0' }}>
                {heroSection.subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Introduction Section: LIGHT */}
        {introductionSection && (
          <section className="section-light s-section">
            <div className="s-container" style={{ textAlign: 'center', maxWidth: '700px' }}>
              {introductionSection.title && (
                <>
                  <h2 className="s-heading">{introductionSection.title}</h2>
                  <span className="s-bar" />
                </>
              )}
              {introductionSection.description && (
                <p style={{ color: 'var(--s-text-body)', fontSize: '1rem', lineHeight: '1.8' }}>
                  {introductionSection.description}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Contact Information Cards: DARK */}
        {contactInformation.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '24px',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                {contactInformation.map((card, index) => (
                  <div key={card._key || index} className="s-card-dark">
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
                      <span className="s-card-icon" style={{ margin: 0 }}>{card.icon}</span>
                    </div>
                    <h3 className="s-card-title">{card.title}</h3>
                    {card.link ? (
                      <a href={card.link} className="s-card-hi" style={{ textDecoration: 'none', display: 'block' }}>
                        {card.content.split('\n').map((line, i) => (
                          <span key={i}>{line}{i < card.content.split('\n').length - 1 && <br />}</span>
                        ))}
                      </a>
                    ) : (
                      <p className="s-card-body">
                        {card.content.split('\n').map((line, i) => (
                          <span key={i}>{line}{i < card.content.split('\n').length - 1 && <br />}</span>
                        ))}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Form & Map Section: LIGHT */}
        {contactFormSection && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: contactFormSection.showMap && contactFormSection.mapEmbedUrl ? '1fr 1fr' : '1fr', 
                gap: '48px',
                alignItems: 'start'
              }}>
                {/* Contact Form */}
                <div style={{ 
                  background: '#FFFFFF', 
                  padding: '40px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(139,26,26,0.12)',
                  boxShadow: '0 2px 12px rgba(139,26,26,0.05)'
                }}>
                  {contactFormSection.title && (
                    <h2 style={{ 
                      fontFamily: 'var(--s-serif)', 
                      fontSize: '1.8rem', 
                      color: 'var(--s-text-heading)', 
                      marginBottom: '8px' 
                    }}>
                      {contactFormSection.title}
                    </h2>
                  )}
                  {contactFormSection.description && (
                    <p style={{ 
                      color: 'var(--s-text-body)', 
                      fontSize: '0.9rem', 
                      marginBottom: '32px',
                      lineHeight: '1.6'
                    }}>
                      {contactFormSection.description}
                    </p>
                  )}

                  {formSubmitted ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '40px 20px',
                      background: 'rgba(139,26,26,0.03)',
                      borderRadius: '8px',
                      border: '1px solid rgba(139,26,26,0.1)'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
                      <h3 style={{ 
                        fontFamily: 'var(--s-serif)', 
                        fontSize: '1.4rem', 
                        color: 'var(--s-text-heading)', 
                        marginBottom: '8px' 
                      }}>
                        {contactFormSection.successMessage?.split('\n')[0] || 'Message Sent!'}
                      </h3>
                      <p style={{ color: 'var(--s-text-body)', marginBottom: '24px' }}>
                        {contactFormSection.successMessage?.split('\n')[1] || 'We\'ll get back to you soon.'}
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        style={{
                          background: 'transparent',
                          border: '2px solid var(--s-crimson)',
                          color: 'var(--s-crimson)',
                          padding: '10px 24px',
                          borderRadius: '4px',
                          fontFamily: 'var(--s-sans)',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'var(--s-crimson)';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = 'var(--s-crimson)';
                        }}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      {formError && (
                        <div style={{ 
                          padding: '12px 16px', 
                          background: 'rgba(139,26,26,0.05)', 
                          borderLeft: '3px solid var(--s-crimson)', 
                          borderRadius: '4px',
                          marginBottom: '24px',
                          color: 'var(--s-crimson)',
                          fontSize: '0.9rem'
                        }}>
                          ⚠️ {formError}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label htmlFor="name" style={{ 
                            display: 'block', 
                            fontFamily: 'var(--s-sans)', 
                            fontSize: '0.85rem', 
                            fontWeight: '600',
                            color: 'var(--s-text-heading)', 
                            marginBottom: '6px' 
                          }}>
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '1px solid rgba(139,26,26,0.15)',
                              borderRadius: '4px',
                              fontFamily: 'var(--s-sans)',
                              fontSize: '0.95rem',
                              color: 'var(--s-text-heading)',
                              transition: 'border-color 0.25s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--s-crimson)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(139,26,26,0.15)'}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="email" style={{ 
                            display: 'block', 
                            fontFamily: 'var(--s-sans)', 
                            fontSize: '0.85rem', 
                            fontWeight: '600',
                            color: 'var(--s-text-heading)', 
                            marginBottom: '6px' 
                          }}>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '1px solid rgba(139,26,26,0.15)',
                              borderRadius: '4px',
                              fontFamily: 'var(--s-sans)',
                              fontSize: '0.95rem',
                              color: 'var(--s-text-heading)',
                              transition: 'border-color 0.25s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--s-crimson)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(139,26,26,0.15)'}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" style={{ 
                            display: 'block', 
                            fontFamily: 'var(--s-sans)', 
                            fontSize: '0.85rem', 
                            fontWeight: '600',
                            color: 'var(--s-text-heading)', 
                            marginBottom: '6px' 
                          }}>
                            Subject *
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '1px solid rgba(139,26,26,0.15)',
                              borderRadius: '4px',
                              fontFamily: 'var(--s-sans)',
                              fontSize: '0.95rem',
                              color: 'var(--s-text-heading)',
                              transition: 'border-color 0.25s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--s-crimson)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(139,26,26,0.15)'}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="message" style={{ 
                            display: 'block', 
                            fontFamily: 'var(--s-sans)', 
                            fontSize: '0.85rem', 
                            fontWeight: '600',
                            color: 'var(--s-text-heading)', 
                            marginBottom: '6px' 
                          }}>
                            Your Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: '1px solid rgba(139,26,26,0.15)',
                              borderRadius: '4px',
                              fontFamily: 'var(--s-sans)',
                              fontSize: '0.95rem',
                              color: 'var(--s-text-heading)',
                              resize: 'vertical',
                              transition: 'border-color 0.25s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--s-crimson)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(139,26,26,0.15)'}
                            required
                          ></textarea>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="btn-cta-primary"
                            disabled={isSubmitting}
                            style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                          >
                            {isSubmitting ? 'Sending...' : (contactFormSection.submitButton || 'Send Message')} <span className="arrow">→</span>
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>

                {/* Google Maps Embed */}
                {contactFormSection.showMap && contactFormSection.mapEmbedUrl && (
                  <div style={{ position: 'sticky', top: '100px' }}>
                    <iframe
                      src={contactFormSection.mapEmbedUrl}
                      title="Google Maps"
                      width="100%"
                      height="550"
                      style={{ border: 0, borderRadius: '8px', boxShadow: '0 2px 12px rgba(139,26,26,0.1)' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Social Media Section: DARK */}
        {socialMediaSection?.socialLinks?.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container" style={{ textAlign: 'center' }}>
              {socialMediaSection.title && (
                <>
                  <p className="s-label">CONNECT WITH US</p>
                  <h2 className="s-heading">{socialMediaSection.title}</h2>
                  <span className="s-bar" />
                </>
              )}
              {socialMediaSection.description && (
                <p style={{ color: 'var(--s-text-mid)', maxWidth: '600px', margin: '0 auto 48px', fontSize: '0.95rem' }}>
                  {socialMediaSection.description}
                </p>
              )}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {socialMediaSection.socialLinks.map((social, index) => (
                  <a
                    key={social._key || index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="s-card-dark"
                    style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                  >
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>
                      {socialIcons[social.platform] || '🔗'}
                    </span>
                    <h3 className="s-card-title">
                      {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    </h3>
                    {social.handle && (
                      <span className="s-card-hi">@{social.handle}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section: LIGHT (mid cream) */}
        {faqSection?.faqs?.length > 0 && (
          <section className="section-mid s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">COMMON QUESTIONS</p>
                {faqSection.title && (
                  <h2 className="s-heading">{faqSection.title}</h2>
                )}
                {faqSection.description && (
                  <p style={{ color: 'var(--s-text-body)', maxWidth: '600px', margin: '12px auto 0' }}>
                    {faqSection.description}
                  </p>
                )}
                <span className="s-bar" />
              </div>
              <div style={{ maxWidth: '740px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqSection.faqs.map((faq, index) => (
                  <div key={faq._key || index} style={{
                    background: '#FDFAF6',
                    border: '1px solid rgba(139,26,26,0.15)',
                    borderRadius: '8px',
                    borderLeft: '3px solid var(--s-crimson)',
                    padding: '20px 24px'
                  }}>
                    <h3 style={{ 
                      fontFamily: 'var(--s-serif)', 
                      fontSize: '1.05rem', 
                      color: 'var(--s-text-heading)', 
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      {faq.question}
                    </h3>
                    <p style={{ 
                      color: 'var(--s-text-body)', 
                      fontSize: '0.9rem', 
                      lineHeight: '1.7',
                      margin: 0
                    }}>
                      {faq.answer}
                    </p>
                    {faq.category && (
                      <span style={{ 
                        display: 'inline-block',
                        marginTop: '12px',
                        padding: '4px 12px',
                        background: 'rgba(139,26,26,0.08)',
                        color: 'var(--s-crimson)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {faq.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA: CRIMSON */}
        <section className="section-crimson s-section">
          <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 className="s-heading">Still Have Questions?</h2>
            <p style={{ color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7', margin: '16px 0 32px' }}>
              Need more help? Visit our support page for comprehensive FAQs, guides, and resources.
            </p>
            <Link href="/support" className="btn-cta-primary">
              Visit Support <span className="arrow">→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const query = `*[_type == "contactPage"][0]{
      _id,
      title,
      slug,
      heroSection {
        title,
        subtitle,
        backgroundImage {
          alt,
          asset->{
            _ref
          }
        }
      },
      introductionSection {
        title,
        description
      },
      contactInformation[] {
        _key,
        icon,
        title,
        content,
        link
      },
      contactFormSection {
        title,
        description,
        submitButton,
        successMessage,
        errorMessage,
        showMap,
        mapEmbedUrl
      },
      socialMediaSection {
        title,
        description,
        socialLinks[] {
          _key,
          platform,
          url,
          handle
        }
      },
      faqSection {
        title,
        description,
        faqs[] {
          _key,
          question,
          answer,
          category
        }
      },
      seo {
        metaTitle,
        metaDescription,
        keywords,
        ogImage {
          asset->{
            _ref
          }
        },
        canonicalUrl,
        noIndex
      },
      publishedAt,
      updatedAt
    }`;

    const contactPage = await client.fetch(query);

    if (!contactPage) {
      return {
        props: {
          contactPage: null,
          notFound: true
        }
      };
    }

    return {
      props: {
        contactPage,
        notFound: false
      }
    };
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return {
      props: {
        contactPage: null,
        notFound: true
      }
    };
  }
}

export default Contact;
