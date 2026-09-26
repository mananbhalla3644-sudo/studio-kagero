/**
 * Section 9 — Loader shows REAL progress tied to actual asset loading,
 * not a fake timer. Assets here are: fonts, the hero poster generation and
 * the 3D chunk (lazy). Each task reports 0..1; progress = weighted mean.
 */

export type TaskId = 'fonts' | 'poster' | 'chunk'

const WEIGHTS: Record<TaskId, number> = { fonts: 0.4, poster: 0.3, chunk: 0.3 }

const state = new Map<TaskId, number>([
  ['fonts', 0],
  ['poster', 0],
  ['chunk', 0],
])

const listeners = new Set<(p: number) => void>()

function totalProgress(): number {
  let sum = 0
  state.forEach((v, k) => {
    sum += v * WEIGHTS[k]
  })
  return sum
}

function notify() {
  const total = totalProgress()
  listeners.forEach((fn) => fn(total))
}

export const loader = {
  report(id: TaskId, fraction: number) {
    state.set(id, Math.max(state.get(id) ?? 0, fraction))
    notify()
  },
  subscribe(fn: (p: number) => void) {
    listeners.add(fn)
    fn(totalProgress())
    return () => {
      listeners.delete(fn)
    }
  },
}

/** Loads the fonts and reports real Font Loading API progress. */
export async function loadFonts(): Promise<void> {
  if (!('fonts' in document)) {
    loader.report('fonts', 1)
    return
  }
  // Real progress: watch the two families the site actually renders with.
  const queries = ['400 1em "Anton"', '400 1em "Zen Kaku Gothic New"', '700 1em "Zen Kaku Gothic New"']
  let done = 0
  const total = queries.length + 1 // + document.fonts.ready
  await Promise.all(
    queries.map(async (q) => {
      try {
        await document.fonts.load(q, 'Kagerō 0123')
      } catch {
        /* font unavailable — swap fallback already applied */
      }
      done += 1
      loader.report('fonts', done / total)
    }),
  )
  await document.fonts.ready
  loader.report('fonts', 1)
}
