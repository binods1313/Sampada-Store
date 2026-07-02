import React, { useState, useEffect } from 'react';

const FONT_CATEGORIES = {
  'Sampada Picks': [
    'Cormorant Garamond',
    'Playfair Display', 
    'Cinzel',
    'Tiro Devanagari Hindi',
    'Hind',
    'Mukta',
    'Rozha One',
    'Yatra One',
    'IM Fell English'
  ],
  'Sans Serif': [
    'Inter', 'Poppins', 'Montserrat', 'Raleway', 'Nunito'
  ],
  'Serif': [
    'Merriweather', 'Lora', 'Crimson Text', 'Libre Baskerville'
  ],
  'Display': [
    'Bebas Neue', 'Oswald', 'Anton', 'Righteous'
  ],
  'Handwriting': [
    'Dancing Script', 'Pacifico', 'Satisfy', 'Great Vibes'
  ],
  'Monospace': [
    'Fira Code', 'Source Code Pro', 'Space Mono'
  ]
};

const loadGoogleFont = (fontName) => {
  const id = `font-${fontName.replace(/ /g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

// Simple Design System matching the main file
const DS = {
  bgCard: '#1C0D09',
  gold: '#C9A84C',
  goldDim: 'rgba(201,168,76,0.5)',
  cream: '#FAF6F0',
  creamDim: 'rgba(250,246,240,0.55)',
  border: 'rgba(201,168,76,0.13)',
  borderHov: 'rgba(201,168,76,0.38)',
  r8: 8,
  r12: 12,
  t15: 'all 0.15s ease',
  fontBody: '"DM Sans", "Helvetica Neue", Arial, sans-serif'
};

export default function FontSelector({ selectedFont, onSelectFont, onClose }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Sampada Picks');

  const categories = Object.keys(FONT_CATEGORIES);
  const currentFonts = search 
    ? categories.flatMap(c => FONT_CATEGORIES[c]).filter(f => f.toLowerCase().includes(search.toLowerCase()))
    : FONT_CATEGORIES[activeTab];

  // Unique fonts only in case of cross-category
  const fontsToRender = [...new Set(currentFonts)];

  // Preload visible fonts
  useEffect(() => {
    fontsToRender.forEach(loadGoogleFont);
  }, [fontsToRender]);

  return (
    <div style={{
      width: 320, height: '100%',
      background: DS.bgCard,
      borderLeft: `1px solid ${DS.border}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: DS.fontBody, color: DS.cream
    }}>
      {/* Header */}
      <div style={{ padding: 16, borderBottom: `1px solid ${DS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Fonts</h3>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: DS.creamDim, cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px' }}>
        <input 
          type="text" 
          placeholder="Search fonts..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: DS.r8,
            background: 'rgba(250,246,240,0.05)', border: `1px solid ${DS.border}`,
            color: DS.cream, fontSize: 13, outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Tabs */}
      {!search && (
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 16px', gap: 12, borderBottom: `1px solid ${DS.border}` }}>
          {categories.map(cat => (
            <div 
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                fontSize: 12, paddingBottom: 10, cursor: 'pointer', whiteSpace: 'nowrap',
                color: activeTab === cat ? DS.gold : DS.creamDim,
                borderBottom: `2px solid ${activeTab === cat ? DS.gold : 'transparent'}`,
                fontWeight: activeTab === cat ? 600 : 400,
                transition: DS.t15
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {fontsToRender.length === 0 ? (
          <div style={{ color: DS.creamDim, fontSize: 13, textAlign: 'center', marginTop: 20 }}>No fonts found</div>
        ) : (
          fontsToRender.map(font => {
            const isSelected = selectedFont === font;
            return (
              <div 
                key={font}
                onClick={() => {
                  loadGoogleFont(font);
                  onSelectFont(font);
                }}
                style={{
                  padding: '12px', borderRadius: DS.r8, cursor: 'pointer',
                  border: `1px solid ${isSelected ? DS.gold : 'transparent'}`,
                  background: isSelected ? 'rgba(201,168,76,0.1)' : 'transparent',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(250,246,240,0.03)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: DS.creamDim, marginBottom: 4 }}>{font}</div>
                  <div style={{ fontFamily: `"${font}", sans-serif`, fontSize: 16, color: DS.cream }}>
                    Sampada Creative
                  </div>
                </div>
                {isSelected && <span style={{ color: DS.gold }}>✓</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
