import { test as base } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const test = base.extend<{}, { myWorkerFixture: string }>({
  myWorkerFixture: [async ({}, use) => {
    console.log('worker setup');
    await delay(1000);

    await use('worker fixture value');

    console.log('worker teardown');
    await delay(1000);
  }, { scope: 'worker' }],
});
