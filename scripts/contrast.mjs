// WCAG contrast verification for the palette in src/theme/theme.config.ts.
// Run: node scripts/contrast.mjs
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../src/theme/theme.config.ts', import.meta.url), 'utf8')

const hex = (key) => {
  const m = src.match(new RegExp(`${key}:\\s*'(#[0-9A-Fa-f]{6})'`))
  if (!m) throw new Error(`palette.${key} not found`)
  return m[1]
}

const srgb = (c) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

const luminance = (h) => {
  const r = parseInt(h.slice(1, 3), 16)
  const g = parseInt(h.slice(3, 5), 16)
  const b = parseInt(h.slice(5, 7), 16)
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
}

const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

const bg = hex('bg')
const checks = [
  ['text', hex('text'), 4.5],
  ['textMuted', hex('textMuted'), 4.5],
  ['textFaint', hex('textFaint'), 3.0],
  ['primary', hex('primary'), 4.5],
  ['secondary', hex('secondary'), 4.5],
  ['accent', hex('accent'), 4.5],
  ['glow', hex('glow'), 3.0],
]

let fail = 0
console.log(`bg = ${bg}\n`)
for (const [name, color, need] of checks) {
  const ratio = contrast(bg, color)
  const pass = ratio >= need
  if (!pass) fail++
  console.log(
    `${name.padEnd(10)} ${color}  ${ratio.toFixed(2).padStart(6)}:1  (needs ${need})  ${pass ? 'PASS' : 'FAIL'}`,
  )
}
console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILURES`)
process.exit(fail === 0 ? 0 : 1)
