chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === 'install') {
    await chrome.storage.local.set({
      installationDate: new Date().toISOString().slice(0, 10),
    });
  }

  if (reason === 'update' && previousVersion?.startsWith('1.')) {
    const { todos = [] } = await chrome.storage.local.get('todos');
    await chrome.storage.local.set({
      todos: todos.map(name => ({ name, done: false })),
    });
  }
});
