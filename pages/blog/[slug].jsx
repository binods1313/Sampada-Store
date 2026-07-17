// pages/blog/[slug].jsx
// Individual blog post page — renders Portable Text body
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { client } from '../../lib/client';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '../../components/PortableTextComponents';

const postQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  "author": author->name,
  "coverImage": mainImage.asset->url,
  "categories": categories[]->title
}`;

const allSlugsQuery = `*[_type == "post" && defined(slug.current) && publishedAt < now()]{
  "slug": slug.current
}`;

export async function getStaticPaths() {
  let paths = [];
  try {
    const slugs = await client.fetch(allSlugsQuery);
    paths = (slugs || []).map((s) => ({ params: { slug: s.slug } }));
  } catch (error) {
    console.error('Error fetching blog slug paths:', error);
  }
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  let post = null;
  try {
    post = await client.fetch(postQuery, { slug: params.slug });
  } catch (error) {
    console.error('Error fetching blog post:', error);
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
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

export default function BlogPost({ post }) {
  const hasPortableText = post.body && Array.isArray(post.body) && post.body.length > 0;

  return (
    <>
      <Head>
        <title>{post.title ? `${post.title} — Sampada Journal` : 'Sampada Journal'}</title>
        <meta name="description" content={post.excerpt || 'Sampada Journal — stories and insights from Sampada Originals.'} />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="section-light" style={{ minHeight: '100vh' }}>
        {/* Hero */}
        <section style={{
          background: 'var(--s-cream, #FAF6F0)',
          padding: '80px 24px 48px',
          textAlign: 'center',
        }}>
          <div className="s-container" style={{ maxWidth: '760px', margin: '0 auto' }}>
            {post.categories && post.categories.length > 0 && (
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
                marginBottom: '16px',
              }}>
                {post.categories[0]}
              </span>
            )}
            <h1 className="s-heading" style={{
              color: 'var(--s-crimson, #8B1A1A)',
              fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}>
              {post.title}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '0.9rem',
              color: 'var(--s-text-body)',
            }}>
              {post.author && (
                <span style={{ fontWeight: 600, color: 'var(--s-crimson, #8B1A1A)' }}>
                  {post.author}
                </span>
              )}
              {post.author && post.publishedAt && <span>·</span>}
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImage && (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title || 'Blog post cover'}
              style={{
                width: '100%',
                maxHeight: '420px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '6px 6px 16px rgba(0,0,0,0.08), -6px -6px 16px rgba(255,255,255,0.8)',
              }}
            />
          </div>
        )}

        {/* Body — Portable Text renders block + image types via portableTextComponents */}
        <article style={{ padding: '48px 24px 96px' }}>
          <div className="s-container" style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div
              className="blog-post-body"
              style={{
                fontFamily: 'var(--s-serif, Georgia, serif)',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                // Hard fallback so text never inherits an invisible token
                color: '#2a2a2a',
              }}
            >
              {hasPortableText ? (
                <PortableText
                  value={post.body}
                  components={portableTextComponents}
                  onMissingComponent={false}
                />
              ) : post.body && typeof post.body === 'string' ? (
                <p style={{ color: '#2a2a2a', lineHeight: 1.8 }}>{post.body}</p>
              ) : (
                <p style={{ color: '#2a2a2a', lineHeight: 1.8 }}>{post.excerpt || ''}</p>
              )}
            </div>

            {/* Back link */}
            <div style={{ marginTop: '64px', textAlign: 'center' }}>
              <Link href="/blog" className="btn-cta-primary" style={{
                display: 'inline-block',
                textDecoration: 'none',
                padding: '12px 28px',
                borderRadius: '40px',
              }}>
                ← Back to Journal
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
