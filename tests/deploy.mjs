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
const decide = new Function(m[1] + '\nreturn decide;')();

const SHA = 'abc1234def5678abc1234def5678abc1234def5', S7 = SHA.slice(0, 7);
const push = (vBefore, vSha, before = 'f'.repeat(40)) => decide({ event: 'push', before, sha: SHA, vBefore, vSha });
check(push('0.8.0', '0.9.0').deploy === true && push('0.9.0', '0.9.0').deploy === false,
  'push: deploys only when its own diff changes the version; an ordinary merge stops at ci-ok');
check(push('0.8.0', '0.9.0', '0'.repeat(40)).deploy === false && push('0.8.0', '0.9.0', '').deploy === false,
  'push: an all-zero or missing before sha counts as no version change (FGR)');

const NOW = (q, s7 = S7) => `Coordinator, two-person dispatch.\nDEPLOY NOW ${s7}: "${q}" (verified by id cmsg_01ABC)`;
const disp = (o) => decide({ event: 'workflow_dispatch', sha: SHA, onMain: true, ciGreen: true, vSha: '0.9.0', vParent: '0.9.0', lastTag: 'v0.8.0', saveChange: false, now: '42', nowIs114: true, nowBody: NOW('now'), ...o });
check(decide({ event: 'workflow_dispatch', sha: '' }).deploy === false, 'dispatch without sha: tests only, as before');
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
check(/needs: \[data, browser, ci-ok, gate\]/.test(dep) && /needs\.gate\.outputs\.deploy == 'true'/.test(dep) && /needs\.ci-ok\.result == 'success'/.test(dep),
  'deploy: only when the gate says so, and a push only after its own ci-ok');
check([dep, smk, rel].every((j) => /ref: \$\{\{ needs\.gate\.outputs\.sha \}\}/.test(j)) && /sha="\$DEPLOY_SHA"/.test(rel),
  'deploy, smoke and release all check out and tag the gate\'s sha');
check(/needs\.deploy\.result == 'success'/.test(smk) && /needs\.smoke\.result == 'success'/.test(rel), 'smoke only after a deploy, release only after smoke');

console.log(`\n${n - fail}/${n} deploy checks passed`);
console.log(fail ? 'DEPLOY CHECKS FAILED' : 'DEPLOY CHECKS PASSED');
process.exit(fail ? 1 : 0);
