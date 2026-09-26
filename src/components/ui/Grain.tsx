import { theme } from '../../theme/theme.config'

/**
 * Section 9 — grain overlay. CSS-only SVG turbulence (no canvas, no RAF):
 * cheap on every tier, so it runs even in LITE where postprocessing noise
 * is disabled. It never intercepts pointer events.
 */
export function Grain() {
  const opacity = theme.post.noise.opacity * 4 // CSS grain reads subtler than shader noise.
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9000] opacity-[var(--grain-opacity)] mix-blend-overlay"
      style={
        {
          '--grain-opacity': opacity,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        } as React.CSSProperties
      }
    />
  )
}
