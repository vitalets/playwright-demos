import { test, expect } from '@playwright/test';

// Synthetic work makes scheduling visible without browsers or an external website.
// Delays are intentional here; they are not a recommendation for real E2E tests.
const durations = [900, 1600, 700, 2400, 1100, 1800, 800, 3200, 1200, 600, 2200, 1400];
for (const [index, duration] of durations.entries()) {
  test(`T${String(index + 1).padStart(2, '0')} (${duration} ms)`, async ({}, testInfo) => {
    await new Promise(resolve => setTimeout(resolve, duration));
    // One intentional first-attempt failure shows a retry and a worker restart.
    if (index === 3) expect(testInfo.retry, 'Intentional demo retry').toBe(1);
  });
}
