// components/AnimatedCounter.jsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from '../styles/EnhancedComponents.module.css';

const AnimatedCounter = ({ end, duration = 2, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let startTime = null;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      const currentValue = Math.floor(percentage * end);
      setCount(currentValue);
      
      if (percentage < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animateCount);
    
    // Animation for the container
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 }
    });
  }, [end, duration, controls]);

  return (
    <motion.div 
      className={styles.animatedCounter}
      animate={controls}
    >
      {count.toFixed(decimals)}
    </motion.div>
  );
};

export default AnimatedCounter;