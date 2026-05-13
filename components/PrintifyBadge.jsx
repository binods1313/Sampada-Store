// components/PrintifyBadge.jsx
import React from 'react';
import styles from './PrintifyBadge.module.css';

const PrintifyBadge = ({ printifyIntegration, variant = 'default' }) => {
  if (!printifyIntegration?.isPrintifyProduct) {
    return null;
  }

  const { printProviderName, printifyShipping } = printifyIntegration;

  if (variant === 'inline') {
    return (
      <div className={styles.inlineBadge}>
        <span className={styles.icon}>🖨️</span>
        <span className={styles.text}>Printed by {printProviderName || 'Printify'}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={styles.detailedBadge}>
        <div className={styles.header}>
          <span className={styles.icon}>🖨️</span>
          <h4 className={styles.title}>Print-on-Demand Fulfillment</h4>
        </div>
        <div className={styles.content}>
          <p className={styles.provider}>
            <strong>Printed by:</strong> {printProviderName || 'Printify'}
          </p>
          {printifyShipping && (
            <p className={styles.shipping}>
              <strong>Shipping:</strong> {printifyShipping}
            </p>
          )}
          <p className={styles.note}>
            This product is made-to-order, ensuring quality and reducing waste.
          </p>
        </div>
      </div>
    );
  }

  // Default badge
  return (
    <div className={styles.badge}>
      <span className={styles.icon}>🖨️</span>
      <div className={styles.info}>
        <span className={styles.label}>Printed by Printify</span>
        <span className={styles.sublabel}>Made-to-order quality</span>
      </div>
    </div>
  );
};

export default PrintifyBadge;
