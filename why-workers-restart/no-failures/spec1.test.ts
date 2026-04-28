import { test } from '@playwright/test';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('first', async () => {
  await wait(1000);
});

test('second', async () => {
  await wait(1000);
});

test('third', async () => {
  await wait(1000);
});