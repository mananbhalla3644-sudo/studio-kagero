import { useReducedMotion } from '../../hooks/useReducedMotion'

interface MarqueeProps {
  items: string[]
  /** 'ltr' row moves left→right, 'rtl' right→left (two seamless rows). */
  direction?: 'ltr' | 'rtl'
  className?: string
}

/**
 * Section 10.6 — logo/marquee carousel. Two seamless rows with opposite
 * directions, staggered spacing, edge-fade mask, no visible loop jump.
 * Pauses (renders statically) under reduced motion.
 */
export function Marquee({ items, direction = 'rtl', className = '' }: MarqueeProps) {
  const reduced = useReducedMotion()
  // Duplicate the list so translateX(-50%) loops seamlessly.
  const doubled = [...items, ...items]

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div
        className="flex w-max items-center gap-14 py-4"
        style={
          reduced
            ? { animation: 'none' }
            : {
                animation: `tk-marquee ${items.length * 3.2}s linear infinite`,
                animationDirection: direction === 'ltr' ? 'reverse' : 'normal',
              }
        }
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="font-display text-xl md:text-2xl uppercase tracking-wider text-faint whitespace-nowrap transition-colors duration-300 hover:text-secondary"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
