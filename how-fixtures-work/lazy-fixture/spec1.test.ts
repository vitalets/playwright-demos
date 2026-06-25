import { test as base } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const test = base.extend<{ myTestFixture: string }>({
  myTestFixture: async ({}, use) => {
    console.log('setup');
    await delay(1000);

    await use('fixture value');

    console.log('teardown');
    await delay(1000);
  },
});

test('test 1', async ({ myTestFixture }) => { // <-- references 'myTestFixture'
  // ...
  await delay(1000);
});

test('test 2', async () => {
  // ...
  await delay(1000);
});
