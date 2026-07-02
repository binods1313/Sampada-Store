import { useState, useRef, useEffect } from 'react';

const SAMPADA_VIDEO_PRESETS = [
  {
    label: '👗 Product Showcase',
    prompt: 'Elegant Indian woman in crimson silk saree walking through a Mughal archway, golden hour light, slow motion, cinematic depth of field',
  },
  {
    label: '🪔 Festive Campaign',
    prompt: 'Diwali celebration scene with traditional Indian lamps, woman in gold embroidered lehenga, warm bokeh, festive atmosphere',
  },
  {
    label: '🏛️ Heritage Story',
    prompt: 'Indian artisan hands crafting intricate embroidery, close-up details of gold thread work on crimson fabric, documentary style',
  },
  {
    label: '📱 Reel Opener',
    prompt: 'Dynamic fashion reveal, Indian model in modern fusion outfit, bold colors, energetic movement, social media ready',
  },
  {
    label: '✨ Brand Film',
    prompt: 'Cinematic brand film opening, Sampada Originals aesthetic, heritage meets modernity, sweeping shots of Indian palace architecture',
  },
];

const SECTION_LABEL = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '3px',
  color: 'var(--sampada-gold)',
  fontFamily: 'Inter, sans-serif',
  textTransform: 'uppercase',
  marginBottom: 12,
};

export default function VideoStudio() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('heritage');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollForVideo = (id) => {
    let attempts = 0;
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      attempts += 1;
      if (attempts > 30) {
        clearInterval(pollRef.current);
        pollRef.current = null;
        setError('Video generation timed out. Please try again.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/creative/grok-video-status?jobId=${id}`);
        const data = await res.json();

        if (!res.ok) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setError(data.error || 'Failed to check video status.');
          setLoading(false);
          return;
        }

        if (data.status === 'completed' && data.data?.[0]?.url) {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setVideoUrl(data.data[0].url);
          setStatus('');
          setLoading(false);
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setError('Video generation failed. Try a different prompt.');
          setLoading(false);
        } else {
          setStatus(`Still generating... (${attempts * 5}s)`);
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 5000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError('');
    setVideoUrl(null);
    setStatus('Sending to Grok Aurora...');

    try {
      const res = await fetch('/api/creative/grok-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Video generation failed.');
        setLoading(false);
        return;
      }

      if (data.type === 'url') {
        setVideoUrl(data.videoUrl);
        setStatus('');
        setLoading(false);
      } else if (data.type === 'async') {
        setStatus('Video generating... this takes 30-60 seconds');
        pollForVideo(data.jobId);
      } else {
        console.log('Raw video response:', data.raw);
        setError('Unexpected response format. Check console for details.');
        setLoading(false);
      }
    } catch (err) {
      setError(`Generation failed: ${err.message}`);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    try {
      const blob = await fetch(videoUrl).then((r) => r.blob());
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sampada-video.mp4';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    }
  };

  const handleReset = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setVideoUrl(null);
    setPrompt('');
    setStatus('');
    setError('');
    setLoading(false);
  };

  return (
    <div style={{
      background: 'transparent',
      minHeight: '100%',
      padding: '32px 40px',
      color: 'var(--sampada-dark)',
    }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: '"Libre Baskerville", Georgia, serif', fontSize: 28, margin: 0 }}>
            🎬 Video Studio
          </h2>
          <span style={{
            background: 'var(--sampada-crimson)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '2px',
          }}>
            GROK AURORA
          </span>
          <span style={{
            background: '#22C55E',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '1px',
          }}>
            NEW
          </span>
        </div>
        <p style={{ color: 'rgba(26,10,8,0.55)', fontSize: 14, margin: 0 }}>
          Generate 5-second cinematic videos for product showcases, campaigns &amp; reels
        </p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={SECTION_LABEL}>QUICK PRESETS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SAMPADA_VIDEO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPrompt(preset.prompt)}
              style={{
                padding: '10px 18px',
                background: 'white',
                border: '1.5px solid var(--sampada-dark)',
                borderRadius: 24,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--sampada-dark)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--sampada-dark)';
                e.currentTarget.style.color = 'var(--sampada-cream)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'var(--sampada-dark)';
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={SECTION_LABEL}>VIDEO PROMPT</div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your video... e.g. Indian woman in crimson saree walking through Mughal archway, golden hour, cinematic slow motion, no text"
          style={{
            width: '100%',
            minHeight: 120,
            background: 'white',
            border: '2px solid rgba(201,168,76,0.4)',
            borderRadius: 12,
            padding: '20px 24px',
            fontSize: 15,
            fontFamily: 'Inter, sans-serif',
            color: 'var(--sampada-dark)',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <p style={{ fontSize: 12, color: 'rgba(26,10,8,0.45)', marginTop: 8 }}>
          Tip: Be specific about movement, lighting, and mood. Avoid text overlays.
        </p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={SECTION_LABEL}>STYLE</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['heritage', 'modern', 'festive', 'product', 'social'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              style={{
                padding: '12px 22px',
                borderRadius: 30,
                border: '2px solid var(--sampada-gold)',
                background: style === s ? 'var(--sampada-gold)' : 'white',
                color: 'var(--sampada-dark)',
                fontWeight: style === s ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'capitalize',
                boxShadow: style === s ? '0 4px 12px rgba(201,168,76,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{
          width: '100%',
          padding: '18px 32px',
          background: loading ? 'rgba(139,26,26,0.6)' : 'var(--sampada-crimson)',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: '"Libre Baskerville", Georgia, serif',
          cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
          boxShadow: '0 8px 24px rgba(139,26,26,0.3)',
          transition: 'all 0.2s',
          marginBottom: 16,
        }}
      >
        {loading ? `⏳ ${status || 'Generating...'}` : '🎬 Generate Video with Grok Aurora →'}
      </button>

      {error && (
        <div style={{
          background: 'rgba(139,26,26,0.08)',
          border: '1px solid var(--sampada-crimson)',
          borderRadius: 8,
          padding: 16,
          color: 'var(--sampada-crimson)',
          fontSize: 14,
          marginBottom: 24,
        }}>
          ⚠️ {error}
        </div>
      )}

      {videoUrl && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          marginTop: 24,
        }}>
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            playsInline
            style={{ width: '100%', display: 'block' }}
          />
          <div style={{ padding: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                padding: '10px 20px',
                background: 'var(--sampada-dark)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ⬇️ Download MP4
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: 'var(--sampada-gold)',
                border: '1px solid var(--sampada-gold)',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ✨ Generate Another
            </button>
          </div>
        </div>
      )}

      <p style={{
        fontSize: 11,
        color: 'rgba(26,10,8,0.35)',
        textAlign: 'center',
        marginTop: 32,
      }}>
        Video generation uses xAI Grok Aurora credits · Balance: $5.00 ·
        <a
          href="https://console.x.ai"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--sampada-gold)', marginLeft: 4 }}
        >
          Manage credits →
        </a>
      </p>
    </div>
  );
}