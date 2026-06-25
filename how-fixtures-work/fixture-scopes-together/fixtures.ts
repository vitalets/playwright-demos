import { test as base } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const test = base.extend<
  { myTestFixture: string },
  { myWorkerFixture: string }
>({
  myTestFixture: async ({}, use) => {
    console.log('test fixture setup');
    await delay(1000);

    await use('fixture value');

    console.log('test fixture teardown');
    await delay(1000);
  },
  myWorkerFixture: [async ({}, use) => {
    console.log('worker fixture setup');
    await delay(1000);

    await use('worker fixture value');

    console.log('worker fixture teardown');
    await delay(1000);
  }, { scope: 'worker' }],
});
