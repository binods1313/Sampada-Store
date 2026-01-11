import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { client } from '../../lib/client';
import { Product } from '@/components';

const CollectionPage = ({ products }) => {
    const router = useRouter();
    const { slug } = router.query;
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Format slug for title
    const title = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Collection';

    useEffect(() => {
        if (products) {
            // Simple client-side filter simulation based on slug keywords
            // In a real app, this would query Sanity with specific filters
            let filtered = products;

            if (slug === 'mens-tshirts') {
                filtered = products.filter(p =>
                    p.name.toLowerCase().includes('men') ||
                    p.details?.toLowerCase().includes('men') ||
                    p.category?.includes('men')
                );
            } else if (slug === 'womens-tshirts') {
                filtered = products.filter(p =>
                    p.name.toLowerCase().includes('women') ||
                    p.details?.toLowerCase().includes('women') ||
                    p.category?.includes('women')
                );
            }

            // If filtering resulted in empty (because data might be sparse), just show all for demo
            // or show empty state.
            // For now, let's just show all products if filter is too aggressive, or keep it empty to be realistic.
            // Actually, better to show *something* so user sees the page works.
            setFilteredProducts(filtered.length > 0 ? filtered : products);
        }
    }, [slug, products]);

    return (
        <div className="collection-page-container" style={{ padding: '60px 20px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', fontSize: '40px', marginBottom: '10px' }}>{title}</h1>
            <p style={{ textAlign: 'center', marginBottom: '60px', color: '#666' }}>
                Explore our latest {title} collection
            </p>

            {filteredProducts.length > 0 ? (
                <div className="products-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                    {filteredProducts.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>No products found in this collection (yet!)</h3>
                    <Link href="/">
                        <button className="btn" style={{ marginTop: '20px' }}>Continue Shopping</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export const getServerSideProps = async () => {
    // Fetch all products to filter client-side for this demo page
    const query = '*[_type == "product"]';
    const products = await client.fetch(query);

    return {
        props: { products }
    }
}

export default CollectionPage;
