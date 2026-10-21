/* The saved state (save v6, 0.9 P2; v5 0.4 P3c): key, shape, char(), labelOf, loading, the import check. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { V4_KEY, storedText, TEST_SLOT } = createRequire(import.meta.url)('../support/save.js');
const json = p => JSON.parse(readFileSync(new URL('../../' + p, import.meta.url), 'utf8'));

export default (test, M) => {
  const ids = () => { let n = 0; return () => `slot-${++n}`; };
  test('storage key: companion-save-v6, not the v5 or v4 key, no game, class or player name in it', () => {
    assert.equal(M.KEY, 'companion-save-v6'); assert.notEqual(M.KEY, V4_KEY); assert.notEqual(M.KEY, 'companion-save-v5'); assert.equal(M.SAVE_V, 6);
  });
  test('pack and class ids are the guide pack\'s and its class\'s (data/packs)', () => {
    assert.equal(M.PACK, json('data/packs/aion2/asmodian/assassin/pack.json').id);
    assert.ok(json('data/packs/aion2/asmodian/assassin/pack.json').uses.includes('aion2/classes/' + M.CLASS));
    assert.equal(M.CLASS, json('data/packs/aion2/classes/assassin/class.json').class);
  });
  test('new save: v 6, one slot (current), the character\'s identity, the defaults; the id from newId', () => {
    const s = M.newSave({ now: 1234, id: 'slot-a' });
    assert.deepEqual(s, { v: 6, current: 'slot-a', chars: { 'slot-a': { id: 'slot-a', pack: M.PACK, class: M.CLASS, name: '', created: 1234, checks: {}, level: 5, quest: '' } }, hide: false, open: {} });
    assert.throws(() => M.newSave({}), /slot id/);
  });
  test('char(state) is state.chars[state.current]', () => {
    const s = M.newSave({ id: 'a' }); s.chars.b = { ...M.newChar({ id: 'b' }), level: 30 };
    assert.equal(M.char(s), s.chars.a); s.current = 'b'; assert.equal(M.char(s), s.chars.b); assert.equal(M.char(s).level, 30);
  });
  test('labelOf: <name>-<class>-lvl<level>; the name part left out while empty; never stored', () => {
    const c = M.newChar({ id: 'x' }); c.level = 30;
    assert.equal(M.labelOf(c), 'assassin-lvl30');
    assert.equal(M.labelOf({ ...c, name: 'Zed' }), 'Zed-assassin-lvl30');
    assert.ok(!Object.values(c).includes('assassin-lvl30') && !('label' in c));
  });
  test('Level up changes the label, never the slot id', () => {
    const s = M.newSave({ id: 'slot-a' }), c = M.char(s), before = M.labelOf(c);
    c.level += 1; assert.notEqual(M.labelOf(c), before); assert.equal(c.id, 'slot-a'); assert.equal(s.current, 'slot-a');
  });
  test('auto level-up (0.6 P19, 0.8 P15): a levelsUp quest [lv, name, from] at Lv from → +1, at any other level no change; the untick at Lv from + 1 → −1; no from, no change', () => {
    const q = [3, 'Shadow Forest', 3], plain = [5, 'Plain'];
    assert.equal(M.levelOnTurnIn(3, q), 4); assert.equal(M.levelOnUnturn(4, q), 3);
    for (const lv of [1, 2, 4, 45]) assert.equal(M.levelOnTurnIn(lv, q), lv);
    for (const lv of [1, 3, 5, 45]) assert.equal(M.levelOnUnturn(lv, q), lv);
    /* the from-level, not the recommended lv: Brigade operation (rec. Lv 7) is turned in at Lv 8 */
    const brig = [7, 'Brigade Prison Compound Infiltration Operation', 8];
    assert.equal(M.levelOnTurnIn(8, brig), 9); assert.equal(M.levelOnTurnIn(6, brig), 6); assert.equal(M.levelOnUnturn(7, brig), 7); assert.equal(M.levelOnUnturn(9, brig), 8);
    /* a quest with no from-level never changes the level (also the 0.6 shape's bare true, and anything not a level) */
    for (const x of [plain, [5, 'Old', true], [5, 'Zero', 0], [5, 'Str', '4'], [5, 'Frac', 4.5], undefined])
      for (const lv of [1, 4, 5, 6, 45]) { assert.equal(M.levelOnTurnIn(lv, x), lv); assert.equal(M.levelOnUnturn(lv, x), lv); }
    /* the data (docs/research/2026-10-research-401-levels.md): the eight 100% EXP Ishalgen quests, each with the level
       it is turned in at and a source naming levelsUp */
    assert.deepEqual(M.QUESTS.filter(x => x.length > 2).map(x => [M.QUEST_NAME[x[1]], x[2]]), [['A Village in the Fog', 1], ['Prepare to Escape', 2],
      ['Shadow Forest', 3], ['Isolated Lake', 4], ['Signs of a Crash Landing', 6], ['Prison Compound Infiltration Plan', 7],
      ['Brigade Prison Compound Infiltration Operation', 8], ['The Longest Night', 9]]);
    const recs = json('data/packs/aion2/asmodian/story-quests.json').records;
    for (const r of recs.filter(r => r.levelsUp)) assert.ok(r.sources.some(s => (s.owner || s.url) && (s.fields || []).includes('levelsUp')), r.name + ': levelsUp has its source');
    /* The Being Beneath the Lake and Spread Your Wings give 50% each: no levelsUp, so ticking them never changes the level */
    for (const n of ['The Being Beneath the Lake', 'Spread Your Wings']) {
      assert.ok(!recs.find(r => r.name === n).levelsUp, n);
      const e = M.QUESTS.find(x => x[1] === M.sq(n));
      for (const lv of [1, 4, 5, 6, 7, 45]) { assert.equal(M.levelOnTurnIn(lv, e), lv, n); assert.equal(M.levelOnUnturn(lv, e), lv, n); }
    }
  });
  test('load: no save → a new save from newId (called once), hadSave false', () => {
    const r = M.loadState(null, { now: 5, newId: ids() });
    assert.equal(r.hadSave, false); assert.deepEqual(r.state, M.newSave({ now: 5, id: 'slot-1' }));
  });
  test('load: a v6 save is laid over the defaults (view and character); newId is not called', () => {
    const raw = JSON.stringify({ v: 6, current: 'k', chars: { k: { id: 'k', pack: M.PACK, class: M.CLASS, name: '', created: 1, level: 30, checks: { 'g6:0': true } } }, mode: 'basic' });
    const r = M.loadState(raw, { newId: () => { throw new Error('called'); } });
    assert.equal(r.hadSave, true);
    assert.deepEqual(r.state, { hide: false, open: {}, v: 6, current: 'k', chars: { k: { checks: { 'g6:0': true }, level: 30, quest: '', id: 'k', pack: M.PACK, class: M.CLASS, name: '', created: 1 } }, mode: 'basic' });
  });
  test('load: anything that isn\'t a v6 save starts fresh (a v5 save, v4 shape, wrong v, no current slot, unreadable text)', () => {
    const v4 = JSON.stringify({ checks: { 'g6:0': true }, level: 30, quest: 'Dying Light', seedLv12: true, migV5: true });
    for (const raw of [v4, '{}', '[]', 'null', '{nope', '7', JSON.stringify({ v: 4, current: 'a', chars: { a: {} } }), JSON.stringify({ v: 6, current: 'b', chars: { a: {} } }), JSON.stringify({ v: 6, current: 'a', chars: { a: 3 } }),
      JSON.stringify({ v: 5, current: 'a', chars: { a: { id: 'a', pack: M.PACK, class: M.CLASS, name: '', created: 1, level: 30, checks: { 'g6:0': true } } } })]) {
      const r = M.loadState(raw, { newId: () => 'fresh' });
      assert.equal(r.hadSave, false, raw); assert.deepEqual(r.state, M.newSave({ id: 'fresh' }), raw);
    }
  });
  test('load (0.9 P9): a newer save (v above SAVE_V) is read-only: shown when its shape is readable, a new save otherwise; never unreadable', () => {
    const c = { id: 'k', pack: M.PACK, class: M.CLASS, name: '', created: 1, level: 30, checks: { 'g6:0': true }, futureField: { x: 1 } };
    const raw = JSON.stringify({ v: 7, current: 'k', chars: { k: c }, mode: 'basic', newTop: 2 });
    const r = M.loadState(raw, { newId: () => { throw new Error('called'); } });
    assert.equal(r.readOnly, true); assert.equal(r.hadSave, true); assert.equal(r.unreadable, undefined);
    assert.equal(M.char(r.state).level, 30); assert.deepEqual(M.char(r.state).futureField, { x: 1 }); assert.equal(r.state.newTop, 2);
    assert.equal(raw, JSON.stringify({ v: 7, current: 'k', chars: { k: c }, mode: 'basic', newTop: 2 }), 'the text is left as it was');
    for (const odd of [JSON.stringify({ v: 8, other: 'shape' }), JSON.stringify({ v: 7.5, current: 'a', chars: {} })]) {
      const o = M.loadState(odd, { newId: () => 'fresh' });
      assert.equal(o.readOnly, true, odd); assert.equal(o.hadSave, false, odd); assert.equal(o.unreadable, undefined, odd); assert.deepEqual(o.state, M.newSave({ id: 'fresh' }), odd);
    }
    /* a v6 save and no save are not read-only */
    assert.equal(M.loadState(storedText({ checks: {}, level: 3, quest: '' })).readOnly, undefined);
    assert.equal(M.loadState(null, { newId: () => 'a' }).readOnly, undefined);
  });
  test('load (0.9 P9): stored text that isn\'t a v6 save comes back as unreadable, byte for byte, for the page to keep; no save and a v6 save give none', () => {
    for (const raw of ['{nope', '{}', '[]', '7', JSON.stringify({ v: 5, current: 'a', chars: { a: { id: 'a' } } }), JSON.stringify({ v: 6, current: 'b', chars: { a: {} } }), ' {"v":6 é']) {
      const r = M.loadState(raw, { newId: () => 'fresh' });
      assert.equal(r.unreadable, raw, raw); assert.equal(r.hadSave, false, raw); assert.equal(r.readOnly, undefined, raw);
    }
    for (const raw of [null, '', 'null', storedText({ checks: {}, level: 3, quest: '' })]) assert.equal(M.loadState(raw, { newId: () => 'fresh' }).unreadable, undefined, String(raw));
  });
  test('load (0.9 P9): a v7 save under this v6 reader is left byte-identical in storage (KEY locked, the page\'s writes refused)', () => {
    const st = M.memoryStorage(), raw = JSON.stringify({ v: 7, current: 'k', chars: { k: { id: 'k', pack: M.PACK, class: M.CLASS, name: '', created: 1, level: 30, checks: {} } } });
    st.set(M.KEY, raw);
    const r = M.loadState(st.get(M.KEY), { now: 1 });
    assert.equal(r.readOnly, true);
    M.lockKey(st, M.KEY);
    M.migrate(r.state, r.hadSave, () => { M.stampSave(r.state, 2000); st.set(M.KEY, JSON.stringify(r.state)); }, 1);
    M.char(r.state).checks['g6:0'] = true; M.stampSave(r.state, 3000);
    assert.equal(st.set(M.KEY, JSON.stringify(r.state)), false, 'a tick is not written');
    st.remove(M.KEY);
    assert.equal(st.get(M.KEY), raw, 'byte-identical');
    assert.equal(st.set(M.KEY + ':before-import', 'x'), true, 'other keys still work');
  });
  test('load: a slot that isn\'t an object is dropped; the others load', () => {
    const r = M.loadState(JSON.stringify({ v: 6, current: 'a', chars: { a: { id: 'a', level: 3 }, b: 'x' } }));
    assert.deepEqual(Object.keys(r.state.chars), ['a']);
  });
  test('the tests\' v6 saves (toStored) load as saves with the test slot current', () => {
    const r = M.loadState(storedText({ checks: { 'g6:0': true }, level: 20, quest: '', mode: 'basic' }));
    assert.equal(r.hadSave, true); assert.equal(r.state.current, TEST_SLOT); assert.equal(M.char(r.state).level, 20); assert.equal(r.state.mode, 'basic');
  });
  test('import: parseExport accepts a v6 export only (a v5 or v4 export, other JSON and non-JSON give null)', () => {
    const v6 = storedText({ checks: { 'g6:0': true }, level: 20, quest: '' });
    assert.deepEqual(M.parseExport(v6), JSON.parse(v6));
    for (const raw of [JSON.stringify({ checks: { 'g6:0': true }, level: 20 }), '{}', 'not json', '', JSON.stringify({ v: 6, chars: {} }), v6.replace('"v":6', '"v":5')]) assert.equal(M.parseExport(raw), null, raw);
  });
  test('charFields(): the character fields, none of them a view setting; CHAR_META the identity', () => {
    for (const f of ['checks', 'level', 'quest', 'storyEnd', 'qsteps', 'qsub', 'started', 'areaRun', 'rqSnooze', 'stLv', 'stShards', 'stPick', 'stones', 'pendSt', 'pendCr', 'dvTotal', 'dvCost', 'dvAdj', 'mt'])
      assert.ok(M.charFields().includes(f), f);
    for (const f of ['mode', 'open', 'hide', 'hideCards', 'hideOpt', 'areaLv', 'showObj', 'showTalk', 'backup', 'v', 'current', 'chars', 'savedAt'])
      assert.ok(!M.charFields().includes(f), f);
    assert.deepEqual(M.CHAR_META, ['id', 'pack', 'class', 'name', 'created']);
  });
};
