// components/spotlight/SpotlightReveal.jsx
import { useEffect, useRef, useState } from 'react'
import EchoCanvas from './EchoCanvas'

const LERP_FACTOR = 0.08
const SPOTLIGHT_RADIUS = 80 // Stories page spotlight radius

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
  const [hasPointer, setHasPointer] = useState(true)

  useEffect(() => {
    // Detect pointer capability and touch devices
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setHasPointer(!isTouch)
    if (isTouch) {
      setClipPath('none')
      return
    }

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
    <>
      <section
        ref={containerRef}
        className="stories-hero"
        style={{
          position: 'relative',
          width: '100%',
          height: hasPointer ? '100vh' : '100svh',
          minHeight: hasPointer ? '100vh' : '100svh',
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: hasPointer ? 'none' : 'default',
        }}
      >
        {/* Base layer — object-fit contain, full image always visible */}
        {hasPointer && (
          <img
            src={base}
            alt="Kavya"
            className="hero-bg-image"
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
        )}

      {/* Reveal layer — same contain framing, clipped to spotlight */}
      <img
        src={reveal}
        alt="Kavya — reveal"
        className="hero-bg-image"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center center',
          zIndex: 1,
          clipPath: hasPointer ? clipPath : 'none',
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

      {/* 2. Hero Quotes Section (Instructions 5) */}
      <div className="hero-quotes-section">

        {/* Left quote */}
        <div className="hero-quote-block left">
          <span className="quote-mark">"</span>
          <p className="quote-text">
            Grace is not just how you look —<br />
            it&apos;s how you carry your story.
          </p>
          <div className="quote-rule" />
          <span className="quote-brand">SAMPADA ORIGINALS™</span>
        </div>

        {/* Center — where the hero text sits */}
        <div className="hero-quote-center">
          <div
            style={{
              textAlign: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
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
        </div>

        {/* Right quote */}
        <div className="hero-quote-block right">
          <span className="quote-mark">"</span>
          <p className="quote-text">
            Every look is a legacy<br />
            worn with intention.
          </p>
          <div className="quote-rule" />
          <span className="quote-season">WINTER DROP 2026</span>
        </div>

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
    </>
  )
}
