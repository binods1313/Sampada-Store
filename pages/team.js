// pages/team.js - Sampada Team Page
import Head from 'next/head'
import Link from 'next/link'
import { client, urlFor } from '@/lib/client'

export default function TeamPage({ teamMembers }) {
  const hasTeam = teamMembers && teamMembers.length > 0

  return (
    <>
      <Head>
        <title>Our Team - Sampada</title>
        <meta name="description" content="Meet the visionaries behind Sampada. Our team of passionate designers, artisans, and craftspeople dedicated to heritage fashion." />
        <meta property="og:title" content="Our Team - Sampada" />
        <meta property="og:description" content="Meet the visionaries behind Sampada" />
      </Head>

      <main>
        {/* Section 1: DARK Hero */}
        <section className="section-dark s-section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
          <div className="s-container" style={{ textAlign: 'center' }}>
            <p className="s-label">THE PEOPLE</p>
            <h1 className="s-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '24px' }}>
              Meet Our Visionaries
            </h1>
            <p style={{ color: 'var(--s-text-mid)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
              The passionate individuals who bring Sampada's vision to life — designers, artisans, and craftspeople united by a love for heritage and quality.
            </p>
          </div>
        </section>

        {/* Section 2: LIGHT Team Grid */}
        {hasTeam ? (
          <section className="section-light s-section">
            <div className="s-container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                {teamMembers.map((member, index) => {
                  const photoUrl = member.photo ? urlFor(member.photo).width(400).height(400).fit('crop').url() : null
                  
                  return (
                    <div key={member._id || index} className="s-card" style={{ textAlign: 'center' }}>
                      {photoUrl && (
                        <div style={{ 
                          width: '120px', 
                          height: '120px', 
                          borderRadius: '50%', 
                          overflow: 'hidden', 
                          margin: '0 auto 20px',
                          border: '3px solid var(--s-gold)',
                          boxShadow: '0 4px 12px rgba(139,26,26,0.1)'
                        }}>
                          <img 
                            src={photoUrl} 
                            alt={member.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                      )}
                      <h3 className="s-card-title" style={{ marginBottom: '4px' }}>
                        {member.name}
                      </h3>
                      <p className="s-card-hi" style={{ marginBottom: '12px' }}>
                        {member.role}
                      </p>
                      {member.bio && (
                        <p className="s-card-body">
                          {member.bio}
                        </p>
                      )}
                      {member.email && (
                        <a 
                          href={`mailto:${member.email}`} 
                          style={{ 
                            display: 'inline-block', 
                            marginTop: '12px', 
                            color: 'var(--s-crimson)', 
                            fontSize: '0.85rem', 
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--s-gold)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--s-crimson)'}
                        >
                          {member.email}
                        </a>
                      )}
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block', 
                            marginTop: '8px', 
                            marginLeft: member.email ? '12px' : '0',
                            color: 'var(--s-crimson)', 
                            fontSize: '0.85rem', 
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--s-gold)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--s-crimson)'}
                        >
                          LinkedIn →
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        ) : (
          <section className="section-light s-section">
            <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
              <div style={{ 
                padding: '48px 24px', 
                background: '#FFFFFF', 
                borderRadius: '8px', 
                border: '1px solid rgba(139,26,26,0.12)',
                boxShadow: '0 2px 12px rgba(139,26,26,0.05)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <h2 style={{ fontFamily: 'var(--s-serif)', fontSize: '1.8rem', color: 'var(--s-text-heading)', marginBottom: '12px' }}>
                  Team Profiles Coming Soon
                </h2>
                <p style={{ color: 'var(--s-text-body)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '24px' }}>
                  We're currently building our team page. Check back soon to meet the passionate individuals behind Sampada.
                </p>
                <Link href="/" className="s-btn">
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Section 3: CRIMSON Join the Team CTA */}
        <section className="section-crimson s-section">
          <div className="s-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 className="s-heading">Join Our Team</h2>
            <p style={{ color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7', margin: '16px 0 32px' }}>
              Passionate about heritage fashion and craftsmanship? We're always looking for talented individuals to join the Sampada family.
            </p>
            <Link href="/contact" className="btn-cta-primary">
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
  const query = `*[_type == "team"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    email,
    linkedin,
    photo {
      alt,
      asset->
    },
    order
  }`

  try {
    const teamMembers = await client.fetch(query)
    return {
      props: {
        teamMembers: teamMembers || []
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching team data:', error)
    return {
      props: {
        teamMembers: []
      },
      revalidate: 60
    }
  }
}
