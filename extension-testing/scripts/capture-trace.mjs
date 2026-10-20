import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Serve playwright-report/ over HTTP before running this script.
const origin = process.argv[2] || 'http://127.0.0.1:9323';
const output = process.argv[3] || 'test-results/popup-trace-viewer.png';
const trace = await readFile(new URL('../test-results/popup-shows-saved-tasks-in-the-popup/trace.zip', import.meta.url));
const hash = createHash('sha1').update(trace).digest('hex');
const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({
    viewport: { width: 1180, height: 780 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  await page.goto(`${origin}/trace/index.html?trace=../data/${hash}.zip`);
  await page.getByRole('treeitem', { name: /Expect.*toContainText/ }).click();
  await page.getByRole('tab', { name: 'Source', exact: true }).click();
  await page.frameLocator('iframe').first().getByRole('listitem').filter({ hasText: 'Read a book' }).waitFor();
  await page.getByRole('tabpanel', { name: 'Source', exact: true }).getByText("'Buy groceries'", { exact: false }).first().waitFor();
  await page.screenshot({ path: output });
  console.log(output);
} finally {
  await browser.close();
}
