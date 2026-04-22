// components/spotlight/EchoCanvas.jsx
import { useEffect, useRef } from 'react'

/**
 * Velocity-based echo ring canvas overlay.
 * Renders expanding gold rings at cursor position on mouse movement.
 * pointer-events: none — does not block underlying mouse events.
 */
export default function EchoCanvas() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const lastPosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Resize canvas to match parent
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Mouse handler — spawn ring based on velocity
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const dx = x - lastPosRef.current.x
      const dy = y - lastPosRef.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)
      lastPosRef.current = { x, y }

      // Velocity-scaled radius, capped at 60
      const baseRadius = Math.min(8 + speed * 0.8, 60)

      particlesRef.current.push({
        x,
        y,
        radius: baseRadius,
        maxRadius: baseRadius + 32,
        alpha: 0.6,
        born: performance.now(),
        lifetime: 600,
      })
    }

    canvas.parentElement?.addEventListener('mousemove', onMouseMove)

    // Animation loop
    const animate = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => {
        const age = now - p.born
        if (age >= p.lifetime) return false

        const progress = age / p.lifetime
        const currentRadius = p.radius + (p.maxRadius - p.radius) * progress
        const alpha = p.alpha * (1 - progress)

        ctx.beginPath()
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        return true
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      canvas.parentElement?.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  )
}
