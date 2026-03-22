// components/HomePage/FeaturedProductsSection.jsx
import React from 'react';
import Product from '../Product';
import styles from './FeaturedProductsSection.module.css';

const FeaturedProductsSection = ({ products = [] }) => {
  // Show up to 12 products
  const displayProducts = products.slice(0, 12);

  return (
    <section className={styles.section}>
      <div className={styles.headingWrapper}>
        <h2 className={styles.heading}>Featured Products</h2>
        <p className={styles.subheading}>
          🌟 Sampada Originals™ – Premium items for every style 🌟
        </p>
      </div>

      {displayProducts.length > 0 ? (
        <div className={styles.grid}>
          {displayProducts.map((product, index) => (
            <Product
              key={product._id}
              product={product}
              isLoading={false}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Products are loading from our store…</p>
        </div>
      )}
    </section>
  );
};

export default FeaturedProductsSection;
