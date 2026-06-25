import { test as base } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const test = base.extend({
  page: async ({ page }, use) => {
    console.log('custom page setup');
    await delay(1000);

    await use(page);

    console.log('custom page teardown');
    await delay(1000);
  },
});
