chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      installationDate: new Date().toISOString().slice(0, 10),
    });
  }
});
