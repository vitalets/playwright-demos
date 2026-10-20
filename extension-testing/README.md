# Extension Testing

A small todo list extension and Playwright tests using `playwright-webext`.
The popup reads tasks from `chrome.storage.local`. You can add tasks and delete them with the × button on the right.

## Run the test

Use Node.js 22.12 or later. From this directory:

```sh
npm ci
npx playwright install chromium
npm test
```

`npm test` prepares `dist/` before running Playwright. To run Playwright directly,
run `npm run build` first.

Run `npm run typecheck` to check the TypeScript files without launching a browser.

The install test checks that installationDate starts with a YYYY-MM-DD pattern.
The popup test uses the v1 build in `test/dist-v1` and puts two task strings into storage, opens the popup document, and checks that
both tasks appear among the list items. Additional tasks are allowed, but the expected tasks must appear in the given order.

The migration test installs v1 from `test/dist-v1`, seeds string todos, and upgrades to v2
from the configured `dist`. It checks that both tasks become objects with name and done: false.
The v2 update handler performs the migration. Clicking its delete button removes a task from storage
and animates it out of the popup.

## Files

- `src/`: current extension source with object todos and an update migration.
- `dist/`: current build, prepared by `npm run build`.
- `test/dist-v1/`: saved v1 build with string todos, used by the tests.
- `scripts/build.mjs`: builds `src/` into `dist/`.
- `playwright.config.ts`: points at the extension and the `test` directory.
- `test/popup.spec.ts`: popup test.
- `test/install.spec.ts`: installation date test.
- `test/migration.spec.ts`: v1 to v2 storage migration test.

To try the extension manually, open `chrome://extensions`, enable Developer mode,
run `npm run build`, and use Load unpacked to select `dist/`. Open its toolbar popup to add tasks.

Playwright opens the popup document in a regular tab. It does not reproduce native
toolbar popup sizing or dismissal behavior.

## HTML report and traces

The config records traces and screenshots for every test. After `npm test`, run:

```sh
npx playwright show-report
```

Open the popup test and select its trace to inspect the list assertion. The popup
test uses a compact viewport so the todo list is readable in the trace snapshot.
The article introduces this test before the upgrade to v2; the demo explicitly
selects test/dist-v1 so it can run alongside the migration test.

To reproduce the article screenshot, serve the report in one terminal:

```sh
python3 -m http.server 9323 --bind 127.0.0.1 --directory playwright-report
```

Then capture the viewer in another terminal:

```sh
node scripts/capture-trace.mjs http://127.0.0.1:9323 test-results/popup-trace-viewer.png
```
