import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        swc.vite(),
    ],
    test: {
        globals: true,
    },
    resolve: {
        alias: {
            '#': path.resolve(__dirname, './src'),
        }
    },
});
