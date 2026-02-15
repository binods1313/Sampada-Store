'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Hero from '@/components/stories/Hero';
import FilterBar from '@/components/stories/FilterBar';
import ContentGrid from '@/components/stories/ContentGrid';
import { getStories } from '@/lib/sanityStories';
import { urlFor } from '@/lib/client';
import { Story } from '@/lib/storiesData'; // Import shared type
import styles from '@/styles/Stories.module.css';

// Pre-defined categories for the filter bar
const filterCategories = [
    'All',
    'Fashion',
    'Trends',
    'Behind-the-Scenes',
    'Product Stories',
];

export default function StoriesPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const fetchedStories = await getStories();

                // Transform Sanity data to match component expectations
                const transformedStories = fetchedStories.map(story => ({
                    id: story._id,
                    title: story.title,
                    slug: story.slug.current,
                    excerpt: story.excerpt,
                    mainImage: story.mainImage ? urlFor(story.mainImage).url() : '/assets/categories/default_story.png',
                    category: story.category || 'Uncategorized', // Handle missing categories
                    isFeatured: story.isFeatured,
                    publishedAt: story.publishedAt,
                    author: story.author || 'Sampada Team'
                }));

                setStories(transformedStories);
            } catch (error) {
                console.error("Failed to fetch stories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    // Find Featured Story
    const featuredStory = useMemo(() => {
        return stories.find(s => s.isFeatured) || stories[0];
    }, [stories]);

    // Filter Logic
    const filteredStories = useMemo(() => {
        return stories.filter(story => {
            const matchesCategory = activeCategory === 'All' || story.category === activeCategory;
            const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (story.excerpt && story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [stories, activeCategory, searchQuery]);

    // Exclude featured from grid using the filtered list
    const displayStories = useMemo(() => {
        if (!featuredStory) return filteredStories;

        if (activeCategory === 'All' && !searchQuery) {
            return filteredStories.filter(s => s.id !== featuredStory.id);
        }
        return filteredStories;
    }, [filteredStories, activeCategory, searchQuery, featuredStory]);

    if (loading) {
        return <div className={styles.container} style={{ textAlign: 'center', padding: '100px' }}>Loading stories...</div>;
    }

    return (
        <div className={styles.container}>
            {featuredStory && <Hero story={featuredStory} />}

            <FilterBar
                categories={filterCategories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                onSearch={setSearchQuery}
            />

            <ContentGrid stories={displayStories} />

            {displayStories.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
                    <h3>No stories found matching your criteria.</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
