/* Pack conformance (0.4 P6, docs/plans/0.4/P6-fake-pack.md): what every pack chain passes, run for the AION 2 Assassin chain
   and for a fake game (tests/fixtures/packs/fakegame/: a game pack with three story quests and one source site, and two
   guide packs, i.e. two classes, each one milestone with two steps). "The engine holds no AION 2" is proved by running it
   on a game that isn't AION 2.
     1. the generator (tools/gen/gen.mjs generate({ root, pack }), the CLI's --root / --pack) builds it with 0 failed
        checks: engine checks for every pack, a pack's own checks only where its manifests declare them (P6a);
     2. a fresh v5 save through memoryStorage: Lv 1 on the first story quest;
     3. rankNext with the pack's producers: the story card on the first quest comes first; turning the quest in moves
        Next up on; the gated step (the first step whose gate waits on a quest being turned in) stays out until then;
     4. save, reload, merge() with itself: unchanged;
     5. the fake chain (the engine, src/core/ and src/cards/, plus the fake pack's code) loads no module of a pack
        under src/packs/ (esbuild's import graph);
     6. per-class loading (0.6 P2): generateAll() compiles the two classes to two table sets and two chunks, the game's
        tables once; a page state (shared tables + the loader's chunk) for one class holds none of the other's records,
        and the second class's chain passes steps 2-4 on its own engine;
     7. cards that open with the game (0.6 P16): a gated card's opensWith is a node of the graph, the card is locked
        (cardLock: the unlock line) until that node opens, then open (AION 2: its owner-verified unlocks; fake: step f2:1).
   The AION 2 chain runs on M (tests/support/core-bundle.mjs, the bundle the core suite tests); the fake chain on a bundle
   of its own built here, so the two packs never share an engine instance. Node only: the fake game has no page build. */
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { runInNewContext } from 'node:vm';
import { classChunk, generate, generateAll } from '../../tools/gen/gen.mjs';
import { DEFAULT_PACK, DEFAULT_ROOT } from '../../tools/gen/packs.mjs';
import { generatedData } from '../../scripts/generated-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FAKE_ROOT = join(ROOT, 'tests/fixtures/packs'), FAKE_PACK = 'fakegame/guide';
const FAKE_CODE = join(FAKE_ROOT, 'fakegame/fakegame.js');

/* step 1: the generator on one chain; a throw (a broken reference the compile step can't resolve) counts as a failure */
const gen = opts => { try { const g = generate(opts); return { g, failed: g.failed.map(c => c.check) }; } catch (e) { return { g: null, failed: ['generator threw: ' + e.message] }; } };

/* The fake chain's bundle: every engine module (src/core/, src/cards/) and the fake pack's code, with its generated data
   served as "fakegame:data"; usePack(fakegamePack) as the page would. The AION 2 data plugin is there too, only so a
   planted engine import of src/packs/aion2/ still builds and shows up in the import graph (step 5) instead of failing
   the build. Returns the namespace and the bundle's inputs (paths relative to the repo, virtual modules as "ns:path"). */
const fakeGen = gen({ root: FAKE_ROOT, pack: FAKE_PACK });
/* the fake game's second class (0.6 P2): its own guide pack on the same game pack */
const FAKE_PACK_B = 'fakegame/guide-b', fakeGenB = gen({ root: FAKE_ROOT, pack: FAKE_PACK_B });
const fakeData = g => ({ name: 'fakegame-data', setup(b) {
  b.onResolve({ filter: /^fakegame:data$/ }, () => ({ path: 'data', namespace: 'fakegame' }));
  b.onLoad({ filter: /.*/, namespace: 'fakegame' }, () => ({ contents: g.module + g.gateModule + g.proposedModule, loader: 'js' }));
} });
const fakeBundle = async (g = fakeGen.g) => {
  const js = d => readdirSync(join(ROOT, 'src', d)).filter(f => f.endsWith('.js')).sort().map(f => `export * from "./${d}/${f}";`);
  const ENTRY = [...js('core'), ...js('cards'),
    `import { fakegamePack } from ${JSON.stringify(FAKE_CODE)};`, 'import { usePack as __usePack } from "./core/pack.js";', '__usePack(fakegamePack);'].join('\n');
  const r = await build({ stdin: { contents: ENTRY, resolveDir: join(ROOT, 'src'), loader: 'js', sourcefile: 'fakegame-entry.js' }, absWorkingDir: ROOT,
    bundle: true, write: false, metafile: true, format: 'esm', platform: 'neutral', treeShaking: false, logLevel: 'silent', plugins: [fakeData(g), generatedData] });
  const inputs = Object.keys(r.metafile.inputs).map(p => /^[\w-]+:/.test(p) ? p : relative(ROOT, resolve(ROOT, p)).split(sep).join('/'));
  return { E: await import('data:text/javascript;base64,' + Buffer.from(r.outputFiles[0].text).toString('base64')), inputs };
};
const FAKE = fakeGen.g ? await fakeBundle() : null;
const FAKE_B = fakeGenB.g ? await fakeBundle(fakeGenB.g) : null;

/* The shell's "Turned in" (src/main.js), the part the engine sees: every objective done, then the next quest, or
   storyEnd on the last one. */
const turnIn = (E, state) => {
  const c = E.char(state), { quests, steps } = E.activePack().data.story, i = E.questIdx(c);
  if (steps[c.quest]) (c.qsteps = c.qsteps || {})[c.quest] = steps[c.quest].map((_, j) => j);
  if (i === quests.length - 1) c.storyEnd = c.quest; else c.quest = quests[i + 1][1];
};
const atomsOf = g => g.all ? g.all.flatMap(atomsOf) : g.any ? g.any.flatMap(atomsOf) : [g];
/* the gated step: the first step node (catalog order) whose gate waits on a quest being turned in and on nothing but
   story and level atoms, so the story position and the level alone open it */
const gatedStepOf = graph => {
  for (const n of Object.values(graph.nodes)) {
    if (n.kind !== 'step') continue;
    const at = atomsOf(n.req), turn = at.find(a => a.story && a.is === 'turnedIn');
    if (turn && at.every(a => a.story || a.level !== undefined)) return { k: n.key, qi: turn.i, lv: Math.max(1, ...at.filter(a => a.level !== undefined).map(a => a.level)) };
  }
  return null;
};
const NOW_MS = 1_760_000_000_000, NOW_S = NOW_MS / 1000;

/* steps 2-4 on one chain's engine E (its pack already set) */
const runChain = (test, name, E) => {
  const P = E.activePack(), quests = P.data.story.quests, store = E.memoryStorage();
  const { state, hadSave } = E.loadState(store.get(E.KEY), { now: NOW_MS, newId: () => 'slot-1' });
  const save = () => { E.stampSave(state, NOW_MS); assert.equal(store.set(E.KEY, JSON.stringify(state)), true, 'stored'); };
  E.migrate(state, hadSave, save, NOW_S);
  const c = E.char(state);
  const cards = () => E.rankNext(state), keys = () => cards().filter(x => x.x).map(x => x.x.k);
  test(`${name} 2: a fresh v5 save through memoryStorage starts at Lv 1 on the first story quest`, () => {
    assert.equal(hadSave, false);
    assert.equal(state.v, 5); assert.equal(E.SAVE_V, 5);
    assert.deepEqual([c.level, c.quest, c.pack], [1, quests[0][1], P.character.pack]);
    save();
    assert.equal(JSON.parse(store.get(E.KEY)).chars['slot-1'].quest, quests[0][1]);
  });
  test(`${name} 3: rankNext puts the story card on the first quest first; turning it in moves Next up on`, () => {
    const first = cards()[0];
    assert.deepEqual([first.kind, first.quest], ['story', quests[0][1]]);
    turnIn(E, state);
    const next = cards()[0];
    assert.deepEqual([next.kind, next.quest], ['story', quests[1][1]]);
  });
  const gs = gatedStepOf(P.data.graph);
  test(`${name} 3: the gated step (${gs && gs.k}) stays out of Next up until its quest is turned in`, () => {
    assert.ok(gs, 'the chain has a step gated on a turned-in quest');
    c.level = gs.lv; c.quest = quests[gs.qi][1];
    assert.ok(!keys().includes(gs.k), `${gs.k} shown while "${c.quest}" is not turned in`);
    turnIn(E, state);
    assert.ok(keys().includes(gs.k), `${gs.k} not shown after "${quests[gs.qi][1]}" is turned in: ${JSON.stringify(cards().map(x => x.kind + ':' + (x.x ? x.x.k : x.quest || '')))}`);
    c.checks[gs.k] = true;
    assert.ok(!keys().includes(gs.k), 'a ticked step leaves Next up');
  });
  test(`${name} 4: save, reload and merge() with itself leave the save unchanged`, () => {
    save();
    const raw = store.get(E.KEY), saved = JSON.parse(raw);
    let wrote = false;
    const { state: s2, hadSave: had2 } = E.loadState(raw, { now: NOW_MS, newId: () => 'other' });
    E.migrate(s2, had2, () => { wrote = true; }, NOW_S);
    assert.equal(had2, true); assert.equal(wrote, false, 'a reload writes nothing');
    assert.deepEqual(s2, saved, 'reloaded = saved');
    assert.deepEqual(E.merge(s2, s2), s2, 'merge(save, save) = save');
    assert.deepEqual(E.char(s2).checks, c.checks); assert.equal(E.char(s2).quest, c.quest);
  });
  return state;
};

export default (test, M) => {
  /* ---------- the AION 2 Assassin chain (M: the core suite's bundle, aion2Pack set) ---------- */
  const A = 'conformance [aion2/asmodian/assassin]';
  test(`${A} 1: the generator builds it with 0 failed checks (engine checks + the pack's checks.mjs)`, () => {
    const { g, failed } = gen({ root: DEFAULT_ROOT, pack: DEFAULT_PACK });
    assert.deepEqual(failed.slice(0, 5), []);
    assert.deepEqual(g.B.packChecks.map(p => p.pack), ['aion2'], 'AION 2 declares its own checks');
    assert.deepEqual(M.activePack().data.graph, g.gateGraph, 'the pack the engine runs carries this build\'s GATE_GRAPH');
  });
  runChain(test, A, M);
  /* cards that open with the game (0.6 P16): each gated card's opensWith is a node of the pack's graph, and on a fresh
     character the card is locked or open as its owner-verified unlock says (unlocks.json) */
  const lockOf = (E, c, id) => E.cardLock(E.activePack().cards.find(x => x.id === id), E.gatesOf(c));
  const freshChar = E => { const { state } = E.loadState(null, { now: NOW_MS, newId: () => 'slot-1' }); E.migrate(state, false, () => {}, NOW_S); return E.char(state); };
  test(`${A} 7: every card's opensWith names a node of the pack's gate graph`, () => {
    const gated = M.activePack().cards.filter(x => x.opensWith);
    assert.deepEqual(gated.map(x => [x.id, x.opensWith]), [['skills', 'unlock:skills-window'], ['daevanion', 'unlock:daevanion'], ['stigmas', 'unlock:stigma-slot-1']]);
    for (const x of gated) assert.ok(M.activePack().data.graph.nodes[x.opensWith], `${x.id}: ${x.opensWith} is not in the graph`);
  });
  test(`${A} 7: Skills open at Lv 4, Daevanion after "Urgent Pursuit", Stigmas at Lv 22 (locked before, with the unlock line)`, () => {
    const c = freshChar(M), quests = M.activePack().data.story.quests, up = quests.findIndex(q => q[1] === 'Urgent Pursuit');
    assert.ok(up > 0, '"Urgent Pursuit" is in the story');
    const states = () => ['skills', 'daevanion', 'stigmas'].map(id => { const l = lockOf(M, c, id); return l ? l.text : 'open'; });
    assert.deepEqual(states(), ['Opens at Lv 4', 'Opens after "Urgent Pursuit"', 'Opens at Lv 22'], 'Lv 1');
    assert.deepEqual([lockOf(M, c, 'skills').label, lockOf(M, c, 'skills').key, lockOf(M, c, 'stigmas').key], ['Skills, opens at Lv 4', 'K', null]);
    c.level = 3; assert.equal(states()[0], 'Opens at Lv 4', 'Lv 3');
    c.level = 4; assert.deepEqual(states(), ['open', 'Opens after "Urgent Pursuit"', 'Opens at Lv 22'], 'Lv 4');
    c.level = 13; c.quest = quests[up][1];
    assert.equal(states()[1], 'Opens after "Urgent Pursuit"', 'on "Urgent Pursuit", not turned in');
    c.quest = quests[up + 1][1];
    assert.deepEqual(states(), ['open', 'open', 'Opens at Lv 22'], 'after "Urgent Pursuit"');
    c.level = 21; assert.equal(states()[2], 'Opens at Lv 22', 'Lv 21');
    c.level = 22; assert.deepEqual(states(), ['open', 'open', 'open'], 'Lv 22');
  });

  /* ---------- the fake game ---------- */
  const F = `conformance [${FAKE_PACK}]`;
  test(`${F} 1: the generator builds it with 0 failed checks (engine checks only)`, () => {
    assert.deepEqual(fakeGen.failed.slice(0, 5), []);
    assert.ok(fakeGen.g.report.checks.length > 0);
    assert.deepEqual(fakeGen.g.B.packChecks, [], 'no pack checks declared');
    assert.deepEqual(FAKE.E.activePack().data.graph, fakeGen.g.gateGraph);
    assert.equal(FAKE.E.activePack().id, 'fakegame');
  });
  test(`${F} 1: negative control: a copy with a broken gate reference fails the generator`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'fakegame-'));
    try {
      cpSync(join(FAKE_ROOT, 'fakegame'), join(dir, 'fakegame'), { recursive: true });
      const f = join(dir, 'fakegame/guide/steps.json'), doc = JSON.parse(readFileSync(f, 'utf8'));
      const gated = doc.records.find(r => r.id === 'f2:1').requires.all.find(a => a.story);
      assert.equal(gated.is, 'turnedIn'); gated.story = 'sq:10009';
      writeFileSync(f, JSON.stringify(doc));
      const { failed } = gen({ root: dir, pack: FAKE_PACK });
      assert.ok(failed.length && failed.some(x => x.includes('sq:10009')), JSON.stringify(failed));
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  if (!FAKE) return;
  const fs = runChain(test, F, FAKE.E);
  test(`${F} 3: the pack's producer runs: its card ranks after the story card on the last quest`, () => {
    const cards = FAKE.E.rankNext(fs).map(x => x.kind);
    assert.deepEqual(cards.filter(k => k === 'story' || k === 'fakeEnd'), ['story', 'fakeEnd']);
  });
  test(`${F} 3: a pack with no place (0.5 P10): whereNow is null on its played save, byPlace keeps the catalog order`, () => {
    const E = FAKE.E, c = E.char(fs);
    assert.equal(E.activePack().place, null);
    assert.ok(Object.values(c.mt.checks || {}).some(([t, v]) => t > 0 && v === true) && c.mt.quest[0] > 0, 'the save has dated ticks and a dated story position');
    assert.equal(E.whereNow(c), null);
    assert.deepEqual([{ order: 2 }, { order: 0 }, { order: 1 }].sort(E.byPlace(E.whereNow(c))).map(x => x.order), [0, 1, 2]);
  });
  test(`${F} 7: the pack's gated card registers, stays locked until its gate (step f2:1) opens, then opens`, () => {
    const E = FAKE.E, R = E.cardRegistry(), spec = E.activePack().cards[0];
    assert.equal(R.register(spec).opensWith, 'f2:1');
    assert.ok(E.activePack().data.graph.nodes[spec.opensWith], 'f2:1 is in the graph');
    const c = freshChar(E), quests = E.activePack().data.story.quests;
    assert.deepEqual(lockOf(E, c, 'fakegame-bell'), { text: 'Opens after "Second Wind"', label: 'Bell tower, opens after "Second Wind"', key: 'B' }, 'Lv 1');
    c.level = 2; c.quest = quests[1][1];
    assert.equal(lockOf(E, c, 'fakegame-bell').text, 'Opens after "Second Wind"', 'on "Second Wind", not turned in');
    c.quest = quests[2][1]; c.level = 1;
    assert.equal(lockOf(E, c, 'fakegame-bell').text, 'Opens at Lv 2', '"Second Wind" turned in, Lv 1');
    c.level = 2;
    assert.equal(lockOf(E, c, 'fakegame-bell'), null, 'open');
    assert.throws(() => E.cardRegistry().register({ ...spec, name: null }), /needs a root and a name/);
    assert.throws(() => E.cardRegistry().register({ ...spec, opensWith: '' }), /opensWith is a node id or null/);
  });
  test(`${F} 5: the fake chain loads no module from src/packs/ (import graph)`, () => {
    const packs = FAKE.inputs.filter(p => p.startsWith('src/packs/') || p.startsWith('generated:'));
    assert.deepEqual(packs, [], `${packs.length} pack module(s) loaded: ${packs.slice(0, 4).join(', ')}`);
    assert.ok(FAKE.inputs.includes('tests/fixtures/packs/fakegame/fakegame.js') && FAKE.inputs.includes('src/core/nextup.js'), JSON.stringify(FAKE.inputs));
  });

  /* ---------- per-class loading (0.6 P2): the fake game's two classes (guide packs fakegame/guide and fakegame/guide-b) ---------- */
  const C = 'conformance [fakegame, two classes]';
  const all = (() => { try { return generateAll({ root: FAKE_ROOT }); } catch (e) { return { error: e.message }; } })();
  const sharedOf = id => Object.fromEntries(all.shared.map(n => [n, all.tables[id][n]]));
  test(`${C} 6: the generator compiles one table set per class pack, keyed by pack id; the game pack's tables once`, () => {
    assert.equal(all.error, undefined);
    assert.deepEqual(all.packs, [FAKE_PACK, FAKE_PACK_B]);
    assert.deepEqual(all.failed, []);
    assert.ok(['QUESTS', 'QUEST_STEPS', 'STORY_END'].every(n => all.shared.includes(n)), JSON.stringify(all.shared));
    assert.ok(['GUIDE_GATES', 'GATE_GRAPH', 'GATE_PROPOSED'].every(n => all.perClass.includes(n)), JSON.stringify(all.perClass));
    assert.deepEqual(sharedOf(FAKE_PACK), sharedOf(FAKE_PACK_B), 'a shared table is the same for both classes');
  });
  test(`${C} 6: the two classes compile to two chunks, each holding its own records only; the shared tables hold neither`, () => {
    const [a, b] = all.packs.map(id => classChunk(all, id));
    assert.notEqual(a, b);
    assert.ok(a.includes('"f2:0"') && !/"g3[:"]/.test(a), 'chunk A: f2 steps, no g3');
    assert.ok(b.includes('"g3:0"') && !/"f2[:"]/.test(b), 'chunk B: g3 steps, no f2');
    assert.ok(!/"(f2|g3)[:"]/.test(JSON.stringify(sharedOf(FAKE_PACK))), 'no class record in the shared tables');
  });
  test(`${C} 6: with every chunk on the page (the claude.ai build), the loader's choice sets one class: a page state for class A never contains class B's records`, () => {
    for (const [id, own, other] of [[FAKE_PACK, 'f2', 'g3'], [FAKE_PACK_B, 'g3', 'f2']]) {
      const self = { DAEVA_PACK: id };
      for (const p of all.packs) runInNewContext(classChunk(all, p), { self });
      const page = JSON.stringify({ shared: sharedOf(id), cls: self.DAEVA_CLASS });
      assert.ok(self.DAEVA_CLASS && page.includes(`"${own}:0"`) && !new RegExp(`"${other}[:"]`).test(page), `${id}: ${page.slice(0, 200)}`);
    }
  });
  if (!FAKE_B) return;
  runChain(test, `conformance [${FAKE_PACK_B}]`, FAKE_B.E);
  test(`${C} 6: each class's engine runs on its own steps only`, () => {
    const keys = E => Object.keys(E.activePack().data.graph.nodes).join(' ');
    assert.ok(/\bf2:0\b/.test(keys(FAKE.E)) && !/\bg3:/.test(keys(FAKE.E)), keys(FAKE.E));
    assert.ok(/\bg3:0\b/.test(keys(FAKE_B.E)) && !/\bf2:/.test(keys(FAKE_B.E)), keys(FAKE_B.E));
    assert.deepEqual(FAKE_B.E.activePack().data.graph, all.tables[FAKE_PACK_B].GATE_GRAPH);
  });
};
