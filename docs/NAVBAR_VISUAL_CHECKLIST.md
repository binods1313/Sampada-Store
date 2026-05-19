# Navbar Hamburger Menu - Visual Checklist

Quick visual reference for testing the hamburger menu implementation.

---

## ✅ Desktop View (1366px+)

```
┌─────────────────────────────────────────────────────────────────┐
│ Sampada  Home  Men's▾  Women's▾  His&Hers▾  Accessories▾  ...  │
│                                                                   │
│                                    [🔍] [🛒] [☰] ← HAMBURGER    │
│                                              ↑                    │
│                                    Gold border, always visible   │
└─────────────────────────────────────────────────────────────────┘
```

### Expected:
- ☰ Hamburger icon visible at far right
- Gold border: `1.5px solid #C9A84C`
- Hover: Subtle gold background
- Desktop nav links also visible

---

## ✅ Tablet View (768px - 1023px)

```
┌──────────────────────────────────────┐
│ Sampada              [🔍] [🛒] [☰]  │
│                                       │
│  (Desktop nav links hidden)          │
└──────────────────────────────────────┘
```

### Expected:
- ☰ Hamburger visible
- Desktop nav links hidden
- Search and cart icons visible

---

## ✅ Mobile View (375px)

```
┌─────────────────────────┐
│ Sampada    [🔍][🛒][☰] │
└─────────────────────────┘
```

### Expected:
- ☰ Hamburger visible
- All other icons compressed
- Responsive layout

---

## ✅ Mobile Drawer (Open State)

```
┌─────────────────────────┐                 ┌──────────────────┐
│ Sampada    [🔍][🛒][☰] │                 │ Sampada      [X] │
│                         │  ← Overlay →    │                  │
│                         │  (Click to      │ Home          →  │
│                         │   close)        │ Men's Clothing ▾ │
│                         │                 │ Women's Cloth. ▾ │
│                         │                 │ His & Hers     ▾ │
│                         │                 │ Accessories    ▾ │
│                         │                 │ Home & Living  ▾ │
│                         │                 │ Sampada Stories→ │
│                         │                 │ More           ▾ │
│                         │                 │                  │
│                         │                 │ [Sign In Button] │
│                         │                 │ [Cart Link]      │
└─────────────────────────┘                 └──────────────────┘
     Dark overlay                                Dark drawer
     (rgba(0,0,0,0.5))                          (slides from right)
```

### Expected:
- Drawer slides in from right (85% width, max 360px)
- Dark overlay behind drawer
- Close button (X) at top right
- Accordion categories with ▾ icons
- Smooth animations (Framer Motion)

---

## ✅ Accordion Expanded

```
┌──────────────────┐
│ Sampada      [X] │
│                  │
│ Home          →  │
│ Men's Clothing ▴ │ ← Expanded
│   SHOP BY PRODUCT│
│   • T-shirts     │
│   • Hoodies      │
│   • Sweatshirts  │
│   • Long Sleeves │
│   • Tank Tops    │
│   • Sportswear   │
│   • Bottoms      │
│   • Swimwear     │
│   • Shoes        │
│   • Outerwear    │
│ Women's Cloth. ▾ │
│ His & Hers     ▾ │
└──────────────────┘
```

### Expected:
- Chevron rotates 180° (▾ → ▴)
- Subcategories slide down
- Section header in uppercase
- Items indented with bullets

---

## ✅ Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Hamburger icon | Gold | `#C9A84C` |
| Hamburger border | Gold | `#C9A84C` |
| Hamburger hover bg | Gold (10% opacity) | `rgba(201, 168, 76, 0.1)` |
| Drawer background | Dark | `#0a0a0a` |
| Overlay | Black (50% opacity) | `rgba(0, 0, 0, 0.5)` |
| Text (drawer) | White | `#ffffff` |
| Accent text | Gold | `#C9A84C` |
| Dividers | Gold (30% opacity) | `rgba(201, 168, 76, 0.3)` |

---

## ✅ Animations

### Hamburger Hover:
- Duration: `0.2s ease`
- Background: Transparent → Gold (10% opacity)

### Drawer Slide-in:
- Type: `spring`
- Damping: `25`
- Stiffness: `200`
- Direction: Right → Left (`x: '100%'` → `x: 0`)

### Overlay Fade:
- Duration: `0.2s`
- Opacity: `0` → `1`

### Accordion Expand:
- Duration: `0.3s`
- Height: `0` → `auto`
- Chevron rotation: `0°` → `180°`

---

## ✅ Interaction States

### Hamburger Button:
- **Default**: Gold border, transparent background
- **Hover**: Gold border, gold background (10% opacity)
- **Active**: Opens drawer

### Drawer:
- **Opening**: Slides in from right (spring animation)
- **Open**: Fixed position, full height
- **Closing**: Slides out to right

### Overlay:
- **Visible**: When drawer is open
- **Click**: Closes drawer
- **Opacity**: 50% black

### Nav Links:
- **Default**: White text
- **Hover**: Gold text
- **Click**: Navigate + close drawer

### Accordion:
- **Collapsed**: Chevron down (▾)
- **Expanded**: Chevron up (▴)
- **Toggle**: Smooth height animation

---

## ✅ Accessibility

### ARIA Labels:
- Hamburger: `aria-label="Toggle menu"`
- Drawer: `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`
- Close button: `aria-label="Close menu"`
- Accordion: `aria-expanded="true/false"`

### Keyboard Navigation:
- **Tab**: Focus through elements
- **Enter/Space**: Activate buttons
- **Escape**: Close drawer (if implemented)

### Screen Reader:
- Announces menu state
- Reads all nav links
- Announces expanded/collapsed state

---

## ✅ Responsive Breakpoints

| Breakpoint | Hamburger | Desktop Nav | Drawer Width |
|------------|-----------|-------------|--------------|
| 1366px+ | ✅ Visible | ✅ Visible | 85% (max 360px) |
| 1024-1365px | ✅ Visible | ✅ Visible | 85% (max 360px) |
| 768-1023px | ✅ Visible | ❌ Hidden | 85% (max 360px) |
| 375-767px | ✅ Visible | ❌ Hidden | 85% (max 360px) |
| <375px | ✅ Visible | ❌ Hidden | 85% (max 360px) |

---

## ✅ Z-Index Hierarchy

```
Drawer:    z-index: 9999  (top layer)
Overlay:   z-index: 9998  (behind drawer)
Header:    z-index: 100   (normal layer)
Dropdowns: z-index: 9999  (same as drawer, but not simultaneous)
```

---

## ✅ Testing Checklist

### Visual:
- [ ] Hamburger has gold border on all screen sizes
- [ ] Hamburger icon is ☰ (Menu from lucide-react)
- [ ] Hover shows gold background
- [ ] Drawer is dark (#0a0a0a)
- [ ] Overlay is semi-transparent black
- [ ] Text is white with gold accents
- [ ] Animations are smooth

### Functional:
- [ ] Click hamburger opens drawer
- [ ] Click overlay closes drawer
- [ ] Click X button closes drawer
- [ ] Click nav link closes drawer and navigates
- [ ] Accordion expands/collapses correctly
- [ ] Chevron rotates on expand
- [ ] Body scroll disabled when drawer open

### Responsive:
- [ ] Works on desktop (1366px+)
- [ ] Works on tablet (768-1023px)
- [ ] Works on mobile (375px)
- [ ] Drawer width adjusts correctly
- [ ] No horizontal scroll

### Accessibility:
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Screen reader compatible
- [ ] Focus management correct

### Performance:
- [ ] No console errors
- [ ] Animations are 60fps
- [ ] No layout shift
- [ ] Fast interaction response

---

## 🎯 Success Criteria

All checkboxes above must be ✅ for the implementation to be considered complete.

---

**Reference Image**: `images/Navbar.JPG`  
**Test URL**: http://localhost:3000
