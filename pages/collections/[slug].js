import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { client, fetchOptions, longCache } from '../../lib/client';
import { logger, logFetchError } from '../../lib/logger';
import { Product } from '@/components';
import FilterBar from '@/components/FilterBar';
import ActiveFilters from '@/components/ActiveFilters';

const CollectionPage = ({ products, categories }) => {
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
        <div className="collection-page-container" style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '10px' }}>{title}</h1>
            <p style={{ textAlign: 'center', marginBottom: '60px', color: '#666' }}>
                Explore our latest {title} collection
            </p>

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
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>No products found matching your filters</h3>
                    <p style={{ color: '#666', marginTop: '8px', marginBottom: '24px' }}>
                        Try adjusting your search or filter criteria
                    </p>
                    <button 
                        onClick={handleClearAll}
                        className="btn" 
                        style={{ 
                            marginTop: '20px',
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export const getServerSideProps = async () => {
    // Fetch only published products
    const productsQuery = `*[_type == "product" && status == "published"]{
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
        }
    } | order(_createdAt desc)`;

    // Fetch only categories with defined slugs
    const categoriesQuery = `*[_type == "category" && defined(slug.current)]{
        _id,
        name,
        slug
    } | order(name asc)`;

    try {
        const [products, categories] = await Promise.all([
            client.fetch(productsQuery, {}, fetchOptions(3600)),
            client.fetch(categoriesQuery, {}, longCache()),
        ]);

        logger.debug('Collection page data fetched', {
            productsCount: products?.length || 0,
            categoriesCount: categories?.length || 0,
        });

        return {
            props: {
                products: products || [],
                categories: categories || [],
            },
        };
    } catch (error) {
        logFetchError('collections:getServerSideProps', error);
        return {
            props: {
                products: [],
                categories: [],
            },
        };
    }
}

export default CollectionPage;
