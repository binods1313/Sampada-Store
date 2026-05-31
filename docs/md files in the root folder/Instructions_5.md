4 tasks in one document:
Task 1 — Navbar upgrade. The "Creative Studio" entry in the More dropdown gets a full treatment: animated shimmer sweep across the button, a gradient icon box, a pulsing "NEW" badge with glow keyframe animation, and a two-line label with the "AI-Powered · Beta" subtitle. Two CSS keyframes (studioShimmer + studioPulse) go into globals.css — one line each.
Task 2 — The page itself. The entire pages/creative-studio.jsx is spec'd out with the DS design token object (single source of truth for every color, radius, transition, shadow), all data arrays pre-defined outside the component, every sub-component described with exact hover behavior, the full JSX structure with inline style references, the hero generate bar with keyboard shortcut (/ to focus, Enter to generate), and all grid layouts.
Task 3 — Wiring. Exact _app.js and Layout.jsx patches with the NO_CART_ROUTES / NO_LAYOUT_ROUTES arrays — prevents the Cart and Navbar/Footer from bleeding onto the full-screen studio page.
Task 4 — Cleanup. One rm -rf components/CreativeStudio/ command to kill the broken folder.
The checklist at the bottom gives your coder 10 checkboxes to tick off in order. Should be a single focused session.

# ╔══════════════════════════════════════════════════════════════════════╗
# ║         SAMPADA CREATIVE STUDIO — COMPLETE IMPLEMENTATION PROMPT     ║
# ║         Copy this entire document and give it to your coder.         ║
# ╚══════════════════════════════════════════════════════════════════════╝

---

## CONTEXT & MISSION

You are working on **Sampada Store** — a Next.js 16 (Pages Router) fashion e-commerce
project at `https://github.com/binods1313/Kavya-Deployment/tree/main/Kavya_AGI`.

The live site is `https://sampada.online`.

We need two things done:

1. **Build the `/creative-studio` page** — a stunning, fully self-contained, production-grade
   page that lives at `pages/creative-studio.jsx`. The existing `components/CreativeStudio/`
   folder has broken CSS dependencies — **delete it entirely** and replace with the single
   self-contained page described below.

2. **Upgrade the "Creative Studio" entry in the navbar's More dropdown** — make it visually
   unmissable: gradient badge, glow pulse, distinctive icon treatment, premium label style.

Both tasks must be done in a way that is **harmonious with the existing brand system**.
Every color, font, and spacing token must come from or extend the existing brand variables
already declared in `styles/sampada-brand.css`:

```css
--sampada-crimson: #8B1A1A
--sampada-gold:    #C9A84C
--sampada-cream:   #FAF6F0
--sampada-dark:    #1A0A08
```

---

## TASK 1 — UPGRADE THE NAVBAR "CREATIVE STUDIO" LINK

**File:** `components/HomePage/SampadaNavbar.jsx`

Find the "More" dropdown section. The current Creative Studio entry looks like a plain link.
Replace it with this premium treatment:

```jsx
{/* Creative Studio — premium entry in More dropdown */}
<a
  href="/creative-studio"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 14px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, rgba(139,26,26,0.12) 0%, rgba(201,168,76,0.08) 100%)',
    border: '1px solid rgba(201,168,76,0.3)',
    textDecoration: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    marginTop: 4,
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,26,26,0.25) 0%, rgba(201,168,76,0.18) 100%)';
    e.currentTarget.style.border = '1px solid rgba(201,168,76,0.6)';
    e.currentTarget.style.boxShadow = '0 0 18px rgba(201,168,76,0.15)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,26,26,0.12) 0%, rgba(201,168,76,0.08) 100%)';
    e.currentTarget.style.border = '1px solid rgba(201,168,76,0.3)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  {/* Animated shimmer sweep */}
  <span style={{
    position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)',
    animation: 'studioShimmer 3s infinite',
    pointerEvents: 'none',
  }} />

  {/* Icon */}
  <span style={{
    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
    background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, color: '#FAF6F0',
    boxShadow: '0 0 8px rgba(201,168,76,0.3)',
  }}>
    ✦
  </span>

  {/* Label block */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <span style={{
      fontSize: 13, fontWeight: 700, color: '#1A0A08',
      fontFamily: 'inherit', letterSpacing: '0.2px', lineHeight: 1.2,
    }}>
      Creative Studio
    </span>
    <span style={{
      fontSize: 10, color: '#8B1A1A', fontWeight: 600,
      letterSpacing: '1px', textTransform: 'uppercase',
    }}>
      AI-Powered · Beta
    </span>
  </div>

  {/* NEW badge */}
  <span style={{
    marginLeft: 'auto', padding: '2px 7px', borderRadius: 20,
    background: 'linear-gradient(135deg, #8B1A1A, #C9A84C)',
    color: '#FAF6F0', fontSize: 9, fontWeight: 700,
    letterSpacing: '0.8px', textTransform: 'uppercase',
    animation: 'studioPulse 2.5s ease-in-out infinite',
    flexShrink: 0,
  }}>
    NEW
  </span>
</a>
```

**Also add these keyframe animations to `styles/globals.css` (or inside the component
via a `<style>` tag — just ensure they're loaded once):**

```css
@keyframes studioShimmer {
  0%   { left: -100%; }
  50%  { left: 150%; }
  100% { left: 150%; }
}

@keyframes studioPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
  50%       { box-shadow: 0 0 0 5px rgba(201,168,76,0); }
}
```

---

## TASK 2 — BUILD `pages/creative-studio.jsx`

### Rules before you write a single line of code:

1. **Single file, zero external CSS imports.** No imports from `components/CreativeStudio/`.
   Delete that folder. All styles are inline using a `DS` (Design System) object defined
   at the top of this file.

2. **No Tailwind arbitrary values.** Only standard Tailwind utilities OR pure inline styles.
   This page uses pure inline styles exclusively — no className-based styling at all.

3. **No layout chrome.** This page manages its own full-screen shell. The `Layout` component
   must NOT wrap it. The global `Cart` must NOT render on this route. Instructions for both
   are in Task 3 below.

4. **Fonts.** Load via `<Head>`:
   - `Cormorant Garamond` (700) — hero title only
   - `DM Sans` (400, 600) — all UI text
   - No other font families.

5. **Responsive basics.** The layout uses CSS Grid. On screens narrower than 900px,
   the sidebar collapses (hide it, show a top bar instead with the logo + nav icons).
   You can use a `useWindowWidth()` hook for this.

---

### DESIGN SYSTEM OBJECT

Place this at the very top of the file, outside the component, as a `const DS = {...}`:

```js
const DS = {
  // Canvas
  bg:          '#110806',
  bgCard:      '#1C0D09',
  bgHover:     '#24100A',
  sidebar:     '#160A07',

  // Brand
  gold:        '#C9A84C',
  goldDim:     'rgba(201,168,76,0.5)',
  goldGlow:    'rgba(201,168,76,0.1)',
  crimson:     '#8B1A1A',
  crimsonDeep: '#6B1010',
  cream:       '#FAF6F0',
  creamDim:    'rgba(250,246,240,0.55)',
  creamFaint:  'rgba(250,246,240,0.2)',

  // Borders
  border:      'rgba(201,168,76,0.13)',
  borderHov:   'rgba(201,168,76,0.38)',

  // Gradients
  gradGold:    'linear-gradient(135deg,#C9A84C 0%,#E8D49A 50%,#C9A84C 100%)',
  gradCrimson: 'linear-gradient(135deg,#8B1A1A 0%,#6B1010 100%)',
  gradHero:    'linear-gradient(135deg,#8B1A1A 0%,#C9A84C 100%)',

  // Type
  fontDisplay: '"Cormorant Garamond", Georgia, serif',
  fontBody:    '"DM Sans", "Helvetica Neue", Arial, sans-serif',
  fontMono:    '"JetBrains Mono", monospace',

  // Shape
  r4: 4, r8: 8, r10: 10, r12: 12, r16: 16, rFull: 9999,

  // Motion
  t15: 'all 0.15s ease',
  t25: 'all 0.25s ease',

  // Elevation
  shadowCard: '0 2px 16px rgba(0,0,0,0.45)',
  shadowGold: '0 0 28px rgba(201,168,76,0.09)',
};
```

---

### DATA ARRAYS

Define these as `const` outside the component (no re-creation on render):

```js
const NAV_CREATE = [
  { label: 'Generate',      icon: '✦' },
  { label: 'Boards',        icon: '⊞' },
  { label: 'Production',    icon: '◈' },
  { label: 'Quick actions', icon: '⚡' },
];

const NAV_ASSETS = [
  { label: 'Your stuff',    icon: '◉' },
  { label: 'Custom models', icon: '⬡' },
  { label: 'Gallery',       icon: '▣' },
  { label: 'Photoshop',     icon: '⬤' },
  { label: 'Adobe Express', icon: '⬢' },
];

const START_CARDS = [
  { label: 'Start new design',  bg: DS.gold,        color: DS.bg      },
  { label: 'Upload',            bg: DS.bgCard,      color: DS.cream   },
  { label: 'Edit photos',       bg: '#0D2535',      color: DS.cream   },
  { label: 'Create video',      bg: '#1C1030',      color: DS.cream   },
  { label: 'Generate with AI',  bg: DS.gradHero,    color: DS.cream   },
];

const WAYS = [
  { label: 'Social media',  icon: '◉' },
  { label: 'Video',         icon: '▷' },
  { label: 'Photo',         icon: '◈' },
  { label: 'Document',      icon: '☰' },
  { label: 'Webpage',       icon: '⬡' },
  { label: 'Marketing',     icon: '◆' },
  { label: 'Generative AI', icon: '✦' },
];

const QUICK_ACTIONS = [
  { label: 'Remove background', icon: '✂' },
  { label: 'Resize image',      icon: '⤡' },
  { label: 'Convert to GIF',    icon: '⟳' },
  { label: 'Caption video',     icon: '▣' },
  { label: 'Edit PDF',          icon: '☰' },
  { label: 'QR Code',           icon: '⊞' },
];

const FILE_FORMATS = [
  'Poster', 'Instagram story', 'Flyer',
  'Presentation', 'Instagram post', 'Instagram reel', 'Invitation',
];

const TEMPLATE_DATA = [
  { label: 'Mock Tests',        sub: 'ABC Tutorials',   accent: '#1A3A2A' },
  { label: 'Life Quote',        sub: 'Simmi Bhaiyya',   accent: '#2A1A3A' },
  { label: 'Fashion',           sub: 'Organic Fashion', accent: '#3A1A1A' },
  { label: 'Business Seminar',  sub: 'Saba Bonne',      accent: '#1A2A3A' },
  { label: 'Fashion Bazaar',    sub: 'Drapes',          accent: '#2A3A1A' },
  { label: 'Simmi Tailors',     sub: 'Drapes',          accent: '#3A2A1A' },
];

const FEATURED_TOOLS = [
  { title: 'Text to Image',      desc: 'Generate images from a detailed text description',     accent: '#6B1010', icon: '✦' },
  { title: 'Generative Fill',    desc: 'Use a brush to remove objects or paint in new ones',   accent: '#0F3D24', icon: '◈' },
  { title: 'Text Effects',       desc: 'Apply styles or textures to text with a prompt',       accent: '#3D2A0F', icon: 'T' },
  { title: 'Generative Recolor', desc: 'Generate color variations of your vector artwork',     accent: '#0F2840', icon: '◉' },
];
```

---

### REUSABLE HOOKS (outside component)

```js
function useHover() {
  const [hovered, setHovered] = React.useState(false);
  return [hovered, {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }];
}

function useWindowWidth() {
  const [width, setWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  React.useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}
```

---

### SUB-COMPONENTS

Build each as a named function above the default export.
Each reads from `DS` directly — no props for colors or spacing.

#### `<NavItem item active onClick />`
- Left `3px` border: gold when active, transparent when not
- Background: `rgba(139,26,26,0.35)` when active, transparent when not, `rgba(201,168,76,0.06)` on hover
- Smoothly transitions via `DS.t15`
- Shows `item.icon` in a 14px span, colored `DS.gold` when active, `DS.goldDim` otherwise

#### `<SectionHeader title onViewAll />`
- `title`: 15px, 600 weight, `DS.cream`
- `onViewAll` (optional): 12px, `DS.gold`, underline, right-aligned

#### `<StartCard card />`
- Full `card.bg` background, `card.color` text
- On hover: `translateY(-2px)`, border brightens to `DS.borderHov`, box-shadow `DS.shadowGold`

#### `<WayCard item />`
- `DS.bgCard` default; on hover: `rgba(139,26,26,0.2)` bg, `DS.cream` text, icon turns `DS.gold`

#### `<QuickCard item />`
- Centered column layout
- 42px circle icon container, crimson-tinted
- On hover: lifts 2px, border glows

#### `<FormatCard label />`
- 90px min-width, 115px height
- Justified to bottom-left
- On hover: text turns `DS.gold`

#### `<TemplateCard t />`
- 145px wide, 170px tall, `t.accent` background
- Decorative gold corner gradient (top-right, 40×40px, `rgba(201,168,76,0.15)`)
- Bottom gradient overlay with label + sub text
- On hover: `translateY(-3px) scale(1.02)`, gold ring `0 0 0 1px rgba(201,168,76,0.3)`

#### `<FeaturedCard tool />`
- `tool.accent` background
- Large decorative icon watermark (top-right, 48px, opacity 0.08)
- On hover: lifts 3px, deeper shadow

---

### MAIN COMPONENT STRUCTURE

```jsx
export default function CreativeStudio() {
  const router    = useRouter();
  const width     = useWindowWidth();
  const isMobile  = width < 900;
  const inputRef  = useRef(null);

  const [activeNav, setActiveNav] = useState('Generate');
  const [prompt,    setPrompt]    = useState('');
  const [genState,  setGenState]  = useState('idle'); // 'idle' | 'loading' | 'done'

  // Keyboard shortcut: press "/" to focus the prompt bar
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || genState === 'loading') return;
    setGenState('loading');
    // TODO: wire to lib/creativeStudioApi.js when backend is ready
    await new Promise(r => setTimeout(r, 2800));
    setGenState('done');
    setTimeout(() => setGenState('idle'), 2200);
  };

  return (
    <>
      <Head>
        <title>Sampada Creative Studio — Dream Bigger</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Full-screen shell */}
      <div style={/* PAGE */}>

        {/* SIDEBAR — hidden on mobile */}
        {!isMobile && (
          <aside style={/* SIDEBAR */}>
            {/* Logo block */}
            {/* + New button */}
            {/* CREATE nav section */}
            {/* ASSETS nav section */}
            {/* Credits bar at bottom */}
          </aside>
        )}

        {/* MAIN AREA */}
        <main style={/* MAIN */}>

          {/* TOP BAR */}
          <div style={/* TOP BAR — position:sticky, top:0, zIndex:10, backdropFilter:'blur(8px)' */}>
            {/* On mobile: show logo here */}
            {/* Always: storage text, credits badge, avatar */}
          </div>

          {/* SCROLLABLE CONTENT */}
          <div style={/* CONTENT — max-width:1200px, margin:0 auto, padding:'52px 52px 100px' */}>

            {/* HERO */}
            {/* Generate bar */}
            {/* Keyboard hint: "/" to focus, Enter to generate */}

            {/* HOW WOULD YOU LIKE TO START */}
            {/* 5-column grid of StartCards */}

            {/* WAYS TO CREATE */}
            {/* 7-column grid of WayCards */}

            {/* QUICK ACTIONS */}
            {/* 6-column grid of QuickCards */}

            {/* FILE FORMATS */}
            {/* Horizontal scroll row of FormatCards */}

            {/* TEMPLATES */}
            {/* Horizontal scroll row of TemplateCards */}

            {/* FEATURED AI TOOLS */}
            {/* 4-column grid of FeaturedCards */}

          </div>
        </main>
      </div>
    </>
  );
}
```

---

### PAGE LAYOUT STYLES (inline, inside component)

```js
// Full-screen fixed shell
const pageStyle = {
  display: 'flex',
  width: '100vw', height: '100vh',
  background: DS.bg,
  color: DS.cream,
  fontFamily: DS.fontBody,
  overflow: 'hidden',
  position: 'fixed',
  top: 0, left: 0,
};

// Sidebar
const sidebarStyle = {
  width: 228, minWidth: 228, height: '100vh',
  background: DS.sidebar,
  borderRight: `1px solid ${DS.border}`,
  display: 'flex', flexDirection: 'column',
  overflowY: 'auto', flexShrink: 0,
};

// Main scroll area
const mainStyle = {
  flex: 1, height: '100vh',
  overflowY: 'auto',
  display: 'flex', flexDirection: 'column',
};

// Top bar
const topBarStyle = {
  display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
  gap: 14, padding: '12px 36px',
  borderBottom: `1px solid ${DS.border}`,
  background: DS.bg,
  flexShrink: 0,
  position: 'sticky', top: 0, zIndex: 10,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
};

// Content scroll container
const contentStyle = {
  flex: 1,
  padding: '52px 52px 100px',
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
};
```

---

### HERO SECTION (inside content div)

```jsx
<section style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 60px' }}>

  {/* Title */}
  <h1 style={{
    fontFamily: DS.fontDisplay,
    fontSize: 54, fontWeight: 700, lineHeight: 1.15, marginBottom: 14,
    background: DS.gradGold,
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }}>
    Dream Bigger with Sampada
  </h1>

  {/* Subtitle */}
  <p style={{
    fontSize: 14, color: DS.creamDim, lineHeight: 1.7,
    maxWidth: 520, margin: '0 auto 36px',
  }}>
    Experiment, imagine, and make an infinite range of creations
    with AI-powered creative engines.
  </p>

  {/* Generate bar */}
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', borderRadius: DS.r12,
    background: DS.bgCard,
    border: `1px solid ${DS.borderHov}`,
    boxShadow: DS.shadowGold,
    maxWidth: 700, margin: '0 auto',
  }}>
    <span style={{ color: DS.goldDim, fontSize: 16, flexShrink: 0 }}>✦</span>

    <input
      ref={inputRef}
      value={prompt}
      onChange={e => setPrompt(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleGenerate()}
      placeholder="Describe what you want to generate, or upload a file…"
      style={{
        flex: 1, background: 'transparent', border: 'none',
        color: DS.cream, fontSize: 14, outline: 'none',
        fontFamily: DS.fontBody, caretColor: DS.gold,
      }}
    />

    {/* Model badge */}
    <div style={{
      padding: '5px 12px', borderRadius: DS.r8, cursor: 'pointer',
      background: DS.goldGlow,
      border: `1px solid ${DS.border}`,
      color: DS.gold, fontSize: 12, fontFamily: DS.fontBody,
      whiteSpace: 'nowrap', transition: DS.t15,
    }}>
      Imagen 3 ▾
    </div>

    {/* Aspect ratio badge */}
    <div style={{
      padding: '5px 12px', borderRadius: DS.r8, cursor: 'pointer',
      background: DS.goldGlow,
      border: `1px solid ${DS.border}`,
      color: DS.cream, fontSize: 12, fontFamily: DS.fontBody,
      transition: DS.t15,
    }}>
      ⬜ ▾
    </div>

    {/* Generate button */}
    <button
      onClick={handleGenerate}
      disabled={genState === 'loading'}
      style={{
        padding: '8px 22px', borderRadius: DS.r8,
        background: genState === 'loading'
          ? 'rgba(139,26,26,0.4)'
          : DS.gradCrimson,
        border: `1px solid rgba(201,168,76,0.45)`,
        color: DS.cream, fontSize: 13, fontWeight: 600,
        cursor: genState === 'loading' ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: DS.fontBody, letterSpacing: '0.3px',
        transition: DS.t15,
        opacity: genState === 'loading' ? 0.7 : 1,
      }}
    >
      {genState === 'loading' ? '⏳ Generating…' : genState === 'done' ? '✓ Done!' : '✦ Generate'}
    </button>
  </div>

  {/* Keyboard hint */}
  <div style={{ marginTop: 10, fontSize: 11, color: DS.creamFaint, fontFamily: DS.fontBody }}>
    Press <kbd style={{
      padding: '1px 5px', borderRadius: DS.r4,
      border: `1px solid ${DS.border}`,
      fontSize: 11, color: DS.gold, fontFamily: DS.fontMono,
    }}>/</kbd> to focus &nbsp;·&nbsp; <kbd style={{
      padding: '1px 5px', borderRadius: DS.r4,
      border: `1px solid ${DS.border}`,
      fontSize: 11, color: DS.gold, fontFamily: DS.fontMono,
    }}>↵</kbd> to generate
  </div>

</section>
```

---

### SIDEBAR INTERNALS

```jsx
{/* Logo area */}
<div style={{ padding: '22px 16px 18px', borderBottom: `1px solid ${DS.border}` }}>

  {/* Logo row */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
    <div style={{
      width: 34, height: 34, borderRadius: DS.r8, flexShrink: 0,
      background: DS.gradHero,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: DS.fontDisplay, fontSize: 20, fontWeight: 700, color: DS.cream,
      boxShadow: '0 0 12px rgba(201,168,76,0.25)',
    }}>
      S
    </div>
    <div>
      <div style={{
        fontSize: 12, fontWeight: 600, color: DS.cream,
        lineHeight: 1.3, fontFamily: DS.fontBody,
      }}>
        Sampada Creative
      </div>
      <span style={{
        fontSize: 9, color: DS.gold,
        border: `1px solid ${DS.gold}`,
        padding: '1px 5px', borderRadius: DS.r4,
        display: 'inline-block', marginTop: 3,
        fontFamily: DS.fontBody, letterSpacing: '0.8px',
      }}>
        BETA
      </span>
    </div>
  </div>

  {/* + New button */}
  <button style={{
    width: '100%', padding: '10px 0', borderRadius: DS.r8,
    background: DS.gradCrimson,
    border: `1px solid rgba(201,168,76,0.35)`,
    color: DS.cream, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', letterSpacing: '0.4px',
    fontFamily: DS.fontBody, transition: DS.t15,
  }}>
    ＋ New
  </button>

</div>

{/* Nav label helper */}
{/* Usage: <NavLabel>Create</NavLabel> */}
{/* Define inline: */}
const NavLabel = ({ children }) => (
  <div style={{
    fontSize: 9, fontWeight: 700, color: DS.goldDim,
    letterSpacing: '1.8px', textTransform: 'uppercase',
    padding: '0 8px', marginBottom: 8,
    fontFamily: DS.fontBody,
  }}>
    {children}
  </div>
);

{/* CREATE section */}
<div style={{ padding: '18px 12px 8px' }}>
  <NavLabel>Create</NavLabel>
  {NAV_CREATE.map(item => (
    <NavItem
      key={item.label}
      item={item}
      active={activeNav === item.label}
      onClick={() => setActiveNav(item.label)}
    />
  ))}
</div>

{/* ASSETS section */}
<div style={{ padding: '16px 12px 8px' }}>
  <NavLabel>Assets</NavLabel>
  {NAV_ASSETS.map(item => (
    <NavItem
      key={item.label}
      item={item}
      active={activeNav === item.label}
      onClick={() => setActiveNav(item.label)}
    />
  ))}
</div>

{/* Credits bar — push to bottom with marginTop: 'auto' */}
<div style={{
  marginTop: 'auto', padding: 16,
  borderTop: `1px solid ${DS.border}`,
}}>
  <div style={{
    fontSize: 11, color: DS.creamDim, fontFamily: DS.fontBody,
    display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: 8,
  }}>
    <span style={{ color: DS.gold }}>⚡</span>
    <span>980 credits remaining</span>
  </div>
  {/* Progress bar */}
  <div style={{
    height: 3, borderRadius: DS.rFull,
    background: 'rgba(201,168,76,0.12)',
  }}>
    <div style={{
      height: '100%', width: '62%',
      borderRadius: DS.rFull,
      background: DS.gradGold,
    }} />
  </div>
</div>
```

---

### GRID LAYOUTS (use inside content div)

```jsx
{/* 5-col start grid */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 12,
}}>
  {START_CARDS.map(c => <StartCard key={c.label} card={c} />)}
</div>

{/* 7-col ways grid */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 10,
}}>
  {WAYS.map(w => <WayCard key={w.label} item={w} />)}
</div>

{/* 6-col quick actions grid */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: 10,
}}>
  {QUICK_ACTIONS.map(q => <QuickCard key={q.label} item={q} />)}
</div>

{/* Horizontal scroll rows (formats + templates) */}
<div style={{
  display: 'flex', gap: 12,
  overflowX: 'auto', paddingBottom: 6,
}}>
  {FILE_FORMATS.map(f => <FormatCard key={f} label={f} />)}
</div>

{/* 4-col featured AI tools */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 14,
}}>
  {FEATURED_TOOLS.map(t => <FeaturedCard key={t.title} tool={t} />)}
</div>
```

---

## TASK 3 — WIRE UP THE PAGE EXCLUSIONS

### `pages/_app.js`

```jsx
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Cart from '../components/Cart';
import '../styles/globals.css';

// Full-screen pages that manage their own shell
const NO_CART_ROUTES = ['/creative-studio'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showCart = !NO_CART_ROUTES.includes(router.pathname);

  return (
    <Layout>
      <Component {...pageProps} />
      {showCart && <Cart />}
    </Layout>
  );
}
```

### `components/Layout.jsx`

```jsx
import { useRouter } from 'next/router';
import Navbar from './Navbar'; // or SampadaNavbar — match existing import
import Footer from './Footer';

// Pages that render their own full-screen chrome — no Navbar/Footer
const NO_LAYOUT_ROUTES = ['/creative-studio'];

export default function Layout({ children }) {
  const { pathname } = useRouter();

  if (NO_LAYOUT_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

---

## TASK 4 — CLEANUP

```bash
# Run this from the project root to remove the broken component folder
rm -rf components/CreativeStudio/
```

If any other file imports from `components/CreativeStudio/`, remove those imports now.
The page is fully self-contained in `pages/creative-studio.jsx` — nothing else is needed.

---

## CHECKLIST FOR YOUR CODER

- [ ] `rm -rf components/CreativeStudio/`
- [ ] Create `pages/creative-studio.jsx` with everything above
- [ ] Update `components/HomePage/SampadaNavbar.jsx` — Creative Studio link in More dropdown
- [ ] Add `@keyframes studioShimmer` and `@keyframes studioPulse` to `styles/globals.css`
- [ ] Update `pages/_app.js` — `NO_CART_ROUTES` array + conditional Cart render
- [ ] Update `components/Layout.jsx` — `NO_LAYOUT_ROUTES` array + bare render branch
- [ ] Test: click Creative Studio in navbar → full-screen studio loads, no navbar/footer/cart
- [ ] Test: all other pages unaffected (Cart and Layout still render normally)
- [ ] Test: keyboard shortcut `/` focuses the prompt bar
- [ ] Test: mobile (< 900px) — sidebar hidden, top bar shown with logo

---

## BRAND GUARD RAILS

These must NEVER be violated:
- Background colors: `#110806` (page), `#1C0D09` (cards), `#160A07` (sidebar)
- Accent: ONLY `#C9A84C` (gold) and `#8B1A1A` (crimson) — no other accent colors
- Text: `#FAF6F0` (primary) and `rgba(250,246,240,0.55)` (secondary)
- Fonts: Cormorant Garamond for display, DM Sans for UI — nothing else
- All borders use `rgba(201,168,76,0.13)` at rest, `rgba(201,168,76,0.38)` on hover
- Transitions: `all 0.15s ease` for micro (hover) and `all 0.25s ease` for cards
- No shadows except `DS.shadowCard` and `DS.shadowGold` — no colored drop shadows

---

*End of prompt. The coder should be able to implement everything above in one sitting.*