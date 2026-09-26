import { useRef, useState, type FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SplitText } from '../components/ui/SplitText'
import { theme } from '../theme/theme.config'

interface Errors {
  name?: string
  email?: string
  brief?: string
}

/**
 * Section 10.7 — Contact + footer: strong CTA, animated form with real
 * validation and accessible inline errors (aria-live, aria-invalid,
 * labels tied to inputs). Submit is local-only: this is a static site with
 * no backend, so success state says so honestly.
 */
export function Contact() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')
  const nameRef = useRef<HTMLInputElement>(null)

  const validate = (data: FormData): Errors => {
    const next: Errors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const brief = String(data.get('brief') ?? '').trim()

    if (name.length < 2) next.name = 'Please tell us what to call you (at least 2 characters).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Enter a valid email address, e.g. you@studio.com.'
    if (brief.length < 20) next.brief = `Give us at least 20 characters — you have ${brief.length}.`
    return next
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next = validate(data)
    setErrors(next)
    if (Object.keys(next).length > 0) {
      // Move focus to the first invalid field for keyboard users.
      const first = Object.keys(next)[0]
      const el = e.currentTarget.elements.namedItem(first) as HTMLElement | null
      el?.focus()
      return
    }
    setStatus('sent')
    e.currentTarget.reset()
  }

  const field =
    'w-full rounded-[var(--tk-radius)] border bg-surface/70 px-4 py-3 text-ink placeholder:text-faint outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(56,225,255,0.15)]'

  return (
    <section className="relative py-[var(--tk-section-gap)]" id="contact" aria-labelledby="contact-title">
      <div className="max-w-[var(--tk-max-width)] mx-auto px-gutter grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <Badge>05 — Start a project</Badge>
          <h2 id="contact-title" className="mt-6 text-display-3 text-ink">
            <SplitText mode="lines">Send us</SplitText>
            <SplitText mode="lines">the beat.</SplitText>
          </h2>
          <p className="mt-6 text-muted max-w-[34ch]">
            Tell us the format, the deadline and the feeling you&rsquo;re after. We reply within
            two working days with a route and a range.
          </p>

          <dl className="mt-10 space-y-4 text-sm">
            <div className="flex gap-3">
              <dt className="text-faint uppercase tracking-[0.16em] w-20 shrink-0">Email</dt>
              <dd className="text-secondary">hello@studiokagero.example</dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-faint uppercase tracking-[0.16em] w-20 shrink-0">Studio</dt>
              <dd className="text-secondary">Nakameguro, Tokyo — remote-friendly</dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-faint uppercase tracking-[0.16em] w-20 shrink-0">Hours</dt>
              <dd className="text-secondary">Mon–Fri, 10:00–19:00 JST</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-[var(--tk-radius)] border border-line bg-surface/50 backdrop-blur-md p-7 space-y-5"
            aria-describedby="form-note"
          >
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-[0.16em] text-muted mb-2">
                Your name
              </label>
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Rina Kagerō"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={field}
                style={{ borderColor: errors.name ? theme.palette.primary : theme.palette.line }}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-2 text-sm" style={{ color: theme.palette.primary }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.16em] text-muted mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={field}
                style={{ borderColor: errors.email ? theme.palette.primary : theme.palette.line }}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-2 text-sm" style={{ color: theme.palette.primary }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="brief" className="block text-xs font-bold uppercase tracking-[0.16em] text-muted mb-2">
                Project brief
              </label>
              <textarea
                id="brief"
                name="brief"
                rows={5}
                placeholder="12-episode opening sequence, delivery in March, cinematic and melancholic…"
                aria-invalid={!!errors.brief}
                aria-describedby={errors.brief ? 'brief-error' : 'form-note'}
                className={`${field} resize-y`}
                style={{ borderColor: errors.brief ? theme.palette.primary : theme.palette.line }}
              />
              {errors.brief && (
                <p id="brief-error" role="alert" className="mt-2 text-sm" style={{ color: theme.palette.primary }}>
                  {errors.brief}
                </p>
              )}
            </div>

            <p id="form-note" className="text-xs text-faint">
              No backend on this demo site — submitting validates your input and confirms locally.
            </p>

            <div aria-live="polite" className="min-h-[1.5rem]">
              {status === 'sent' && (
                <p className="text-sm font-bold" style={{ color: theme.palette.accent }}>
                  Brief received — in a real deployment this would reach the studio inbox. We&rsquo;d reply within two
                  working days.
                </p>
              )}
            </div>

            <Button type="submit">Send the brief</Button>
          </form>
        </div>
      </div>

      <footer className="mt-[var(--tk-section-gap)] border-t border-line pt-8">
        <div className="max-w-[var(--tk-max-width)] mx-auto px-gutter flex flex-wrap items-center justify-between gap-5 text-sm text-faint">
          <p className="font-display text-lg text-secondary tracking-wider">
            STUDIO KAGER<span style={{ color: theme.palette.primary }}>Ō</span>
          </p>
          <p>© {new Date().getFullYear()} Studio Kagerō — fictional demo studio. Built as an immersive 3D showcase.</p>
          <nav aria-label="Footer">
            <ul className="flex gap-6">
              {[
                ['Story', '#story'],
                ['Services', '#services'],
                ['Work', '#work'],
                ['Contact', '#contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="hover:text-primary transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </section>
  )
}
