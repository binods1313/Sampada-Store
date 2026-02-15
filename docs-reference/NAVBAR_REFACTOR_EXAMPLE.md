# Navbar Refactoring Example
## Complete Implementation of Compound Component Pattern

This document shows the complete refactored Navbar using compound components, following Vercel React best practices.

---

## File Structure

```
components/Navbar/
├── index.js                    # Main export
├── NavbarContext.jsx           # Shared context
├── NavbarProvider.jsx          # State management
├── NavbarFrame.jsx             # Container component
├── NavbarLogo.jsx              # Logo component
├── NavbarMenu.jsx              # Menu container
├── NavbarMenuItem.jsx          # Individual menu item
├── NavbarCart.jsx              # Cart button
├── NavbarAuth.jsx              # Auth buttons
├── NavbarTheme.jsx             # Theme toggle
├── NavbarSearch.jsx            # Visual search
├── NavbarMobileToggle.jsx      # Mobile menu button
├── variants/
│   ├── StandardNavbar.jsx      # Default navbar
│   ├── AdminNavbar.jsx         # Admin variant
│   └── CompactNavbar.jsx       # Compact variant
├── data/
│   └── navData.js              # Navigation data
└── styles/
    └── navbar.module.css       # Styles
```

---

## Implementation

### 1. NavbarContext.jsx
```jsx
'use client';
import { createContext, useContext } from 'react';

const NavbarContext = createContext(null);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('Navbar components must be used within NavbarProvider');
  }
  return context;
};

export default NavbarContext;
```

### 2. NavbarProvider.jsx
```jsx
'use client';
import { useState, useEffect } from 'react';
import NavbarContext from './NavbarContext';

export default function NavbarProvider({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const value = {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    mounted,
    toggleMobileMenu: () => setIsMobileMenuOpen(prev => !prev)
  };

  return (
    <NavbarContext.Provider value={value}>
      {children}
    </NavbarContext.Provider>
  );
}
```

### 3. NavbarFrame.jsx
```jsx
'use client';
import { useNavbar } from './NavbarContext';
import styles from './styles/navbar.module.css';

export default function NavbarFrame({ children, className = '' }) {
  const { mounted } = useNavbar();

  if (!mounted) {
    return (
      <nav className={`${styles.navbarContainer} ${className}`}>
        <div className={styles.placeholder}>Loading...</div>
      </nav>
    );
  }

  return (
    <nav className={`${styles.navbarContainer} ${className}`}>
      {children}
    </nav>
  );
}
```

### 4. NavbarLogo.jsx
```jsx
'use client';
import Link from 'next/link';
import styles from './styles/navbar.module.css';

export default function NavbarLogo({ href = '/', children = 'Sampada' }) {
  return (
    <div className={styles.leftSection}>
      <Link href={href} className={styles.logo}>
        {children}
      </Link>
    </div>
  );
}
```

### 5. NavbarMenu.jsx
```jsx
'use client';
import { useNavbar } from './NavbarContext';
import styles from './styles/navbar.module.css';

export default function NavbarMenu({ children }) {
  const { isMobileMenuOpen } = useNavbar();

  return (
    <div className={`${styles.centerSection} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
      {children}
    </div>
  );
}
```

### 6. NavbarMenuItem.jsx
```jsx
'use client';
import Link from 'next/link';
import { BiChevronDown } from 'react-icons/bi';
import styles from './styles/navbar.module.css';

export default function NavbarMenuItem({ title, href, subcategories = [] }) {
  const hasDropdown = subcategories.length > 0;

  return (
    <div className={styles.navItem}>
      <Link href={href} className={styles.navLink}>
        {title} {hasDropdown && <BiChevronDown />}
      </Link>
      {hasDropdown && (
        <div className={styles.dropdown}>
          {subcategories.map((sub, idx) => (
            <Link key={idx} href={sub.link} className={styles.dropdownItem}>
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 7. NavbarCart.jsx
```jsx
'use client';
import { AiOutlineShopping } from 'react-icons/ai';
import { useCartContext } from '../../context/CartContext';
import { useUIContext } from '../../context/StateContext';
import styles from './styles/navbar.module.css';

export default function NavbarCart() {
  const { totalQuantities = 0 } = useCartContext();
  const { setShowCart } = useUIContext();

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
```

### 8. NavbarAuth.jsx
```jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import LoginModal from '../LoginModal';
import styles from './styles/navbar.module.css';

export default function NavbarAuth() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (loading) {
    return <div className={styles.authSection}>Loading...</div>;
  }

  return (
    <>
      <div className={styles.authSection}>
        {!session ? (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className={styles.btnSignin}
          >
            Sign in
          </button>
        ) : (
          <div className={styles.userInfo}>
            <Link href="/account" className={styles.navLink}>
              Account
            </Link>
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name}
                className={styles.userAvatar}
              />
            )}
            <button onClick={() => signOut()} className={styles.btnSignout}>
              Out
            </button>
          </div>
        )}
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
```

### 9. NavbarTheme.jsx
```jsx
'use client';
import NeumorphicToggle from '../NeumorphicToggle';

export default function NavbarTheme() {
  return <NeumorphicToggle />;
}
```

### 10. NavbarSearch.jsx
```jsx
'use client';
import VisualSearch from '../VisualSearch';

export default function NavbarSearch() {
  if (process.env.NEXT_PUBLIC_FEATURE_VISUAL_SEARCH !== 'true') {
    return null;
  }

  return <VisualSearch />;
}
```

### 11. NavbarMobileToggle.jsx
```jsx
'use client';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useNavbar } from './NavbarContext';
import styles from './styles/navbar.module.css';

export default function NavbarMobileToggle() {
  const { isMobileMenuOpen, toggleMobileMenu } = useNavbar();

  return (
    <button
      className={styles.mobileMenuBtn}
      onClick={toggleMobileMenu}
      aria-label="Toggle mobile menu"
    >
      {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
    </button>
  );
}
```

### 12. data/navData.js
```js
export const navData = [
  {
    title: "Men's Clothing",
    link: "/collections/mens-clothing",
    subcategories: [
      { name: "Sweatshirts", link: "/collections/mens-sweatshirts" },
      { name: "Hoodies", link: "/collections/mens-hoodies" },
      { name: "T-Shirts", link: "/collections/mens-tshirts" },
      { name: "Long Sleeves", link: "/collections/mens-long-sleeves" },
      { name: "Outerwear", link: "/collections/mens-outerwear" },
    ]
  },
  {
    title: "Women's Clothing",
    link: "/collections/womens-clothing",
    subcategories: [
      { name: "Sweatshirts", link: "/collections/womens-sweatshirts" },
      { name: "Hoodies", link: "/collections/womens-hoodies" },
      { name: "T-Shirts", link: "/collections/womens-tshirts" },
      { name: "Skirts & Dresses", link: "/collections/womens-dresses" },
      { name: "Outerwear", link: "/collections/womens-outerwear" },
    ]
  },
  {
    title: "His & Hers",
    link: "/collections/his-hers",
    subcategories: [
      { name: "Casuals - Fixed Designs", link: "/collections/his-hers-casuals" },
      { name: "Customized - Personalized", link: "/collections/his-hers-customized" },
    ]
  },
  {
    title: "Home & Living",
    link: "/collections/home-living",
    subcategories: [
      { name: "Mugs", link: "/collections/mugs" },
      { name: "Candles", link: "/collections/candles" },
      { name: "Decor", link: "/collections/home-decor" },
      { name: "Pillows", link: "/collections/pillows" },
      { name: "Bedding", link: "/collections/bedding" },
    ]
  },
  {
    title: "Sampada Stories",
    link: "/stories",
    subcategories: [
      { name: "Fashion", link: "/stories/fashion" },
      { name: "Trends", link: "/stories/trends" },
      { name: "Behind-the-Scenes", link: "/stories/behind-the-scenes" },
      { name: "Product Stories", link: "/stories/product-stories" },
    ]
  }
];
```

### 13. variants/StandardNavbar.jsx
```jsx
'use client';
import NavbarProvider from '../NavbarProvider';
import NavbarFrame from '../NavbarFrame';
import NavbarMobileToggle from '../NavbarMobileToggle';
import NavbarLogo from '../NavbarLogo';
import NavbarMenu from '../NavbarMenu';
import NavbarMenuItem from '../NavbarMenuItem';
import NavbarTheme from '../NavbarTheme';
import NavbarSearch from '../NavbarSearch';
import NavbarAuth from '../NavbarAuth';
import NavbarCart from '../NavbarCart';
import { navData } from '../data/navData';
import styles from '../styles/navbar.module.css';

export default function StandardNavbar() {
  return (
    <NavbarProvider>
      <NavbarFrame>
        <NavbarMobileToggle />
        <NavbarLogo />
        
        <NavbarMenu>
          <NavbarMenuItem title="Home" href="/" />
          {navData.map((item, index) => (
            <NavbarMenuItem
              key={index}
              title={item.title}
              href={item.link}
              subcategories={item.subcategories}
            />
          ))}
          <NavbarMenuItem title="Contact" href="/contact" />
        </NavbarMenu>

        <div className={styles.rightSection}>
          <NavbarTheme />
          <NavbarSearch />
          <NavbarAuth />
          <NavbarCart />
        </div>
      </NavbarFrame>
    </NavbarProvider>
  );
}
```

### 14. variants/CompactNavbar.jsx
```jsx
'use client';
import NavbarProvider from '../NavbarProvider';
import NavbarFrame from '../NavbarFrame';
import NavbarLogo from '../NavbarLogo';
import NavbarCart from '../NavbarCart';
import styles from '../styles/navbar.module.css';

export default function CompactNavbar() {
  return (
    <NavbarProvider>
      <NavbarFrame className={styles.compact}>
        <NavbarLogo />
        <div className={styles.rightSection}>
          <NavbarCart />
        </div>
      </NavbarFrame>
    </NavbarProvider>
  );
}
```

### 15. index.js (Main Export)
```js
import NavbarProvider from './NavbarProvider';
import NavbarFrame from './NavbarFrame';
import NavbarLogo from './NavbarLogo';
import NavbarMenu from './NavbarMenu';
import NavbarMenuItem from './NavbarMenuItem';
import NavbarCart from './NavbarCart';
import NavbarAuth from './NavbarAuth';
import NavbarTheme from './NavbarTheme';
import NavbarSearch from './NavbarSearch';
import NavbarMobileToggle from './NavbarMobileToggle';

// Variants
import StandardNavbar from './variants/StandardNavbar';
import CompactNavbar from './variants/CompactNavbar';

// Compound component pattern
const Navbar = {
  Provider: NavbarProvider,
  Frame: NavbarFrame,
  Logo: NavbarLogo,
  Menu: NavbarMenu,
  MenuItem: NavbarMenuItem,
  Cart: NavbarCart,
  Auth: NavbarAuth,
  Theme: NavbarTheme,
  Search: NavbarSearch,
  MobileToggle: NavbarMobileToggle,
  
  // Pre-built variants
  Standard: StandardNavbar,
  Compact: CompactNavbar,
};

export default Navbar;
```

---

## Usage Examples

### Using Pre-built Variant
```jsx
// In Layout.jsx or any page
import Navbar from './components/Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar.Standard />
      <main>{children}</main>
    </>
  );
}
```

### Custom Composition
```jsx
import Navbar from './components/Navbar';

export default function CustomLayout() {
  return (
    <Navbar.Provider>
      <Navbar.Frame>
        <Navbar.Logo href="/" />
        <Navbar.Menu>
          <Navbar.MenuItem title="Shop" href="/shop" />
          <Navbar.MenuItem title="About" href="/about" />
        </Navbar.Menu>
        <Navbar.Cart />
      </Navbar.Frame>
    </Navbar.Provider>
  );
}
```

### Admin Variant
```jsx
import Navbar from './components/Navbar';

export default function AdminNavbar() {
  return (
    <Navbar.Provider>
      <Navbar.Frame className="admin-navbar">
        <Navbar.Logo href="/admin">Admin Panel</Navbar.Logo>
        <Navbar.Menu>
          <Navbar.MenuItem title="Dashboard" href="/admin/dashboard" />
          <Navbar.MenuItem title="Products" href="/admin/products" />
          <Navbar.MenuItem title="Orders" href="/admin/orders" />
        </Navbar.Menu>
        <Navbar.Auth />
      </Navbar.Frame>
    </Navbar.Provider>
  );
}
```

---

## Benefits of This Approach

### 1. Modularity
- Each component has a single responsibility
- Easy to test individual components
- Components can be reused in different contexts

### 2. Flexibility
- Mix and match components as needed
- Create custom variants without duplicating code
- Easy to add new features

### 3. Maintainability
- Changes to one component don't affect others
- Clear separation of concerns
- Easy to locate and fix bugs

### 4. Performance
- Only render what you need
- Better code splitting
- Easier to optimize individual components

### 5. Developer Experience
- Intuitive API
- Self-documenting code
- Easy to understand component relationships

### 6. Hydration Safety
- Mounted state handled in provider
- Consistent SSR/client rendering
- No hydration mismatches

---

## Migration Path

### Step 1: Create New Structure
1. Create `components/Navbar/` directory
2. Add all component files
3. Keep old `Navbar.jsx` for now

### Step 2: Test New Components
1. Create test page using new Navbar
2. Verify all functionality works
3. Check mobile responsiveness

### Step 3: Gradual Migration
1. Replace old Navbar in one page
2. Test thoroughly
3. Migrate other pages one by one

### Step 4: Cleanup
1. Remove old `Navbar.jsx`
2. Update imports across codebase
3. Remove unused styles

---

## Testing Checklist

- [ ] Desktop navigation works
- [ ] Mobile menu toggles correctly
- [ ] Dropdown menus function
- [ ] Cart updates properly
- [ ] Auth flow works (sign in/out)
- [ ] Theme toggle persists
- [ ] Visual search opens/closes
- [ ] No hydration errors
- [ ] No console warnings
- [ ] Responsive on all screen sizes
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

---

## Common Pitfalls to Avoid

1. **Don't forget the Provider**: All Navbar components must be wrapped in `NavbarProvider`
2. **Client-side only features**: Use `mounted` state for features that depend on browser APIs
3. **Context usage**: Only use `useNavbar()` inside components wrapped by Provider
4. **Style conflicts**: Use CSS modules to avoid global style conflicts
5. **Performance**: Don't pass large objects through context unnecessarily

---

## Next Steps

1. Implement this structure in your codebase
2. Test thoroughly in development
3. Monitor for hydration errors
4. Gather team feedback
5. Document any custom variants you create

---

## Related Documentation

- [REACT_REFACTORING_GUIDE.md](./REACT_REFACTORING_GUIDE.md) - General refactoring principles
- [HYDRATION_FIXES.md](./HYDRATION_FIXES.md) - Fixing hydration issues
- Next.js Documentation: https://nextjs.org/docs/messages/react-hydration-error