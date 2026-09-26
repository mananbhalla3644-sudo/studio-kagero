import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'legacy', 'src/theme/tokens.css'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // react-three-fiber's useFrame callback runs in the render loop, OUTSIDE
    // React render — mutating the camera, uniforms and instanced matrices
    // there is the library's intended API (and Section 4.4 requires it: no
    // allocation, mutate in place). The compiler-backed immutability rule
    // cannot model that boundary, so it is disabled for the 3D layer only.
    files: ['src/components/three/**/*.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
    },
  },
)
