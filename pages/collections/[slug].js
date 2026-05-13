import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { client, fetchOptions, longCache } from '../../lib/client';
import { logger, logFetchError } from '../../lib/logger';
import Product from '../../components/Product';
import FilterBar from '@/components/FilterBar';
import ActiveFilters from '@/components/ActiveFilters';

const CollectionPage = ({ products, categories, banner }) => {
    const router = useRouter();
    const { slug } = router.query;
    
    // Filter state
    const [filters, setFilters] = useState({
        searchQuery: '',
        selectedCategory: '',
        priceRange: [0, 500],
        minDiscount: 0,
        sortBy: 'newest'
    });

    // Format slug for title
    const title = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Collection';

    // Helper function to get collection quote
    const getCollectionQuote = (collectionName, quotes) => {
        if (!quotes) return 'Crafted for You, Printed to Perfection.';
        const name = collectionName.toLowerCase();
        if (name.includes('men') && !name.includes('women')) {
            return quotes.mensQuote || 'Crafted for You, Printed to Perfection.';
        }
        if (name.includes('women')) {
            return quotes.womensQuote || 'Crafted for You, Printed to Perfection.';
        }
        if (name.includes('his') || name.includes('hers')) {
            return quotes.hisHersQuote || 'Crafted for You, Printed to Perfection.';
        }
        return 'Crafted for You, Printed to Perfection.';
    };

    // Handle filter changes from FilterBar component
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    // Remove a specific filter
    const handleRemoveFilter = (filterId) => {
        setFilters(prev => {
            switch (filterId) {
                case 'search':
                    return { ...prev, searchQuery: '' };
                case 'category':
                    return { ...prev, selectedCategory: '' };
                case 'price':
                    return { ...prev, priceRange: [0, 500] };
                case 'discount':
                    return { ...prev, minDiscount: 0 };
                default:
                    return prev;
            }
        });
    };

    // Clear all filters
    const handleClearAll = () => {
        setFilters({
            searchQuery: '',
            selectedCategory: '',
            priceRange: [0, 500],
            minDiscount: 0,
            sortBy: 'newest'
        });
    };

    // Filter and sort products based on applied filters
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // Filter by collection slug (if applicable)
        if (slug === 'mens-tshirts') {
            result = result.filter(p =>
                p.name?.toLowerCase().includes('men') ||
                p.details?.toLowerCase().includes('men') ||
                p.category?.name?.toLowerCase().includes('men')
            );
        } else if (slug === 'womens-tshirts') {
            result = result.filter(p =>
                p.name?.toLowerCase().includes('women') ||
                p.details?.toLowerCase().includes('women') ||
                p.category?.name?.toLowerCase().includes('women')
            );
        }

        // Filter by search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name?.toLowerCase().includes(query) ||
                p.details?.toLowerCase().includes(query) ||
                p.category?.name?.toLowerCase().includes(query) ||
                (p.keywords && p.keywords.some(k => k.toLowerCase().includes(query)))
            );
        }

        // Filter by category
        if (filters.selectedCategory) {
            result = result.filter(p =>
                p.category?.slug?.current === filters.selectedCategory ||
                p.category?.name?.toLowerCase() === filters.selectedCategory.toLowerCase()
            );
        }

        // Filter by price range
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
            result = result.filter(p => {
                const price = p.price || 0;
                const discount = p.discount || 0;
                const finalPrice = price * (1 - (discount / 100));
                return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
            });
        }

        // Filter by minimum discount
        if (filters.minDiscount > 0) {
            result = result.filter(p => (p.discount || 0) >= filters.minDiscount);
        }

        // Sort products
        switch (filters.sortBy) {
            case 'price-asc':
                result.sort((a, b) => {
                    const priceA = (a.price || 0) * (1 - ((a.discount || 0) / 100));
                    const priceB = (b.price || 0) * (1 - ((b.discount || 0) / 100));
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                result.sort((a, b) => {
                    const priceA = (a.price || 0) * (1 - ((a.discount || 0) / 100));
                    const priceB = (b.price || 0) * (1 - ((b.discount || 0) / 100));
                    return priceB - priceA;
                });
                break;
            case 'discount':
                result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                break;
            case 'newest':
            default:
                // Sort by _id (newest first, assuming Sanity returns in creation order)
                result.sort((a, b) => {
                    const dateA = new Date(a._createdAt || 0);
                    const dateB = new Date(b._createdAt || 0);
                    return dateB - dateA;
                });
                break;
        }

        return result;
    }, [products, slug, filters]);

    return (
        <>
            {/* Collection Quote Section */}
            {banner?.collectionQuote && (
                <section className="section-light s-section" style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'var(--s-cream)',
                    borderBottom: '1px solid rgba(139,26,26,0.1)'
                }}>
                    <div className="s-container" style={{ maxWidth: '800px' }}>
                        <p style={{
                            fontFamily: 'var(--s-serif)',
                            fontSize: '1.8rem',
                            fontStyle: 'italic',
                            color: 'var(--s-crimson)',
                            lineHeight: '1.4',
                            margin: 0
                        }}>
                            "{getCollectionQuote(title, banner.collectionQuote)}"
                        </p>
                    </div>
                </section>
            )}

            <div className="section-light" style={{ minHeight: '100vh', padding: '80px 0' }}>
                <div className="s-container" style={{ maxWidth: '1400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <p className="s-label">COLLECTION</p>
                        <h1 className="s-heading" style={{ fontSize: '2.5rem' }}>{title}</h1>
                        <span className="s-bar" />
                        <p style={{ color: 'var(--s-text-body)', fontSize: '1rem', marginTop: '24px' }}>
                            Explore our latest {title} collection
                        </p>
                    </div>

                {/* FilterBar Component */}
                <FilterBar
                    categories={categories}
                    onFilterChange={handleFilterChange}
                    totalProducts={filteredAndSortedProducts.length}
                />

                {/* ActiveFilters Component */}
                <ActiveFilters
                    filters={filters}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAll}
                />

                {filteredAndSortedProducts.length > 0 ? (
                    <div className="products-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                        {filteredAndSortedProducts.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '80px 20px',
                        background: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid rgba(139,26,26,0.12)',
                        boxShadow: '0 2px 12px rgba(139,26,26,0.05)'
                    }}>
                        <h3 style={{ fontFamily: 'var(--s-serif)', fontSize: '1.5rem', color: 'var(--s-text-heading)', marginBottom: '8px' }}>
                            No products found matching your filters
                        </h3>
                        <p style={{ color: 'var(--s-text-body)', marginTop: '8px', marginBottom: '24px' }}>
                            Try adjusting your search or filter criteria
                        </p>
                        <button 
                            onClick={handleClearAll}
                            className="btn-cta-primary"
                        >
                            Clear All Filters <span className="arrow">→</span>
                        </button>
                    </div>
                )}
                </div>
            </div>
        </>
    );
};

export const getServerSideProps = async () => {
    // Fetch only published products with printifyIntegration
    const productsQuery = `*[_type == "product" && status in ["published", "active"]]{
        _id,
        _createdAt,
        name,
        slug,
        price,
        discount,
        image,
        details,
        category->{
            _id,
            name,
            slug
        },
        printifyIntegration
    } | order(_createdAt desc)`;

    // Fetch only categories with defined slugs
    const categoriesQuery = `*[_type == "category" && defined(slug.current)]{
        _id,
        name,
        slug
    } | order(name asc)`;

    // Fetch banner data for quotes
    const bannerQuery = `*[_type == "banner"][0]{
        collectionQuote
    }`;

    try {
        const [products, categories, banner] = await Promise.all([
            client.fetch(productsQuery, {}, fetchOptions(3600)),
            client.fetch(categoriesQuery, {}, longCache()),
            client.fetch(bannerQuery, {}, longCache()),
        ]);

        logger.debug('Collection page data fetched', {
            productsCount: products?.length || 0,
            categoriesCount: categories?.length || 0,
        });

        return {
            props: {
                products: products || [],
                categories: categories || [],
                banner: banner || null,
            },
        };
    } catch (error) {
        logFetchError('collections:getServerSideProps', error);
        return {
            props: {
                products: [],
                categories: [],
                banner: null,
            },
        };
    }
}

export default CollectionPage;
