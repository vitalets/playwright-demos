import { test } from '@playwright/test';
import { setTimeout as delay } from 'node:timers/promises';

test('test 1', async () => {
  await delay(1000);
});
