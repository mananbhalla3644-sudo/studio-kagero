import { useEffect, useRef, useState } from 'react'
import { theme } from '../../theme/theme.config'

/** True only where a real mouse exists — touch devices never get the ring. */
const canHover = () =>
  theme.cursor.enabled && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/**
 * Section 8 — custom cursor. A ring + dot that follows the pointer with
 * damping and scales up over interactive elements. Disabled entirely on
 * touch devices. The ring is decorative: aria-hidden, and the OS pointer
 * stays hidden only while this is mounted (Section 12 — motion and
 * ornament never carry meaning; the site is fully operable without it).
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  // Hover-capability never changes during a session → safe as initial state.
  const [enabled] = useState(canHover)
  // `hot` is written from the pointer listener and read inside rAF — a ref
  // avoids re-running the effect (and re-subscribing) on every hover toggle.
  const hot = useRef(false)

  useEffect(() => {
    if (!enabled) return
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let scale = 1
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      // Pointer state is applied in the rAF loop: one visual update per frame.
      hot.current = !!(e.target as HTMLElement)?.closest?.('a, button, [role="button"], input, textarea, select, label')
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = () => {
      // Damped follow (theme.cursor.damping).
      pos.x += (target.x - pos.x) * (1 - theme.cursor.damping)
      pos.y += (target.y - pos.y) * (1 - theme.cursor.damping)
      // Hover scale lerped too, so the ring grows instead of snapping.
      const scaleTarget = hot.current ? theme.cursor.hoverScale : 1
      scale += (scaleTarget - scale) * 0.18
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    document.documentElement.classList.add('cursor-hidden')

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.classList.remove('cursor-hidden')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border-2 mix-blend-difference"
        style={{ width: theme.cursor.size, height: theme.cursor.size, borderColor: theme.cursor.color, willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        style={{ width: theme.cursor.dotSize, height: theme.cursor.dotSize, background: theme.cursor.color, willChange: 'transform' }}
      />
    </>
  )
}
