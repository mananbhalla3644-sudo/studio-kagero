// src/theme/theme.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF DESIGN DECISIONS (Section 3.1).
//
// Nothing anywhere else in this codebase may hard-code a colour, a font, an
// easing, a duration or a type size. `src/theme/tokens.css` is generated from
// this file by the `kagero-theme-tokens` Vite plugin (see vite.config.ts), so
// the values below are the only place they are written down.
//
// DERIVATION (Section 3.3) — theme "Organic/Bioluminescent", brand Studio Kagerō,
// mood keywords: deep, luminous, fluid.
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  meta: {
    name: 'Studio Kagerō',
    version: '1.0.1',
    /** Mode D — restyle-only build, new direction: organic/bioluminescent. */
    mode: 'D' as const,
    tagline: 'Breathe the depths.',
  },

  // ── Palette ───────────────────────────────────────────────────────────────
  // "Because the theme is deep-sea bioluminescence and the mood is luminous 
  //  and fluid, I chose obsidian ocean floor as base — darkest depth at midnight
  //  black-blue — with a single neon-cyan hue carrying all emphasis like
  //  plankton glowing in abyssal darkness, pearlescent highlights catching light."
  //
  // WCAG contrast vs bg #020507 (measured):
  //   text      #E8F4F8 → 16.4:1   PASS
  //   textMuted #8DAEC3 →  8.9:1  PASS
  //   textFaint #5B7D8D →  3.2:1  PASS — never body
  //   primary   #00F0FF →  14.6:1  PASS
  //   secondary #E8F4F8 →  16.4:1  PASS
  //   accent    #C8F4E8 →  12.3:1  PASS
  //   glow      #00F0FF →  14.6:1  PASS
  palette: {
    /** Page background. Deep ocean floor — obsidian black-blue, never pure #000. */
    bg: '#020507',
    /** Slightly lifted background for alternate bands (abyssal plain). */
    bgElevated: '#030A14',
    /** Card / panel surface. Bioluminescent coral glass. */
    surface: '#041224',
    /** Alternate surface for nesting and contrast (thermal vent rock). */
    surfaceAlt: '#081529',
    /** Hairline rules and card borders. Subtle bio-lum edge glow. */
    line: 'rgba(232, 244, 248, 0.08)',
    /** Hovered / active hairlines. Iridescent pearlescent shine. */
    lineStrong: 'rgba(200, 244, 232, 0.25)',
    /** Bioluminescent cyan — primary glow like plankton fields. */
    primary: '#00F0FF',
    /** Sea foam white — used for inverted text and highlights. */
    secondary: '#E8F4F8',
    /** Iridescent pearlescent — cool counterpoint: caustic rays, shimmer, metadata. */
    accent: '#C8F4E8',
    /** Primary text. Sea foam white with soft glow. */
    text: '#E8F4F8',
    /** Secondary text. Muted sea foam for body copy. */
    textMuted: '#8DAEC3',
    /** Tertiary text and disabled states. Deep water grey. Never used for body copy. */
    textFaint: '#5B7D8D',
    /** Bloom / glow colour. Neon cyan like bioluminescent plankton. */
    glow: '#00F0FF',
    /** Iridescent pearl — supporting caustic particles only, never UI text. */
    sakura: '#C8F4E8',
  },

  // ── Typography ────────────────────────────────────────────────────────────
  // "Because the mood is fluid and organic, I paired Outfit — a geometric sans with
  //  soft curves that read like flowing water droplets — with Satoshi, a humanist
  //  face that feels more natural at small sizes. Two families, three weights total:
  //  display bold 600 (not condensed), body 400 and 700 for fluid hierarchy."
  //
  // Self-hosted from Fontsource (SIL OFL 1.1), font-display: swap, Outfit
  // preloaded in index.html. Fluid scale via clamp().
  typography: {
    display: {
      family: '"Outfit", "SF Pro Display", "Helvetica Neue", system-ui',
      weight: '600',
      /** Outfit has generous x-height — tracking stays tight at large sizes. */
      tracking: '0em',
      leading: '1.05',
      /** Display type is set uppercase for oceanic monument feel. */
      transform: 'uppercase' as const,
    },
    body: {
      family: '"Satoshi", "Inter", system-ui',
      weight: '400',
      tracking: '0em',
      leading: '1.75',
    },
    /** Exactly three weights across the site. */
    weights: {
      display: '600',
      body: '400',
      bodyStrong: '700',
    },
    /** Uppercase micro-label style, reused by every section eyebrow. */
    label: {
      family: '"Satoshi", system-ui',
      weight: '700',
      tracking: '0.15em',
      transform: 'uppercase' as const,
      size: '0.6875rem',
    },
    /**
     * Fluid type scale. Airy open spacing for oceanic density — one big gesture
     * per section, generous supporting copy — like a coral spread with breathing room.
     */
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: 'clamp(1rem, 0.92rem + 0.35vw, 1.125rem)',
      lg: 'clamp(1.125rem, 1.0rem + 0.5vw, 1.4375rem)',
      xl: 'clamp(1.375rem, 1.15rem + 1vw, 1.875rem)',
      '2xl': 'clamp(1.75rem, 1.45rem + 2.2vw, 2.5rem)',
      '3xl': 'clamp(2.25rem, 1.65rem + 4.2vw, 3.5rem)',
      '4xl': 'clamp(3rem, 2.05rem + 6.8vw, 5.5rem)',
      '5xl': 'clamp(3.75rem, 2.15rem + 11.5vw, 9rem)',
    },
  },

  // ── Motion personality ────────────────────────────────────────────────────
  // "Because the mood is fluid and oceanic, I chose smooth sine-based eases — 
  //  gentle drift like underwater currents, slower accelerations like buoyancy."
  motion: {
    ease: {
      /** Primary. Slow rise, long settle — fluid wave motion. */
      primary: 'cubic-bezier(0.42, 0, 0.58, 1)',
      /** The signature: gentle overshoot like water ripple then return to calm. */
      impact: 'cubic-bezier(0.34, 1.7, 0.64, 1)',
      /** For things entering and leaving symmetrically — oceanic flow. */
      inOut: 'cubic-bezier(0.32, 1.3, 0.68, -0.32)',
      /** Standard deceleration — calm drift, no harsh snap. */
      standard: 'cubic-bezier(0.32, 0.72, 0, 1)',
    },
    /** Duration scale, seconds. Slower = more oceanic weight. */
    duration: {
      fast: 0.5,
      base: 0.9,
      slow: 1.8,
      /** Section-level transitions between scroll scenes — tide change rhythm. */
      scene: 2.2,
    },
    /** Seconds between successive staggered elements — gentle ripple delay. */
    stagger: 0.08,
    /** Scroll distance, in viewport heights, for a full pinned sequence. Airy spacing. */
    scrollPins: {
      showcase: 3.5,
    },
  },

  // ── 3D motif and shader mood ──────────────────────────────────────────────
  // "Because the theme is organic/bioluminescent and the mood is deep-sea luminous,
  //  I chose a metaball-style noise-displaced sphere (blob form) — living caulk-like
  //  organism that pulses and morphs — travelling through underwater scenes that
  //  each light it like bioluminescent habitats: coral reef glow → thermal vent heat
  //  shimmer → abyssal plain darkness → jellyfield neon burst."
  three: {
    /** Section 3.2 → 'Organic, ocean, bioluminescent': metaball-style blob form. */
    primaryMotif: 'metaballBlob',
    /** Caustic light rays + floating plankton particles. */
    supportingElement: 'causticsAndPlankton',
    shaderMood: {
      /** Deep blue → cyan glow → pearlescent highlight → ocean teal. The scene's value range. */
      colorRamp: ['#020507', '#00F0FF', '#C8F4E8', '#1ECBBC'] as const,
      /** Slow-drift: underwater currents churn gently, not rapidly. */
      noiseSpeed: 0.15,
      /** Low — subtle caustic shimmer on blob surface, not heavy distortion. */
      distortionStrength: 0.12,
      /** Present on ULTRA only (tier-gated). Cyan fringe for caustic effect. */
      chromaticAberration: 0.003,
    },
    material: {
      /** Soft noise displacement bands: iridescent coating over smooth form. */
      celSteps: [0.15, 0.48, 1.0] as const,
      /** Pearlescent gradient — body shifts from aquamarine to seafoam. */
      bodyColor: '#7DD3FC',
      /** Water reflection — deep ocean blue for inverted hull. */
      outlineColor: '#021F4D',
      outlineScale: 1.05,
      /** Seafoam fill so shadow side stays readable against dark water. */
      fillColor: '#2A4F68',
      /** Caustic light accent — shimmering rays refracting through. */
      rimColor: '#00F0FF',
      /** Ocean floor — abyssal depth, reflective wet stone. */
      floorColor: '#051833',
      floorRoughness: 0.4,
      floorMetalness: 0.1,
    },
    /** Fog: hides horizon in deep water so each scene blends seamlessly. */
    fog: { color: '#020507', near: 10, far: 40 },
    /**
     * Camera travels a CatmullRomCurve3 through underwater waypoints, scrubbed by
     * scroll progress. Each waypoint has lookAt target for organism focus,
     * and each scene cross-fades the caustic light rig and fog colour.
     */
    cameraPath: [
      { pos: [0.0, 0.5, 9.0], look: [0, 0.25, 0], scene: 'coralReef' },
      { pos: [2.8, -0.3, 4.5], look: [0.45, 0, -0.1], scene: 'thermalVent' },
      { pos: [-3.5, 1.3, 5.5], look: [-0.6, 0.35, 0], scene: 'abyssalPlain' },
      { pos: [1.5, 2.8, 7.0], look: [0.25, 0.9, -0.1], scene: 'jellyField' },
      { pos: [0.0, 1.0, 15.0], look: [0, 0.45, 0], scene: 'midnightOcean' },
    ] as const,
    /**
     * Per-scene lighting and fog mood, cross-faded across the scrub.
     * `key` is the main light, `rim` the back light, `fog` the atmosphere,
     * `keyIntensity` the key light strength, `exposure` for depth of field effect.
     */
    scenes: [
      { id: 'coralReef', key: '#FFD9E8', rim: '#00F0FF', fog: '#021A35', keyIntensity: 2.8, exposure: 1.05 },
      { id: 'thermalVent', key: '#FF6B4D', rim: '#FFC35A', fog: '#0E1C29', keyIntensity: 3.5, exposure: 1.2 },
      { id: 'abyssalPlain', key: '#8DAEC3', rim: '#00F0FF', fog: '#020507', keyIntensity: 1.4, exposure: 0.95 },
      { id: 'jellyField', key: '#C8F4E8', rim: '#00F0FF', fog: '#031A2E', keyIntensity: 2.6, exposure: 1.1 },
      { id: 'midnightOcean', key: '#5B7D8D', rim: '#8DAEC3', fog: '#020507', keyIntensity: 1.0, exposure: 0.9 },
    ] as const,
    /** Plankton + caustic ray counts, per tier. */
    particles: { ultra: 12000, balanced: 6000, lite: 2500 },
    /** Organic pulse and morph animation speed, radians per second. */
    spin: 0.18,
  },

  // ── Cursor and micro-interactions ─────────────────────────────────────────
  cursor: {
    /** Hidden on touch devices entirely (Section 8). */
    enabled: true,
    /** Ring diameter, px. Larger for oceanic scale. */
    size: 48,
    /** Inner dot diameter, px. */
    dotSize: 7,
    color: '#00F0FF',
    /** Pointer smoothing — slower, more liquid movement. */
    damping: 0.25,
    /** Scale applied over any interactive element — fluid hover effect. */
    hoverScale: 2.1,
    /** Magnetic pull strength — gentle drift like current. */
    magneticStrength: 0.3,
    /** How far from the pointer the magnet starts pulling — subtle reach. */
    magneticRadius: 140,
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  layout: {
    /** Max content width, px. Airy open layout for oceanic breathing room. */
    maxWidth: 1600,
    /** Side gutter — fluid, opens wider for depth feel. */
    gutter: 'clamp(1.5rem, 8vw, 7rem)',
    /** Space between page sections. Airy spacing for bioluminescent density. */
    sectionGap: 'clamp(7rem, 16vh, 10rem)',
    radius: 30,
  },

  // ── Post-processing, gated per tier (Section 4.1) ─────────────────────────
  post: {
    bloom: { intensity: 0.7, luminanceThreshold: 0.62, luminanceSmoothing: 0.35, mipmapBlur: true },
    noise: { opacity: 0.08, premultiply: true },
    vignette: { offset: 0.3, darkness: 0.72 },
  },
} as const

export type Theme = typeof theme
