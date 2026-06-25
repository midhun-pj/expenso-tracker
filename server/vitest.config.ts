import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            '@models': path.resolve(__dirname, './src/models'),
            '@modules': path.resolve(__dirname, './src/modules'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
    },
})