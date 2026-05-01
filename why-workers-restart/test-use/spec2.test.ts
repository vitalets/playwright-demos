import { test } from '@playwright/test';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.use({ screenshot: 'on' });

test('third', async () => {
  await wait(1000);
});