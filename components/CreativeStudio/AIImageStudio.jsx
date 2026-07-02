// components/CreativeStudio/AIImageStudio.jsx
// AI Design Studio for Sampada Creative Studio

import React, { useState } from 'react';

const DS = {
  dark:        'var(--sampada-dark)',
  gold:        'var(--sampada-gold)',
  crimson:     'var(--sampada-crimson)',
  cream:       'var(--sampada-cream)',
  geminiBlue:  '#4285F4',
  fontDisplay: '"Libre Baskerville", Georgia, serif',
  fontBody:    'Inter, "Helvetica Neue", Arial, sans-serif',
  fontMono:    '"JetBrains Mono", monospace',
  r6: 6, r8: 8, r12: 12, rFull: 9999,
};

const SECTION_LABEL = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '3px',
  color: 'var(--sampada-gold)',
  fontFamily: 'Inter, sans-serif',
  textTransform: 'uppercase',
  marginBottom: 12,
};

const SECTION_DIVIDER = {
  borderTop: '1px solid rgba(26,10,8,0.08)',
  margin: '24px 0',
};

const SAMPADA_PRESETS = [
  {
    label: '📸 Product Hero Shot',
    prompt: 'Indian woman wearing an elegant silk saree in a Rajasthani haveli courtyard, golden hour, editorial fashion photography',
    productType: 'fashion editorial',
    aspectRatio: '3:4',
  },
  {
    label: '📱 Instagram Post',
    prompt: 'Flat lay of Indian heritage fabric with gold jewelry and rose petals on cream linen, premium lifestyle photography',
    productType: 'social media post',
    aspectRatio: '1:1',
  },
  {
    label: '🎬 YouTube Thumbnail',
    prompt: 'Dramatic portrait of Indian woman in traditional attire with modern accessories, cinematic lighting, crimson and gold tones',
    productType: 'YouTube thumbnail',
    aspectRatio: '16:9',
  },
  {
    label: '📖 Blog Cover',
    prompt: 'Wide editorial banner showing Indian textile craftsmanship, artisan hands working on Zardozi embroidery, warm moody lighting',
    productType: 'blog cover image',
    aspectRatio: '16:9',
  },
  {
    label: '🛍️ Sale Banner',
    prompt: 'Luxury Indian fashion sale background, deep crimson silk fabric with gold zari weave, soft bokeh golden lights',
    productType: 'promotional banner',
    aspectRatio: '16:9',
  },
  {
    label: '🪡 Fabric Print',
    prompt: 'Intricate Indian block print pattern, traditional Mughal floral motifs, deep crimson and gold on ivory, seamless repeating tile',
    productType: 'fabric print design',
    aspectRatio: '1:1',
  },
];

const ASPECT_RATIOS = [
  { label: 'Square',     value: '1:1',   hint: '1080×1080' },
  { label: 'Portrait',   value: '3:4',   hint: '1080×1440' },
  { label: 'Landscape',  value: '4:3',   hint: '1440×1080' },
  { label: 'Widescreen', value: '16:9',  hint: '1280×720' },
];

const STYLES = [
  { id: 'heritage', label: '🏛️ Heritage' },
  { id: 'modern', label: '✨ Modern' },
  { id: 'festive', label: '🪔 Festive' },
  { id: 'product', label: '📦 Product' },
  { id: 'social', label: '📱 Social' },
];

function Toast({ message, type = 'success' }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
      background: type === 'success' ? '#1a3a2a' : '#3a0a0a',
      border: `1px solid ${type === 'success' ? '#2a6a3e' : DS.crimson}`,
      borderRadius: DS.r8, padding: '12px 20px',
      color: DS.cream, fontFamily: DS.fontBody, fontSize: 13,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 10,
      animation: 'fadeSlideUp 0.3s ease',
    }}>
      <span>{type === 'success' ? '✓' : '⚠'}</span>
      {message}
    </div>
  );
}

function ShimmerCard() {
  return (
    <div style={{
      borderRadius: DS.r12,
      overflow: 'hidden',
      background: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        height: 220,
        background: 'linear-gradient(90deg, rgba(201,168,76,0.08) 25%, rgba(201,168,76,0.2) 50%, rgba(201,168,76,0.08) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{ padding: '12px' }}>
        <div style={{ height: 28, borderRadius: DS.r6, background: 'rgba(26,10,8,0.06)' }} />
      </div>
    </div>
  );
}

export default function AIImageStudio() {
  const [prompt, setPrompt]             = useState('');
  const [productType, setProductType]   = useState('Indian fashion apparel');
  const [aspectRatio, setAspectRatio]   = useState('1:1');
  const [selectedModel, setSelectedModel] = useState('grok');
  const [selectedStyle, setSelectedStyle] = useState('heritage');
  const [loading, setLoading]           = useState(false);
  const [results, setResults]           = useState([]);
  const [error, setError]               = useState(null);
  const [toast, setToast]               = useState(null);
  const [exporting, setExporting]       = useState(null);
  const [genCount, setGenCount]         = useState(0);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const applyPreset = (preset) => {
    setPrompt(preset.prompt);
    setProductType(preset.productType);
    setAspectRatio(preset.aspectRatio);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResults([]);
    setError(null);

    const isGrok = selectedModel === 'grok';
    const endpoint = isGrok
      ? '/api/creative/grok-imagine'
      : '/api/creative/generate-design';

    const body = isGrok
      ? { prompt, style: selectedStyle }
      : { prompt, productType, aspectRatio, sampleCount: 4 };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Generation failed — try a different prompt.');
      } else {
        const normalized = isGrok
          ? (data.images || []).map((img) => ({ src: img.url, type: 'url' }))
          : (data.designs || []).map((img) => ({
              src: `data:${img.mimeType || 'image/png'};base64,${img.base64}`,
              type: 'base64',
              mimeType: img.mimeType || 'image/png',
              base64: img.base64,
            }));
        setResults(normalized);
        setGenCount((c) => c + 1);
      }
    } catch (err) {
      setError('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (result, idx) => {
    try {
      if (result.type === 'url') {
        const blob = await fetch(result.src).then((r) => r.blob());
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `sampada-design-${idx + 1}.jpg`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else {
        const a = document.createElement('a');
        a.href = result.src;
        a.download = `sampada-design-${idx + 1}.jpg`;
        a.click();
      }
      showToast('Image downloaded!');
    } catch {
      showToast('Download failed — try again.', 'error');
    }
  };

  const handleUseAsBlogCover = async (result) => {
    try {
      await navigator.clipboard.writeText(result.src);
      showToast('Blog cover URL copied to clipboard!');
    } catch {
      showToast('Could not copy URL — try again.', 'error');
    }
  };

  const exportToSanity = async (result, label, idx) => {
    if (result.type !== 'base64' || !result.base64) return;
    setExporting(idx);
    try {
      const byteStr = atob(result.base64);
      const ab = new ArrayBuffer(byteStr.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
      const blob = new Blob([ab], { type: result.mimeType });

      const { writeClient } = await import('../../lib/client');
      const asset = await writeClient.assets.upload('image', blob, {
        filename: `sampada-imagen3-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`,
        contentType: result.mimeType,
      });
      showToast(`Uploaded to Sanity! Asset ID: ${asset._id}`);
    } catch (err) {
      showToast('Sanity upload failed — ensure writeClient is exported from lib/client.js', 'error');
    } finally {
      setExporting(null);
    }
  };

  const isGrokModel = selectedModel === 'grok';

  return (
    <div style={{
      fontFamily: DS.fontBody,
      maxWidth: 1000,
      background: 'transparent',
      color: 'var(--sampada-dark)',
      boxSizing: 'border-box',
    }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h2 style={{
            margin: 0,
            fontSize: 28,
            fontFamily: DS.fontDisplay,
            color: 'var(--sampada-dark)',
            fontWeight: 700,
          }}>
            ◆ AI Image Studio
          </h2>
          <div style={{
            padding: '4px 12px',
            borderRadius: 20,
            background: isGrokModel ? 'var(--sampada-crimson)' : DS.geminiBlue,
            fontSize: 11,
            color: 'white',
            letterSpacing: '2px',
            fontWeight: 700,
          }}>
            {isGrokModel ? 'GROK AURORA' : 'IMAGEN 3'}
          </div>
        </div>
        <p style={{
          margin: 0,
          fontSize: 14,
          color: 'rgba(26,10,8,0.55)',
          lineHeight: 1.6,
          marginTop: 6,
        }}>
          {isGrokModel
            ? 'Generate premium editorial images with Grok Aurora · xAI image generation'
            : 'Generate premium editorial images using Google Imagen 3 · Uses your existing Gemini API key · No monthly credit cap'}
        </p>
      </div>

      <div style={SECTION_DIVIDER} />

      {/* ── Presets ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={SECTION_LABEL}>Quick Presets</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SAMPADA_PRESETS.map(preset => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              style={{
                padding: '10px 18px',
                borderRadius: 24,
                background: 'white',
                border: '1.5px solid var(--sampada-dark)',
                color: 'var(--sampada-dark)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: DS.fontBody,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--sampada-dark)';
                e.currentTarget.style.color = 'var(--sampada-cream)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'var(--sampada-dark)';
              }}
            >
              <span style={{ fontSize: 16 }}>{preset.label.split(' ')[0]}</span>
              <span>{preset.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={SECTION_DIVIDER} />

      {/* ── Prompt ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={SECTION_LABEL}>Prompt</div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleGenerate(); }}
          placeholder="Describe the image… e.g. Indian woman in crimson silk saree, Mughal archway, editorial lighting, no text"
          rows={4}
          className="ai-studio-prompt"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'white',
            border: '2px solid rgba(201,168,76,0.4)',
            borderRadius: DS.r12,
            padding: '20px 24px',
            fontSize: 15,
            fontFamily: 'Inter, sans-serif',
            color: 'var(--sampada-dark)',
            minHeight: 120,
            resize: 'vertical',
            outline: 'none',
            caretColor: 'var(--sampada-gold)',
            lineHeight: 1.65,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'var(--sampada-gold)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <div style={{ fontSize: 12, color: 'rgba(26,10,8,0.45)', marginTop: 8 }}>
          Tip: Add &quot;no text, no watermark&quot; · Press{' '}
          <kbd style={{
            padding: '2px 6px', borderRadius: 4,
            border: '1px solid rgba(26,10,8,0.15)',
            color: 'var(--sampada-gold)',
            fontFamily: DS.fontMono,
            fontSize: 11,
            background: 'white',
          }}>⌘↵</kbd>
          {' '}to generate
        </div>
      </div>

      <div style={SECTION_DIVIDER} />

      {/* ── Style Presets ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={SECTION_LABEL}>Style</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STYLES.map((style) => {
            const isActive = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.id)}
                style={{
                  padding: '12px 22px',
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 30,
                  border: '2px solid var(--sampada-gold)',
                  background: isActive ? 'var(--sampada-gold)' : 'white',
                  color: 'var(--sampada-dark)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: isActive ? '0 4px 12px rgba(201,168,76,0.35)' : 'none',
                }}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={SECTION_DIVIDER} />

      {/* ── Product Type + Aspect Ratio row ── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={SECTION_LABEL}>Product / Use Case</div>
          <input
            value={productType}
            onChange={e => setProductType(e.target.value)}
            placeholder="e.g. silk saree, blog banner, fabric print"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'white',
              border: '1.5px solid rgba(26,10,8,0.15)',
              borderRadius: DS.r8,
              padding: '14px 18px',
              fontSize: 14,
              color: 'var(--sampada-dark)',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              caretColor: 'var(--sampada-gold)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--sampada-gold)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(26,10,8,0.15)'; }}
          />
        </div>

        <div>
          <div style={SECTION_LABEL}>Aspect Ratio</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {ASPECT_RATIOS.map(ar => {
              const isActive = aspectRatio === ar.value;
              return (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  title={ar.hint}
                  style={{
                    padding: '12px 16px',
                    borderRadius: DS.r8,
                    fontSize: 13,
                    fontWeight: 500,
                    border: `1.5px solid ${isActive ? 'var(--sampada-dark)' : 'rgba(26,10,8,0.15)'}`,
                    background: isActive ? 'var(--sampada-dark)' : 'white',
                    color: isActive ? 'var(--sampada-cream)' : 'var(--sampada-dark)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{ar.label}</span>
                  <span style={{ fontSize: 10, color: isActive ? 'rgba(250,246,240,0.7)' : 'rgba(26,10,8,0.45)' }}>{ar.hint}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={SECTION_DIVIDER} />

      {/* ── Model Toggle ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={SECTION_LABEL}>Model</div>
        <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { id: 'grok', label: '⚡ Grok Aurora', emoji: '⚡' },
            { id: 'gemini', label: '🔮 Gemini Imagen', emoji: '🔮' },
          ].map((model) => {
            const isActive = selectedModel === model.id;
            const isGrok = model.id === 'grok';
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedModel(model.id)}
                style={{
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 32,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  background: isActive
                    ? (isGrok ? 'var(--sampada-crimson)' : DS.geminiBlue)
                    : 'white',
                  color: isActive ? 'white' : 'rgba(26,10,8,0.5)',
                  border: isActive ? 'none' : '2px solid rgba(26,10,8,0.15)',
                  boxShadow: isActive
                    ? (isGrok ? '0 6px 20px rgba(139,26,26,0.35)' : '0 6px 20px rgba(66,133,244,0.35)')
                    : 'none',
                }}
              >
                <span style={{ fontSize: 18 }}>{model.emoji}</span>
                <span>{isGrok ? 'Grok Aurora' : 'Gemini Imagen'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={SECTION_DIVIDER} />

      {/* ── Generate Button ── */}
      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || loading}
        style={{
          width: '100%',
          padding: '18px 32px',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: DS.fontDisplay,
          background: !prompt.trim() || loading ? 'rgba(139,26,26,0.45)' : 'var(--sampada-crimson)',
          color: 'white',
          border: 'none',
          borderRadius: DS.r12,
          cursor: !prompt.trim() || loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.5px',
          boxShadow: !prompt.trim() || loading ? 'none' : '0 8px 24px rgba(139,26,26,0.3)',
          transition: 'all 0.2s',
          marginTop: 8,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
        onMouseEnter={e => {
          if (prompt.trim() && !loading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,26,26,0.4)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = !prompt.trim() || loading ? 'none' : '0 8px 24px rgba(139,26,26,0.3)';
        }}
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 16 }}>◌</span>
            {isGrokModel ? 'Generating with Grok Aurora...' : 'Generating with Gemini Imagen...'}
          </>
        ) : (
          <>
            <span style={{ fontSize: 16 }}>◆</span>
            {isGrokModel ? 'Generate with Grok Aurora' : 'Generate with Imagen 3'}
          </>
        )}
      </button>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: 'rgba(139,26,26,0.08)',
          border: '1px solid rgba(139,26,26,0.25)',
          borderRadius: DS.r8,
          padding: '12px 16px',
          marginBottom: 24,
          color: 'var(--sampada-crimson)',
          fontSize: 14,
          fontFamily: DS.fontBody,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>⚠</span>
          <div>
            {error}
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
              Common fix: add &quot;no text, no watermark&quot; to your prompt, or try a more descriptive description.
            </div>
          </div>
        </div>
      )}

      {/* ── Loading Shimmer ── */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
          {[0, 1, 2, 3].map(i => <ShimmerCard key={i} />)}
        </div>
      )}

      {/* ── Results Grid ── */}
      {results.length > 0 && !loading && (
        <div>
          <div style={SECTION_DIVIDER} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}>
            <div style={SECTION_LABEL}>
              Generated — {results.length} variations
            </div>
            <div style={{ fontSize: 13, color: 'rgba(26,10,8,0.45)' }}>
              Generation #{genCount} · {isGrokModel ? 'Grok Aurora' : 'Imagen 3'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {results.map((result, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: DS.r12,
                  overflow: 'hidden',
                  background: 'white',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ position: 'relative', background: '#f5f0eb' }}>
                  <img
                    src={result.src}
                    alt={`AI generation ${idx + 1}`}
                    style={{ width: '100%', display: 'block', objectFit: 'contain' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: 'rgba(26,10,8,0.75)',
                    borderRadius: DS.rFull,
                    padding: '4px 10px',
                    fontSize: 11,
                    color: 'var(--sampada-gold)',
                    fontFamily: DS.fontBody,
                    fontWeight: 600,
                  }}>
                    V{idx + 1}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, padding: 12 }}>
                  <button
                    onClick={() => handleDownload(result, idx)}
                    style={{
                      flex: 1,
                      background: 'var(--sampada-dark)',
                      color: 'white',
                      border: 'none',
                      borderRadius: DS.r6,
                      padding: '8px 16px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    ↓ Download
                  </button>

                  {result.type === 'url' && (
                    <button
                      onClick={() => handleUseAsBlogCover(result)}
                      style={{
                        flex: 1,
                        background: 'var(--sampada-gold)',
                        color: 'var(--sampada-dark)',
                        border: 'none',
                        borderRadius: DS.r6,
                        padding: '8px 16px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Use as Blog Cover
                    </button>
                  )}

                  {result.type === 'base64' && (
                    <button
                      onClick={() => exportToSanity(result, `ai-design-v${idx + 1}`, idx)}
                      disabled={exporting === idx}
                      style={{
                        flex: 1,
                        background: 'var(--sampada-gold)',
                        color: 'var(--sampada-dark)',
                        border: 'none',
                        borderRadius: DS.r6,
                        padding: '8px 16px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: exporting === idx ? 'wait' : 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        opacity: exporting === idx ? 0.7 : 1,
                      }}
                    >
                      {exporting === idx ? '⏳ Uploading…' : '☁ → Sanity'}
                    </button>
                  )}
                </div>

                {result.type === 'base64' && (
                  <div style={{ padding: '0 12px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['Blog Cover', 'Product Hero', 'Social Post', 'Banner'].map(label => (
                      <span
                        key={label}
                        onClick={() => exportToSanity(result, label, idx)}
                        title={`Upload to Sanity as ${label}`}
                        style={{
                          fontSize: 11,
                          padding: '4px 10px',
                          borderRadius: DS.rFull,
                          background: 'rgba(201,168,76,0.12)',
                          border: '1px solid rgba(201,168,76,0.35)',
                          color: 'var(--sampada-dark)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Use as {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .ai-studio-prompt::placeholder {
          color: rgba(26,10,8,0.35);
          font-style: italic;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}