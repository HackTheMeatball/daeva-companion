#!/usr/bin/env node
/* Kickoff's After check (.github/workflows/kickoff.yml, the block between "AFTER-CHECK START" and "AFTER-CHECK END") run in
   Node against fixtures, no network: an item with an unmet owner-ok key, an unknown key or an open dependency must stay
   unstarted; a met one must start (2026-10-18: explicit [next] lines skipped the check, Kaizen (Gale), #222). < 1 s. */
import { existsSync, readFileSync } from 'node:fs';
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

// The build cap is 3 under the owner's usage budget (2026-10-20); it was 5 (Max 20x plan) and 8 for the 0.8 overnight run.
check(/const STATE = 114, MAX = 3;/.test(yml), 'kickoff: the build cap is a plain 3');
check(/const openPrs = refs\.filter\(\(r\) => r\.startsWith\('claude\/issue-'\)\)\.length;/.test(yml) && /let inflight = openPrs \+ started;/.test(yml), 'kickoff: only build PRs (claude/issue-*) and started lines count against MAX; other claude/ PRs only hold lanes');

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
// The Opus paths come from the one shared list (Kaizen (Gale), 2026-10-20); the block reads it as ROUTE.
const ROUTE = JSON.parse(readFileSync(join(ROOT, '.github', 'routing', 'opus-paths.json'), 'utf8'));
const opusPath = new Function('ROUTE', of[1] + '\nreturn opusPath;')(ROUTE);
const spec = (files, after = '## Lanes, model, order\n\nsonnet') => `## Problem\n\nTouches src/core/ in prose only.\n\n## Files (owns)\n\n${files}\n\n${after}\n`;
check(opusPath(spec('`src/core/state.js`, `docs/ISSUES.md`')) === 'src/core/', 'Files names src/core/ -> Opus');
check(opusPath(spec('`tests/golden/snapshots/**`')) === 'tests/golden', 'Files names golden snapshots -> Opus');
check(opusPath(spec('`data/packs/x/guide/steps.json` (no gate `requires`)')) === 'requires', 'Files mentions a gate requires -> Opus');
check(opusPath(spec('`.github/workflows/ci.yml`')) === '.github/', 'Files names a workflow -> Opus');
check(opusPath(spec('`src/packs/aion2/cards/nextup-kinds.js`, `src/styles/app.css`')) === null, 'Files with no Opus path -> stays Sonnet');
check(opusPath(spec('`docs/ISSUES.md`')) === null, 'src/core/ named only outside the Files section -> stays Sonnet');
check(opusPath(spec('`src/core/x.js`', '')) === 'src/core/', 'Files as the last section still read');
// Intended change (Kaizen (Gale), 2026-10-20): no readable Files list now starts on Opus; it used to stay Sonnet.
check(opusPath('No files section; src/core/ in prose.') === 'no readable Files list', 'no Files section -> Opus (nobody checked its paths)');
check(opusPath(spec('the welcome card and its tests')) === 'no readable Files list', 'a Files section with no path in it -> Opus');
// Template-format specs write "- **Files.**" as a bullet; PIP-06 only read "## Files", so #509 (tools/gen/gen.mjs) started on Sonnet.
const GEN = JSON.parse(readFileSync(join(ROOT, '.github', 'routing', 'gen-lane.json'), 'utf8'));
const fx = new Function('ROUTE', 'GEN', of[1] + '\nreturn { specField, opusWork, inputPaths, lookupPath, genLaneMiss };')(ROUTE, GEN);
const bullet = (files, extra = '') => `# 0.8 P20: x\n\n- **Problem.** Touches src/core/ in prose only.\n- **Files.** ${files}\n  more files on a wrapped line.\n- **Lanes:** nextup.css. **Model:** Sonnet.\n${extra}- **After:** none.\n\n## Lanes, model, order\n`;
check(opusPath(bullet('`tools/gen/gen.mjs`, `src/packs/aion2/cards/rows.js`')) === 'tools/gen/', 'Files as a template bullet names tools/gen -> Opus (#509)');
check(opusPath(bullet('`src/styles/cards/nextup.css`')) === null, 'Files bullet with no Opus path -> stays Sonnet (src/core/ only in Problem)');
check(/wrapped line/.test(fx.specField(bullet('`a/b.js`'), 'Files')) && !/Lanes/.test(fx.specField(bullet('`a/b.js`'), 'Files')), 'a bullet field runs to the next bullet, wrapped lines included');
// Kaizen (Gale), 2026-10-20: gen or golden work starts on Opus whatever its tier.
check(fx.opusWork(new Set(['gen', 'nextup.css']), '') === 'lane gen', 'gen lane -> Opus');
check(fx.opusWork(new Set(['golden-nextup']), '') === 'lane golden-nextup', 'a golden card lane -> Opus');
check(fx.opusWork(new Set(['nextup.css']), 'Then run `npm run gen` and commit.') === 'npm run gen', 'spec runs npm run gen -> Opus');
check(!!fx.opusWork(new Set(['rows']), '- [ ] Re-record golden for the rows card.'), 'spec re-records golden -> Opus');
check(fx.opusWork(new Set(['nextup.css', 'a11y']), 'Golden diff stays empty.') === null, 'no gen or golden work -> stays Sonnet');
check(/opusWork\(want, iss\.body\)/.test(yml) && /started on Opus \(Kaizen, 2026-10-20\)/.test(yml), 'pick loop routes gen/golden work to Opus');
// Kaizen (Gale), 2026-10-20: inputs must be repo paths on main (#502 named /mnt/project-files files builds can't read).
const mntSpec = bullet('`src/x.js`', '- **Inputs.** `docs/plans/0.8/inputs/a.png`, `src/assets/icons/*`.\n- **Result.** Per /mnt/project-files/tracker/mockups/v2/README.md and `/mnt/project-files/x.png`.\n');
const ip = fx.inputPaths(mntSpec);
check(ip.mnt.length === 2 && ip.mnt.includes('/mnt/project-files/tracker/mockups/v2/README.md') && ip.mnt.includes('/mnt/project-files/x.png'), 'a /mnt/ path anywhere in the spec is caught (prose and backticks)');
check(ip.repo.join() === 'docs/plans/0.8/inputs/a.png,src/assets/icons/*', 'the Inputs line\'s repo paths are looked up; Files paths (new files) are not');
check(fx.inputPaths(bullet('`src/x.js`', '- **Input.** The labels in `data/packs/**` themselves.\n')).repo.join() === 'data/packs/**', 'singular "Input." line read too (#509)');
check(fx.lookupPath('src/assets/icons/*') === 'src/assets/icons' && fx.lookupPath('data/packs/**') === 'data/packs' && fx.lookupPath('docs/a.md') === 'docs/a.md', 'a glob is looked up by its directory');
check(fx.inputPaths(bullet('`src/x.js`')).mnt.length === 0 && fx.inputPaths(bullet('`src/x.js`')).repo.length === 0, 'no Inputs line and no /mnt/ -> nothing to check');
// Intended change (Kaizen (Gale), 2026-10-20): an Inputs entry with no repo path holds the item too, so the condition and the
// comment lines now include it.
check(/missing\.length \|\| bare\.length \|\| lookupFailed/.test(yml) && /spec: input not in repo: \$\{x\}/.test(yml) && /Inputs: \$\{x\} has no repo path/.test(yml) && /held: input not in repo/.test(yml), 'pick loop holds an item with a missing input or an entry with no repo path and tells the planner once per entry on the issue');
check(yml.indexOf('const ins = inputPaths(iss.body)') > yml.indexOf('const wait = await afterBlocker(kx)') && yml.indexOf('const ins = inputPaths(iss.body)') < yml.indexOf('const why = await alreadyBuilt(n)'), 'the input check runs after the After check and before a build starts');
// Kaizen (Gale), 2026-10-20: a spec that changes what gen compiles must list the gen lane (spec-incomplete-files: #501, #504, #503).
// #503's own Result and Files (re-spec 2, lanes build-card,a11y,rows); its PR #565 touched tools/gen.
const spec503 = `- **Result.**\n  - The Build pop-out's grid columns and macro steps match the research file.\n  - Game facts move from \`src/\` to \`data/\`.\n- **No-gos.**\n  - No player-chosen keys (#388, 0.9).\n- **Files.** \`src/packs/aion2/cards/build.html\`, \`src/packs/aion2/cards/rows.js\`, the Assassin \`builds.json\` and its copy in\n  \`data/schema/examples/packs/aion2/asmodian/assassin/builds.json\` (line 277), \`claims.json\`, and the a11y and golden tests.\n- **Lanes:** build-card, a11y, rows. **Model:** Opus, M (80 min).\n`;
check(fx.genLaneMiss(new Set(['build-card', 'a11y', 'rows']), spec503) === 'its Result names data/', "#503's spec without the gen lane -> held (its Result names data/)");
check(fx.genLaneMiss(new Set(['build-card', 'a11y', 'rows', 'gen']), spec503) === null, "#503's spec with the gen lane -> passes");
check(fx.genLaneMiss(new Set(['build-card']), spec503.replace('  - Game facts move from `src/` to `data/`.\n', '')) === 'its Files names data/schema/', 'a Files list naming data/schema/ without the gen lane -> held');
const clean = bullet('`src/styles/cards/nextup.css`, `src/packs/aion2/cards/nextup.html`', '- **Result.** The Next up card shows the zone name under the quest; `src/data/zones.js` is unchanged.\n');
check(fx.genLaneMiss(new Set(['nextup.css']), clean) === null, 'a clean spec (no data/ change, src/data/ only in prose) -> passes');
check(fx.genLaneMiss(new Set(['rows']), bullet('`data/packs/aion2/x.json`', '- **Result.** Each row shows a new pack field `zoneHint`.\n')) === 'it adds a new pack field', 'a new pack field without the gen lane -> held');
check(fx.genLaneMiss(new Set(['rows']), bullet('`data/packs/aion2/asmodian/assassin/guide/steps.json`', '- **Result.** Step 12 reads "Talk to Hagen".\n')) === null, 'a plain data JSON edit (Files names data/packs only) -> passes');
check(GEN.keywords.every((k) => { try { new RegExp(k.re, 'im'); return k.in.length && k.in.every((f) => ['Result', 'Files'].includes(f)) && !!k.says; } catch { return false; } }), 'gen-lane.json: every keyword is a valid regex with Result/Files fields and a says text');
check(/const GEN = JSON\.parse\(Buffer\.from\(\(await github\.rest\.repos\.getContent\(\{ owner, repo, path: '\.github\/routing\/gen-lane\.json', ref: 'main' \}\)\)/.test(yml), 'kickoff reads gen-lane.json from main');
check(/const genMiss = genLaneMiss\(want, iss\.body\);/.test(yml) && /held: spec: gen lane missing/.test(yml) && /spec: gen lane missing: \$\{genMiss\}/.test(yml), 'pick loop holds an item missing the gen lane and tells the planner once on the issue');
check(yml.indexOf('const genMiss = genLaneMiss(') > yml.indexOf('const ins = inputPaths(iss.body)') && yml.indexOf('const genMiss = genLaneMiss(') < yml.indexOf('const why = await alreadyBuilt(n)'), 'the gen-lane check runs after the input check and before a build starts');
check(/const fileHit = m\[2\] !== 'opus' && opusPath\(iss\.body\), workHit = m\[2\] !== 'opus' && !fileHit && opusWork\(want, iss\.body\);\s*\n\s*const hit = fileHit \|\| workHit;[\s\S]{0,500}model: m\[2\] === 'opus' \|\| hit \? 'claude-opus-5-5'/.test(yml), 'start loop: an Opus-path or gen/golden hit starts the build on Opus');

// The spec template's Example (docs/plans/SPEC-TEMPLATE.md) is the format kickoff parses: run its After line as written,
// then the other forms specs use (Kaizen (Gale), after #517). A line it can't read says so without markdown marks.
const tmpl = readFileSync(join(ROOT, 'docs', 'plans', 'SPEC-TEMPLATE.md'), 'utf8');
const ex = (tmpl.split(/^## Example\s*$/m)[1] || '').match(/```markdown\n([\s\S]*?)\n```/);
check(!!ex && /\*\*After:\*\*/.test(ex[1]), 'SPEC-TEMPLATE.md has an Example block with a bold After line');
const exItem = (body) => ({ n: 32, ver: '0.8', rel: '0.8', key: 'P2', open: true, body });
const exAfter = (line) => exItem(ex ? ex[1].replace(/^- \*\*After:\*\*.*$/m, `- **After:** ${line}`) : '');
check((await afterBlocker(exItem(ex ? ex[1] : ''))) === '', 'template Example as written (P1, research-templar, owner-ok-0.8-icon-box) -> starts when all are met');
check(fx.inputPaths(ex ? ex[1] : '').repo.length === 2 && !fx.inputPaths(ex ? ex[1] : '').mnt.length, 'template Example: its Inputs line gives two repo paths to look up, no /mnt/');
// Every field kickoff reads, run through the template's Example (Kaizen (Gale), 2026-10-20: After, then Files, then Inputs
// drifted from the parser). Lanes and model: the queue line built from the Example's Lanes/Model bullet must be one kickoff starts.
const exs = ex ? ex[1] : '';
check(/data\/packs\/aion2\/classes\/templar/.test(fx.specField(exs, 'Files')) && opusPath(exs) === null, 'template Example: its Files bullet is read (paths seen, none an Opus path)');
const exLanes = ((exs.match(/\*\*Lanes:\*\*\s*([^*\n]*?)\.?\s*\*\*Model/) || [])[1] || '').split(/,\s*/).filter(Boolean);
const exModel = ((exs.match(/\*\*Model:\*\*\s*(Opus|Sonnet)\b/) || [])[1] || '').toLowerCase();
const exLine = `- [next] #12 ${exModel} lanes:${exLanes.join(',')}`;
const QLINE = new RegExp(yml.match(/const m = lines\[i\]\.match\(\/(\^- \\\[next\\\][^\n]*?\$)\/\);/)[1]);
const lof = new Function(yml.match(/(const lanesOfLine = [^\n]*)/)[1] + '\nreturn lanesOfLine;')();
check(exLanes.length > 0 && !!exModel && QLINE.test(exLine) && [...lof(exLine)].join() === exLanes.join(), `template Example: its Lanes and Model make a queue line kickoff reads (${exLine})`);
check(fx.opusWork(lof(exLine), exs) === 'lane gen', 'template Example (Lanes: gen) -> Opus');
// The Release Planner's form: an "Inputs:" line in "## Lanes, model, order".
const lmo = (line) => `- **Problem.** x\n\n## Lanes, model, order\n\nLanes: gen. Model: Opus.\n${line}\n`;
check(fx.inputPaths(lmo('Inputs: docs/plans/0.8/inputs/design-v4/, data/research/x.csv')).repo.join() === 'docs/plans/0.8/inputs/design-v4/,data/research/x.csv', '"Inputs: a, b" line read, a directory path kept');
check(fx.inputPaths(lmo('Inputs: none')).repo.length === 0 && fx.inputPaths(lmo('Inputs: none')).mnt.length === 0, '"Inputs: none" names nothing');
// Kaizen (Gale), 2026-10-20 (#221 1:20 PM ET): every Inputs entry names a repo path, says none, or names an After key.
// #502's P13 named Metabot's marker as an input with no repo path; the build had nothing to read and stopped.
const p13 = (marker) => lmo(`Inputs: \`docs/plans/0.8/inputs/design-v2/\`, \`docs/plans/0.8/inputs/design-v4/\`, \`docs/research/owner-crops-2026-10-18/\`, ${marker}`);
check(fx.inputPaths(p13("Metabot's `quest_district` map marker")).bare.join() === "Metabot's `quest_district` map marker", "P13's Inputs naming Metabot's marker without a repo path -> held (no repo path)");
check(fx.inputPaths(p13('`docs/research/map-icons-2026-10-20/quest-district.png`')).bare.length === 0 && fx.inputPaths(p13('`docs/research/map-icons-2026-10-20/quest-district.png`')).repo.includes('docs/research/map-icons-2026-10-20/quest-district.png'), 'the same Inputs with docs/research/map-icons-2026-10-20/quest-district.png -> passes, and the path is looked up on main');
check(fx.inputPaths(bullet('`src/x.js`', '- **Inputs.** The marker from the research item `research-387-macro`.\n- **After:** `research-387-macro`.\n')).bare.length === 0, 'an Inputs entry naming an After key (a research item that runs first) -> passes');
check(fx.inputPaths(bullet('`src/x.js`', '- **Inputs.** `docs/research/a.md` (after #562, #563 merge).\n')).bare.length === 0, 'a comma inside parentheses does not split an entry');
check(fx.inputPaths(lmo('Inputs: none')).bare.length === 0 && fx.inputPaths(bullet('`src/x.js`')).bare.length === 0, '"Inputs: none" or no Inputs at all -> nothing bare');
check(fx.inputPaths(lmo('Inputs: the owner screenshot from yesterday, `docs/a.md`')).bare.join() === 'the owner screenshot from yesterday' && fx.inputPaths(lmo('Inputs: the owner screenshot from yesterday, `docs/a.md`')).repo.join() === 'docs/a.md', 'an Inputs line entry with no path among real paths -> held, the paths still looked up');
check(fx.inputPaths(bullet('`src/x.js`', "- **Input.** The labels in `data/packs/**` themselves (every record `fieldStatus`); Game Data Check's 2026-10-19 count was 448, most never render.\n")).bare.length === 0, "an Inputs bullet is prose: one path in it is enough (#509's bullet)");
check(fx.inputPaths(bullet('`src/x.js`', "- **Inputs.** Metabot's `quest_district` map marker.\n")).bare.length === 1, 'an Inputs bullet with no path at all -> held');
check(fx.inputPaths(exs).bare.length === 0, 'the spec template Example has no bare Inputs entry');
check(fx.inputPaths(lmo('Inputs: ~/Desktop/crop.png, docs/a.md')).mnt.join() === '~/Desktop/crop.png' && fx.inputPaths(lmo('Inputs: ~/Desktop/crop.png, docs/a.md')).repo.join() === 'docs/a.md', 'an input outside the repo (~/) holds the item like /mnt/');
const exIns = fx.inputPaths(exs).repo;
check(exIns.length === 2 && exIns.every((x) => existsSync(join(ROOT, ...x.split('/')))), 'template Example: both its Inputs paths exist on this branch (keep the example honest)');
// #535 review nits: the bullet's prose isn't split into paths, a plain "Inputs:" line is; a No-gos bullet naming /mnt/ is no input.
check(fx.inputPaths(bullet('`src/x.js`', '- **Inputs.** The notes in data/research/x.csv, see `docs/a.md`.\n')).repo.join() === 'docs/a.md', 'Inputs bullet: only backticked paths count, not bare words in its prose');
check(fx.inputPaths(lmo('Inputs: data/research/x.csv docs/a.md')).repo.join() === 'data/research/x.csv,docs/a.md', '"Inputs:" line: plain paths split on spaces too');
check(fx.inputPaths(bullet('`src/x.js`', '- **No-gos.** Never read /mnt/project-files/ from a build.\n')).mnt.length === 0, 'a No-gos bullet naming /mnt/ does not hold the item');
check(fx.inputPaths(bullet('`src/x.js`', '- **No-gos.** Nothing else.\n- **Result.** Per /mnt/project-files/x.png.\n')).mnt.join() === '/mnt/project-files/x.png', 'a /mnt/ path outside No-gos still holds the item');
// A held note under a lane-blocked line is re-read (#503 kept a stale "not understood" note), and a note whose reason changed is replaced.
check(/if \(overlap\(want, busy\)\) \{[\s\S]{0,600}held: After not understood\/\.test\(lines\[i \+ 1\][\s\S]{0,300}afterBlocker\(kxOf\([\s\S]{0,120}lines\.splice\(i \+ 1, 1\)[\s\S]{0,80}continue;/.test(yml), 'start loop: a lane-blocked line re-reads its After line and drops a stale not-understood note');
check(/else if \(!\/held: input not in repo\/\.test\(lines\[i \+ 1\]\)\) \{ lines\[i \+ 1\] = note;/.test(yml) && /else if \(!\/held: After not understood\/\.test\(lines\[i \+ 1\]\)\) \{ lines\[i \+ 1\] = `  - held: After not understood/.test(yml), 'start loop: a held note with an outdated reason is replaced, not kept');
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
check((await afterBlocker({ ...exItem(''), body: 'After: all other items.\n' })) === '', '"After: all other items" still means everything (0.8 P1 is closed)');
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

// One list for routing and the Sonnet prompts (Kaizen (Gale), 2026-10-20, after #501 and #509).
check(ROUTE.paths.every((x) => ROUTE.sonnetMayNotTouch.includes(x.says)), 'opus-paths.json: every path\'s text is in the Sonnet stop list');
check(!/["]/.test(ROUTE.sonnetMayNotTouch), 'opus-paths.json: the stop list has no double quote (it is inlined in claude.yml\'s quoted prompt)');
const wf = (f) => readFileSync(join(ROOT, '.github', 'workflows', f), 'utf8');
check(/needs\.pick\.outputs\.touches/.test(yml) && /core\.setOutput\('touches', ROUTE\.sonnetMayNotTouch\)/.test(yml), 'kickoff: the build prompt\'s Sonnet limits come from the shared list');
check(/\$\{ROUTE\.sonnetMayNotTouch\}/.test(wf('pipeline.yml')) && /new RegExp\(ROUTE\.paths/.test(wf('pipeline.yml')), 'pipeline: fix-round Sonnet limits and risky paths come from the shared list');
check(/steps\.route\.outputs\.touches/.test(wf('claude.yml')) && /jq -r \.sonnetMayNotTouch \.github\/routing\/opus-paths\.json/.test(wf('claude.yml')), 'claude.yml: the @sonnet guard reads the shared list');
check(!['claude.yml', 'kickoff.yml', 'pipeline.yml'].some((f) => /save\/sync\/migration\/storage code|the requires or completesWith fields of anything under data/.test(wf(f))), 'no workflow keeps its own copy of the Sonnet stop list');
check(opusPath(bullet('`scripts/build.mjs`, `scripts/serve.mjs`')) === 'scripts/', 'Files naming build tooling under scripts/ -> Opus');
check(opusPath(bullet('`src/assets/icons/*.webp`, `docs/ISSUES.md`')) === null, 'asset files alone stay Sonnet (Gale: the risk was the build change)');
// #509's spec named tools/gen/gen.mjs: caught since #535. #501's named only welcome files, tests and icons, so no path rule
// catches it: it needed src/core and scripts/ changes its spec never listed (a Files-completeness miss, sent to the planner).
check(opusPath(bullet('`tools/gen/gen.mjs`, `data/packs/aion2/cards/rows.json`')) === 'tools/gen/', "#509's Files list -> Opus");
check(opusPath(bullet('`src/cards/welcome.html`, `src/cards/welcome.js`, `src/styles` welcome rules, `src/assets/icons/*` (the emblems), `docs/ISSUES.md`, `tests/site.js`, and `tests/a11y.js`')) === null, "#501's Files list (as written) stays Sonnet: routing can't see paths a spec leaves out");

// Spec inputs from the plan (Kaizen (Gale), PROCESS REVIEW OK 2026-10-21): #644's plan gained an input and an After key in
// #687 while its issue kept the old spec, so its 04:28Z build started without them. Replay: the pre-fix body is
// reconstructed from §P22 as it stood before #687 (0a1f484^; the issue was written from it), checked against §P22 today.
const pi = yml.match(/\/\/ PLAN-INPUTS START[^\n]*\n([\s\S]*?)\n\s*\/\/ PLAN-INPUTS END/);
check(!!pi, 'kickoff.yml has the PLAN-INPUTS block');
const px = new Function('ROUTE', 'GEN', of[1] + '\n' + pi[1] + '\nreturn { planRef, planSection, roadmapRows, planGaps };')(ROUTE, GEN);
const fxt = (f) => readFileSync(join(ROOT, 'tests', 'fixtures', 'kickoff', f), 'utf8');
const p22 = fxt('p22-plan.md'), pre644 = fxt('644-pre-fix.md'), now644 = fxt('644-re-spec.md');
const ref644 = px.planRef(pre644);
check(ref644 && ref644.file === 'docs/plans/0.9/README.md' && ref644.sec === 'P22', '"Plan: `docs/plans/0.9/README.md` §P22" is read as file and section');
const g644 = px.planGaps(pre644, px.planSection(p22, 'P22'), '');
check(g644.paths.includes('docs/design/0.9-keys-macro.md') && g644.keys.includes('research-skill-bar'), `#644 pre-fix spec -> refused, naming docs/design/0.9-keys-macro.md and research-skill-bar (${[...g644.paths, ...g644.keys].join(', ')})`);
check(g644.keys.includes('owner-ok-0.9-key-grid') && g644.paths.includes('tools/gen/*') && !g644.paths.includes('docs/design/0.9-keys'), '#644 pre-fix: the new After gate and Files paths are named too; the input it had is not');
const gNow = px.planGaps(now644, px.planSection(p22, 'P22'), '');
check(!gNow.paths.length && !gNow.keys.length, `#644 as re-specced -> passes (${[...gNow.paths, ...gNow.keys].join(', ')})`);
const nn = pre644.replace('- **No-gos.**', '- **Inputs, not needed.** `docs/design/0.9-keys-macro.md` — not needed: the macro call landed in the mock.\n- **No-gos.**');
const gNn = px.planGaps(nn, px.planSection(p22, 'P22'), '');
check(!gNn.paths.includes('docs/design/0.9-keys-macro.md') && gNn.notNeeded.length === 1 && /landed in the mock/.test(gNn.notNeeded[0].why), '"`<path>` — not needed: <reason>" counts as listed, and its reason is kept for the log');
check(px.planSection(p22, 'P2') === null && /^## P22:/.test(px.planSection(p22, 'P22')), 'a section is matched by its exact key (§P2 is not §P22)');
check(/^## P25:/.test(px.planSection('## P25–P27: group\n\nx\n\n## P25: one\n\n`a/b.md`\n\n## P26: two\n', 'P25')), 'a group heading "P25–P27" is not §P25');
check(px.planSection('whole `a/b.md` file', '') === 'whole `a/b.md` file', 'a plan link with no § is the whole file (0.6 per-item files)');
const rows = '| Item | x |\n| [P22](docs/plans/0.6/P22-ranger-class-data.md) | No pack | L | `data/packs/aion2/classes/ranger/**`, `sources.json` | Opus |\n| [P5](docs/plans/0.6/P5.md) | `src/x.js` |';
const r06 = px.roadmapRows(rows, { file: 'docs/plans/0.6/P22-ranger-class-data.md', sec: '' });
check(/ranger\/\*\*/.test(r06) && !/P5/.test(r06), 'the ROADMAP row linking the plan file is plan text; other rows are not');
check(px.planGaps('Plan: `docs/plans/0.6/P22-ranger-class-data.md`\n- **Files.** `src/a.js`.\n', '', r06).paths.join() === 'data/packs/aion2/classes/ranger/**', 'a path in the ROADMAP row and not in the spec -> named');
check(px.planGaps('- **Files.** `src/a.js`.\n', 'See [the mock](docs/design/x.md) and `data/packs/<guide>/save-keys.json`, and https://example.com/a/b.', '').paths.join() === 'docs/design/x.md', 'a repo-relative link counts; a <placeholder> path and a web link do not');
check(px.planRef('No plan named here.') === null, 'a spec with no Plan: reference is not checked');
// Order: after the input check (whose lookup is where a listed input that doesn't exist on main holds the item, change 3)
// and before a build starts.
check(yml.indexOf('const pref = planRef(iss.body)') > yml.indexOf('const ins = inputPaths(iss.body)') && yml.indexOf('const pref = planRef(iss.body)') < yml.indexOf('const why = await alreadyBuilt(n)'), 'the plan check runs after the input check and before a build starts');
check(/missing\.push\(pth\)/.test(yml) && /spec: input not in repo: \$\{x\}/.test(yml), 'a listed input missing on main is still refused by name');
check(/spec: plan input missing: \$\{x\}/.test(yml) && /spec: plan After key missing: \$\{x\}/.test(yml) && /held: spec misses plan inputs \(kickoff \$\{stamp\}\)/.test(yml) && /Watchdog: log this refusal/.test(yml), 'a refusal names each gap on the issue, holds the line in #114 and asks Watchdog to log it');
check(/spec: not needed: \$\{x\.path\} \(\$\{x\.why\}\)/.test(yml), 'a "not needed" path is posted with its reason for Watchdog to log');
check(/PR OPENED: \$\{pr%% \*\} for #\$ISSUE, by its build/.test(yml) && /PR OPENED: #\$\{url##\*\/\} for #\$ISSUE, by kickoff's fallback/.test(yml), 'kickoff announces each PR its build or fallback opens on #114');

// A build's end marker is read twice: by the slot check in JS and by the shell jq test that frees a run. They stay out of
// tools/verdicts.cjs (jq can't require it), so pin them to the same markers here (Kaizen (Gale), 2026-10-20, #561).
const jsEnd = [...yml.matchAll(/\/\^\((Blocked:\|Needs @claude)\)\//g)].map((x) => x[1]);
const jqEnd = [...yml.matchAll(/test\("\^\(([^)]*)\)"\)/g)].map((x) => x[1]);
check(jsEnd.length >= 1 && jqEnd.length >= 1 && [...jsEnd, ...jqEnd].every((a) => a === 'Blocked:|Needs @claude'), "kickoff's JS and jq build-end markers name the same lines (Blocked:, Needs @claude)");
const ended = yml.match(/const ended = [^\n]*\/\^\(([^)]*)\)\//);
check(!!ended && ended[1].startsWith('Blocked:|Needs @claude|'), 'the stalled-build check reads the same markers plus its own');

console.log(`\n${n - fail}/${n} kickoff checks passed`);
console.log(fail ? 'KICKOFF CHECKS FAILED' : 'KICKOFF CHECKS PASSED');
process.exit(fail ? 1 : 0);
