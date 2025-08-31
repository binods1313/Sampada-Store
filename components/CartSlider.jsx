// components/CartSlider.jsx
import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Cart = dynamic(() => import('./Cart'), { 
  ssr: false, 
  loading: () => <p>Loading cart...</p>, // Fallback UI
});

const CartSlider = ({ isOpen }) => (
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: isOpen ? 0 : '100%' }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="cart-slider"
    aria-hidden={!isOpen} // Accessibility improvement
  >
    <Cart /> {/* Render the Cart component */}
  </motion.div>
);

export default CartSlider;
