import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 2,
  reporter: [
    ['playwright-timeline-reporter']
  ]
});
