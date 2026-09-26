import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

/** Named eases derived from the theme motion personality (Section 3.1). */
export const EASE = {
  primary: 'power4.out',
  impact: 'back.out(1.7)',
  inOut: 'power2.inOut',
  standard: 'power3.out',
} as const

/**
 * Registers GSAP's ticker as the single RAF for Lenis (Section 6):
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker drives lenis.raf, lagSmoothing(0)
 * Returns a cleanup that detaches everything.
 */
export function syncGsapAndLenis(lenis: {
  raf: (t: number) => void
  on: (event: 'scroll', callback: () => void) => void
  stop: () => void
  start: () => void
}): () => void {
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // Pause smooth scrolling when the tab is hidden (Section 4.4).
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') lenis.stop()
    else lenis.start()
  }
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    gsap.ticker.remove(tick)
    document.removeEventListener('visibilitychange', onVisibility)
    lenis.stop()
  }
}
