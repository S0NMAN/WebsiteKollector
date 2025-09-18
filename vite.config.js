import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  // Use relative paths so the built site works when served from a subdirectory
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    // Avoid relying on system utilities that might not exist in all environments
    open: false
  }
});
