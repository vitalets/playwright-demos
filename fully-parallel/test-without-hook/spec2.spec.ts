import { test } from '@playwright/test';
import { setTimeout as delay } from 'node:timers/promises';

test('test 1', async () => {
  await delay(1000);
});

test('test 2', async () => {
  await delay(1000);
});

test('test 3', async () => {
  await delay(1000);
});

test('test 4', async () => {
  await delay(1000);
});

test('test 5', async () => {
  await delay(1000);
});
