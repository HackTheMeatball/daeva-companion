/* Green "(+x)" on skill levels (0.6 P9, #268): skillBonusOf(c, name) is the sum of `adds` over the ticked plan board nodes on
   the skill (src/packs/aion2/requirements.js), 0 with none. Cases: no nodes → 0; two nodes on one skill → their sum; unticking
   removes it; another skill's node never counts. Live data: every Assassin board skill node has `skill` and `adds`, and every
   plan node on a skill board node is in the graph with them (else the PR lists it and the card shows nothing for it). */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tick = keys => Object.fromEntries(keys.map(k => [k, true]));
const BOARD = JSON.parse(readFileSync(new URL('../../data/packs/aion2/classes/assassin/board-nodes.json', import.meta.url), 'utf8')).records;

export default (test, M) => {
  const N = M.GATE_GRAPH.nodes;
  const planOf = name => Object.values(N).filter(n => n.kind === 'plan' && n.skill === N[`sp:${name}:2`].skill).map(n => n.key);
  const c = checks => ({ checks, level: 45 });

  test('no ticked nodes: no bonus, whatever lines are bought', () => {
    assert.equal(M.skillBonusOf(c({}), 'Heart Gore'), 0);
    assert.equal(M.skillBonusOf(c(tick(['sp:Heart Gore:2', 'sp:Heart Gore:3'])), 'Heart Gore'), 0, 'lines are the base level, not a bonus');
    assert.equal(M.skillBonusOf(c({}), 'No Such Skill'), 0, 'an unknown skill: 0, no throw');
  });

  test('two nodes on one skill: the sum of their adds; unticking one removes its share; another skill\'s node never counts', () => {
    const plan = planOf('Heart Gore'), adds = k => Object.values(N).find(n => n.key === k).adds;
    assert.ok(plan.length >= 2, `Heart Gore plan nodes: ${plan.length}`);
    const two = tick(plan.slice(0, 2));
    assert.equal(M.skillBonusOf(c(two), 'Heart Gore'), adds(plan[0]) + adds(plan[1]));
    assert.equal(M.skillBonusOf(c({ ...two, [plan[1]]: false }), 'Heart Gore'), adds(plan[0]), 'unticked (stored false)');
    const one = { ...two }; delete one[plan[0]]; delete one[plan[1]];
    assert.equal(M.skillBonusOf(c(one), 'Heart Gore'), 0, 'both unticked');
    const other = planOf('Quick Slice');
    assert.equal(M.skillBonusOf(c(tick([...plan.slice(0, 2), ...other])), 'Heart Gore'), adds(plan[0]) + adds(plan[1]));
    /* the bonus is the effective level less the base: lines to 6 + the two nodes */
    const lines = Array.from({ length: 5 }, (_, i) => `sp:Heart Gore:${i + 2}`), all = c(tick([...lines, ...plan.slice(0, 2)]));
    assert.equal(M.evaluate(all).skillLv(N['sp:Heart Gore:2'].skill), 6 + M.skillBonusOf(all, 'Heart Gore'));
  });

  test('hand-made graph: a plan node without adds counts nothing (no default)', () => {
    const SK = 'skill:t:k', G = { story: [['sq:0', 'Q0']], nodes: {
      'sp:K:2': { kind: 'skill', key: 'sp:K:2', skill: SK, L: 2, req: { level: 1, basis: 'rule' }, done: ['tick'] },
      'dv:a': { kind: 'plan', key: 'dv:a', skill: SK, adds: 1, req: { level: 1, basis: 'rule' }, done: ['tick'] },
      'dv:b': { kind: 'plan', key: 'dv:b', skill: SK, adds: 2, req: { level: 1, basis: 'rule' }, done: ['tick'] },
      'dv:n': { kind: 'plan', key: 'dv:n', skill: SK, req: { level: 1, basis: 'rule' }, done: ['tick'] },
    } };
    const pack = M.activePack(), was = pack.data.graph;
    pack.data.graph = G;
    try {
      assert.equal(M.skillBonusOf(c({}), 'K'), 0);
      assert.equal(M.skillBonusOf(c(tick(['dv:a', 'dv:b'])), 'K'), 3);
      assert.equal(M.skillBonusOf(c(tick(['dv:a', 'dv:b', 'dv:n'])), 'K'), 3);
      assert.equal(M.skillBonusOf(c(tick(['dv:b'])), 'K'), 2);
    } finally { pack.data.graph = was; }
  });

  test('live data: every Assassin skill node has skill + adds; every plan node on one is in the graph with them', () => {
    const skillNodes = BOARD.filter(r => r.type === 'skill'), missing = skillNodes.filter(r => !r.skill || typeof r.adds !== 'number');
    console.log(`info board skill nodes: ${skillNodes.length}, without skill / adds: ${missing.length}`);
    assert.deepEqual(missing.map(r => r.id), []);
    const byKey = new Map(skillNodes.map(r => [r.key, r])), plan = Object.values(N).filter(n => n.kind === 'plan' && byKey.has(n.key));
    console.log(`info plan nodes on skill board nodes: ${plan.length}`);
    assert.ok(plan.length > 0);
    assert.deepEqual(plan.filter(n => !n.skill || n.adds !== byKey.get(n.key).adds).map(n => n.key), []);
  });
};
