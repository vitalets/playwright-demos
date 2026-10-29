import fs from 'node:fs';
import path from 'node:path';
import { writeSummary } from './summary.mjs';

const dir = process.argv[2] ?? 'test-results/timeline';
const expected = Number(process.argv[3] ?? 2);
const runs = fs.readdirSync(dir).filter(name => /^shard-\d+\.json$/.test(name))
  .map(name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')));
const ids = new Set(runs.map(run => run.shard));
if (runs.length !== expected || ids.size !== expected ||
    runs.some(run => run.totalShards !== expected || run.shard < 1 || run.shard > expected)) {
  throw new Error(`Expected ${expected} distinct shards; got ${runs.map(run => run.shard).join(', ')}`);
}
writeSummary(runs, path.join(dir, 'summary.md'));
