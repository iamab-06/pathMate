import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-triggered reveal hook using Intersection Observer.
 * Returns a ref to attach and a boolean `isVisible`.
 * Triggers once — never re-animates on scroll up.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility ratio to trigger (0–1). Default 0.15
 * @param {string} options.rootMargin - IntersectionObserver rootMargin. Default '0px 0px -40px 0px'
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
