# Playwright in Pictures: Why Workers Restart

Demos and code for the article.

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