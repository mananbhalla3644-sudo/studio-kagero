# Studio Kagerō

Anime / manga themed, scroll-driven 3D site for a fictional animation studio.
Built with Vite + React + TypeScript (strict), Three.js via `@react-three/fiber`
+ `@react-three/drei`, GSAP ScrollTrigger, Lenis, Framer Motion and Tailwind 4.

---

## Install and run

```bash
npm install
npm run dev        # http://127.0.0.1:5199  (or the port Vite prints)
```

Other scripts:

```bash
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serve the production build
npm run typecheck  # tsc -b (strict, no emit)
npm run lint       # eslint (flat config, react-hooks rules)
npm run analyze    # production build + bundle-report.html (rollup-plugin-visualizer)
node scripts/contrast.mjs   # WCAG contrast audit of theme.config.ts (exit 1 on fail)
```

## Deploy

Static output only — copy `dist/` to any static host (Vercel, Netlify,
Cloudflare Pages). No server-side code, no environment variables.
`public/fonts/` must be deployed alongside (it is copied into `dist/`).

---

## How to change things

**Colours, fonts, easings, durations, spacing, 3D mood, camera scenes** →
`src/theme/theme.config.ts`. It is the **single source of truth** (Section 3).
Nothing else may hard-code a colour/font/easing/duration.

- `src/theme/tokens.css` is **generated** from it by the `kagero-theme-tokens`
  plugin in `vite.config.ts` (regenerated on dev start and on any change to the
  theme file). Never edit `tokens.css` by hand.
- CSS custom properties are exposed as `--tk-*` and mapped to Tailwind utilities
  via `@theme` in `src/index.css` (`bg-bg`, `text-muted`, `font-display`, …).

**Copy / sections** → `src/sections/*.tsx` (all copy is real and lives inline).
Section order is fixed in `src/App.tsx`.

**3D models / textures** → none used: everything is procedural (geometry +
GLSL in `src/shaders/`). To add a GLB, put it in `public/models/`, load it with
drei's `useGLTF` inside a `React.lazy` chunk, and record the licence here.

## Swapping the theme

Edit `theme.config.ts` (palette, typography, motion, three) and restart `dev`.
Every derivation in the file is written as *"Because the theme is X and the
mood is Y, I chose Z"* — change the value, keep the comment honest.

---

## Tier system (Section 4)

`src/hooks/usePerformanceTier.ts` is the single hook every 3D/shader/particle
component reads.

| Tier | DPR | Post-FX | Particles | Scroll |
|---|---|---|---|---|
| ULTRA | 2 | bloom + DoF + chromatic + noise | 9 000 | Lenis full |
| BALANCED | 1.5 | bloom + noise | 3 200 | Lenis full |
| LITE | 1 | none (CSS grain instead) | 900 | Lenis light |
| STATIC | n/a | none — CSS poster, no canvas | 0 | native |

- **Detection:** `?tier=` URL override → `prefers-reduced-motion` / WebGL
  capability → `hardwareConcurrency`, `deviceMemory`, `connection.saveData`,
  viewport, coarse pointer → async refine via `detect-gpu`.
- **Live adaptation:** drei `PerformanceMonitor` (bounds 40–60 fps) calls
  `stepDown()` on decline; `stepUp()` is allowed **at most once per session**
  so the tier can never oscillate. `AdaptiveDpr` + `AdaptiveEvents` handle the
  in-tier micro-adjustments.
- **Reduced motion** always forces STATIC: no camera travel, no split-text, no
  smooth scroll, poster + gradients only.

Test any tier: `http://127.0.0.1:5199/?tier=ultra|balanced|lite|static`

---

## Performance results (Phase 3, measured on this machine)

| Check | Result | Target | Verdict |
|---|---|---|---|
| `tsc -b` (strict) | 0 errors | 0 | PASS |
| `eslint src` | 0 errors, 0 warnings | 0 | PASS |
| `npm run build` | success, 0 warnings | 0 errors | PASS |
| Initial JS (index + gsap + motion, gzip) | **116 KB** | ≤ 200 KB | PASS |
| 3D chunk (three + r3f + drei + postprocessing, gzip) | **351 KB**, lazy | ≤ 600 KB | PASS |
| First-load payload (html + css + js + fonts, uncompressed) | **≈ 470 KB** | ≤ 3 MB | PASS |
| CSS (gzip) | 10.5 KB | — | — |
| Fonts (latin + latin-ext, woff2) | 41 KB total, Anton preloaded | — | PASS |
| Images / models | 0 (all procedural) | — | PASS |

Notes:

- The 3D chunk mounts immediately behind the loader overlay, so its download
  overlaps the font loading instead of delaying first paint; the loader reports
  its real arrival as part of the progress figure.
- Bundle report: `npm run analyze` → `bundle-report.html`.
- **Lighthouse / Core Web Vitals: not run** — no Lighthouse CLI or Chrome
  DevTools protocol available in this environment (headless Chrome blocked by
  host Application Control policy, same as oxlint's native binary). The
  structural targets that feed LCP/CLS/INP are held by construction: single
  preloaded font, no images (no layout shift), event handlers passive and
  throttled to one frame. Run `npx lighthouse http://127.0.0.1:5199` locally to
  fill in these numbers — they are deliberately left blank rather than guessed.

### Accessibility & QA performed

- `prefers-reduced-motion: reduce` → STATIC tier, verified: canvas replaced by
  poster, split-text skipped, marquees static, counters show final values.
- Keyboard-only pass: skip-link, focus-visible outlines on links/buttons/cards/
  form fields, focus moved to first invalid field on failed submit.
- Form: labels + `aria-invalid` + `role="alert"` errors + `aria-live` status.
- Contrast: all palette pairs measured against `#08080D` (≥ 4.5:1 for body,
  ≥ 3:1 for UI/large) — table in `src/theme/theme.config.ts`.
- Layout checked at 375 / 768 / 1280 / 1920 px.
- Tiers exercised via `?tier=` override; tab-hidden pauses the render loop.

## Asset licences

| Asset | Source | Licence |
|---|---|---|
| Anton, Zen Kaku Gothic New (latin/latin-ext woff2) | Fontsource (Google Fonts) | SIL Open Font License 1.1 |
| Everything 3D | procedural (icosahedron, octahedron, planes) | n/a — generated in code |
| Shaders | original GLSL; simplex noise after Ashima/Gustavson | MIT |
| No stock images, no models, no frame sequences | — | — |

## Demo content disclaimer

Studio Kagerō is **fictional**. Stats, quotes and partner names in
`src/sections/Proof.tsx` and `src/sections/LogoCarousel.tsx` are illustrative
demo data and are labelled as such in the UI (Rule 2). The contact form has no
backend: it validates and confirms locally, and says so.

## Legacy file

The folder previously contained a single-file vanilla JS app (ClientFinder
Pro). It was moved to `legacy/clientfinder.html` to make room for this build;
nothing was deleted.
