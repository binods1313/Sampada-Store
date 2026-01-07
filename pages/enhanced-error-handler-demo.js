// pages/enhanced-error-handler-demo.js
// Demo page to test the enhanced API error handler

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Send, Trash2, Info } from 'lucide-react';

export default function EnhancedErrorHandlerDemo() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const makeRequest = async (method, endpoint, body = null) => {
    setLoading(true);
    setResponse(null);
    
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      };
      
      if (body) {
        config.body = JSON.stringify(body);
      }
      
      const res = await fetch(endpoint, config);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        success: res.ok,
        data,
        headers: {
          correlationId: res.headers.get('X-Correlation-ID'),
          rateLimitRemaining: res.headers.get('X-RateLimit-Remaining')
        }
      });
    } catch (error) {
      setResponse({
        status: 'Network Error',
        success: false,
        data: { error: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const testEndpoints = [
    {
      title: 'GET - Success Response',
      description: 'Test successful API response with logging and correlation tracking',
      action: () => makeRequest('GET', '/api/test-enhanced-error-handler'),
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      title: 'POST - Validation Success',
      description: 'Test input validation and sanitization with valid data',
      action: () => makeRequest('POST', '/api/test-enhanced-error-handler', formData),
      icon: <Send className="w-5 h-5 text-blue-600" />
    },
    {
      title: 'POST - Validation Error',
      description: 'Test validation error handling',
      action: () => makeRequest('POST', '/api/test-enhanced-error-handler', { name: 'A', email: 'invalid' }),
      icon: <AlertCircle className="w-5 h-5 text-orange-600" />
    }
  ];

  const errorTests = [
    { type: 'validation', label: 'Validation Error (422)', color: 'orange' },
    { type: 'auth', label: 'Authentication Error (401)', color: 'red' },
    { type: 'forbidden', label: 'Authorization Error (403)', color: 'red' },
    { type: 'notfound', label: 'Not Found Error (404)', color: 'yellow' },
    { type: 'ratelimit', label: 'Rate Limit Error (429)', color: 'purple' },
    { type: 'server', label: 'Server Error (500)', color: 'red' },
    { type: 'unhandled', label: 'Unhandled Error (500)', color: 'gray' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          🛡️ Enhanced API Error Handler Demo
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Test enterprise-grade error handling with comprehensive logging, validation, and security features
        </p>
      </div>

      {/* Form for POST requests */}
      <div style={{ 
        backgroundColor: '#f9fafb', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
          📝 Test Data Form
        </h3>
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
              Name:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name (min 2 chars)"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
              Email:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter valid email"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Test Endpoints */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
          ✅ Success Scenarios
        </h3>
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          {testEndpoints.map((test, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {test.icon}
                <h4 style={{ marginLeft: '10px', fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>
                  {test.title}
                </h4>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '15px', fontSize: '14px' }}>
                {test.description}
              </p>
              <button
                onClick={test.action}
                disabled={loading}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? <><Loader className="w-4 h-4 animate-spin inline mr-2" />Testing...</> : 'Test'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Error Tests */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
          ❌ Error Scenarios
        </h3>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {errorTests.map((test, index) => (
            <button
              key={index}
              onClick={() => makeRequest('DELETE', `/api/test-enhanced-error-handler?errorType=${test.type}`)}
              disabled={loading}
              style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                cursor: loading ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Trash2 className={`w-4 h-4 mr-3 text-${test.color}-600`} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {test.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div style={{ 
          backgroundColor: response.success ? '#f0f9ff' : '#fef2f2',
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${response.success ? '#bfdbfe' : '#fecaca'}`,
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            {response.success ? 
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" /> :
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            }
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '600', 
              color: response.success ? '#059669' : '#dc2626'
            }}>
              Response: {response.status} {response.statusText}
            </h3>
          </div>
          
          {response.headers?.correlationId && (
            <div style={{ 
              backgroundColor: response.success ? '#dbeafe' : '#fee2e2',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Info className="w-4 h-4 mr-2" />
                <strong>Correlation ID:</strong> {response.headers.correlationId}
              </div>
              {response.headers.rateLimitRemaining && (
                <div style={{ marginTop: '5px' }}>
                  <strong>Rate Limit Remaining:</strong> {response.headers.rateLimitRemaining}
                </div>
              )}
            </div>
          )}
          
          <pre style={{
            backgroundColor: response.success ? '#e0f2fe' : '#fef1f1',
            padding: '15px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px',
            border: `1px solid ${response.success ? '#b3e5fc' : '#fbb6ce'}`,
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}

      {/* Features Info */}
      <div style={{ 
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '30px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
          🚀 Enhanced Error Handler Features
        </h3>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {[
            'Winston structured logging',
            'Request correlation tracking',
            'DOMPurify input sanitization',
            'Express rate limiting',
            'Helmet security headers',
            'CORS configuration',
            'Circuit breaker pattern',
            'Redis-backed rate limiting',
            'Comprehensive error mapping',
            'Health check endpoints',
            'Metrics collection',
            'JWT authentication support'
          ].map((feature, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span style={{ fontSize: '14px', color: '#4b5563' }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}