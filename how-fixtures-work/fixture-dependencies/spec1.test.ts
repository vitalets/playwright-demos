import { test } from './fixtures';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('test 1', async ({ fixtureC }) => {
  // ...
  await delay(1000);
});
