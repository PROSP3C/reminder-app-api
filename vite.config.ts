import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'node22',
    lib: {
      entry: path.resolve('src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['express', 'pg', 'pg-pool', 'pgpass'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
