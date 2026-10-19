#!/usr/bin/env node
/* Kickoff's After check (.github/workflows/kickoff.yml, the block between "AFTER-CHECK START" and "AFTER-CHECK END") run in
   Node against fixtures, no network: an item with an unmet owner-ok key, an unknown key or an open dependency must stay
   unstarted; a met one must start (2026-10-18: explicit [next] lines skipped the check, Kaizen (Gale), #222). < 1 s. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const yml = readFileSync(join(ROOT, '.github', 'workflows', 'kickoff.yml'), 'utf8');
let n = 0, fail = 0;
const check = (ok, what) => { n++; if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); };

const m = yml.match(/\/\/ AFTER-CHECK START[^\n]*\n([\s\S]*?)\n\s*\/\/ AFTER-CHECK END/);
check(!!m, 'kickoff.yml has the AFTER-CHECK block');
if (!m) { console.log('KICKOFF CHECKS FAILED'); process.exit(1); }

const DECISIONS = [
  '| Key | Topic | Decision | Source |', '| --- | --- | --- | --- |',
  '| — | Met gate (`owner-ok-met`) | Owner, typed 2026-10-18: "Yes" |',
  '| — | Relayed gate (`owner-ok-relayed`) | Relayed by the coordinator |',
  '| — | 0.5 mockups (`owner-ok-S2`) | Owner, typed 2026-10-17: "Yes S1 and S2" |',
  '| — | 0.7 sync (`owner-ok-0.7-sync`) | Owner, typed 2026-10-18: "Yes" |',
  '| — | 0.6 sync (`owner-ok-0.6-sync`) | Owner, typed 2026-10-16: "Yes" |',
  '| — | 0.7.1 fix (`owner-ok-0.7.1-fix`) | Owner, typed 2026-10-19: "Yes" |',
].join('\n');
const github = { rest: { repos: { getContent: async ({ path }) => {
  if (path === 'docs/DECISIONS.md') return { data: { content: Buffer.from(DECISIONS).toString('base64') } };
  if (path === 'docs/research') return { data: [{ name: 'ranger-icons.md' }] };
  throw new Error('unexpected path ' + path);
} } } };
const core = { warning: (s) => console.log('warning: ' + s), info: () => {} };
const item = (num, ver, key, open, after) => ({ n: num, ver, rel: ver, key, open, body: `Spec.\n\nAfter: ${after}\n\n- [next] #${num} opus lanes:none\n` });
// 0.6 items keep unversioned owner-ok tokens; 0.7 items need owner-ok-0.7-<slug> (K12).
const items = [
  item(1, '0.6', 'P1', false, 'none.'),
  item(2, '0.6', 'P2', true, 'P1, owner-ok-met.'),
  item(3, '0.6', 'P3', true, 'P1, owner-ok-unmet.'),
  item(4, '0.6', 'P4', true, 'P1, owner-ok-relayed.'),
  item(5, '0.6', 'P5', true, 'P1, C1.'),
  item(6, '0.6', 'P6', true, 'P2 (the guide).'),
  item(7, '0.6', 'R', true, 'everything, and `DATA OK 0.6.0`.'),
  item(11, '0.7', 'S2', false, 'none.'),
  item(12, '0.7', 'P6', true, 'S2, owner-ok-S2.'),
  item(13, '0.7', 'P5', true, 'S2, owner-ok-0.7-sync.'),
  item(14, '0.7', 'P7', true, 'owner-ok-0.6-sync.'),
  item(15, '0.7', 'P8', true, 'S2, owner-ok-0.7-unmet. (Note.)'),
];
const keyed = new Map(items.map((x) => [`${x.ver} ${x.key}`, x]));
// Patch items (title "0.6.1 F1: ..."): what a patch release's "After: everything" waits for.
const patch = [
  { n: 21, rel: '0.6.1', key: '0.6.1 F1', open: false }, { n: 22, rel: '0.6.1', key: '0.6.1 F2', open: false },
  { n: 23, rel: '0.6.2', key: '0.6.2 F1', open: true },
];
const afterBlocker = await new (Object.getPrototypeOf(async () => {}).constructor)(
  'github', 'core', 'owner', 'repo', 'items', 'keyed', 'patch', 'Buffer', m[1] + '\nreturn afterBlocker;',
)(github, core, 'o', 'r', items, keyed, patch, Buffer);
const byN = (k) => items.find((x) => x.n === k);
const unkeyed = (after, rel = '0.6.1') => ({ n: 99, ver: null, rel, key: null, open: true, body: after === null ? 'A data fix.\n' : `After: ${after}\n` });

check((await afterBlocker(byN(2))) === '', 'met: closed dependency and a typed owner-ok key -> starts');
check(/waits on owner-ok-unmet/.test(await afterBlocker(byN(3))), 'unmet owner-ok key (no row) -> stays unstarted');
check(/waits on owner-ok-relayed/.test(await afterBlocker(byN(4))), 'owner-ok row not "Owner, typed" -> stays unstarted');
check(/not understood/.test(await afterBlocker(byN(5))), 'unknown key (C1) -> stays unstarted');
check(/waits on open P2 #2/.test(await afterBlocker(byN(6))), 'open dependency, note in parentheses dropped -> stays unstarted');
check(/waits on open/.test(await afterBlocker(byN(7))), 'release "After: everything" with open items -> stays unstarted');
check((await afterBlocker(unkeyed(null))) === '', 'no After line (e.g. a data-fix issue) -> starts');
check((await afterBlocker(unkeyed('none.'))) === '', 'unkeyed issue, After: none -> starts');
check((await afterBlocker(unkeyed('research-ranger-icons.'))) === '', 'unkeyed issue (0.6.1 F5), research file on main -> starts');
check(/waits on research-gladiator/.test(await afterBlocker(unkeyed('research-gladiator-guide.'))), 'unkeyed issue, research missing -> stays unstarted');
check(/not understood/.test(await afterBlocker(unkeyed('F1.'))), 'unkeyed issue naming an item key -> not understood, stays unstarted');
check(/not understood/.test(await afterBlocker(unkeyed('everything.', null))), 'unversioned issue, After: everything -> not understood, stays unstarted');
check(/not understood/.test(await afterBlocker(unkeyed('everything.', '0.7'))), 'minor-only title with no item key, After: everything -> not understood');
check((await afterBlocker(unkeyed('everything, and `DATA OK 0.6.1` (sent by the planner).', '0.6.1'))) === '', 'patch release 0.6.1, every 0.6.1 item closed -> starts');
check(/waits on open 0\.6\.2 F1 #23/.test(await afterBlocker(unkeyed('everything.', '0.6.2'))), 'patch release 0.6.2 with an open 0.6.2 item -> waits on it');

check(/not understood/.test(await afterBlocker(byN(12))), 'K12: 0.7 item with owner-ok-S2 stays unstarted although the 0.5 row is there');
check((await afterBlocker(byN(13))) === '', 'K12: 0.7 item with owner-ok-0.7-sync (typed row) -> starts');
check(/not understood/.test(await afterBlocker(byN(14))), 'K12: 0.7 item with owner-ok-0.6-sync (an earlier minor) stays unstarted');
check(/waits on owner-ok-0.7-unmet/.test(await afterBlocker(byN(15))), 'K12: 0.7 item, versioned key with no row -> stays unstarted');
check((await afterBlocker(unkeyed('owner-ok-0.7.1-fix.', '0.7.1'))) === '', 'K12: 0.7.1 patch item with owner-ok-0.7.1-fix -> starts');
check(/not understood/.test(await afterBlocker(unkeyed('owner-ok-0.7-sync.', '0.7.1'))), "K12: 0.7.1 patch item with the minor's token stays unstarted");
check(/not understood/.test(await afterBlocker(unkeyed('owner-ok-met.', null))), 'K12: unversioned issue with an owner-ok key stays unstarted (fails closed)');
check((await afterBlocker(unkeyed('owner-ok-met.', '0.6.1'))) === '', '0.6.1 patch item keeps its old token -> starts');

// The start loop runs the check on every [next] line before it starts one.
const notes = yml.slice(yml.indexOf('const wait = await afterBlocker(kx);'), yml.indexOf('picked.push('));
check(/not understood[\s\S]*core\.warning[\s\S]*lines\.splice\(i \+ 1, 0, `  - held: After not understood/.test(notes),
  'start loop: a not-understood After line is warned and gets a "held" note under it in #114');
check(/if \(\/\^\\s\+- held: \/\.test\(lines\[i \+ 1\] \|\| ''\)\) lines\.splice\(i \+ 1, 1\)/.test(yml), 'start loop: the held note is dropped when the line starts');
const loop = yml.slice(yml.indexOf('for (let i = 0; i < lines.length && inflight < MAX; i++)'));
check(/const wait = await afterBlocker\(kx\);\s*\n\s*if \(wait\) \{[\s\S]*?continue;/.test(loop.slice(0, loop.indexOf('picked.push('))),
  'start loop: afterBlocker runs and skips before a [next] line is picked');
check(/if \(wait\) \{[\s\S]*?if \(alone\) break; continue;/.test(loop.slice(0, loop.indexOf('picked.push('))),
  'start loop: an "alone" line held by its After line stops the loop, so later lines keep queue order');

check(/not understood \(no 0\.6\.9 items found\)/.test(await afterBlocker(unkeyed('everything.', '0.6.9'))), 'patch release with no items of its version -> not understood, stays unstarted');

// Auto-queue appends after the last queue line; a held note under a line is part of the queue (#392 review).
const qe = yml.match(/\/\/ QUEUE-END START[^\n]*\n([\s\S]*?)\n\s*\/\/ QUEUE-END END/);
check(!!qe, 'kickoff.yml has the QUEUE-END block');
const queueEnd = new Function(qe[1] + '\nreturn queueEnd;')();
const q114 = ['## Queue', '<!-- One line per item -->', '- [next] #371 opus alone', '  - held: After not understood (kickoff 2026-10-18T23:00Z)', '- [next] #383 opus lanes:build', '', 'Notes'];
check(queueEnd(q114) === 4, 'auto-queue: new lines go after the last queue line, past a held note');
check(queueEnd(q114.filter((l) => !l.includes('held'))) === 3, 'auto-queue: no held note -> after the last queue line');
check(queueEnd(['no queue']) === -1, 'auto-queue: no queue comment line -> skipped');
check(/\/\^\\s\+- held: \/\.test\(lines\[i\]\) && !\/\^- \\\[next\\\] \/\.test\(lines\[i - 1\]/.test(yml), 'a held note not under a [next] line is dropped');
check(/left in #114 for the planner`\);\s*\n\s*if \(\/\^\\s\+- held: \/\.test\(lines\[i \+ 1\] \|\| ''\)\) \{ lines\.splice\(i \+ 1, 1\)/.test(yml), 'a held line whose After now reads (but waits) loses its note');

console.log(`\n${n - fail}/${n} kickoff checks passed`);
console.log(fail ? 'KICKOFF CHECKS FAILED' : 'KICKOFF CHECKS PASSED');
process.exit(fail ? 1 : 0);
