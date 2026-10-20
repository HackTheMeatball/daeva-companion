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
  '| — | 0.8 icon box (`owner-ok-0.8-icon-box`) | Owner, typed 2026-10-19: "Yes" |',
].join('\n');
const github = { rest: { repos: { getContent: async ({ path }) => {
  if (path === 'docs/DECISIONS.md') return { data: { content: Buffer.from(DECISIONS).toString('base64') } };
  if (path === 'docs/research') return { data: [{ name: 'ranger-icons.md' }, { name: 'templar-skills.md' }] };
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
  item(31, '0.8', 'P1', false, 'none.'),
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
check((await afterBlocker({ ...unkeyed(null, '0.7'), body: '- **After:** none.\n' })) === '', 'bold "- **After:** none." (0.8 spec style) -> starts');
check((await afterBlocker({ ...unkeyed(null, '0.7'), body: '- **After:** `owner-ok-0.7-sync`.\n' })) === '', 'bold After with a backticked typed owner-ok key -> starts');
check(/waits on owner-ok-0.7-unmet/.test(await afterBlocker({ ...unkeyed(null, '0.7'), body: '- **After:** `owner-ok-0.7-unmet`.\n' })), 'bold After with a backticked unmet key -> stays unstarted');
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

// The build cap: 8 until 06:40 UTC Oct 20 (owner, 2026-10-19), then 5 again with no further change.
const capm = yml.match(/MAX = (Date\.now\(\) < Date\.parse\('[^']+'\) \? \d+ : \d+);/);
check(!!capm, 'kickoff: MAX is a dated cap');
if (capm) {
  const capAt = (iso) => new Function('Date', `return ${capm[1]};`)({ now: () => Date.parse(iso), parse: Date.parse });
  check(capAt('2026-10-20T06:39:00Z') === 8, 'cap is 8 before 06:40 UTC Oct 20');
  check(capAt('2026-10-20T06:40:00Z') === 5, 'cap is back to 5 at 06:40 UTC Oct 20');
}

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

// PIP-06: a sonnet line whose issue's Files section names an Opus path starts on Opus (Kaizen (Gale), 2026-10-19).
const of = yml.match(/\/\/ OPUS-FILES START[^\n]*\n([\s\S]*?)\n\s*\/\/ OPUS-FILES END/);
check(!!of, 'kickoff.yml has the OPUS-FILES block');
const opusPath = new Function(of[1] + '\nreturn opusPath;')();
const spec = (files, after = '## Lanes, model, order\n\nsonnet') => `## Problem\n\nTouches src/core/ in prose only.\n\n## Files (owns)\n\n${files}\n\n${after}\n`;
check(opusPath(spec('`src/core/state.js`, `docs/ISSUES.md`')) === 'src/core/', 'Files names src/core/ -> Opus');
check(opusPath(spec('`tests/golden/snapshots/**`')) === 'tests/golden', 'Files names golden snapshots -> Opus');
check(opusPath(spec('`data/packs/x/guide/steps.json` (no gate `requires`)')) === 'requires', 'Files mentions a gate requires -> Opus');
check(opusPath(spec('`.github/workflows/ci.yml`')) === '.github/', 'Files names a workflow -> Opus');
check(opusPath(spec('`src/packs/aion2/cards/nextup-kinds.js`, `src/styles/app.css`')) === null, 'Files with no Opus path -> stays Sonnet');
check(opusPath(spec('`docs/ISSUES.md`')) === null, 'src/core/ named only outside the Files section -> stays Sonnet');
check(opusPath(spec('`src/core/x.js`', '')) === 'src/core/', 'Files as the last section still read');
check(opusPath('No files section; src/core/ in prose.') === null, 'no Files section -> stays Sonnet');
check(/const hit = m\[2\] !== 'opus' && opusPath\(iss\.body\);[\s\S]{0,300}model: m\[2\] === 'opus' \|\| hit \? 'claude-opus-5-5'/.test(yml), 'start loop: an Opus-path hit starts the build on Opus');

// The spec template's Example (docs/plans/SPEC-TEMPLATE.md) is the format kickoff parses: run its After line as written,
// then the other forms specs use (Kaizen (Gale), after #517). A line it can't read says so without markdown marks.
const tmpl = readFileSync(join(ROOT, 'docs', 'plans', 'SPEC-TEMPLATE.md'), 'utf8');
const ex = (tmpl.split(/^## Example\s*$/m)[1] || '').match(/```markdown\n([\s\S]*?)\n```/);
check(!!ex && /\*\*After:\*\*/.test(ex[1]), 'SPEC-TEMPLATE.md has an Example block with a bold After line');
const exItem = (body) => ({ n: 32, ver: '0.8', rel: '0.8', key: 'P2', open: true, body });
const exAfter = (line) => exItem(ex ? ex[1].replace(/^- \*\*After:\*\*.*$/m, `- **After:** ${line}`) : '');
check((await afterBlocker(exItem(ex ? ex[1] : ''))) === '', 'template Example as written (P1, research-templar, owner-ok-0.8-icon-box) -> starts when all are met');
check((await afterBlocker(exAfter('none.'))) === '', 'template form, After: none -> starts');
check((await afterBlocker(exAfter('P1.'))) === '', 'template form, one key -> starts');
check((await afterBlocker(exAfter('`P1`, `research-templar`, `owner-ok-0.8-icon-box`.'))) === '', 'template form, backticked keys -> starts');
check((await afterBlocker(exAfter('**P1**, research-templar.'))) === '', 'template form, a bold key -> starts');
check(/waits on owner-ok-0.8-unmet/.test(await afterBlocker(exAfter('P1, `owner-ok-0.8-unmet`.'))), 'template form, unmet owner-ok key -> stays unstarted');
const unread = await afterBlocker(exAfter('**P1** then later `maybe`.'));
check(/not understood/.test(unread) && !/[*`]/.test(unread), `template form, unreadable After -> "not understood" with no * or backtick (${unread})`);
// "everything" / "all" match whole words only (Walter, #517 review): a slug holding "all" is a key.
check(/waits on research-all-icons/.test(await afterBlocker(exAfter('P1, research-all-icons.'))), 'research-all-icons is a research key, not "everything"');
check(/waits on owner-ok-0.8-all-classes/.test(await afterBlocker(exAfter('owner-ok-0.8-all-classes.'))), 'owner-ok-0.8-all-classes is an owner-ok key, not "everything"');
check(/waits on open|^$/.test(await afterBlocker({ ...exItem(''), body: 'After: all other items.\n' })), '"After: all other items" still means everything');
// Release titles get key R, in both forms (0.8's "0.8 R: Release 0.8.0" was unkeyed; #517 review).
const tm = yml.match(/m: (i\.title\.match\([\s\S]+?\.slice\(0, 3\)) \}/);
check(!!tm, 'kickoff.yml keys item titles in one expression');
const keyOf = (title) => { const r = tm ? new Function('i', `return ${tm[1]};`)({ title }) : []; return r.length === 3 ? `${r[1]} ${r[2]}` : null; };
check(keyOf('Release 0.8.0 (four classes)') === '0.8 R', '"Release 0.8.0 (four classes)" -> 0.8 R');
check(keyOf('0.8 R: Release 0.8.0') === '0.8 R', '"0.8 R: Release 0.8.0" -> 0.8 R');
check(keyOf('0.8 P2: Templar class data (hidden)') === '0.8 P2', '"0.8 P2: ..." -> 0.8 P2');
check(keyOf('Release 0.8.1 (patch)') === null, 'a patch release title has no minor key');
check(/quoting the summary line your last `npm test` printed, never a placeholder/.test(yml), 'builder prompt: the PR body quotes the real npm test line');
check(/grep -q 'TESTRESULT' tests\/out\/pr-body\.md; then\s*\n\s*sed -i 's\/TESTRESULT\/not finished by the build/.test(yml), 'fallback PR: a TESTRESULT placeholder in the body is replaced, never shipped as a result');
check(/BASH_MAX_TIMEOUT_MS: '1800000'/.test(yml) && /`npm test` included \(Bash allows 30 minutes here\)/.test(yml), 'builds run npm test in the foreground with a 30-min Bash limit (4 of 5 0.8 builds opened no PR)');

console.log(`\n${n - fail}/${n} kickoff checks passed`);
console.log(fail ? 'KICKOFF CHECKS FAILED' : 'KICKOFF CHECKS PASSED');
process.exit(fail ? 1 : 0);
