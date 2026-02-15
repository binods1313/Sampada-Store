// components/stories/Hero.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Stories.module.css';
import { Story } from '@/lib/storiesData';

interface HeroProps {
    story: Story;
}

const Hero: React.FC<HeroProps> = ({ story }) => {
    return (
        <section className={styles.hero}>
            <Image
                src={story.mainImage}
                alt={story.title}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                className={styles.heroImage}
                priority
            />
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
                <span className={styles.cardCategory} style={{ position: 'relative', display: 'inline-block', marginBottom: '15px', left: 0, top: 0 }}>
                    {story.category}
                </span>
                <h1 className={styles.heroTitle}>{story.title}</h1>
                <p className={styles.heroExcerpt}>{story.excerpt}</p>
                <Link href={`/stories/${story.slug}`} className={styles.btnHero}>
                    Read Feature
                </Link>
            </div>
        </section>
    );
};

export default Hero;
