import { defineConfig, type Plugin } from 'vite'
import { writeFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { theme } from './src/theme/theme.config'

/**
 * Generates `src/theme/tokens.css` from theme.config.ts so that CSS (Tailwind
 * layer, keyframes, canvas fallback) reads the SAME single source of truth the
 * TypeScript components read. Regenerated on every dev start and on any change
 * to theme.config.ts — theme.config.ts remains the only editable file.
 */
function themeTokens(): Plugin {
  const target = new URL('./src/theme/tokens.css', import.meta.url)
  const generate = () => {
    const p = theme.palette
    const m = theme.motion
    const t = theme.typography
    writeFileSync(
      target,
      `/* AUTO-GENERATED from src/theme/theme.config.ts — do not edit by hand. */
:root {
  color-scheme: dark;

  --tk-bg: ${p.bg};
  --tk-bg-elevated: ${p.bgElevated};
  --tk-surface: ${p.surface};
  --tk-surface-alt: ${p.surfaceAlt};
  --tk-line: ${p.line};
  --tk-line-strong: ${p.lineStrong};
  --tk-primary: ${p.primary};
  --tk-secondary: ${p.secondary};
  --tk-accent: ${p.accent};
  --tk-text: ${p.text};
  --tk-text-muted: ${p.textMuted};
  --tk-text-faint: ${p.textFaint};
  --tk-glow: ${p.glow};
  --tk-sakura: ${p.sakura};

  --tk-font-display: ${t.display.family};
  --tk-font-body: ${t.body.family};
  --tk-weight-display: ${t.weights.display};
  --tk-weight-body: ${t.weights.body};
  --tk-weight-strong: ${t.weights.bodyStrong};
  --tk-label-tracking: ${t.label.tracking};

  --tk-size-xs: ${t.scale.xs};
  --tk-size-sm: ${t.scale.sm};
  --tk-size-base: ${t.scale.base};
  --tk-size-lg: ${t.scale.lg};
  --tk-size-xl: ${t.scale.xl};
  --tk-size-2xl: ${t.scale['2xl']};
  --tk-size-3xl: ${t.scale['3xl']};
  --tk-size-4xl: ${t.scale['4xl']};
  --tk-size-5xl: ${t.scale['5xl']};

  --tk-ease-primary: ${m.ease.primary};
  --tk-ease-impact: ${m.ease.impact};
  --tk-ease-in-out: ${m.ease.inOut};
  --tk-ease-standard: ${m.ease.standard};
  --tk-dur-fast: ${m.duration.fast}s;
  --tk-dur-base: ${m.duration.base}s;
  --tk-dur-slow: ${m.duration.slow}s;
  --tk-dur-scene: ${m.duration.scene}s;
  --tk-stagger: ${m.stagger}s;

  --tk-max-width: ${theme.layout.maxWidth}px;
  --tk-gutter: ${theme.layout.gutter};
  --tk-section-gap: ${theme.layout.sectionGap};
  --tk-radius: ${theme.layout.radius}px;
}
`,
    )
  }

  return {
    name: 'kagero-theme-tokens',
    buildStart() {
      generate()
    },
    configureServer(server) {
      generate()
      server.watcher.add('src/theme/theme.config.ts')
      server.watcher.on('change', (file) => {
        if (file.endsWith('theme.config.ts')) generate()
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    themeTokens(),
    react(),
    tailwindcss(),
    // Bundle-size report for `npm run analyze` (Section 4.5).
    mode === 'analyze' &&
      visualizer({ filename: 'bundle-report.html', gzipSize: true, brotliSize: true }),
  ].filter(Boolean) as Plugin[],
  build: {
    target: 'es2022',
    // Keep three/r3f out of the initial chunk: it is lazy-loaded after paint.
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (/three|@react-three|postprocessing|maath|troika|stats-gl|meshoptimizer/.test(id)) return 'three'
            if (/gsap|@gsap/.test(id)) return 'gsap'
            if (/framer-motion|motion-dom/.test(id)) return 'motion'
          }
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
}))
