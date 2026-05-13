// pages/company.js - Sampada Company Page
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { client, urlFor } from '@/lib/client'
import Image from 'next/image'

export default function CompanyPage({ companyData }) {
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
        {/* Section 1: DARK Hero */}
        <section className="section-dark s-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="s-container" style={{ textAlign: 'center' }}>
            <p className="s-label">{companyInfo?.industry || 'HERITAGE FASHION'}</p>
            <h1 className="s-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '24px' }}>
              {heroTitle || 'Where Heritage Meets Modern Elegance'}
            </h1>
            <p style={{ color: 'var(--s-text-mid)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
              {heroDescription || 'Founded on the principles of timeless design and uncompromising quality.'}
            </p>
            {companyInfo && (
              <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
                {companyInfo.foundedYear && (
                  <div>
                    <p style={{ color: 'var(--s-gold)', fontSize: '1.8rem', fontFamily: 'var(--s-serif)', fontWeight: '700', margin: '0 0 4px' }}>
                      {companyInfo.foundedYear}
                    </p>
                    <p style={{ color: 'var(--s-text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Founded</p>
                  </div>
                )}
                {companyInfo.headquarters && (
                  <div>
                    <p style={{ color: 'var(--s-gold)', fontSize: '1.2rem', fontFamily: 'var(--s-serif)', fontWeight: '600', margin: '0 0 4px' }}>
                      {companyInfo.headquarters}
                    </p>
                    <p style={{ color: 'var(--s-text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Headquarters</p>
                  </div>
                )}
              </div>
            )}
          </div>
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

        {/* Section 3: DARK Values */}
        {values && values.length > 0 && (
          <section className="section-dark s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">{valuesTitle || 'WHAT WE STAND FOR'}</p>
                <h2 className="s-heading">Core Values</h2>
                <span className="s-bar" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {values.map((value, index) => (
                  <div key={index} className="s-card-dark">
                    <div className="s-card-icon" style={{ fontSize: '32px', marginBottom: '16px' }}>
                      {value.icon ? (
                        <img 
                          src={urlFor(value.icon).width(40).height(40).url()} 
                          alt={`${value.title} icon`} 
                          style={{ width: '40px', height: '40px' }} 
                        />
                      ) : (
                        '✨'
                      )}
                    </div>
                    <h3 className="s-card-title">{value.title}</h3>
                    <p className="s-card-body">{value.description}</p>
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

        {/* Section 6: LIGHT Partners */}
        {partners && partners.length > 0 && (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p className="s-label">PARTNERSHIPS</p>
                <h2 className="s-heading">{partnersTitle || 'Trusted By'}</h2>
                <span className="s-bar" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', alignItems: 'center' }}>
                {partners.map((partner, index) => (
                  <div key={index} style={{ textAlign: 'center', padding: '24px' }}>
                    {partner.logo && (
                      <div style={{ marginBottom: '16px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                          src={urlFor(partner.logo).width(120).height(60).fit('max').url()} 
                          alt={`${partner.name} logo - Sampada partner`} 
                          style={{ maxWidth: '120px', maxHeight: '60px', objectFit: 'contain' }} 
                        />
                      </div>
                    )}
                    <h3 style={{ fontFamily: 'var(--s-serif)', fontSize: '1rem', color: 'var(--s-text-heading)', fontWeight: '600', margin: '0 0 4px' }}>
                      {partner.name}
                    </h3>
                    {partner.description && (
                      <p style={{ color: 'var(--s-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                        {partner.description}
                      </p>
                    )}
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
              Have questions about our company, partnerships, or career opportunities? We'd love to hear from you.
            </p>
            <Link href="/contact" className="btn-cta-primary" aria-label="Contact Sampada company">
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
      ...,
      asset->
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
