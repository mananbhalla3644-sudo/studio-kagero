import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { loader, loadFonts } from '../../lib/assetLoader'
import { theme } from '../../theme/theme.config'

/**
 * Section 9 — animated loading screen with REAL progress (font loading +
 * poster generation + 3D chunk load), then a smooth reveal into the hero
 * handled by Framer Motion's AnimatePresence (Section 6: page transitions).
 * Reduced motion: the exit is instant, content is never gated on animation.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const unsubscribe = loader.subscribe(setProgress)
    void loadFonts()
    return unsubscribe
  }, [])

  useEffect(() => {
    if (progress < 1) return
    // Brief hold at 100% so the number reads, then reveal.
    const t = setTimeout(() => setLeaving(true), 260)
    const t2 = setTimeout(onDone, 260 + 700)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [progress, onDone])

  const pct = Math.round(progress * 100)

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9500] flex flex-col items-center justify-center bg-bg"
          initial={false}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          aria-label={`Loading ${pct} percent`}
        >
          <div className="screen-tone absolute inset-0 opacity-40" aria-hidden />
          <div className="relative flex flex-col items-center gap-6 px-6">
            <span className="label-eyebrow text-muted">Studio Kagerō</span>
            <div
              className="font-display text-display-2 leading-none"
              style={{ color: theme.palette.primary }}
              aria-hidden
            >
              {pct}%
            </div>
            <div className="h-[3px] w-[min(60vw,340px)] bg-surface-alt overflow-hidden rounded-full">
              <div
                className="h-full bg-primary transition-[width] duration-200 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-faint uppercase tracking-[0.3em]">
              {pct < 40 ? 'Inking panels' : pct < 80 ? 'Timing frames' : 'Setting the fire'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
