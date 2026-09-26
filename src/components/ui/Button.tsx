import { forwardRef, type ReactNode } from 'react'
import { useMagnetic } from '../../hooks/useMagnetic'
import { theme } from '../../theme/theme.config'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'ghost'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

/**
 * Section 9 — magnetic buttons with hover/focus states (Section 12: focus
 * states come from the global :focus-visible rule, so nothing is missed).
 * Magnetic values come from theme.cursor (Section 3.1).
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ children, href, variant = 'primary', className = '', onClick, type = 'button', disabled }, forwardedRef) {
    const magneticRef = useMagnetic(theme.cursor.magneticStrength, theme.cursor.magneticRadius)

    const base =
      'relative inline-flex items-center justify-center gap-2 px-7 py-3.5 font-body font-bold text-sm uppercase tracking-[0.14em] rounded-[var(--tk-radius)] cursor-pointer transition-[background,color,box-shadow,transform] duration-[var(--tk-dur-fast)] ease-[var(--tk-ease-primary)] select-none'
    const styles =
      variant === 'primary'
        ? 'bg-primary text-bg shadow-[0_0_0_0_rgba(255,59,48,0)] hover:shadow-[0_8px_34px_rgba(255,59,48,0.45)] hover:-translate-y-0.5'
        : 'bg-transparent text-ink border border-line-strong hover:border-primary hover:text-primary'

    const setRefs = (node: HTMLElement | null) => {
      ;(magneticRef as { current: HTMLElement | null }).current = node
      if (typeof forwardedRef === 'function') forwardedRef(node as never)
      else if (forwardedRef) (forwardedRef as { current: never }).current = node as never
    }

    if (href) {
      return (
        <a
          ref={setRefs}
          href={href}
          className={`${base} ${styles} ${className}`}
          onClick={onClick}
        >
          {children}
        </a>
      )
    }

    return (
      <button ref={setRefs} type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles} ${className} disabled:opacity-40 disabled:pointer-events-none`}>
        {children}
      </button>
    )
  },
)
