import { Marquee } from '../components/ui/Marquee'

/** ILLUSTRATIVE partner names — fictional studios, demo content (Rule 2). */
const ROW_A = ['Foxglove Works', 'Ash & Ember', 'Tidepool Games', 'Northlight TV', 'Kitsune Audio']
const ROW_B = ['Paper Lantern', 'Studio Orbit', 'Blue Hour Books', 'Rooke Films', 'Neon Kettle']

/**
 * Section 10.6 — Logo carousel: two seamless marquees moving in opposite
 * directions, staggered spacing, edge-fade mask, no visible loop jump.
 * Pauses under reduced motion (handled inside Marquee).
 */
export function LogoCarousel() {
  return (
    <section className="relative py-14 border-y border-line bg-bg-elevated overflow-hidden" aria-label="Studio partners">
      <Marquee items={ROW_A} direction="rtl" />
      <Marquee items={ROW_B} direction="ltr" className="mt-2" />
    </section>
  )
}
