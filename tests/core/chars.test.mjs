/* Characters in the engine (0.5 P17, src/core/chars.js): add, switch, rename, remove a slot of save v6; the pack's playable
   classes (definePack `classes`, packClasses) and newChar's class input. Every call leaves the input unwritten (deep-frozen
   saves) and every other slot byte-identical (same object, same JSON). */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
const json = p => JSON.parse(readFileSync(new URL('../../' + p, import.meta.url), 'utf8'));
/* the page's slot ids (src/shell/ids.js), loaded as an ES module (the package has no "type") */
const { newId } = await import('data:text/javascript;base64,' + readFileSync(new URL('../../src/shell/ids.js', import.meta.url)).toString('base64'));
const deepFreeze = o => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };
const tiny = () => ({ id: 'tiny', data: { graph: { story: [['q:1', 'First']], nodes: { 'a': { kind: 'step', key: 'a', req: { all: [] }, done: ['tick'] } } }, story: { quests: [[1, 'First']], steps: {} } },
  catalog: { milestones: [{ id: 'm1', lv: 1, items: [{ k: 'a', t: '<b>Do A</b>' }] }], routes: [] } });
const withPack = (M, p, fn) => { M.usePack(p); try { return fn(); } finally { M.usePack(M.aion2Pack); } };

export default (test, M) => {
  /* three slots, b current, with progress in each */
  const three = () => {
    const s = M.newSave({ now: 1, id: 'a' });
    s.chars.b = { ...M.newChar({ now: 2, id: 'b' }), name: 'Bee', level: 30, checks: { 'g6:0': true }, mt: { checks: { 'g6:0': [5, true] } } };
    s.chars.c = { ...M.newChar({ now: 3, id: 'c' }), level: 12 };
    s.current = 'b'; s.mode = 'basic';
    return deepFreeze(s);
  };
  /* the slots other than `except` are the same objects with the same JSON as in `before` */
  const othersSame = (before, after, except) => {
    for (const k of Object.keys(before.chars).filter(k => !except.includes(k))) {
      assert.equal(after.chars[k], before.chars[k], k); assert.equal(JSON.stringify(after.chars[k]), JSON.stringify(before.chars[k]), k);
    }
  };
  const viewSame = (before, after) => { for (const k of Object.keys(before).filter(k => k !== 'chars' && k !== 'current')) assert.deepEqual(after[k], before[k], k); };

  test('chars add: a new slot of the class, named, created now, becomes current; other slots and the view untouched; frozen input', () => {
    const s = three(), json0 = JSON.stringify(s);
    const r = M.addChar(s, { class: M.CLASS, name: '  Zed  ', now: 99, id: 'd' });
    assert.equal(r.current, 'd'); assert.deepEqual(Object.keys(r.chars), ['a', 'b', 'c', 'd']);
    assert.deepEqual(r.chars.d, { id: 'd', pack: M.PACK, class: M.CLASS, name: 'Zed', created: 99, checks: {}, level: 5, quest: '' });
    othersSame(s, r, ['d']); viewSame(s, r); assert.equal(JSON.stringify(s), json0);
  });
  test('chars add: no class = the pack\'s character; no name = ""; a taken or missing id and an unlisted class throw', () => {
    const s = three();
    assert.deepEqual(M.addChar(s, { id: 'd' }).chars.d, M.newChar({ id: 'd' }));
    assert.throws(() => M.addChar(s, { id: 'b' }), /taken/);
    assert.throws(() => M.addChar(s, {}), /slot id/);
    assert.throws(() => M.addChar(s, { id: 'd', class: 'nope' }), /playable class/);
  });
  test('chars switch: current moves; every slot and the view untouched; an unknown slot throws; frozen input', () => {
    const s = three(), json0 = JSON.stringify(s);
    const r = M.switchChar(s, 'c');
    assert.equal(r.current, 'c'); assert.equal(M.char(r), s.chars.c); othersSame(s, r, []); viewSame(s, r);
    assert.equal(M.switchChar(s, 'b').current, 'b');
    for (const id of ['x', '', undefined, 'toString', '__proto__']) assert.throws(() => M.switchChar(s, id), /no such slot/, String(id));
    assert.equal(JSON.stringify(s), json0);
  });
  test('chars rename: trimmed, white space and control characters folded, capped at NAME_MAX code points; only that slot changes; frozen input', () => {
    const s = three(), json0 = JSON.stringify(s);
    const r = M.renameChar(s, 'a', ' \t Night\n\u0000Shade  ');
    assert.equal(r.chars.a.name, 'Night Shade'); assert.equal(r.current, 'b');
    assert.deepEqual({ ...r.chars.a, name: '' }, s.chars.a); othersSame(s, r, ['a']); viewSame(s, r);
    assert.equal(M.renameChar(s, 'b', '').chars.b.name, '');
    assert.equal(M.renameChar(s, 'b', 42).chars.b.name, '');
    const long = M.renameChar(s, 'b', '😀'.repeat(40) + 'x').chars.b.name;
    assert.equal([...long].length, M.NAME_MAX); assert.equal(long, '😀'.repeat(M.NAME_MAX));
    assert.equal(M.renameChar(s, 'b', 'a'.repeat(M.NAME_MAX - 1) + ' b').chars.b.name, 'a'.repeat(M.NAME_MAX - 1), 'no trailing space after the cut');
    assert.throws(() => M.renameChar(s, 'x', 'Zed'), /no such slot/);
    assert.equal(JSON.stringify(s), json0);
  });
  /* 0.6 P20: a removed slot keeps a tombstone { id, deletedAt } (ms) in place, so merge() doesn't bring it back */
  test('chars remove: the slot becomes a dated tombstone, others untouched; current stays, or moves to the first remaining character; frozen input', () => {
    const s = three(), json0 = JSON.stringify(s);
    const r1 = M.removeChar(s, 'c', 9000);
    assert.deepEqual(Object.keys(r1.chars), ['a', 'b', 'c']); assert.deepEqual(r1.chars.c, { id: 'c', deletedAt: 9000 });
    assert.equal(r1.current, 'b'); othersSame(s, r1, ['c']); viewSame(s, r1);
    assert.deepEqual(M.liveChars(r1).map(c => c.id), ['a', 'b']); assert.ok(M.isRemoved(r1.chars.c) && !M.isRemoved(r1.chars.a));
    const r2 = M.removeChar(s, 'b', 9000);
    assert.deepEqual(r2.chars.b, { id: 'b', deletedAt: 9000 }); assert.equal(r2.current, 'a'); othersSame(s, r2, ['b']);
    assert.equal(M.removeChar(M.removeChar(s, 'a', 9000), 'b', 9000).current, 'c', 'current skips a tombstone');
    assert.throws(() => M.removeChar(s, 'x'), /no such slot/);
    assert.equal(JSON.stringify(s), json0);
  });
  test('chars remove: deletedAt is never older than the character\'s last change (a clock set back); no time = its last change', () => {
    const s = three();
    assert.equal(M.removeChar(s, 'b', 1000).chars.b.deletedAt, 5000, 'b\'s newest stamp is at 5 s');
    assert.equal(M.removeChar(s, 'b').chars.b.deletedAt, 5000);
    assert.equal(M.removeChar(s, 'c').chars.c.deletedAt, 0, 'no stamps, no time');
    for (const bad of [NaN, -5, '9000', Infinity]) assert.equal(M.removeChar(s, 'c', bad).chars.c.deletedAt, 0, String(bad));
  });
  test('chars: a tombstone is no slot: switch, rename and remove refuse it; its id stays taken', () => {
    const r = M.removeChar(three(), 'c', 9000);
    assert.throws(() => M.switchChar(r, 'c'), /no such slot/);
    assert.throws(() => M.renameChar(r, 'c', 'Zed'), /no such slot/);
    assert.throws(() => M.removeChar(r, 'c'), /no such slot/);
    assert.throws(() => M.addChar(r, { id: 'c' }), /taken/);
  });
  test('chars remove: the last character is refused (tombstones don\'t count)', () => {
    const s = deepFreeze(M.newSave({ id: 'only' }));
    assert.throws(() => M.removeChar(s, 'only'), /last character/);
    const two = M.addChar(s, { id: 'two' }), one = M.removeChar(two, 'only', 5);
    assert.deepEqual(Object.keys(one.chars), ['only', 'two']); assert.equal(one.current, 'two'); assert.deepEqual(M.liveChars(one).map(c => c.id), ['two']);
    assert.throws(() => M.removeChar(one, 'two'), /last character/);
  });
  /* the 0.5 P17 finding, fixed in 0.6 P20: a character removed here no longer comes back from a save that still has it */
  test('chars remove + merge: a slot removed locally stays removed when merged with an older save that still has it (both orders)', () => {
    const s = three(), r = M.removeChar(s, 'c', 9000);
    for (const m of [M.merge(r, s), M.merge(s, r)]) {
      assert.deepEqual(m.chars.c, { id: 'c', deletedAt: 9000 }); assert.deepEqual(M.liveChars(m).map(c => c.id).sort(), ['a', 'b']);
    }
    assert.equal(M.merge(r, s).current, 'b');
    const gone = M.removeChar(s, 'b', 9000), m = M.merge(s, gone);
    assert.equal(m.current, 'a', 'the local current, removed by the merge, moves to the first remaining character');
  });
  test('chars: a save after add / rename / switch / remove still loads as a v6 save with the same characters and tombstone', () => {
    let s = M.newSave({ id: 'a' });
    s = M.addChar(s, { id: 'b', name: 'Zed' }); s = M.renameChar(s, 'a', 'Ann'); s = M.switchChar(s, 'a'); s = M.removeChar(s, 'b', 77);
    const r = M.loadState(JSON.stringify(s));
    assert.equal(r.hadSave, true); assert.deepEqual(r.state, s); assert.deepEqual(r.state.chars.b, { id: 'b', deletedAt: 77 }, 'no defaults laid under a tombstone');
  });
  test('chars: a save whose current slot is a tombstone loads with the first remaining character; with none left, a new one is added', () => {
    const s = M.removeChar(three(), 'c', 9000), bad = { ...s, current: 'c' };
    const r = M.loadState(JSON.stringify(bad), { newId: () => 'n' });
    assert.equal(r.hadSave, true); assert.equal(r.state.current, 'a'); assert.deepEqual(Object.keys(r.state.chars), ['a', 'b', 'c']);
    const none = { ...bad, chars: { b: { id: 'b', deletedAt: 1 }, c: { id: 'c', deletedAt: 2 } } };
    const r2 = M.loadState(JSON.stringify(none), { now: 5, newId: () => 'n' });
    assert.equal(r2.hadSave, true); assert.equal(r2.state.current, 'n'); assert.deepEqual(r2.state.chars.n, M.newChar({ now: 5, id: 'n' }));
    assert.deepEqual([r2.state.chars.b, r2.state.chars.c, r2.state.mode], [none.chars.b, none.chars.c, 'basic'], 'tombstones and view settings kept');
    assert.equal(M.parseExport(JSON.stringify(bad)), null, 'an export always has a character current'); assert.ok(M.parseExport(JSON.stringify(s)));
  });
  /* the property test: ids from the page's newId (src/shell/ids.js), names from an alphabet without UUID characters
     (hex digits and "-") so a contained name can only mean the id was built from it */
  test('chars: a slot id never contains the name, class or level (1,000 random names, ids from newId)', () => {
    const ALPHA = 'ghijklmnopqrstuvwxyzGHIJKLMNOPQRSTUVWXYZ _.!éßøÆ漢字😀';
    const chars = [...ALPHA];
    let seed = 20261017; const rnd = n => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
    let s = M.newSave({ id: newId() }), n = 0;
    for (let i = 0; i < 1000; i++) {
      const name = Array.from({ length: 1 + rnd(30) }, () => chars[rnd(chars.length)]).join('');
      const id = newId();
      s = M.addChar(s, { class: M.CLASS, name, now: i, id });
      s.chars[id] = { ...M.char(s), level: 1 + rnd(45) };
      s = M.renameChar(s, id, name.split('').reverse().join(''));
      const d = M.char(s), clean = M.cleanName(name);
      assert.equal(d.id, id); assert.equal(s.current, id); assert.ok(id in s.chars);
      assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      for (const w of [clean, d.name, d.class, 'lvl' + d.level, M.labelOf(d)].filter(Boolean)) assert.ok(!id.includes(w), `${id} contains ${w}`);
      n++;
    }
    assert.equal(n, 1000); assert.equal(Object.keys(s.chars).length, 1001);
  });

  /* the classes with a guide pack (data/packs/aion2/asmodian/<class>/pack.json) among the game's pack.json classes: the
     pack lists exactly those, the Assassin first (a class with no guide pack would not be listed) */
  const guideClasses = () => json('data/packs/aion2/pack.json').classes.filter(c => existsSync(new URL('../../data/packs/aion2/asmodian/' + c + '/pack.json', import.meta.url)));
  test('classes: the AION 2 pack lists the classes with a guide pack; name, class and guide pack match data/', () => {
    const listed = M.packClasses();
    assert.equal(listed[0].class, M.CLASS); assert.equal(listed[0].pack, M.PACK);
    assert.deepEqual(listed.map(e => e.class).sort(), guideClasses().sort());
    /* the order is the class records' releaseOrder (0.9 P11, data/packs/aion2/classes/<id>/class.json: the Assassin, then
       the order their guides shipped), not pack.json's; the eight classes of 0.8 keep their order (an ordered subsequence) */
    const order = c => json(`data/packs/aion2/classes/${c}/class.json`).records.find(r => r.id === 'class:' + c).releaseOrder;
    assert.deepEqual(listed.map(e => e.class), guideClasses().sort((a, b) => order(a) - order(b)));
    const shipped = ['assassin', 'ranger', 'gladiator', 'spiritmaster', 'templar', 'cleric', 'sorcerer', 'chanter'];
    assert.deepEqual(listed.map(e => e.class).filter(c => shipped.includes(c)), shipped);
    assert.ok(listed.every(e => e.pack === 'aion2/asmodian/' + e.class || e.class === M.CLASS));
    assert.ok(Object.isFrozen(M.aion2Pack.classes) && M.aion2Pack.classes.every(Object.isFrozen));
    for (const e of M.packClasses()) {
      const cls = json(`data/packs/aion2/classes/${e.class}/class.json`), guide = json(`data/packs/${e.pack}/pack.json`);
      assert.equal(cls.records.find(r => r.id === 'class:' + e.class).name, e.name);
      assert.equal(guide.id, e.pack); assert.ok(guide.uses.includes('aion2/classes/' + e.class), e.pack);
      assert.ok(existsSync(new URL(`../../data/packs/${e.pack}/pack.json`, import.meta.url)));
    }
  });
  test('classes: newChar takes the class and guide pack from the chosen entry; an unlisted class throws', () => {
    assert.deepEqual(M.newChar({ id: 'x', class: M.CLASS, now: 7 }), { id: 'x', pack: M.PACK, class: M.CLASS, name: '', created: 7, checks: {}, level: 5, quest: '' });
    /* every class of the game that has a guide pack is playable (read from the data); the unlisted case is a made-up class id */
    for (const c of guideClasses()) assert.deepEqual([M.newChar({ id: 'x', class: c }).pack, M.newChar({ id: 'x', class: c }).class], ['aion2/asmodian/' + c, c], c);
    for (const c of ['bard', '', 'Assassin', null]) assert.throws(() => M.newChar({ id: 'x', class: c }), /playable class/, String(c));
    const p = M.definePack({ ...tiny(), character: { pack: 'tiny/b', class: 'b' }, classes: [{ class: 'a', pack: 'tiny/a', name: 'A' }, { class: 'b', pack: 'tiny/b', name: 'B' }] });
    withPack(M, p, () => {
      assert.deepEqual([M.newChar({ id: 'x', class: 'a' }).pack, M.newChar({ id: 'x', class: 'a' }).class], ['tiny/a', 'a']);
      assert.deepEqual([M.newChar({ id: 'x' }).pack, M.newChar({ id: 'x' }).class], ['tiny/b', 'b']);
      const s = M.addChar(M.newSave({ id: 's1' }), { id: 's2', class: 'a' });
      assert.equal(M.char(s).pack, 'tiny/a');
    });
  });
  /* 0.8 P12 (#501): the welcome's class pick */
  const fresh = () => { const s = M.newSave({ now: 1, id: 'a' }); s.chars.a.level = 1; return deepFreeze(s); };
  test('startAs: an untouched start of another class becomes one character of it (tombstone for the old slot); frozen input', () => {
    const s = fresh(), json0 = JSON.stringify(s);
    const r = M.startAs(s, { class: 'ranger', now: 9000, id: 'n' });
    assert.equal(r.current, 'n'); assert.deepEqual(M.liveChars(r).map(c => [c.id, c.class, c.pack]), [['n', 'ranger', 'aion2/asmodian/ranger']]);
    assert.ok(M.isRemoved(r.chars.a), 'the Assassin slot is a tombstone, not a character'); assert.equal(r.chars.a.deletedAt, 9000);
    viewSame(s, r); assert.equal(JSON.stringify(s), json0);
    for (const c of M.packClasses().map(e => e.class).filter(c => c !== M.CLASS)) assert.deepEqual(M.liveChars(M.startAs(s, { class: c, id: 'n' })).map(x => x.class), [c], c);
  });
  test('startAs: the same class, no class, or a save with progress (level, ticks, a second character) is returned as it is', () => {
    const s = fresh();
    assert.equal(M.startAs(s, { class: M.CLASS, id: 'n' }), s);
    assert.equal(M.startAs(s, { id: 'n' }), s);
    const with_ = patch => deepFreeze({ ...s, chars: { a: { ...s.chars.a, ...patch } } });
    for (const p of [{ level: 12 }, { level: 2 }, { checks: { 'g6:0': true } }]) { const t = with_(p); assert.equal(M.startAs(t, { class: 'ranger', id: 'n' }), t, JSON.stringify(p)); }
    const t3 = three(); assert.equal(M.startAs(t3, { class: 'ranger', id: 'n' }), t3, 'a browser with characters keeps them');
    assert.ok(M.untouchedStart(s) && !M.untouchedStart(t3));
    assert.throws(() => M.startAs(s, { class: 'bard', id: 'n' }), /playable class/, 'a class with no guide pack is never started (every real class has one since 0.8 P19)');
  });
  test('classChoices: every class of the game in the pack\'s order, a guide pack for the playable ones, null ("Soon") for the rest', () => {
    const game = json('data/packs/aion2/pack.json').classes, ch = M.classChoices();
    assert.deepEqual(ch.map(e => e.class), game);
    assert.equal(new Set(game).size, game.length, 'each class once');
    for (const e of ch) {
      const p = M.packClasses().find(x => x.class === e.class);
      assert.equal(e.pack, p ? p.pack : null, e.class);
      assert.equal(e.name, json(`data/packs/aion2/classes/${e.class}/class.json`).records[0].name, e.class);
      assert.equal(e.icon, `assets/icons/class-${e.class}.webp`, e.class);
    }
    assert.ok(Object.isFrozen(M.aion2Pack.gameClasses) && M.aion2Pack.gameClasses.every(Object.isFrozen));
    /* a pack without gameClasses offers its playable classes; a playable class missing from gameClasses throws */
    assert.deepEqual(M.classChoices(M.definePack(tiny())), [{ class: '', name: '', pack: 'tiny', icon: null }]);
    assert.throws(() => M.definePack({ ...tiny(), classes: [{ class: 'a', pack: 'tiny/a', name: 'A' }], gameClasses: [{ class: 'b', name: 'B' }] }), /not one of "gameClasses"/);
  });
  test('class emblems: one per class of the game, the exact bytes of docs/plans/0.8/inputs/emblems (sha256 in its SOURCES.md), a docs/ISSUES.md row each', () => {
    const src = readFileSync(new URL('../../docs/plans/0.8/inputs/emblems/SOURCES.md', import.meta.url), 'utf8');
    const issues = readFileSync(new URL('../../docs/ISSUES.md', import.meta.url), 'utf8');
    for (const c of json('data/packs/aion2/pack.json').classes) {
      const bytes = readFileSync(new URL(`../../src/assets/icons/class-${c}.webp`, import.meta.url)), sha = createHash('sha256').update(bytes).digest('hex');
      assert.ok(new RegExp(`^\\| ${c}\\.webp \\| https://metabot\\.gg/web/aion2/classes/${c}\\.webp \\| ${sha} \\|$`, 'm').test(src), `${c}: sha256 ${sha} is SOURCES.md's`);
      assert.ok(issues.includes(`| class-${c}.webp | <https://metabot.gg/en/aion-2/classes> | <https://metabot.gg/web/aion2/classes/${c}.webp> |`), `${c}: docs/ISSUES.md row`);
    }
  });
  test('classes: a pack without `classes` (the fake game\'s shape) falls back to its character', () => {
    const p = M.definePack(tiny());
    assert.equal(p.classes, undefined);
    assert.deepEqual(M.packClasses(p), [{ class: '', pack: 'tiny', name: '' }]);
    withPack(M, p, () => {
      assert.deepEqual(M.packClasses(), [{ class: '', pack: 'tiny', name: '' }]);
      assert.equal(M.newChar({ id: 'x', class: '' }).pack, 'tiny');
      const s = M.addChar(M.newSave({ id: 's1' }), { id: 's2', name: 'Zed' });
      assert.deepEqual([M.char(s).pack, M.char(s).class, M.char(s).name], ['tiny', '', 'Zed']);
    });
  });
  test('classes: definePack refuses an empty list, a bad entry, a class twice, or a character not in the list', () => {
    const e = (c, pack = 'tiny/' + c) => ({ class: c, pack, name: c.toUpperCase() });
    for (const bad of [[], {}, [{ class: 'a', pack: 'tiny/a' }], [{ class: '', pack: 'tiny', name: 'X' }], [e('a'), e('a', 'tiny/z')], ['a']])
      assert.throws(() => M.definePack({ ...tiny(), classes: bad }), /"classes" has the wrong type/, JSON.stringify(bad));
    assert.throws(() => M.definePack({ ...tiny(), character: { pack: 'tiny/z', class: 'z' }, classes: [e('a')] }), /"character" is not one of "classes"/);
    assert.throws(() => M.definePack({ ...tiny(), character: { pack: 'tiny/z', class: 'a' }, classes: [e('a')] }), /"character" is not one of "classes"/);
    const p = M.definePack({ ...tiny(), classes: [e('b'), e('a')] });
    assert.deepEqual(p.classes, [e('b'), e('a')]);
    assert.deepEqual(p.character, { pack: 'tiny/b', class: 'b' }, 'no character: the first class');
  });
};
