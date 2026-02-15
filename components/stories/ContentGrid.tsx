// components/stories/ContentGrid.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineArrowRight } from 'react-icons/ai';
import styles from '@/styles/Stories.module.css';
import { Story } from '@/lib/storiesData';

interface ContentGridProps {
    stories: Story[];
}

const ContentGrid: React.FC<ContentGridProps> = ({ stories }) => {
    return (
        <div className={styles.gridContainer}>
            {stories.map((story) => (
                <div key={story.id} className={styles.card}>
                    <div className={styles.cardImageWrapper}>
                        <Image
                            src={story.mainImage}
                            alt={story.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className={styles.cardImage}
                        />
                        <span className={styles.cardCategory}>{story.category}</span>
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardDate}>
                            {new Date(story.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <h3 className={styles.cardTitle}>{story.title}</h3>
                        <p className={styles.cardExcerpt}>{story.excerpt}</p>
                        <div className={styles.cardFooter}>
                            <span className={styles.author}>by {story.author}</span>
                            <Link href={`/stories/${story.slug}`} className={styles.readMore}>
                                Read More <AiOutlineArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ContentGrid;
