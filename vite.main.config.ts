import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'electron',
        'better-sqlite3-multiple-ciphers',
        'typeorm',
        'class-transformer',
        'class-validator',
        'electron-squirrel-startup',
        'node-machine-id',
        'uuid',
      ],
    },
  },
});
