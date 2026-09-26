import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { theme } from '../../theme/theme.config'

/**
 * Section 3.2 / 8 — supporting ambient element: sakura petals (instanced,
 * GPU-cheap) drifting on a noise-ish curl, plus a speed-line backdrop plane.
 *
 * Count comes from the performance tier (≤9k ULTRA, ≤3.2k BALANCED, ≤900
 * LITE, 0 STATIC). Repeated objects use InstancedMesh (Section 4.3).
 */
export function ParticleField({
  count,
  progressRef,
}: {
  count: number
  progressRef: { current: number }
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Per-petal attributes generated ONCE — never inside useFrame.
  const petals = useMemo(() => {
    const n = Math.max(count, 1)
    return Array.from({ length: n }, () => ({
      x: (Math.random() - 0.5) * 26,
      y: (Math.random() - 0.5) * 18,
      z: (Math.random() - 0.5) * 20 - 2,
      fall: 0.25 + Math.random() * 0.6,
      drift: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.6,
      scale: 0.05 + Math.random() * 0.09,
      hue: Math.random(),
    }))
  }, [count])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh || count === 0) return
    const dt = Math.min(delta, 1 / 20)
    const t = state.clock.elapsedTime
    // Scroll drives the wind direction — petals answer the page.
    const wind = (progressRef.current - 0.5) * 2

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i]!
      p.y -= p.fall * dt
      p.x += Math.sin(t * 0.6 + p.drift) * dt * 0.5 + wind * dt * 0.8
      // Wrap around — no allocation, no growth.
      if (p.y < -9) p.y = 9
      if (p.x > 13) p.x = -13
      if (p.x < -13) p.x = 13

      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(t * p.spin, p.drift + t * 0.3, p.drift)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  if (count === 0) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1.4]} />
      <meshStandardMaterial
        color={theme.palette.sakura}
        emissive={theme.palette.sakura}
        emissiveIntensity={0.35}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
        roughness={0.7}
        metalness={0}
      />
    </instancedMesh>
  )
}
