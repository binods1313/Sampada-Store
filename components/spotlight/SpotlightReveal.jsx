// components/spotlight/SpotlightReveal.jsx
import { useEffect, useRef, useState } from 'react'
import EchoCanvas from './EchoCanvas'

const LERP_FACTOR = 0.08
const SPOTLIGHT_RADIUS = 116 // px — 25% smaller than original 155

/**
 * Mouse-following spotlight reveal hero.
 * imageA = base (dark) image shown by default
 * imageB = revealed image shown inside the spotlight circle
 *
 * Uses CSS clip-path on the top layer for the reveal effect.
 * Lerp smoothing applied via requestAnimationFrame.
 */
export default function SpotlightReveal({ imageA, imageB, baseImage, revealImage }) {
  // Support both prop naming conventions
  const base = baseImage || imageA
  const reveal = revealImage || imageB
  const containerRef = useRef(null)
  const rafRef = useRef(null)

  // Target position (raw mouse)
  const targetRef = useRef({ x: -9999, y: -9999 })
  // Current lerped position
  const currentRef = useRef({ x: -9999, y: -9999 })

  const [clipPath, setClipPath] = useState(
    `circle(${SPOTLIGHT_RADIUS}px at 50% 40%)`
  )
  const [hasPointer, setHasPointer] = useState(false)

  useEffect(() => {
    // Detect pointer capability
    const mq = window.matchMedia('(pointer: fine)')
    setHasPointer(mq.matches)

    const container = containerRef.current
    if (!container) return

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onMouseLeave = () => {
      // Animate back to center
      const rect = container.getBoundingClientRect()
      targetRef.current = { x: rect.width / 2, y: rect.height * 0.4 }
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    // Lerp animation loop
    const animate = () => {
      const t = targetRef.current
      const c = currentRef.current

      // Initialise current to target on first frame
      if (c.x === -9999) {
        currentRef.current = { ...t }
      }

      currentRef.current = {
        x: c.x + (t.x - c.x) * LERP_FACTOR,
        y: c.y + (t.y - c.y) * LERP_FACTOR,
      }

      setClipPath(
        `circle(${SPOTLIGHT_RADIUS}px at ${currentRef.current.x}px ${currentRef.current.y}px)`
      )

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        marginLeft: 'calc(-50vw + 50%)',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
      }}
    >
      {/* Base layer — object-fit contain, full image always visible */}
      <img
        src={base}
        alt="Kavya"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center center',
          zIndex: 0,
          filter: 'brightness(0.45) saturate(0.7)',
        }}
      />

      {/* Reveal layer — same contain framing, clipped to spotlight */}
      <img
        src={reveal}
        alt="Kavya — reveal"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center center',
          zIndex: 1,
          clipPath: hasPointer ? clipPath : `circle(40% at 50% 40%)`,
          transition: 'clip-path 0ms linear',
          filter: 'saturate(1.1) contrast(1.04)',
        }}
      />

      {/* Dark vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(13,17,38,0.3) 0%, transparent 20%, transparent 70%, rgba(13,17,38,0.92) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Echo rings canvas */}
      <EchoCanvas />

      {/* Left dark vignette — behind quote text */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '26%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />

      {/* Right dark vignette — behind quote text */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '26%',
          background: 'linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 100%)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />

      {/* Left quote panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '26%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 30,
          pointerEvents: 'none',
          padding: '0 2rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: 'rgba(255,255,255,0.12)',
            fontSize: '4rem',
            lineHeight: 1,
            margin: '0 0 12px',
          }}>"</p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1rem',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Grace is not just how you look —
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1rem',
            lineHeight: 1.6,
            margin: '4px 0 0',
          }}>
            it&apos;s how you carry your story.
          </p>
          <div style={{
            width: '32px',
            height: '1px',
            background: '#c9a96e',
            margin: '16px auto 0',
            opacity: 0.6,
          }} />
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            margin: '12px 0 0',
          }}>
            Sampada Originals™
          </p>
        </div>
      </div>

      {/* Right quote panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '26%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 30,
          pointerEvents: 'none',
          padding: '0 2rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: 'rgba(255,255,255,0.12)',
            fontSize: '4rem',
            lineHeight: 1,
            margin: '0 0 12px',
          }}>"</p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1rem',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Every look is a legacy
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1rem',
            lineHeight: 1.6,
            margin: '4px 0 0',
          }}>
            worn with intention.
          </p>
          <div style={{
            width: '32px',
            height: '1px',
            background: '#c9a96e',
            margin: '16px auto 0',
            opacity: 0.6,
          }} />
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            margin: '12px 0 0',
          }}>
            Winter Drop 2026
          </p>
        </div>
      </div>

      {/* Text content */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.72rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#c9a96e',
            margin: '0 0 18px',
            fontWeight: 600,
          }}
        >
          Meet the Face
        </p>

        {/* Hero name */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(5rem, 12vw, 8rem)',
            fontWeight: 900,
            color: '#f5f0eb',
            margin: '0 0 20px',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 32px rgba(13,17,38,0.6)',
          }}
        >
          Kavya
        </h1>

        {/* Brand label */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '0.8rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,235,0.65)',
            margin: 0,
            fontWeight: 500,
          }}
        >
          Sampada Originals™
        </p>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, #0d1126)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    </section>
  )
}
