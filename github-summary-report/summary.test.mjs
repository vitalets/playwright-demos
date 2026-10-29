import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderSummary } from './summary.mjs';

test('shards with different clocks normalize independently; restarted processes keep their slot', () => {
  const run = (shard, start) => ({ shard, workers: 2, start, status: 'passed', attempts: [
    { slot: 0, worker: 0, start, duration: 100, status: 'failed', retry: 0 },
    { slot: 0, worker: 2, start: start + 150, duration: 200, status: 'passed', retry: 1 },
  ] });
  const md = renderSummary([run(2, 900000), run(1, 100000)]);
  assert.equal((md.match(/section S1 \/ Worker 0/g) ?? []).length, 1);
  assert.equal((md.match(/section S2 \/ Worker 0/g) ?? []).length, 1);
  assert.ok(md.includes('displayMode: compact'));
  assert.ok(md.includes('Idle :milestone'));
  const starts = [...md.matchAll(/Total :s\d, (\d+), 350ms/g)].map(m => m[1]);
  assert.equal(starts.length, 2);
  assert.equal(starts[0], starts[1]);
  assert.ok(md.includes('R1 :active'));
});
