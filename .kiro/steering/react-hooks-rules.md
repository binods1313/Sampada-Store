---
inclusion: auto
---

# React Hooks Rules - Auto-Included Steering

This steering file is automatically included to prevent React Hooks violations.

## Critical Rule: Hook Order Must Be Consistent

**NEVER** call hooks conditionally or after early returns. This causes "Rendered more hooks than during the previous render" errors.

## Component Structure Template

```javascript
const Component = () => {
  // 1. ALL HOOKS FIRST (unconditional)
  const [state, setState] = useState(false);
  const router = useRouter();
  useEffect(() => { /* ... */ }, []);
  const callback = useCallback(() => { /* ... */ }, []);
  
  // 2. REGULAR FUNCTIONS AND VARIABLES
  const regularFunction = () => { /* ... */ };
  const data = [/* ... */];
  
  // 3. CONDITIONAL RETURNS (after all hooks)
  if (condition) return null;
  
  // 4. JSX RETURN
  return <div>Content</div>;
};
```

## Quick Checklist

When creating or modifying React components:

- ✅ All `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext` at the top
- ✅ All hooks called unconditionally (no `if` before hooks)
- ✅ All conditional returns AFTER all hooks
- ✅ Guards inside `useEffect`, not before hook calls
- ✅ No hooks inside loops or nested functions

## Common Violations to Avoid

```javascript
// ❌ WRONG
const Component = () => {
  const [state, setState] = useState(false);
  
  if (condition) return null; // ❌ Early return
  
  useEffect(() => { /* ... */ }, []); // ❌ Might not be called
};

// ✅ CORRECT
const Component = () => {
  const [state, setState] = useState(false);
  
  useEffect(() => {
    if (!condition) return; // ✅ Guard inside effect
    /* ... */
  }, [condition]);
  
  if (condition) return null; // ✅ After all hooks
};
```

## Reference

See `docs/REACT_HOOKS_RULES.md` for comprehensive documentation.
See `docs/COMPONENT_TEMPLATE.jsx` for complete template.
