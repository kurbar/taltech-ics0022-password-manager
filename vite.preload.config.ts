import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config
// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
