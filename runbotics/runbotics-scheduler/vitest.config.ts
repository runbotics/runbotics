import path from 'path';
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['**/*.spec.ts'],
    },
    resolve: {
        alias: {
            '#': path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        swc.vite(),
    ],
});
