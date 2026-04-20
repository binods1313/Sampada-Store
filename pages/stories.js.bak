// pages/stories.js
// Sampada Stories Page - Dynamically fetches content from Sanity
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/client';
import { client } from '@/lib/client';
import styles from '@/components/StoriesPage.module.css';

// Custom PortableText components for rich content
const components = {
  block: {
    h1: ({ children }) => <h1 className={styles.richHeading1}>{children}</h1>,
    h2: ({ children }) => <h2 className={styles.richHeading2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.richHeading3}>{children}</h3>,
    normal: ({ children }) => <p className={styles.richParagraph}>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className={styles.richBlockquote}>{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className={styles.richList}>{children}</ul>,
    number: ({ children }) => <ol className={styles.richList}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.richListItem}>{children}</li>,
    number: ({ children }) => <li className={styles.richListItem}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className={styles.richStrong}>{children}</strong>,
    em: ({ children }) => <em className={styles.richEm}>{children}</em>,
    link: ({ value, children }) => {
      return (
        <a href={value.href} className={styles.richLink} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className={styles.richImage}>
          <img
            src={urlFor(value).width(800).height(600).url()}
            alt={value.alt || 'Story image'}
            loading="lazy"
          />
          {value.caption && <figcaption className={styles.richImageCaption}>{value.caption}</figcaption>}
        </figure>
      );
    },
    file: ({ value }) => {
      if (!value?.asset) return null;
      const fileUrl = value.asset._ref;
      return (
        <div className={styles.richFile}>
          <a href={fileUrl} download className={styles.richFileLink}>
            📎 Download File
          </a>
          {value.caption && <p className={styles.richFileCaption}>{value.caption}</p>}
        </div>
      );
    },
  },
};

// Video component for YouTube/Vimeo embeds
function VideoEmbed({ videoUrl, title }) {
  if (!videoUrl) return null;

  const getEmbedUrl = (url) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className={styles.videoEmbed}>
      <iframe
        src={embedUrl}
        title={title || 'Video'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// Story Card Component
function StoryCard({ story, index }) {
  const imageUrl = story.coverImage?.asset
    ? urlFor(story.coverImage).width(600).height(400).url()
    : null;

  return (
    <article className={styles.storyCard} id={`story-${index}`}>
      {imageUrl && (
        <div className={styles.storyImageWrapper}>
          <img
            src={imageUrl}
            alt={story.coverImage.alt || story.title}
            className={styles.storyImage}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.storyContent}>
        <div className={styles.storyMeta}>
          {story.category && (
            <span className={styles.storyCategory}>{story.category}</span>
          )}
          {story.publishDate && (
            <span className={styles.storyDate}>
              {new Date(story.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
          {story.readTime && (
            <span className={styles.storyReadTime}>{story.readTime}</span>
          )}
        </div>
        <h3 className={styles.storyTitle}>{story.title}</h3>
        {story.excerpt && <p className={styles.storyExcerpt}>{story.excerpt}</p>}
        {story.author && (
          <p className={styles.storyAuthor}>By {story.author}</p>
        )}
        {story.content && (
          <div className={styles.storyBody}>
            <PortableText value={story.content} components={components} />
          </div>
        )}
        {story.videoUrl && (
          <VideoEmbed videoUrl={story.videoUrl} title={story.title} />
        )}
        {story.ctaText && story.ctaLink && (
          <Link href={story.ctaLink} className={styles.storyCtaButton}>
            {story.ctaText}
          </Link>
        )}
      </div>
    </article>
  );
}

// Featured Story Component (Large)
function FeaturedStory({ story }) {
  const imageUrl = story.coverImage?.asset
    ? urlFor(story.coverImage).width(1200).height(600).url()
    : null;

  return (
    <article className={styles.featuredStory}>
      <div className={styles.featuredStoryGrid}>
        {imageUrl && (
          <div className={styles.featuredImageWrapper}>
            <img
              src={imageUrl}
              alt={story.coverImage.alt || story.title}
              className={styles.featuredImage}
              loading="lazy"
            />
          </div>
        )}
        <div className={styles.featuredContent}>
          <div className={styles.featuredMeta}>
            {story.category && (
              <span className={styles.featuredCategory}>{story.category.replace('-', ' ')}</span>
            )}
            {story.publishDate && (
              <span className={styles.featuredDate}>
                {new Date(story.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
          <h2 className={styles.featuredTitle}>{story.title}</h2>
          {story.excerpt && <p className={styles.featuredExcerpt}>{story.excerpt}</p>}
          {story.author && <p className={styles.featuredAuthor}>By {story.author}</p>}
          {story.ctaText && story.ctaLink && (
            <Link href={story.ctaLink} className={styles.featuredCtaButton}>
              {story.ctaText}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

// Video Card Component
function VideoCard({ video }) {
  return (
    <div className={styles.videoCard}>
      {video.videoUrl && (
        <VideoEmbed videoUrl={video.videoUrl} title={video.title} />
      )}
      <h4 className={styles.videoTitle}>{video.title}</h4>
      {video.description && <p className={styles.videoDescription}>{video.description}</p>}
      {video.duration && <span className={styles.videoDuration}>{video.duration}</span>}
    </div>
  );
}

// Gallery Image Component
function GalleryImage({ image }) {
  const imageUrl = image.asset
    ? urlFor(image).width(400).height(300).url()
    : null;

  return (
    <figure className={styles.galleryImage}>
      <img
        src={imageUrl}
        alt={image.alt || 'Gallery image'}
        loading="lazy"
      />
      {(image.caption || image.photographer) && (
        <figcaption className={styles.galleryCaption}>
          {image.caption}
          {image.photographer && <span className={styles.galleryPhotographer}> — {image.photographer}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// Testimonial Component
function Testimonial({ testimonial }) {
  const avatarUrl = testimonial.avatar?.asset
    ? urlFor(testimonial.avatar).width(100).height(100).url()
    : null;

  return (
    <div className={styles.testimonial}>
      <blockquote className={styles.testimonialQuote}>"{testimonial.quote}"</blockquote>
      <div className={styles.testimonialAuthor}>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={testimonial.author}
            className={styles.testimonialAvatar}
          />
        )}
        <div className={styles.testimonialInfo}>
          <p className={styles.testimonialName}>{testimonial.author}</p>
          {(testimonial.role || testimonial.company) && (
            <p className={styles.testimonialRole}>
              {testimonial.role}{testimonial.role && testimonial.company && ' at '}{testimonial.company}
            </p>
          )}
          {testimonial.rating && (
            <div className={styles.testimonialRating}>
              {'⭐'.repeat(testimonial.rating)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StoriesPage({ storiesPage, notFound = false }) {
  if (notFound) {
    return (
      <div className={styles.notFound}>
        <h1>Stories Page Not Published</h1>
        <p>The Sampada Stories page is coming soon!</p>
        <Link href="/" className={styles.backHome}>Back to Home</Link>
      </div>
    );
  }

  if (!storiesPage) {
    return null;
  }

  const {
    title,
    heroSection,
    introductionSection,
    featuredStories = [],
    videoSection,
    gallerySection,
    testimonialsSection,
    ctaSection,
    seo
  } = storiesPage;

  const heroImageUrl = heroSection?.backgroundImage?.asset
    ? urlFor(heroSection.backgroundImage).width(1920).height(800).url()
    : null;

  return (
    <>
      <Head>
        <title>{seo?.metaTitle || title || 'Sampada Stories'}</title>
        <meta name="description" content={seo?.metaDescription || heroSection?.subtitle || ''} />
        {seo?.keywords && (
          <meta name="keywords" content={seo.keywords.join(', ')} />
        )}
        {seo?.ogImage?.asset && (
          <meta property="og:image" content={urlFor(seo.ogImage).width(1200).height(630).url()} />
        )}
        <meta property="og:title" content={seo?.metaTitle || title} />
        <meta property="og:description" content={seo?.metaDescription || heroSection?.subtitle} />
      </Head>

      <main className={styles.storiesPage}>
        {/* Hero Section */}
        <section className={styles.heroSection} style={{
          backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : 'none'
        }}>
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>{heroSection?.title || title}</h1>
            {heroSection?.subtitle && (
              <p className={styles.heroSubtitle}>{heroSection.subtitle}</p>
            )}
            {heroSection?.ctaButton && (
              <Link
                href={heroSection.ctaLink || '#latest-stories'}
                className={styles.heroCtaButton}
              >
                {heroSection.ctaButton}
              </Link>
            )}
          </div>
        </section>

        {/* Introduction Section */}
        {introductionSection?.content && (
          <section className={styles.introductionSection}>
            {introductionSection.title && (
              <h2 className={styles.sectionTitle}>{introductionSection.title}</h2>
            )}
            <div className={styles.introductionContent}>
              <PortableText value={introductionSection.content} components={components} />
            </div>
          </section>
        )}

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className={styles.featuredStoriesSection} id="latest-stories">
            <h2 className={styles.sectionTitle}>Featured Stories</h2>
            <div className={styles.featuredStoriesGrid}>
              {featuredStories.map((story, index) => (
                index === 0 ? (
                  <FeaturedStory key={story._key || index} story={story} />
                ) : (
                  <StoryCard key={story._key || index} story={story} index={index} />
                )
              ))}
            </div>
          </section>
        )}

        {/* Video Section */}
        {videoSection?.videos?.length > 0 && (
          <section className={styles.videoSection}>
            {videoSection.title && <h2 className={styles.sectionTitle}>{videoSection.title}</h2>}
            {videoSection.description && <p className={styles.sectionDescription}>{videoSection.description}</p>}
            <div className={styles.videosGrid}>
              {videoSection.videos.map((video, index) => (
                <VideoCard key={video._key || index} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {gallerySection?.images?.length > 0 && (
          <section className={styles.gallerySection}>
            {gallerySection.title && <h2 className={styles.sectionTitle}>{gallerySection.title}</h2>}
            {gallerySection.description && <p className={styles.sectionDescription}>{gallerySection.description}</p>}
            <div className={styles.galleryGrid}>
              {gallerySection.images.map((image, index) => (
                <GalleryImage key={image._key || index} image={image} />
              ))}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {testimonialsSection?.testimonials?.length > 0 && (
          <section className={styles.testimonialsSection}>
            {testimonialsSection.title && <h2 className={styles.sectionTitle}>{testimonialsSection.title}</h2>}
            <div className={styles.testimonialsGrid}>
              {testimonialsSection.testimonials.map((testimonial, index) => (
                <Testimonial key={testimonial._key || index} testimonial={testimonial} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        {ctaSection && (
          <section className={styles.ctaSection} style={{
            backgroundImage: ctaSection.backgroundImage ? `url(${urlFor(ctaSection.backgroundImage).width(1920).height(600).url()})` : 'none'
          }}>
            <div className={styles.ctaOverlay}>
              {ctaSection.title && <h2 className={styles.ctaTitle}>{ctaSection.title}</h2>}
              {ctaSection.description && <p className={styles.ctaDescription}>{ctaSection.description}</p>}
              {ctaSection.buttonText && ctaSection.buttonLink && (
                <Link href={ctaSection.buttonLink} className={styles.ctaButton}>
                  {ctaSection.buttonText}
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const query = `*[_type == "storiesPage"][0]{
      _id,
      title,
      slug,
      heroSection {
        title,
        subtitle,
        backgroundImage {
          alt,
          asset->{
            _ref
          }
        },
        ctaButton,
        ctaLink
      },
      introductionSection {
        title,
        content[] {
          ...,
          _type == "image" => {
            ...,
            asset->{
              _ref
            }
          }
        }
      },
      featuredStories[] {
        _key,
        title,
        excerpt,
        coverImage {
          alt,
          asset->{
            _ref
          }
        },
        author,
        publishDate,
        readTime,
        category,
        content[] {
          ...,
          _type == "image" => {
            ...,
            asset->{
              _ref
            }
          },
          _type == "file" => {
            ...,
            asset->{
              _ref
            }
          }
        },
        videoUrl,
        ctaText,
        ctaLink
      },
      videoSection {
        title,
        description,
        videos[] {
          _key,
          title,
          videoUrl,
          thumbnail {
            asset->{
              _ref
            }
          },
          duration,
          description
        }
      },
      gallerySection {
        title,
        description,
        images[] {
          _key,
          alt,
          caption,
          photographer,
          asset->{
            _ref
          }
        }
      },
      testimonialsSection {
        title,
        testimonials[] {
          _key,
          quote,
          author,
          role,
          company,
          avatar {
            asset->{
              _ref
            }
          },
          rating
        }
      },
      ctaSection {
        title,
        description,
        buttonText,
        buttonLink,
        backgroundImage {
          asset->{
            _ref
          }
        }
      },
      seo {
        metaTitle,
        metaDescription,
        keywords,
        ogImage {
          asset->{
            _ref
          }
        },
        canonicalUrl,
        noIndex
      },
      publishedAt,
      updatedAt
    }`;

    const storiesPage = await client.fetch(query);

    if (!storiesPage) {
      return {
        props: {
          storiesPage: null,
          notFound: true
        }
      };
    }

    return {
      props: {
        storiesPage,
        notFound: false
      }
    };
  } catch (error) {
    console.error('Error fetching stories page:', error);
    return {
      props: {
        storiesPage: null,
        notFound: true
      }
    };
  }
}
