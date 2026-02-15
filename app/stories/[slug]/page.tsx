import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { getStoryBySlug, getStories } from '@/lib/sanityStories';
import { urlFor } from '@/lib/client';
import styles from '@/styles/Stories.module.css';

// Generate static params for all stories (Optional: Remove if you want pure dynamic or keep for ISG)
export async function generateStaticParams() {
    const stories = await getStories();
    return stories.map((story) => ({
        slug: story.slug.current,
    }));
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const story = await getStoryBySlug(slug);

    if (!story) {
        notFound();
    }

    const imageUrl = story.mainImage ? urlFor(story.mainImage).url() : null;

    return (
        <div className={styles.container}>
            <article className={styles.articleContainer}>
                <Link href="/stories" className={styles.backBtn}>
                    <AiOutlineArrowLeft /> Back to Stories
                </Link>

                <header className={styles.articleHeader}>
                    <h1 className={styles.articleTitle}>{story.title}</h1>
                    <div className={styles.articleMeta}>
                        <span>{story.category || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{story.publishedAt ? new Date(story.publishedAt).toLocaleDateString() : 'Date N/A'}</span>
                        {/* Author not in current schema, hiding or adding placeholder */}
                        {/* <span>•</span> <span>By Author</span> */}
                    </div>
                </header>

                {imageUrl && (
                    <div className={styles.articleImage}>
                        <Image
                            src={imageUrl}
                            alt={story.title}
                            fill
                            sizes="100vw"
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>
                )}

                <div className={styles.articleContent}>
                    <p>{story.excerpt}</p>
                    {/* Basic body rendering or use PortableText if body is block content */}
                    {/* For now assuming simple rendering or later upgrading to PortableText */}
                    <div style={{ marginTop: '20px' }}>
                        {/* Placeholder for complex body content */}
                        <p>Read full story content...</p>
                    </div>
                </div>

                <div className={styles.shareSection}>
                    <p>Share this story:</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                        <button style={{ padding: '8px 16px', background: '#3b5998', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Facebook</button>
                        <button style={{ padding: '8px 16px', background: '#1DA1F2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Twitter</button>
                        <button style={{ padding: '8px 16px', background: '#25D366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>WhatsApp</button>
                    </div>
                </div>
            </article>
        </div>
    );
}
