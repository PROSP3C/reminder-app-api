import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  splitting: false,
  target: 'es2020',

  esbuildOptions(options) {
    options.alias = {
      '@': './src',
    }
  },
})
