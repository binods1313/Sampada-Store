// components/spotlight/SpotlightRevealClean.jsx
import { useEffect, useRef, useState } from 'react'
import EchoCanvas from './EchoCanvas'

const LERP_FACTOR = 0.15 // Increased from 0.08 for more responsive tracking
const SPOTLIGHT_RADIUS = 70 // Support page spotlight radius

/**
 * Clean spotlight reveal component without built-in text overlays.
 * Designed for custom overlays (like Support page quote).
 */
export default function SpotlightRevealClean({ baseImage, revealImage }) {
  const containerRef = useRef(null)
  const rafRef = useRef(null)

  // Target position (raw mouse)
  const targetRef = useRef({ x: -9999, y: -9999 })
  // Current lerped position
  const currentRef = useRef({ x: -9999, y: -9999 })

  const [clipPath, setClipPath] = useState(
    `circle(${SPOTLIGHT_RADIUS}px at 50% 50%)`
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
      targetRef.current = { x: rect.width / 2, y: rect.height / 2 }
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    // Lerp animation loop
    const animate = () => {
      const t = targetRef.current
      const c = currentRef.current

      // Initialize current to target on first frame
      if (c.x === -9999) {
        currentRef.current = { ...t }
      }

      // Lerp smoothing
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
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      {/* Base layer — darker/muted image */}
      <img
        src={baseImage}
        alt="Kavya"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '60% top',
          zIndex: 0,
          filter: 'brightness(0.5) saturate(0.7)',
        }}
      />

      {/* Reveal layer — brighter image clipped to spotlight */}
      <img
        src={revealImage}
        alt="Kavya reveal"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '60% top',
          zIndex: 1,
          clipPath: hasPointer ? clipPath : `circle(35% at 50% 50%)`,
          transition: 'clip-path 0ms linear',
          filter: 'saturate(1.05) contrast(1.02)',
        }}
      />

      {/* Subtle vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.3) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Echo rings canvas */}
      <EchoCanvas />
    </div>
  )
}
