import { test } from './fixtures';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('test 1', async () => {
  // ...
  await delay(1000);
});
