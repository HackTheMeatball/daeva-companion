/* Save v6 keys (0.9 P2): progress is stored by stable ids, never by a name or a position. On a copy of the data (an
   in-memory view, nothing written) with a story quest renamed, an objective inserted mid-list with a new i and a skill
   renamed, a save's progress reads back identical: the same quest, the same objectives and sub-steps ticked, the same
   skill lines. */
import assert from 'node:assert/strict';
import { generate } from '../../tools/gen/gen.mjs';

const STORY = 'data/packs/aion2/asmodian/story-quests.json', SKILLS = 'data/packs/aion2/classes/assassin/skills.json';

export default (test, M) => {
  /* a quest with an objective that has sub-steps and at least one objective after it */
  const subsOf = t => M.aion2Pack.story.subs(t);
  const K = M.QUESTS.map(q => q[1]).find(k => { const L = M.QUEST_STEPS[k] || []; return L.length >= 4 && L.slice(0, -2).some(t => subsOf(t).length >= 2); });
  const L0 = M.QUEST_STEPS[K], P = L0.findIndex(t => subsOf(t).length >= 2);
  /* the save: the sub-step objective's first sub-step, and the objectives before and after it */
  const save = () => ({ checks: { 'sp:heart-gore:3': true }, level: 30, quest: K, qsteps: { [K]: [0, P + 1] }, qsub: { [K]: { [P]: [0] } } });
  const NEW_NAME = M.QUEST_NAME[K] + ' (renamed)', NEW_TEXT = 'Inserted objective — talk to the new NPC';

  let C = null;
  const copy = () => C || (C = generate({ mutate: (rel, d) => {
    if (rel === STORY) { const r = d.records.find(x => x.id === K); r.name = NEW_NAME;
      r.steps.splice(1, 0, { i: Math.max(...r.steps.map(s => s.i)) + 1, text: NEW_TEXT }); }
    if (rel === SKILLS) d.records.find(x => x.id === 'skill:assassin:heart-gore').name = 'Heart Gore (renamed)';
  } }));
  /* the page's story reading the copy's tables (the live pack otherwise) */
  const under = (f) => { const c = copy(), T = c.constants;
    const p = M.definePack({ ...M.aion2Pack, data: { ...M.aion2Pack.data, story: { quests: T.QUESTS, names: T.QUEST_NAME, steps: T.QUEST_STEPS, notes: T.QUEST_STEP_NOTES, ids: T.QUEST_STEP_I, subIds: T.QUEST_SUB_I } } });
    M.usePack(p); try { return f(T); } finally { M.usePack(M.aion2Pack); } };
  const ticked = (c, steps) => M.objDoneOf(c, K).map(p => steps[K][p]).sort();
  const subTicked = (c, steps) => M.subDoneOf(c, K, steps[K].indexOf(L0[P])).map(j => subsOf(L0[P])[j]);

  test('save keys: a renamed story quest and an objective inserted mid-list with a new i leave the save\'s progress identical', () => {
    const c = save(), before = { q: M.questIdx(c) >= 0, done: ticked(c, M.QUEST_STEPS), sub: subTicked(c, M.QUEST_STEPS) };
    assert.equal(copy().failed.length, 0, JSON.stringify(copy().failed.map(x => x.check)));
    under(T => {
      assert.equal(M.questNameOf(K), NEW_NAME);
      assert.equal(T.QUEST_STEPS[K][1], NEW_TEXT);
      assert.equal(M.questIdx(c) >= 0, before.q);
      assert.deepEqual(ticked(c, T.QUEST_STEPS), before.done);
      assert.deepEqual(subTicked(c, T.QUEST_STEPS), before.sub);
      assert.ok(!M.objDoneOf(c, K).includes(1), 'the inserted objective starts unticked');
      /* writing the same ticks back leaves the stored indices as they were */
      const c2 = save(); M.setObjDone(c2, K, M.objDoneOf(c2, K)); M.setSubDone(c2, K, T.QUEST_STEPS[K].indexOf(L0[P]), [0]);
      assert.deepEqual([c2.qsteps[K].slice().sort(), c2.qsub[K]], [save().qsteps[K].slice().sort(), save().qsub[K]]);
    });
  });
  test('save keys: a renamed skill keeps its sp: ticks (sp:<key>:<L>, the key its id\'s last segment)', () => {
    const T = copy().constants, s = T.SP_SKILLS_CORE.find(x => x.key === 'heart-gore');
    assert.equal(s.n, 'Heart Gore (renamed)');
    assert.ok('sp:heart-gore:3' in copy().gateGraph.nodes && 'sp:heart-gore:3' in M.GATE_GRAPH.nodes);
    assert.ok(M.SP_STEPS.some(x => x.k === 'sp:heart-gore:3' && x.s.key === 'heart-gore'));
    assert.equal(save().checks[`sp:${s.key}:3`], true);
  });
};
