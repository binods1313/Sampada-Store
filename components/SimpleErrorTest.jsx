// components/SimpleErrorTest.jsx - Minimal test component
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SimpleErrorTest = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Simple Error Test Component</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={24} color="red" />
        <span>This is a simple test component to verify lucide-react works</span>
      </div>
      <p>If you can see this text and the icon above, the component is working correctly.</p>
    </div>
  );
};

export default SimpleErrorTest;