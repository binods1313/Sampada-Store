// pages/team.js - Sampada Premium Brand Styling
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '../lib/sanity'
import { urlFor } from '../lib/client'

export default function Team({ teamData }) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // SCROLL REVEAL (PART E)
  useEffect(() => {
    const els = document.querySelectorAll('[data-clay-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.clayDelay || 0;
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0) scale(1)';
            }, Number(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  // Handle hydration and window resize
  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!teamData) {
    return (
      <div className="section-light" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 className="s-heading">Content currently unavailable.</h2>
        <p>Please check back later.</p>
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
    careersCTALink
  } = teamData

  return (
    <>
      <Head>
        <title>{title || 'Our Team'} | Sampada</title>
        <meta name="description" content={heroDescription || 'Meet the team behind Sampada.'} />
        <style>{`
          @media (hover: hover) {
            .clay-value-card:hover {
              transform: translateY(-4px) !important;
              border-color: rgba(201,168,76,0.4) !important;
              box-shadow: 6px 6px 18px rgba(0,0,0,0.45), -2px -2px 10px rgba(255,255,255,0.06) !important;
            }
            .clay-light-card:hover {
              transform: translateY(-3px) !important;
              border-color: rgba(201,168,76,0.30) !important;
              box-shadow: 8px 8px 20px rgba(0,0,0,0.1), -8px -8px 20px rgba(255,255,255,0.9) !important;
            }
            .clay-cta:hover {
              transform: translateY(-2px) scale(1.02) !important;
            }
            .clay-about-img:hover {
              transform: scale(1.015) !important;
            }
          }
        `}</style>
      </Head>

      <main>
        {/* Section 1: Hero - Full Width Image with Overlay */}
        <section style={{ 
          position: 'relative', 
          width: '100%', 
          height: mounted && isMobile ? '600px' : '85vh',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {heroImage && (
            <>
              <Image
                src={urlFor(heroImage)
                  .width(1920)
                  .height(1080)
                  .fit('crop')
                  .auto('format')
                  .url()}
                alt={heroImage.alt || 'Sampada Team'}
                fill
                priority
                sizes="100vw"
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center 30%'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(13, 4, 8, 0.4) 0%, rgba(13, 4, 8, 0.7) 100%)',
                zIndex: 1
              }} />
            </>
          )}

          {/* Hero Content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '40px 20px',
            maxWidth: '900px',
            backdropFilter: 'blur(2px)',
            background: 'rgba(253,246,236,0.10)',
            borderRadius: '16px',
            width: mounted && isMobile ? '90%' : 'auto'
          }}>
            <p className="s-label" style={{ 
              color: 'var(--s-gold)', 
              letterSpacing: '3px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              marginBottom: '16px'
            }}>
              BEHIND THE BRAND
            </p>
            <h1 className="s-heading" style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
              marginBottom: '24px',
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

          {/* Decorative Quote */}
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
        </section>

        {/* Section 2: LIGHT Team Introduction */}
        {teamIntroduction && (
          <section className="section-light s-section">
            <div className="s-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
              <div 
                data-clay-reveal="true"
                data-clay-delay="0"
                style={{
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                background: '#FDF6EC',
                borderRadius: '20px',
                boxShadow: '6px 6px 16px rgba(0,0,0,0.07), -6px -6px 16px rgba(255,255,255,0.80), inset 0 1px 0 rgba(255,255,255,0.5)',
                padding: '40px 30px'
              }}>
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
              }}>
                {leadership.map((member, index) => (
                  <div key={index} 
                    className="clay-value-card"
                    data-clay-reveal="true"
                    data-clay-delay={index * 100}
                    style={{
                    opacity: 0,
                    transform: 'translateY(30px)',
                    transition: `opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.22s ease, border-color 0.22s ease`,
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.35), -2px -2px 8px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
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
              }}>
                {departments.map((dept, index) => (
                  <div key={index} 
                    className="clay-light-card"
                    data-clay-reveal="true"
                    data-clay-delay={index * 80}
                    style={{
                    opacity: 0,
                    transform: 'translateY(30px)',
                    transition: `opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.22s ease, border-color 0.22s ease`,
                    background: '#FDF6EC', 
                    borderRadius: '20px', 
                    boxShadow: '6px 6px 16px rgba(0,0,0,0.08), -6px -6px 16px rgba(255,255,255,0.80)', 
                    border: '1px solid rgba(201,168,76,0.10)',
                    padding: '32px 24px'
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
                }}>
                  {cultureGallery.map((item, index) => (
                    <div key={index} 
                      className="clay-about-img"
                      data-clay-reveal="true"
                      data-clay-delay={index * 100}
                      style={{
                      position: 'relative',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      aspectRatio: '4/3',
                      boxShadow: '10px 10px 28px rgba(0,0,0,0.13), -6px -6px 18px rgba(255,255,255,0.04)',
                      opacity: 0,
                      transform: 'scale(0.95)',
                      transition: `opacity 0.6s ease-out, transform 0.6s ease-out`
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
              }}>
                {benefits.map((benefit, index) => (
                  <div key={index} 
                    className="clay-light-card"
                    data-clay-reveal="true"
                    data-clay-delay={index * 80}
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '32px 24px',
                    opacity: 0,
                    transform: 'translateY(30px)',
                    transition: `opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.22s ease, border-color 0.22s ease`,
                    background: '#FDF6EC', 
                    borderRadius: '20px', 
                    boxShadow: '6px 6px 16px rgba(0,0,0,0.08), -6px -6px 16px rgba(255,255,255,0.80)', 
                    border: '1px solid rgba(201,168,76,0.10)'
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
                  className="btn-cta-primary clay-cta" 
                  aria-label="View open career opportunities at Sampada"
                  style={{ 
                    display: 'inline-block',
                    borderRadius: '40px',
                    boxShadow: '4px 4px 14px rgba(139,26,26,0.25), -2px -2px 8px rgba(255,255,255,0.55)',
                    transition: 'transform 0.2s ease'
                  }}
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
