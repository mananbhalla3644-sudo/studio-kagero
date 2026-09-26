import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Section 6 — global scroll progress 0..1 driven by GSAP ScrollTrigger and
 * synced with Lenis. Returns a ref (mutated per frame, no re-renders) plus a
 * throttled state value for components that need to react at section boundaries.
 */
export function useScrollProgress() {
  const progress = useRef(0)
  const [section, setSection] = useState(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress
        // Section index across 5 scenes — consumed by CameraRig / Scene moods.
        const s = Math.min(4, Math.floor(self.progress * 5))
        setSection((prev) => (prev === s ? prev : s))
      },
    })
    return () => st.kill()
  }, [])

  return { progress, section }
}
