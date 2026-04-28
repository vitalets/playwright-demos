import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'project-a' },
    { name: 'project-b' },
  ],
});
