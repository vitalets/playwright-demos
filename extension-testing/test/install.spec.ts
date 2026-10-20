import { test } from 'playwright-webext';

test('saves the installation date', async ({ extension }) => {
  await extension.storage.local.expect('installationDate').toMatch(/^\d{4}-\d{2}-\d{2}/);
});
