import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig((env) => ({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
        root: '.',
        globals: true,
        clearMocks: true,
    },
}));
