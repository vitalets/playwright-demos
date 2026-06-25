import { test } from '@playwright/test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('test 1', async ({ page }) => {
  // ...
  await delay(1000);
});

test('test 2', async ({ page }) => {
  // ...
  await delay(1000);
});
