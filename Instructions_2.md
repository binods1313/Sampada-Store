Please refine the Sampada Originals™ homepage to be fully brand-aligned, pixel-perfect on all screen sizes (mobile 320px–767px, tablet 768px–1023px, desktop 1024px+), and functionally smooth end-to-end. Apply every instruction below exactly as written.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 0 — BRAND DESIGN SYSTEM (apply globally across all pages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Define all values below as CSS custom properties in globals.css. Never hardcode hex values in component files.

COLOR PALETTE:
  --gold:           #d4a017
  --gold-deep:      #b8860b
  --gold-muted:     rgba(212, 160, 23, 0.15)
  --red-heritage:   #c0392b
  --red-deep:       #8b0000
  --onyx:           #1a0a00
  --onyx-80:        rgba(26, 10, 0, 0.80)
  --parchment:      #f5f0e8
  --parchment-50:   rgba(245, 240, 232, 0.5)

TYPOGRAPHY (load via Google Fonts with display=swap + preconnect):
  --font-display:   'Playfair Display', Georgia, serif   ← hero headings, section titles
  --font-body:      'DM Sans', system-ui, sans-serif     ← body, UI, nav, buttons
  --font-deva:      'Hind', sans-serif                   ← Devanagari elements (स emblem label)

  Hierarchy:
    H1 hero:        clamp(2.5rem, 6vw, 4.5rem), font-display, font-weight: 700
    H2 section:     clamp(1.75rem, 4vw, 2.75rem), font-display, font-weight: 600
    H3 card title:  1.125rem, font-body, font-weight: 600
    Body:           1rem / 1.7, font-body, font-weight: 400
    Label/caption:  0.8125rem, font-body, letter-spacing: 0.05em

MOTION DEFAULTS (define in globals.css):
  --ease-brand:     cubic-bezier(0.25, 0.46, 0.45, 0.94)
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1)
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

FOCUS STYLE (apply once globally):
  :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 4px; }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — MARQUEE / ANNOUNCEMENT BARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUG FIX — Hydration:
  Wrap both marquee components in an isClient guard:
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);
    if (!isClient) return 
;
  This prevents SSR/hydration mismatch on Next.js / React 18.

TOP ANNOUNCEMENT BAR:
  • Direction: right-to-left (RTL)
  • Speed: animation-duration: 15s, linear, infinite
  • Background: var(--onyx)
  • Text: var(--gold), font-body, font-size: 0.8125rem, font-weight: 500, letter-spacing: 0.06em
  • Padding: 6px 0
  • Hover: animation-play-state: paused (accessibility)
  • Mobile: reduce font to 0.75rem, maintain same speed

HERO SUB-TAGLINE MARQUEE:
  • Direction: left-to-right (LTR)
  • Speed: animation-duration: 25s, linear, infinite
  • Background strip: rgba(0, 0, 0, 0.72)
  • Text: var(--parchment), font-weight: 600, font-size: 0.9rem, padding: 9px 20px
  • Hover: animation-play-state: paused
  • Mobile: font-size: 0.8rem, padding: 7px 16px

SHARED KEYFRAME (add once to globals.css — no duplication in components):
  @keyframes marqueeRTL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes marqueeLTR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
  .marquee-track { display: flex; width: max-content; will-change: transform; }
  .marquee-track--rtl { animation: marqueeRTL var(--duration, 15s) linear infinite; }
  .marquee-track--ltr { animation: marqueeLTR var(--duration, 25s) linear infinite; }
  .marquee-wrapper:hover .marquee-track { animation-play-state: paused; }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — HERO BANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
  Desktop: two-column (text left 55%, emblem right 45%), min-height: 90vh, padding: 0 6vw
  Tablet (768–1023px): same two-column, reduce padding to 0 4vw, min-height: 75vh
  Mobile (<768px): single column, emblem stacks ABOVE headline, padding: 3rem 1.25rem, min-height: auto

ENTRANCE ANIMATION (staggered fade-up, once on load):
  @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
  Apply with animation: fadeUp 0.65s var(--ease-brand) both:
    Eyebrow label:  animation-delay: 0ms
    Headline H1:    animation-delay: 120ms
    Subline:        animation-delay: 240ms
    CTA button:     animation-delay: 360ms
    Emblem:         animation-delay: 480ms

CTA BUTTON:
  Background: linear-gradient(135deg, var(--gold) 0%, var(--gold-deep) 100%)
  Color: var(--onyx)
  Font: font-body, font-weight: 700, letter-spacing: 0.1em, text-transform: uppercase, font-size: 0.875rem
  Padding: 14px 36px, border-radius: 4px, border: none
  Hover: reverse gradient direction + box-shadow: 0 6px 24px rgba(212, 160, 23, 0.45), translateY(-2px)
  Transition: all 300ms var(--ease-brand)
  Active: scale(0.97)
  Mobile: width: 100%, padding: 16px 24px

SAMPADA EMBLEM (स):
  • Outer decorative ring: animation: spin 22s linear infinite; @keyframes spin { to { transform: rotate(360deg); } }
  • Inner स character: NO rotation — static
  • Pause outer ring on emblem hover
  • Desktop size: 280px × 280px
  • Tablet: 220px × 220px
  • Mobile: 160px × 160px, centered, margin-bottom: 2rem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — NAVIGATION BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESKTOP NAV:
  • Font: font-body, 0.875rem, letter-spacing: 0.04em, color: var(--parchment)
  • Hover: animated gold underline using ::after pseudo-element: width 0→100%, height: 2px, background: var(--gold), transition: width 280ms var(--ease-brand)
  • Active page: persistent gold underline (::after width: 100% always)
  • Cart badge: background: var(--gold), color: var(--onyx), NOT default red

STICKY SCROLL BEHAVIOR:
  • Trigger: scrollY > 80px
  • Apply: backdrop-filter: blur(14px), background: var(--onyx-80)
  • Transition: background 200ms ease, backdrop-filter 200ms ease
  • JS: window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 80))

TABLET NAV (768–1023px):
  • Keep desktop nav links but compress padding/gap by 30%
  • Logo scales down to 80% size

MOBILE NAV (<768px):
  • Hamburger menu with slide-down drawer (translateY(-100%)→translateY(0))
  • Drawer: full width, background: var(--onyx), padding: 1.5rem
  • Links stacked vertically, font-size: 1.125rem, border-bottom: 1px solid rgba(212,160,23,0.15) between items
  • Close button top-right, gold color
  • Body scroll locked when drawer open (overflow: hidden on )

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — COLLECTION CARDS (EXPLORE OUR COLLECTIONS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GRID LAYOUT:
  Desktop: 4 columns, gap: 20px
  Tablet: 2 columns, gap: 16px
  Mobile: 2 columns, gap: 12px (single column below 400px)

CARD DIMENSIONS:
  All cards: aspect-ratio: 3/4, border-radius: 10px, overflow: hidden
  Image: width: 100%, height: 100%, object-fit: cover

HOVER STATE (desktop/tablet only — use @media (hover: hover)):
  • Image: transform: scale(1.05), transition: 420ms var(--ease-brand)
  • Dark overlay: linear-gradient(to top, rgba(26,10,0,0.78) 0%, rgba(26,10,0,0.1) 55%, transparent 100%) fades in — opacity: 0→1, transition: 350ms ease
  • "Shop" CTA button inside card: slides up from bottom — translateY(12px)→translateY(0), opacity 0→1, transition: 320ms var(--ease-brand) with delay: 60ms
    Style: border: 1.5px solid var(--gold), color: var(--gold), background: transparent, border-radius: 4px, padding: 8px 20px, font-size: 0.8125rem, letter-spacing: 0.08em, text-transform: uppercase

CARD LABEL (always visible):
  Position: absolute bottom-0, padding: 14px 16px
  Name: font-display, font-size: 1.125rem, color: var(--parchment)
  Mobile: font-size: 0.9rem, padding: 10px 12px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — THREE PILLARS SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
  Desktop: 3 columns equal, gap: 2px (no visible gap — dividers handle separation)
  Tablet: 3 columns, gap: 16px
  Mobile: 1 column, gap: 0 (horizontal rule between stacked cards)

EACH PILLAR CARD:
  Background: var(--onyx)
  Border-top: 3px solid var(--gold)
  Padding: 2.5rem 2rem (tablet: 2rem 1.5rem, mobile: 1.75rem 1.25rem)
  Numeral accent: Devanagari — १ २ ३ — font-deva, font-size: 2rem, color: var(--gold), display: block, margin-bottom: 1rem
  Title: font-display, 1.25rem, color: var(--gold)
  Body text: font-body, 0.9375rem, color: var(--parchment), line-height: 1.7, margin-top: 0.75rem

DIVIDERS (desktop):
  Between cards: a 1px vertical line of rgba(212,160,23,0.25) OR the ✦ diamond character centered vertically at 1.25rem, color: rgba(212,160,23,0.5)

MOBILE DIVIDER:
  Between stacked cards: border-bottom: 1px solid rgba(212,160,23,0.2), margin: 0

SCROLL-IN ANIMATION:
  Use IntersectionObserver (threshold: 0.2). On enter: fadeUp 0.6s var(--ease-brand) both
  Stagger: card 1 delay 0ms, card 2 delay 100ms, card 3 delay 200ms
  One-shot: unobserve after firing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — FEATURED PRODUCTS GRID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GRID:
  Desktop: repeat(auto-fill, minmax(230px, 1fr)), gap: 20px
  Tablet: repeat(auto-fill, minmax(200px, 1fr)), gap: 16px
  Mobile: 2 columns (repeat(2, 1fr)), gap: 12px

PRODUCT CARD:
  Border: 1px solid rgba(212,160,23,0.12)
  Border-radius: 10px
  Overflow: hidden
  Background: var(--onyx) or white — match current theme
  Align-items: stretch (equal height cards)

IMAGE AREA:
  Aspect-ratio: 1/1, overflow: hidden
  Image: width:100%, height:100%, object-fit:cover, loading="lazy", decoding="async"
  MUST include explicit width and height HTML attributes to prevent CLS

PRODUCT CARD INFO (padding: 12px 14px):
  Name: font-body, 0.875rem, font-weight: 600, max 2 lines (-webkit-line-clamp: 2; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical)
  Original price: font-size: 0.8125rem, text-decoration: line-through, color: #888888
  Discounted price: font-size: 1rem, font-weight: 700, color: var(--gold)
  Sale badge: position absolute top-8px right-8px, background: var(--red-deep), color: #ffffff, font-size: 0.6875rem, font-weight: 700, padding: 3px 7px, border-radius: 4px, letter-spacing: 0.04em

CARD HOVER (desktop — @media (hover: hover)):
  box-shadow: 0 8px 32px var(--gold-muted)
  transform: translateY(-5px)
  transition: all 350ms var(--ease-brand)
  Image: scale(1.04), transition: 420ms var(--ease-brand)

QUICK-ADD BUTTON (appears on card hover only):
  Position: absolute, bottom: 0, left: 0, right: 0
  Translate: translateY(100%)→translateY(0), opacity 0→1
  Transition: 300ms var(--ease-brand)
  Style: background: linear-gradient(135deg, var(--gold), var(--gold-deep)), color: var(--onyx), font-weight: 700, font-size: 0.8125rem, letter-spacing: 0.07em, text-transform: uppercase, padding: 11px 0, border-radius: 0 0 10px 10px, border: none, width: 100%, cursor: pointer
  Mobile: always visible (no hover), font-size: 0.75rem, padding: 9px 0

FILTER + SEARCH BAR:
  Desktop: flex row — search left, filters center, sort right
  Tablet: same flex row, compress spacing
  Mobile: stack vertically — search full width top, filters row below (horizontally scrollable), sort dropdown below that

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — FOOTER SALE BANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT:
  Desktop: 3-column — text left (40%), emblem center (20%), text+CTA right (40%)
  Tablet: same 3-column but tighter padding
  Mobile: single column centered — emblem top, headline middle, CTA full-width bottom

LOGO ROTATION:
  animation: spin 20s linear infinite, will-change: transform
  Smooth easing: use cubic-bezier(0.4, 0, 0.2, 1) on pause/resume transition
  Works identically for default and uploaded logo variants (ensure the animated element wraps both variants)
  Pause on hover: .logo-wrapper:hover .logo-rotating { animation-play-state: paused }

CTA BUTTON (same style as hero CTA — import shared class):
  Mobile: width: 100%, margin-top: 1.5rem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — JOIN THE LEGACY (NEWSLETTER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION BACKGROUND: var(--onyx) with subtle radial glow: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,160,23,0.07) 0%, transparent 70%)

LAYOUT:
  Desktop: centered column, max-width: 560px, margin: auto
  Mobile: padding: 3rem 1.25rem, full width

HEADLINE: font-display, clamp(1.75rem, 4vw, 2.5rem), color: var(--gold)
SUBLINE: font-body, 1rem, color: var(--parchment-50), margin-top: 0.5rem

SOCIAL PROOF LINE (above input):
  "Join 2,000+ members of the Sampada legacy"
  Font: font-body, 0.8125rem, color: rgba(245,240,232,0.55), margin-bottom: 1.25rem, text-align: center

INPUT + BUTTON ROW:
  Desktop/tablet: flex row — input takes flex:1, button attached flush (no gap)
  Mobile: stack — input full width, button full width below, gap: 10px between

  Email input:
    border: 1.5px solid rgba(212,160,23,0.35)
    background: rgba(255,255,255,0.04)
    color: var(--parchment)
    border-radius: 6px 0 0 6px (desktop) / 6px (mobile)
    padding: 13px 16px, font-size: 0.9375rem
    Placeholder color: rgba(245,240,232,0.35)
    Focus: border-color: var(--gold), box-shadow: 0 0 0 3px rgba(212,160,23,0.18)

  "Get 10% Off" button:
    background: linear-gradient(135deg, var(--gold), var(--gold-deep))
    color: var(--onyx), font-weight: 700, letter-spacing: 0.08em, text-transform: uppercase
    border-radius: 0 6px 6px 0 (desktop) / 6px (mobile)
    padding: 13px 24px, border: none, cursor: pointer
    Hover: reverse gradient + box-shadow: 0 4px 16px rgba(212,160,23,0.4)

SUCCESS STATE (no page reload):
  Replace button text with: ✓ You're in the Legacy
  Add subtle scale(1.02) pulse animation on success (once, 400ms)
  Disable input + button after submit

PRIVACY NOTE (below input row):
  "We respect your privacy. Unsubscribe anytime."
  Font-size: 0.75rem, color: rgba(245,240,232,0.38), text-align: center, margin-top: 10px

CHECKBOX (if present):
  Custom styled: border: 1px solid rgba(212,160,23,0.4), background: transparent, checked state fill: var(--gold)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — ACCESSIBILITY + PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTRAST:
  ALL text on gold backgrounds must use var(--onyx) — verify 4.5:1 minimum (WCAG AA)
  ALL text on red backgrounds must use #ffffff — verify 4.5:1 minimum
  Body text on var(--onyx): use var(--parchment) — verify passes AA

IMAGES:
  Convert all hero, collection, and product images to .webp with  + JPEG fallback
  Target file sizes: hero <150KB, collection cards <80KB, product thumbnails <40KB
  All  tags: add loading="lazy" decoding="async" + explicit width + height

FONTS:
  Google Fonts: add  and  in 
  Use only required weights: Playfair Display 600,700 — DM Sans 400,500,600 — Hind 400,500
  Add display=swap to all font URLs

BROWSER TESTING:
  Test marquee hydration + animations in: Chrome 124+, Firefox 125+, Safari 17+
  Check for FOUC on animated sections — add initial opacity:0 to animated elements, remove via JS after mount
  Verify mobile tap targets are minimum 44×44px (buttons, nav links, card CTAs)

SEMANTIC HTML:
  
 with aria-label="Main navigation"
  
 wrapping primary content
  
 with aria-labelledby for each homepage section
  All icon-only buttons must have aria-label
  Product images: descriptive alt text (not "product image")
  Decorative emblem ring: aria-hidden="true"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 — BREAKPOINT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Define in globals.css:
  --bp-mobile:  767px   (max-width)
  --bp-tablet:  768px   (min-width)
  --bp-desktop: 1024px  (min-width)
  --bp-wide:    1280px  (min-width)

Mobile-first approach: write base styles for mobile, use min-width media queries to enhance upward.

Key layout shifts by breakpoint:
  <480px:   Single column everywhere, all font sizes at minimum clamp value, all paddings at minimum
  480–767px: 2-col product grid, 2-col collection grid, stacked hero
  768–1023px: 2-col collection, full nav (compressed), 2-col banner layouts, desktop product grid
  1024px+:   Full 4-col collections, full desktop hero, sticky nav active, all hover states active

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DELIVERY CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before handing back, confirm:
  [ ] All CSS custom properties defined in globals.css
  [ ] No hardcoded hex values in component files
  [ ] Both marquees hydrate without console errors
  [ ] Hero entrance animation fires once on load, not on every re-render
  [ ] No layout shift (CLS) on image load — verify in Chrome DevTools
  [ ] Mobile nav drawer opens/closes without scroll bleed
  [ ] Quick-Add button visible on mobile (no hover dependency)
  [ ] Newsletter success state works without page reload
  [ ] Lighthouse scores: Performance ≥85, Accessibility ≥90, Best Practices ≥90
  [ ] Tested on real device: iPhone SE (375px), iPad (768px), standard desktop (1440px)

  