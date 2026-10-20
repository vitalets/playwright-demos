import { expect } from '@playwright/test';
import { test } from 'playwright-webext';

// This example tests the string-based todos in version 1.
test.use({
  extensionPath: './test/dist-v1',
  viewport: { width: 440, height: 320 },
});

test('shows saved tasks in the popup', async ({ extension }) => {
  // prepare the storage
  await extension.storage.local.set({
    todos: ['Buy groceries', 'Read a book'],
  });

  // open the popup and check the tasks
  const popup = await extension.openPopup();
  await expect(popup.getByRole('listitem')).toContainText([
    'Buy groceries',
    'Read a book',
  ]);

  // delete the task
  await popup.getByRole('button', { name: 'Delete Buy groceries' }).click();
  await extension.storage.local.expect('todos').toEqual(['Read a book']);
});
