import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts', recipes: 'src/recipes/index.ts' },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom', 'react-aria-components', 'tailwind-variants', 'tailwind-merge', 'clsx'],
})
