import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'

/**
 * Section 9 — magnetic buttons.
 * Applies a translate toward the pointer while it is within `radius`,
 * springs back on leave. Only `transform` is animated (Section 4.4).
 */
export function useMagnetic(
  strength = 0.38,
  radius = 120,
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Touch devices get no magnetic pull — the pointer is the finger.
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
    }

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [strength, radius])

  return ref as RefObject<HTMLElement | null>
}
