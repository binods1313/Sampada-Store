'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './templates.module.css';

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail: string;
}

const CATEGORIES = ['All', 'Minimal', 'Bohemian', 'Sports', 'Seasonal'];

export default function TemplatesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchTemplates();
    }, []);

    async function fetchTemplates() {
        try {
            const res = await fetch('/api/templates');
            if (res.ok) {
                const data = await res.json();
                setTemplates(data.templates || []);
            }
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredTemplates = activeCategory === 'All'
        ? templates
        : templates.filter(t => t.category.toLowerCase() === activeCategory.toLowerCase());

    const handleUseTemplate = async (templateId: string) => {
        if (!session?.user) {
            router.push('/api/auth/signin?callbackUrl=/designer/templates');
            return;
        }
        // Navigate to designer with template
        router.push(`/designer?template=${templateId}`);
    };

    // Sample templates for demo
    const sampleTemplates: Template[] = [
        {
            id: '1',
            name: 'Clean Minimal',
            description: 'Simple and elegant design with clean lines',
            category: 'minimal',
            thumbnail: '/images/templates/minimal-1.png',
        },
        {
            id: '2',
            name: 'Bold Typography',
            description: 'Make a statement with bold text',
            category: 'minimal',
            thumbnail: '/images/templates/minimal-2.png',
        },
        {
            id: '3',
            name: 'Boho Floral',
            description: 'Beautiful bohemian floral patterns',
            category: 'bohemian',
            thumbnail: '/images/templates/boho-1.png',
        },
        {
            id: '4',
            name: 'Sports Champion',
            description: 'Perfect for sports teams and athletes',
            category: 'sports',
            thumbnail: '/images/templates/sports-1.png',
        },
        {
            id: '5',
            name: 'Summer Vibes',
            description: 'Bright and cheerful summer designs',
            category: 'seasonal',
            thumbnail: '/images/templates/summer-1.png',
        },
        {
            id: '6',
            name: 'Holiday Spirit',
            description: 'Festive designs for the holiday season',
            category: 'seasonal',
            thumbnail: '/images/templates/holiday-1.png',
        },
    ];

    const displayTemplates = templates.length > 0 ? filteredTemplates :
        (activeCategory === 'All' ? sampleTemplates :
            sampleTemplates.filter(t => t.category.toLowerCase() === activeCategory.toLowerCase()));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Design Templates</h1>
                <p>Start with a professionally designed template and make it your own</p>
            </div>

            <div className={styles.categories}>
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading templates...</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {displayTemplates.map((template) => (
                        <div key={template.id} className={styles.card}>
                            <div className={styles.thumbnail}>
                                <div className={styles.placeholderImage}>
                                    <span>👕</span>
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <h3>{template.name}</h3>
                                <p>{template.description}</p>
                                <span className={styles.category}>{template.category}</span>
                            </div>
                            <button
                                className={styles.useBtn}
                                onClick={() => handleUseTemplate(template.id)}
                            >
                                Use Template
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && displayTemplates.length === 0 && (
                <div className={styles.empty}>
                    <p>No templates found for this category.</p>
                </div>
            )}

            <div className={styles.startFresh}>
                <h3>Want to start from scratch?</h3>
                <p>Create your own unique design with our powerful design tools</p>
                <button
                    className={styles.createBtn}
                    onClick={() => router.push('/designer')}
                >
                    Create New Design
                </button>
            </div>
        </div>
    );
}
