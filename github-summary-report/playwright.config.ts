import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  retries: 1,
  timeout: 15_000,
  reporter: [['list'], ['./reporter.ts']],
});
