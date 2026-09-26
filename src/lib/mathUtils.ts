/** Clamp a value between min and max. */
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Frame-rate independent exponential damping (the "smoothed with damping"
 * pattern used by pointer, camera and scroll consumers).
 */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))

/** Map a value from one range to another, unclamped. */
export const mapRange = (v: number, a: number, b: number, c: number, d: number) =>
  c + ((v - a) / (b - a)) * (d - c)

/** Smoothstep — for cross-fading scene moods. */
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
