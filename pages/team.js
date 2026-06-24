// pages/team.js - Sampada Team Page
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { client, urlFor } from '@/lib/client'
import Image from 'next/image'
import { useInView } from '@/hooks/useInView'

export default function TeamPage({ teamData }) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkBreakpoints = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsTablet(width > 768 && width <= 1024)
      setIsDesktop(width > 1024)
    }

    checkBreakpoints()
    window.addEventListener('resize', checkBreakpoints)
    return () => window.removeEventListener('resize', checkBreakpoints)
  }, [])

  // Animation refs
  const [heroRef, heroVisible] = useInView({ triggerOnce: true })
  const [introRef, introVisible] = useInView({ triggerOnce: true })
  const [leadershipRef, leadershipVisible] = useInView({ triggerOnce: true })
  const [departmentsRef, departmentsVisible] = useInView({ triggerOnce: true })
  const [cultureRef, cultureVisible] = useInView({ triggerOnce: true })
  const [benefitsRef, benefitsVisible] = useInView({ triggerOnce: true })

  if (!teamData) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--s-serif)', fontSize: '2rem', color: 'var(--s-text-heading)', marginBottom: '16px' }}>Team Page Not Configured</h1>
        <p style={{ color: 'var(--s-text-body)', marginBottom: '24px' }}>Please configure the team page in Sanity Studio.</p>
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
    teamIntroductionTitle,
    teamIntroduction,
    leadershipTitle,
    leadership,
    departmentsTitle,
    departments,
    cultureTitle,
    cultureDescription,
    cultureGallery,
    benefitsTitle,
    benefits,
    careersCTATitle,
    careersCTADescription,
    careersCTAButton,
    careersCTALink,
    seo
  } = teamData

  const heroImageUrl = heroImage ? urlFor(heroImage).width(1920).height(1080).url() : null

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || `${title || 'Team'} - Sampada`}</title>
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
          height: mounted && isMobile ? '700px' : '1350px',
          minHeight: mounted && isMobile ? '700px' : '1350px',
          overflow: 'hidden',
          padding: 0,
          margin: 0
        }}>
          {heroImage && (
            <>
              {/* Full-width hero image */}
              <Image 
                src={urlFor(heroImage).auto('format').url()} 
                alt={heroImage.alt || 'Sampada Team'} 
                fill
                priority
                quality={95}
                sizes="100vw"
                style={{ 
                  objectFit: 'cover', 
                  objectPosition: mounted && isMobile ? 'center top' : 'center center'
                }}
              />

              {/* Gradient overlay for text readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                background: mounted && isMobile 
                  ? 'linear-gradient(to top, rgba(13, 4, 8, 0.92) 0%, rgba(13, 4, 8, 0.70) 35%, rgba(13, 4, 8, 0.20) 60%, rgba(13, 4, 8, 0.0) 100%)'
                  : 'linear-gradient(to top, rgba(13, 4, 8, 0.88) 0%, rgba(13, 4, 8, 0.65) 30%, rgba(13, 4, 8, 0.35) 55%, rgba(13, 4, 8, 0.0) 85%)',
                pointerEvents: 'none'
              }} />

              {/* Text overlay - Centered bottom */}
              <div style={{
                position: 'absolute',
                bottom: mounted && isMobile ? '10%' : '8%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                maxWidth: mounted && isMobile ? '90%' : '800px',
                textAlign: 'center',
                padding: mounted && isMobile ? '0 16px' : '0',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
              }} ref={heroRef}>
                <p className="s-label" style={{ 
                  color: 'var(--s-gold)', 
                  letterSpacing: '2.5px', 
                  marginBottom: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                }}>
                  OUR TEAM
                </p>
                
                <h1 className="s-heading" style={{ 
                  fontSize: 'clamp(1.8rem, 5vw, 3rem)', 
                  marginBottom: '20px',
                  color: 'var(--s-cream)',
                  lineHeight: '1.1',
                  textShadow: '0 2px 12px rgba(0,0,0,0.7)'
                }}>
                  {heroTitle || 'Meet the Keepers of Legacy'}
                </h1>
                
                {heroDescription && (
                  <p style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', 
                    lineHeight: '1.7', 
                    margin: 0,
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    maxWidth: '700px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}>
                    {heroDescription}
                  </p>
                )}
              </div>

              {/* Decorative Quote - "Wear Your Legacy" - Desktop only, top right */}
              {mounted && !isMobile && (
                <div style={{ 
                  position: 'absolute', 
                  top: '5%', 
                  right: '3%', 
                  zIndex: 2,
                  textAlign: 'right'
                }}>
                  <p style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: '700',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                    color: '#C9A96E',
                    opacity: '0.5',
                    margin: 0,
                    letterSpacing: '0.5px',
                    textShadow: '0 2px 8px rgba(201, 169, 110, 0.4)'
                  }}>
                    "Wear Your Legacy"
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Section 2: LIGHT Team Introduction */}
        {teamIntroduction && (
          <section className="section-light s-section">
            <div className="s-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
              <div style={{
                opacity: introVisible ? 1 : 0,
                transform: introVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
              }} ref={introRef}>
                <p className="s-label">{teamIntroductionTitle || 'OUR STORY'}</p>
                <h2 className="s-heading" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>
                  {teamIntroductionTitle || 'Our People, Our Promise'}
                </h2>
                <span className="s-bar" />
                <p style={{ 
                  color: 'var(--s-text-body)', 
                  fontSize: '1.05rem', 
                  lineHeight: '1.8', 
                  marginTop: '32px',
                  whiteSpace: 'pre-line'
                }}>
                  {teamIntroduction}
                </p>
                
                {/* Decorative intro quote */}
                {mounted && !isMobile && (
                  <p style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    fontSize: '1.1rem',
                    color: '#8B1A1A',
                    opacity: '0.6',
                    marginTop: '40px',
                    letterSpacing: '0.3px'
                  }}>
                    "Crafted with care, worn with pride"
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 3: DARK Leadership Team */}
        {leadership && leadership.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">LEADERSHIP</p>
                <h2 className="s-heading">{leadershipTitle || 'Leadership Team'}</h2>
                <span className="s-bar" />
                
                {/* Decorative leadership quote */}
                {mounted && !isMobile && (
                  <p style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: '#C9A96E',
                    opacity: '0.5',
                    marginTop: '16px',
                    letterSpacing: '0.3px'
                  }}>
                    "People who honor craft"
                  </p>
                )}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gap: '48px', 
                gridTemplateColumns: mounted && isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                maxWidth: '1200px',
                margin: '0 auto'
              }} ref={leadershipRef}>
                {leadership.map((member, index) => (
                  <div key={index} style={{
                    opacity: leadershipVisible ? 1 : 0,
                    transform: leadershipVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`
                  }}>
                    <div className="s-card-dark" style={{ 
                      padding: 0, 
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Profile Image - Portrait aspect ratio container (3:4) */}
                      {member.image && (
                        <div style={{ 
                          position: 'relative', 
                          width: '100%', 
                          aspectRatio: '3 / 4',
                          overflow: 'hidden',
                          backgroundColor: 'rgba(0,0,0,0.1)'
                        }}>
                          <Image
                            src={urlFor(member.image)
                              .width(600)
                              .height(800)
                              .fit('crop')
                              .crop('focalpoint')
                              .url()}
                            alt={member.image.alt || `${member.name} - ${member.position}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ 
                              objectFit: 'cover',
                              objectPosition: 'center top'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Member Info */}
                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 className="s-card-title" style={{ 
                          color: 'var(--s-cream)', 
                          fontSize: '1.5rem', 
                          marginBottom: '8px',
                          fontFamily: 'var(--s-serif)'
                        }}>
                          {member.name}
                        </h3>
                        
                        <p style={{ 
                          color: 'var(--s-gold)', 
                          fontSize: '0.9rem', 
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          marginBottom: '16px',
                          textTransform: 'uppercase'
                        }}>
                          {member.position}
                        </p>
                        
                        {member.bio && (
                          <p className="s-card-body" style={{ 
                            fontSize: '0.95rem', 
                            lineHeight: '1.7',
                            flex: 1,
                            marginBottom: '20px'
                          }}>
                            {member.bio}
                          </p>
                        )}
                        
                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                          {member.profileLink && (
                            <Link 
                              href={member.profileLink}
                              style={{ 
                                color: 'var(--s-gold)', 
                                fontSize: '0.85rem',
                                textDecoration: 'underline',
                                transition: 'opacity 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                              onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                              View Profile →
                            </Link>
                          )}
                          {member.linkedin && (
                            <a 
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--s-gold)', fontSize: '1.2rem' }}
                              aria-label={`${member.name} LinkedIn profile`}
                            >
                              in
                            </a>
                          )}
                          {member.twitter && (
                            <a 
                              href={member.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--s-gold)', fontSize: '1.2rem' }}
                              aria-label={`${member.name} Twitter profile`}
                            >
                              𝕏
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: LIGHT Departments */}
        {departments && departments.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">TEAMS</p>
                <h2 className="s-heading">{departmentsTitle || 'Departments'}</h2>
                <span className="s-bar" />
                
                {/* Decorative departments quote */}
                {mounted && !isMobile && (
                  <p style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: '#8B1A1A',
                    opacity: '0.6',
                    marginTop: '16px',
                    letterSpacing: '0.3px'
                  }}>
                    "Every team, one purpose"
                  </p>
                )}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gap: '32px', 
                gridTemplateColumns: mounted && isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                maxWidth: '1100px',
                margin: '0 auto'
              }} ref={departmentsRef}>
                {departments.map((dept, index) => (
                  <div key={index} className="s-card" style={{
                    opacity: departmentsVisible ? 1 : 0,
                    transform: departmentsVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease-out ${index * 0.08}s, transform 0.6s ease-out ${index * 0.08}s`
                  }}>
                    <h3 className="s-card-title" style={{ 
                      fontSize: '1.4rem', 
                      marginBottom: '12px',
                      fontFamily: 'var(--s-serif)',
                      color: 'var(--s-text-heading)'
                    }}>
                      {dept.name}
                    </h3>
                    <p className="s-card-body" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                      {dept.description}
                    </p>
                    
                    {/* Department members if available */}
                    {dept.members && dept.members.length > 0 && (
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(139,26,26,0.1)' }}>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          letterSpacing: '1px', 
                          textTransform: 'uppercase',
                          color: 'var(--s-text-muted)',
                          marginBottom: '12px'
                        }}>
                          Team Members
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {dept.members.slice(0, 3).map((member, mIdx) => (
                            <div key={mIdx} style={{ fontSize: '0.9rem', color: 'var(--s-text-body)' }}>
                              <strong>{member.name}</strong>
                              {member.role && <span style={{ color: 'var(--s-text-muted)' }}> · {member.role}</span>}
                            </div>
                          ))}
                          {dept.members.length > 3 && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--s-text-muted)', fontStyle: 'italic' }}>
                              +{dept.members.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 5: DARK Culture */}
        {cultureDescription && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">WORKPLACE</p>
                <h2 className="s-heading">{cultureTitle || 'Culture at Sampada'}</h2>
                <span className="s-bar" />
                
                {/* Decorative culture quote */}
                {mounted && !isMobile && (
                  <p style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: '#C9A96E',
                    opacity: '0.5',
                    marginTop: '16px',
                    letterSpacing: '0.3px'
                  }}>
                    "Rooted in craft, open to curiosity"
                  </p>
                )}
              </div>
              
              <div style={{ maxWidth: '800px', margin: '0 auto 48px', textAlign: 'center' }}>
                <p style={{ 
                  color: 'rgba(250,246,240,0.85)', 
                  fontSize: '1.05rem', 
                  lineHeight: '1.8',
                  whiteSpace: 'pre-line'
                }}>
                  {cultureDescription}
                </p>
              </div>
              
              {/* Culture Gallery */}
              {cultureGallery && cultureGallery.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gap: '24px', 
                  gridTemplateColumns: mounted && isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                  marginTop: '48px'
                }} ref={cultureRef}>
                  {cultureGallery.map((item, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      aspectRatio: '4/3',
                      opacity: cultureVisible ? 1 : 0,
                      transform: cultureVisible ? 'scale(1)' : 'scale(0.95)',
                      transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`
                    }}>
                      {item.image && (
                        <>
                          <Image
                            src={urlFor(item.image).width(600).height(450).url()}
                            alt={item.image.alt || item.caption || 'Sampada team culture'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                          />
                          {item.caption && (
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              padding: '16px',
                              background: 'linear-gradient(to top, rgba(13, 4, 8, 0.9), transparent)',
                              color: 'var(--s-cream)',
                              fontSize: '0.9rem',
                              textAlign: 'center'
                            }}>
                              {item.caption}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 6: LIGHT Benefits & Perks */}
        {benefits && benefits.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">PERKS</p>
                <h2 className="s-heading">{benefitsTitle || 'Benefits and Perks'}</h2>
                <span className="s-bar" />
                
                {/* Decorative benefits quote */}
                {mounted && !isMobile && (
                  <p style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: '#8B1A1A',
                    opacity: '0.6',
                    marginTop: '16px',
                    letterSpacing: '0.3px'
                  }}>
                    "We invest in people and craft"
                  </p>
                )}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gap: '24px', 
                gridTemplateColumns: mounted && isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                maxWidth: '1100px',
                margin: '0 auto'
              }} ref={benefitsRef}>
                {benefits.map((benefit, index) => (
                  <div key={index} className="s-card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '32px 24px',
                    opacity: benefitsVisible ? 1 : 0,
                    transform: benefitsVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease-out ${index * 0.08}s, transform 0.6s ease-out ${index * 0.08}s`
                  }}>
                    {benefit.icon && (
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                        {benefit.icon}
                      </div>
                    )}
                    <h3 className="s-card-title" style={{ fontSize: '1.3rem', marginBottom: '12px' }}>
                      {benefit.title}
                    </h3>
                    <p className="s-card-body" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 7: CRIMSON Careers CTA */}
        {careersCTATitle && (
          <section className="section-crimson s-section">
            <div className="s-container" style={{ textAlign: 'center', maxWidth: '700px' }}>
              <h2 className="s-heading">{careersCTATitle || 'Join the Legacy'}</h2>
              {careersCTADescription && (
                <p style={{ 
                  color: 'rgba(250,246,240,0.85)', 
                  fontSize: '1.05rem', 
                  lineHeight: '1.7', 
                  margin: '16px 0 32px' 
                }}>
                  {careersCTADescription}
                </p>
              )}
              
              {/* Decorative careers quote */}
              {mounted && !isMobile && (
                <p style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: '#C9A96E',
                  opacity: '0.6',
                  marginBottom: '32px',
                  letterSpacing: '0.3px'
                }}>
                  "Make with us"
                </p>
              )}
              
              {careersCTALink && (
                <Link 
                  href={careersCTALink} 
                  className="btn-cta-primary" 
                  aria-label="View open career opportunities at Sampada"
                  style={{ display: 'inline-block' }}
                >
                  {careersCTAButton || 'View Open Roles'} <span className="arrow">→</span>
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

// Server-side data fetching
export async function getStaticProps() {
  const query = `*[_type == "team"][0]{
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
    leadership[] {
      ...,
      image {
        asset -> {
          _id,
          url
        },
        alt
      }
    },
    departments[] {
      ...,
      members[] {
        ...,
        image {
          asset->
        }
      }
    },
    cultureGallery[] {
      ...,
      image {
        asset -> {
          _id,
          url
        },
        alt
      },
      caption
    }
  }`

  try {
    const teamData = await client.fetch(query)
    return {
      props: {
        teamData: teamData || null
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching team data:', error)
    return {
      props: {
        teamData: null
      },
      revalidate: 60
    }
  }
}
