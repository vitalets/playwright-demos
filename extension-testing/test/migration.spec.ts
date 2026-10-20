import { test } from 'playwright-webext';

test.use({
  extensionAutoInstall: false,
});

test('migrates todos from v1 to v2', async ({ extension }) => {
  // install the old version
  await extension.install('./test/dist-v1');

  // populate the storage
  await extension.storage.local.set({
    todos: ['Buy groceries', 'Read a book'],
  });

  // upgrade to the new version
  await extension.upgrade();

  // check the migrated data
  await extension.storage.local.expect('todos').toEqual([
    { name: 'Buy groceries', done: false },
    { name: 'Read a book', done: false },
  ]);
});
