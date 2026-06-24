import { useEffect, useRef } from 'react'

export function useIntersectionFade(options = {}) {
  const ref = useRef(null)
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    once = true,
    className = 'anim-fade-in',
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.classList.add(className)
      return () => {}
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(className)
          if (once) observer.disconnect()
        } else if (!once) {
          el.classList.remove(className)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once, className])

  return ref
}
