import React from 'react';
import styles from '../../styles/SampadaMedallion.module.css';

/**
 * SampadaMedallion
 * 
 * A reusable medallion component with a rotating outer dashed ring 
 * and a stationary central logo.
 * 
 * @param {number} size - The size of the medallion in pixels
 * @param {string} alt - Alt text for the logo image
 */
export default function SampadaMedallion({ size = 272, alt = 'Sampada logo' }) {
  const px = `${size}px`;
  
  // NOTE: Using /images/Logo_4.png as a fallback since Sampada_Logo_2.png was not found
  const logoPath = "/images/Logo_4.png";

  return (
    <div className={styles.wrapper} style={{ width: px, height: px }}>
      <div className={styles.rotatingRing} aria-hidden="true" />
      <div className={styles.medallion}>
        <img src={logoPath} alt={alt} className={styles.logo} />
      </div>
    </div>
  );
}
