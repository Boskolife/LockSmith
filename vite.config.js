/* eslint-disable no-undef */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { webpPlugin } from './vite-webp-plugin.js';
import { htmlFiles } from './getHTMLFileNames';

const input = { main: resolve(__dirname, 'src/index.html') };
htmlFiles.forEach(file => {
  input[file.replace('.html', '')] = resolve(__dirname, 'src', file);
});

export default defineConfig({
  base: '/LockSmith',
  root: 'src',
  publicDir: '../public',
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/templates'),
      context: {
        siteName: 'LockSmith',
        currentYear: new Date().getFullYear(),
      },
    }),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|bmp|svg)$/i,
      includePublic: true,
      minify: true,
      mozjpeg: {
        quality: 80,
      },
      optipng: {
        optimizationLevel: 7,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
    webpPlugin({
      quality: 80,
      generateWebp: true,
    }),
  ],
  build: {
    rollupOptions: {
      input,
      output: {},
    },
    outDir: '../dist/',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  preview: {
    port: 4173,
    open: true,
    host: true,
  },
  css: {
    devSourcemap: true,
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp'],
  define: {
    global: 'globalThis',
  },
});
