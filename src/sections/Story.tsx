import { SplitText } from '../components/ui/SplitText'
import { Badge } from '../components/ui/Badge'

/**
 * Section 10.2 — About / story: scroll-driven storytelling with text reveal.
 * The camera moves through scene 'ink' while this section is on screen; the
 * copy itself is the story, no imagery needed.
 */
export function Story() {
  return (
    <section className="relative py-[var(--tk-section-gap)]" id="story" aria-labelledby="story-title">
      <div className="max-w-[var(--tk-max-width)] mx-auto px-gutter grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <Badge>01 — The studio</Badge>
          <h2 id="story-title" className="mt-6 text-display-3 text-ink">
            <SplitText mode="lines">Ink first,</SplitText>
            <SplitText mode="lines">always.</SplitText>
          </h2>
        </div>

        <div className="md:col-span-7 md:col-start-6 space-y-7 text-lg text-muted">
          <p>
            Kagerō began as three animators drawing overnight episodes on borrowed desks.
            The rule then is the rule now: every sequence starts on paper, gets timed by
            hand, and only then meets the renderer. Tools change. The line doesn&rsquo;t.
          </p>
          <p>
            Today we&rsquo;re fourteen — key animators, in-betweeners, a compositing team and a
            producer who actually answers. We take a story beat, a storyboard or a blank
            page, and return a cut that reads at 24 frames a second and holds up at
            frame one.
          </p>
          <blockquote
            className="border-l-2 border-primary pl-6 font-display text-title text-secondary normal-case tracking-normal leading-tight"
            style={{ textTransform: 'none' }}
          >
            &ldquo;A cut either has weight or it doesn&rsquo;t. You can&rsquo;t post-process weight.&rdquo;
            <footer className="mt-3 font-body text-sm text-faint uppercase tracking-[0.18em]">
              — Rina Kagerō, founder
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
