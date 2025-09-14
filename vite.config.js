import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        compression({
            algorithm: 'gzip',
            exclude: [/\.(br)$/, /\.(gz)$/],
            threshold: 10240,
        }),
        compression({
            algorithm: 'brotliCompress',
            exclude: [/\.(br)$/, /\.(gz)$/],
            threshold: 10240,
        }),
        process.env.ANALYZE && visualizer({
            open: true,
            filename: 'dist-stats.html',
        }),
    ].filter(Boolean),
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('@headlessui') || id.includes('@inertiajs')) {
                            return 'ui-vendor';
                        }
                    }
                },
            },
        },
        chunkSizeWarningLimit: 500,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        reportCompressedSize: false,
    },
    server: {
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: true,
        },
    },
});
