#!/usr/bin/env node
/* Invariant suite (0.3 E3, docs/design/0.3-requirement-engine.md §12): Next up and the requirement evaluator against an
   independent oracle (tests/support/oracle.mjs, written from the raw v2 data) over 10,750 states (tests/invariant/states.mjs),
   in Node (no browser, no build, no server; about 65 s in CI since 0.5 P15: a warning above 90 s, a failure above 150 s as the hang guard). Runs tests/invariant/*.test.mjs with the core bundle, (test, M, X).
   Also suite `invariant` in tests/run.mjs (CI: the `checks` shard; ci.yml has no step of its own for it).
   Deterministic: the golden states have their own fixed seeds, the random top-up uses SEED (printed on a failure).
   Usage: node tests/invariant.mjs [--seed <n>] [--state <id substring>] [--only <file substring>]
     --state replays the states whose id contains the text (same seed), e.g. --state random/42- */
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { coreBundle, runner } from './support/core-bundle.mjs';
import { loadOracle } from './support/oracle.mjs';
import { makeStates, TOTAL } from './invariant/states.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WARN_S = 90, LIMIT_S = 150, SEED = 0xE3A11;
const t0 = performance.now();
const arg = n => process.argv.includes('--' + n) ? process.argv[process.argv.indexOf('--' + n) + 1] : null;
const only = arg('only'), pickState = arg('state'), seed = arg('seed') !== null ? Number(arg('seed')) : SEED;
if (!Number.isInteger(seed)) { console.error('--seed: an integer (e.g. 0xE3A11)'); process.exit(2); }
const seedHex = '0x' + seed.toString(16).toUpperCase();

const M = await coreBundle();
let states = makeStates(M, { root: ROOT, seed });
const total = states.length;
if (pickState) states = states.filter(s => s.id.includes(pickState));
const O = loadOracle({ root: ROOT });
/* the app runs with the 0.3 E4 changes on (src/packs/aion2/rules.js GATE_CHANGES): the oracle with the same proposals applied */
const APP_APPLY = Object.values(M.GATE_CHANGES).filter(x => x.apply).map(x => x.apply);
const OA = loadOracle({ root: ROOT, apply: new Set(APP_APPLY) });
console.log(`seed ${seedHex} · ${states.length} states${pickState ? ` (of ${total}, --state ${pickState})` : ''} · setup ${((performance.now() - t0) / 1000).toFixed(2)} s`);

const R = runner();
const test = (name, fn) => { const t = performance.now(); R.test(name, fn); console.log(`     ${((performance.now() - t) / 1000).toFixed(2)} s`); };
/* every state loaded and migrated as the page does, deep-frozen; once, for every test file ([{ id, s: the save, c: char(s) }]) */
const deepFreeze = o => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };
let LOADED = null;
const loaded = () => LOADED || (LOADED = states.map(({ id, raw }) => { const { state, hadSave } = M.loadState(raw, { newId: () => 'fresh-slot' }); M.migrate(state, hadSave, () => {}, 0);
  return { id, s: deepFreeze(state), c: M.char(state) }; }));
const X = { states, loaded, O, OA, APP_APPLY, root: ROOT, TOTAL: pickState ? states.length : TOTAL, seedHex, only: !!pickState };
/* 0.9 P6: the first test file runs here; every other one in a child process of its own (`--only <file>`, the same seed,
   --state and node flags), at the same time, so the suite takes about its longest file (next-up), not their sum. Each
   child's lines are printed after this process's, and its checks count in the totals (a child that fails or doesn't
   print its summary fails the suite). */
const files = readdirSync(join(ROOT, 'tests/invariant')).filter(f => f.endsWith('.test.mjs')).sort().filter(f => !only || f.includes(only));
const children = only ? [] : files.slice(1).map(f => new Promise(resolve => {
  const child = spawn(process.execPath, [...process.execArgv, fileURLToPath(import.meta.url), '--only', f, '--seed', String(seed), ...(pickState ? ['--state', pickState] : [])], { cwd: ROOT });
  let out = ''; child.stdout.on('data', d => { out += d; }); child.stderr.on('data', d => { out += d; });
  child.on('close', code => resolve({ f, code, out }));
}));
for (const f of only ? files : files.slice(0, 1)) {
  console.log(`-- ${f}`);
  (await import(pathToFileURL(join(ROOT, 'tests/invariant', f)).href)).default(test, M, X);
}
let n = R.n, nFail = R.fail;
for (const { f, code, out } of await Promise.all(children)) {
  const lines = out.split('\n'), sum = out.match(/^(\d+)\/(\d+) invariant checks passed/m);
  console.log(lines.filter(l => /^(-- |ok |FAIL |WARNING |\s{5})/.test(l)).join('\n'));
  if (sum) { n += +sum[2]; nFail += +sum[2] - +sum[1]; }
  if (!sum || code !== 0 || !/INVARIANT CHECKS PASSED/.test(out)) {
    console.log(`FAIL invariant child for ${f}: exit ${code}${sum ? '' : ', no summary'}\n${lines.slice(-8).join('\n')}`); if (!sum) { n++; nFail++; } R.failed(); }
}
const s = (performance.now() - t0) / 1000;
console.log(`\n${n - nFail}/${n} invariant checks passed in ${s.toFixed(2)} s`);
if (s > LIMIT_S) { console.log(`FAIL invariant suite took longer than ${LIMIT_S} s (hang guard)`); R.failed(); }
else if (s > WARN_S) console.log(`WARNING invariant suite took longer than ${WARN_S} s (fails above ${LIMIT_S} s): reduce its work or split it`);
if (R.fail) console.log(`seed ${seedHex}: replay a failing state with  node tests/invariant.mjs --seed ${seedHex} --state <state id>`);
console.log(R.fail ? `INVARIANT CHECKS FAILED: ${R.fail}` : 'INVARIANT CHECKS PASSED');
process.exit(R.fail ? 1 : 0);
