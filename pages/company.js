// pages/company.js - Sampada Company Page
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { client, urlFor } from '@/lib/client'
import Image from 'next/image'
import { useInView } from '@/hooks/useInView'

export default function CompanyPage({ companyData }) {
   const [mounted, setMounted] = useState(false);
   const [isMobile, setIsMobile] = useState(false);
   const [isTablet, setIsTablet] = useState(false);
   const [isDesktop, setIsDesktop] = useState(false)

   useEffect(() => {
     setMounted(true);
     const checkBreakpoints = () => {
       const width = window.innerWidth;
       setIsMobile(width <= 768);
       setIsTablet(width > 768 && width <= 1024);
       setIsDesktop(width > 1024);
     };

     checkBreakpoints();
     window.addEventListener('resize', checkBreakpoints);
     return () => window.removeEventListener('resize', checkBreakpoints);
   }, [])

   // Animation refs and visibility tracking
   const [titleRef, titleVisible] = useInView({ triggerOnce: true })
   const [descriptionRef, descriptionVisible] = useInView({ triggerOnce: true })
   const [statsRef, statsVisible] = useInView({ triggerOnce: true })
   const [imageRef, imageVisible] = useInView({ triggerOnce: true })

  if (!companyData) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--s-serif)', fontSize: '2rem', color: 'var(--s-text-heading)', marginBottom: '16px' }}>Company Page Not Configured</h1>
        <p style={{ color: 'var(--s-text-body)', marginBottom: '24px' }}>Please configure the company page in Sanity Studio.</p>
        <Link href="/" className="btn-cta-primary" aria-label="Return to Sampada homepage">
          Back to Home <span className="arrow">→</span>
        </Link>
      </div>
    )
  }

   const {
     title,
     heroTitle,
     heroDescription,
     heroImage,
     companyInfo,
     missionTitle,
     missionDescription,
     visionTitle,
     visionDescription,
     valuesTitle,
     values,
     storyTitle,
     storyContent,
     storyImage,
     statsTitle,
     stats,
     partnersTitle,
     partners,
     seo
   } = companyData

  const heroImageUrl = heroImage ? urlFor(heroImage).width(1920).height(1080).url() : null
  const storyImageUrl = storyImage ? urlFor(storyImage).width(800).height(600).url() : null

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || `${title || 'About'} - Sampada`}</title>
        <meta name="description" content={seo?.metaDescription || heroDescription || ''} />
        <meta property="og:title" content={seo?.metaTitle || title} />
        <meta property="og:description" content={seo?.metaDescription || heroDescription} />
        {heroImageUrl && <meta property="og:image" content={heroImageUrl} />}
      </Head>

      <main>
          {/* Section 1: HERO Banner - Full Width Image with Text Overlay */}
          <section style={{ 
            position: 'relative',
            width: '100%',
            height: mounted && isMobile ? '700px' : '2000px',
            minHeight: mounted && isMobile ? '700px' : '2000px',
            overflow: 'hidden',
            padding: 0,
            margin: 0
          }}>
            {heroImage && (
              <>
                {/* Full-width hero image fills entire container */}
                <Image 
                  src={urlFor(heroImage).auto('format').url()} 
                  alt={heroImage.alt || 'Sampada Company Hero'} 
                  fill
                  priority
                  quality={95}
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: mounted && isMobile ? 'center top' : 'center center'
                  }}
                />

                {/* Gradient overlay — darkens top-right for text readability, keeps center-left (models) visible */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  background: mounted && isMobile 
                    ? 'linear-gradient(to top, rgba(13, 4, 8, 0.92) 0%, rgba(13, 4, 8, 0.70) 35%, rgba(13, 4, 8, 0.20) 60%, rgba(13, 4, 8, 0.0) 100%)'
                    : 'linear-gradient(135deg, rgba(13, 4, 8, 0.0) 0%, rgba(13, 4, 8, 0.0) 35%, rgba(13, 4, 8, 0.4) 55%, rgba(13, 4, 8, 0.75) 70%, rgba(13, 4, 8, 0.88) 85%, rgba(13, 4, 8, 0.92) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Text overlay — TOP LEFT on desktop, BOTTOM on mobile */}
                <div style={{
                  position: 'absolute',
                  top: mounted && isMobile ? 'auto' : '3%',
                  left: mounted && isMobile ? 0 : '3%',
                  right: mounted && isMobile ? 0 : 'auto',
                  bottom: mounted && isMobile ? 0 : 'auto',
                  zIndex: 2,
                  maxWidth: mounted && isMobile ? '100%' : '35%',
                  textAlign: 'left',
                  padding: mounted && isMobile ? '20px 16px' : '0',
                  opacity: titleVisible ? 1 : 0,
                  transform: titleVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
                }} ref={titleRef}>
                  <p className="s-label" style={{ 
                    color: 'var(--s-gold)', 
                    letterSpacing: '2.5px', 
                    marginBottom: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                  }}>
                    {companyInfo?.industry || 'FASHION & LIFESTYLE, CUSTOM APPAREL'}
                  </p>
                  
                  <h1 className="s-heading" style={{ 
                    fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', 
                    marginBottom: '20px',
                    color: 'var(--s-cream)',
                    lineHeight: '1.1',
                    textShadow: '0 2px 12px rgba(0,0,0,0.7)'
                  }}>
                    {heroTitle || 'Prosper in Style'}
                  </h1>
                  
                  {companyInfo && (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: mounted && isMobile ? 'column' : 'row', 
                      gap: mounted && isMobile ? '16px' : '40px', 
                      justifyContent: 'flex-start',
                      marginTop: '32px'
                    }}>
                      {companyInfo.foundedYear && (
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ 
                            color: 'var(--s-gold)', 
                            fontSize: '2.2rem', 
                            fontFamily: 'var(--s-serif)', 
                            fontWeight: '700', 
                            margin: '0 0 2px', 
                            lineHeight: 1,
                            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                          }}>
                            {companyInfo.foundedYear}
                          </p>
                          <p style={{ 
                            color: 'rgba(255,255,255,0.5)', 
                            fontSize: '0.7rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1.5px', 
                            fontWeight: 600,
                            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                          }}>
                            Founded
                          </p>
                        </div>
                      )}
                      {companyInfo.headquarters && (
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ 
                            color: 'var(--s-gold)', 
                            fontSize: '1.2rem', 
                            fontFamily: 'var(--s-serif)', 
                            fontWeight: '600', 
                            margin: '0 0 4px', 
                            lineHeight: 1.2,
                            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                          }}>
                            {companyInfo.headquarters}
                          </p>
                          <p style={{ 
                            color: 'rgba(255,255,255,0.5)', 
                            fontSize: '0.7rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1.5px', 
                            fontWeight: 600,
                            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                          }}>
                            Headquarters
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Description text — TOP RIGHT on desktop */}
                {!isMobile && (
                  <div style={{
                    position: 'absolute',
                    top: '3%',
                    right: '1.5%',
                    zIndex: 2,
                    maxWidth: '32%',
                    textAlign: 'left',
                    opacity: descriptionVisible ? 1 : 0,
                    transform: descriptionVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s'
                  }} ref={descriptionRef}>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)', 
                      lineHeight: '1.8', 
                      margin: 0,
                      fontFamily: 'Georgia, "Palatino Linotype", "Book Antiqua", serif',
                      fontWeight: '600',
                      fontStyle: 'italic',
                      textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      letterSpacing: '0.3px'
                    }}>
                      {heroDescription || 'Premium custom apparel blending heritage, craftsmanship, and modern identity.'}
                    </p>
                  </div>
                )}

                {/* Decorative Quote — Desktop only, positioned bottom-left */}
                {mounted && !isMobile && (
                  <>
                    {/* Closing quote — bottom left corner */}
                    <span style={{ 
                      position: 'absolute', 
                      bottom: '3%', 
                      left: '1.5%', 
                      opacity: '0.35', 
                      fontSize: 'clamp(3rem, 6vw, 7rem)', 
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontWeight: '700',
                      fontStyle: 'italic',
                      color: '#C9A96E',
                      zIndex: 2,
                      pointerEvents: 'none',
                      lineHeight: 1,
                      textShadow: '0 4px 12px rgba(201, 169, 110, 0.3)'
                    }}>"</span>
                  </>
                )}
              </>
            )}
          </section>

        {/* Section 2: LIGHT Mission Statement */}
        {missionDescription && (
          <section className="section-light s-section">
            <div className="s-container" style={{ maxWidth: '800px', textAlign: 'center' }}>
              <p className="s-label">{missionTitle || 'OUR MISSION'}</p>
              <h2 className="s-heading" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>
                {missionDescription}
              </h2>
              <span className="s-bar" />
              {visionDescription && (
                <>
                  <p className="s-label" style={{ marginTop: '48px' }}>{visionTitle || 'OUR VISION'}</p>
                  <p style={{ color: 'var(--s-text-body)', fontSize: '1.1rem', lineHeight: '1.8', marginTop: '16px' }}>
                    {visionDescription}
                  </p>
                </>
              )}
            </div>
          </section>
        )}

        {/* Section 3: DARK Values - Horizontal Layout */}
        {values && values.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">{valuesTitle || 'WHAT WE STAND FOR'}</p>
                <h2 className="s-heading">Core Values</h2>
                <span className="s-bar" />
              </div>
              <div style={{ 
                display: 'grid', 
                gap: '24px', 
                gridTemplateColumns: mounted && isMobile ? '1fr' : 'repeat(2, 1fr)',
                maxWidth: mounted && isMobile ? '100%' : '1020px',
                margin: '0 auto'
              }}>
                {values.map((value, index) => (
                  <div key={index} className="s-card-dark" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    padding: 0,
                    height: '100%',
                    textAlign: 'left',
                    overflow: 'hidden',
                    border: '1px solid rgba(201, 169, 110, 0.25)'
                  }}>
                    <div style={{ 
                      flexShrink: 0,
                      width: 'clamp(100px, 25vw, 140px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderRight: '1px solid rgba(201, 169, 110, 0.15)'
                    }}>
                      {value.icon ? (
                        <img 
                          src={urlFor(value.icon).url()}
                          alt={`${value.title} icon`} 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }} 
                        />
                      ) : (
                        <div style={{ fontSize: '4rem' }}>✧</div>
                      )}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px',
                      padding: '8px 26px',
                      justifyContent: 'center'
                    }}>
                      <h3 className="s-card-title" style={{ margin: 0, fontSize: '1.45rem', color: 'var(--s-cream)' }}>{value.title}</h3>
                      <p className="s-card-body" style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.85 }}>{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: LIGHT Story */}
        {storyContent && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">OUR JOURNEY</p>
                <h2 className="s-heading">{storyTitle || 'The Sampada Story'}</h2>
                <span className="s-bar" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: storyImageUrl ? '1fr 1fr' : '1fr', gap: '48px', alignItems: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ color: 'var(--s-text-body)', fontSize: '1rem', lineHeight: '1.8' }}>
                  {Array.isArray(storyContent) ? (
                    storyContent.map((block, index) => {
                      if (block._type === 'block') {
                        return <p key={index} style={{ marginBottom: '16px' }}>{block.children?.map(child => child.text).join('')}</p>
                      }
                      return null
                    })
                  ) : (
                    <p>{storyContent}</p>
                  )}
                </div>
                {storyImageUrl && (
                  <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(139,26,26,0.15)' }}>
                    <img 
                      src={storyImageUrl} 
                      alt={storyImage?.alt || 'Sampada company story and heritage'} 
                      style={{ width: '100%', height: 'auto', display: 'block' }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 5: CRIMSON Stats */}
        {stats && stats.length > 0 && (
          <section className="section-crimson s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 className="s-heading">{statsTitle || 'Sampada by the Numbers'}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', textAlign: 'center' }}>
                {stats.map((stat, index) => (
                  <div key={index}>
                    <p style={{ fontFamily: 'var(--s-serif)', fontSize: '3rem', fontWeight: '900', color: 'var(--s-cream)', margin: '0 0 8px', lineHeight: '1' }}>
                      {stat.value}
                    </p>
                    <p style={{ color: 'var(--s-gold)', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 8px' }}>
                      {stat.label}
                    </p>
                    {stat.description && (
                      <p style={{ color: 'rgba(250,246,240,0.7)', fontSize: '0.85rem' }}>
                        {stat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

         {/* Section 6: LIGHT Partners - Horizontal Layout */}
        {partners && partners.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">PARTNERSHIPS</p>
                <h2 className="s-heading">{partnersTitle || 'Trusted By Partners & Clients'}</h2>
                <span className="s-bar" />
              </div>
              <div style={{ 
                display: 'grid', 
                gap: '40px', 
                gridTemplateColumns: mounted && isMobile ? '1fr' : 'repeat(2, 1fr)', 
                alignItems: 'stretch' 
              }}>
                {partners.map((partner, index) => (
                  <div key={index} style={{ 
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '8px 20px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 26, 26, 0.05)',
                    textAlign: 'left'
                  }}>
                    <div style={{ 
                      width: 'clamp(75px, 18.75vw, 125px)',
                      height: 'clamp(63px, 15vw, 100px)',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {partner.logo ? (
                        <img 
                          src={urlFor(partner.logo).url()}
                          alt={`${partner.name} logo - Sampada partner`} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain' 
                          }} 
                        />
                      ) : (
                        <div style={{ fontSize: '1.9rem', color: 'var(--s-gold)' }}>🤝</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h3 style={{ 
                        fontFamily: 'var(--s-serif)', 
                        fontSize: '1.45rem', 
                        color: 'var(--s-text-heading)', 
                        fontWeight: '700', 
                        margin: 0 
                      }}>
                        {partner.name}
                      </h3>
                      {partner.description && (
                        <p style={{ 
                          color: 'var(--s-text-muted)', 
                          fontSize: '1.05rem', 
                          margin: 0, 
                          lineHeight: '1.5',
                          wordBreak: 'break-word' 
                        }}>
                          {partner.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 7: CRIMSON Connect CTA */}
        <section className="section-crimson s-section">
          <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 className="s-heading">Connect With Us</h2>
            <p style={{ color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7', margin: '16px 0 32px' }}>
              Have questions about our company, partnerships, or career opportunities? We&apos;d love to hear from you.
            </p>
              <Link href="/contact" className="btn-cta-primary" aria-label="Contact Sampada company" style={{ display: 'inline-block' }}>
                Get in Touch <span className="arrow">→</span>
              </Link>
          </div>
        </section>
      </main>
    </>
  )
}

// Server-side data fetching
export async function getStaticProps() {
  const query = `*[_type == "company"][0]{
    ...,
    heroImage {
      asset -> {
        _id,
        url,
        metadata {
          blurhash,
          dimensions
        }
      },
      alt
    },
    storyImage {
      ...,
      asset->
    },
    values[] {
      ...,
      icon {
        asset->
      }
    },
    partners[] {
      ...,
      logo {
        asset->
      }
    }
  }`

  try {
    const companyData = await client.fetch(query)
    return {
      props: {
        companyData: companyData || null
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching company data:', error)
    return {
      props: {
        companyData: null
      },
      revalidate: 60
    }
  }
}
