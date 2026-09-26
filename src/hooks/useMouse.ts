import { useEffect, useRef, type RefObject } from 'react'

/** Pointer position, smoothed with damping, throttled to one update per frame. */
export interface Pointer {
  /** Normalised -1..1 (x right, y up). */
  x: number
  y: number
  /** CSS px. */
  px: number
  py: number
}

/**
 * Section 8 — hero reacts to the mouse, smoothed with damping.
 * Pointer-driven updates are throttled to one per frame (Section 4.4).
 */
export function useMouse(damping = 0.1): RefObject<Pointer> {
  const pointer = useRef<Pointer>({ x: 0, y: 0, px: 0, py: 0 })
  const target = useRef<Pointer>({ x: 0, y: 0, px: 0, py: 0 })

  useEffect(() => {
    let raf = 0
    let hasTarget = false

    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      target.current.px = e.clientX
      target.current.py = e.clientY
      hasTarget = true
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = () => {
      if (hasTarget) {
        // Exponential damping — frame-rate independent enough at 60fps target.
        pointer.current.x += (target.current.x - pointer.current.x) * damping
        pointer.current.y += (target.current.y - pointer.current.y) * damping
        pointer.current.px += (target.current.px - pointer.current.px) * damping
        pointer.current.py += (target.current.py - pointer.current.py) * damping
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [damping])

  return pointer
}
