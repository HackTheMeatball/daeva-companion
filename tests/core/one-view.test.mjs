/* One view (0.9 P21, docs/design/0.9-one-view.md): no Basic / Advanced left in src/ (no body.basic rule, no basic or
   mode branch, no mode switch), and the save's `mode` field is no longer read: a save with mode "advanced", one with
   "basic" and one with none rank the same Next up. The browser half (folds remember, rail reachable) is in tests/e1test.js. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createRequire } from 'node:module';
const { toStored } = createRequire(import.meta.url)('../support/save.js');
const ROOT = join(import.meta.dirname, '..', '..'), SRC = join(ROOT, 'src');
const S = (o = {}) => toStored({ checks: {}, level: 5, hide: false, open: {}, quest: '', ...o });
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

/* what a leftover Basic / Advanced branch looks like in a script, a style sheet or the markup */
const BANNED = [
  [/body\.basic\b/, 'a body.basic rule'],
  [/classList\.(contains|toggle|add)\(\s*["']basic["']/, 'a body "basic" class check'],
  [/\bisBasic\b/, 'isBasic'],
  [/\bstate\.mode\b/, 'state.mode read'],
  [/\{\s*basic\b|\bbasic\s*:/, 'a basic option'],
  [/\bmodeseg\b|data-mode=/, 'the mode switch'],
];

export default (test, M) => {
  test('one view: no body.basic rule, basic / mode branch or mode switch left in src/', () => {
    const hits = [];
    for (const f of walk(SRC).filter(f => /\.(js|mjs|css|html)$/.test(f))) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        for (const [re, what] of BANNED) if (re.test(line)) hits.push(`${relative(ROOT, f)}:${i + 1} ${what}`);
      });
    }
    assert.deepEqual(hits, []);
  });
  test('one view: a save with mode "advanced", "basic" or none ranks the same Next up', () => {
    for (const lv of [1, 10, 22, 30, 39, 45]) {
      const quest = M.QUESTS.find(([l]) => l >= lv)?.[1] || '';
      const [a, b, none] = ['advanced', 'basic', undefined].map(mode => JSON.stringify(M.rankNext(S({ level: lv, quest, ...(mode ? { mode } : {}) }))));
      assert.equal(a, none, `Lv ${lv}: advanced vs none`); assert.equal(b, none, `Lv ${lv}: basic vs none`);
    }
  });
  test('one view: the cards to act on now lead; Later, advice and queued cards follow in the fold (fold: true)', () => {
    for (const lv of [10, 20, 30, 40, 45]) {
      const cs = M.rankNext(S({ level: lv, quest: M.QUESTS.find(([l]) => l >= lv)?.[1] || '' })), first = cs.findIndex(c => c.fold);
      const lead = first < 0 ? cs : cs.slice(0, first), rest = first < 0 ? [] : cs.slice(first);
      assert.ok(rest.every(c => c.fold), `Lv ${lv}: folded cards come last`);
      assert.ok(lead.every(c => !c.later && !c.adv), `Lv ${lv}: no Later or advice card leads`);
      assert.ok(lead.filter(c => c.act === 'skill').length <= 1, `Lv ${lv}: one skill card leads`);
    }
  });
};
