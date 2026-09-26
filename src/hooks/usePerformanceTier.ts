import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export type Tier = 'ultra' | 'balanced' | 'lite' | 'static'

export interface TierConfig {
  dpr: number
  post: { bloom: boolean; dof: boolean; chromatic: boolean; noise: boolean }
  particles: number
  /** Whether the WebGL canvas runs at all. */
  webgl: boolean
  /** Whether the scroll-driven camera path runs. */
  cameraPath: boolean
  /** Lenis: 'full' | 'light' | 'native' */
  scroll: 'full' | 'light' | 'native'
}

/** Section 4.1 tier table. */
export const TIER_CONFIG: Record<Tier, TierConfig> = {
  ultra: {
    dpr: 2,
    post: { bloom: true, dof: true, chromatic: true, noise: true },
    particles: 9000,
    webgl: true,
    cameraPath: true,
    scroll: 'full',
  },
  balanced: {
    dpr: 1.5,
    post: { bloom: true, dof: false, chromatic: false, noise: true },
    particles: 3200,
    webgl: true,
    cameraPath: true,
    scroll: 'full',
  },
  lite: {
    dpr: 1,
    post: { bloom: false, dof: false, chromatic: false, noise: false },
    particles: 900,
    webgl: true,
    cameraPath: true,
    scroll: 'light',
  },
  static: {
    dpr: 1,
    post: { bloom: false, dof: false, chromatic: false, noise: false },
    particles: 0,
    webgl: false,
    cameraPath: false,
    scroll: 'native',
  },
}

const ORDER: Tier[] = ['static', 'lite', 'balanced', 'ultra']

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** One-time initial tier guess from device signals (Section 4.2). */
function detectInitialTier(): Tier {
  if (typeof window === 'undefined') return 'balanced'

  // URL override for testing (Section 4.2).
  const forced = new URLSearchParams(window.location.search).get('tier')
  if (forced && ORDER.includes(forced as Tier)) return forced as Tier

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'
  if (!hasWebGL()) return 'static'

  const nav = navigator as Navigator & { deviceMemory?: number }
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection

  const signals: number[] = []

  // Cores.
  const cores = navigator.hardwareConcurrency ?? 4
  signals.push(cores >= 8 ? 2 : cores >= 4 ? 1 : 0)

  // Device memory.
  const mem = nav.deviceMemory ?? 8
  signals.push(mem >= 8 ? 2 : mem >= 4 ? 1 : 0)

  // Data saver → drop to LITE.
  if (conn?.saveData) return 'lite'

  // Viewport width: phones are LITE.
  const width = window.innerWidth
  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (coarse || width < 768) return 'lite'
  signals.push(width >= 1600 ? 2 : width >= 1024 ? 1 : 0)

  // GPU tier via detect-gpu (async refinement happens below).
  const score = signals.reduce((a, b) => a + b, 0)
  if (score >= 5) return 'ultra'
  if (score >= 3) return 'balanced'
  return 'lite'
}

/** Refine the tier with detect-gpu's real GPU benchmark. */
async function refineWithGpu(tier: Tier): Promise<Tier> {
  if (tier === 'static') return tier
  try {
    const { getGPUTier } = await import('detect-gpu')
    const result = await getGPUTier({ glContext: document.createElement('canvas').getContext('webgl2') ?? undefined })
    const gpuTier = result.tier // 1 (low) .. 5 (high)
    if (gpuTier <= 1) return 'lite'
    if (tier === 'ultra' && gpuTier < 4) return 'balanced'
    if (tier === 'balanced' && gpuTier >= 5) return 'ultra'
    return tier
  } catch {
    return tier
  }
}

/**
 * Section 4 — the single performance hook every 3D/shader/particle/video
 * component reads. Detects a tier, refines it with detect-gpu, and later
 * steps down (never up more than once per session) on sustained low FPS.
 */
export function usePerformanceTier(): {
  tier: Tier
  config: TierConfig
  stepDown: () => void
  stepUp: () => void
} {
  const reduced = useReducedMotion()
  const [tier, setTier] = useState<Tier>(detectInitialTier)
  const [stepDowns, setStepDowns] = useState(0)
  const [steppedUp, setSteppedUp] = useState(false)

  // Async GPU refinement (Section 4.2).
  useEffect(() => {
    let cancelled = false
    refineWithGpu(tier).then((t) => {
      if (!cancelled) setTier(t)
    })
    return () => {
      cancelled = true
    }
    // Only on mount — runtime adaptation is handled by stepDown below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reduced motion always wins → STATIC (Section 9): derived, not set in an
  // effect (avoids a cascading render).
  const effectiveTier: Tier = reduced ? 'static' : tier

  /**
   * Called by drei's PerformanceMonitor when avg FPS stays below ~45 for 2s:
   * step down one tier (Section 4.2).
   */
  const stepDown = () => {
    const idx = ORDER.indexOf(effectiveTier)
    if (idx <= 0) return
    setTier(ORDER[idx - 1]!)
    setStepDowns((n) => n + 1)
  }

  /**
   * PerformanceMonitor's onIncline — allowed at most ONCE per session so the
   * tier can never oscillate (Section 4.2: "never step back up more than
   * once per session to avoid flicker").
   */
  const stepUp = () => {
    if (stepDowns === 0 || steppedUp) return
    const idx = ORDER.indexOf(effectiveTier)
    if (idx >= ORDER.length - 1) return
    setSteppedUp(true)
    setTier(ORDER[idx + 1]!)
  }

  return { tier: effectiveTier, config: TIER_CONFIG[effectiveTier], stepDown, stepUp }
}
