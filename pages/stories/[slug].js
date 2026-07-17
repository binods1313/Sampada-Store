// pages/stories/[slug].js
// Individual story page — Sanity only
import Head from 'next/head'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '@/lib/client'
import { portableTextComponents } from '@/components/PortableTextComponents'
import styles from './StoryDetail.module.css'

// ─── Rich text: story-specific styles layered onto shared PT components ───────
// Deep-merge so `types.image` from portableTextComponents is kept and
// `block` handlers are never wiped by a shallow spread.
const ptComponents = {
  ...portableTextComponents,
  types: {
    ...portableTextComponents.types,
  },
  block: {
    ...portableTextComponents.block,
    normal: ({ children }) => <p className={styles.bodyP}>{children}</p>,
    h2: ({ children }) => <h2 className={styles.bodyH2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.bodyH3}>{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className={styles.bodyQuote}>{children}</blockquote>
    ),
  },
  marks: {
    ...portableTextComponents.marks,
    link: ({ value, children }) => (
      <a
        href={value?.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.bodyLink}
      >
        {children}
      </a>
    ),
  },
}

/** True when image has a usable Sanity asset id/ref (not an empty _ref from bad GROQ). */
function hasImageAsset(image) {
  const asset = image?.asset
  if (!asset || typeof asset !== 'object') return false
  const id = asset._ref || asset._id || ''
  return typeof id === 'string' && id.length > 0
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StoryDetail({ story }) {
  if (!story) {
    return (
      <div className={styles.notFound}>
        <h1>Story not found</h1>
        <Link href="/stories" className={styles.backLink}>← Back to Stories</Link>
      </div>
    )
  }

  const coverUrl = hasImageAsset(story.coverImage)
    ? urlFor(story.coverImage).width(1600).height(900).fit('crop').url()
    : null

  return (
    <>
      <Head>
        <title>{story.title} — Sampada Stories</title>
        <meta name="description" content={`${story.model} — ${story.tag || 'Sampada Story'}`} />
        {coverUrl && <meta property="og:image" content={coverUrl} />}
      </Head>

      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero} style={{ backgroundImage: coverUrl ? `url(${coverUrl})` : 'none' }}>
          <div className={styles.heroOverlay}>
            <div className={styles.heroInner}>
              {story.tag && <span className={styles.tagPill}>{story.tag}</span>}
              <h1 className={styles.heroTitle}>{story.title}</h1>
              <p className={styles.modelBadge}>Featuring: {story.model}</p>
            </div>
          </div>
        </section>

        {/* Body */}
        <article className={styles.body}>
          <Link href="/stories" className={styles.backLink}>← Back to Stories</Link>

          {story.publishedAt && (
            <p className={styles.date}>
              {new Date(story.publishedAt).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          )}

          {story.description && (
            <div className={styles.description}>
              <PortableText
                value={story.description}
                components={ptComponents}
                onMissingComponent={false}
              />
            </div>
          )}

          {/* Gallery — skip images with missing/broken asset refs (build-safe) */}
          {story.gallery?.some(hasImageAsset) && (
            <section className={styles.gallerySection}>
              <h2 className={styles.galleryHeading}>Gallery</h2>
              <div className={styles.galleryGrid}>
                {story.gallery.filter(hasImageAsset).map((img, i) => (
                  <figure key={img._key || i} className={styles.galleryItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urlFor(img).width(800).height(1000).fit('crop').url()}
                      alt={img.alt || `${story.model || story.title} look ${i + 1}`}
                      className={styles.galleryImg}
                      loading="lazy"
                    />
                    {img.caption && <figcaption className={styles.galleryCaption}>{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}

          <Link href="/stories" className={styles.backLinkBottom}>← Back to Stories</Link>
        </article>
      </main>
    </>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export async function getStaticPaths() {
  const slugs = await client.fetch(
    `*[_type == "story" && published == true && defined(slug.current)]{ "slug": slug.current }`
  )
  return {
    paths: slugs.map(s => ({ params: { slug: s.slug } })),
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  // Keep asset as a reference ({ _type, _ref }) — do NOT use asset->{ _ref }.
  // Dereferencing then projecting `_ref` yields empty refs (asset docs use _id).
  const story = await client.fetch(
    `*[_type == "story" && slug.current == $slug && published == true][0]{
      _id, title, slug, model, tag, publishedAt,
      coverImage { alt, asset },
      description[],
      gallery[]{ _key, alt, caption, asset }
    }`,
    { slug: params.slug }
  )

  if (!story) return { notFound: true }

  return {
    props: { story },
    revalidate: 60
  }
}
