# Playwright in Pictures: Why Workers Restart

Demos and code for the article.

Timelinea are available by the URL:
```
https://vitalets.github.io/playwright-demos/why-workers-restart/__DIR__/timeline-report/index.html
```

## No failures
```
(cd no-failures && npx playwright test --workers 1 --reporter=playwright-timeline-reporter)
```

## One failure
```
(cd one-failure && npx playwright test --workers 1 --reporter=playwright-timeline-reporter)
```

## One failure with hook
```
(cd one-failure-with-hook && npx playwright test --workers 1 --reporter=playwright-timeline-reporter)
```

## Projects with no failures
```
(cd projects-no-failures && npx playwright test --workers 1 --reporter=playwright-timeline-reporter)
```

## Projects with hook
```
(cd projects-with-hook && npx playwright test --workers 1 --reporter=playwright-timeline-reporter)
```

## Test use
```
(cd test-use && npx playwright test --workers 1 --reporter=playwright-timeline-reporter)
```