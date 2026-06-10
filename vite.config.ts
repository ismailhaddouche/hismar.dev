import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@commands': resolve(__dirname, 'src/commands'),
      '@animations': resolve(__dirname, 'src/animations'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          'vendor-three': ['three'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (info) => {
          const ext = info.name?.split('.').pop();
          if (ext === 'css') return 'assets/css/[name]-[hash].[ext]';
          if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg'].includes(ext || ''))
            return 'assets/images/[name]-[hash].[ext]';
          if (['woff', 'woff2', 'ttf', 'eot'].includes(ext || ''))
            return 'assets/fonts/[name]-[hash].[ext]';
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
  server: {
    port: 8000,
    open: true,
  },
  preview: {
    port: 8080,
  },
});
