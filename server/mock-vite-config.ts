// Simple mock Vite config to be used when vite.config.ts is missing
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    hmr: true,
  },
  root: path.resolve(__dirname, 'client'),
});