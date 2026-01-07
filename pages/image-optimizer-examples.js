// pages/image-optimizer-examples.js
// Comprehensive test page for all image optimizer usage examples

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getOptimizedImageUrl,
  generateResponsiveUrls,
  generatePictureElement,
  generateSrcSet,
  getLQIP,
  getCacheStats,
  clearImageCache,
  preloadImages,
  createImageObserver,
  getPerformanceMetrics
} from '../lib/imageOptimizer';

// Test configurations
const TEST_CONFIGS = {
  1: { width: 800, height: 600, quality: 80, format: 'webp' },
  2: { width: 1200, height: 800, format: 'avif' },
  3: { sizes: ['400', '800', '1200'], alt: 'Product image', className: 'product-image', loading: 'lazy' },
  4: { sizes: [400, 800, 1200], densities: [1, 2], aspectRatio: 0.75, format: 'webp' },
  5: { priority: 3, quality: 70, concurrent: 2 },
  6: { type: 'blur', quality: 20 },
  7: {},
  8: {}
};

export default function ImageOptimizerExamples() {
  // Mock image data
  const mockImages = useMemo(() => [
    {
      asset: {
        _ref: 'image-abc123-800x600-jpg',
        _id: 'image-abc123-800x600-jpg',
        metadata: { dimensions: { width: 800, height: 600 } }
      }
    },
    {
      asset: {
        _ref: 'image-def456-1920x1080-png',
        _id: 'image-def456-1920x1080-png',
        metadata: { dimensions: { width: 1920, height: 1080 } }
      }
    },
    {
      asset: {
        _ref: 'image-ghi789-400x300-webp',
        _id: 'image-ghi789-400x300-webp',
        metadata: { dimensions: { width: 400, height: 300 } }
      }
    }
  ], []);

  // State management
  const [testResults, setTestResults] = useState({});
  const [activeTests, setActiveTests] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(0);
  const [batchMode, setBatchMode] = useState(false);
  const [filter, setFilter] = useState('all'); // all, success, failed, pending
  const [sortBy, setSortBy] = useState('id'); // id, time, status

  // Performance tracking
  const [performanceData, setPerformanceData] = useState({
    totalTests: 0,
    successfulTests: 0,
    failedTests: 0,
    averageTime: 0
  });

  // Example tests definition
  const exampleTests = useMemo(() => [
    {
      id: 1,
      title: 'Basic Image Optimization',
      description: 'Generate an optimized image URL with specific dimensions and quality settings',
      category: 'Core',
      complexity: 'Basic',
      code: `getOptimizedImageUrl(image, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp'
})`
    },
    {
      id: 2,
      title: 'Responsive Image URLs',
      description: 'Generate device-specific URLs for mobile, tablet, and desktop',
      category: 'Core',
      complexity: 'Intermediate',
      code: `generateResponsiveUrls(image, {
  width: 1200,
  height: 800,
  format: 'avif'
})`
    },
    {
      id: 3,
      title: 'Generate Picture Element',
      description: 'Create a modern <picture> element with multiple formats for better browser support',
      category: 'Advanced',
      complexity: 'Advanced',
      code: `await generatePictureElement(image, {
  sizes: ['400', '800', '1200'],
  alt: 'Product image',
  className: 'product-image',
  loading: 'lazy'
})`
    },
    {
      id: 4,
      title: 'Generate SrcSet',
      description: 'Create a srcSet attribute for responsive images with different densities',
      category: 'Advanced',
      complexity: 'Intermediate',
      code: `generateSrcSet(image, {
  sizes: [400, 800, 1200],
  densities: [1, 2],
  aspectRatio: 0.75,
  format: 'webp'
})`
    },
    {
      id: 5,
      title: 'Preload Critical Images',
      description: 'Preload important images to improve perceived performance',
      category: 'Performance',
      complexity: 'Advanced',
      code: `await preloadImages([image1, image2, image3], {
  priority: 3,
  quality: 70,
  concurrent: 2
})`
    },
    {
      id: 6,
      title: 'Get LQIP',
      description: 'Generate a low-quality image placeholder for progressive loading',
      category: 'Performance',
      complexity: 'Basic',
      code: `getLQIP(image, {
  type: 'blur',
  quality: 20
})`
    },
    {
      id: 7,
      title: 'Cache Management',
      description: 'Get cache statistics and manage the image cache',
      category: 'Utilities',
      complexity: 'Basic',
      code: `getCacheStats()
clearImageCache()`
    },
    {
      id: 8,
      title: 'Performance Metrics',
      description: 'Get performance metrics for image loading',
      category: 'Performance',
      complexity: 'Intermediate',
      code: `getPerformanceMetrics()`
    }
  ], []);

  // Update performance data when results change
  useEffect(() => {
    const results = Object.values(testResults);
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => r.success === false).length;
    const avgTime = results.reduce((acc, r) => acc + (r.executionTime || 0), 0) / total || 0;

    setPerformanceData({
      totalTests: total,
      successfulTests: successful,
      failedTests: failed,
      averageTime: Math.round(avgTime)
    });
  }, [testResults]);

  const runExampleTest = useCallback(async (exampleNumber) => {
    const startTime = performance.now();
    const testId = `${exampleNumber}-${Date.now()}`;
    
    setActiveTests(prev => new Set([...prev, exampleNumber]));
    
    // Set initial pending state
    setTestResults(prev => ({
      ...prev,
      [exampleNumber]: {
        success: null,
        pending: true,
        startTime: new Date().toLocaleTimeString(),
        testId
      }
    }));

    try {
      let result;
      const currentImage = mockImages[selectedImage];
      // Ensure we have a valid config, fallback to empty object if not found
      const config = TEST_CONFIGS[exampleNumber] || {};
      
      switch (exampleNumber) {
        case 1:
          // Basic Image Optimization
          result = getOptimizedImageUrl(currentImage, config);
          break;
          
        case 2:
          // Responsive Image URLs
          result = generateResponsiveUrls(currentImage, config);
          break;
          
        case 3:
          // Generate Picture Element
          result = await generatePictureElement(currentImage, config);
          break;
          
        case 4:
          // Generate SrcSet
          result = generateSrcSet(currentImage, config);
          break;
          
        case 5:
          // Preload Critical Images
          await preloadImages(mockImages, config);
          result = `Successfully preloaded ${mockImages.length} images`;
          break;
          
        case 6:
          // Get LQIP
          result = getLQIP(currentImage, config);
          break;
          
        case 7:
          // Cache Management
          result = {
            cacheStats: getCacheStats(),
            cacheCleared: false
          };
          break;
          
        case 8:
          // Performance Metrics
          result = getPerformanceMetrics();
          break;
          
        default:
          throw new Error(`Unknown test: ${exampleNumber}`);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [exampleNumber]: {
          success: true,
          result: result,
          timestamp: new Date().toLocaleTimeString(),
          executionTime: Math.round(executionTime * 100) / 100,
          imageUsed: selectedImage,
          config: config,
          testId,
          pending: false
        }
      }));
    } catch (error) {
      console.error(`Test ${exampleNumber} failed:`, error);
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [exampleNumber]: {
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleTimeString(),
          executionTime: Math.round(executionTime * 100) / 100,
          imageUsed: selectedImage,
          config: TEST_CONFIGS[exampleNumber] || {}, // Ensure config is always defined
          testId,
          pending: false
        }
      }));
    } finally {
      setActiveTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(exampleNumber);
        return newSet;
      });
    }
  }, [mockImages, selectedImage]);

  const runAllTests = useCallback(async () => {
    setBatchMode(true);
    const testNumbers = exampleTests.map(test => test.id);
    
    for (const testNumber of testNumbers) {
      await runExampleTest(testNumber);
      // Small delay between tests to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setBatchMode(false);
  }, [runExampleTest, exampleTests]);

  const clearAllResults = useCallback(() => {
    setTestResults({});
    setActiveTests(new Set());
    setBatchMode(false);
    clearImageCache(); // Clear image optimizer cache too
  }, []);

  const clearSpecificResult = useCallback((testNumber) => {
    setTestResults(prev => {
      const updated = { ...prev };
      delete updated[testNumber];
      return updated;
    });
  }, []);

  const exportResults = useCallback(() => {
    try {
      const dataStr = JSON.stringify(testResults, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-optimizer-results-${Date.now()}.json`;
      document.body.appendChild(link); // Append to body first
      link.click();
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export results:', error);
      // Optionally show an error message to the user
    }
  }, [testResults]);

  // Filter and sort results
  const filteredTests = useMemo(() => {
    let filtered = exampleTests.filter(test => {
      const result = testResults[test.id];
      if (filter === 'all') return true;
      if (filter === 'success') return result?.success === true;
      if (filter === 'failed') return result?.success === false;
      if (filter === 'pending') return result?.pending === true;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id;
      if (sortBy === 'time') {
        const timeA = testResults[a.id]?.executionTime || 0;
        const timeB = testResults[b.id]?.executionTime || 0;
        return timeB - timeA; // Descending
      }
      if (sortBy === 'status') {
        const statusA = testResults[a.id]?.success;
        const statusB = testResults[b.id]?.success;
        return (statusB === statusA) ? 0 : statusB ? 1 : -1;
      }
      return 0;
    });
  }, [testResults, filter, sortBy, exampleTests]);

  const getCategoryColor = (category) => {
    const colors = {
      'Core': '#3b82f6',
      'Advanced': '#8b5cf6', 
      'Performance': '#10b981',
      'Utilities': '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  const getComplexityIcon = (complexity) => {
    const icons = {
      'Basic': '🟢',
      'Intermediate': '🟡',
      'Advanced': '🔴'
    };
    return icons[complexity] || '⚪';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'i':
            e.preventDefault();
            toggleExpanded();
            break;
          case '1':
            e.preventDefault();
            navigateToPage('/image-optimizer-test');
            break;
          case '2':
            e.preventDefault();
            navigateToPage('/image-optimizer-examples');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1e293b', 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🖼️ Image Optimizer Test Suite
        </h1>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1.1rem',
          marginBottom: '24px'
        }}>
          Comprehensive testing environment for all image optimization features
        </p>
        
        {/* Performance Dashboard */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Total Tests', value: performanceData.totalTests, color: '#3b82f6', icon: '📊' },
            { label: 'Successful', value: performanceData.successfulTests, color: '#10b981', icon: '✅' },
            { label: 'Failed', value: performanceData.failedTests, color: '#ef4444', icon: '❌' },
            { label: 'Avg Time', value: `${performanceData.averageTime}ms`, color: '#f59e0b', icon: '⏱️' }
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '120px',
              textAlign: 'center',
              border: `2px solid ${stat.color}20`
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Control Panel */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          {/* Image Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Test Image:
            </label>
            <select 
              value={selectedImage}
              onChange={(e) => setSelectedImage(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
            >
              {mockImages.map((img, index) => (
                <option key={index} value={index}>
                  Image {index + 1} ({img.asset.metadata.dimensions.width}×{img.asset.metadata.dimensions.height})
                </option>
              ))}
            </select>
          </div>

          {/* Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Filter Results:
            </label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Tests</option>
              <option value="success">✅ Successful Only</option>
              <option value="failed">❌ Failed Only</option>
              <option value="pending">⏳ Pending Only</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Sort By:
            </label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
            >
              <option value="id">Test ID</option>
              <option value="time">Execution Time</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              onClick={runAllTests}
              disabled={batchMode || activeTests.size > 0}
              style={{
                backgroundColor: batchMode ? '#9ca3af' : '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: batchMode ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                minWidth: '90px',
                transition: 'all 0.2s ease'
              }}
            >
              {batchMode ? '🔄 Running...' : '🚀 Run All'}
            </button>
            
            <button 
              onClick={clearAllResults}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                minWidth: '90px'
              }}
            >
              🗑️ Clear All
            </button>

            <button 
              onClick={exportResults}
              disabled={Object.keys(testResults).length === 0}
              style={{
                backgroundColor: Object.keys(testResults).length > 0 ? '#10b981' : '#9ca3af',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: Object.keys(testResults).length > 0 ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: '600',
                minWidth: '90px'
              }}
            >
              📥 Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Test Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '24px' 
      }}>
        {filteredTests.map((test) => {
          const result = testResults[test.id];
          const isActive = activeTests.has(test.id);
          const categoryColor = getCategoryColor(test.category);
          const complexityIcon = getComplexityIcon(test.complexity);

          return (
            <div 
              key={test.id}
              style={{ 
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Category stripe */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: categoryColor
              }} />

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '16px' 
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      backgroundColor: categoryColor,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {test.category}
                    </span>
                    <span style={{ fontSize: '0.875rem' }}>
                      {complexityIcon} {test.complexity}
                    </span>
                  </div>
                  <h3 style={{ 
                    margin: '0 0 6px 0', 
                    color: '#1e293b',
                    fontSize: '1.25rem',
                    fontWeight: '700'
                  }}>
                    Example {test.id}: {test.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 16px 0', 
                    color: '#64748b', 
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}>
                    {test.description}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => runExampleTest(test.id)}
                    disabled={isActive || batchMode}
                    style={{
                      backgroundColor: isActive || batchMode ? '#9ca3af' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      cursor: isActive || batchMode ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      minWidth: '80px'
                    }}
                  >
                    {isActive ? '⏳ Testing...' : '▶️ Test'}
                  </button>

                  {result && (
                    <button
                      onClick={() => clearSpecificResult(test.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                      title="Clear this result"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              
              {/* Code Block */}
              <pre style={{ 
                backgroundColor: '#f1f5f9',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                overflow: 'auto',
                maxHeight: '140px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
              }}>
                {test.code}
              </pre>
              
              {/* Results Section */}
              {result && (
                <div style={{ 
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  border: `2px solid ${
                    result.pending ? '#f59e0b' :
                    result.success ? '#10b981' : '#ef4444'
                  }`,
                  backgroundColor: result.pending ? '#fef3c7' :
                    result.success ? '#d1fae5' : '#fee2e2'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '12px' 
                  }}>
                    <strong style={{ 
                      color: result.pending ? '#d97706' :
                        result.success ? '#065f46' : '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {result.pending ? '⏳ Testing...' :
                       result.success ? '✅ Success' : '❌ Failed'}
                      {result.executionTime && (
                        <span style={{ 
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {result.executionTime}ms
                        </span>
                      )}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {result.timestamp}
                    </div>
                  </div>
                  
                  {result.success && !result.pending && (
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}>
                        Image: {result.imageUsed + 1} | Config: {JSON.stringify(result.config).slice(0, 100)}...
                      </div>
                      <pre style={{ 
                        margin: 0, 
                        fontSize: '0.75rem', 
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '12px',
                        borderRadius: '6px',
                        overflow: 'auto',
                        maxHeight: '200px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                      }}>
                        {typeof result.result === 'string' 
                          ? result.result 
                          : JSON.stringify(result.result, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {result.success === false && !result.pending && (
                    <div>
                      <div style={{ 
                        color: '#991b1b',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        Error Details:
                      </div>
                      <div style={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '12px',
                        borderRadius: '6px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: '0.75rem'
                      }}>
                        {result.error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Documentation Footer */}
      <footer style={{ 
        marginTop: '40px',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '20px',
          color: '#1e293b',
          fontSize: '1.5rem'
        }}>
          📚 Usage Guide
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ color: '#374151', fontSize: '1.1rem' }}>🚀 Getting Started</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#4b5563' }}>
              <li>Select a test image from the dropdown</li>
              <li>Click individual &quot;Test&quot; buttons or &quot;Run All&quot;</li>
              <li>Filter and sort results using the control panel</li>
              <li>Export results as JSON for further analysis</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: '#374151', fontSize: '1.1rem' }}>⚙️ Configuration</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#4b5563' }}>
              <li>Each test uses predefined optimal configurations</li>
              <li>Results show execution time and performance metrics</li>
              <li>All functions work with Sanity image structures</li>
              <li>Cache management helps optimize repeated tests</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: '#374151', fontSize: '1.1rem' }}>🔧 Integration</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#4b5563' }}>
              <li>Import functions from <code>../lib/imageOptimizer</code></li>
              <li>Works in both browser and server environments</li>
              <li>Supports modern image formats (WebP, AVIF)</li>
              <li>Includes TypeScript definitions</li>
            </ul>
          </div>
        </div>
        
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>💡</span>
          <div>
            <strong style={{ color: '#0369a1' }}>Pro Tip:</strong>
            <span style={{ color: '#0c4a6e', marginLeft: '8px' }}>
              Use the performance metrics to identify bottlenecks and optimize your image loading strategy.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}