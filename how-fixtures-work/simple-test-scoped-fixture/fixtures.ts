import { test as base } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const test = base.extend<{ myTestFixture: string }>({
  myTestFixture: async ({}, use) => {
    console.log('setup');
    await delay(1000);

    await use('fixture value');

    console.log('teardown');
    await delay(1000);
  },
});
