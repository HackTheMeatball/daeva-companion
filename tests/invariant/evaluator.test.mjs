/* Invariants 4, 5, 6 and 10 (0.3 E3, docs/design/0.3-requirement-engine.md §12), suite `invariant`: the evaluator
   against the oracle and the track nesting, over the same states as next-up.test.mjs (its header lists the invariants).
   Split out of next-up.test.mjs so the two halves run side by side (tests/invariant.mjs runs every file but the first in
   a child process); this half shares no state with the other. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import { pinnedNodes } from './next-up.test.mjs';

const { fnv } = createRequire(import.meta.url)('../golden/states.js');

const sig = bs => bs.map(b => b.kind === 'level' ? `level ${b.need}` : b.kind === 'story' ? `story ${b.quest} ahead ${b.ahead}` : b.kind === 'skill' ? `skill ${b.skill} ${b.need} have ${b.have}` : `done ${b.of}`).sort().join(' · ');

export default (test, M, X) => {
  const { states, O, OA, APP_APPLY } = X;
  /* the app's evaluator options and the oracle that judges them (E4: derived, the wrapper proposals, the follow-up rule) */
  const APP = { derived: true, followUps: true };
  const N = M.GATE_GRAPH.nodes;
  /* 0.9 P12: the oracle's nodes the app lacks, pinned per class in next-up.test.mjs KNOWN_NODES (checked there) */
  const PIN = pinnedNodes(X.cls);
  const loaded = [];

  test(`${states.length} states loaded, migrated and deep-frozen`, () => {
    assert.equal(states.length, X.TOTAL);
    loaded.push(...X.loaded());
    assert.equal(loaded.length, states.length);
  });

  /* Invariant 10 (design §11, 0.5 P14): tracks nest. In a hashed share of the states (30 % of the behind family, 6 % of
     the rest: the suite's 60 s hang guard; Advanced and Basic as stored): every card fastest
     shows, completionist shows too, and with today's labels (the pack's routes) fastest is exactly the ranking with
     trackFilter and bandLabels off, and completionist adds only optional ("adv") steps. Then with labels seeded (every
     third regional quest, Sealed Dungeon and stronghold "filler", on 30 % of the behind family and 3 % of the rest), the nesting still
     holds, the seeding drops something in some state, and fastest outside a story level gate keeps no card whose
     candidates are all filler. */
  const keyOf10 = a => a.kind + ' ' + (a.x ? a.x.k : a.pick ? a.pick.k : a.act);
  test('10. tracks nest: fastest ⊆ completionist; with today\'s labels fastest = switches off and completionist adds only optional steps', () => {
    const OFF = [...Object.keys(M.RANK_CHANGES), ...Object.keys(M.AION2_RANK_CHANGES)].filter(n => !['trackFilter', 'bandLabels'].includes(n) && M.rankChangeOn(n, n in M.RANK_CHANGES ? M.RANK_CHANGES : M.AION2_RANK_CHANGES));
    const strip = cs => JSON.stringify(cs.map(({ lvBand, ...a }) => a));
    const notNested = [], notSame = [], notAdv = [], seededBad = [];
    let extra = 0, seededDrops = 0, seeded = 0;
    const nestCheck = (id, s, basic, out) => {
      const f = M.rankNext(s, { basic, track: 'fastest' }), co = M.rankNext(s, { basic, track: 'completionist' });
      const have = new Set(co.map(keyOf10)), miss = f.filter(a => !have.has(keyOf10(a)));
      if (miss.length) out.push(`${id}: ${miss.map(keyOf10).join(', ')}`);
      return { f, co };
    };
    let today = 0;
    for (const { id, s } of loaded) {
      if (fnv('tracks-today|' + id) >= (id.startsWith('golden/behind/') ? 0.3 : 0.06)) continue;
      today++;
      const basic = s.mode === 'basic', { f, co } = nestCheck(id, s, basic, notNested);
      let off; try { M.setRankChanges(OFF); off = M.rankNext(s, { basic }); } finally { M.setRankChanges(null); }
      if (strip(f) !== strip(off)) notSame.push(id);
      const fk = new Set(f.map(keyOf10)), add = co.filter(a => !fk.has(keyOf10(a)));
      if (add.some(a => a.kind !== 'adv')) notAdv.push(`${id}: ${add.map(keyOf10).join(', ')}`);
      if (add.length) extra++;
    }
    const kinds3 = new Set(['rq', 'sd', 'sh']), filler = new Set(Object.values(M.GATE_GRAPH.nodes).filter(n => kinds3.has(n.kind) && n.key !== undefined).map(n => n.key).filter((k, i) => i % 3 === 0));
    try {
      M.setRouteOf(k => filler.has(k) ? 'filler' : 'core');
      for (const { id, s, c } of loaded) {
        if (fnv('tracks|' + id) >= (id.startsWith('golden/behind/') ? 0.3 : 0.03)) continue;
        seeded++;
        const basic = s.mode === 'basic', { f, co } = nestCheck(id, s, basic, notNested);
        if (f.length < co.length) seededDrops++;
        if (M.storyRecGate(c).gated) continue;
        for (const a of f) {
          const ks = a.kind === 'rq' ? a.open.map(x => x.k) : a.kind === 'sd' || a.kind === 'sh' ? [] : a.x ? [a.x.k] : [];
          if (ks.length && ks.every(k => filler.has(k))) seededBad.push(`${id}: ${keyOf10(a)}`);
        }
      }
    } finally { M.setRouteOf(null); }
    assert.deepEqual(notNested.slice(0, 5), [], `${notNested.length} states where a fastest card is missing from completionist`);
    assert.deepEqual(notSame.slice(0, 5), [], `${notSame.length} states where fastest (today's labels) differs from trackFilter and bandLabels off`);
    assert.deepEqual(notAdv.slice(0, 5), [], `${notAdv.length} states where completionist adds a card that isn't an optional step`);
    assert.deepEqual(seededBad.slice(0, 5), [], `${seededBad.length} seeded states where fastest keeps an all-filler card`);
    if (X.only) return;
    assert.ok(extra > 0, 'completionist adds nothing in any state: the check compares nothing');
    assert.ok(seededDrops > 0, 'seeded filler labels drop nothing: the filter is not exercised');
    console.log(`     invariant 10: ${today} states nest, fastest = switches off; completionist adds optional steps in ${extra}; seeded labels drop cards in ${seededDrops} of ${seeded}`);
  });

  /* Next up runs on every state. The rest is split for time: evaluator vs oracle on every targeted state plus the half of
     the golden and random ones whose id hashes low, monotonic on the other half plus every targeted state (a hash of the
     id, not the position, so the split can't alias with the generator's loops). Derived on (alone, and as the app runs
     since E4: with its proposals and the follow-up rule): every targeted state and a hashed quarter of the rest. */
  const targeted = ({ id }) => id.startsWith('target/'), low = ({ id }) => fnv('invariant-split|' + id) < 0.5;
  const cmpList = loaded.filter(x => targeted(x) || low(x)), monoList = loaded.filter(x => targeted(x) || !low(x));
  const withDerived = id => id.startsWith('target/') || fnv('invariant-derived|' + id) < 0.25;
  /* modes: derived off; on; on with the app's proposals and the follow-up rule (E4) */
  const MODES = [{ derived: false }, { derived: true }, { derived: true, app: true }];
  const compare = (graph, list) => {
    const diffs = new Map(), bad = (k, id, d) => { const x = diffs.get(k) || { n: 0, ex: `${id} (${d})` }; x.n++; diffs.set(k, x); };
    const ids = O.ids.filter(n => !PIN.has(n));
    list.forEach(({ id, c }) => { for (const mode of withDerived(id) ? MODES : MODES.slice(0, 1)) {
      const { derived } = mode, tag = mode.app ? 'app' : derived;
      const ev = M.evaluate(c, { derived, ...(mode.app ? { apply: APP_APPLY, followUps: true } : {}), ...(graph ? { graph } : {}) });
      const o = (mode.app ? OA : O).at(c, { derived, followUps: !!mode.app });
      for (const n of ids) {
        const e = ev.node(n), r = o.node(n);
        if (e.open !== r.open) bad(`${n} open (derived ${tag}): oracle ${r.open} / evaluator ${e.open}`, id, sig(r.blockers));
        if (e.done !== r.done) bad(`${n} done (derived ${tag}): oracle ${r.done} / evaluator ${e.done}`, id, '');
        if ((e.blockers.length || r.blockers.length) && sig(e.blockers) !== sig(r.blockers)) bad(`${n} blockers (derived ${tag})`, id, `oracle ${sig(r.blockers)} / evaluator ${sig(e.blockers)}`);
        if (e.blockers.some(b => b.kind === 'level' && b.need <= c.level)) bad(`${n} level blocker with the level met`, id, sig(e.blockers));
      }
    } });
    return diffs;
  };

  test(`5. evaluator = oracle on every node (open, done, blockers) of ${cmpList.length} states (derived off; on, and on with the app's proposals and follow-ups, for ${cmpList.filter(x => withDerived(x.id)).length})`, () => {
    const inCmp = new Set(cmpList);
    if (!X.only) assert.ok(loaded.filter(targeted).every(x => inCmp.has(x)) && cmpList.length > loaded.length / 2, 'the compared set');
    const diffs = compare(null, cmpList);
    assert.deepEqual([...diffs].slice(0, 12).map(([k, x]) => `${k} · ${x.n}×, e.g. ${x.ex}`), [], `${diffs.size} differences`);
  });

  /* E6 (design §4, §12 row 5): the blocker text the cards show (src/core/blockers.js, on the page's own evaluator) never names
     something already done, and its "N quests ahead" is the oracle's distance; every milestone's "Reach / Turn in" line
     the same. Judged by the oracle as the app runs (OA, derived on, follow-ups), on the states compared with derivation on. */
  test('5. blocker text (E6) never names a done node, and its distance is the oracle\'s (every node, every milestone line)', () => {
    const bad = new Map(), note5 = (k, id, d) => { const x = bad.get(k) || { n: 0, ex: `${id} (${d})` }; x.n++; bad.set(k, x); };
    const storyNode = new Map(O.chain.map(([sid, n]) => [n, sid])), list = cmpList.filter(x => withDerived(x.id));
    let texts = 0, lines = 0;
    for (const { id, c } of list) {
      const ev = M.gatesOf(c), o = OA.at(c, APP);
      for (const n of O.ids) {
        if (PIN.has(n)) continue;
        const e = ev.node(n), ch = M.blockerChain(e, ev); if (!ch) continue;
        texts++;
        for (const x of ch.names) if (o.node(x).done) note5(`${n} names done ${x}`, id, ch.text);
        const lf = ch.leaf;
        if (lf && lf.kind === 'story') {
          const ob = (function find(bs) { for (const b of bs) { if (b.kind === 'story' && b.quest === lf.quest) return b; if (b.kind === 'done') { const r = find(o.node(b.of).blockers); if (r) return r; } } return null; })(o.node(n).blockers);
          if (!ob) note5(`${n} story leaf ${lf.quest} not an oracle blocker`, id, ch.text);
          else if (ob.ahead !== lf.ahead) note5(`${n} ahead`, id, `oracle ${ob.ahead} / text ${ch.text}`);
        }
        if (lf && lf.kind === 'level' && lf.need <= c.level) note5(`${n} level text with the level met`, id, ch.text);
      }
      for (const g of M.GATES) {
        const L = M.storyLineOf(c, g, ev); if (!L || L.ok) continue;
        lines++;
        const sid = storyNode.get(L.q), r = o.node(sid), pos = c.quest ? O.chain.findIndex(([, q]) => q === c.quest) : -1, i = O.chain.findIndex(([x]) => x === sid);
        if (L.turnIn ? r.done : pos >= i) note5(`${g.id} line names "${L.q}" done`, id, L.chip);
        if (pos >= 0 && L.ahead !== i - pos + (L.turnIn ? 1 : 0)) note5(`${g.id} line ahead`, id, `${L.ahead} vs ${i - pos}`);
      }
    }
    assert.ok(X.only || (texts > 10000 * X.scale && lines > 1000 * X.scale), `checked ${texts} texts, ${lines} lines`);
    assert.deepEqual([...bad].slice(0, 12).map(([k, x]) => `${k} · ${x.n}×, e.g. ${x.ex}`), [], `${bad.size} differences (${texts} texts, ${lines} lines in ${list.length} states)`);
  });

  /* the oracle can fail: three seeded evaluator bugs (a compiled gate changed behind the oracle's back) must each show up */
  test('5. the oracle catches seeded evaluator bugs (story "turnedIn" → "reached", level + 1, a dropped done atom)', () => {
    if (X.only) return;   /* --state: too few states to hit every seeded bug */
    const g = JSON.parse(JSON.stringify(M.GATE_GRAPH)), atoms = r => r.all ? r.all.flatMap(atoms) : r.any ? r.any.flatMap(atoms) : [r];
    const pickNode = (kind, f) => Object.keys(g.nodes).find(n => g.nodes[n].kind === kind && atoms(g.nodes[n].req).some(f));
    const rqStory = pickNode('rq', a => a.story && a.is === 'turnedIn'), stepLv = pickNode('step', a => a.level !== undefined), rqDone = pickNode('rq', a => a.done);
    atoms(g.nodes[rqStory].req).find(a => a.story).is = 'reached';
    atoms(g.nodes[stepLv].req).find(a => a.level !== undefined).level++;
    /* the dropped done atoms the follow-up rule reads (app mode): the quests they name lose that proof too */
    const cascade = g.nodes[rqDone].req.all.filter(a => a.done && g.nodes[a.done].kind === 'rq' && ['sourced', 'owner'].includes(a.basis)).map(a => a.done);
    g.nodes[rqDone].req = { all: g.nodes[rqDone].req.all.filter(a => !a.done) };
    const hit = new Set([...compare(g, loaded.filter((_, i) => i % 20 === 1)).keys()].map(k => k.split(' ')[0]));
    const want = [rqStory, stepLv, rqDone];
    assert.deepEqual(want.filter(n => !hit.has(n)), [], `each seeded bug shows up (hit: ${[...hit].join(' ')})`);
    assert.deepEqual([...hit].filter(n => !want.includes(n) && !cascade.includes(n)), [], `nothing else differs (hit: ${[...hit].join(' ')})`);
  });

  /* one step per state (level or story, picked by a hash of the id; the other when that one can't move), judged twice:
     by the app's gates and by the oracle, so a bug the evaluator shares with the compiler can't pass */
  test(`4. monotonic: one level up or one story quest on never closes an open node (the app's gates and the oracle; ${monoList.length} states)`, () => {
    const diffs = new Map(), bad = (k, id) => { const x = diffs.get(k) || { n: 0, ex: id }; x.n++; diffs.set(k, x); };
    const NQ = O.chain.length, moved = { 'level +1': 0, 'story +1': 0 };
    monoList.forEach(({ id, c }) => {
      const ev = M.gatesOf(c), open = ev.list(r => r.open).map(r => r.id), pos = c.quest ? O.chain.findIndex(([, n]) => n === c.quest) : -1;
      const o = OA.at(c, APP), openO = O.ids.filter(n => o.node(n).open);
      const can = [];
      if (c.level < 45) can.push(['level +1', { ...c, level: c.level + 1 }]);
      if (pos >= 0 && pos + 1 < NQ) { const { storyEnd, ...rest } = c; can.push(['story +1', { ...rest, quest: O.chain[pos + 1][1] }]); }
      const next = can.length < 2 ? can : [can[fnv('invariant-step|' + id) < 0.5 ? 0 : 1]];
      next.forEach(([what]) => moved[what]++);
      for (const [what, c2] of next) {
        const ev2 = M.gatesOf(c2), o2 = OA.at(c2, APP);
        for (const n of open) { const r = ev2.node(n); if (!r.open && r.done === false) bad(`${what} closes ${n} (app)`, id); }
        for (const n of openO) { const r = o2.node(n); if (!r.open && !r.done) bad(`${what} closes ${n} (oracle)`, id); }
      }
    });
    if (!X.only) assert.ok(moved['level +1'] > monoList.length / 3 && moved['story +1'] > monoList.length / 3, JSON.stringify(moved));
    assert.deepEqual([...diffs].slice(0, 12).map(([k, x]) => `${k} · ${x.n}×, e.g. ${x.ex}`), [], `${diffs.size} differences`);
  });

  test('6. evaluate() leaves a deep-frozen character as it was', () => {
    for (const { c } of loaded.filter((_, i) => i % 50 === 0)) { const before = JSON.stringify(c); M.evaluate(c, { derived: true, apply: APP_APPLY, followUps: true }).list(); M.gatesOf(c).list(); assert.equal(JSON.stringify(c), before); }
  });
};
