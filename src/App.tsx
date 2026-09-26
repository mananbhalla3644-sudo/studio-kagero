import { lazy, Suspense, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, syncGsapAndLenis } from './lib/gsap'
import { useScrollProgress } from './hooks/useScrollProgress'
import { usePerformanceTier } from './hooks/usePerformanceTier'
import { useReducedMotion } from './hooks/useReducedMotion'
import { Loader } from './components/ui/Loader'
import { Cursor } from './components/ui/Cursor'
import { Grain } from './components/ui/Grain'
import { Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { Features } from './sections/Features'
import { Showcase } from './sections/Showcase'
import { Proof } from './sections/Proof'
import { LogoCarousel } from './sections/LogoCarousel'
import { Contact } from './sections/Contact'

// The 3D chunk (three/r3f/drei/postprocessing) is lazy — it never blocks
// first paint (Section 4.3 budgets).
const Scene = lazy(() => import('./components/three/Scene').then((m) => ({ default: m.Scene })))

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const reduced = useReducedMotion()
  const { config } = usePerformanceTier()
  const { progress, section } = useScrollProgress()

  // Smooth scroll — synced with GSAP per Section 6. Skipped for reduced
  // motion (STATIC tier scrolls natively).
  useEffect(() => {
    if (!loaded || reduced || config.scroll === 'native') return

    const lenis = new Lenis({
      duration: config.scroll === 'light' ? 0.9 : 1.25,
      smoothWheel: true,
      // LITE tier: light smoothing; ULTRA/BALANCED: full.
      touchMultiplier: config.scroll === 'light' ? 1.4 : 2,
    })
    const detach = syncGsapAndLenis(lenis)
    return () => {
      detach()
      lenis.destroy()
    }
  }, [loaded, reduced, config.scroll])

  // Refresh ScrollTrigger after fonts/layout settle.
  useEffect(() => {
    if (!loaded) return
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => window.clearTimeout(t)
  }, [loaded])

  return (
    <>
      {/* Skip-to-content link (Section 12). */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-bg focus:px-5 focus:py-3 focus:rounded focus:font-bold"
      >
        Skip to content
      </a>

      <Header />

      {/*
        The 3D chunk mounts IMMEDIATELY, behind the loader overlay: the loader
        reports real progress for it (font + chunk + first-frame), and the
        canvas is warm before the reveal instead of popping in after.
        Scene itself decides between canvas and STATIC poster (reduced motion
        / no WebGL), so no condition is needed here.
      */}
      <Suspense fallback={null}>
        <Scene progressRef={progress} />
      </Suspense>

      <main id="main" className="relative z-10">
        <Hero />
        <Story />
        <Features />
        <Showcase />
        <Proof />
        <LogoCarousel />
        <Contact />
      </main>

      <Grain />
      <Cursor />
      {/* Decorative scene indicator — mirrors camera scene for screen readers. */}
      <p className="sr-only" aria-live="off">
        Scene {section + 1} of 5
      </p>

      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      {/* Force GSAP to recalc once everything mounted. */}
      <MountRefresh />
    </>
  )
}

function MountRefresh() {
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])
  return null
}

function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled ? 'bg-bg/85 backdrop-blur-xl border-b border-line' : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="max-w-[var(--tk-max-width)] mx-auto px-gutter h-16 flex items-center justify-between"
      >
        <a href="#top" className="font-display text-xl tracking-wider text-secondary">
          STUDIO KAGER<span style={{ color: 'var(--tk-primary)' }}>Ō</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm text-muted">
          {[
            ['Story', '#story'],
            ['Services', '#services'],
            ['Work', '#work'],
            ['Proof', '#proof'],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} className="relative hover:text-ink transition-colors duration-200 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="text-xs font-bold uppercase tracking-[0.16em] px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-bg transition-all duration-200"
        >
          Start a project
        </a>
      </nav>
    </header>
  )
}

// Keep gsap import referenced for tree-shaking clarity in the bundle report.
void gsap
