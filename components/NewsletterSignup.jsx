// components/NewsletterSignup.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/EnhancedComponents.module.css';

const NewsletterSignup = ({ onClose, incentive = "Join our newsletter!" }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.newsletterOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={styles.newsletterModal}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose}>×</button>
          
          {!isSubmitted ? (
            <div className={styles.newsletterContent}>
              <h3>Stay in the Loop</h3>
              <p className={styles.incentive}>{incentive}</p>
              
              <form onSubmit={handleSubmit} className={styles.newsletterForm}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={styles.emailInput}
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={styles.subscribeBtn}
                >
                  {isSubmitting ? 'Submitting...' : 'Subscribe'}
                </button>
              </form>
              
              <p className={styles.privacyNote}>
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          ) : (
            <div className={styles.successContent}>
              <div className={styles.successIcon}>✓</div>
              <h3>Thank You!</h3>
              <p>You've been subscribed to our newsletter.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewsletterSignup;