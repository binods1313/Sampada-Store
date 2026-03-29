// pages/contact.js
// Contact Page - Dynamically fetches content from Sanity
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { urlFor } from '@/lib/client';
import { client, writeClient } from '@/lib/client';
import styles from '@/components/ContactPage.module.css';

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
      <div className={styles.notFound}>
        <h1>Contact Page Not Published</h1>
        <p>Our contact page is coming soon!</p>
        <p>In the meantime, email us at: <a href="mailto:hello@sampada.com">hello@sampada.com</a></p>
        <Link href="/" className={styles.backHome}>Back to Home</Link>
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

  const heroImageUrl = heroSection?.backgroundImage?.asset
    ? urlFor(heroSection.backgroundImage).width(1920).height(600).url()
    : null;

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

      <main className={styles.contactPage}>
        {/* Hero Section */}
        <section className={styles.heroSection} style={{
          backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none'
        }}>
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>{heroSection?.title || title}</h1>
            {heroSection?.subtitle && (
              <p className={styles.heroSubtitle}>{heroSection.subtitle}</p>
            )}
          </div>
        </section>

        {/* Introduction Section */}
        {introductionSection && (
          <section className={styles.introductionSection}>
            <div className="container max-w-4xl mx-auto px-6 text-center">
              {introductionSection.title && (
                <h2 className={styles.sectionTitle}>{introductionSection.title}</h2>
              )}
              {introductionSection.description && (
                <p className={styles.sectionDescription}>{introductionSection.description}</p>
              )}
            </div>
          </section>
        )}

        {/* Contact Information Cards */}
        {contactInformation.length > 0 && (
          <section className={styles.contactCardsSection}>
            <div className="container max-w-6xl mx-auto px-6">
              <div className={styles.contactCardsGrid}>
                {contactInformation.map((card, index) => (
                  <div key={card._key || index} className={styles.contactCard}>
                    <div className={styles.contactCardIcon}>{card.icon}</div>
                    <h3 className={styles.contactCardTitle}>{card.title}</h3>
                    {card.link ? (
                      <a href={card.link} className={styles.contactCardContent}>
                        {card.content.split('\n').map((line, i) => (
                          <span key={i}>{line}{i < card.content.split('\n').length - 1 && <br />}</span>
                        ))}
                      </a>
                    ) : (
                      <p className={styles.contactCardContent}>
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

        {/* Contact Form & Map Section */}
        {contactFormSection && (
          <section className={styles.contactFormSection}>
            <div className="container max-w-6xl mx-auto px-6">
              <div className={styles.formAndMapGrid}>
                {/* Contact Form */}
                <div className={styles.contactFormWrapper}>
                  {contactFormSection.title && (
                    <h2 className={styles.formTitle}>{contactFormSection.title}</h2>
                  )}
                  {contactFormSection.description && (
                    <p className={styles.formDescription}>{contactFormSection.description}</p>
                  )}

                  {formSubmitted ? (
                    <div className={styles.formSuccess}>
                      <div className={styles.successIcon}>✅</div>
                      <h3>{contactFormSection.successMessage?.split('\n')[0]}</h3>
                      <p>{contactFormSection.successMessage?.split('\n')[1]}</p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className={styles.resendButton}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      {formError && (
                        <div className={styles.formError}>
                          ⚠️ {formError}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className={styles.contactForm}>
                        <div className={styles.formGroup}>
                          <label htmlFor="name" className={styles.formLabel}>Your Name *</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="email" className={styles.formLabel}>Email Address *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="subject" className={styles.formLabel}>Subject *</label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="message" className={styles.formLabel}>Your Message *</label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            className={styles.formTextarea}
                            required
                          ></textarea>
                        </div>

                        <div className={styles.formSubmit}>
                          <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Sending...' : (contactFormSection.submitButton || 'Send Message')}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>

                {/* Google Maps Embed */}
                {contactFormSection.showMap && contactFormSection.mapEmbedUrl && (
                  <div className={styles.mapWrapper}>
                    <iframe
                      src={contactFormSection.mapEmbedUrl}
                      title="Google Maps"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
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

        {/* Social Media Section */}
        {socialMediaSection?.socialLinks?.length > 0 && (
          <section className={styles.socialSection}>
            <div className="container max-w-4xl mx-auto px-6 text-center">
              {socialMediaSection.title && (
                <h2 className={styles.sectionTitle}>{socialMediaSection.title}</h2>
              )}
              {socialMediaSection.description && (
                <p className={styles.sectionDescription}>{socialMediaSection.description}</p>
              )}
              <div className={styles.socialLinksGrid}>
                {socialMediaSection.socialLinks.map((social, index) => (
                  <a
                    key={social._key || index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <span className={styles.socialIcon}>{socialIcons[social.platform] || '🔗'}</span>
                    <span className={styles.socialPlatform}>
                      {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    </span>
                    {social.handle && (
                      <span className={styles.socialHandle}>@{social.handle}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqSection?.faqs?.length > 0 && (
          <section className={styles.faqSection}>
            <div className="container max-w-4xl mx-auto px-6">
              {faqSection.title && (
                <h2 className={styles.sectionTitle}>{faqSection.title}</h2>
              )}
              {faqSection.description && (
                <p className={styles.sectionDescription}>{faqSection.description}</p>
              )}
              <div className={styles.faqList}>
                {faqSection.faqs.map((faq, index) => (
                  <div key={faq._key || index} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.question}</h3>
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                    {faq.category && (
                      <span className={styles.faqCategory}>{faq.category}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
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
