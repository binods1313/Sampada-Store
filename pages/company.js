// pages/company.js - Sampada Company Page
import { useState, useEffect, useRef } from 'react'
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

  // SCROLL REVEAL
  useEffect(() => {
    const els = document.querySelectorAll('[data-clay-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.clayDelay || 0;
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, Number(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // STATS COUNTER
  const statsSectionRef = useRef(null);
  const hasAnimated = useRef(false);
  useEffect(() => {
    const statEls = document.querySelectorAll('[data-target]');
    if (!statEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          statEls.forEach(el => {
            const originalText = el.dataset.target;
            const targetNum = parseInt(originalText.replace(/[^0-9]/g, ''), 10);
            const suffix = originalText.replace(/[0-9]/g, '');
            
            if (isNaN(targetNum)) return;
            
            let start = 0;
            const duration = 1200;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeOut * targetNum);
              el.innerText = current + suffix;
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                el.innerText = originalText;
              }
            };
            requestAnimationFrame(animate);
          });
        }
      });
    }, { threshold: 0.1 });

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

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
        
        {/* Add hover styling rules without breaking React constraints */}
        <style>{`
          @media (hover: hover) {
            .clay-value-card:hover {
              transform: translateY(-4px) !important;
              border-color: rgba(201,168,76,0.4) !important;
              box-shadow: 6px 6px 18px rgba(0,0,0,0.45), -2px -2px 10px rgba(255,255,255,0.06) !important;
            }
            .clay-journey-img:hover {
              transform: scale(1.015) !important;
            }
            .clay-stat-card:hover {
              background: rgba(255,255,255,0.13) !important;
              transform: translateY(-3px) !important;
            }
            .clay-partner-card:hover {
              transform: translateY(-3px) !important;
              border-color: rgba(201,168,76,0.3) !important;
              box-shadow: 9px 9px 22px rgba(0,0,0,0.11), -9px -9px 22px rgba(255,255,255,0.88) !important;
            }
            .clay-cta:hover {
              transform: translateY(-2px) scale(1.02) !important;
              box-shadow: 6px 6px 18px rgba(0,0,0,0.3), -2px -2px 10px rgba(255,255,255,0.2) !important;
            }
            .clay-medallion:hover {
              transform: scale(1.03) rotate(1deg) !important;
            }
          }
        `}</style>
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

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  background: mounted && isMobile 
                    ? 'linear-gradient(to top, rgba(13, 4, 8, 0.92) 0%, rgba(13, 4, 8, 0.70) 35%, rgba(13, 4, 8, 0.20) 60%, rgba(13, 4, 8, 0.0) 100%)'
                    : 'linear-gradient(135deg, rgba(13, 4, 8, 0.0) 0%, rgba(13, 4, 8, 0.0) 35%, rgba(13, 4, 8, 0.4) 55%, rgba(13, 4, 8, 0.75) 70%, rgba(13, 4, 8, 0.88) 85%, rgba(13, 4, 8, 0.92) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Optional Medallion Logo if the user wanted it in the center. We'll wrap a hypothetical logo area. */}
                <div className="clay-medallion" style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2,
                  filter: 'drop-shadow(0 8px 24px rgba(201,168,76,0.45)) drop-shadow(0 2px 8px rgba(139,26,26,0.3))',
                  transition: 'transform 0.3s ease'
                }}></div>

                <div style={{
                  position: 'absolute',
                  top: mounted && isMobile ? 'auto' : '3%',
                  left: mounted && isMobile ? 0 : '3%',
                  right: mounted && isMobile ? 0 : 'auto',
                  bottom: mounted && isMobile ? 0 : 'auto',
                  zIndex: 2,
                  maxWidth: mounted && isMobile ? '100%' : '35%',
                  textAlign: 'left',
                  padding: mounted && isMobile ? '20px 16px' : '32px',
                  background: 'rgba(253,246,236,0.12)',
                  backdropFilter: 'blur(2px)',
                  borderRadius: '16px',
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
                      marginTop: '32px',
                      background: 'rgba(201,168,76,0.15)',
                      border: '1px solid rgba(201,168,76,0.35)',
                      borderRadius: '40px',
                      padding: '6px 14px',
                      width: 'fit-content'
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

                {mounted && !isMobile && (
                  <>
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
              <div 
                style={{ 
                  background: '#FDF6EC', 
                  borderRadius: '20px', 
                  padding: '28px 36px', 
                  boxShadow: '6px 6px 16px rgba(0,0,0,0.07), -6px -6px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                  marginBottom: '24px',
                  opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.42s ease, transform 0.42s ease' 
                }} 
                data-clay-reveal="true" 
                data-clay-delay="0"
              >
                <p className="s-label">{missionTitle || 'OUR MISSION'}</p>
                <h2 className="s-heading" style={{ fontSize: '1.8rem', margin: '0' }}>
                  {missionDescription}
                </h2>
              </div>
              
              {visionDescription && (
                <>
                  <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C 30%, #C9A84C 70%, transparent)', opacity: 0.45, margin: '24px auto', maxWidth: '200px' }} />
                  <div 
                    style={{ 
                      background: '#FDF6EC', 
                      borderRadius: '20px', 
                      padding: '28px 36px', 
                      boxShadow: '6px 6px 16px rgba(0,0,0,0.07), -6px -6px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                      opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.42s ease, transform 0.42s ease'
                    }} 
                    data-clay-reveal="true" 
                    data-clay-delay="100"
                  >
                    <p className="s-label">{visionTitle || 'OUR VISION'}</p>
                    <p style={{ color: 'var(--s-text-body)', fontSize: '1.1rem', lineHeight: '1.8', margin: '0' }}>
                      {visionDescription}
                    </p>
                  </div>
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
                  <div key={index} className="s-card-dark clay-value-card" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    padding: 0,
                    height: '100%',
                    textAlign: 'left',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.35), -2px -2px 8px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease'
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
                        <div style={{ position: 'relative', width: '80%', height: '80%' }}>
                          <Image
                            src={urlFor(value.icon).url()}
                            alt={`${value.title} icon`}
                            fill
                            style={{
                              objectFit: 'contain',
                              borderRadius: '12px',
                              boxShadow: '3px 3px 10px rgba(0,0,0,0.4)'
                            }}
                            sizes="120px"
                          />
                        </div>
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
                      <h3 className="s-card-title" style={{ 
                        margin: 0, 
                        fontSize: '1.45rem',
                        background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>{value.title}</h3>
                      <p className="s-card-body" style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.85, color: 'var(--s-cream)' }}>{value.description}</p>
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
                <div 
                  data-clay-reveal="true" 
                  data-clay-delay="0"
                  style={{ 
                    color: 'var(--s-text-body)', 
                    fontSize: '1rem', 
                    lineHeight: '1.8',
                    background: '#FDF6EC',
                    borderRadius: '20px',
                    padding: '32px',
                    boxShadow: '6px 6px 16px rgba(0,0,0,0.07), -6px -6px 16px rgba(255,255,255,0.8)',
                    opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.42s ease, transform 0.42s ease'
                  }}>
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
                  <div 
                    className="clay-journey-img"
                    data-clay-reveal="true" 
                    data-clay-delay="120"
                    style={{ 
                      borderRadius: '24px', 
                      overflow: 'hidden', 
                      boxShadow: '10px 10px 28px rgba(0,0,0,0.14), -6px -6px 18px rgba(255,255,255,0.75), inset 0 1px 0 rgba(255,255,255,0.4)',
                      opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.42s ease, transform 0.42s ease'
                    }}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                      <Image
                        src={storyImageUrl}
                        alt={storyImage?.alt || 'Sampada company story and heritage'}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 5: CRIMSON Stats */}
        {stats && stats.length > 0 && (
          <section className="section-crimson s-section" ref={statsSectionRef}>
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 className="s-heading" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
                  {statsTitle || 'Sampada by the Numbers'}
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', textAlign: 'center' }}>
                {stats.map((stat, index) => (
                  <div key={index} className="clay-stat-card" style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '20px 16px',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transition: 'transform 0.2s ease, background 0.2s ease'
                  }}>
                    <p 
                      data-target={stat.value}
                      style={{ fontFamily: 'var(--s-serif)', fontSize: '3rem', fontWeight: '900', color: 'var(--s-cream)', margin: '0 0 8px', lineHeight: '1' }}>
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
                  <div 
                    key={index} 
                    className="clay-partner-card"
                    data-clay-reveal="true" 
                    data-clay-delay={index * 80}
                    style={{ 
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '8px 20px',
                      background: '#FDF6EC',
                      borderRadius: '20px',
                      border: '1px solid rgba(201,168,76,0.12)',
                      boxShadow: '6px 6px 16px rgba(0,0,0,0.08), -6px -6px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.55)',
                      transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                      textAlign: 'left',
                      opacity: 0, transform: 'translateY(16px)'
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
                        <div style={{ position: 'relative', width: '80%', height: '80%' }}>
                          <Image
                            src={urlFor(partner.logo).url()}
                            alt={`${partner.name} logo - Sampada partner`}
                            fill
                            style={{
                              objectFit: 'contain',
                              borderRadius: '50%',
                              boxShadow: '3px 3px 10px rgba(0,0,0,0.12), -2px -2px 8px rgba(255,255,255,0.7)'
                            }}
                            sizes="80px"
                          />
                        </div>
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
            <h2 className="s-heading" style={{ textShadow: '0 2px 16px rgba(201,168,76,0.25)' }}>Connect With Us</h2>
            <p style={{ color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7', margin: '16px 0 32px' }}>
              Have questions about our company, partnerships, or career opportunities? We&apos;d love to hear from you.
            </p>
              <Link href="/contact" className="btn-cta-primary clay-cta" aria-label="Contact Sampada company" style={{ 
                display: 'inline-block',
                borderRadius: '40px',
                boxShadow: '4px 4px 14px rgba(0,0,0,0.25), -2px -2px 8px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
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
