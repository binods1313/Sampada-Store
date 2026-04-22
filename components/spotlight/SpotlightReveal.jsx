// components/spotlight/SpotlightReveal.jsx
import { useEffect, useRef, useState } from 'react'
import EchoCanvas from './EchoCanvas'

const LERP_FACTOR = 0.08
const SPOTLIGHT_RADIUS = 220 // px

/**
 * Mouse-following spotlight reveal hero.
 * imageA = base (dark) image shown by default
 * imageB = revealed image shown inside the spotlight circle
 *
 * Uses CSS clip-path on the top layer for the reveal effect.
 * Lerp smoothing applied via requestAnimationFrame.
 */
export default function SpotlightReveal({ imageA, imageB }) {
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
        height: '85vh',
        minHeight: '600px',
        background: '#0d1126',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
      }}
    >
      {/* Base image — always visible */}
      <img
        src={imageA}
        alt="Kavya — base"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: 0,
          filter: 'brightness(0.45) saturate(0.7)',
        }}
      />

      {/* Revealed image — clipped to spotlight */}
      <img
        src={imageB}
        alt="Kavya — revealed"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: 1,
          clipPath: hasPointer
            ? clipPath
            : `circle(40% at 50% 40%)`,
          transition: 'clip-path 0ms linear',
          filter: 'brightness(0.85)',
        }}
      />

      {/* Dark vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(13,17,38,0.7) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Echo rings canvas */}
      <EchoCanvas />

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
