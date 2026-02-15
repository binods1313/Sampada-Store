// Component Template - Follow React Rules of Hooks
// This template ensures proper hook ordering and prevents common errors

import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useRouter } from 'next/router';

/**
 * Component Template
 * 
 * CRITICAL RULES:
 * 1. ALL hooks must be called at the top level
 * 2. ALL hooks must be called unconditionally
 * 3. ALL conditional returns must come AFTER all hooks
 * 4. Never call hooks inside loops, conditions, or nested functions
 */
const ComponentTemplate = ({ prop1, prop2 }) => {
  // ============================================================================
  // SECTION 1: ALL HOOKS (Must be at the top, called unconditionally)
  // ============================================================================
  
  // State hooks
  const [state1, setState1] = useState(initialValue);
  const [state2, setState2] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Router and context hooks
  const router = useRouter();
  // const contextValue = useContext(SomeContext);
  
  // Effect hooks
  useEffect(() => {
    // Mount effect
    setIsMounted(true);
    
    return () => {
      // Cleanup
    };
  }, []);
  
  useEffect(() => {
    // Effect with dependencies
    if (!isMounted) return; // Guard inside effect, not before hook call
    
    // Effect logic here
  }, [isMounted, /* other dependencies */]);
  
  // Callback hooks
  const handleAction = useCallback(() => {
    // Callback logic
  }, [/* dependencies */]);
  
  // Memo hooks
  const computedValue = useMemo(() => {
    // Expensive computation
    return someValue;
  }, [/* dependencies */]);
  
  // Custom hooks (if any)
  // const customHookValue = useCustomHook();
  
  // ============================================================================
  // SECTION 2: REGULAR FUNCTIONS AND VARIABLES (After all hooks)
  // ============================================================================
  
  const regularFunction = () => {
    // Regular function logic
  };
  
  const dataArray = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];
  
  // ============================================================================
  // SECTION 3: CONDITIONAL RETURNS (After all hooks and functions)
  // ============================================================================
  
  // Development-only check
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  // Client-side only check
  if (!isMounted) {
    return null;
  }
  
  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // ============================================================================
  // SECTION 4: RENDER (Main component JSX)
  // ============================================================================
  
  return (
    <div>
      <h1>Component Content</h1>
      <button onClick={handleAction}>Action</button>
      <div>{computedValue}</div>
    </div>
  );
};

export default ComponentTemplate;

// ============================================================================
// COMMON PATTERNS AND EXAMPLES
// ============================================================================

/**
 * Pattern 1: Development-Only Component
 */
const DevOnlyComponent = () => {
  // ✅ All hooks first
  const [state, setState] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  // ✅ Conditional return after all hooks
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return <div>Dev Tool</div>;
};

/**
 * Pattern 2: Client-Side Only Component (SSR Safe)
 */
const ClientOnlyComponent = () => {
  // ✅ All hooks first
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Client-side only code
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('key');
      setData(savedData);
    }
  }, []);
  
  // ✅ Conditional return after all hooks
  if (!isMounted) {
    return null; // or return <LoadingSpinner />
  }
  
  return <div>{data}</div>;
};

/**
 * Pattern 3: Conditional Feature Component
 */
const ConditionalFeatureComponent = ({ featureEnabled }) => {
  // ✅ All hooks first, regardless of feature flag
  const [state, setState] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Guard inside effect
    if (!featureEnabled) return;
    
    // Feature-specific logic
  }, [featureEnabled]);
  
  // ✅ Conditional return after all hooks
  if (!featureEnabled) {
    return null;
  }
  
  return <div>Feature Content</div>;
};

/**
 * Pattern 4: Component with Multiple Conditions
 */
const MultiConditionComponent = ({ isEnabled, hasPermission }) => {
  // ✅ All hooks first
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // All conditions checked inside effect
    if (!isEnabled || !hasPermission) {
      setLoading(false);
      return;
    }
    
    // Load data
    fetchData().then(() => setLoading(false));
  }, [isEnabled, hasPermission]);
  
  // ✅ All conditional returns after all hooks
  if (!isEnabled) {
    return <div>Feature disabled</div>;
  }
  
  if (!hasPermission) {
    return <div>No permission</div>;
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return <div>Content</div>;
};
