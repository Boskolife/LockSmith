/* eslint-disable no-undef */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { htmlFiles } from './getHTMLFileNames';

const input = { main: resolve(__dirname, 'src/index.html') };
htmlFiles.forEach(file => {
  input[file.replace('.html', '')] = resolve(__dirname, 'src', file);
});

// Fallback configuration for older Node.js versions
export default defineConfig({
  base: '/LockSmith',
  root: 'src',
  publicDir: '../public',
  define: {
    global: 'globalThis',
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/templates'),
      context: {
        siteName: 'LockSmith',
        currentYear: new Date().getFullYear(),
      },
    }),
  ],
  build: {
    rollupOptions: {
      input,
    },
    outDir: '../dist/',
    emptyOutDir: true,
    minify: 'terser',
    cssCodeSplit: false,
    target: 'es2015',
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 4173,
    open: true,
    host: true
  },
});
