/// <reference types="vite/client" />

import { defineConfig } from 'vite';
// @ts-expect-error - Vite plugin types are resolved at build time
import vue from '@vitejs/plugin-vue';
// @ts-expect-error - Tailwind plugin types are resolved at build time
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config
// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
