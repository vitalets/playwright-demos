const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('playwright');

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173/how-fixtures-work';
const outputDir = path.join(__dirname, 'screenshots');

const reports = [
  ['simple-test-scoped-fixture', 'simple-test-scoped-fixture.png'],
  ['test-scoped-fixture-repeats', 'test-scoped-fixture-repeats.png'],
  ['lazy-fixture', 'lazy-fixture.png'],
  ['auto-fixture-runs-without-parameter', 'auto-fixture-runs-without-parameter.png'],
  ['built-in-page-fixture', 'built-in-page-fixture.png'],
  ['override-page-fixture', 'override-page-fixture.png'],
  ['fixture-dependencies', 'fixture-dependencies.png'],
  ['worker-scoped-fixture-spans-tests', 'worker-scoped-fixture-spans-tests.png'],
  ['worker-scoped-fixture-two-workers', 'worker-scoped-fixture-two-workers.png', 50],
  ['fixture-scopes-together', 'fixture-scopes-together.png'],
];

async function findTimelineBox(page, extraBottom = 0) {
  return page.locator('.chart-legend').evaluate((element, extraBottom) => {
    let timeline = element;
    for (let level = 0; level < 4; level++) {
      timeline = timeline.parentElement;
    }

    const rect = timeline.getBoundingClientRect();
    return {
      x: rect.x - 5,
      y: rect.y - 2.5,
      width: rect.width + 10,
      height: rect.height + 5 + extraBottom,
    };
  }, extraBottom);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1155, height: 750 },
    deviceScaleFactor: 2,
  });

  for (const [report, filename, extraBottom] of reports) {
    console.log(`Capturing ${report}...`);
    const page = await context.newPage();
    if (extraBottom) {
      await page.setViewportSize({ width: 1155, height: 900 });
    }
    await page.goto(`${baseUrl}/${report}/timeline-report/index.html`, {
      waitUntil: 'domcontentloaded',
      timeout: 10_000,
    });
    await page.waitForTimeout(750);

    await page.evaluate(() => {
      document.documentElement.style.zoom = '1.5';
    });
    await page.waitForTimeout(200);

    const box = await findTimelineBox(page, extraBottom);
    if (!box) throw new Error(`Timeline container not found: ${report}`);

    await page.screenshot({
      path: path.join(outputDir, filename),
      clip: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      },
      timeout: 10_000,
    });
    console.log(`Saved ${filename}: ${Math.round(box.width * 2)}x${Math.round(box.height * 2)}`);
    await page.close();
  }

  await browser.close();
  process.exit(0);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
