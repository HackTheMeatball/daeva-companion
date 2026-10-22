#!/usr/bin/env node
/* ci.yml's deploy gate (the block between "DEPLOY-GATE START" and "DEPLOY-GATE END") run in Node against fixtures, no network:
   only a push that changes package.json's version, or a dispatch at a named sha, deploys; the escape hatch needs the owner's
   quoted "now" on #114 and refuses an unnamed save reset (PLN-17; Fresh governance review, deploy-cadence OK, 2026-10-21). < 1 s. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const yml = readFileSync(join(ROOT, '.github', 'workflows', 'ci.yml'), 'utf8');
let n = 0, fail = 0;
const check = (ok, what) => { n++; if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); };

const m = yml.match(/\/\/ DEPLOY-GATE START[^\n]*\n([\s\S]*?)\n\s*\/\/ DEPLOY-GATE END/);
check(!!m, 'ci.yml has the DEPLOY-GATE block');
if (!m) { console.log('DEPLOY CHECKS FAILED'); process.exit(1); }
const { decide, lost } = new Function(m[1] + '\nreturn { decide, lost };')();

const SHA = 'abc1234def5678abc1234def5678abc1234def5', S7 = SHA.slice(0, 7);
const push = (vBefore, vSha, before = 'f'.repeat(40)) => decide({ event: 'push', before, sha: SHA, vBefore, vSha });
check(push('0.8.0', '0.9.0').deploy === true && push('0.9.0', '0.9.0').deploy === false,
  'push: deploys only when its own diff changes the version; an ordinary merge stops at ci-ok');
check(push('0.8.0', '0.9.0', '0'.repeat(40)).deploy === false && push('0.8.0', '0.9.0', '').deploy === false,
  'push: an all-zero or missing before sha counts as no version change (FGR)');

const NOW = (q, s7 = S7) => `Coordinator, two-person dispatch.\nDEPLOY NOW ${s7}: "${q}" (verified by id cmsg_01ABC)`;
const disp = (o) => decide({ event: 'workflow_dispatch', sha: SHA, onMain: true, ciGreen: true, vSha: '0.9.0', vParent: '0.9.0', lastTag: 'v0.8.0', saveChange: false, now: '42', nowIs114: true, nowBody: NOW('now'), ...o });
// The auto-merge path: every merge starts main CI as a dispatch with no inputs (no push event for GITHUB_TOKEN merges).
const am = readFileSync(join(ROOT, '.github', 'workflows', 'auto-merge.yml'), 'utf8');
check(/createWorkflowDispatch\(\{ owner, repo, workflow_id: 'ci\.yml', ref: 'main' \}\)/.test(am),
  "auto-merge starts main CI as a dispatch with no inputs (the path the gate's no-sha case must deploy a release on)");
const merged = (vParent, vSha) => decide({ event: 'workflow_dispatch', sha: '', vParent, vSha });
check(merged('0.8.0', '0.9.0').deploy === true && merged('0.9.0', '0.9.0').deploy === false,
  "auto-merge's dispatch: a merged release deploys, an ordinary merge stops at ci-ok (#786 deployed neither)");
check(lost({ vSha: '0.9.0', tagged: false, relSha: SHA }, merged('0.9.0', '0.9.0')).includes(S7)
  && lost({ vSha: '0.9.0', tagged: false }, push('0.9.0', '0.9.0')) !== ''
  && lost({ vSha: '0.9.0', tagged: true }, merged('0.9.0', '0.9.0')) === ''
  && lost({ vSha: '0.9.0', tagged: false }, merged('0.8.0', '0.9.0')) === '',
  'a run that does not deploy warns when the version has no tag (a release that never finished), naming the release commit');
check(!!disp({ onMain: false }).refuse && !!disp({ ciGreen: false }).refuse, 'dispatch: refused off main or without ci-ok green on the sha');
check(disp({ vParent: '0.8.0', nowIs114: false, nowBody: '' }).deploy === true,
  'dispatch at a release commit (version differs from its parent): re-run or rollback, no quote needed');
check(!!disp({ nowIs114: false }).refuse && !!disp({ nowBody: 'yes ship it' }).refuse && !!disp({ nowBody: NOW('now', '9999999') }).refuse
  && !!disp({ nowBody: `DEPLOY NOW ${S7}: "now"` }).refuse,
  'escape hatch: refused without a #114 comment holding DEPLOY NOW <this sha7>: "<quote>" (verified by id <id>)');
check(disp({}).deploy === true && /now/.test(disp({}).why), 'escape hatch: a verified quote on #114 deploys that sha, and the reason names the quote');
check(!!disp({ saveChange: true }).refuse && disp({ saveChange: true, nowBody: NOW('ok ship the save reset now') }).deploy === true,
  'escape hatch: a save-key change or "Saves reset" line since the last tag is refused unless the quote names it (FGR)');

// Wiring: deploy, smoke and release follow the gate's sha; nothing deploys without the gate.
const job = (name) => (yml.match(new RegExp(`\\n  ${name}:\\n([\\s\\S]*?)(?=\\n  [a-z-]+:\\n|$)`)) || [])[1] || '';
const dep = job('deploy'), smk = job('smoke'), rel = job('release');
check(/needs: \[data, browser, ci-ok, gate\]/.test(dep) && /needs\.gate\.outputs\.deploy == 'true'/.test(dep)
  && /needs\.gate\.outputs\.own_ci != 'true' \|\| needs\.ci-ok\.result == 'success'/.test(dep) && /if: \$\{\{ !cancelled\(\) && /.test(dep) && !/always\(\)/.test(dep),
  "deploy: only when the gate says so, a push or a merge's dispatch only after its own ci-ok, and never from a cancelled run");
check([dep, smk, rel].every((j) => /ref: \$\{\{ needs\.gate\.outputs\.sha \}\}/.test(j)) && /sha="\$DEPLOY_SHA"/.test(rel),
  'deploy, smoke and release all check out and tag the gate\'s sha');
check(/needs\.deploy\.result == 'success'/.test(smk) && /needs\.smoke\.result == 'success'/.test(rel), 'smoke only after a deploy, release only after smoke');

// HC-01 (Watchdog, flaky suites; Kaizen batch-0.9 item 26): a suite that passes on retry is a CI annotation titled
// `FLAKY <suite>` and a step-summary line, which the health check counts (tests/run.mjs, FLAKY-NOTE block).
const runSrc = readFileSync(join(ROOT, 'tests', 'run.mjs'), 'utf8');
const fb = runSrc.match(/\/\/ FLAKY-NOTE START[^\n]*\n([\s\S]*?)\n\/\/ FLAKY-NOTE END/);
check(!!fb, 'tests/run.mjs has the FLAKY-NOTE block');
const flakyNote = fb ? new Function(fb[1] + '\nreturn flakyNote;')() : () => ({});
const fnote = flakyNote('core', 1, ['FAIL core checks took longer than 5 s', 'FAIL x 100%\nmore']);
// Intended change (Kaizen item 29): the message now says "passed on retry N; first run: …", and a kill has its own title.
check(fnote.warning === '::warning title=FLAKY core::passed on retry 1; first run: FAIL core checks took longer than 5 s | FAIL x 100  more', `a retry pass is a ::warning titled FLAKY <suite>, one line, no % (${fnote.warning})`);
check(fnote.summary === '- FLAKY `core`: passed on retry 1; first run: FAIL core checks took longer than 5 s | FAIL x 100  more\n', 'and a step-summary line');
check(flakyNote('equiv', 1, []).warning === '::warning title=FLAKY equiv::passed on retry 1; first run: first run failed', 'a first run with no FAIL line still names the suite');
const kOk = flakyNote('equiv', 1, ['KILLED by SIGKILL (likely out of memory)'], 'KILLED', true);
check(kOk.warning === '::warning title=KILLED equiv::passed on retry 1; first run: KILLED by SIGKILL (likely out of memory)', `a kill that passes on retry is annotated KILLED, not FLAKY (${kOk.warning})`);
const kBad = flakyNote('equiv', 1, ['KILLED by SIGKILL (likely out of memory)'], 'KILLED', false);
check(kBad.warning === '::warning title=KILLED equiv::KILLED by SIGKILL (likely out of memory) (attempt 2)', `a kill on the last attempt is annotated too (${kBad.warning})`);
check(/child\.on\('close', \(code, signal\) => \{/.test(runSrc) && /const killed = signal \? `KILLED by \$\{signal\}\$\{signal === 'SIGKILL' \? ' \(likely out of memory\)' : ''\}` : '';/.test(runSrc), 'run.mjs reads the exit signal and names a kill');
check(/ok \? \(attempt \? 'FLAKY' : 'PASS '\) : killed \? 'KILLED' : 'FAIL '/.test(runSrc), 'a killed suite is labelled KILLED, not FAIL');
check(/if \(\(ok && attempt\) \|\| killed\) \{\s*const note = flakyNote\(name, attempt, killed \? \[killed\] : firstFails, killed \|\| firstKilled \? 'KILLED' : 'FLAKY', ok\);\s*if \(process\.env\.GITHUB_ACTIONS\) console\.log\(note\.warning\);\s*if \(process\.env\.GITHUB_STEP_SUMMARY\) appendFileSync\(process\.env\.GITHUB_STEP_SUMMARY, note\.summary\);/.test(runSrc), 'run.mjs annotates a pass on retry or a kill, and only on CI');

console.log(`\n${n - fail}/${n} deploy checks passed`);
console.log(fail ? 'DEPLOY CHECKS FAILED' : 'DEPLOY CHECKS PASSED');
process.exit(fail ? 1 : 0);
