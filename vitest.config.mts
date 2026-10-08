import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['tests/**/*.{test,spec}.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/main.ts', 'src/router/**'],
        reportsDirectory: './coverage',
        reporter: ['html', 'text', 'lcov', 'json'],
        thresholds: {
          statements: 90,
          branches: 80,
          functions: 80,
          lines: 90,
        },
      },
    },
  }),
);
