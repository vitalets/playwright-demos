import fs from 'node:fs';
import path from 'node:path';

const seconds = ms => `${(ms / 1000).toFixed(2)}s`;

export function renderSummary(runs) {
  const ordered = [...runs].sort((a, b) => a.shard - b.shard);
  const lines = [
    '# Playwright worker timeline', '',
    'Each shard starts at **00:00** on its own runner. Cross-runner queue delays are excluded.',
    'One row per worker slot; blocks are test attempts. Gaps mean no recorded test attempt.',
    'Red = failed attempt; highlighted = retry. Short IDs keep labels readable.', '',
    '```mermaid', '---', 'displayMode: compact', '---', 'gantt',
    '    title Test distribution by shard and worker',
    '    dateFormat x', '    axisFormat %M:%S', '    todayMarker off', '',
  ];
  let id = 0;
  const rows = [];
  // Use a fixed local-time midnight as the chart origin, avoiding timezone shifts.
  const origin = new Date(2000, 0, 1).getTime();
  for (const run of ordered) {
    const attempts = [...run.attempts].sort((a, b) => a.start - b.start);
    const base = attempts.length ? Math.min(...attempts.map(a => a.start)) : run.start;
    const span = attempts.length ? Math.max(...attempts.map(a => a.start + a.duration)) - base : 0;
    lines.push(`    section Shard ${run.shard}`, `    Total :s${run.shard}, ${origin}, ${Math.max(1, span)}ms`);
    for (let slot = 0; slot < run.workers; slot++) {
      const tasks = attempts.filter(a => a.slot === slot);
      // Empty slots stay visible as zero-duration milestones.
      lines.push(`    section S${run.shard} / Worker ${slot}`);
      if (!tasks.length) lines.push(`    Idle :milestone, idle${run.shard}_${slot}, ${origin}, 0ms`);
      for (const task of tasks) {
        const label = `T${++id}${task.retry ? ' R' + task.retry : ''}`;
        const style = task.status !== 'passed' ? 'crit, ' : task.retry ? 'active, ' : '';
        lines.push(`    ${label} :${style}t${id}, ${origin + task.start - base}, ${Math.max(1, task.duration)}ms`);
      }
    }
    rows.push(`| ${run.shard} | ${run.status} | ${run.workers} | ${attempts.length} | ${attempts.filter(a => a.retry > 0).length} | ${seconds(span)} |`);
  }
  lines.push('```', '', '| Shard | Result | Worker slots | Attempts | Retry attempts | Test window |',
    '| --- | --- | ---: | ---: | ---: | ---: |', ...rows, '',
    'The test window runs from the first attempt start to the last attempt end; setup before it and teardown after it are excluded.',
    'Worker slots use parallelIndex, so restarted worker processes remain on the same row.', '');
  const markdown = lines.join('\n');
  if (Buffer.byteLength(markdown, 'utf8') > 900 * 1024) {
    return '# Playwright worker timeline\n\nTimeline omitted: more than 900 KiB. Download the timeline-data artifact for full results.\n';
  }
  return markdown;
}

export function writeSummary(runs, outputFile) {
  const markdown = renderSummary(runs);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, markdown);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  return markdown;
}
