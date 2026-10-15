import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom', /^@radix-ui\//, 'clsx', 'tailwind-merge', 'class-variance-authority'],
})
