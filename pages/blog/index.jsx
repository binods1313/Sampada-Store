// pages/blog/index.jsx
// Sampada Journal — Blog listing page
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { client } from '../../lib/client';

// Try multiple Sanity type names — use whichever exists in the studio
const postsQuery = `{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    "author": author->name,
    "coverImage": mainImage.asset->url,
    "categories": categories[]->title
  },
  "blogPosts": *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    "author": author->name,
    "coverImage": mainImage.asset->url,
    "categories": categories[]->title
  },
  "articles": *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    "author": author->name,
    "coverImage": mainImage.asset->url,
    "categories": categories[]->title
  }
}`;

export async function getStaticProps() {
  let posts = [];
  let foundType = null;

  try {
    const result = await client.fetch(postsQuery);
    if (result.posts && result.posts.length > 0) {
      posts = result.posts;
      foundType = 'post';
    } else if (result.blogPosts && result.blogPosts.length > 0) {
      posts = result.blogPosts;
      foundType = 'blogPost';
    } else if (result.articles && result.articles.length > 0) {
      posts = result.articles;
      foundType = 'article';
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }

  return {
    props: {
      posts,
      foundType,
    },
    revalidate: 60,
  };
}

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

export default function BlogIndex({ posts, foundType }) {
  return (
    <>
      <Head>
        <title>Stories & Insights — Sampada Journal | Sampada Originals</title>
        <meta name="description" content="The Sampada Journal — stories, insights, and craft behind Indian heritage apparel." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="section-light" style={{ minHeight: '100vh' }}>
        {/* Hero */}
        <section style={{
          background: 'var(--s-cream, #FAF6F0)',
          padding: '80px 24px 56px',
          textAlign: 'center',
        }}>
          <p className="s-label" style={{
            color: 'var(--s-gold, #C9A84C)',
            letterSpacing: '2.5px',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '16px',
          }}>
            SAMPADA JOURNAL
          </p>
          <h1 className="s-heading" style={{
            color: 'var(--s-crimson, #8B1A1A)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '16px',
          }}>
            Stories & Insights
          </h1>
          <span className="s-bar" />
          <p style={{
            color: 'var(--s-text-body)',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '24px auto 0',
            lineHeight: 1.7,
          }}>
            Heritage, craft, and the people behind every Sampada piece.
          </p>
        </section>

        {/* Posts Grid */}
        <section style={{ padding: '48px 24px 96px' }}>
          <div className="s-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {posts.length === 0 ? (
              /* Empty State */
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid rgba(139,26,26,0.12)',
                boxShadow: '6px 6px 16px rgba(0,0,0,0.06), -6px -6px 16px rgba(255,255,255,0.8)',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✦</div>
                <h2 style={{
                  fontFamily: 'var(--s-serif, Georgia, serif)',
                  fontSize: '1.5rem',
                  color: 'var(--s-text-heading, #3D2B1F)',
                  marginBottom: '8px',
                }}>
                  No posts yet
                </h2>
                <p style={{
                  color: 'var(--s-text-body)',
                  fontSize: '0.95rem',
                }}>
                  Check back soon — the Sampada Journal is on its way.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '32px',
              }}>
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug?.current || post._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <article style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid rgba(139,26,26,0.08)',
                      boxShadow: '6px 6px 16px rgba(0,0,0,0.06), -6px -6px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                      transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.1), -4px -4px 16px rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '6px 6px 16px rgba(0,0,0,0.06), -6px -6px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)';
                      }}
                    >
                      {/* Cover Image */}
                      {post.coverImage && (
                        <div style={{
                          width: '100%',
                          height: '200px',
                          overflow: 'hidden',
                          background: 'var(--s-cream, #FAF6F0)',
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.coverImage}
                            alt={post.title || 'Blog post cover'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}

                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Category pill */}
                        {post.categories && post.categories.length > 0 && (
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              background: 'rgba(201,168,76,0.15)',
                              color: 'var(--s-gold, #C9A84C)',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              borderRadius: '12px',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase',
                            }}>
                              {post.categories[0]}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h2 style={{
                          fontFamily: 'var(--s-serif, Georgia, serif)',
                          fontSize: '1.3rem',
                          color: 'var(--s-text-heading, #3D2B1F)',
                          marginBottom: '8px',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p style={{
                            color: 'var(--s-text-body)',
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            marginBottom: '16px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flex: 1,
                          }}>
                            {post.excerpt}
                          </p>
                        )}

                        {/* Author + Date */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '16px',
                          borderTop: '1px solid rgba(139,26,26,0.08)',
                          fontSize: '0.8rem',
                          color: 'var(--s-text-body)',
                        }}>
                          <span style={{ fontWeight: 600, color: 'var(--s-crimson, #8B1A1A)' }}>
                            {post.author || 'Sampada'}
                          </span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
