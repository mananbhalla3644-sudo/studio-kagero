import { useMagnetic } from '../../hooks/useMagnetic'

interface BadgeProps {
  children: string
  className?: string
}

/** Small eyebrow badge used above section headings. */
export function Badge({ children, className = '' }: BadgeProps) {
  const ref = useMagnetic(0.2, 80)
  return (
    <span
      ref={ref as never}
      className={`label-eyebrow inline-flex items-center gap-2 border border-line px-3.5 py-1.5 rounded-full bg-surface/60 backdrop-blur-sm ${className}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
      {children}
    </span>
  )
}
