// Speed-line burst field (Section 3.2 anime: "speed-line bursts").
// Radial streaks that converge on the pointer, scrolling with time.
uniform float uTime;
uniform vec2 uPointer;   // -1..1
uniform vec3 uColor;
uniform float uIntensity;

varying vec2 vUv;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p -= uPointer * 0.35;
  float angle = atan(p.y, p.x);
  float radius = length(p);

  // Streaks: high-frequency angular function, sharpened.
  float lines = abs(sin(angle * 42.0 + uTime * 1.6));
  lines = pow(lines, 14.0);

  // Only outside a soft inner circle — the centre stays clear for content.
  float mask = smoothstep(0.35, 0.95, radius);

  float alpha = lines * mask * uIntensity;
  gl_FragColor = vec4(uColor, alpha);
}
