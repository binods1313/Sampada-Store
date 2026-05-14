import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Fireworks celebration animation — used on order success page
export function runFireworks() {
  if (typeof window === 'undefined') return

  const duration = 3000
  const end = Date.now() + duration

  const colors = ['#c9a96e', '#f5f0eb', '#0d1126', '#ffffff']

  ;(function frame() {
    // Create confetti burst from left and right
    const timeLeft = end - Date.now()
    if (timeLeft <= 0) return

    const particleCount = Math.floor(timeLeft / 100)

    // Simple CSS-based sparkle effect using DOM elements
    for (let i = 0; i < Math.min(particleCount, 3); i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 99999;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 60 + 10}vh;
        animation: sparkle-fall 1.5s ease-out forwards;
      `
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 1500)
    }

    requestAnimationFrame(frame)
  })()

  // Inject keyframes if not already present
  if (!document.getElementById('fireworks-style')) {
    const style = document.createElement('style')
    style.id = 'fireworks-style'
    style.textContent = `
      @keyframes sparkle-fall {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(60px) scale(0.3); }
      }
    `
    document.head.appendChild(style)
  }
}
