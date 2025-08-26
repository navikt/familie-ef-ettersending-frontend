import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,

    proxy: {
      '/familie/alene-med-barn/ettersending/api': {
        target: 'http://localhost:8091',
        changeOrigin: true,
      },
    },
  },
});
