import { useEffect, useRef } from 'react'
import { gsap, SplitText as GsapSplitText } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface SplitTextProps {
  children: string
  /** Element to render. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  mode?: 'lines' | 'words' | 'chars'
  className?: string
  /** Play immediately on mount (hero) or on scroll into view. */
  trigger?: 'load' | 'scroll'
  delay?: number
}

/**
 * Section 9 — split-text reveals. The parent gets an aria-label with the full
 * text and every split fragment is aria-hidden (Section 12: screen readers
 * read the whole string once; motion is never required to understand it).
 */
export function SplitText({
  children,
  as: Tag = 'span',
  mode = 'lines',
  className,
  trigger = 'scroll',
  delay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let split: GsapSplitText | undefined
    let ctx: gsap.Context | undefined
    let cancelled = false

    const setup = () => {
      if (cancelled || !el.isConnected) return
      ctx = gsap.context(() => {
        split = new GsapSplitText(el, {
          type: mode,
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char',
        })
        // Parent carries the accessible full text; fragments are decorative.
        el.setAttribute('aria-label', children)
        const fragments = [...split.chars, ...split.words, ...split.lines]
        fragments.forEach((f) => f.setAttribute('aria-hidden', 'true'))

        const targets: Element[] =
          mode === 'lines' ? split.lines : mode === 'words' ? split.words : split.chars

        gsap.fromTo(
          targets,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power4.out',
            stagger: 0.05,
            delay,
            ...(trigger === 'scroll'
              ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
              : {}),
          },
        )
      }, el)
    }

    // Wait for webfonts so line breaks are measured on the final metrics.
    if (document.fonts?.ready) void document.fonts.ready.then(setup)
    else setup()

    return () => {
      cancelled = true
      ctx?.revert()
      split?.revert()
    }
  }, [children, mode, trigger, delay, reduced])

  return (
    <Tag ref={ref as never} className={className} style={{ display: 'block' }}>
      {children}
    </Tag>
  )
}
