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

      {/* Hero Section - Cream Background */}
      <section className="page-hero" style={{ textAlign: 'center' }}>
        <div className="container-lg">
          <span className="section-tag">Our Story</span>
          <h1 className="section-title section-title-center">{aboutData.heroTitle || "Building the Future, Now"}</h1>
          <div className="gold-divider" style={{ margin: '16px auto' }}></div>
          <p className="section-subtitle" style={{ margin: '24px auto 0' }}>
            {aboutData.heroDescription ||
              "At Sampada, we don't just create print-on-demand products—we craft prosperity-themed gifts that bring abundance into every home."
            }
          </p>
        </div>
      </section>

      {/* Mission Section - White Background */}
      <section className="section-light">
        <div className="container-lg">
          <h2 className="section-title section-title-center">{aboutData.missionTitle || "Our Mission"}</h2>
          <p className="section-subtitle" style={{ margin: '24px auto 0', fontSize: '16px', lineHeight: '1.8' }}>
            {aboutData.missionDescription ||
              "Our mission is to empower businesses and individuals with transformative, cutting-edge tech solutions. We are dedicated to pushing the boundaries of innovation while building lasting partnerships grounded in trust, precision, and excellence."}
          </p>
        </div>
      </section>

      {/* Values Section - Cream Background */}
      <section className="section-cream">
        <div className="container-lg">
          <h2 className="section-title section-title-center">Our Values</h2>
          <div className="gold-divider" style={{ margin: '16px auto 32px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card-premium" style={{ padding: '32px 24px', borderTop: '3px solid #C9A84C' }}>
              <div style={{ fontSize: '32px', color: '#C9A84C', marginBottom: '16px' }}>💡</div>
              <h3 style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>Innovation</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                We constantly push the boundaries of what's possible, exploring new technologies and developing products that transform the way you interact with the world.
              </p>
            </div>
            <div className="card-premium" style={{ padding: '32px 24px', borderTop: '3px solid #C9A84C' }}>
              <div style={{ fontSize: '32px', color: '#C9A84C', marginBottom: '16px' }}>⭐</div>
              <h3 style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>Quality</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                We're committed to excellence in every product we offer, ensuring unparalleled performance, durability, and user experience.
              </p>
            </div>
            <div className="card-premium" style={{ padding: '32px 24px', borderTop: '3px solid #C9A84C' }}>
              <div style={{ fontSize: '32px', color: '#C9A84C', marginBottom: '16px' }}>🌿</div>
              <h3 style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>Sustainability</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                Our dedication to responsible innovation means creating products that not only enhance human capabilities but also minimize environmental impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section - White Background */}
      <section className="section-light">
        <div className="container-lg">
          <h2 className="section-title section-title-center">{aboutData.storyTitle || "Our Journey of Innovation"}</h2>
          <div className="gold-divider" style={{ margin: '16px auto 32px' }}></div>

          {aboutData.storyContent ? (
            <div style={{ maxWidth: '800px', margin: '0 auto', color: '#555', lineHeight: '1.8' }}>
              <PortableText value={aboutData.storyContent} />
            </div>
          ) : (
            <>
              <p style={{ maxWidth: '800px', margin: '0 auto 24px', color: '#555', fontSize: '16px', lineHeight: '1.8' }}>
                Founded with a bold vision and a passion for Vedic prosperity, Sampada began as a small print-on-demand venture fueled by big ideas.
                Over the years, we have grown into a leading force in the tech industry, continually challenging the status quo and setting new benchmarks for excellence.
              </p>
              <p style={{ maxWidth: '800px', margin: '0 auto', color: '#555', fontSize: '16px', lineHeight: '1.8' }}>
                Our journey is a story of passion, collaboration, and a commitment to transforming challenges into opportunities.
                Today, we celebrate our achievements and look ahead to a future filled with limitless possibilities.
                Join us as we continue to pioneer breakthroughs that reshape the digital landscape.
              </p>
            </>
          )}

          {/* Team Photo */}
          {aboutData.storyImage && (
            <div style={{ maxWidth: '800px', margin: '40px auto 0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
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

      {/* Team Section - Cream Background */}
      <section className="section-cream">
        <div className="container-lg">
          <h2 className="section-title section-title-center">{aboutData.teamTitle || "Meet Our Visionaries"}</h2>
          <div className="gold-divider" style={{ margin: '16px auto 40px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', justifyContent: 'center' }}>
            {aboutData.teamMembers && aboutData.teamMembers.length > 0 ? (
              aboutData.teamMembers.map((member, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #C9A84C', boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
                    {member.image ? (
                      <SanityImage
                        image={member.image}
                        alt={`${member.name} photo`}
                        width={300}
                        height={300}
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #C9A84C, #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>
                        {member.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>{member.name}</h3>
                  <p style={{ color: '#C9A84C', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{member.position}</p>
                </div>
              ))
            ) : (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #C9A84C' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #C9A84C, #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>A</div>
                  </div>
                  <h3 style={{ fontWeight: '700', color: '#1a1a1a' }}>Akshay</h3>
                  <p style={{ color: '#C9A84C', fontSize: '13px', textTransform: 'uppercase' }}>Chief Technology Officer</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #C9A84C' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #C9A84C, #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>S</div>
                  </div>
                  <h3 style={{ fontWeight: '700', color: '#1a1a1a' }}>Srini</h3>
                  <p style={{ color: '#C9A84C', fontSize: '13px', textTransform: 'uppercase' }}>Chief Operating Officer</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #C9A84C' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #C9A84C, #a88535)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: '700' }}>M</div>
                  </div>
                  <h3 style={{ fontWeight: '700', color: '#1a1a1a' }}>Mahesh</h3>
                  <p style={{ color: '#C9A84C', fontSize: '13px', textTransform: 'uppercase' }}>Chief Operating Officer</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Impact Section - Deep Red Background */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #8B1A1A, #6B1414)', color: '#ffffff' }}>
        <div className="container-lg" style={{ textAlign: 'center' }}>
          <h2 className="section-title section-title-center" style={{ color: '#ffffff' }}>{aboutData.statsTitle || "Our Impact"}</h2>
          <div className="gold-divider" style={{ margin: '16px auto 32px' }}></div>
          <p style={{ maxWidth: '600px', margin: '0 auto 40px', color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: '1.6' }}>
            {aboutData.statsDescription ||
              "We measure our success by the difference we create. From innovative projects to satisfied clients, every achievement is a milestone on our journey to redefine technology."}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '800px', margin: '0 auto' }}>
            {aboutData.stats && aboutData.stats.length > 0 ? (
              aboutData.stats.map((stat, index) => (
                <div key={index}>
                  <h3 style={{ fontSize: '48px', fontWeight: '800', color: '#C9A84C', marginBottom: '8px' }}>{stat.value}</h3>
                  <p style={{ color: '#ffffff', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{stat.label}</p>
                </div>
              ))
            ) : (
              <>
                <div>
                  <h3 style={{ fontSize: '48px', fontWeight: '800', color: '#C9A84C', marginBottom: '8px' }}>100+</h3>
                  <p style={{ color: '#ffffff', fontSize: '13px', textTransform: 'uppercase' }}>Projects Delivered</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '48px', fontWeight: '800', color: '#C9A84C', marginBottom: '8px' }}>50+</h3>
                  <p style={{ color: '#ffffff', fontSize: '13px', textTransform: 'uppercase' }}>Happy Clients</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '48px', fontWeight: '800', color: '#C9A84C', marginBottom: '8px' }}>10+</h3>
                  <p style={{ color: '#ffffff', fontSize: '13px', textTransform: 'uppercase' }}>Years of Innovation</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Connect Section - Cream Background */}
      <section className="section-cream">
        <div className="container-lg" style={{ textAlign: 'center' }}>
          <h2 className="section-title section-title-center">{aboutData.contactTitle || "Connect With Us"}</h2>
          <div className="gold-divider" style={{ margin: '16px auto' }}></div>
          <p className="section-subtitle" style={{ margin: '24px auto 32px' }}>
            {aboutData.contactDescription ||
              "We'd love to hear from you. Whether you have a question, an idea, or simply want to get in touch, reach out and let's create something extraordinary together."}
          </p>
          <Link href="/contact">
            <button className="btn-primary">
              Contact Our Team
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default AboutPage;