const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const baseUrl = process.env.BASE_URL;
const outputDir = path.join(__dirname, 'screenshots');
const deviceScaleFactor = 2;
const onlyReport = process.env.ONLY_REPORT;

const reports = [
  ['simple-test-scoped-fixture', 'simple-test-scoped-fixture.png'],
  ['test-scoped-fixture-repeats', 'test-scoped-fixture-repeats.png'],
  ['lazy-fixture', 'lazy-fixture.png'],
  ['auto-fixture-runs-without-parameter', 'auto-fixture-runs-without-parameter.png'],
  ['built-in-page-fixture', 'built-in-page-fixture.png'],
  ['override-page-fixture', 'override-page-fixture.png'],
  ['fixture-dependencies', 'fixture-dependencies.png'],
  ['worker-scoped-fixture-spans-tests', 'worker-scoped-fixture-spans-tests.png'],
  ['worker-scoped-fixture-two-workers', 'worker-scoped-fixture-two-workers.png'],
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
      x: Math.round(rect.x - 5),
      y: Math.round(rect.y - 2.5),
      width: Math.round(rect.width + 10),
      height: Math.round(rect.height + 5 + extraBottom),
    };
  }, extraBottom);
}

function reportUrl(report) {
  return baseUrl
    ? `${baseUrl}/${report}/timeline-report/index.html`
    : pathToFileURL(path.join(__dirname, report, 'timeline-report/index.html')).href;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 770, height: 750 },
    deviceScaleFactor,
  });

  for (const [report, filename, extraBottom] of reports) {
    if (onlyReport && report !== onlyReport) continue;

    console.log(`Capturing ${report}...`);
    const page = await context.newPage();
    if (extraBottom) {
      await page.setViewportSize({ width: 770, height: 900 });
    }
    await page.goto(reportUrl(report), {
      waitUntil: 'domcontentloaded',
      timeout: 10_000,
    });
    await page.waitForTimeout(750);

    await page.evaluate(() => {
      document.documentElement.style.zoom = '1.1';
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
    console.log(
      `Saved ${filename}: ${box.width * deviceScaleFactor}x${box.height * deviceScaleFactor}`,
    );
    await page.close();
  }

  await browser.close();
  process.exit(0);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
