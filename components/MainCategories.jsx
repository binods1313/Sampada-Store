import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/MainCategories.module.css';

const categories = [
    {
        id: 'men',
        title: "Men's Clothing",
        image: '/assets/categories/mens_category.png',
        link: '/collections/mens-clothing',
        subcategories: ['Sweatshirts', 'Hoodies', 'T-shirts', 'Long Sleeves', 'Tank Tops', 'Sportswear', 'Bottoms', 'Swimwear', 'Shoes', 'Outerwear']
    },
    {
        id: 'women',
        title: "Women's Clothing",
        image: '/assets/categories/womens_category.png',
        link: '/collections/womens-clothing',
        subcategories: ['Sweatshirts', 'T-shirts', 'Hoodies', 'Long Sleeves', 'Tank Tops', 'Skirts & Dresses', 'Sportswear', 'Bottoms', 'Swimwear', 'Shoes', 'Outerwear']
    },
    {
        id: 'his-hers',
        title: "His & Hers",
        image: '/assets/categories/his_hers_vertical.jpg',
        link: '/collections/his-hers',
        subcategories: ['Casuals - Fixed Designs', 'Customized - Personalized']
    },
    {
        id: 'home',
        title: "Home & Living",
        image: '/assets/categories/home_category.png',
        link: '/collections/home-living',
        subcategories: ['Mugs', 'Candles', 'Decor', 'Seasonal', 'Glassware', 'Bottles', 'Canvas', 'Posters', 'Blankets', 'Pillows', 'Towels', 'Rugs', 'Bedding']
    }
];

const MainCategories = () => {
    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>Explore Our Collections</h2>
            <div className={styles.grid}>
                {categories.map((cat) => (
                    <Link href={cat.link} key={cat.id} className={styles.detailsLink}>
                        <div className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {/* Fallback to placeholder if image load fails or uses Next/Image */}
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                    className={styles.image}
                                // Use a blur placeholder or fallback if needed
                                />
                            </div>
                            <div className={styles.overlay}>
                                <h3 className={styles.title}>{cat.title}</h3>
                                <div className={styles.subcategories}>
                                    {cat.subcategories.slice(0, 8).map((sub, idx) => (
                                        <span key={idx} className={styles.tag}>{sub}</span>
                                    ))}
                                    {cat.subcategories.length > 8 && <span className={styles.tag}>+more</span>}
                                </div>
                                <span className={styles.cta}>
                                    {cat.id === 'his-hers' ? 'Shop His & Hers' : `Shop ${cat.title.split(' ')[0]}`}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default MainCategories;
