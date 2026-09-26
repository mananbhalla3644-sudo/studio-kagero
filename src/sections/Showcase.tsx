import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { Badge } from '../components/ui/Badge'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { theme } from '../theme/theme.config'

const PROJECTS = [
  { title: 'Hoshikui', kind: 'Streaming series · 12 eps', year: '2025', tint: theme.palette.primary },
  { title: 'Raboworks', kind: 'Game cinematic', year: '2025', tint: theme.palette.accent },
  { title: 'Paper Tigers', kind: 'Brand film · 60s', year: '2024', tint: theme.palette.sakura },
  { title: 'Neon Kettle', kind: 'Opening sequence', year: '2024', tint: theme.palette.glow },
  { title: 'Ame-no-Hashi', kind: 'Short film · 8 min', year: '2023', tint: theme.palette.secondary },
  { title: 'Kitsune Circuit', kind: 'Character trailer', year: '2023', tint: theme.palette.accent },
]

/**
 * Section 10.4 — Showcase: pinned horizontal scroll. The section pins for
 * theme.motion.scrollPins.showcase viewport heights while the track slides
 * left, scrubbed by scroll. Under reduced motion it becomes a normal
 * horizontally-scrollable list — content identical, no pin.
 */
export function Showcase() {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !rootRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-bg-elevated"
      id="work"
      aria-labelledby="showcase-title"
      style={{ paddingTop: 'var(--tk-section-gap)', paddingBottom: 'var(--tk-section-gap)' }}
    >
      <div className="max-w-[var(--tk-max-width)] mx-auto px-gutter mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <Badge>03 — Selected work</Badge>
          <h2 id="showcase-title" className="mt-6 text-display-3 text-ink">
            Cuts that landed
          </h2>
        </div>
        <p className="text-sm text-faint uppercase tracking-[0.2em]">
          {reduced ? 'Scroll horizontally →' : 'Keep scrolling →'}
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 px-gutter will-change-transform"
        style={reduced ? { overflowX: 'auto', paddingBottom: '1rem' } : undefined}
      >
        {PROJECTS.map((p) => (
          <article
            key={p.title}
            tabIndex={0}
            className="group relative shrink-0 w-[78vw] sm:w-[46vw] lg:w-[30vw] max-w-[430px] rounded-[var(--tk-radius)] border border-line bg-surface overflow-hidden transition-[border-color,transform] duration-[var(--tk-dur-fast)] ease-[var(--tk-ease-primary)] hover:-translate-y-1.5 hover:border-line-strong focus-visible:border-primary"
          >
            {/* Panel art: procedural gradient + halftone, no external images. */}
            <div
              aria-hidden
              className="relative h-[240px] screen-tone"
              style={{
                background: `linear-gradient(135deg, ${p.tint}2E 0%, transparent 55%), linear-gradient(225deg, ${p.tint}1A 0%, var(--tk-surface) 70%)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `repeating-linear-gradient(115deg, transparent 0 14px, ${p.tint}22 14px 15px)`,
                }}
              />
              <span
                className="absolute bottom-3 left-4 font-display text-[3.4rem] leading-none"
                style={{ color: p.tint, textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {p.title}
              </span>
              <span className="absolute top-3 right-4 text-xs tracking-[0.2em] text-faint">{p.year}</span>
            </div>
            <div className="p-5 border-t border-line">
              <h3 className="text-lg text-secondary tracking-normal normal-case" style={{ fontFamily: 'var(--tk-font-body)', fontWeight: 700, textTransform: 'none' }}>
                {p.title}
              </h3>
              <p className="text-sm text-muted mt-1">{p.kind}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Progress hairline for the pin. */}
      <div className="max-w-[var(--tk-max-width)] mx-auto px-gutter mt-9">
        <div className="h-px bg-line relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-1/3"
            style={{
              background: `linear-gradient(90deg, ${theme.palette.primary}, ${theme.palette.accent})`,
              animation: reduced ? 'none' : 'tk-marquee 6s linear infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
