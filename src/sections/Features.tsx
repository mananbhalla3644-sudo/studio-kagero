import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { Badge } from '../components/ui/Badge'
import { useReducedMotion } from '../hooks/useReducedMotion'

const FEATURES = [
  {
    title: 'Original animation',
    body: 'Full 2D pipelines: key frames, timing, clean-up, colour and comp. Delivered at broadcast spec with EDL and alpha passes.',
    span: 'md:col-span-4 md:row-span-2',
    icon: '絵',
  },
  {
    title: 'Game cinematics',
    body: 'In-engine and pre-rendered cutscenes, gacha reveals and character trailers built to loop inside your build.',
    span: 'md:col-span-4',
    icon: '遊',
  },
  {
    title: 'Brand films',
    body: 'Anime-styled commercials that ship in 4K, vertical and 6-second cutdowns from one master timeline.',
    span: 'md:col-span-4',
    icon: '映',
  },
  {
    title: 'Character design',
    body: 'Model sheets, expression grids and turnaround packs your team can animate from on day one.',
    span: 'md:col-span-3',
    icon: '形',
  },
  {
    title: 'Compositing & grade',
    body: 'Halftone, speed lines, bloom and film grain — the finishes that make a cut feel printed.',
    span: 'md:col-span-5',
    icon: '仕',
  },
]

/**
 * Section 10.3 — Features / work: asymmetric bento grid, rounded cards,
 * varied proportions, glassy surfaces. Cards rise on scroll with the
 * theme's impact ease; each card also has a hover/focus state.
 */
export function Features() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-card',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.4)',
          stagger: 0.07,
          scrollTrigger: { trigger: rootRef.current, start: 'top 72%', once: true },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} className="relative py-[var(--tk-section-gap)]" id="services" aria-labelledby="features-title">
      <div className="max-w-[var(--tk-max-width)] mx-auto px-gutter">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <Badge>02 — What we make</Badge>
            <h2 id="features-title" className="mt-6 text-display-3 text-ink max-w-[16ch]">
              Five ways we set a frame on fire
            </h2>
          </div>
          <p className="max-w-[30ch] text-muted">
            Every engagement runs through the same floor: story, key animation, timing,
            finish. Pick one panel or the whole page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 auto-rows-[minmax(160px,auto)]">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              tabIndex={0}
              className={`bento-card group relative overflow-hidden rounded-[var(--tk-radius)] border border-line bg-surface/70 backdrop-blur-md p-7 transition-[border-color,transform,box-shadow] duration-[var(--tk-dur-fast)] ease-[var(--tk-ease-primary)] hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_50px_rgba(255,59,48,0.16)] focus-visible:border-primary ${f.span}`}
            >
              <div
                aria-hidden
                className="absolute -right-6 -top-8 font-display text-[7rem] leading-none opacity-[0.06] select-none transition-opacity duration-300 group-hover:opacity-[0.14]"
              >
                {f.icon}
              </div>
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[var(--tk-dur-base)] ease-[var(--tk-ease-primary)]"
                style={{ background: 'linear-gradient(90deg, var(--tk-primary), var(--tk-accent))' }}
              />
              <h3 className="text-title text-secondary mb-3 relative" style={{ fontSize: 'var(--tk-size-xl)' }}>
                {f.title}
              </h3>
              <p className="text-sm text-muted relative leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
