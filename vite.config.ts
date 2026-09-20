import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the same build works on GitHub Pages project sites and
  // at a domain root.
  base: './',
  build: {
    outDir: 'dist',
    // Scenes are code-split: a lesson only downloads the demo it uses.
    target: 'es2022',
  },
});
