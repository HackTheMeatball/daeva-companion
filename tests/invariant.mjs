#!/usr/bin/env node
/* Invariant suite (0.3 E3, docs/design/0.3-requirement-engine.md §12): Next up and the requirement evaluator against an
   independent oracle (tests/support/oracle.mjs, written from the raw v2 data) over 10,750 states (tests/invariant/states.mjs),
   in Node (no browser, no build, no server; about 65 s in CI since 0.5 P15: a warning above 90 s, a failure above 150 s as the hang guard). Runs tests/invariant/*.test.mjs with the core bundle, (test, M, X).
   Also suite `invariant` in tests/run.mjs (CI: the `checks` shard; ci.yml has no step of its own for it).
   Deterministic: the golden states have their own fixed seeds, the random top-up uses SEED (printed on a failure).
   Every class since 0.9 P12: the Assassin over TOTAL states, each other class over CLASS_TOTAL of its own (--class).
   Usage: node tests/invariant.mjs [--seed <n>] [--state <id substring>] [--only <file substring>] [--class <class id>]
     --state replays the states whose id contains the text (same seed), e.g. --state random/42-
     --class runs one other class only (e.g. --class chanter; its states' ids are the same shape as the Assassin's) */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { guidePacks } from '../tools/gen/gen.mjs';
import { DEFAULT_PACK } from '../tools/gen/packs.mjs';
import { coreBundle, runner } from './support/core-bundle.mjs';
import { loadOracle } from './support/oracle.mjs';
import { CLASS_TOTAL, makeStates, TOTAL } from './invariant/states.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WARN_S = 90, LIMIT_S = 150, SEED = 0xE3A11;
const t0 = performance.now();
const arg = n => process.argv.includes('--' + n) ? process.argv[process.argv.indexOf('--' + n) + 1] : null;
const only = arg('only'), pickState = arg('state'), seed = arg('seed') !== null ? Number(arg('seed')) : SEED;
if (!Number.isInteger(seed)) { console.error('--seed: an integer (e.g. 0xE3A11)'); process.exit(2); }
const seedHex = '0x' + seed.toString(16).toUpperCase();

/* 0.9 P12: every class. The default class (the Assassin) runs its TOTAL states here; each other guide pack runs in a child
   (--class <id>) of its own: its own core bundle (its tables), its own oracle (its guide, skills, board and build from
   data/**) and CLASS_TOTAL states ticked from its own catalog, through every test file. */
const CLASSES = guidePacks().map(pack => ({ pack, cls: pack.split('/').pop() }));
const DEF = CLASSES.find(x => x.pack === DEFAULT_PACK), clsArg = arg('class');
const ME = clsArg ? CLASSES.find(x => x.cls === clsArg) : DEF;
if (!DEF || !ME) { console.error(`--class: one of ${CLASSES.map(x => x.cls).join(', ')}`); process.exit(2); }
const OTHER = ME !== DEF;
/* the negative control (P12): a bug seeded into the data of this class (the first other one) must be caught */
const NEG = CLASSES.find(x => x !== DEF);

const M = await coreBundle({ pack: ME.pack });
let states = makeStates(M, { root: ROOT, seed, ...(OTHER ? ME : {}) });
const total = states.length;
if (pickState) states = states.filter(s => s.id.includes(pickState));
const O = loadOracle({ root: ROOT, cls: ME.cls });
/* the app runs with the 0.3 E4 changes on (src/packs/aion2/rules.js GATE_CHANGES): the oracle with the same proposals applied */
const APP_APPLY = Object.values(M.GATE_CHANGES).filter(x => x.apply).map(x => x.apply);
const OA = loadOracle({ root: ROOT, apply: new Set(APP_APPLY), cls: ME.cls });
console.log(`${OTHER ? `class ${ME.cls} · ` : ''}seed ${seedHex} · ${states.length} states${pickState ? ` (of ${total}, --state ${pickState})` : ''} · setup ${((performance.now() - t0) / 1000).toFixed(2)} s`);

const R = runner();
const test = (name, fn) => { const t = performance.now(); R.test(name, fn); console.log(`     ${((performance.now() - t) / 1000).toFixed(2)} s`); };
/* every state loaded and migrated as the page does, deep-frozen; once, for every test file ([{ id, s: the save, c: char(s) }]) */
const deepFreeze = o => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };
let LOADED = null;
const loaded = () => LOADED || (LOADED = states.map(({ id, raw }) => { const { state, hadSave } = M.loadState(raw, { newId: () => 'fresh-slot' }); M.migrate(state, hadSave, () => {}, 0);
  return { id, s: deepFreeze(state), c: M.char(state) }; }));
/* scale: the share of the Assassin's TOTAL a run has, for the checks that count how much they saw (another class: CLASS_TOTAL) */
const X = { states, loaded, O, OA, APP_APPLY, root: ROOT, TOTAL: pickState ? states.length : OTHER ? CLASS_TOTAL : TOTAL, seedHex, only: !!pickState,
  cls: OTHER ? ME.cls : null, scale: OTHER ? CLASS_TOTAL / TOTAL : 1 };
/* 0.9 P6: the first test file runs here; every other one in a child process of its own (`--only <file>`, the same seed,
   --state and node flags), at the same time, so the suite takes about its longest file (next-up), not their sum. Each
   child's lines are printed after this process's, and its checks count in the totals (a child that fails or doesn't
   print its summary fails the suite). 0.9 P12: each other class is one more child (`--class <id>`, every file in turn). */
const files = readdirSync(join(ROOT, 'tests/invariant')).filter(f => f.endsWith('.test.mjs')).sort().filter(f => !only || f.includes(only));
const spawnChild = (f, args) => new Promise(resolve => {
  const child = spawn(process.execPath, [...process.execArgv, fileURLToPath(import.meta.url), ...args, '--seed', String(seed), ...(pickState ? ['--state', pickState] : [])], { cwd: ROOT });
  let out = ''; child.stdout.on('data', d => { out += d; }); child.stderr.on('data', d => { out += d; });
  child.on('close', code => resolve({ f, code, out }));
});
const children = only || OTHER ? [] : [...files.slice(1).map(f => spawnChild(f, ['--only', f])),
  ...CLASSES.filter(x => x !== DEF).map(x => spawnChild(`class ${x.cls}`, ['--class', x.cls]))];
/* place.test.mjs reads only the place tables (NODE_PLACE, KIBELISKS, TRAVEL_RULES) and the smart golden families: it runs on
   the Assassin, and another class runs it only if its place tables differ from the Assassin's */
let placeSame = false;
if (OTHER) { const D = await coreBundle(); placeSame = ['NODE_PLACE', 'KIBELISKS', 'TRAVEL_RULES'].every(t => JSON.stringify(M[t]) === JSON.stringify(D[t]));
  test(`${ME.cls}: place tables ${placeSame ? 'are the Assassin\'s (place.test.mjs runs there)' : 'differ from the Assassin\'s: place.test.mjs runs here'}`, () => {}); }
for (const f of only ? files : OTHER ? files.filter(f => !(placeSame && f.startsWith('place.'))) : files.slice(0, 1)) {
  console.log(`-- ${OTHER ? ME.cls + ': ' : ''}${f}`);
  (await import(pathToFileURL(join(ROOT, 'tests/invariant', f)).href)).default(test, M, X);
}
/* P12's negative control: a bug seeded into one other class's data (a step of its guide unlocks one level later in the
   app's tables than in data/**, which the oracle reads) must show up as a disagreement on that step, and only there */
if (OTHER && ME === NEG && !pickState) {
  const rel = `data/packs/aion2/asmodian/${ME.cls}/guide/steps.json`, rec = JSON.parse(readFileSync(join(ROOT, rel), 'utf8')).records.find(r => r.requires && typeof r.requires.level === 'number' && r.requires.level < 45);
  if (!rec) throw new Error(`negative control: no ${ME.cls} guide step with a level`);
  const MB = await coreBundle({ pack: ME.pack, mutate: (f, doc) => { if (f === rel) doc.records.find(r => r.id === rec.id).requires.level++; } });
  test(`negative control: a bug seeded in the ${ME.cls}'s data (${rec.id} unlocks at Lv ${rec.requires.level + 1}, not ${rec.requires.level}) is caught by the oracle`, () => {
    const hit = new Map();
    for (const { c } of loaded()) { const ev = MB.evaluate(c, { derived: false }), o = O.at(c, { derived: false });
      for (const n of O.ids) if (MB.GATE_GRAPH.nodes[n] && ev.node(n).open !== o.node(n).open) hit.set(n, (hit.get(n) || 0) + 1); }
    assert.ok(hit.get(O.idOfKey(rec.key)) > 0, `the seeded bug in ${rec.id} is not caught (hit: ${[...hit.keys()].join(' ')})`);
    assert.deepEqual([...hit.keys()].filter(n => n !== O.idOfKey(rec.key)), [], 'nothing else differs');
    console.log(`     caught in ${hit.get(O.idOfKey(rec.key))} of ${loaded().length} states`);
  });
}
let n = R.n, nFail = R.fail;
const outs = await Promise.all(children);
for (const { f, code, out } of outs) {
  const lines = out.split('\n'), sum = out.match(/^(\d+)\/(\d+) invariant checks passed/m);
  console.log(lines.filter(l => /^(-- |ok |FAIL |WARNING |\s{5})/.test(l)).join('\n'));
  if (sum) { n += +sum[2]; nFail += +sum[2] - +sum[1]; }
  if (!sum || code !== 0 || !/INVARIANT CHECKS PASSED/.test(out)) {
    console.log(`FAIL invariant child for ${f}: exit ${code}${sum ? '' : ', no summary'}\n${lines.slice(-8).join('\n')}`); if (!sum) { n++; nFail++; } R.failed(); }
}
/* every class's story chain checked against its GATE_GRAPH, and its Next up disagreements (tests/out/invariant*.md) */
if (!only && !OTHER) {
  const chains = outs.flatMap(x => x.out.match(/^ {5}chain: .*$/gm) || []), dis = outs.flatMap(x => (x.out.match(/^ {5}(\d+) disagreement kinds/gm) || []).map(l => +l.trim().split(' ')[0]));
  console.log(`     classes: ${CLASSES.length} · ${chains.length} chains checked · ${dis.reduce((a, b) => a + b, 0)} disagreements`);
  if (!pickState && chains.length !== CLASSES.length) { console.log(`FAIL invariant: ${chains.length} chains checked, not one per class (${CLASSES.length})`); n++; nFail++; R.failed(); }
}
const s = (performance.now() - t0) / 1000;
console.log(`\n${n - nFail}/${n} invariant checks passed in ${s.toFixed(2)} s`);
if (s > LIMIT_S) { console.log(`FAIL invariant suite took longer than ${LIMIT_S} s (hang guard)`); R.failed(); }
else if (s > WARN_S) console.log(`WARNING invariant suite took longer than ${WARN_S} s (fails above ${LIMIT_S} s): reduce its work or split it`);
if (R.fail) console.log(`seed ${seedHex}: replay a failing state with  node tests/invariant.mjs --seed ${seedHex} --state <state id>`);
console.log(R.fail ? `INVARIANT CHECKS FAILED: ${R.fail}` : 'INVARIANT CHECKS PASSED');
process.exit(R.fail ? 1 : 0);
