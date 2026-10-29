# Playwright worker timeline in GitHub Actions Summary

A small, self-contained demo: real Playwright scheduling, synthetic test durations,
and a Mermaid Gantt chart directly on the workflow run summary. No image hosting,
browser download, external website, or reporting service is required.

## Two variants

- [Without sharding](https://github.com/vitalets/playwright-demos/actions/workflows/github-summary.yml): 12 tests, 2 workers; the reporter writes the summary directly.
- [With 2 shards](https://github.com/vitalets/playwright-demos/actions/workflows/github-summary-sharded.yml): 2 workers per shard; each shard uploads JSON and a final job publishes a combined chart.

Open a completed run and scroll to the job summary. Both workflows also support **Run workflow**.

## Run locally

```sh
cd github-summary-report
npm ci
npm test
```

Open `test-results/timeline/summary.md` in a Mermaid-capable Markdown viewer.
One test intentionally fails its first attempt and passes its retry; the final run succeeds.
The tests use delays solely to make scheduling visible, not as an E2E testing pattern.

To reproduce sharding locally (sequential commands are sufficient for the demo):

```sh
TIMELINE_OUTPUT_DIR=timeline-shards npm test -- --shard=1/2
TIMELINE_OUTPUT_DIR=timeline-shards npm test -- --shard=2/2
npm run merge -- timeline-shards 2
```

Separate output prevents Playwright's test-results cleanup from deleting the first shard.
The combined Markdown is written to `timeline-shards/summary.md`.

## How it works

- `reporter.ts` records each attempt's start, duration, retry, status, worker process and slot.
- `summary.mjs` emits Mermaid `gantt` with `displayMode: compact`.
- Each shard has a total-span row, followed by one section per worker slot.
- Non-overlapping attempts in a section share a row. `parallelIndex` keeps a restarted worker on the same row.
- Successful attempts are green and unsuccessful attempts are red, including retries. Blocks have no test labels; full titles remain in JSON.
- Extra right padding reserves space for GitHub’s diagram controls. GitHub does not document a Markdown option to hide these controls or set their initial zoom.
- The reporter appends to `GITHUB_STEP_SUMMARY` automatically if available.
- Sharded runs defer publication to `merge.mjs`, which requires all shards to be present.

## Time semantics and limits

Each shard is aligned to its **first test attempt**, independently. The chart compares
scheduling within shards, not absolute runner start times or queue delays. The total
row spans the first attempt start to the last attempt end. Setup before this window
and teardown after it are excluded. Gaps mean no recorded test attempt, not necessarily
idle CPU. Hooks and steps are not separately visualized.

Compact mode can add a row if recorded intervals overlap. Blocks have no labels,
but hundreds of very short tests can still become unreadable. This is a small demo,
not an aggregated large-suite renderer. Markdown over 900 KiB is replaced with an
artifact notice to avoid GitHub's 1 MiB per-step limit.

```sh
npm run test:reporter
```

References: [Mermaid compact Gantt](https://mermaid.js.org/syntax/gantt.html#output-in-compact-mode),
[GitHub job summaries](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary).
