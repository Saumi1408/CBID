import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './', // ✅ this is CRUCIAL for Firebase or any subpath hosting
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './assert'), // adjust to your structure
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});

