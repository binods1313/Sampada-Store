// components/Footer.jsx
// Wrapper component that imports the new SampadaFooter with Sanity integration
import React, { useEffect, useState } from 'react';
import SampadaFooter, { getFooterData, get_default_footer_data } from './HomePage/SampadaFooter';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    // Show default data immediately, then fetch from Sanity
    setFooterData(get_default_footer_data());
    
    // Fetch footer data from Sanity in background
    getFooterData().then(data => {
      if (data) {
        setFooterData(data);
      }
    });
  }, []);

  return <SampadaFooter footerData={footerData} />;
};

export default Footer;
