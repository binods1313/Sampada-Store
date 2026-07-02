// components/Product/SizeGuideModal.jsx
// Modal for displaying size chart image
import React from 'react';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { urlFor } from '../../lib/client';

const SizeGuideModal = ({ isOpen, onClose, sizeChart, productName }) => {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}
      >
        {/* Modal Content */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '2px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            background: '#ffffff',
            zIndex: 1
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0
            }}>
              📏 Size Guide
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: '#f5f5f5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8B1A1A';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.color = '#1a1a1a';
              }}
              aria-label="Close size guide"
            >
              <IoClose size={24} />
            </button>
          </div>
          
          {/* Size Chart Image */}
          <div style={{ padding: '24px' }}>
            {sizeChart && sizeChart.asset ? (
              <div style={{
                position: 'relative',
                width: '100%',
                minHeight: '400px',
                background: '#f9f9f9',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <Image
                  src={urlFor(sizeChart).width(900).url()}
                  alt={`Size guide for ${productName}`}
                  width={900}
                  height={600}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.error('Size chart image failed to load');
                    e.target.src = '/asset/placeholder-image.jpg';
                  }}
                />
              </div>
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                background: '#f9f9f9',
                borderRadius: '8px',
                color: '#666'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                  📏 Size chart not available
                </p>
                <p style={{ fontSize: '14px' }}>
                  Please contact us for sizing information
                </p>
              </div>
            )}
            
            {/* Measurement Tips */}
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'rgba(201, 168, 76, 0.08)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '12px'
              }}>
                💡 Measurement Tips
              </h3>
              <ul style={{
                fontSize: '14px',
                color: '#555',
                lineHeight: '1.8',
                paddingLeft: '20px',
                margin: 0
              }}>
                <li>Measure yourself in your undergarments for the most accurate fit</li>
                <li>Use a soft measuring tape and keep it parallel to the floor</li>
                <li>If you're between sizes, we recommend sizing up for a more comfortable fit</li>
                <li>All measurements are in inches unless otherwise specified</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default SizeGuideModal;
