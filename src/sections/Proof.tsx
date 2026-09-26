import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { Badge } from '../components/ui/Badge'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * ILLUSTRATIVE CONTENT — Studio Kagerō is a fictional demo studio; every
 * metric, quote and partner name below is invented for this build and is
 * labelled as such in the README (Rule 2: no fabricated facts presented
 * as real customers).
 */
const STATS = [
  { value: 68, suffix: '', label: 'Episodes delivered' },
  { value: 12, suffix: '', label: 'Studio partners' },
  { value: 340, suffix: 'k', label: 'Frames drawn' },
  { value: 9, suffix: '', label: 'Festival selections' },
]

const QUOTES = [
  {
    quote: 'They handed back a cut with actual weight to it. Our launch trailer ran for eight weeks.',
    name: 'Illustrative partner',
    role: 'Publishing lead (demo content)',
  },
  {
    quote: 'Timing was their call and the timing was right. We stopped reviewing after round one.',
    name: 'Illustrative partner',
    role: 'Producer, streaming series (demo content)',
  },
]

/**
 * Section 10.5 — Proof: animated stat counters + illustrative quotes.
 * Counters animate once on enter; under reduced motion they show final
 * values immediately (motion never required to read the number).
 */
export function Proof() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [animated, setAnimated] = useState(() => STATS.map(() => 0))
  // Under reduced motion the final values are DERIVED, never set in an effect
  // (no cascading render, and the numbers are readable immediately).
  const values = reduced ? STATS.map((s) => s.value) : animated

  useEffect(() => {
    if (reduced || !rootRef.current) return

    const ctx = gsap.context(() => {
      const proxy = { t: 0 }
      const tween = gsap.to(proxy, {
        t: 1,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%', once: true },
        onUpdate: () => {
          setAnimated(STATS.map((s) => Math.round(s.value * proxy.t)))
        },
      })
      return () => tween.kill()
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="relative py-[var(--tk-section-gap)]" id="proof" aria-labelledby="proof-title">
      <div className="max-w-[var(--tk-max-width)] mx-auto px-gutter">
        <Badge>04 — Proof</Badge>
        <h2 id="proof-title" className="mt-6 text-display-3 text-ink">
          Numbers, then voices
        </h2>

        <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="rounded-[var(--tk-radius)] border border-line bg-surface/60 p-6 transition-colors duration-300 hover:border-primary"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-display-2 text-primary tabular-nums">
                  {values[i]}
                  {s.suffix}
                </span>
                <span className="block mt-2 text-xs uppercase tracking-[0.18em] text-faint">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {QUOTES.map((q) => (
            <figure
              key={q.name}
              className="rounded-[var(--tk-radius)] border border-line bg-surface-alt/50 p-7"
            >
              <blockquote className="text-lg text-secondary leading-relaxed">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-faint">
                <span className="text-muted font-bold">{q.name}</span> — {q.role}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs text-faint">Demo content: all figures and quotes above are illustrative.</p>
      </div>
    </section>
  )
}
