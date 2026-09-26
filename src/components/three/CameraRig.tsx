import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { theme } from '../../theme/theme.config'
import { damp, smoothstep } from '../../lib/mathUtils'
import { useMouse } from '../../hooks/useMouse'

const WAYPOINTS = theme.three.cameraPath
const SCENES = theme.three.scenes

/**
 * Section 8 — camera travels a CatmullRomCurve3 driven by scroll progress
 * (ScrollTrigger scrub feeds progressRef). Each segment cross-fades the light
 * rig and fog colour between the two scenes it connects.
 *
 * Scene waypoints and their order are logic; only colours/intensities (skin)
 * come from the theme file.
 */
export function CameraRig({ progressRef }: { progressRef: { current: number } }) {
  const { camera, scene } = useThree()
  const pointer = useMouse(theme.cursor.damping)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const rimRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  // One curve for the whole journey — built once, never reallocated (4.4).
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        WAYPOINTS.map((w) => new THREE.Vector3(...w.pos)),
        false,
        'catmullrom',
        0.4,
      ),
    [],
  )
  const lookTargets = useMemo(
    () => WAYPOINTS.map((w) => new THREE.Vector3(...w.look)),
    [],
  )

  const smoothProgress = useRef(0)
  const lookAt = useRef(new THREE.Vector3(0, 0.2, 0))
  // Reused temporaries — no allocation inside useFrame (Section 4.4).
  const tmpPos = useMemo(() => new THREE.Vector3(), [])
  const tmpLook = useMemo(() => new THREE.Vector3(), [])
  const tmpColor = useMemo(() => new THREE.Color(), [])
  const keyColor = useMemo(() => new THREE.Color(), [])
  const rimColor = useMemo(() => new THREE.Color(), [])
  const fogColor = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20) // clamp after tab-switch spikes
    // Damped scrub — the camera never snaps even if scroll jumps.
    smoothProgress.current = damp(smoothProgress.current, progressRef.current, 6, dt)
    const p = smoothProgress.current

    // Position on the curve.
    curve.getPointAt(Math.min(p, 0.9999), tmpPos)
    camera.position.copy(tmpPos)

    // Pointer parallax, gently added on top (mouse-reaction requirement).
    camera.position.x += pointer.current.x * 0.45
    camera.position.y += pointer.current.y * 0.3

    // Interpolate the lookAt target between the two nearest waypoints.
    const seg = p * (WAYPOINTS.length - 1)
    const i = Math.min(Math.floor(seg), WAYPOINTS.length - 2)
    const t = seg - i
    tmpLook.lerpVectors(lookTargets[i]!, lookTargets[i + 1]!, smoothstep(0, 1, t))
    // Damped lookAt keeps the frame cinematic rather than mechanical.
    lookAt.current.lerp(tmpLook, 1 - Math.exp(-5 * dt))
    camera.lookAt(lookAt.current)

    // ── Scene mood cross-fade ──────────────────────────────────────────────
    const a = SCENES[i]!
    const b = SCENES[i + 1]!
    const k = smoothstep(0.15, 0.85, t)

    keyColor.set(a.key).lerp(tmpColor.set(b.key), k)
    rimColor.set(a.rim).lerp(tmpColor.set(b.rim), k)
    fogColor.set(a.fog).lerp(tmpColor.set(b.fog), k)

    if (lightRef.current) {
      lightRef.current.color.copy(keyColor)
      lightRef.current.intensity = a.keyIntensity + (b.keyIntensity - a.keyIntensity) * k
    }
    if (rimRef.current) rimRef.current.color.copy(rimColor)
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(fogColor)
    if (ambientRef.current) ambientRef.current.intensity = 0.22 + (1 - Math.abs(0.5 - p) * 2) * 0.1
  })

  return (
    <>
      {/* Key light — colour/intensity cross-faded per scene. */}
      <directionalLight ref={lightRef} position={[4, 6, 5]} intensity={3.2} />
      {/* Cool rim from behind — the cel outline separation. */}
      <directionalLight ref={rimRef} position={[-5, 2, -4]} intensity={1.4} />
      <ambientLight ref={ambientRef} intensity={0.25} />
      {/* Floor: gives the core something to float above in wide shots. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <circleGeometry args={[26, 48]} />
        <meshStandardMaterial
          color={theme.three.material.floorColor}
          roughness={theme.three.material.floorRoughness}
          metalness={theme.three.material.floorMetalness}
        />
      </mesh>
    </>
  )
}
