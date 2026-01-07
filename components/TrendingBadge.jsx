// components/TrendingBadge.jsx
import React from 'react';
import styles from '../styles/EnhancedComponents.module.css';

const TrendingBadge = ({ type, value }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'trending':
        return `${styles.trendingBadge} ${styles.trending}`;
      case 'sale':
        return `${styles.trendingBadge} ${styles.sale}`;
      case 'new':
        return `${styles.trendingBadge} ${styles.new}`;
      case 'popular':
        return `${styles.trendingBadge} ${styles.popular}`;
      default:
        return styles.trendingBadge;
    }
  };

  const getBadgeIcon = () => {
    switch (type) {
      case 'trending':
        return '🔥';
      case 'sale':
        return '🏷️';
      case 'new':
        return '✨';
      case 'popular':
        return '⭐';
      default:
        return '🔖';
    }
  };

  return (
    <div className={getBadgeStyle()}>
      <span className={styles.badgeIcon}>{getBadgeIcon()}</span>
      <span className={styles.badgeText}>{value}</span>
    </div>
  );
};

export default TrendingBadge;