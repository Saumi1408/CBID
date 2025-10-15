import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './', // ensures assets load correctly in Firebase hosting
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/assert'), // adjust if you have components in another folder
    },
  },
  server: {
    port: 3001, // optional: different from main app
    host: '0.0.0.0',
  },
});
