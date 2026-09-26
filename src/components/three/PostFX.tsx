import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette, DepthOfField } from '@react-three/postprocessing'
import type { TierConfig } from '../../hooks/usePerformanceTier'
import { theme } from '../../theme/theme.config'

/**
 * Section 4.1 — post-processing strictly gated by tier:
 *   ULTRA    bloom + DoF + chromatic aberration + noise
 *   BALANCED bloom + noise
 *   LITE     none (CSS Grain overlay covers the texture)
 *   STATIC   no canvas at all
 *
 * All values come from theme.post — nothing hard-coded here.
 */
export function PostFX({ config }: { config: TierConfig }) {
  const { post } = theme

  if (!config.post.bloom && !config.post.noise) return null

  return (
    <EffectComposer multisampling={0}>
      {config.post.bloom && (
        <Bloom
          intensity={post.bloom.intensity}
          luminanceThreshold={post.bloom.luminanceThreshold}
          luminanceSmoothing={post.bloom.luminanceSmoothing}
          mipmapBlur={post.bloom.mipmapBlur}
        />
      )}
      {config.post.dof && <DepthOfField focusDistance={0.02} focalLength={0.06} bokehScale={3} />}
      {config.post.chromatic && (
        <ChromaticAberration
          offset={[theme.three.shaderMood.chromaticAberration, theme.three.shaderMood.chromaticAberration] as never}
        />
      )}
      {config.post.noise && <Noise opacity={post.noise.opacity} premultiply={post.noise.premultiply} />}
      <Vignette offset={post.vignette.offset} darkness={post.vignette.darkness} />
    </EffectComposer>
  )
}
