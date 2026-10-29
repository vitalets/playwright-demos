import fs from 'node:fs';
import path from 'node:path';
import type { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { writeSummary } from './summary.mjs';

export default class SummaryReporter implements Reporter {
  private config!: FullConfig;
  private attempts: Array<Record<string, unknown>> = [];

  onBegin(config: FullConfig) { this.config = config; }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.workerIndex < 0 || result.status === 'skipped') return;
    this.attempts.push({
      title: test.title, slot: result.parallelIndex, worker: result.workerIndex,
      start: result.startTime.getTime(), duration: result.duration,
      retry: result.retry, status: result.status,
    });
  }

  onEnd(result: FullResult) {
    const shard = this.config.shard?.current ?? 1;
    const run = {
      shard, totalShards: this.config.shard?.total ?? 1,
      workers: this.config.workers, status: result.status,
      start: result.startTime.getTime(), duration: result.duration,
      attempts: this.attempts,
    };
    const dir = process.env.TIMELINE_OUTPUT_DIR ?? 'test-results/timeline';
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `shard-${shard}.json`), JSON.stringify(run, null, 2));
    // Shards only save data. The merge job publishes one combined summary.
    if (!this.config.shard) writeSummary([run], path.join(dir, 'summary.md'));
  }
}
