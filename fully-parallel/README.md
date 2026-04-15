# Playwright in Pictures: Fully Parallel Mode

Demos and code for the article.

## Non-fully parallel
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/non-fully-parallel.html \
npx playwright test ./test-without-hook
```

[Live report](https://vitalets.github.io/playwright-demos/fully-parallel/timeline-report/non-fully-parallel.html).

## Fully parallel
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/fully-parallel.html \
npx playwright test --fully-parallel ./test-without-hook
```

[Live report](https://vitalets.github.io/playwright-demos/fully-parallel/timeline-report/fully-parallel.html).

## Non-fully parallel (with hook)
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/non-fully-parallel-with-hook.html \
npx playwright test ./test-with-hook
```

[Live report](https://vitalets.github.io/playwright-demos/fully-parallel/timeline-report/non-fully-parallel-with-hook.html).

## Fully parallel (with hook)
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/fully-parallel-with-hook.html \
npx playwright test --fully-parallel ./test-with-hook
```

[Live report](https://vitalets.github.io/playwright-demos/fully-parallel/timeline-report/fully-parallel-with-hook.html).