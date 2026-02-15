# React Hooks Rules - Critical Guidelines

## The Problem: "Rendered more hooks than during the previous render"

This error occurs when hooks are called conditionally or in different orders between renders, violating React's Rules of Hooks.

## Root Cause

React relies on the order in which hooks are called to maintain state between renders. If the order changes, React loses track of which state belongs to which hook, causing crashes.

## Critical Rules

### ✅ DO: Call All Hooks at the Top Level

```javascript
const MyComponent = () => {
  // ✅ CORRECT: All hooks called first, unconditionally
  const [state, setState] = useState(false);
  const router = useRouter();
  const value = useContext(MyContext);
  
  useEffect(() => {
    // effect logic
  }, []);
  
  const callback = useCallback(() => {
    // callback logic
  }, []);
  
  // ✅ Conditional returns AFTER all hooks
  if (someCondition) {
    return null;
  }
  
  return <div>Content</div>;
};
```

### ❌ DON'T: Early Returns Before Hooks

```javascript
const MyComponent = () => {
  const [state, setState] = useState(false);
  
  // ❌ WRONG: Early return before all hooks are called
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  // ❌ This hook might not be called on every render
  const router = useRouter();
  
  return <div>Content</div>;
};
```

### ❌ DON'T: Conditional Hook Calls

```javascript
const MyComponent = () => {
  const [state, setState] = useState(false);
  
  // ❌ WRONG: Conditional hook call
  if (someCondition) {
    useEffect(() => {
      // This violates Rules of Hooks
    }, []);
  }
  
  return <div>Content</div>;
};
```

## Common Scenarios

### Development-Only Components

```javascript
// ❌ WRONG
const DevTool = () => {
  const [state, setState] = useState(false);
  
  if (process.env.NODE_ENV === 'production') {
    return null; // ❌ Early return before all hooks
  }
  
  const router = useRouter(); // ❌ Might not be called
  
  return <div>Dev Tool</div>;
};

// ✅ CORRECT
const DevTool = () => {
  // ✅ All hooks called first
  const [state, setState] = useState(false);
  const router = useRouter();
  
  // ✅ Conditional return after all hooks
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return <div>Dev Tool</div>;
};
```

### Client-Side Only Components

```javascript
// ❌ WRONG
const ClientComponent = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null; // ❌ Early return before all hooks
  }
  
  const data = useContext(DataContext); // ❌ Might not be called
  
  return <div>Content</div>;
};

// ✅ CORRECT
const ClientComponent = () => {
  // ✅ All hooks called first
  const [mounted, setMounted] = useState(false);
  const data = useContext(DataContext);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ✅ Conditional return after all hooks
  if (!mounted) {
    return null;
  }
  
  return <div>Content</div>;
};
```

## Checklist for Component Review

When reviewing or creating components, ensure:

1. ✅ All `useState` calls are at the top
2. ✅ All `useEffect` calls come after state declarations
3. ✅ All `useCallback` and `useMemo` calls are before conditional returns
4. ✅ All `useContext` calls are at the top
5. ✅ All custom hooks are called unconditionally
6. ✅ No hooks inside `if`, `for`, or nested functions
7. ✅ All conditional returns (`if (condition) return null`) come AFTER all hooks

## Quick Fix Pattern

If you encounter the "Rendered more hooks" error:

1. Find all hooks in the component
2. Move them all to the top of the function
3. Move all conditional returns to after the hooks
4. Add guards inside `useEffect` if needed

```javascript
// Before (❌ WRONG)
const Component = () => {
  const [state, setState] = useState(false);
  
  if (condition) return null; // ❌ Early return
  
  useEffect(() => { /* ... */ }, []); // ❌ Might not be called
  
  return <div>Content</div>;
};

// After (✅ CORRECT)
const Component = () => {
  const [state, setState] = useState(false);
  
  useEffect(() => {
    if (!condition) return; // ✅ Guard inside effect
    /* ... */
  }, [condition]);
  
  if (condition) return null; // ✅ After all hooks
  
  return <div>Content</div>;
};
```

## Testing for Hook Order Issues

1. Test with Fast Refresh (hot reload) in development
2. Test with production builds
3. Test with different environment variables
4. Test with conditional rendering from parent components

## References

- [React Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React Hooks FAQ](https://react.dev/learn/hooks-faq)

## Fixed Components in This Project

The following components were fixed to follow these rules:

- `components/ImageOptimizerTestNavigator.jsx`
- `components/TestSuiteNavigator.jsx`
- `components/EnhancedErrorHandlerNavigator.jsx`

These serve as reference implementations for proper hook usage.
