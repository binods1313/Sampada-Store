// components/ProductTabs.jsx
import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';
import styles from './ProductTabs.module.css';

const ProductTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={styles.tabsContainer}>
      {/* Tab Headers */}
      <div className={styles.tabHeaders}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabHeader} ${activeTab === index ? styles.active : ''}`}
            onClick={() => setActiveTab(index)}
            aria-selected={activeTab === index}
            role="tab"
          >
            {tab.tabIcon && <span className={styles.tabIcon}>{tab.tabIcon}</span>}
            <span className={styles.tabTitle}>{tab.tabTitle}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent} role="tabpanel">
        {tabs[activeTab]?.tabContent && (
          <div className={styles.contentWrapper}>
            <PortableText value={tabs[activeTab].tabContent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
