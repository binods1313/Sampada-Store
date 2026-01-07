// test-error-component.js - Simple test to verify ErrorHandlingTestSuite works
import ErrorHandlingTestSuite from '../components/ErrorHandlingTestSuite';
import React from 'react';

export default function TestErrorComponent() {
  console.log('ErrorHandlingTestSuite imported:', ErrorHandlingTestSuite);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Testing ErrorHandlingTestSuite Component</h1>
      {ErrorHandlingTestSuite ? (
        <ErrorHandlingTestSuite />
      ) : (
        <div style={{ color: 'red' }}>
          ErrorHandlingTestSuite component is undefined!
        </div>
      )}
    </div>
  );
}