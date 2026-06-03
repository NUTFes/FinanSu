import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://view:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  retries: 1,
  workers: 1,
});
