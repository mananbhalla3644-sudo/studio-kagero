import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { usePerformanceTier, type Tier } from '../../hooks/usePerformanceTier'
import { CameraRig } from './CameraRig'
import { HeroObject } from './HeroObject'
import { ParticleField } from './ParticleField'
import { PostFX } from './PostFX'
import { theme } from '../../theme/theme.config'
import { loader } from '../../lib/assetLoader'

/** Fallback poster shown in the STATIC tier — no canvas at all (Section 4.1). */
function StaticPoster() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div
        className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{ background: `radial-gradient(circle, ${theme.palette.primary}55, transparent 70%)` }}
      />
      <div
        className="absolute right-[12%] bottom-[10%] h-[40vmin] w-[40vmin] rounded-full blur-[80px]"
        style={{ background: `radial-gradient(circle, ${theme.palette.accent}33, transparent 70%)` }}
      />
      <div className="screen-tone absolute inset-0 opacity-60" />
    </div>
  )
}

/**
 * Reports tier milestones to the loader (real progress, Section 9).
 * Rendered outside the Canvas — hooks must not be called conditionally.
 */
function TierBridge({ onTier }: { onTier: (t: Tier) => void }) {
  const { tier } = usePerformanceTier()
  useEffect(() => {
    onTier(tier)
    if (tier === 'static') {
      // No canvas, no chunk: both milestones are genuinely complete (the
      // "chunk" never has to load, the poster is a CSS gradient).
      loader.report('poster', 1)
      loader.report('chunk', 1)
    } else {
      // The Scene module (r3f/drei) already evaluated — the chunk is here.
      loader.report('chunk', 1)
    }
  }, [tier, onTier])
  return null
}

/**
 * Section 4.2 — runtime adaptation: drei PerformanceMonitor watches FPS and
 * calls stepDown when the average stays low; AdaptiveDpr / AdaptiveEvents
 * shrink resolution and raycast cost inside the current tier.
 */
function Adaptive({ stepDown, stepUp }: { stepDown: () => void; stepUp: () => void }) {
  return (
    <PerformanceMonitor
      onDecline={() => stepDown()}
      onIncline={() => stepUp()}
      flipflops={1}
      bounds={() => [40, 60]}
    >
      <AdaptiveDpr />
      <AdaptiveEvents />
    </PerformanceMonitor>
  )
}

/**
 * Section 4.4 — ONE persistent WebGL context for the whole site, fixed
 * behind the DOM, driven by scroll progress. Never a canvas per section.
 * Paused when the tab is hidden (frameloop switches to 'never').
 */
export function Scene({ progressRef }: { progressRef: { current: number } }) {
  const { tier, config, stepDown, stepUp } = usePerformanceTier()
  const [paused, setPaused] = useState(false)
  const [poster, setPoster] = useState(true)
  const onTier = useMemo(() => () => {}, [])

  // Pause rendering when the tab is hidden (Section 4.4).
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Reduced motion / no WebGL → STATIC tier: poster + gradients, no canvas.
  if (tier === 'static' || !config.webgl) {
    return (
      <>
        <StaticPoster />
        <TierBridge onTier={onTier} />
      </>
    )
  }

  return (
    <>
      <div className="fixed inset-0 -z-10" aria-hidden>
        <Canvas
          dpr={config.dpr}
          frameloop={paused ? 'never' : 'always'}
          gl={{
            antialias: config.dpr > 1,
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
          }}
          camera={{ fov: 42, position: [0, 0.4, 8.5], near: 0.1, far: 60 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
            loader.report('poster', 1)
            setPoster(false)
          }}
        >
          <Adaptive stepDown={stepDown} stepUp={stepUp} />
          <fog attach="fog" args={[theme.three.fog.color, theme.three.fog.near, theme.three.fog.far]} />
          <CameraRig progressRef={progressRef} />
          <HeroObject />
          <ParticleField count={config.particles} progressRef={progressRef} />
          <PostFX config={config} />
        </Canvas>
      </div>
      <TierBridge onTier={onTier} />
      {poster && <StaticPoster />}
    </>
  )
}
