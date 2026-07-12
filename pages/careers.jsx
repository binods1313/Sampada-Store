// pages/careers.jsx
// Careers page — Sampada hiring page
// No career Sanity type exists; shows a static "We're hiring" layout.
import React from 'react';
import Head from 'next/head';
import { client } from '../lib/client';

// Try career/jobPosting types — if none exist, falls back to static layout
const careersQuery = `*[_type == "career" || _type == "jobPosting"] {
  _id,
  title,
  department,
  location,
  type,
  description,
  excerpt,
  slug
}`;

// Extract plain text from a Portable Text block array or string
function extractPlainText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value
      .filter((block) => block && block._type === 'block' && Array.isArray(block.children))
      .map((block) => block.children.map((child) => (child && child.text) || '').join(''))
      .join(' ');
  }
  return '';
}

export async function getStaticProps() {
  let jobs = [];
  let foundType = null;

  try {
    const result = await client.fetch(careersQuery);
    if (result && result.length > 0) {
      // Normalize description to a plain string to avoid rendering Portable Text objects
      jobs = result.map((job) => ({
        ...job,
        description: extractPlainText(job.description || job.excerpt),
      }));
      foundType = result[0]?._type || 'career';
    }
  } catch (error) {
    console.error('Error fetching careers:', error);
  }

  return {
    props: {
      jobs,
      foundType,
    },
    revalidate: 60,
  };
}

export default function Careers({ jobs, foundType }) {
  return (
    <>
      <Head>
        <title>Careers — Join the Sampada Family | Sampada Originals</title>
        <meta name="description" content="Join the Sampada family. We're always looking for passionate people who love Indian heritage and craft." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="section-light" style={{ minHeight: '100vh' }}>
        {/* Hero */}
        <section style={{
          background: 'var(--s-cream, #FAF6F0)',
          padding: '96px 24px 64px',
          textAlign: 'center',
        }}>
          <div className="s-container" style={{ maxWidth: '760px', margin: '0 auto' }}>
            <p className="s-label" style={{
              color: 'var(--s-gold, #C9A84C)',
              letterSpacing: '2.5px',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              WE'RE HIRING
            </p>
            <h1 className="s-heading" style={{
              color: 'var(--s-crimson, #8B1A1A)',
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              marginBottom: '20px',
              lineHeight: 1.1,
            }}>
              Join the Sampada Family
            </h1>
            <span className="s-bar" />
            <p style={{
              color: 'var(--s-text-body)',
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              maxWidth: '600px',
              margin: '24px auto 0',
              lineHeight: 1.7,
            }}>
              We're always looking for passionate people who love Indian heritage and craft.
            </p>
          </div>
        </section>

        {/* Job listings OR static CTA */}
        <section style={{ padding: '48px 24px 96px' }}>
          <div className="s-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {jobs.length > 0 ? (
              /* Dynamic job listings (if Sanity career type ever added) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {jobs.map((job) => (
                  <div key={job._id} style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '32px',
                    border: '1px solid rgba(139,26,26,0.08)',
                    boxShadow: '6px 6px 16px rgba(0,0,0,0.06), -6px -6px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                  }}>
                    <h2 style={{
                      fontFamily: 'var(--s-serif, Georgia, serif)',
                      fontSize: '1.5rem',
                      color: 'var(--s-text-heading, #3D2B1F)',
                      marginBottom: '12px',
                    }}>
                      {job.title}
                    </h2>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '16px',
                    }}>
                      {job.department && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'rgba(201,168,76,0.15)',
                          color: 'var(--s-gold, #C9A84C)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '12px',
                        }}>
                          {job.department}
                        </span>
                      )}
                      {job.location && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'rgba(139,26,26,0.08)',
                          color: 'var(--s-crimson, #8B1A1A)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '12px',
                        }}>
                          {job.location}
                        </span>
                      )}
                      {job.type && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'rgba(0,0,0,0.05)',
                          color: 'var(--s-text-body)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '12px',
                        }}>
                          {job.type}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p style={{
                        color: 'var(--s-text-body)',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                      }}>
                        {job.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Static CTA — no career Sanity type found */
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '56px 40px',
                textAlign: 'center',
                border: '1px solid rgba(201,168,76,0.25)',
                boxShadow: '8px 8px 20px rgba(0,0,0,0.08), -8px -8px 20px rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,0.6)',
                maxWidth: '640px',
                margin: '0 auto',
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(139,26,26,0.06)',
                  border: '1px solid rgba(139,26,26,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '2rem',
                }}>
                  ✦
                </div>
                <h2 style={{
                  fontFamily: 'var(--s-serif, Georgia, serif)',
                  fontSize: '1.8rem',
                  color: 'var(--s-text-heading, #3D2B1F)',
                  marginBottom: '12px',
                }}>
                  We'd love to hear from you
                </h2>
                <p style={{
                  color: 'var(--s-text-body)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  maxWidth: '480px',
                  margin: '0 auto 32px',
                }}>
                  We don't have open roles listed right now, but we're always interested in connecting with talented people who share our passion for Indian heritage and craft.
                </p>
                <a
                  href="mailto:binod1313@gmail.com?subject=Portfolio%20Submission%20-%20Sampada%20Careers"
                  className="btn-cta-primary clay-cta"
                  style={{
                    display: 'inline-block',
                    textDecoration: 'none',
                    padding: '16px 36px',
                    borderRadius: '40px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    boxShadow: '4px 4px 14px rgba(139,26,26,0.25), -2px -2px 8px rgba(255,255,255,0.55)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  Send your portfolio →
                </a>
                <p style={{
                  color: 'var(--s-text-body)',
                  fontSize: '0.85rem',
                  marginTop: '16px',
                }}>
                  binod1313@gmail.com
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
