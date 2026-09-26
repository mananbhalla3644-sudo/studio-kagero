import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SplitText } from '../components/ui/SplitText'
import { theme } from '../theme/theme.config'

/**
 * Section 10.1 — Hero.
 * Legibility rule: soft edge-free dark gradient strongest at 10–25% from the
 * left, fading by ~48%; headline carries a white→tint gradient + soft shadow.
 */
export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden" id="top">
      {/* Legibility gradient behind the headline (edge-free). */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(100deg, rgba(8,8,13,0.94) 0%, rgba(8,8,13,0.88) 12%, rgba(8,8,13,0.62) 30%, rgba(8,8,13,0) 48%)',
        }}
      />
      <div aria-hidden className="speed-lines absolute -left-1/4 top-1/4 w-[70vmin] h-[70vmin] opacity-70 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[var(--tk-max-width)] mx-auto px-gutter">
        <div className="max-w-[46rem]">
          <Badge>Anime animation studio · Est. 2019</Badge>

          <h1
            className="mt-7 text-display-1"
            style={{
              background: `linear-gradient(180deg, ${theme.palette.secondary} 18%, ${theme.palette.secondary} 64%, ${theme.palette.primary} 128%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 6px 30px rgba(0,0,0,0.75))',
            }}
          >
            <SplitText as="span" trigger="load" mode="lines">
              {theme.meta.tagline}
            </SplitText>
          </h1>

          <p className="mt-7 text-lead text-muted max-w-[34rem]">
            Studio Kagerō draws, animates and composites original anime sequences for
            streaming series, game cinematics and brand films — from key frame to final grade.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#contact">Start a project</Button>
            <Button href="#work" variant="ghost">
              See the reel
            </Button>
          </div>

          <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-5">
            {[
              ['68', 'episodes delivered'],
              ['12', 'studio partners'],
              ['4.9', 'avg. client rating'],
            ].map(([n, label]) => (
              <div key={label} className="border-l border-line-strong pl-4">
                <dt className="font-display text-display-3 leading-none text-primary">{n}</dt>
                <dd className="text-xs uppercase tracking-[0.18em] text-faint mt-1.5">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Scroll cue — decorative, aria-hidden. */}
      <div
        aria-hidden
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-faint"
        style={{ animation: 'tk-pulse 2.4s ease-in-out infinite' }}
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block w-px h-10 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  )
}
