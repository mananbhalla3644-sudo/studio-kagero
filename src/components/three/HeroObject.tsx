import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { theme } from '../../theme/theme.config'
import celVert from '../../shaders/cel.vert.glsl?raw'
import celFrag from '../../shaders/cel.frag.glsl?raw'

/**
 * Section 8 — the hero object: a faceted icosahedron with the cel-shaded
 * GLSL material (3 hard bands + rim) and a bold ink outline drawn as an
 * inverted hull (backfaces pushed along normals). Reacts to the mouse with
 * damped rotation; spin speed comes from theme.three.spin.
 *
 * Procedural geometry only — no model downloads, no licence risk (Section 8).
 */
export function HeroObject() {
  const group = useRef<THREE.Group>(null)
  const spinRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uBody: { value: new THREE.Color(theme.three.material.bodyColor) },
      uFill: { value: new THREE.Color(theme.three.material.fillColor) },
      uRim: { value: new THREE.Color(theme.three.material.rimColor) },
      uTime: { value: 0 },
      uDistortion: { value: theme.three.shaderMood.distortionStrength },
      uBurst: { value: 0 },
    }),
    [],
  )

  // Outline material: backfaces, inflated along normals — the manga ink line.
  const outlineMaterial = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme.three.material.outlineColor),
      side: THREE.BackSide,
    })
    return m
  }, [])

  // Cheap vertex inflation for the inverted hull, without a second geometry.
  const outlineScale = theme.three.material.outlineScale

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20)
    spinRef.current += theme.three.spin * dt
    if (!group.current) return

    // Base spin + damped mouse tilt (damping from theme.cursor.damping).
    const px = state.pointer.x
    const py = state.pointer.y
    group.current.rotation.y = spinRef.current + px * 0.35
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      py * 0.3 + Math.sin(spinRef.current * 0.6) * 0.12,
      1 - Math.exp(-4 * dt),
    )

    uniforms.uTime.value = state.clock.elapsedTime

    // Impact-frame burst: pulses when scroll crosses section boundaries.
    const sectionPhase = (state.clock.elapsedTime % 6) / 6
    uniforms.uBurst.value = Math.max(0, Math.pow(1 - sectionPhase * 8, 2)) * 0.6
  })

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.35, 0]} />
        <shaderMaterial
          vertexShader={celVert}
          fragmentShader={celFrag}
          uniforms={uniforms}
        />
      </mesh>
      {/* Ink outline — inverted hull, scaled slightly along normals. */}
      <mesh scale={outlineScale} material={outlineMaterial}>
        <icosahedronGeometry args={[1.35, 0]} />
      </mesh>
      {/* Orbiting shards: same cel language, smaller. */}
      <OrbitingShards />
    </group>
  )
}

function OrbitingShards() {
  const shards = useRef<THREE.Group>(null)

  const shardsData = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        angle: (i / 5) * Math.PI * 2,
        radius: 2.4 + (i % 3) * 0.5,
        speed: 0.25 + (i % 2) * 0.12,
        scale: 0.16 + (i % 3) * 0.05,
        y: (i - 2) * 0.45,
      })),
    [],
  )

  useFrame((state) => {
    if (!shards.current) return
    const t = state.clock.elapsedTime
    shards.current.children.forEach((child, i) => {
      const d = shardsData[i]!
      const a = d.angle + t * d.speed
      child.position.set(Math.cos(a) * d.radius, d.y + Math.sin(t * 0.7 + i) * 0.18, Math.sin(a) * d.radius)
      child.rotation.x = t * 0.6 + i
      child.rotation.y = t * 0.4
    })
  })

  return (
    <group ref={shards}>
      {shardsData.map((d, i) => (
        <mesh key={i} scale={d.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? theme.palette.accent : theme.palette.secondary}
            roughness={0.3}
            metalness={0.5}
            emissive={i % 2 === 0 ? theme.palette.accent : theme.palette.primary}
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}
