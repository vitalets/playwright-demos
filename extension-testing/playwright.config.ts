import { defineConfig } from '@playwright/test';
import type { WebextOptions } from 'playwright-webext';

export default defineConfig<WebextOptions>({
  testDir: './test',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    extensionPath: './dist',
    trace: 'on',
    screenshot: 'on',
  },
});
