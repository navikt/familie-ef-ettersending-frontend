import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    root: './src/frontend',
    base: '/familie/alene-med-barn/ettersending/',
    plugins: [react()],
    build: {
        outDir: '../../dist',
        emptyOutDir: true,
        sourcemap: true,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: (id: string) => {
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
    server: {
        port: 3000,
    },
});
