/**
 * Pretext Features Demo Page
 * 
 * Showcase all Pretext capabilities in one place
 * Visit: /pretext-demo
 */

'use client';

import React, { useState } from 'react';
import { useTextHeight, useDebouncedTextHeight, useProductCardMeasurements } from '@/hooks/usePretext';
import { calculateBalancedLines, calculateReadingTime, BalancedText } from '@/utils/balancedText';
import EditorialLayout from '@/components/EditorialLayout';
import VirtualProductList from '@/components/VirtualProductList';

const DEMO_TEXT = `
Sampada Store brings you the finest collection of premium products, carefully curated to match your lifestyle. 
Our commitment to quality and excellence ensures that every purchase is an investment in timeless elegance.
`;

const LONG_TEXT = `
The TerraVive collection represents the pinnacle of sustainable fashion. Crafted from organic cotton and dyed with 
natural, eco-friendly pigments, each piece tells a story of environmental consciousness meeting modern design. The 
earthy tones draw inspiration from nature's palette - rich terracotta, deep forest green, and warm sand beige. 

Our artisans use traditional techniques passed down through generations, ensuring that every stitch reflects decades 
of expertise. The result is a garment that not only looks exceptional but also feels incredibly comfortable against 
your skin. Whether you're exploring urban landscapes or seeking tranquility in nature, TerraVive adapts to your 
lifestyle with effortless grace.

The attention to detail is remarkable - from the reinforced seams that promise durability to the thoughtfully placed 
pockets that combine form and function. This is more than just clothing; it's a statement about your values and your 
appreciation for craftsmanship that stands the test of time.
`;

export default function PretextDemoPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'product-card', label: 'Product Card' },
    { id: 'chat', label: 'AI Chat' },
    { id: 'balanced', label: 'Balanced Text' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'virtual', label: 'Virtual List' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px' }}>
          🔤 Pretext Features Demo
        </h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          High-performance text layout engine - 300-600× faster than DOM measurement
        </p>
      </header>

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '16px',
        background: '#f5f5f5',
        borderRadius: '12px',
      }}>
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSection === section.id ? '#C9A227' : 'white',
              color: activeSection === section.id ? 'white' : '#333',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeSection !== section.id) {
                e.currentTarget.style.background = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== section.id) {
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Sections */}
      {activeSection === 'overview' && (
        <OverviewSection />
      )}

      {activeSection === 'product-card' && (
        <ProductCardDemo />
      )}

      {activeSection === 'chat' && (
        <ChatDemo />
      )}

      {activeSection === 'balanced' && (
        <BalancedTextDemo />
      )}

      {activeSection === 'editorial' && (
        <EditorialDemo />
      )}

      {activeSection === 'virtual' && (
        <VirtualListDemo />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '64px',
        padding: '32px',
        background: '#f5f5f5',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <h3 style={{ marginBottom: '16px' }}>📚 Documentation</h3>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          See <code style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: '4px' }}>docs/PRETEXT_INTEGRATION.md</code> for complete API reference
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a
            href="https://github.com/chenglou/pretext"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#C9A227', textDecoration: 'none', fontWeight: '600' }}
          >
            GitHub
          </a>
          <a
            href="https://pretext.wiki/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#C9A227', textDecoration: 'none', fontWeight: '600' }}
          >
            pretext.wiki
          </a>
        </div>
      </footer>
    </div>
  );
}

function OverviewSection() {
  const readingTime = calculateReadingTime(LONG_TEXT);

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '16px' }}>⚡ Performance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <StatCard label="Speed Improvement" value="300-600×" />
          <StatCard label="Layout Reflows" value="Zero" />
          <StatCard label="Package Size" value="15KB" />
        </div>
      </div>

      <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '16px' }}>📏 Reading Time Calculation</h2>
        <p style={{ marginBottom: '16px' }}>
          <strong>Text:</strong> {LONG_TEXT.length} characters, {readingTime.words} words
        </p>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#C9A227' }}>
          ⏱️ {readingTime.text}
        </div>
      </div>

      <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '16px' }}>🎯 Use Cases</h2>
        <ul style={{ lineHeight: '2', color: '#666' }}>
          <li>✅ Product Cards - Zero layout shift</li>
          <li>✅ AI Chat - 60fps streaming</li>
          <li>✅ Virtual Lists - Accurate row heights</li>
          <li>✅ Editorial Layouts - Text flow around images</li>
          <li>✅ Balanced Text - Professional typesetting</li>
        </ul>
      </div>
    </div>
  );
}

function ProductCardDemo() {
  const mockProduct = {
    name: 'Premium Wireless Headphones with Active Noise Cancellation and 30-hour Battery Life',
    price: 12999,
    description: 'Experience crystal-clear audio with our premium wireless headphones.',
  };

  const { totalHeight, loaded } = useProductCardMeasurements(mockProduct, 280);

  return (
    <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '16px' }}>📦 Product Card Measurements</h2>
      <p style={{ marginBottom: '16px' }}>
        <strong>Status:</strong> {loaded ? '✅ Measured' : '⏳ Loading...'}
      </p>
      <p style={{ marginBottom: '16px' }}>
        <strong>Total Height:</strong> {totalHeight}px
      </p>
      <div style={{
        width: '280px',
        height: `${totalHeight}px`,
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
      }}>
        <p style={{ fontWeight: '600', marginBottom: '8px' }}>{mockProduct.name}</p>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{mockProduct.description}</p>
        <p style={{ fontWeight: '700', color: '#C9A227' }}>₹{mockProduct.price.toLocaleString()}</p>
      </div>
    </div>
  );
}

function ChatDemo() {
  const [message, setMessage] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');

  const { height } = useDebouncedTextHeight(
    streamingMessage,
    {
      font: '14px Inter, system-ui, sans-serif',
      maxWidth: 400,
      lineHeight: 21,
      whiteSpace: 'pre-wrap',
    },
    100
  );

  // Simulate streaming
  React.useEffect(() => {
    const fullMessage = 'This is a simulated AI response that streams in real-time. Watch how the message bubble smoothly expands without any jank!';
    let index = 0;
    
    const interval = setInterval(() => {
      setStreamingMessage(fullMessage.slice(0, index + 1));
      index++;
      
      if (index >= fullMessage.length) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '16px' }}>💬 AI Chat - 60fps Streaming</h2>
      <div style={{
        maxWidth: '400px',
        padding: '16px',
        background: '#2A2A3E',
        borderRadius: '12px',
        minHeight: `${height || 40}px`,
        transition: 'height 0.2s',
      }}>
        <span style={{ color: 'white', fontSize: '14px', lineHeight: '21px' }}>
          {streamingMessage}
        </span>
      </div>
      <p style={{ marginTop: '16px', color: '#666' }}>
        Current height: {height}px
      </p>
    </div>
  );
}

function BalancedTextDemo() {
  const lines = calculateBalancedLines(LONG_TEXT, '15px Inter, system-ui', 600);

  return (
    <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '16px' }}>📝 Balanced Text Layout</h2>
      <p style={{ marginBottom: '16px' }}>
        <strong>Lines:</strong> {lines.length} | <strong>Avg Width:</strong>{' '}
        {Math.round(lines.reduce((sum, l) => sum + l.width, 0) / lines.length)}px
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3>Standard Layout</h3>
          <p style={{ fontSize: '15px', lineHeight: '1.6' }}>{LONG_TEXT}</p>
        </div>
        <div>
          <h3>Balanced Layout</h3>
          <BalancedText
            text={LONG_TEXT}
            font="15px Inter, system-ui"
            maxWidth={600}
            lineHeight={24}
          />
        </div>
      </div>
    </div>
  );
}

function EditorialDemo() {
  const mockProduct = {
    name: 'TerraVive Organic T-Shirt',
    description: LONG_TEXT,
    price: 2999,
    discount: 15,
    image: [{ asset: { _ref: 'image-1' } }],
    category: { name: 'T-Shirts' },
  };

  return (
    <div>
      <EditorialLayout product={mockProduct} layout="left" />
    </div>
  );
}

function VirtualListDemo() {
  const products = Array.from({ length: 50 }, (_, i) => ({
    _id: `product-${i}`,
    name: `Product ${i + 1}`,
    slug: { current: `product-${i}` },
    price: Math.floor(Math.random() * 5000) + 999,
    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0,
    description: 'This is a sample product description for virtual list demo.',
    image: [{ asset: { _ref: 'image-1' } }],
  }));

  return (
    <div style={{ padding: '24px', background: '#f9f9f9', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '16px' }}>📜 Virtual Product List</h2>
      <p style={{ marginBottom: '16px' }}>
        <strong>Products:</strong> {products.length} | Scroll to experience virtualization
      </p>
      <div style={{ height: '600px' }}>
        <VirtualProductList products={products} columns={3} cardWidth={240} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: '32px', fontWeight: '700', color: '#C9A227', marginBottom: '8px' }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#666' }}>{label}</div>
    </div>
  );
}
