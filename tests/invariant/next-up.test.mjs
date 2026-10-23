/* Invariants (0.3 E3, docs/design/0.3-requirement-engine.md §12), suite `invariant`. Over the 10,750 states of
   tests/invariant/states.mjs, loaded and migrated as the page does, with an independent oracle (tests/support/oracle.mjs:
   the raw v2 data, not GATE_GRAPH and not the evaluator) as the judge:

   1. Next up never offers (a card with an action) a node the oracle says is blocked, judged as the app runs since E4:
      derived completion on, the wrapper completions g22:0 / g32:dreams (live data), the follow-up rule on (oracle OA). Rows
      the player has already started (a regional quest picked up, a dungeon entered) are judged on 2 only: the player's
      own record says the game let them in.
   2. Next up never offers a node that is done, ticked or derived (the same oracle: every completesWith entry, the
      wrapper proposals and the follow-up rule).
   3. A met Ascension step is the first step card (DATA-FORMAT-V2 §10; 0.4 design invariant 9). Pending through 0.3
      (counted only); enforced since 0.5 P12 built it (ascensionFirst). Its own test also fails if its ids go missing or
      if it counts nothing.
   4. Monotonic: raising the level by one or moving the story on by one never closes an open node except by making it
      done, judged by the app's evaluator and by the oracle (every targeted state and a hashed half of the rest).
   5. The evaluator (GATE_GRAPH, derived off, on, and on with the app's proposals and follow-ups) agrees with the oracle on every node: open, done, and the blockers
      (level needed, story quest and `ahead`, the `done` atom); a level blocker never shows with the level met (every
      targeted state and the other hashed half; and the oracle must catch three bugs seeded into a copy of the graph).
   6. Nothing is written: rankNext and evaluate run on a deep-frozen save and character.
   cap (0.5 P13): at most 8 cards besides the story and the kept side cards; catch-up never drops one of those or a step.

   A disagreement between the app and the oracle is never fixed by changing the app or weakening the oracle: it is
   pinned in KNOWN with its cause and the exact states that hit it. The test fails on a disagreement not in KNOWN and
   on a KNOWN one whose states differ. Table of every disagreement: tests/out/invariant.md. */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const { fnv } = createRequire(import.meta.url)('../golden/states.js');

/* disagreement key → { cause, states }. Key: "<invariant> <card> <node id> [<what blocks it, or how it is done>]".
   states: exactly the state ids that hit it (sorted); a state more or less fails, so a new case can't hide under the key. */
/* (E3 pinned "blocked story sq:2102800 [level]" here: "Turned in" on Forgotten Commander at Lv 44 with every objective
   ticked. E4 fixes it: the turn-in waits for the quest's unlock level, turnInNeedsLv; core nextup.test.mjs pins it.) */
export const KNOWN = {};
/* 0.9 P12: nodes the oracle builds that GATE_GRAPH lacks, per class (exactly these; one more or fewer fails). The Chanter's
   build picks specialties for two non-core skills: the oracle gives every non-passive skill with a pick its 3 slots,
   tools/gen/gen.mjs only core skills. Found by P12 (#633), reported for its own fix there; the evaluator file skips these
   nodes (the app has none to compare). */
export const KNOWN_NODES = {
  chanter: { cause: 'gen: specialty slots only for core skills; oracle: every skill with a pick (Impactful Crush, Tremor Crush)',
    nodes: ['sp:impactful-crush:spec', 'sp:impactful-crush:spec2', 'sp:impactful-crush:spec3', 'sp:tremor-crush:spec', 'sp:tremor-crush:spec2', 'sp:tremor-crush:spec3'] },
};
export const pinnedNodes = cls => new Set((KNOWN_NODES[cls] || {}).nodes || []);
/* invariant 3's Ascension steps (step nodes; the test fails unless all three exist, so a rename can't empty it) */
const ASC_IDS = ['g22:0', 'g32:dreams', 'g45:witness'];

const deepFreeze = o => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };
const sig = bs => bs.map(b => b.kind === 'level' ? `level ${b.need}` : b.kind === 'story' ? `story ${b.quest} ahead ${b.ahead}` : b.kind === 'skill' ? `skill ${b.skill} ${b.need} have ${b.have}` : `done ${b.of}`).sort().join(' · ');
const kinds = bs => [...new Set(bs.map(b => b.kind === 'done' ? 'done ' + b.of : b.kind))].sort().join(', ');
/* the cards rankNext can return; the ones that carry no node (Cube items, stigma upgrade, "set your quest") or no action */
const NO_NODE = new Set(['cube', 'stup']), NO_ACT = new Set(['stwait', 'laterSkill', 'laterStep']);

export default (test, M, X) => {
  const { states, O, OA, APP_APPLY, root } = X;
  /* the app's evaluator options and the oracle that judges them (E4: derived, the wrapper proposals, the follow-up rule) */
  const APP = { derived: true, followUps: true };
  const N = M.GATE_GRAPH.nodes, storyId = new Map(O.chain.map(([id, n]) => [n, id]));
  const loaded = [];
  const found = new Map();   /* disagreement key → { n, ex, ids } */
  const note = (key, id, detail) => { const x = found.get(key) || { n: 0, ex: `${id}${detail ? ' (' + detail + ')' : ''}`, ids: new Set() }; x.n++; x.ids.add(id); found.set(key, x); };
  let ascFirst = { met: 0, notFirst: 0 };
  /* rankNext as the page ships, per state id (test 1 fills it; the cap test reads it) */
  const shipped = new Map();
  const ASC = ASC_IDS.filter(n => N[n] && N[n].kind === 'step' && O.ids.includes(n));

  test('oracle: the same nodes and story chain as GATE_GRAPH (built independently from data/**)', () => {
    const pin = pinnedNodes(X.cls);
    assert.deepEqual(O.ids.filter(n => !N[n]).sort(), [...pin].sort(), `the oracle's nodes GATE_GRAPH lacks (pinned: KNOWN_NODES.${X.cls || 'assassin'})`);
    assert.deepEqual(O.ids.filter(n => !pin.has(n)).sort(), Object.keys(N).sort());
    assert.deepEqual(O.chain, M.GATE_GRAPH.story);
    /* tests/invariant.mjs counts these lines: one per class (0.9 P12) */
    console.log(`     chain: ${X.cls || 'assassin'} · ${O.chain.length} story quests · ${O.ids.length} nodes`);
  });

  test(`${states.length} states loaded, migrated and deep-frozen`, () => {
    assert.equal(states.length, X.TOTAL);
    /* loaded once for every invariant file (tests/invariant.mjs X.loaded) */
    loaded.push(...X.loaded());
    assert.equal(loaded.length, states.length);
    assert.ok(loaded.every(x => Object.isFrozen(x.s) && Object.isFrozen(x.c)), 'deep-frozen');
  });

  /* which nodes a card offers: [{ card, id, started }] (id null: a save key the oracle doesn't know) */
  const offersOf = (cards, c) => {
    const out = [], k2 = (card, k, started = false) => out.push({ card, k, id: O.idOfKey(k), started });
    for (const a of cards) {
      if (!a.act || NO_NODE.has(a.kind)) continue;
      switch (a.kind) {
        case 'run': k2('run', a.x.k, true); break;
        case 'skill': k2('skill', a.x.k); break;
        /* a catch-up jump (0.9 P19) ticks its keys in order: the first must be open now; the rest open as the ones
           before them are ticked (each line on the one before, a specialty slot on the skill level the lines reach),
           so they are judged as not done only */
        case 'catchup': k2('catchup', a.x.k); a.j.keys.filter(k => k !== a.x.k).forEach(k => k2('catchup', k, true)); break;
        case 'board': case 'boardcost': k2(a.kind, a.dn.k); break;
        case 'stequip': k2('stequip', a.nx.k); break;
        case 'step': case 'missed': case 'adv': k2(a.kind, a.x.k); break;
        case 'sd': case 'sh': k2(a.kind, a.pick.k); break;
        /* the rows you can pick up or turn in (a locked follow-up's box is disabled; "waiting on the story" rows only
           offer "In my game", the player's override) */
        case 'rq': a.open.filter(x => !x.lock).forEach(x => k2('rq', x.k, x.run)); break;
        case 'story': if (a.act === 'story') out.push({ card: 'story', k: a.quest, id: storyId.get(a.quest) ?? null, started: false }); break;
        default: if (!NO_ACT.has(a.kind)) out.push({ card: a.kind, k: '?', id: null, unmapped: true });
      }
    }
    return out;
  };

  test('1, 2, 6. Next up never offers a blocked or a done node (rankNext on the frozen save)', () => {
    found.clear();
    const errors = [];
    for (const { id, s, c } of loaded) {
      let cards;
      try { cards = M.rankNext(s); }
      catch (e) { errors.push(`${id}: rankNext threw on a frozen save: ${e.message}`); continue; }
      shipped.set(id, cards);
      const o0 = OA.at(c, APP), o1 = o0;
      for (const x of offersOf(cards, c)) {
        if (x.unmapped) { errors.push(`${id}: card kind "${x.card}" has an action but no node mapping in this test`); continue; }
        if (!x.id) { errors.push(`${id}: ${x.card} offers ${x.k}, a key the data doesn't have`); continue; }
        const a = o0.node(x.id), b = o1.node(x.id);
        if (!x.started && !a.open) note(`blocked ${x.card} ${x.id} [${kinds(a.blockers)}]`, id, sig(a.blockers));
        if (b.done) note(`done ${x.card} ${x.id} [${b.done}]`, id, b.done === 'tick' ? 'ticked' : 'derived from the story, a wrapper or a follow-up');
      }
      /* invariant 3: a met, unfinished Ascension step and the first step card */
      const asc = ASC.filter(n => o0.node(n).open && !o1.node(n).done);
      if (asc.length) { ascFirst.met++; const f = cards.find(a => ['step', 'missed'].includes(a.kind)); if (!f || !asc.includes(f.x.k)) { ascFirst.notFirst++; ascFirst.ex = ascFirst.ex || `${id} (first step card: ${f ? f.x.k : 'none'})`; } }
    }
    assert.deepEqual(errors.slice(0, 10), [], `${errors.length} errors`);
    report('Next up offers', found);
  });

  /* Invariant 3 (0.4 design invariant 9): the Ascension-first ranking (owner rule, DATA-FORMAT-V2 §10), pending (counted
     only) through 0.3, enforced since 0.5 P12 turned ascensionFirst on (src/core/nextup.js; the pack's ascension producer).
     Judged on rankNext as the page ships, every state. */
  test('3 / 9. a met, unfinished Ascension step is the first step card in every state (ascensionFirst; DATA-FORMAT-V2 §10)', () => {
    assert.deepEqual(ASC, ASC_IDS, `the Ascension step nodes ${ASC_IDS.join(', ')} (a renamed id empties invariant 3)`);
    assert.equal(ascFirst.notFirst, 0, `in ${ascFirst.notFirst} of ${ascFirst.met} states a met Ascension step is not the first step card, e.g. ${ascFirst.ex}`);
    if (X.only) return;
    assert.ok(ascFirst.met > 0, 'no state has a met, unfinished Ascension step: invariant 3 counts nothing');
    console.log(`     invariant 3 / 9: a met, unfinished Ascension step is the first step card in all ${ascFirst.met} states that have one`);
  });

  /* The 8-card cap and the kept cards (0.2 P3; 0.5 P13 lifts the queues when you are behind): as the page ships, at most
     8 cards besides the story and the pack's kept side cards, in every state. Catch-up (catchUp) only adds: with it off,
     every kept card, the story and every step or missed card shown is still shown with it on (the behind family and a
     hashed twentieth of the rest; the suite's 60 s hang guard). The shipped rankings are test 1's. */
  const KEPT = new Set(['rq', 'sd', 'sh', 'stwait']), keyOf = a => a.kind + ' ' + (a.x ? a.x.k : a.act);
  test('cap: at most 8 cards besides the story and the kept cards in every state; catch-up never drops a kept card, the story, a step or a missed card', () => {
    const over = [], lost = [], OFF = [...Object.keys(M.RANK_CHANGES), ...Object.keys(M.AION2_RANK_CHANGES)].filter(n => n !== 'catchUp' && M.rankChangeOn(n, n in M.RANK_CHANGES ? M.RANK_CHANGES : M.AION2_RANK_CHANGES));
    let compared = 0, lifted = 0;
    for (const { id, s } of loaded) {
      const basic = s.mode === 'basic', on = shipped.get(id);
      if (!on) { over.push(`${id}: no ranking from test 1`); continue; }
      if (on.filter(a => !a.story && !KEPT.has(a.kind)).length > 8) over.push(id);
      if (!id.startsWith('golden/behind/') && fnv('cap|' + id) >= 0.05) continue;
      compared++;
      let off; try { M.setRankChanges(OFF); off = M.rankNext(s, { basic }); } finally { M.setRankChanges(null); }
      const have = new Set(on.map(keyOf)), miss = off.filter(a => (a.story || KEPT.has(a.kind) || a.kind === 'step' || a.kind === 'missed') && !have.has(keyOf(a)));
      if (miss.length) lost.push(`${id}: ${miss.map(keyOf).join(', ')}`);
      if (on.length !== off.length || on.some((a, i) => keyOf(a) !== keyOf(off[i]))) lifted++;
    }
    assert.deepEqual(over.slice(0, 5), [], `${over.length} states over the cap`);
    assert.deepEqual(lost.slice(0, 5), [], `${lost.length} states lose a card to catch-up`);
    if (X.only) return;
    assert.ok(lifted > 0, 'catch-up changes no state: the check compares nothing');
    console.log(`     cap: ${loaded.length} states; catch-up compared on ${compared}, changes ${lifted}`);
  });

  /* the disagreements, against KNOWN */
  function report(what, m) {
    const rows = [...m].sort(([a], [b]) => a < b ? -1 : 1);
    const md = [`# Invariant suite: ${what} vs the oracle`, '', `Generated by tests/invariant.mjs (seed ${X.seedHex}, ${states.length} states). Not committed.`, '',
      `Invariant 3 (enforced since 0.5 P12): ${ascFirst.met} states with a met, unfinished Ascension step; in ${ascFirst.notFirst} it is not the first step card.`, '',
      '| Disagreement | States | Example | Cause (KNOWN) |', '|---|---|---|---|',
      ...rows.map(([k, x]) => `| ${k} | ${x.n} (${[...x.ids].sort().join(', ').slice(0, 200)}) | ${x.ex.replace(/\|/g, '/')} | ${KNOWN[k] ? KNOWN[k].cause : '**not in KNOWN**'} |`)].join('\n');
    mkdirSync(join(root, 'tests/out'), { recursive: true });
    const file = `tests/out/invariant${X.cls ? '-' + X.cls : ''}.md`;
    writeFileSync(join(root, file), md + '\n');
    console.log(`     ${rows.length} disagreement kinds (${file})`);
    const unknown = rows.filter(([k]) => !KNOWN[k]).map(([k, x]) => `${k} · ${x.n} states, e.g. ${x.ex}`);
    assert.deepEqual(unknown, [], 'disagreements not in KNOWN');
    /* every KNOWN key is hit by exactly its pinned states (with --state: the pinned ones that were run) */
    const ran = new Set(loaded.map(x => x.id));
    const off = Object.entries(KNOWN).map(([k, { states: want }]) => {
      const exp = want.filter(s => !X.only || ran.has(s)).sort(), got = m.has(k) ? [...m.get(k).ids].sort() : [];
      return exp.join() === got.join() ? null : `${k}: pinned states [${exp.join(', ')}], hit by [${got.slice(0, 10).join(', ')}${got.length > 10 ? ', …' : ''}] (${got.length})`;
    }).filter(Boolean);
    assert.deepEqual(off, [], 'KNOWN entries whose states differ (a new state under a pinned key, or a pinned one no longer hit)');
  }
};
