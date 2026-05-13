// pages/about.js - Sampada Premium Brand Styling
import React from 'react';
import Image from 'next/image';
import { client } from '../lib/sanity';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import SanityImage from '../components/SanityImage';
import Head from 'next/head';
import Link from 'next/link';

// Query to fetch all about page content from Sanity
const aboutPageQuery = groq`*[_type == "aboutUs"][0]{
  title,
  heroTitle,
  heroDescription,
  missionTitle,
  missionDescription,
  teamTitle,
  teamMembers[] {
    name,
    position,
    image
  },
  storyTitle,
  storyContent,
  storyImage,
  statsTitle,
  statsDescription,
  stats[] {
    value,
    label
  },
  contactTitle,
  contactDescription
}`;

export async function getStaticProps() {
  const aboutData = await client.fetch(aboutPageQuery);

  return {
    props: {
      aboutData
    },
    revalidate: 60,
  };
}

const AboutPage = ({ aboutData }) => {
  if (!aboutData) return <div className="section-light" style={{ padding: '80px 20px', textAlign: 'center' }}><div className="loading-spinner">Loading...</div></div>;

  return (
    <>
      <Head>
        <title>About Sampada – Prosperity in Every Print</title>
        <meta name="description" content="Learn about Sampada, a Vedic-inspired custom print-on-demand brand. Bringing prosperity, abundance, and blessings through every product." />
      </Head>

      {/* Hero Section: DARK */}
      <section className="section-dark s-section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="s-container" style={{ textAlign: 'center' }}>
          <p className="s-label">OUR STORY</p>
          <h1 className="s-heading" style={{ fontSize: '2.8rem' }}>
            {aboutData.heroTitle || "Building the Future, Now"}
          </h1>
          <span className="s-bar" />
          <p style={{ color: 'var(--s-text-mid)', fontSize: '1.1rem', maxWidth: '700px', margin: '24px auto 0', lineHeight: '1.7' }}>
            {aboutData.heroDescription ||
              "At Sampada, we don't just create print-on-demand products—we craft prosperity-themed gifts that bring abundance into every home."
            }
          </p>
        </div>
      </section>

      {/* Mission Section: LIGHT */}
      <section className="section-light s-section">
        <div className="s-container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 className="s-heading">{aboutData.missionTitle || "Our Mission"}</h2>
          <span className="s-bar" />
          <p style={{ color: 'var(--s-text-body)', fontSize: '1rem', lineHeight: '1.8', marginTop: '24px' }}>
            {aboutData.missionDescription ||
              "Our mission is to empower businesses and individuals with transformative, cutting-edge tech solutions. We are dedicated to pushing the boundaries of innovation while building lasting partnerships grounded in trust, precision, and excellence."}
          </p>
        </div>
      </section>

      {/* Values Section: DARK */}
      <section className="section-dark s-section">
        <div className="s-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="s-label">WHAT DRIVES US</p>
            <h2 className="s-heading">Our Values</h2>
            <span className="s-bar" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="s-card-dark">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💡</div>
              <h3 className="s-card-title">Innovation</h3>
              <p className="s-card-body">
                We constantly push the boundaries of what's possible, exploring new technologies and developing products that transform the way you interact with the world.
              </p>
            </div>
            <div className="s-card-dark">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⭐</div>
              <h3 className="s-card-title">Quality</h3>
              <p className="s-card-body">
                We're committed to excellence in every product we offer, ensuring unparalleled performance, durability, and user experience.
              </p>
            </div>
            <div className="s-card-dark">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🌿</div>
              <h3 className="s-card-title">Sustainability</h3>
              <p className="s-card-body">
                Our dedication to responsible innovation means creating products that not only enhance human capabilities but also minimize environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section: LIGHT */}
      <section className="section-light s-section">
        <div className="s-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="s-label">HOW WE STARTED</p>
            <h2 className="s-heading">{aboutData.storyTitle || "Our Journey of Innovation"}</h2>
            <span className="s-bar" />
          </div>

          {aboutData.storyContent ? (
            <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--s-text-body)', lineHeight: '1.8', fontSize: '1rem' }}>
              <PortableText value={aboutData.storyContent} />
            </div>
          ) : (
            <>
              <p style={{ maxWidth: '800px', margin: '0 auto 24px', color: 'var(--s-text-body)', fontSize: '1rem', lineHeight: '1.8' }}>
                Founded with a bold vision and a passion for Vedic prosperity, Sampada began as a small print-on-demand venture fueled by big ideas.
                Over the years, we have grown into a leading force in the tech industry, continually challenging the status quo and setting new benchmarks for excellence.
              </p>
              <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--s-text-body)', fontSize: '1rem', lineHeight: '1.8' }}>
                Our journey is a story of passion, collaboration, and a commitment to transforming challenges into opportunities.
                Today, we celebrate our achievements and look ahead to a future filled with limitless possibilities.
                Join us as we continue to pioneer breakthroughs that reshape the digital landscape.
              </p>
            </>
          )}

          {/* Team Photo */}
          {aboutData.storyImage && (
            <div style={{ maxWidth: '800px', margin: '40px auto 0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(139,26,26,0.1)' }}>
              <SanityImage
                image={aboutData.storyImage}
                alt="Sampada team bringing prosperity through prints"
                width={800}
                height={600}
              />
            </div>
          )}
        </div>
      </section>

      {/* Team Section: DARK */}
      <section className="section-dark s-section">
        <div className="s-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="s-label">THE PEOPLE BEHIND SAMPADA</p>
            <h2 className="s-heading">{aboutData.teamTitle || "Meet Our Visionaries"}</h2>
            <span className="s-bar" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', justifyContent: 'center' }}>
            {aboutData.teamMembers && aboutData.teamMembers.length > 0 ? (
              aboutData.teamMembers.map((member, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--s-gold)', boxShadow: '0 4px 16px rgba(201,169,110,0.3)' }}>
                    {member.image ? (
                      <SanityImage
                        image={member.image}
                        alt={`${member.name} photo`}
                        width={300}
                        height={300}
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--s-gold), #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>
                        {member.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontWeight: '700', color: 'var(--s-text-light)', marginBottom: '4px', fontSize: '1.1rem' }}>{member.name}</h3>
                  <p style={{ color: 'var(--s-gold)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{member.position}</p>
                </div>
              ))
            ) : (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--s-gold)' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--s-gold), #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>A</div>
                  </div>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontWeight: '700', color: 'var(--s-text-light)', fontSize: '1.1rem' }}>Akshay</h3>
                  <p style={{ color: 'var(--s-gold)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Chief Technology Officer</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--s-gold)' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--s-gold), #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>S</div>
                  </div>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontWeight: '700', color: 'var(--s-text-light)', fontSize: '1.1rem' }}>Srini</h3>
                  <p style={{ color: 'var(--s-gold)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Chief Operating Officer</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--s-gold)' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--s-gold), #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>M</div>
                  </div>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontWeight: '700', color: 'var(--s-text-light)', fontSize: '1.1rem' }}>Mahesh</h3>
                  <p style={{ color: 'var(--s-gold)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Chief Operating Officer</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Impact Section: CRIMSON */}
      <section className="section-crimson s-section">
        <div className="s-container" style={{ textAlign: 'center' }}>
          <p className="s-label" style={{ color: 'var(--s-gold)' }}>BY THE NUMBERS</p>
          <h2 className="s-heading">{aboutData.statsTitle || "Our Impact"}</h2>
          <span className="s-bar" />
          <p style={{ maxWidth: '600px', margin: '24px auto 40px', color: 'rgba(250,246,240,0.85)', fontSize: '1rem', lineHeight: '1.7' }}>
            {aboutData.statsDescription ||
              "We measure our success by the difference we create. From innovative projects to satisfied clients, every achievement is a milestone on our journey to redefine technology."}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '800px', margin: '0 auto' }}>
            {aboutData.stats && aboutData.stats.length > 0 ? (
              aboutData.stats.map((stat, index) => (
                <div key={index}>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontSize: '3rem', fontWeight: '800', color: 'var(--s-gold)', marginBottom: '8px' }}>{stat.value}</h3>
                  <p style={{ color: 'var(--s-cream)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{stat.label}</p>
                </div>
              ))
            ) : (
              <>
                <div>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontSize: '3rem', fontWeight: '800', color: 'var(--s-gold)', marginBottom: '8px' }}>100+</h3>
                  <p style={{ color: 'var(--s-cream)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Projects Delivered</p>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontSize: '3rem', fontWeight: '800', color: 'var(--s-gold)', marginBottom: '8px' }}>50+</h3>
                  <p style={{ color: 'var(--s-cream)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Happy Clients</p>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--s-serif)', fontSize: '3rem', fontWeight: '800', color: 'var(--s-gold)', marginBottom: '8px' }}>10+</h3>
                  <p style={{ color: 'var(--s-cream)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Years of Innovation</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Connect Section: LIGHT */}
      <section className="section-light s-section">
        <div className="s-container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <p className="s-label">LET'S TALK</p>
          <h2 className="s-heading">{aboutData.contactTitle || "Connect With Us"}</h2>
          <span className="s-bar" />
          <p style={{ color: 'var(--s-text-body)', fontSize: '1rem', lineHeight: '1.7', margin: '24px auto 32px' }}>
            {aboutData.contactDescription ||
              "We'd love to hear from you. Whether you have a question, an idea, or simply want to get in touch, reach out and let's create something extraordinary together."}
          </p>
          <Link href="/contact" className="btn-cta-primary">
            Contact Our Team <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
};

export default AboutPage;