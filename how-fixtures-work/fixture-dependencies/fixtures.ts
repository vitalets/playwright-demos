import { test as base } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const test = base.extend<{
  fixtureA: string;
  fixtureB: string;
  fixtureC: string;
}>({
  fixtureA: async ({}, use) => {
    console.log('fixture A setup');
    await delay(1000);

    await use('A');

    console.log('fixture A teardown');
    await delay(1000);
  },
  fixtureB: async ({}, use) => {
    console.log('fixture B setup');
    await delay(1000);

    await use('B');

    console.log('fixture B teardown');
    await delay(1000);
  },
  fixtureC: async ({ fixtureA, fixtureB }, use) => {
    console.log('fixture C setup');
    await delay(1000);

    await use(`${fixtureA}${fixtureB}C`);

    console.log('fixture C teardown');
    await delay(1000);
  },
});
