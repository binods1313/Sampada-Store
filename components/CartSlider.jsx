// components/CartSlider.jsx
import React from 'react';
import dynamic from 'next/dynamic';

const Cart = dynamic(() => import('./Cart'), { 
  ssr: false, 
  loading: () => <p>Loading cart...</p>,
});

const CartSlider = ({ isOpen }) => (
  <div
    className={`cart-slider ${isOpen ? 'cart-slider-open' : ''}`}
    aria-hidden={!isOpen}
  >
    <Cart />
  </div>
);

export default CartSlider;
