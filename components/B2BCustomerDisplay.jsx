// components/B2BCustomerDisplay.jsx
// Display company logo and info for B2B customers using Clearbit
// Features: Auto-detect company from email, show logo, company details

import React, { useState, useEffect } from 'react';
import { getCompanyLogo, getCompanyInfo, getDomainFromEmail, isClearbitConfigured } from '../utils/clearbit';

export default function B2BCustomerDisplay({ email, className = '', showDetails = true }) {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      setCompanyInfo(null);
      setLogoUrl(null);
      return;
    }

    const domain = getDomainFromEmail(email);
    if (!domain) {
      setError('Invalid email address');
      return;
    }

    // Skip common free email providers
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    if (freeProviders.includes(domain.toLowerCase())) {
      setError(null);
      setCompanyInfo(null);
      setLogoUrl(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Get logo (always available, no API key needed)
    const logo = getCompanyLogo(domain);
    setLogoUrl(logo);

    // Get company info (requires API key)
    if (isClearbitConfigured()) {
      getCompanyInfo(domain)
        .then(info => {
          setCompanyInfo(info);
          setLoading(false);
        })
        .catch(err => {
          console.warn('Company lookup failed:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [email]);

  // Show nothing for free email providers or no email
  if (!email || (!companyInfo && !logoUrl)) {
    return null;
  }

  // Extract company name from email if no info
  const domain = getDomainFromEmail(email);
  const companyName = companyInfo?.name || domain?.split('.')[0]?.charAt(0).toUpperCase() + domain?.split('.')[0]?.slice(1) || 'Company';

  return (
    <div className={`b2b-customer-display ${className}`}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB'
      }}>
        {/* Company Logo */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px solid #D1D5DB'
        }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '4px'
              }}
              onError={(e) => {
                // Fallback to initials
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{
            display: logoUrl ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '18px'
          }}>
            {companyName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Company Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: '#3B82F6',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              B2B
            </span>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1F2937',
              margin: 0
            }}>
              {companyName}
            </h4>
          </div>

          {showDetails && companyInfo && (
            <div style={{ marginTop: '4px' }}>
              {companyInfo.industry && (
                <p style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  margin: '2px 0'
                }}>
                  {companyInfo.industry}
                </p>
              )}
              {companyInfo.employees && (
                <p style={{
                  fontSize: '11px',
                  color: '#9CA3AF',
                  margin: '2px 0'
                }}>
                  {companyInfo.employees.toLocaleString()} employees
                </p>
              )}
              {companyInfo.location && (
                <p style={{
                  fontSize: '11px',
                  color: '#9CA3AF',
                  margin: '2px 0'
                }}>
                  {companyInfo.location}
                </p>
              )}
            </div>
          )}

          {!companyInfo && domain && (
            <p style={{
              fontSize: '12px',
              color: '#9CA3AF',
              margin: '4px 0 0 0'
            }}>
              {domain}
            </p>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ marginLeft: 'auto' }}>
            <svg className="animate-spin" style={{ width: '16px', height: '16px', color: '#6B7280' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
