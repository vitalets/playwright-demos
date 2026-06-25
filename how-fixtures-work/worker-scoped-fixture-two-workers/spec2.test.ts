import { test } from './fixtures';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('test 2', async ({ myWorkerFixture }) => {
  // ...
  await delay(1000);
});
