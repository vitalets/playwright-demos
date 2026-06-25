import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: 'playwright-timeline-reporter',
});
