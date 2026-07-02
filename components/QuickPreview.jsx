// components/QuickPreview.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '../lib/client';
import styles from '../styles/EnhancedComponents.module.css';

const QuickPreview = ({ product, onClose }) => {
  if (!product) return null;

  const firstImage = product.image && product.image[0] ? product.image[0] : null;
  const imageUrl = firstImage?.asset
    ? urlFor(firstImage).width(600).url()
    : '/asset/placeholder-image.jpg';

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount 
    ? product.price * (1 - (product.discount / 100)) 
    : product.price;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.quickPreviewOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={styles.quickPreviewModal}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose}>×</button>
          
          <div className={styles.quickPreviewContent}>
            <div className={styles.quickPreviewImage}>
              <Image
                src={imageUrl}
                alt={product.name}
                width={300}
                height={300}
                style={{ objectFit: 'contain' }}
              />
              {hasDiscount && (
                <div className={styles.discountBadge}>{product.discount}% OFF</div>
              )}
            </div>
            
            <div className={styles.quickPreviewInfo}>
              <h3>{product.name}</h3>
              <div className={styles.priceSection}>
                {hasDiscount ? (
                  <>
                    <span className={styles.discountedPrice}>${discountedPrice?.toFixed(2)}</span>
                    <span className={styles.originalPrice}>${product.price?.toFixed(2)}</span>
                  </>
                ) : (
                  <span className={styles.price}>${product.price?.toFixed(2)}</span>
                )}
              </div>
              
              {product.details && (
                <p className={styles.productDetails}>{product.details.substring(0, 150)}...</p>
              )}
              
              <div className={styles.quickPreviewActions}>
                <button className={styles.addToCartBtn}>Add to Cart</button>
                <button className={styles.viewDetailsBtn}>View Details</button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickPreview;