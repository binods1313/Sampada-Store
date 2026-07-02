# Design System Master File — Sampada Store

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Sampada Store  
**Tagline:** "Wear Your Legacy" | "Prosper in Style" | "Generational Wealth"  
**Category:** Premium Indian Heritage Streetwear / E-commerce  
**Updated:** 2026-03-30

---

## Brand Identity

**Mood:** Bold, commanding, cultural pride, legacy, aspirational, powerful  
**Personality:** Indian heritage, generational wealth, premium streetwear, rooted  
**Tone:** Confident, strong, culturally proud, uncompromising  

**NOT:** Soft, feminine, pastel, airy, delicate, minimalist luxury

---

## Color Palette — CORRECTED

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Primary Gold** | `#C9A227` | `--color-gold` | Logo, accents, borders, icons |
| **Secondary Maroon** | `#8B0000` | `--color-maroon` | CTA buttons, highlights |
| **Dark Background** | `#1A1A1A` | `--color-dark-bg` | Navbar, footer, dark sections |
| **Dark Card** | `#1E1E2E` | `--color-dark-card` | Widget backgrounds, cards |
| **Light Background** | `#F5F0E8` | `--color-light-bg` | Page body, light sections |
| **Accent Gold** | `#FFD700` | `--color-gold-bright` | Hover states, highlights |
| **Text Dark** | `#1A1A1A` | `--color-text-dark` | Text on light backgrounds |
| **Text Light** | `#F5F0E8` | `--color-text-light` | Text on dark backgrounds |
| **Gold Muted** | `#B8941F` | `--color-gold-muted` | Disabled states, borders |

**Signature Combination:** Gold (`#C9A227`) on Dark (`#1A1A1A` / `#1E1E2E`)

---

## Typography

### Heading Font
- **Family:** `Inter, system-ui, -apple-system, sans-serif`
- **Weight:** `700` (Bold) / `800` (Extra Bold)
- **Style:** Impactful, strong, commanding
- **NOT:** Playfair Display, serif, feminine scripts

### Body Font
- **Family:** `Inter, Poppins, system-ui, sans-serif`
- **Weight:** `400` (Regular) / `500` (Medium)
- **Size:** `16px` minimum on mobile

### CSS Import
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
```

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | `48px` / `3rem` | `800` | `1.1` |
| H2 | `36px` / `2.25rem` | `700` | `1.2` |
| H3 | `24px` / `1.5rem` | `700` | `1.3` |
| H4 | `20px` / `1.25rem` | `600` | `1.4` |
| Body | `16px` / `1rem` | `400` | `1.6` |
| Small | `14px` / `0.875rem` | `400` | `1.5` |
| Caption | `12px` / `0.75rem` | `500` | `1.4` |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Icon gaps, tight |
| `--space-sm` | `8px` / `0.5rem` | Inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

---

## Shadows (Warm Gold-Tinted)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift on dark |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(201, 162, 39, 0.2)` | Gold-glow hover |
| `--shadow-xl` | `0 20px 25px rgba(201, 162, 39, 0.3)` | Featured cards |
| `--shadow-gold` | `0 0 20px rgba(201, 162, 39, 0.4)` | Gold accent glow |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Small buttons, chips |
| `--radius-md` | `8px` | Inputs, cards |
| `--radius-lg` | `12px` | Large cards, modals |
| `--radius-xl` | `16px` | Hero images, featured |
| `--radius-full` | `9999px` | Pills, avatars |

---

## Component Specs

### Buttons

```css
/* Primary CTA - Maroon */
.btn-primary {
  background: #8B0000;
  color: #F5F0E8;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid #8B0000;
  transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

.btn-primary:hover {
  background: transparent;
  border-color: #C9A227;
  color: #C9A227;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201, 162, 39, 0.3);
}

/* Secondary - Gold Border */
.btn-secondary {
  background: transparent;
  color: #C9A227;
  border: 2px solid #C9A227;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

.btn-secondary:hover {
  background: #C9A227;
  color: #1A1A1A;
  transform: translateY(-2px);
}
```

### Cards (Dark Background)

```css
.card {
  background: #1E1E2E;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(201, 162, 39, 0.2);
  box-shadow: 0 4px 6px rgba(0,0,0,0.4);
  transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

.card:hover {
  border-color: #C9A227;
  box-shadow: 0 10px 15px rgba(201, 162, 39, 0.2);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid rgba(201, 162, 39, 0.3);
  border-radius: 8px;
  font-size: 16px;
  background: #1E1E2E;
  color: #F5F0E8;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.input:focus {
  border-color: #C9A227;
  outline: none;
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.2);
}

.input::placeholder {
  color: rgba(245, 240, 232, 0.5);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.modal {
  background: #1E1E2E;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(201, 162, 39, 0.3);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
}
```

### Chips / Quick Actions

```css
.chip {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: transparent;
  border: 1px solid rgba(201, 162, 39, 0.4);
  color: #C9A227;
  transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
}

.chip:hover {
  background: #C9A227;
  color: #1A1A1A;
  border-color: #C9A227;
  transform: translateY(-1px);
}
```

### Widget Headers (Chat/Voice)

```css
.widget-header {
  background: linear-gradient(135deg, #1E1E2E 0%, #1A1A1A 100%);
  border-bottom: 2px solid #C9A227;
  padding: 16px 20px;
}

.widget-header-title {
  color: #F5F0E8;
  font-weight: 700;
  font-size: 16px;
}

.widget-header-status {
  color: rgba(245, 240, 232, 0.7);
  font-size: 12px;
}
```

---

## Gradients

```css
/* Gold Gradient - Primary Buttons, Icons */
.gradient-gold {
  background: linear-gradient(135deg, #C9A227 0%, #B8941F 100%);
}

/* Maroon Gradient - CTA */
.gradient-maroon {
  background: linear-gradient(135deg, #8B0000 0%, #6B0000 100%);
}

/* Dark Card Gradient */
.gradient-dark-card {
  background: linear-gradient(135deg, #1E1E2E 0%, #1A1A1A 100%);
}

/* Gold Border Glow */
.border-gold-glow {
  border: 1px solid #C9A227;
  box-shadow: 0 0 20px rgba(201, 162, 39, 0.3);
}
```

---

## Icons

- **Set:** Lucide React or Heroicons (SVG only)
- **Color:** `#C9A227` (gold) on dark, `#1A1A1A` on light
- **Size:** `20px` / `24px` consistent
- **NEVER:** Emojis as UI icons

```jsx
// Good
import { Sparkles, MessageCircle, Mic } from 'lucide-react';
<Sparkles className="w-5 h-5" style={{ color: '#C9A227' }} />

// Bad
<span>✨</span>
```

---

## Animation & Motion

### Durations
| Type | Duration | Easing |
|------|----------|--------|
| Button hover | `200ms` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Card hover | `200ms` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Modal enter | `250ms` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Modal exit | `200ms` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Loading pulse | `1.5s` | `cubic-bezier(0.23, 1, 0.32, 1) infinite` |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Page Pattern

**Pattern:** Bold Hero + Cultural Storytelling + Product Grid

**Section Order:**
1. Hero (full-width lifestyle image, bold headline, CTA)
2. Cultural Heritage / Brand Story
3. Featured Collections
4. Social Proof / Testimonials
5. CTA / Newsletter

---

## Anti-Patterns (Do NOT Use)

### Colors
- ❌ Pink (`#EC4899`, `#F9A8D4`)
- ❌ Lavender / Purple (`#8B5CF6` as primary)
- ❌ Soft pastels
- ❌ Neon colors
- ❌ Cool greys (use warm gold-tinted shadows)

### Typography
- ❌ Playfair Display (too feminine/soft)
- ❌ Script fonts for body
- ❌ Light font weights (< 400)
- ❌ Serif fonts for UI

### Layout
- ❌ Airy, excessive whitespace
- ❌ Soft, bubbly rounded corners (> 16px)
- ❌ Light gray shadows (use gold-tinted)
- ❌ Feminine luxury aesthetic

### Components
- ❌ White cards on light backgrounds (use dark cards)
- ❌ Neutral gray borders (use gold)
- ❌ Emojis as icons
- ❌ Missing `cursor:pointer` on clickable elements
- ❌ Instant state changes (always use transitions)

---

## Accessibility

### Contrast Ratios
- **Normal text:** Minimum 4.5:1
- **Large text:** Minimum 3:1
- **UI components:** Minimum 3:1

### Gold on Dark
```css
/* Good - Gold on dark card */
color: #C9A227;
background: #1E1E2E;
/* Contrast: 7.2:1 ✓ */

/* Bad - Gold on white */
color: #C9A227;
background: #FFFFFF;
/* Contrast: 1.8:1 ✗ */
```

### Focus States
```css
.focus-gold {
  outline: 2px solid #C9A227;
  outline-offset: 2px;
}

.focus-ring {
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.4);
}
```

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

### Visual Quality
- [ ] No emojis used as icons (use Lucide/Heroicons SVG)
- [ ] All icons are gold (`#C9A227`) on dark backgrounds
- [ ] Cards use dark background (`#1E1E2E`), NOT white/light
- [ ] Borders are gold-tinted, NOT neutral gray
- [ ] Shadows have warm gold tint, NOT cool gray

### Interaction
- [ ] `cursor:pointer` on ALL clickable elements
- [ ] Hover states use gold accent (`#C9A227` → `#FFD700`)
- [ ] Transitions are smooth (200ms, custom easing)
- [ ] Focus states visible (gold ring, 3px offset)

### Colors
- [ ] NO pink, lavender, or pastel colors
- [ ] Primary gold is `#C9A227` (not `#FFD700` as base)
- [ ] Maroon CTA is `#8B0000` (not bright red)
- [ ] Dark backgrounds are `#1A1A1A` / `#1E1E2E`

### Typography
- [ ] Headings are bold (700+)
- [ ] Body is Inter or Poppins (NOT Playfair)
- [ ] Minimum 16px body text on mobile
- [ ] Line height 1.5-1.75 for body

### Layout
- [ ] No horizontal scroll on mobile
- [ ] Content not hidden behind fixed navbars
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Touch targets 44x44px minimum

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have visible labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected
- [ ] Keyboard navigation works

---

## Brand Assets

### Logo
- **Symbol:** "स" (Devanagari letter Sa)
- **Color:** `#C9A227` (gold gradient)
- **Usage:** Header, favicon, social proof

### Taglines
- "Wear Your Legacy"
- "Prosper in Style"
- "Generational Wealth"
- "Beyond Fabric"

---

## Quick Reference CSS

```css
:root {
  /* Colors */
  --color-gold: #C9A227;
  --color-gold-bright: #FFD700;
  --color-gold-muted: #B8941F;
  --color-maroon: #8B0000;
  --color-dark-bg: #1A1A1A;
  --color-dark-card: #1E1E2E;
  --color-light-bg: #F5F0E8;
  --color-text-dark: #1A1A1A;
  --color-text-light: #F5F0E8;
  
  /* Typography */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', 'Poppins', system-ui, sans-serif;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Shadows */
  --shadow-gold: 0 0 20px rgba(201, 162, 39, 0.4);
  --shadow-gold-lg: 0 10px 15px rgba(201, 162, 39, 0.2);
  
  /* Easing */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}
```

---

**END OF MASTER FILE**
