// pages/test-error-api.js
// Test page to demonstrate the error handling system

import React, { useState } from 'react';

const TestErrorAPI = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint, options = {}) => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });
      
      const data = await res.json();
      setResponse({
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data
      });
    } catch (error) {
      setResponse({
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'GET Success',
      action: () => testAPI('/api/example-error-handler')
    },
    {
      name: 'POST Success',
      action: () => testAPI('/api/example-error-handler', {
        method: 'POST',
        body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
      })
    },
    {
      name: 'POST Validation Error',
      action: () => testAPI('/api/example-error-handler', {
        method: 'POST',
        body: JSON.stringify({ name: 'John' }) // Missing email
      })
    },
    {
      name: 'Method Not Allowed',
      action: () => testAPI('/api/example-error-handler', {
        method: 'DELETE'
      })
    },
    {
      name: 'Rate Limit Test',
      action: async () => {
        // Make multiple rapid requests
        for (let i = 0; i < 5; i++) {
          await testAPI('/api/example-error-handler');
        }
      }
    }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Error Handler Test Suite</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Available Tests:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {tests.map((test, index) => (
            <button
              key={index}
              onClick={test.action}
              disabled={loading}
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {test.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          Loading...
        </div>
      )}

      {response && (
        <div>
          <h2>Response:</h2>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            border: '1px solid #dee2e6',
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px' }}>
        <h3>What to Look For:</h3>
        <ul>
          <li><strong>X-Correlation-ID:</strong> Each request gets a unique tracking ID</li>
          <li><strong>Error Structure:</strong> Consistent error format with severity levels</li>
          <li><strong>Rate Limiting:</strong> X-RateLimit-Remaining header</li>
          <li><strong>Method Validation:</strong> Proper HTTP method restrictions</li>
          <li><strong>Input Sanitization:</strong> XSS protection on inputs</li>
          <li><strong>CORS Headers:</strong> Cross-origin request support</li>
        </ul>
      </div>
    </div>
  );
};

export default TestErrorAPI;