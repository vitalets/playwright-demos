# Playwright Explained: Fully Parallel Mode

Demos and code for the article.

## Non-fully parallel
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/non-fully-parallel.html \
npx playwright test ./test-without-hook
```

## Fully parallel
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/fully-parallel.html \
npx playwright test --fully-parallel ./test-without-hook
```

## Non-fully parallel (with hook)
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/non-fully-parallel-with-hook.html \
npx playwright test ./test-with-hook
```

## Fully parallel (with hook)
```
PLAYWRIGHT_TIMELINE_OUTPUT_FILE=timeline-report/fully-parallel-with-hook.html \
npx playwright test --fully-parallel ./test-with-hook
```