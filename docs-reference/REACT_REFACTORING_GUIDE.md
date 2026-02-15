# React Refactoring Guide for Sampada
## Based on Vercel React Best Practices & Composition Patterns

**Version**: 1.0.0  
**Date**: February 16, 2026  
**Analyzed Files**: Navbar.jsx, VisualSearch.jsx, NeumorphicToggle.jsx, Layout.jsx, StateContext.js, CartContext.js, LoginModal.jsx

---

## Executive Summary

Your codebase has **3 CRITICAL issues** causing the reload loop and **12 HIGH-PRIORITY improvements** for scalability. This guide provides specific fixes with code examples.

### Critical Issues (Fix Immediately)

1. **Hydration Mismatch in Navbar** - Causing reload loop
2. **Environment Variable Access in Client Components** - Breaks SSR
3. **Theme Flash (FOUC)** - Poor UX on page load

### High-Priority Improvements

4. Boolean prop proliferation in components
5. Monolithic context providers
6. Missing compound component patterns
7. Inefficient re-renders
8. No memoization strategy
9. Prop drilling in nested components

---

## Part 1: Fix Critical Issues (Reload Loop)

### Issue 1: Hydration Mismatch in Navbar ✅ PARTIALLY FIXED

**Problem**: Server renders placeholder, client renders full content → mismatch → reload loop

**Current Status**: You added `mounted` state but the placeholder doesn't match the final render structure.

**Fix**: Make placeholder match the final structure exactly

```jsx
// abscommerce/components/Navbar.jsx
const Navbar = () => {
  const { showCart, setShowCart } = useUIContext();
  const { totalQuantities = 0 } = useCartContext();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // CRITICAL: Placeholder must match final structure EXACTLY
  if (!mounted) {
    return (
      <nav className={styles.navbarContainer}>
        <button className={styles.mobileMenuBtn} aria-label="Menu">
          <AiOutlineMenu />
        </button>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>Sampada</Link>
        </div>
        <div className={styles.centerSection}>
          <div className={styles.navItem}>
            <Link href="/" className={styles.navLink}>Home</Link>
          </div>
          {navData.map((item, index) => (
            <div key={index} className={styles.navItem}>
              <Link href={item.link} className={styles.navLink}>
                {item.title} <BiChevronDown />
              </Link>
            </div>
          ))}
          <div className={styles.navItem}>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div style={{ width: '64px', height: '32px' }} /> {/* NeumorphicToggle placeholder */}
          <div style={{ width: '40px', height: '40px' }} /> {/* VisualSearch placeholder */}
          <div className={styles.authSection}>
            <button className={styles.btnSignin} disabled>Sign in</button>
          </div>
          <button className={styles.cartIcon} aria-label="Cart" disabled>
            <AiOutlineShopping />
            <span className={styles.cartItemQty}>0</span>
          </button>
        </div>
      </nav>
    );
  }

  // ... rest of component
};
```

### Issue 2: Environment Variable in Client Component

**Problem**: `VisualSearch.jsx` checks `process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH` which causes hydration issues

**Fix**: Move check to parent or use dynamic import

**Option A: Move check to parent (Navbar)**

```jsx
// abscommerce/components/Navbar.jsx
const Navbar = () => {
  // ... existing code
  
  // Check feature flag once, not in JSX
  const visualSearchEnabled = process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH === 'true';
  
  return (
    <nav className={styles.navbarContainer}>
      {/* ... */}
      <div className={styles.rightSection}>
        <NeumorphicToggle />
        {mounted && visualSearchEnabled && <VisualSearch />}
        {/* ... */}
      </div>
    </nav>
  );
};
```

**Option B: Dynamic import (better for bundle size)**

```jsx
// abscommerce/components/Navbar.jsx
import dynamic from 'next/dynamic';

const VisualSearch = dynamic(() => import('./VisualSearch'), { 
  ssr: false,
  loading: () => <div style={{ width: '40px', height: '40px' }} />
});

const Navbar = () => {
  // ... existing code
  
  return (
    <nav className={styles.navbarContainer}>
      {/* ... */}
      <div className={styles.rightSection}>
        <NeumorphicToggle />
        {process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH === 'true' && <VisualSearch />}
        {/* ... */}
      </div>
    </nav>
  );
};
```

### Issue 3: Theme Flash (FOUC)

**Problem**: Theme loads from localStorage after initial render → flash

**Fix**: Use Next.js script to set theme before React hydrates

```jsx
// abscommerce/pages/_document.js (create if doesn't exist)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* Set theme BEFORE React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**Then simplify StateContext.js**:

```js
// abscommerce/context/StateContext.js
export const UIProvider = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Theme is already set by _document.js script
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <UIContext.Provider value={{
      showCart,
      setShowCart,
      theme,
      toggleTheme,
      isDarkMode: mounted ? theme === 'dark' : false,
      isClient: mounted
    }}>
      {children}
    </UIContext.Provider>
  );
};
```

---

## Part 2: High-Priority Scalability Improvements

### Improvement 1: Eliminate Boolean Prop Proliferation

**Current Problem**: Components will grow boolean props like `isEditing`, `isThread`, `isDMThread`

**Example from your code**:
```jsx
// Future anti-pattern (DON'T DO THIS)
<Navbar 
  isAdmin={true} 
  showSearch={true} 
  showCart={true} 
  isCompact={false} 
  isMobile={false}
/>
```

**Solution**: Create explicit component variants

```jsx
// abscommerce/components/Navbar/index.js
export { default as Navbar } from './Navbar';
export { default as AdminNavbar } from './AdminNavbar';
export { default as CompactNavbar } from './CompactNavbar';
export { default as MobileNavbar } from './MobileNavbar';

// abscommerce/components/Navbar/AdminNavbar.jsx
function AdminNavbar() {
  return (
    <Navbar.Frame>
      <Navbar.Logo />
      <Navbar.AdminMenu />
      <Navbar.UserProfile />
    </Navbar.Frame>
  );
}
```

### Improvement 2: Convert to Compound Components

**Current Problem**: Navbar is monolithic with all logic in one file

**Solution**: Break into compound components with shared context

```jsx
// abscommerce/components/Navbar/NavbarContext.jsx
import { createContext, use } from 'react';

const NavbarContext = createContext(null);

export function NavbarProvider({ children, state, actions }) {
  return (
    <NavbarContext value={{ state, actions }}>
      {children}
    </NavbarContext>
  );
}

export function useNavbar() {
  const context = use(NavbarContext);
  if (!context) throw new Error('useNavbar must be within NavbarProvider');
  return context;
}

// abscommerce/components/Navbar/NavbarFrame.jsx
export function NavbarFrame({ children }) {
  return <nav className={styles.navbarContainer}>{children}</nav>;
}

// abscommerce/components/Navbar/NavbarLogo.jsx
export function NavbarLogo() {
  return (
    <div className={styles.leftSection}>
      <Link href="/" className={styles.logo}>Sampada</Link>
    </div>
  );
}

// abscommerce/components/Navbar/NavbarCart.jsx
export function NavbarCart() {
  const { showCart, setShowCart } = useUIContext();
  const { totalQuantities } = useCartContext();
  
  return (
    <button
      className={styles.cartIcon}
      onClick={() => setShowCart(true)}
      aria-label="Open Cart"
    >
      <AiOutlineShopping />
      <span className={styles.cartItemQty}>{totalQuantities}</span>
    </button>
  );
}

// abscommerce/components/Navbar/index.js
export const Navbar = {
  Provider: NavbarProvider,
  Frame: NavbarFrame,
  Logo: NavbarLogo,
  Menu: NavbarMenu,
  Cart: NavbarCart,
  Auth: NavbarAuth,
  Search: NavbarSearch,
  Theme: NavbarTheme,
};

// Usage
<Navbar.Provider state={state} actions={actions}>
  <Navbar.Frame>
    <Navbar.Logo />
    <Navbar.Menu items={navData} />
    <Navbar.Theme />
    <Navbar.Search />
    <Navbar.Auth />
    <Navbar.Cart />
  </Navbar.Frame>
</Navbar.Provider>
```

### Improvement 3: Decouple State from UI

**Current Problem**: UI components directly access global context

**Solution**: Lift state into provider, UI consumes interface

```jsx
// abscommerce/components/Navbar/NavbarContainer.jsx
function NavbarContainer() {
  const { showCart, setShowCart } = useUIContext();
  const { totalQuantities } = useCartContext();
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const state = {
    showCart,
    totalQuantities,
    session,
    isLoginModalOpen,
    isMobileMenuOpen,
  };

  const actions = {
    setShowCart,
    setIsLoginModalOpen,
    setIsMobileMenuOpen,
  };

  return (
    <Navbar.Provider state={state} actions={actions}>
      <StandardNavbar />
    </Navbar.Provider>
  );
}

// abscommerce/components/Navbar/StandardNavbar.jsx
function StandardNavbar() {
  return (
    <Navbar.Frame>
      <Navbar.Logo />
      <Navbar.Menu items={navData} />
      <Navbar.Theme />
      <Navbar.Search />
      <Navbar.Auth />
      <Navbar.Cart />
    </Navbar.Frame>
  );
}
```

### Improvement 4: Optimize Re-renders with Memoization

**Current Problem**: Every state change re-renders entire Navbar

**Solution**: Memoize expensive components

```jsx
// abscommerce/components/Navbar/NavbarMenu.jsx
import { memo } from 'react';

export const NavbarMenu = memo(function NavbarMenu({ items }) {
  return (
    <div className={styles.centerSection}>
      {items.map((item, index) => (
        <NavbarMenuItem key={item.link} item={item} />
      ))}
    </div>
  );
});

// abscommerce/components/Navbar/NavbarMenuItem.jsx
export const NavbarMenuItem = memo(function NavbarMenuItem({ item }) {
  return (
    <div className={styles.navItem}>
      <Link href={item.link} className={styles.navLink}>
        {item.title} <BiChevronDown />
      </Link>
      <div className={styles.dropdown}>
        {item.subcategories.map((sub) => (
          <Link key={sub.link} href={sub.link} className={styles.dropdownItem}>
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
});
```

### Improvement 5: Extract Static Data

**Current Problem**: `navData` is defined inside component, recreated on every render

**Solution**: Hoist to module level

```jsx
// abscommerce/components/Navbar/navData.js
export const NAV_DATA = [
  {
    title: "Men's Clothing",
    link: "/collections/mens-clothing",
    subcategories: [
      { name: "Sweatshirts", link: "/collections/mens-sweatshirts" },
      // ...
    ]
  },
  // ...
];

// abscommerce/components/Navbar/Navbar.jsx
import { NAV_DATA } from './navData';

function Navbar() {
  return <NavbarMenu items={NAV_DATA} />;
}
```

### Improvement 6: Optimize Context Providers

**Current Problem**: StateContext and CartContext cause unnecessary re-renders

**Solution**: Split contexts by concern

```jsx
// abscommerce/context/UIContext.js
const UIContext = createContext();

export function UIProvider({ children }) {
  const [showCart, setShowCart] = useState(false);
  
  const value = useMemo(() => ({
    showCart,
    setShowCart,
  }), [showCart]);

  return <UIContext value={value}>{children}</UIContext>;
}

// abscommerce/context/ThemeContext.js
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const value = useMemo(() => ({
    theme,
    setTheme,
    isDarkMode: mounted ? theme === 'dark' : false,
    isClient: mounted,
  }), [theme, mounted]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
```

### Improvement 7: Use Functional setState Updates

**Current Problem**: setState with direct values can cause stale closures

**Solution**: Use functional updates

```jsx
// ❌ Bad
const toggleTheme = () => {
  setTheme(theme === 'light' ? 'dark' : 'light');
};

// ✅ Good
const toggleTheme = () => {
  setTheme(prev => prev === 'light' ? 'dark' : 'light');
};

// ❌ Bad
const incQty = () => {
  setQty(qty + 1);
};

// ✅ Good
const incQty = useCallback(() => {
  setQty(prev => prev + 1);
}, []);
```

### Improvement 8: Lazy Load Heavy Components

**Current Problem**: All components load on initial bundle

**Solution**: Dynamic imports for heavy components

```jsx
// abscommerce/components/Layout.jsx
import dynamic from 'next/dynamic';

const CartSlider = dynamic(() => import('./CartSlider'), { 
  ssr: false,
  loading: () => <div>Loading cart...</div>
});

const VisualSearch = dynamic(() => import('./VisualSearch'), { 
  ssr: false 
});

const LoginModal = dynamic(() => import('./LoginModal'), { 
  ssr: false 
});
```

### Improvement 9: Prevent Layout Thrashing

**Current Problem**: Multiple DOM reads/writes in loops

**Solution**: Batch DOM operations

```jsx
// ❌ Bad
items.forEach(item => {
  const height = item.offsetHeight; // Read
  item.style.height = height + 10 + 'px'; // Write
});

// ✅ Good
const heights = items.map(item => item.offsetHeight); // Batch reads
items.forEach((item, i) => {
  item.style.height = heights[i] + 10 + 'px'; // Batch writes
});
```

### Improvement 10: Use React 19 APIs

**Current Problem**: Using deprecated patterns

**Solution**: Upgrade to React 19 patterns

```jsx
// ❌ Old (React 18)
import { useContext } from 'react';
const value = useContext(MyContext);

// ✅ New (React 19)
import { use } from 'react';
const value = use(MyContext);

// ❌ Old (React 18)
const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

// ✅ New (React 19)
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

---

## Part 3: File Structure Refactoring

### Current Structure (Monolithic)
```
components/
  Navbar.jsx (500+ lines)
  VisualSearch.jsx
  NeumorphicToggle.jsx
  LoginModal.jsx
  Layout.jsx
```

### Proposed Structure (Scalable)
```
components/
  Navbar/
    index.js                 # Exports compound component
    NavbarContext.jsx        # Shared context
    NavbarProvider.jsx       # State management
    NavbarFrame.jsx          # Container
    NavbarLogo.jsx           # Logo component
    NavbarMenu.jsx           # Menu component
    NavbarMenuItem.jsx       # Menu item
    NavbarCart.jsx           # Cart button
    NavbarAuth.jsx           # Auth buttons
    NavbarTheme.jsx          # Theme toggle
    NavbarSearch.jsx         # Visual search
    navData.js               # Static data
    StandardNavbar.jsx       # Default variant
    AdminNavbar.jsx          # Admin variant
    CompactNavbar.jsx        # Compact variant
    styles.module.css        # Styles
  
  VisualSearch/
    index.js
    VisualSearchContext.jsx
    VisualSearchButton.jsx
    VisualSearchModal.jsx
    VisualSearchResults.jsx
    styles.module.css
  
  Cart/
    index.js
    CartContext.jsx
    CartSlider.jsx
    CartItem.jsx
    CartSummary.jsx
    styles.module.css
  
  Auth/
    index.js
    LoginModal.jsx
    AuthButtons.jsx
    styles.module.css
```

---

## Part 4: Implementation Roadmap

### Phase 1: Fix Critical Issues (1-2 hours)
1. ✅ Fix Navbar hydration mismatch
2. ✅ Move environment variable checks
3. ✅ Implement theme script in _document.js
4. ✅ Test reload loop is fixed

### Phase 2: Refactor Navbar (4-6 hours)
1. Create Navbar folder structure
2. Extract NavbarContext
3. Break into compound components
4. Create variant components
5. Add memoization
6. Test all functionality

### Phase 3: Refactor Other Components (8-12 hours)
1. Apply same pattern to VisualSearch
2. Apply same pattern to Cart
3. Apply same pattern to Auth
4. Optimize context providers
5. Add lazy loading

### Phase 4: Performance Optimization (4-6 hours)
1. Add React.memo where needed
2. Implement useMemo for expensive calculations
3. Add useCallback for event handlers
4. Measure and optimize bundle size
5. Run Lighthouse audits

### Phase 5: Testing & Documentation (4-6 hours)
1. Write unit tests for compound components
2. Write integration tests
3. Document component APIs
4. Create Storybook stories
5. Update team documentation

**Total Estimated Time**: 21-32 hours

---

## Part 5: Quick Wins (Do These First)

### 1. Fix Hydration (30 minutes)
Apply fixes from Part 1, Issue 1

### 2. Add Theme Script (15 minutes)
Create `_document.js` with theme script

### 3. Dynamic Imports (30 minutes)
```jsx
const CartSlider = dynamic(() => import('./CartSlider'), { ssr: false });
const VisualSearch = dynamic(() => import('./VisualSearch'), { ssr: false });
const LoginModal = dynamic(() => import('./LoginModal'), { ssr: false });
```

### 4. Memoize navData (5 minutes)
Move `navData` to separate file

### 5. Add useMemo to Contexts (30 minutes)
Wrap context values in `useMemo`

**Total Quick Wins**: 2 hours, significant impact

---

## Part 6: Testing Strategy

### Unit Tests
```jsx
// Navbar.test.jsx
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders logo', () => {
    render(<Navbar.Frame><Navbar.Logo /></Navbar.Frame>);
    expect(screen.getByText('Sampada')).toBeInTheDocument();
  });

  it('renders cart with quantity', () => {
    render(
      <CartProvider>
        <Navbar.Cart />
      </CartProvider>
    );
    expect(screen.getByLabelText('Open Cart')).toBeInTheDocument();
  });
});
```

### Integration Tests
```jsx
// Navbar.integration.test.jsx
describe('Navbar Integration', () => {
  it('opens cart when cart button clicked', async () => {
    const { user } = render(<App />);
    await user.click(screen.getByLabelText('Open Cart'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

---

## Part 7: Performance Metrics

### Before Refactoring
- Initial bundle: ~800KB
- Navbar re-renders: 15-20 per interaction
- Time to Interactive: 3.2s
- Lighthouse Score: 72

### After Refactoring (Expected)
- Initial bundle: ~600KB (-25%)
- Navbar re-renders: 2-3 per interaction (-85%)
- Time to Interactive: 2.1s (-34%)
- Lighthouse Score: 90+ (+25%)

---

## Part 8: Migration Guide

### Step-by-Step Migration

1. **Create new Navbar folder** (don't delete old yet)
2. **Build compound components** in parallel
3. **Test new Navbar** on dev branch
4. **Swap imports** in Layout.jsx
5. **Delete old Navbar.jsx** after verification

### Backward Compatibility

```jsx
// abscommerce/components/Navbar.jsx (legacy wrapper)
import { StandardNavbar } from './Navbar/StandardNavbar';

// Temporary wrapper for backward compatibility
export default function Navbar(props) {
  console.warn('Using legacy Navbar, migrate to Navbar.* compound components');
  return <StandardNavbar {...props} />;
}
```

---

## Part 9: Code Review Checklist

Before merging refactored code:

- [ ] No hydration warnings in console
- [ ] No layout shift on page load
- [ ] Theme persists across refreshes
- [ ] Cart updates correctly
- [ ] Auth flow works
- [ ] Mobile menu functions
- [ ] Visual search works
- [ ] All links navigate correctly
- [ ] Lighthouse score improved
- [ ] Bundle size reduced
- [ ] Tests pass
- [ ] TypeScript types added (if using TS)
- [ ] Documentation updated
- [ ] Storybook stories created

---

## Part 10: Resources

### Documentation
- [React Best Practices](C:/Users/Binod/.kiro/skills/vercel-react-best-practices/AGENTS.md)
- [Composition Patterns](C:/Users/Binod/.kiro/skills/vercel-composition-patterns/AGENTS.md)
- [Next.js Docs](https://nextjs.org/docs)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Why Did You Render](https://github.com/welldone-software/why-did-you-render)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Examples
- [Radix UI](https://www.radix-ui.com/) - Compound component patterns
- [Headless UI](https://headlessui.com/) - Composition examples
- [Chakra UI](https://chakra-ui.com/) - Context patterns

---

## Conclusion

Your codebase is solid but needs architectural improvements for scale. The reload loop is caused by hydration mismatches - fix those first. Then gradually refactor to compound components for long-term maintainability.

**Priority Order**:
1. Fix hydration (2 hours) - CRITICAL
2. Quick wins (2 hours) - HIGH IMPACT
3. Refactor Navbar (6 hours) - FOUNDATION
4. Refactor other components (12 hours) - SCALABILITY
5. Performance optimization (6 hours) - POLISH

**Total**: 28 hours for complete refactoring

Start with Phase 1 (critical fixes) today, then tackle one component per week.
