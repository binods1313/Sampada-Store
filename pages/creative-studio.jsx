// pages/creative-studio.jsx
// ─────────────────────────────────────────────────────────────────
// Fully self-contained. Zero external CSS. Zero imports from
// components/CreativeStudio/. All styles via the DS token object.
// ─────────────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FontSelector from '../components/CreativeStudio/FontSelector';
import CanvasEditor from '../components/CreativeStudio/CanvasEditor';

// ─────────────────────────────────────────────────────────────────
// DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────
const DS = {
  bg:          '#110806',
  bgCard:      '#1C0D09',
  bgHover:     '#24100A',
  sidebar:     '#160A07',

  gold:        '#C9A84C',
  goldDim:     'rgba(201,168,76,0.5)',
  goldGlow:    'rgba(201,168,76,0.1)',
  crimson:     '#8B1A1A',
  crimsonDeep: '#6B1010',
  cream:       '#FAF6F0',
  creamDim:    'rgba(250,246,240,0.55)',
  creamFaint:  'rgba(250,246,240,0.2)',

  border:      'rgba(201,168,76,0.13)',
  borderHov:   'rgba(201,168,76,0.38)',

  gradGold:    'linear-gradient(135deg,#C9A84C 0%,#E8D49A 50%,#C9A84C 100%)',
  gradCrimson: 'linear-gradient(135deg,#8B1A1A 0%,#6B1010 100%)',
  gradHero:    'linear-gradient(135deg,#8B1A1A 0%,#C9A84C 100%)',

  fontDisplay: '"Cormorant Garamond", Georgia, serif',
  fontBody:    '"DM Sans", "Helvetica Neue", Arial, sans-serif',
  fontMono:    '"JetBrains Mono", monospace',

  r4: 4, r8: 8, r10: 10, r12: 12, r16: 16, rFull: 9999,

  t15: 'all 0.15s ease',
  t25: 'all 0.25s ease',

  shadowCard: '0 2px 16px rgba(0,0,0,0.45)',
  shadowGold: '0 0 28px rgba(201,168,76,0.09)',
};

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────
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
  { 
    label: 'Start new design', 
    icon: '✦',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    overlay: 'rgba(201,168,76,0.75)'
  },
  { 
    label: 'Upload', 
    icon: '↑',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
    overlay: 'rgba(26,10,8,0.65)'
  },
  { 
    label: 'Edit photos', 
    icon: '◈',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80',
    overlay: 'rgba(30,58,74,0.75)'
  },
  { 
    label: 'Create video', 
    icon: '▶',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80',
    overlay: 'rgba(42,26,53,0.75)'
  },
  { 
    label: 'Generate with AI', 
    icon: '◆',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80',
    overlay: 'rgba(139,26,26,0.75)'
  },
];

const WAYS_TO_CREATE = [
  { label: 'Social media', icon: '◉',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80',
    overlay: 'rgba(26,10,8,0.72)' },
  { label: 'Video', icon: '▶',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=80',
    overlay: 'rgba(26,10,8,0.70)' },
  { label: 'Photo', icon: '◈',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=80',
    overlay: 'rgba(26,10,8,0.68)' },
  { label: 'Document', icon: '▤',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&q=80',
    overlay: 'rgba(26,10,8,0.72)' },
  { label: 'Webpage', icon: '◯',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&q=80',
    overlay: 'rgba(26,10,8,0.70)' },
  { label: 'Marketing', icon: '◆',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=300&q=80',
    overlay: 'rgba(26,10,8,0.70)' },
  { label: 'Generative AI', icon: '✦',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&q=80',
    overlay: 'rgba(139,26,26,0.72)' },
];

const QUICK_ACTIONS = [
  { label: 'Remove background', icon: '✂',
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&q=80',
    overlay: 'rgba(26,10,8,0.75)' },
  { label: 'Resize image', icon: '⤢',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
    overlay: 'rgba(26,10,8,0.75)' },
  { label: 'Convert to GIF', icon: '↻',
    image: 'https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=300&q=80',
    overlay: 'rgba(26,10,8,0.75)' },
  { label: 'Caption video', icon: 'T',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&q=80',
    overlay: 'rgba(26,10,8,0.75)' },
  { label: 'Edit PDF', icon: '▤',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&q=80',
    overlay: 'rgba(26,10,8,0.75)' },
  { label: 'QR Code', icon: '⊞',
    image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=300&q=80',
    overlay: 'rgba(26,10,8,0.75)' },
];

const FILE_FORMATS = [
  { label: 'Poster',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=200&q=80',
    overlay: 'rgba(26,10,8,0.60)' },
  { label: 'Instagram story',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80',
    overlay: 'rgba(26,10,8,0.60)' },
  { label: 'Flyer',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=200&q=80',
    overlay: 'rgba(26,10,8,0.60)' },
  { label: 'Presentation',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&q=80',
    overlay: 'rgba(26,10,8,0.60)' },
  { label: 'Instagram post',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=200&q=80',
    overlay: 'rgba(26,10,8,0.60)' },
  { label: 'Instagram reel',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200&q=80',
    overlay: 'rgba(26,10,8,0.60)' },
  { label: 'Invitation',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80',
    overlay: 'rgba(201,168,76,0.55)' },
];

const TEMPLATE_DATA = [
  { label: 'Mock Tests',       sub: 'ABC Tutorials',   image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80', overlay: 'rgba(26,58,42,0.6)' },
  { label: 'Life Quote',       sub: 'Simmi Bhaiyya',   image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80', overlay: 'rgba(42,26,58,0.6)' },
  { label: 'Fashion',          sub: 'Organic Fashion', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&q=80', overlay: 'rgba(58,26,26,0.6)' },
  { label: 'Business Seminar', sub: 'Saba Bonne',      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80', overlay: 'rgba(26,42,58,0.6)' },
  { label: 'Fashion Bazaar',   sub: 'Drapes',          image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&q=80', overlay: 'rgba(42,58,26,0.6)' },
  { label: 'Simmi Tailors',    sub: 'Drapes',          image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80', overlay: 'rgba(58,42,26,0.6)' },
];

const FEATURED_TOOLS = [
  {
    title: 'Text to Image',
    desc: 'Generate images from a detailed text description',
    icon: '✦',
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500&q=80',
    overlay: 'rgba(139,26,26,0.78)',
  },
  {
    title: 'Generative Fill',
    desc: 'Use a brush to remove objects or paint in new ones',
    icon: '◈',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80',
    overlay: 'rgba(20,60,40,0.78)',
  },
  {
    title: 'Text Effects',
    desc: 'Apply styles or textures to text with a prompt',
    icon: 'T',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500&q=80',
    overlay: 'rgba(80,50,10,0.78)',
  },
  {
    title: 'Generative Recolor',
    desc: 'Generate color variations of your vector artwork',
    icon: '◎',
    image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=500&q=80',
    overlay: 'rgba(10,30,70,0.78)',
  },
];

// ─────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────
function useHover() {
  const [hovered, setHovered] = useState(false);
  return [hovered, {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }];
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────
function NavItem({ item, active, onClick }) {
  const [hov, hProps] = useHover();
  return (
    <div
      onClick={onClick}
      {...hProps}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: DS.r8,
        cursor: 'pointer',
        borderLeft: `3px solid ${active ? DS.gold : 'transparent'}`,
        background: active
          ? 'rgba(139,26,26,0.35)'
          : hov
            ? 'rgba(201,168,76,0.06)'
            : 'transparent',
        transition: DS.t15,
        marginBottom: 2,
      }}
    >
      <span style={{
        fontSize: 14, width: 16, textAlign: 'center',
        color: active ? DS.gold : DS.goldDim,
        transition: DS.t15,
      }}>
        {item.icon}
      </span>
      <span style={{
        fontSize: 13, fontFamily: DS.fontBody,
        color: active ? DS.cream : DS.creamDim,
        fontWeight: active ? 600 : 400,
        transition: DS.t15,
      }}>
        {item.label}
      </span>
    </div>
  );
}

function NavLabel({ children }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 700, color: DS.goldDim,
      letterSpacing: '1.8px', textTransform: 'uppercase',
      padding: '0 8px', marginBottom: 8,
      fontFamily: DS.fontBody,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, onViewAll }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 16,
    }}>
      <span style={{
        fontSize: 15, fontWeight: 600, color: DS.cream,
        fontFamily: DS.fontBody,
      }}>{title}</span>
      {onViewAll && (
        <span
          onClick={onViewAll}
          style={{
            fontSize: 12, color: DS.gold,
            textDecoration: 'underline',
            cursor: 'pointer', fontFamily: DS.fontBody,
          }}
        >
          View all
        </span>
      )}
    </div>
  );
}

function StartCard({ card, onClick }) {
  const [hov, hProps] = useHover();
  return (
    <div
      {...hProps}
      onClick={onClick}
      style={{
        position: 'relative', borderRadius: 12, overflow: 'hidden',
        minHeight: 120, cursor: 'pointer',
        backgroundImage: `url(${card.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: `1px solid ${hov ? DS.borderHov : DS.border}`,
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? DS.shadowGold : DS.shadowCard,
        transition: DS.t25,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: card.overlay,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '16px'
      }}>
        <span style={{ fontSize: 24 }}>{card.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#FAF6F0', fontFamily: DS.fontBody }}>{card.label}</span>
      </div>
    </div>
  );
}

function WayCard({ item }) {
  return (
    <div
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      style={{
        position: 'relative', borderRadius: 10, overflow: 'hidden',
        height: 100, cursor: 'pointer',
        backgroundImage: `url(${item.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: '1px solid rgba(201,168,76,0.15)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: item.overlay,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 22, color: '#C9A84C' }}>{item.icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#FAF6F0' }}>{item.label}</span>
      </div>
    </div>
  );
}

function QuickCard({ item }) {
  return (
    <div
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      style={{
        position: 'relative', borderRadius: 10, overflow: 'hidden',
        height: 120, cursor: 'pointer',
        backgroundImage: `url(${item.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: '1px solid rgba(201,168,76,0.15)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: item.overlay,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          backgroundColor: 'rgba(139,26,26,0.85)',
          border: '1px solid rgba(201,168,76,0.4)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16, color: '#C9A84C',
        }}>{item.icon}</div>
        <span style={{ fontSize: 11, fontWeight: 600,
                       color: '#FAF6F0', textAlign: 'center',
                       padding: '0 8px' }}>{item.label}</span>
      </div>
    </div>
  );
}

function FormatCard({ item }) {
  return (
    <div
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      style={{
        position: 'relative', borderRadius: 10, overflow: 'hidden',
        width: 90, height: 120, cursor: 'pointer', flexShrink: 0,
        backgroundImage: `url(${item.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: '1px solid rgba(201,168,76,0.2)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: item.overlay,
        display: 'flex', alignItems: 'flex-end',
        padding: '8px',
      }}>
        <span style={{ fontSize: 10, fontWeight: 600,
                       color: '#FAF6F0', lineHeight: 1.3 }}>{item.label}</span>
      </div>
    </div>
  );
}

function TemplateCard({ t }) {
  const [hov, hProps] = useHover();
  return (
    <div
      {...hProps}
      style={{
        width: 145, height: 170, flexShrink: 0,
        borderRadius: DS.r12,
        backgroundImage: `url(${t.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        border: `1px solid ${hov ? 'rgba(201,168,76,0.3)' : DS.border}`,
        cursor: 'pointer', position: 'relative',
        overflow: 'hidden',
        transform: hov ? 'translateY(-3px) scale(1.02)' : 'none',
        boxShadow: hov ? `0 0 0 1px rgba(201,168,76,0.3), ${DS.shadowCard}` : DS.shadowCard,
        transition: DS.t25,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(26,10,8,0.95) 0%, rgba(26,10,8,0.2) 60%, transparent 100%)',
        zIndex: 1,
      }} />
      {/* Gold corner gradient */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 40, height: 40,
        background: 'rgba(201,168,76,0.15)',
        borderRadius: '0 0 0 40px',
        zIndex: 2,
      }} />
      {/* Bottom overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '8px 12px 12px', zIndex: 2,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#FAF6F0' }}>{t.label}</div>
        <div style={{ fontSize: 10, color: '#C9A84C', marginTop: 2 }}>{t.sub}</div>
      </div>
    </div>
  );
}

function FeaturedCard({ tool }) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        minHeight: 160,
        cursor: 'pointer',
        backgroundImage: `url(${tool.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(201,168,76,0.18)',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: tool.overlay,
      }} />

      {/* Top right icon */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        width: 32, height: 32, borderRadius: '50%',
        backgroundColor: 'rgba(201,168,76,0.2)',
        border: '1px solid rgba(201,168,76,0.4)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14, color: '#C9A84C',
        zIndex: 1,
      }}>{tool.icon}</div>

      {/* Bottom text */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '24px 14px 14px',
        background: 'linear-gradient(to top, rgba(26,10,8,0.9) 0%, transparent 100%)',
        zIndex: 1,
      }}>
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: '#FAF6F0', marginBottom: 4,
          fontFamily: 'Cormorant Garamond, serif',
        }}>{tool.title}</div>
        <div style={{
          fontSize: 11, color: 'rgba(250,246,240,0.65)',
          lineHeight: 1.5,
        }}>{tool.desc}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LAYOUT STYLES
// ─────────────────────────────────────────────────────────────────
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

const sidebarStyle = {
  width: 228, minWidth: 228, height: '100vh',
  background: DS.sidebar,
  borderRight: `1px solid ${DS.border}`,
  display: 'flex', flexDirection: 'column',
  overflowY: 'auto', flexShrink: 0,
};

const mainStyle = {
  flex: 1, height: '100vh',
  overflowY: 'auto',
  display: 'flex', flexDirection: 'column',
};

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

const contentStyle = {
  flex: 1,
  padding: '52px 52px 100px',
  maxWidth: 1200, width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
};

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function CreativeStudio() {
  const router   = useRouter();
  const width    = useWindowWidth();
  const isMobile = width < 900;
  const isPhone  = width < 600;
  const inputRef = useRef(null);

  const [activeNav, setActiveNav] = useState('Generate');
  const [viewMode, setViewMode] = useState('home'); // 'home' or 'canvas'
  const [prompt,    setPrompt]    = useState('');
  const [genState,  setGenState]  = useState('idle'); // 'idle'|'loading'|'done'
  const [showFonts, setShowFonts] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Inter');

  // Keyboard shortcut: "/" focuses the prompt bar
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
    await new Promise(r => setTimeout(r, 2800));
    setGenState('done');
    setTimeout(() => setGenState('idle'), 2200);
  };

  return (
    <>
      <Head>
        <title>Sampada Creative Studio — Dream Bigger</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Experiment, imagine, and make an infinite range of creations with AI-powered creative engines." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* Full-screen shell */}
      <div style={pageStyle}>

        {/* ── SIDEBAR ── */}
        {!isMobile && (
          <aside style={sidebarStyle}>
            {/* Logo block */}
            <div style={{ padding: '22px 16px 18px', borderBottom: `1px solid ${DS.border}` }}>
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

            {/* CREATE section */}
            <div style={{ padding: '18px 12px 8px' }}>
              <NavLabel>Create</NavLabel>
              {NAV_CREATE.map(item => (
                <NavItem
                  key={item.label}
                  item={item}
                  active={activeNav === item.label}
                  onClick={() => { setActiveNav(item.label); setViewMode('home'); }}
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
                  onClick={() => { setActiveNav(item.label); setViewMode('home'); }}
                />
              ))}
            </div>

            {/* Credits bar — pushed to bottom */}
            <div style={{
              marginTop: 'auto', padding: 16,
              borderTop: `1px solid ${DS.border}`,
            }}>
              <div style={{
                fontSize: 11, color: DS.creamDim, fontFamily: DS.fontBody,
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
              }}>
                <span style={{ color: DS.gold }}>⚡</span>
                <span>980 credits remaining</span>
              </div>
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
          </aside>
        )}

        {/* ── MAIN AREA ── */}
        <main style={mainStyle}>

          {/* TOP BAR */}
          <div style={topBarStyle}>
            {/* On mobile: show logo */}
            {isMobile && (
              <div style={{
                marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: DS.r8,
                  background: DS.gradHero,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: DS.fontDisplay, fontSize: 16, fontWeight: 700, color: DS.cream,
                }}>
                  S
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: DS.cream, fontFamily: DS.fontBody }}>
                  Sampada Creative
                </span>
              </div>
            )}

            {/* Storage */}
            <div style={{
              fontSize: 11, color: DS.creamDim, fontFamily: DS.fontBody,
            }}>
              2.1 GB of 5 GB used
            </div>

            {/* Credits badge */}
            <div style={{
              padding: '5px 12px', borderRadius: DS.rFull,
              background: DS.goldGlow,
              border: `1px solid ${DS.border}`,
              fontSize: 11, color: DS.gold, fontFamily: DS.fontBody,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span>⚡</span>
              <span>980 credits</span>
            </div>

            {/* Fonts Button */}
            <button 
              onClick={() => setShowFonts(true)}
              style={{
                padding: '6px 12px', borderRadius: DS.rFull,
                background: 'rgba(250,246,240,0.05)',
                border: `1px solid ${DS.border}`,
                color: DS.cream, fontSize: 12, fontFamily: DS.fontBody,
                display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer', transition: DS.t15
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = DS.borderHov; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; }}
            >
              <span>🔤</span> Fonts
            </button>

            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: DS.rFull,
              background: DS.gradHero,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: DS.cream,
              cursor: 'pointer', border: `1px solid ${DS.border}`,
            }}>
              S
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => router.back()}
                style={{
                  fontSize: 12, fontWeight: 600, color: DS.cream, fontFamily: DS.fontBody,
                  background: 'transparent', padding: '6px 14px', cursor: 'pointer',
                  borderRadius: DS.r8, border: `1px solid ${DS.border}`,
                  transition: DS.t15, display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = DS.gold; e.currentTarget.style.borderColor = DS.borderHov; e.currentTarget.style.background = DS.bgHover; }}
                onMouseLeave={e => { e.currentTarget.style.color = DS.cream; e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.background = 'transparent'; }}
              >
                <span>←</span> Go Back
              </button>
              <a
                href="/"
                style={{
                  fontSize: 12, fontWeight: 600, color: DS.cream, fontFamily: DS.fontBody,
                  background: DS.bgCard, padding: '6px 14px', cursor: 'pointer',
                  borderRadius: DS.r8, border: `1px solid ${DS.border}`, textDecoration: 'none',
                  transition: DS.t15, display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = DS.gold; e.currentTarget.style.borderColor = DS.borderHov; e.currentTarget.style.background = DS.bgHover; }}
                onMouseLeave={e => { e.currentTarget.style.color = DS.cream; e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.background = DS.bgCard; }}
              >
                <span>🏠</span> Home
              </a>
            </div>
          </div>

          {/* ── SCROLLABLE CONTENT ── */}
          {viewMode === 'canvas' ? (<CanvasEditor onBack={() => setViewMode('home')} />) : (<div style={{ ...contentStyle, padding: isPhone ? '24px 16px 80px' : isMobile ? '32px 32px 100px' : '52px 52px 100px' }}>

            {/* VIEWS RENDERER */}
            {activeNav === 'Generate' && (
              <>
                <section style={{ marginBottom: 48, textAlign: 'center' }}>
              <h1 style={{
                background: DS.gradGold,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Dream Bigger with Sampada
              </h1>

              <p style={{
                fontSize: 14, color: DS.creamDim, lineHeight: 1.7,
                maxWidth: 520, margin: '0 auto 36px', fontFamily: DS.fontBody,
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

                <div style={{
                  padding: '5px 12px', borderRadius: DS.r8, cursor: 'pointer',
                  background: DS.goldGlow,
                  border: `1px solid ${DS.border}`,
                  color: DS.gold, fontSize: 12, fontFamily: DS.fontBody,
                  whiteSpace: 'nowrap', transition: DS.t15,
                }}>
                  Imagen 3 ▾
                </div>

                <div style={{
                  padding: '5px 12px', borderRadius: DS.r8, cursor: 'pointer',
                  background: DS.goldGlow,
                  border: `1px solid ${DS.border}`,
                  color: DS.cream, fontSize: 12, fontFamily: DS.fontBody,
                  transition: DS.t15,
                }}>
                  ⬜ ▾
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={genState === 'loading'}
                  style={{
                    padding: '8px 22px', borderRadius: DS.r8,
                    background: genState === 'loading' ? 'rgba(139,26,26,0.4)' : DS.gradCrimson,
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

                {/* HOW WOULD YOU LIKE TO START */}
                <section style={{ marginBottom: 48 }}>
                  <SectionHeader title="How would you like to start?" />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                    gap: 12,
                  }}>
                    {START_CARDS.map(c => <StartCard key={c.label} card={c} onClick={() => setViewMode('canvas')} />)}
                  </div>
                </section>

                {/* WAYS TO CREATE */}
                <section style={{ marginBottom: 48 }}>
                  <SectionHeader title="Ways to create" onViewAll={() => {}} />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : isMobile ? 'repeat(3, 1fr)' : 'repeat(7, 1fr)',
                    gap: 10,
                  }}>
                    {WAYS_TO_CREATE.map(w => <WayCard key={w.label} item={w} />)}
                  </div>
                </section>

                {/* QUICK ACTIONS (First 6) */}
                <section style={{ marginBottom: 48 }}>
                  <SectionHeader title="Quick actions" />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
                    gap: 10,
                  }}>
                    {QUICK_ACTIONS.slice(0, 6).map(q => <QuickCard key={q.label} item={q} />)}
                  </div>
                </section>

                {/* FILE FORMATS */}
                <section style={{ marginBottom: 48 }}>
                  <SectionHeader title="Design for any format" onViewAll={() => {}} />
                  <div style={{
                    display: 'flex', gap: 12,
                    overflowX: 'auto', paddingBottom: 6,
                  }}>
                    {FILE_FORMATS.map(f => <FormatCard key={f.label} item={f} />)}
                  </div>
                </section>

                {/* TEMPLATES */}
                <section style={{ marginBottom: 48 }}>
                  <SectionHeader title="Start from a template" onViewAll={() => {}} />
                  <div style={{
                    display: 'flex', gap: 14,
                    overflowX: 'auto', paddingBottom: 6,
                  }}>
                    {TEMPLATE_DATA.map(t => <TemplateCard key={t.label} t={t} />)}
                  </div>
                </section>

                {/* FEATURED AI TOOLS */}
                <section style={{ marginBottom: 48 }}>
                  <SectionHeader title="Featured AI tools" onViewAll={() => {}} />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isPhone ? 'repeat(1, 1fr)' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: 14,
                  }}>
                    {FEATURED_TOOLS.map(t => <FeaturedCard key={t.title} tool={t} />)}
                  </div>
                </section>
              </>
            )}

            {activeNav === 'Boards' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
                <span style={{ fontSize: 48, color: DS.goldDim, marginBottom: 16 }}>⊞</span>
                <h2 style={{ fontSize: 24, margin: '0 0 8px 0' }}>No boards yet</h2>
                <p style={{ color: DS.creamDim, margin: '0 0 24px 0', fontSize: 14 }}>Your saved design boards will appear here</p>
                <button style={{
                  padding: '10px 24px', borderRadius: DS.r8,
                  background: DS.gradCrimson, border: `1px solid rgba(201,168,76,0.35)`,
                  color: DS.cream, fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>Create your first board</button>
              </div>
            )}

            {activeNav === 'Production' && (
              <div>
                <SectionHeader title="In Production" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {[
                    { title: "Winter Collection Banner", status: "In Progress", badge: DS.crimson, icon: '◈' },
                    { title: "Sampada Logo Variants", status: "Draft", badge: DS.gold, icon: '⬡' },
                    { title: "Stories Post Series", status: "Completed", badge: '#2A5A3A', icon: '◉' }
                  ].map(proj => (
                    <div key={proj.title} style={{
                      padding: 16, borderRadius: DS.r12, background: DS.bgCard,
                      border: `1px solid ${DS.border}`, display: 'flex', flexDirection: 'column'
                    }}>
                      <div style={{ height: 120, background: '#111', borderRadius: DS.r8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: DS.goldDim }}>{proj.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{proj.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: DS.r4, background: proj.badge, color: '#fff' }}>{proj.status}</span>
                        <button style={{ background: 'transparent', border: `1px solid ${DS.gold}`, color: DS.gold, padding: '4px 12px', borderRadius: DS.r4, fontSize: 12, cursor: 'pointer' }}>Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeNav === 'Quick actions' && (
              <div>
                <SectionHeader title="All Quick Actions" />
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                }}>
                  {QUICK_ACTIONS.map(q => <QuickCard key={q.label} item={q} />)}
                </div>
              </div>
            )}

            {activeNav === 'Your stuff' && (
              <div>
                <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${DS.border}`, marginBottom: 24 }}>
                  <div style={{ color: DS.gold, borderBottom: `2px solid ${DS.gold}`, paddingBottom: 8, fontSize: 14, fontWeight: 600 }}>Uploads</div>
                  <div style={{ color: DS.creamDim, paddingBottom: 8, fontSize: 14, cursor: 'pointer' }}>Designs</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', border: `2px dashed ${DS.border}`, borderRadius: DS.r12 }}>
                  <span style={{ fontSize: 32, color: DS.goldDim, marginBottom: 16 }}>↑</span>
                  <button style={{
                    padding: '8px 20px', borderRadius: DS.r8,
                    background: DS.bgCard, border: `1px solid ${DS.border}`,
                    color: DS.cream, fontSize: 14, cursor: 'pointer'
                  }}>Drag files here or click to upload</button>
                </div>
              </div>
            )}

            {activeNav === 'Gallery' && (
              <div>
                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', marginBottom: 24 }}>
                  {['All', 'Social Media', 'Print', 'Presentations', 'Marketing', 'Indian Festivals'].map((filter, i) => (
                    <div key={filter} style={{
                      padding: '6px 16px', borderRadius: DS.rFull,
                      background: i === 0 ? DS.goldGlow : 'transparent',
                      border: `1px solid ${i === 0 ? DS.gold : DS.border}`,
                      color: i === 0 ? DS.gold : DS.creamDim,
                      fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'
                    }}>{filter}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 16 }}>
                  {TEMPLATE_DATA.map(t => <TemplateCard key={t.label} t={t} />)}
                  {/* Duplicate to show more items in gallery */}
                  {TEMPLATE_DATA.map(t => <TemplateCard key={t.label + '_2'} t={{...t, label: t.label + ' v2'}} />)}
                </div>
              </div>
            )}

            {(activeNav === 'Photoshop' || activeNav === 'Adobe Express') && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: DS.r12, marginBottom: 24,
                  background: DS.gradHero, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, fontWeight: 700, color: DS.cream,
                  boxShadow: '0 0 24px rgba(201,168,76,0.25)',
                }}>S</div>
                <h2 style={{ fontSize: 28, margin: '0 0 12px 0' }}>Integration Coming Soon</h2>
                <p style={{ color: DS.creamDim, margin: '0 0 32px 0', fontSize: 15, maxWidth: 400 }}>We're building a seamless connection with {activeNav}.</p>
                <button style={{
                  padding: '10px 24px', borderRadius: DS.r8,
                  background: 'transparent', border: `1px solid ${DS.gold}`,
                  color: DS.gold, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  transition: DS.t15
                }}
                onMouseEnter={e => { e.currentTarget.style.background = DS.goldGlow; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>Notify me when ready</button>
              </div>
            )}

          </div>
        )}

          {/* FONT SELECTOR SLIDE-OVER */}
          {showFonts && (
            <div style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50,
              boxShadow: '-4px 0 24px rgba(0,0,0,0.5)'
            }}>
              <FontSelector 
                selectedFont={selectedFont}
                onSelectFont={setSelectedFont}
                onClose={() => setShowFonts(false)}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
