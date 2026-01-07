// components/ProductCarousel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Product from './Product';
import styles from '../styles/EnhancedComponents.module.css';

const ProductCarousel = ({ 
  products = [], 
  autoplay = false, 
  interval = 5000, 
  showControls = true, 
  showDots = true,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  variant = 'default'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Get items per view based on screen size (simplified for this example)
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return itemsPerView.desktop || 3;
      if (window.innerWidth >= 768) return itemsPerView.tablet || 2;
      return itemsPerView.mobile || 1;
    }
    return itemsPerView.desktop || 3;
  };

  const itemsPerViewCount = getItemsPerView();
  const totalGroups = Math.ceil(products.length / itemsPerViewCount);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalGroups);
  }, [totalGroups]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalGroups) % totalGroups);
  }, [totalGroups]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || totalGroups <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, nextSlide, totalGroups]);

  // Get products for current slide
  const getCurrentProducts = () => {
    const startIndex = currentIndex * itemsPerViewCount;
    const endIndex = startIndex + itemsPerViewCount;
    return products.slice(startIndex, endIndex);
  };

  if (!products.length) {
    return <div className={`${styles.productCarouselPlaceholder}`}>No products to display</div>;
  }

  const currentProducts = getCurrentProducts();
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className={`${styles.productCarousel} ${styles[variant]}`}>
      {showControls && totalGroups > 1 && (
        <>
          <button 
            className={`${styles.carouselBtn} ${styles.prevBtn}`} 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            &lt;
          </button>
          <button 
            className={`${styles.carouselBtn} ${styles.nextBtn}`} 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            &gt;
          </button>
        </>
      )}

      <div className={styles.carouselWrapper}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                nextSlide();
              } else if (swipe > swipeConfidenceThreshold) {
                prevSlide();
              }
            }}
            className={styles.carouselSlide}
          >
            <div className={styles.productsGrid}>
              {currentProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {showDots && totalGroups > 1 && (
        <div className={styles.carouselDots}>
          {Array.from({ length: totalGroups }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;