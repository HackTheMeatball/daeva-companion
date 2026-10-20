/* Save v5 (0.4 P3c), in the browser: the clean break and the save's round trips. Suite `save` in tests/run.mjs (golden
   shard, in place of the removed mig1 / mig2). node tests/save.js  (page at AION_BASE; see tests/config.js)
     1. fresh browser: Lv 1 on the first quest; only the v5 key written; a random slot id
     2. a v4 save present: the app starts fresh, no page error, the v4 entry byte-identical, getItem never called with
        the v4 key (Storage.prototype.getItem spied from before the page's script runs)
     3. v5 round trip: save, reload, identical text
     4. import of a v4 export: refused with the message, nothing changes
     5. import of a v5 export: replaces the save, the old one kept under :before-import
     6. Level up changes the label (labelOf), never the slot id or the key
     7. the player name and the label never leave the save: not in a storage key, the report link or the export file name
     8. two slots: the page shows the current one and leaves the other as it is
     9. the character switcher (0.5 P18): a fresh browser shows assassin-lvl1; spoken names, Enter / Escape, focus return
    10. two characters: add one (named Zed), tick a quest on it, switch back; each keeps its progress after a reload, and
        "Zed" is in no key, link, URL, title or file name
    11. rename (0.5 P19): the field's spoken name, Escape cancels, Save name; after a reload the new label shows and only
        that slot's name changed in the stored save
    12. remove (0.5 P19): one character offers no Remove; the confirmation names the character, Escape and Keep it cancel;
        removing a non-current and then the current character drops the right slot, leaves the rest byte-identical,
        and a reload shows the expected current
    13. phone folds (0.5 P6): opening a fold at 390 px adds only its fold_<id> to the save, a reload keeps it; at 1500 px
        fold_* keys change nothing
    14. first-run welcome (0.6 P17): a fresh browser shows it once (Start at Lv 1 writes welcomed: 1 only; a reload
        keeps it gone); an older save with progress never shows it; joining at Lv 20 stores the level and the quest only,
        and its character and Next up equal a played-through Lv 20 state's; a new character opens on the join step
    10c. the site's classes (0.7 A1): the picker offers every playable class; a Ranger save loads its own guide, no note
    15. auto level-up (0.6 P19): "Turned in" on a levelsUp quest at the level below its own → one level up, Undo and
        stepping back → down again; at a higher level or on another quest → no change */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { isDeepStrictEqual } = require('util');
const CFG = require('./config');
const { SAVE_KEY, V4_KEY, BEFORE_IMPORT_KEY, TEST_SLOT, toStored, writeRaw, readRaw, writeSave, clearSave } = require('./support/save');
let fail = 0; const ok = (name, cond, detail) => { console.log((cond ? 'ok   ' : 'FAIL ') + name + (!cond && detail !== undefined ? '  · ' + JSON.stringify(detail).slice(0, 700) : '')); if (!cond) fail++; };
const UUID4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const OLD_MSG = "This file is from a version before 0.4 and can't be loaded.";
/* a pre-0.4 save and export, as the 0.3 build stored and exported it (flat, under the v4 key) */
const V4_SAVE = JSON.stringify({ checks: { 'g6:0': true, 'g9:0': true, 'rq:2202010': true }, level: 30, quest: 'Dying Light', open: {}, mode: 'advanced', seedLv12: true, stTriniel1: true, dvReset1: true, migV5: true, eputSync1: true, stampV1: true, schemaVersion: 1, backup1: true, backup: { since: 1759000000000 }, mt: { level: [0, 30] } });

(async () => {
  const b = await chromium.launch();
  /* a new browser context (empty storage); getItem calls are recorded from the first script on */
  const page = async () => {
    const ctx = await b.newContext({ viewport: { width: 1500, height: 1000 }, acceptDownloads: true, serviceWorkers: 'block' });
    await ctx.addInitScript(() => { const g = Storage.prototype.getItem; window.__gets = []; Storage.prototype.getItem = function (k) { window.__gets.push(String(k)); return g.call(this, k); }; });
    const p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(CFG.CUR); await p.waitForTimeout(300);
    return { ctx, p, errs };
  };
  const keys = p => p.evaluate(() => Object.keys(localStorage).sort());
  const live = p => p.evaluate(() => JSON.stringify(state));
  const importFile = async (p, text) => { await p.setInputFiles('#impIn', { name: 'file.json', mimeType: 'application/json', buffer: Buffer.from(text) }); await p.waitForTimeout(250); };

  /* 1. fresh browser */
  {
    const { ctx, p, errs } = await page();
    await clearSave(p); await p.reload(); await p.waitForTimeout(400);
    const s = await p.evaluate(() => ({ lv: char(state).level, q: char(state).quest, q0: QUESTS[0][1], v: state.v, cur: state.current, ids: Object.keys(state.chars), c: char(state) }));
    ok('fresh: Lv 1 on the first story quest', s.lv === 1 && s.q === s.q0, s);
    ok('fresh: one slot, current, a random v4 UUID; pack, class and an empty name', s.v === 5 && s.ids.length === 1 && s.ids[0] === s.cur && UUID4.test(s.cur) && s.c.id === s.cur && s.c.pack === 'aion2/asmodian/assassin' && s.c.class === 'assassin' && s.c.name === '', s);
    await p.click('#lvlUp'); await p.waitForTimeout(150);
    ok('fresh: only the v5 key is written', JSON.stringify(await keys(p)) === JSON.stringify([SAVE_KEY]), await keys(p));
    const stored = JSON.parse(await readRaw(p));
    ok('fresh: the stored save is v5 with the same slot and Lv 2 after Level up', stored.v === 5 && stored.current === s.cur && stored.chars[s.cur].level === 2, stored);
    const other = await page(); await clearSave(other.p); await other.p.reload(); await other.p.waitForTimeout(300);
    const id2 = await other.p.evaluate(() => state.current); await other.ctx.close();
    ok('fresh: another browser gets another slot id', UUID4.test(id2) && id2 !== s.cur, [s.cur, id2]);
    ok('fresh: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 2. a v4 save in this browser: never read, never changed */
  {
    const { ctx, p, errs } = await page();
    await writeRaw(p, V4_SAVE, { key: V4_KEY, fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const s = await p.evaluate(() => ({ lv: char(state).level, q: char(state).quest, q0: QUESTS[0][1], ticks: Object.values(char(state).checks).filter(Boolean).length, gets: window.__gets }));
    ok('v4 save present: the app starts fresh (Lv 1, first quest, no ticks)', s.lv === 1 && s.q === s.q0 && s.ticks === 0, s);
    ok('v4 save present: getItem is never called with the v4 key', s.gets.length > 0 && !s.gets.includes(V4_KEY) && s.gets.includes(SAVE_KEY), s.gets);
    await p.click('#lvlUp'); await p.waitForTimeout(150); await p.reload(); await p.waitForTimeout(300);
    /* read before this suite's own getItem calls below (readRaw) are recorded */
    const gets2 = await p.evaluate(() => window.__gets);
    ok('v4 save present: getItem never called with the v4 key after the reload either', gets2.length > 0 && !gets2.includes(V4_KEY), gets2);
    ok('v4 save present: its entry is byte-identical after a load, a save and a reload', await readRaw(p, { key: V4_KEY }) === V4_SAVE);
    ok('v4 save present: the progress is saved under the v5 key only', JSON.stringify(await keys(p)) === JSON.stringify([V4_KEY, SAVE_KEY].sort()) && JSON.parse(await readRaw(p)).v === 5, await keys(p));
    ok('v4 save present: no page error', !errs.length, errs);
    await ctx.close();
  }
  /* 3. v5 round trip */
  const SAVED = { checks: { 'g6:0': true, 'g9:0': true, 'rq:2202010': true }, started: { 'rq:2202017': 1 }, level: 22, quest: 'Daeva in a Dream', open: {}, mode: 'advanced', stones: 3 };
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const a = await readRaw(p); await p.reload(); await p.waitForTimeout(400); const b2 = await readRaw(p);
    ok('round trip: save, reload, identical text', a !== null && a === b2, [a && a.slice(0, 200), b2 && b2.slice(0, 200)]);
    ok('round trip: the in-memory save equals the stored text', (await live(p)) === b2);
    const c = JSON.parse(b2).chars[TEST_SLOT], want = toStored(SAVED).chars[TEST_SLOT];
    ok('round trip: the character comes back with its progress and slot id', b2 && JSON.parse(b2).current === TEST_SLOT && ['checks', 'started', 'level', 'quest', 'stones', 'id', 'pack', 'class', 'name', 'created'].every(f => JSON.stringify(c[f]) === JSON.stringify(want[f])), c);
    ok('round trip: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 4. import of a v4 (pre-0.4) export: refused, nothing changes */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const raw0 = await readRaw(p), mem0 = await live(p), keys0 = await keys(p);
    for (const [label, text] of [['a v4 export', V4_SAVE], ['not JSON', 'not a save'], ['other JSON', '{"hello":1}']]) {
      await importFile(p, text);
      const msg = await p.innerText('#xferMsg');
      ok(`import ${label}: refused with "${OLD_MSG}"`, msg === OLD_MSG && !(await p.$('#impGo')), msg);
      ok(`import ${label}: the save, the in-memory state and the keys are unchanged`, (await readRaw(p)) === raw0 && (await live(p)) === mem0 && JSON.stringify(await keys(p)) === JSON.stringify(keys0) && (await readRaw(p, { key: BEFORE_IMPORT_KEY })) === null);
    }
    ok('import refused: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 5. import of a v5 export: replaces the save, keeps the old one under :before-import */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const mem0 = await live(p);
    const file = { ...toStored({ checks: { 'g6:0': true, 'g12:0': true }, level: 33, quest: 'Last Refuge', open: {}, mode: 'basic' }) };
    file.chars = { 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee': { ...file.chars[TEST_SLOT], id: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee' } }; file.current = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
    await importFile(p, JSON.stringify(file));
    ok('import v5: asks before replacing (Lv 33, 2 ticks)', /Replace your progress with this file \(Lv 33, 2 ticks\)/.test(await p.innerText('#xferMsg')), await p.innerText('#xferMsg'));
    await Promise.all([p.waitForEvent('load'), p.click('#impGo')]); await p.waitForTimeout(400);
    const s = await p.evaluate(() => ({ lv: char(state).level, q: char(state).quest, cur: state.current, mode: state.mode }));
    ok('import v5: the save is replaced (level, quest, slot id, view settings from the file)', s.lv === 33 && s.q === 'Last Refuge' && s.cur === file.current && s.mode === 'basic', s);
    ok('import v5: the replaced save is kept under :before-import, as it was', (await readRaw(p, { key: BEFORE_IMPORT_KEY })) === mem0);
    ok('import v5: only the v5 keys exist', JSON.stringify(await keys(p)) === JSON.stringify([SAVE_KEY, BEFORE_IMPORT_KEY].sort()), await keys(p));
    ok('import v5: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 6. Level up: the label changes, the slot id and the key don't */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const at = () => p.evaluate(() => ({ label: labelOf(char(state)), id: char(state).id, cur: state.current, slots: Object.keys(state.chars), keys: Object.keys(localStorage).sort() }));
    const a = await at(); await p.click('#lvlUp'); await p.waitForTimeout(200); const z = await at();
    ok('Level up: the label goes from assassin-lvl22 to assassin-lvl23', a.label === 'assassin-lvl22' && z.label === 'assassin-lvl23', [a.label, z.label]);
    ok('Level up: the slot id, the slots and the storage key stay the same', a.id === TEST_SLOT && z.id === a.id && z.cur === a.cur && JSON.stringify(z.slots) === JSON.stringify(a.slots) && JSON.stringify(z.keys) === JSON.stringify(a.keys) && JSON.stringify(z.keys) === JSON.stringify([SAVE_KEY]), [a, z]);
    ok('Level up: the label is not stored', !(await readRaw(p)).includes('lvl23'));
    ok('Level up: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 7. a named character: the name and the label stay inside the save */
  {
    const { ctx, p, errs } = await page();
    const NAME = 'Zedonia', named = toStored(SAVED); named.chars[TEST_SLOT].name = NAME;
    await writeRaw(p, JSON.stringify(named), { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    await p.click('#lvlUp'); await p.waitForTimeout(150);
    const label = await p.evaluate(() => labelOf(char(state)));
    const where = await p.evaluate(() => { document.getElementById('reportLink').dispatchEvent(new Event('focus'));
      return { ls: Object.keys(localStorage), ss: Object.keys(sessionStorage), report: document.getElementById('reportLink').href, url: location.href, title: document.title }; });
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#expBtn')]);
    const fname = dl.suggestedFilename(), file = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
    const leaks = [...where.ls, ...where.ss, where.report, decodeURIComponent(where.report), where.url, where.title, fname].filter(x => x.includes(NAME) || x.includes(label) || x.includes(TEST_SLOT));
    ok('name / label: the label is Zedonia-assassin-lvl23', label === NAME + '-assassin-lvl23', label);
    ok('name / label: not in a storage key, the report link, the URL, the title or the export file name', !leaks.length, leaks);
    ok('name / label: the export file name is companion-save-<date>.json', /^companion-save-\d{4}-\d\d-\d\d\.json$/.test(fname), fname);
    ok('name / label: the name is kept inside the save (and the export)', file.chars[TEST_SLOT].name === NAME && JSON.parse(await readRaw(p)).chars[TEST_SLOT].name === NAME);
    ok('name / label: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 8. two slots: the current one is shown, the other is left as it is */
  {
    const { ctx, p, errs } = await page();
    const two = toStored(SAVED), B = '00000000-0000-4000-8000-0000000000b2';
    two.chars[B] = { ...JSON.parse(JSON.stringify(two.chars[TEST_SLOT])), id: B, level: 40, quest: 'Forgotten Commander' }; two.current = B;
    await writeRaw(p, JSON.stringify(two), { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    await p.click('#lvlUp'); await p.waitForTimeout(150);
    const st = JSON.parse(await readRaw(p)), shown = await p.evaluate(() => document.getElementById('questIn').value);
    ok('two slots: the page shows the current slot (Lv 40 → 41, its quest)', st.chars[B].level === 41 && shown === 'Forgotten Commander', { lv: st.chars[B].level, shown });
    ok('two slots: the other slot is left exactly as it was', isDeepStrictEqual(st.chars[TEST_SLOT], two.chars[TEST_SLOT]), st.chars[TEST_SLOT]);
    ok('two slots: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 9. the character switcher (0.5 P18): the header control in a fresh browser, by keyboard */
  {
    const { ctx, p, errs } = await page();
    await clearSave(p); await p.reload(); await p.waitForTimeout(400);
    const btn = () => p.evaluate(() => { const b = document.getElementById('charBtn'), pop = document.getElementById('charPop');
      return { text: b.innerText.trim(), name: b.getAttribute('aria-label'), exp: b.getAttribute('aria-expanded'), open: !pop.hidden, focus: document.activeElement && document.activeElement.id }; });
    const a = await btn();
    ok('switcher: a fresh browser shows assassin-lvl1 (no name), closed', a.text.startsWith('assassin-lvl1') && a.exp === 'false' && !a.open, a);
    ok('switcher: the button\'s spoken name is "Character: assassin-lvl1. Switch character"', a.name === 'Character: assassin-lvl1. Switch character', a.name);
    await p.focus('#charBtn'); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
    const list = await p.evaluate(() => { const g = document.getElementById('charList'), rows = [...document.querySelectorAll('#charRows [data-char]')];
      return { role: g.getAttribute('role'), name: document.getElementById(g.getAttribute('aria-labelledby')).textContent, rows: rows.map(r => [r.innerText.replace(/\s+/g, ' ').trim(), r.getAttribute('aria-current')]), add: document.getElementById('charNew').innerText }; });
    const b1 = await btn();
    ok('switcher: Enter opens the list (aria-expanded true)', b1.exp === 'true' && b1.open, b1);
    ok('switcher: the list is a group named "Characters": one row, current, and "+ New character"', list.role === 'group' && list.name === 'Characters' && list.rows.length === 1 && list.rows[0][0] === '✓ assassin-lvl1' && list.rows[0][1] === 'true' && list.add === '+ New character', list);
    await p.keyboard.press('Tab'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    const b2 = await btn();
    ok('switcher: Escape in the list closes it and returns focus to the button', b2.exp === 'false' && !b2.open && b2.focus === 'charBtn', b2);
    await p.keyboard.press('Enter'); await p.focus('#charNew'); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
    const f = await p.evaluate(() => ({ focus: document.activeElement.id, label: document.querySelector('label[for="charName"]').textContent, legend: document.querySelector('#charForm legend').textContent,
      radios: [...document.querySelectorAll('#charPick input[type=radio]')].map(r => [r.value, r.checked, r.closest('label').innerText.trim()]), list: !document.getElementById('charList').hidden }));
    ok('switcher: New character opens the form with the focus in "Name (optional)"', f.focus === 'charName' && f.label === 'Name (optional)' && !f.list, f);
    /* 0.6 P5: the Ranger joined the Assassin; 0.7 P2: the Gladiator got its guide pack and joined them; 0.7 P4: the
       Spiritmaster after them; 0.8 P3: the Templar last */
    ok('switcher: the class picker offers the Assassin (picked), the Ranger, the Gladiator, the Spiritmaster and the Templar', f.legend === 'Class' && JSON.stringify(f.radios) === JSON.stringify([['assassin', true, 'Assassin'], ['ranger', false, 'Ranger'], ['gladiator', false, 'Gladiator'], ['spiritmaster', false, 'Spiritmaster'], ['templar', false, 'Templar']]), f.radios);
    await p.keyboard.type('  Zed  '); await p.waitForTimeout(50);
    ok('switcher: the form previews the label Zed-assassin-lvl1 (name trimmed)', await p.innerText('#charPrev') === 'Zed-assassin-lvl1', await p.innerText('#charPrev'));
    await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    const b3 = await btn();
    ok('switcher: Escape in the form closes it, focus back on the button, nothing saved', b3.exp === 'false' && !b3.open && b3.focus === 'charBtn' && Object.keys(JSON.parse(await readRaw(p) || '{"chars":{}}').chars).length <= 1, b3);
    ok('switcher (keyboard): no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 10. two characters: add one, tick a quest on it, switch back; each keeps its own progress across reloads */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const first = JSON.parse(await readRaw(p)).chars[TEST_SLOT];
    const label = () => p.evaluate(() => document.getElementById('charLbl').textContent);
    ok('two characters: the control shows assassin-lvl22', await label() === 'assassin-lvl22', await label());
    await p.click('#charBtn'); await p.click('#charNew'); await p.fill('#charName', 'Zed');
    await Promise.all([p.waitForEvent('load'), p.click('#charCreate')]); await p.waitForTimeout(400);
    const s = await p.evaluate(() => ({ cur: state.current, ids: Object.keys(state.chars), c: char(state), q0: QUESTS[0][1] }));
    const zed = s.cur;
    ok('new character: a second slot with a random id, current, named Zed, Lv 1 on the first quest, no ticks', s.ids.length === 2 && s.ids[0] === TEST_SLOT && UUID4.test(zed) && s.c.name === 'Zed' && s.c.class === 'assassin' && s.c.level === 1 && s.c.quest === s.q0 && !Object.keys(s.c.checks).length, s);
    ok('new character: the control shows Zed-assassin-lvl1', await label() === 'Zed-assassin-lvl1', await label());
    ok('new character: the first character is stored exactly as it was', isDeepStrictEqual(JSON.parse(await readRaw(p)).chars[TEST_SLOT], first));
    /* tick a regional quest on Zed (two clicks: started, then done) and level up */
    const rk = await p.evaluate(() => { const i = document.querySelector('#gates input[data-k^="rq:"]'); i.click(); i.click(); return i.dataset.k; }); await p.waitForTimeout(100);
    await p.click('#lvlUp'); await p.waitForTimeout(200);
    ok('Zed: the tick and the level are saved on Zed', JSON.parse(await readRaw(p)).chars[zed].checks[rk] === true && JSON.parse(await readRaw(p)).chars[zed].level === 2, rk);
    ok('Zed: the control follows the level (Zed-assassin-lvl2)', await label() === 'Zed-assassin-lvl2', await label());
    /* the name stays inside the save */
    const where = await p.evaluate(() => { document.getElementById('reportLink').dispatchEvent(new Event('focus'));
      return { ls: Object.keys(localStorage), ss: Object.keys(sessionStorage), report: document.getElementById('reportLink').href, url: location.href, title: document.title }; });
    const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#expBtn')]);
    const fname = dl.suggestedFilename(), leaks = [...where.ls, ...where.ss, where.report, decodeURIComponent(where.report), where.url, where.title, fname].filter(x => x.includes('Zed'));
    ok('Zed: not in a storage key, the report link, the URL, the title or the export file name', !leaks.length && /^companion-save-\d{4}-\d\d-\d\d\.json$/.test(fname) && JSON.stringify(where.ls.sort()) === JSON.stringify([SAVE_KEY]), { leaks, fname, ls: where.ls });
    /* switch back by picking the first row */
    await p.click('#charBtn');
    const rows = await p.evaluate(() => [...document.querySelectorAll('#charRows [data-char]')].map(r => [r.dataset.char, r.querySelector('.lbl').textContent, r.getAttribute('aria-current')]));
    ok('list: both characters by label sorted by name (Zed before the unnamed one), Zed current', JSON.stringify(rows) === JSON.stringify([[zed, 'Zed-assassin-lvl2', 'true'], [TEST_SLOT, 'assassin-lvl22', null]]), rows);
    await Promise.all([p.waitForEvent('load'), p.click(`#charRows [data-char="${TEST_SLOT}"]`)]); await p.waitForTimeout(400);
    const back = JSON.parse(await readRaw(p)), shown = await p.evaluate(k => ({ cur: state.current, lv: char(state).level, q: document.getElementById("questIn").value, rk: document.querySelector(`#gates input[data-k="${k}"]`).checked }), rk);
    ok('switch back: the first character is current and shown (Lv 22, its quest, Zed\'s quest not ticked)', back.current === TEST_SLOT && shown.cur === TEST_SLOT && shown.lv === 22 && shown.q === SAVED.quest && !shown.rk, shown);
    ok('switch back: the first character\'s progress is unchanged', isDeepStrictEqual(back.chars[TEST_SLOT], first), back.chars[TEST_SLOT]);
    ok('switch back: the control shows assassin-lvl22', await label() === 'assassin-lvl22', await label());
    await p.reload(); await p.waitForTimeout(400);
    const after = JSON.parse(await readRaw(p));
    ok('reload: Zed keeps the tick and Lv 2; the first character is still current and unchanged', after.chars[zed].checks[rk] === true && after.chars[zed].level === 2 && after.chars[zed].name === 'Zed' && after.current === TEST_SLOT && isDeepStrictEqual(after.chars[TEST_SLOT], first), after.chars[zed]);
    ok('two characters: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 10b. a Ranger (0.6 P5): picking the class makes a ranger character, and switching characters switches the guide (the
     reload loads that class's tables: stigma plan, skills, board nodes); switching back shows the Assassin's again */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const first = JSON.parse(await readRaw(p)).chars[TEST_SLOT];
    const guide = () => p.evaluate(() => ({ pack: self.DAEVA_PACK, cls: char(state).class, plan: STIGMA_PLAN.slice(), sk: SP_SKILLS_CORE.map(x => x.n).slice(0, 2),
      lbl: document.getElementById('charLbl').textContent, h1: document.querySelector('h1').textContent, rot: !document.querySelector('#statDrawer .sd-rot').hidden, skills: document.getElementById('main').innerText.includes('Snipe'),
      keys: document.getElementById('stackViz').textContent }));
    const a = await guide();
    ok('Assassin guide: its pack, plan and skills', a.pack === 'aion2/asmodian/assassin' && a.cls === 'assassin' && a.plan[0] === "Triniel's Dagger" && a.sk[0] === 'Heart Gore' && a.rot && !a.skills, a);
    await p.click('#charBtn'); await p.click('#charNew'); await p.check('#charPick input[value="ranger"]'); await p.waitForTimeout(50);
    ok('ranger: the form previews ranger-lvl1', await p.innerText('#charPrev') === 'ranger-lvl1', await p.innerText('#charPrev'));
    await Promise.all([p.waitForEvent('load'), p.click('#charCreate')]); await p.waitForTimeout(400);
    const r = await guide(), s = JSON.parse(await readRaw(p)), rid = s.current;
    ok('ranger: a new current slot of class ranger, pack aion2/asmodian/ranger; the first character stored as it was', rid !== TEST_SLOT && s.chars[rid].class === 'ranger' && s.chars[rid].pack === 'aion2/asmodian/ranger' && isDeepStrictEqual(s.chars[TEST_SLOT], first), s.chars[rid]);
    /* 0.7 P11 (#418): the Ranger now has the game's default keys, so the Rotation section shows them (Lv 1: the mouse and 1) */
    ok('ranger: the page runs the Ranger guide (its pack, stigma plan, skills shown; Rotation from its default keys)', r.pack === 'aion2/asmodian/ranger' && r.cls === 'ranger' && JSON.stringify(r.plan) === JSON.stringify(["Vaizel's Authority", 'Bow of Blessing', 'Supporting Fire', 'Griffon Arrow'])
      && r.sk[0] === 'Snipe' && r.skills && r.rot && ['Left click: Snipe', 'Right click: Tempest Shot', '1: Snare Shot'].every(x => r.keys.includes(x)) && !/Quick Slice|Marking Shot|Drill Dart/.test(r.keys)
      && r.lbl === 'ranger-lvl1' && r.h1 === 'Asmodian Ranger Route', r);
    await p.click('#charBtn');
    await Promise.all([p.waitForEvent('load'), p.click(`#charRows [data-char="${TEST_SLOT}"]`)]); await p.waitForTimeout(400);
    const b = await guide();
    ok('switch back: the Assassin guide again, its character unchanged', b.pack === 'aion2/asmodian/assassin' && b.plan[0] === "Triniel's Dagger" && b.lbl === 'assassin-lvl22' && b.h1 === 'Asmodian Assassin Route' && isDeepStrictEqual(JSON.parse(await readRaw(p)).chars[TEST_SLOT], first), b);
    ok('ranger: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 10b'. a Gladiator (0.7 P2): the same for the third class; its Rotation section shows the game's default keys (0.7 P11) */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const first = JSON.parse(await readRaw(p)).chars[TEST_SLOT];
    const guide = () => p.evaluate(() => ({ pack: self.DAEVA_PACK, cls: char(state).class, plan: STIGMA_PLAN.slice(), sk: SP_SKILLS_CORE.map(x => x.n).slice(0, 2),
      lbl: document.getElementById('charLbl').textContent, h1: document.querySelector('h1').textContent, rot: !document.querySelector('#statDrawer .sd-rot').hidden, skills: document.getElementById('main').innerText.includes('Rending Blow'),
      keys: document.getElementById('stackViz').textContent }));
    await p.click('#charBtn'); await p.click('#charNew'); await p.check('#charPick input[value="gladiator"]'); await p.waitForTimeout(50);
    ok('gladiator: the form previews gladiator-lvl1', await p.innerText('#charPrev') === 'gladiator-lvl1', await p.innerText('#charPrev'));
    await Promise.all([p.waitForEvent('load'), p.click('#charCreate')]); await p.waitForTimeout(400);
    const g = await guide(), s = JSON.parse(await readRaw(p)), gid = s.current;
    ok('gladiator: a new current slot of class gladiator, pack aion2/asmodian/gladiator; the first character stored as it was', gid !== TEST_SLOT && s.chars[gid].class === 'gladiator' && s.chars[gid].pack === 'aion2/asmodian/gladiator' && isDeepStrictEqual(s.chars[TEST_SLOT], first), s.chars[gid]);
    /* 0.7 P11 (#418): the game's default keys, so a Rotation section (Lv 1: the mouse and 1) */
    ok('gladiator: the page runs the Gladiator guide (its pack, stigma plan, skills shown; Rotation from its default keys)', g.pack === 'aion2/asmodian/gladiator' && g.cls === 'gladiator' && JSON.stringify(g.plan) === JSON.stringify(['Lunge Stance', "Zikel's Blessing", 'Lifestealing Blade', 'Rage Burst'])
      && JSON.stringify(g.sk) === JSON.stringify(['Rending Blow', 'Overhead Slam']) && g.skills && g.rot
      && ['Left click: Keen Strike', 'Right click: Rending Blow', '1: Leaping Slam'].every(x => g.keys.includes(x)) && !/Quick Slice|Overhead Slam/.test(g.keys) && g.lbl === 'gladiator-lvl1' && g.h1 === 'Asmodian Gladiator Route', g);
    await p.click('#charBtn');
    await Promise.all([p.waitForEvent('load'), p.click(`#charRows [data-char="${TEST_SLOT}"]`)]); await p.waitForTimeout(400);
    const b = await guide();
    ok('gladiator, switch back: the Assassin guide again, its character unchanged', b.pack === 'aion2/asmodian/assassin' && b.plan[0] === "Triniel's Dagger" && b.lbl === 'assassin-lvl22' && b.h1 === 'Asmodian Assassin Route' && isDeepStrictEqual(JSON.parse(await readRaw(p)).chars[TEST_SLOT], first), b);
    ok('gladiator: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 10b''. a Spiritmaster (0.7 P4): the same for the fourth class; no key setup either, so no Rotation section, and the
     Build plan card states the three skills that fire only on a condition */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const first = JSON.parse(await readRaw(p)).chars[TEST_SLOT];
    const guide = () => p.evaluate(() => ({ pack: self.DAEVA_PACK, cls: char(state).class, plan: STIGMA_PLAN.slice(), sk: SP_SKILLS_CORE.map(x => x.n).slice(0, 2),
      lbl: document.getElementById('charLbl').textContent, h1: document.querySelector('h1').textContent, rot: !document.querySelector('#statDrawer .sd-rot').hidden, skills: document.getElementById('main').innerText.includes('Cold Shock'),
      triggers: STEPS.some(g => g.items.some(i => i.k === 'build:triggers' && i.t.includes('Three skills only fire on a condition'))) }));
    await p.click('#charBtn'); await p.click('#charNew'); await p.check('#charPick input[value="spiritmaster"]'); await p.waitForTimeout(50);
    ok('spiritmaster: the form previews spiritmaster-lvl1', await p.innerText('#charPrev') === 'spiritmaster-lvl1', await p.innerText('#charPrev'));
    await Promise.all([p.waitForEvent('load'), p.click('#charCreate')]); await p.waitForTimeout(400);
    const m = await guide(), s = JSON.parse(await readRaw(p)), mid = s.current;
    ok('spiritmaster: a new current slot of class spiritmaster, pack aion2/asmodian/spiritmaster; the first character stored as it was', mid !== TEST_SLOT && s.chars[mid].class === 'spiritmaster' && s.chars[mid].pack === 'aion2/asmodian/spiritmaster' && isDeepStrictEqual(s.chars[TEST_SLOT], first), s.chars[mid]);
    ok('spiritmaster: the page runs the Spiritmaster guide (its pack, stigma plan, skills shown, the conditions step; no Rotation section)', m.pack === 'aion2/asmodian/spiritmaster' && m.cls === 'spiritmaster'
      && JSON.stringify(m.plan) === JSON.stringify(['Summon: Ancient Spirit', "Enhance: Spirit's Benediction", 'Jointstrike: Corrode', 'Flame Blessing'])
      && JSON.stringify(m.sk) === JSON.stringify(['Cold Shock', 'Combustion']) && m.skills && m.triggers && !m.rot && m.lbl === 'spiritmaster-lvl1' && m.h1 === 'Asmodian Spiritmaster Route', m);
    await p.click('#charBtn');
    await Promise.all([p.waitForEvent('load'), p.click(`#charRows [data-char="${TEST_SLOT}"]`)]); await p.waitForTimeout(400);
    const b = await guide();
    ok('spiritmaster, switch back: the Assassin guide again (no conditions step), its character unchanged', b.pack === 'aion2/asmodian/assassin' && b.plan[0] === "Triniel's Dagger" && !b.triggers && b.lbl === 'assassin-lvl22' && b.h1 === 'Asmodian Assassin Route' && isDeepStrictEqual(JSON.parse(await readRaw(p)).chars[TEST_SLOT], first), b);
    ok('spiritmaster: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 10b'''. a Templar (0.8 P3): the same for the fifth class; its Rotation section shows the game's default keys (the
     owner's Templar screen) and the Build plan card states the five skills that fire only on a condition */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const first = JSON.parse(await readRaw(p)).chars[TEST_SLOT];
    const guide = () => p.evaluate(() => ({ pack: self.DAEVA_PACK, cls: char(state).class, plan: STIGMA_PLAN.slice(), sk: SP_SKILLS_CORE.map(x => x.n).slice(0, 2),
      lbl: document.getElementById('charLbl').textContent, h1: document.querySelector('h1').textContent, rot: !document.querySelector('#statDrawer .sd-rot').hidden, skills: document.getElementById('main').innerText.includes('Vicious Strike'),
      keys: document.getElementById('stackViz').textContent,
      triggers: STEPS.some(g => g.items.some(i => i.k === 'build:triggers' && i.t.includes('Five skills only fire on a condition'))) }));
    await p.click('#charBtn'); await p.click('#charNew'); await p.check('#charPick input[value="templar"]'); await p.waitForTimeout(50);
    ok('templar: the form previews templar-lvl1', await p.innerText('#charPrev') === 'templar-lvl1', await p.innerText('#charPrev'));
    await Promise.all([p.waitForEvent('load'), p.click('#charCreate')]); await p.waitForTimeout(400);
    const t = await guide(), s = JSON.parse(await readRaw(p)), tid = s.current;
    ok('templar: a new current slot of class templar, pack aion2/asmodian/templar; the first character stored as it was', tid !== TEST_SLOT && s.chars[tid].class === 'templar' && s.chars[tid].pack === 'aion2/asmodian/templar' && isDeepStrictEqual(s.chars[TEST_SLOT], first), s.chars[tid]);
    ok('templar: the page runs the Templar guide (its pack, stigma plan, skills shown, the conditions step; Rotation from its default keys)', t.pack === 'aion2/asmodian/templar' && t.cls === 'templar'
      && JSON.stringify(t.plan) === JSON.stringify(['Taunt', "Empyrean Lord's Punishment", 'Battlefield Banner', 'Doom Shield'])
      && JSON.stringify(t.sk) === JSON.stringify(['Judgment', 'Vicious Strike']) && t.skills && t.triggers && t.rot
      && ['Left click: Vicious Strike', 'Right click: Pummel', '1: Poach'].every(x => t.keys.includes(x)) && !/Quick Slice|Judgment|Rending Blow/.test(t.keys) && t.lbl === 'templar-lvl1' && t.h1 === 'Asmodian Templar Route', t);
    await p.click('#charBtn');
    await Promise.all([p.waitForEvent('load'), p.click(`#charRows [data-char="${TEST_SLOT}"]`)]); await p.waitForTimeout(400);
    const b = await guide();
    ok('templar, switch back: the Assassin guide again (no conditions step), its character unchanged', b.pack === 'aion2/asmodian/assassin' && b.plan[0] === "Triniel's Dagger" && !b.triggers && b.lbl === 'assassin-lvl22' && b.h1 === 'Asmodian Assassin Route' && isDeepStrictEqual(JSON.parse(await readRaw(p)).chars[TEST_SLOT], first), b);
    ok('templar: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 10c. the site's classes (0.7 A1; the claude.ai build's class list went with that build in 0.7 P9): the site sets no class
     list, offers every playable class, and a Ranger save loads its own guide with no note */
  {
    const { ctx, p, errs } = await page();
    const ranger = toStored(SAVED); Object.assign(ranger.chars[TEST_SLOT], { pack: 'aion2/asmodian/ranger', class: 'ranger' });
    const look = async () => { await p.click('#charBtn'); await p.click('#charNew'); await p.waitForTimeout(50);
      const r = await p.evaluate(() => ({ pack: self.DAEVA_PACK, radios: [...document.querySelectorAll('#charPick input[type=radio]')].map(x => x.value),
        note: (n => n && { text: n.textContent, shown: !!n.offsetParent, after: n.previousElementSibling && n.previousElementSibling.id })(document.getElementById('charNote')), lbl: document.getElementById('charLbl').textContent }));
      await p.click('#charCancel'); await p.keyboard.press('Escape'); return r; };
    await p.goto(CFG.CUR); await writeRaw(p, JSON.stringify(ranger), { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const site = await look();
    ok('site classes: the picker offers every playable class (the Gladiator too, 0.7 P2; the Spiritmaster, 0.7 P4; the Templar, 0.8 P3) and shows no note',JSON.stringify(site.radios) === JSON.stringify(['assassin', 'ranger', 'gladiator', 'spiritmaster', 'templar']) && !site.note && site.pack === 'aion2/asmodian/ranger', site);
    ok('site classes: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* a stored save with more slots: copies of the test slot under other ids, with their own level, quest and name */
  const B = '00000000-0000-4000-8000-0000000000b2', C = '00000000-0000-4000-8000-0000000000c3';
  const multi = (extra, current = TEST_SLOT) => {
    const s = toStored(SAVED);
    for (const [id, f] of extra) s.chars[id] = { ...JSON.parse(JSON.stringify(s.chars[TEST_SLOT])), id, ...f };
    s.current = current; return s;
  };
  const rowsOf = p => p.evaluate(() => [...document.querySelectorAll('#charRows li')].map(li => {
    const b = li.querySelector('[data-char]'), rn = li.querySelector('[data-rename]'), rm = li.querySelector('[data-remove]');
    return { id: b && b.dataset.char, lbl: b && b.querySelector('.lbl').textContent, cur: b && b.getAttribute('aria-current'), rename: rn && rn.getAttribute('aria-label'), remove: rm && rm.getAttribute('aria-label') };
  }));
  /* where two stored saves differ (paths), for a failing check's detail */
  const diffPaths = (x, y, at = '') => {
    if (JSON.stringify(x) === JSON.stringify(y)) return [];
    if (!x || !y || typeof x !== 'object' || typeof y !== 'object') return [`${at}: ${JSON.stringify(x)} → ${JSON.stringify(y)}`];
    return [...new Set([...Object.keys(x), ...Object.keys(y)])].flatMap(k => diffPaths(x[k], y[k], at + '.' + k));
  };
  const focusOf = p => p.evaluate(() => { const a = document.activeElement; return a && (a.id || a.dataset.rename && 'rename:' + a.dataset.rename || a.dataset.remove && 'remove:' + a.dataset.remove || a.tagName); });
  /* 11. rename */
  {
    const { ctx, p, errs } = await page();
    const s0 = multi([[B, { level: 40, quest: 'Forgotten Commander', name: 'Quin' }]]);
    await writeRaw(p, JSON.stringify(s0), { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const raw0 = await readRaw(p);
    await p.click('#charBtn');
    const rows = await rowsOf(p);
    ok('rename: each row has Rename and Remove, spoken with its label', JSON.stringify(rows) === JSON.stringify([
      { id: B, lbl: 'Quin-assassin-lvl40', cur: null, rename: 'Rename Quin-assassin-lvl40', remove: 'Remove Quin-assassin-lvl40' },
      { id: TEST_SLOT, lbl: 'assassin-lvl22', cur: 'true', rename: 'Rename assassin-lvl22', remove: 'Remove assassin-lvl22' }]), rows);
    await p.click(`[data-rename="${B}"]`); await p.waitForTimeout(100);
    const f = await p.evaluate(() => { const i = document.getElementById('charRen'); return { focus: document.activeElement === i, value: i.value,
      label: document.querySelector('label[for="charRen"]').textContent, hint: document.getElementById(i.getAttribute('aria-describedby')).textContent,
      save: document.getElementById('charRenSave').textContent, rows: document.querySelectorAll('#charRows [data-char]').length }; });
    ok('rename: the row becomes a field named "Rename Quin-assassin-lvl40", focused, holding the name', f.focus && f.value === 'Quin' && f.label === 'Rename Quin-assassin-lvl40' && /Leave empty to show no name/.test(f.hint) && f.save === 'Save name' && f.rows === 1, f);
    await p.keyboard.type('Nyx'); await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    ok('rename: Escape cancels: the row is back, focus on its Rename, the list stays open, nothing saved',
      !(await p.$('#charRen')) && await focusOf(p) === 'rename:' + B && !(await p.evaluate(() => document.getElementById('charPop').hidden)) && await readRaw(p) === raw0 && (await rowsOf(p))[0].lbl === 'Quin-assassin-lvl40', await focusOf(p));
    await p.click(`[data-rename="${B}"]`); await p.click('#charRenCancel'); await p.waitForTimeout(100);
    ok('rename: Cancel goes back to the row, nothing saved', !(await p.$('#charRen')) && await readRaw(p) === raw0);
    await p.click(`[data-rename="${B}"]`); await p.fill('#charRen', '  Nyx ');
    await Promise.all([p.waitForEvent('load'), p.keyboard.press('Enter')]); await p.waitForTimeout(400);
    /* the rename's change time (mt.name = [t, name], 0.6 P21: merge() keeps the later rename) is the page's clock: taken
       from the stored save after checking it is a dated stamp of the new name */
    const nameStampOf = (raw, id) => { const s = raw && JSON.parse(raw).chars[id].mt.name; return Array.isArray(s) && s.length === 2 && Number.isInteger(s[0]) && s[0] > 1.7e9 ? s : null; };
    const want = JSON.parse(raw0); want.chars[B].name = 'Nyx';
    await p.reload(); await p.waitForTimeout(400);
    const raw1 = await readRaw(p), st1 = nameStampOf(raw1, B); want.chars[B].mt.name = st1;
    ok('rename: after a reload the stored save differs only in that slot\'s name (trimmed) and its stamp', st1 && st1[1] === 'Nyx' && raw1 === JSON.stringify(want), raw1 && diffPaths(want, JSON.parse(raw1)));
    await p.click('#charBtn');
    const rows1 = await rowsOf(p);
    ok('rename: the list shows Nyx-assassin-lvl40; the current character and the control are unchanged', rows1[0].lbl === 'Nyx-assassin-lvl40' && rows1[1].cur === 'true' && await p.evaluate(() => document.getElementById('charLbl').textContent) === 'assassin-lvl22', rows1);
    await p.click(`[data-rename="${TEST_SLOT}"]`); await p.fill('#charRen', 'Zed');
    await Promise.all([p.waitForEvent('load'), p.click('#charRenSave')]); await p.waitForTimeout(400);
    const raw2 = await readRaw(p), st2 = nameStampOf(raw2, TEST_SLOT);
    const want2 = JSON.parse(raw1); want2.chars[TEST_SLOT].name = 'Zed'; want2.chars[TEST_SLOT].mt.name = st2;
    ok('rename the current character: the control shows Zed-assassin-lvl22; only its name (and its stamp) changed', await p.evaluate(() => document.getElementById('charLbl').textContent) === 'Zed-assassin-lvl22' && st2 && st2[1] === 'Zed' && raw2 === JSON.stringify(want2), raw2 && diffPaths(want2, JSON.parse(raw2)));
    ok('rename: "Nyx" and "Zed" in no storage key, URL or title', await p.evaluate(() => [...Object.keys(localStorage), location.href, document.title].every(x => !/Nyx|Zed/.test(x))));
    ok('rename: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 11b. the list is sorted by name (case-insensitive, ties by slot id, unnamed last); the stored order is untouched */
  {
    const { ctx, p, errs } = await page();
    const D = '00000000-0000-4000-8000-0000000000d4';
    const s0 = multi([[B, { name: 'bravo' }], [C, { name: 'Alpha' }], [D, { name: 'alpha' }]]);
    await writeRaw(p, JSON.stringify(s0), { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const raw0 = await readRaw(p);
    await p.click('#charBtn');
    const ids = (await rowsOf(p)).map(r => r.id);
    ok('sorted list: Alpha / alpha (by slot id) / bravo / the unnamed one', JSON.stringify(ids) === JSON.stringify([C, D, B, TEST_SLOT]), ids);
    ok('sorted list: the stored chars order is byte-identical after opening the list', await readRaw(p) === raw0 && JSON.stringify(Object.keys(JSON.parse(await readRaw(p)).chars)) === JSON.stringify([TEST_SLOT, B, C, D]));
    ok('sorted list: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 12. remove */
  {
    const { ctx, p, errs } = await page();
    await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    await p.click('#charBtn');
    const one = await rowsOf(p);
    ok('remove: with one character no Remove is offered (Rename is)', one.length === 1 && one[0].remove === null && one[0].rename === 'Rename assassin-lvl22' && !(await p.$('#charRows [data-remove]')), one);
    /* A and B have each been shown once as current (the page's first-view writes, e.g. rotSeen, are done), B is current */
    const s0 = multi([[B, { level: 27, name: 'Zed' }], [C, { level: 40, quest: 'Forgotten Commander', name: 'Quin' }]]);
    await writeRaw(p, JSON.stringify(s0), { fresh: true }); await p.reload(); await p.waitForTimeout(400);
    const seen = JSON.parse(await readRaw(p)); seen.current = B;
    await writeRaw(p, JSON.stringify(seen)); await p.reload(); await p.waitForTimeout(400);
    const raw0 = await readRaw(p);
    await p.click('#charBtn'); await p.click(`[data-remove="${C}"]`); await p.waitForTimeout(100);
    const d = await p.evaluate(() => { const g = document.getElementById('charDlg');
      return { open: g.open, modal: g.matches(':modal'), role: g.getAttribute('role'), name: document.getElementById(g.getAttribute('aria-labelledby')).textContent,
        desc: document.getElementById(g.getAttribute('aria-describedby')).textContent, focus: document.activeElement.id, btns: [...g.querySelectorAll('button')].map(b => b.textContent) }; });
    ok('remove: the confirmation is a modal alertdialog named "Remove Quin-assassin-lvl40?"', d.open && d.modal && d.role === 'alertdialog' && d.name === 'Remove Quin-assassin-lvl40?', d);
    ok('remove: it says the progress is deleted from this browser; "Keep it" first and focused, then Remove', /^Its progress is deleted from this browser\./.test(d.desc) && d.focus === 'charKeep' && JSON.stringify(d.btns) === JSON.stringify(['Keep it', 'Remove']), d);
    await p.keyboard.press('Escape'); await p.waitForTimeout(100);
    const e1 = await p.evaluate(() => ({ dlg: document.getElementById('charDlg').open, list: !document.getElementById('charPop').hidden }));
    ok('remove: Escape cancels: the dialog closes, the list stays, focus on that row\'s Remove, nothing saved', !e1.dlg && e1.list && await focusOf(p) === 'remove:' + C && await readRaw(p) === raw0, e1);
    await p.click(`[data-remove="${C}"]`); await p.click('#charKeep'); await p.waitForTimeout(100);
    ok('remove: Keep it cancels, nothing saved', !(await p.evaluate(() => document.getElementById('charDlg').open)) && await readRaw(p) === raw0 && (await rowsOf(p)).length === 3);
    /* a non-current one: C goes, B stays current, A and B byte-identical */
    await p.click(`[data-remove="${C}"]`);
    await Promise.all([p.waitForEvent('load'), p.click('#charRemove')]); await p.waitForTimeout(400);
    await p.reload(); await p.waitForTimeout(400);
    /* 0.6 P20: the slot keeps a tombstone { id, deletedAt } (the time of the click, ms) so merge() never brings it back */
    const raw1 = await readRaw(p), tomb1 = raw1 && JSON.parse(raw1).chars[C];
    const want1 = JSON.parse(raw0); want1.chars[C] = { id: C, deletedAt: tomb1 && tomb1.deletedAt };
    ok('remove a non-current character: its slot is a dated tombstone, the rest of the save byte-identical, still current after a reload', raw1 === JSON.stringify(want1) && tomb1.deletedAt > 1.7e12 && await p.evaluate(() => state.current) === B, raw1 && diffPaths(want1, JSON.parse(raw1)));
    /* the current one: B goes, the first remaining slot (A) becomes current */
    await p.click('#charBtn');
    ok('remove: the list now shows Zed (current) and A (unnamed, last)', JSON.stringify((await rowsOf(p)).map(r => [r.lbl, r.cur])) === JSON.stringify([['Zed-assassin-lvl27', 'true'], ['assassin-lvl22', null]]));
    await p.click(`[data-remove="${B}"]`);
    ok('remove the current character: the confirmation names it', await p.innerText('#charDlgHead') === 'Remove Zed-assassin-lvl27?');
    await Promise.all([p.waitForEvent('load'), p.click('#charRemove')]); await p.waitForTimeout(400);
    await p.reload(); await p.waitForTimeout(400);
    const raw2 = await readRaw(p), tomb2 = raw2 && JSON.parse(raw2).chars[B];
    const want2 = JSON.parse(raw1); want2.chars[B] = { id: B, deletedAt: tomb2 && tomb2.deletedAt }; want2.current = TEST_SLOT;
    const shown = await p.evaluate(() => ({ cur: state.current, lv: char(state).level, q: document.getElementById('questIn').value, lbl: document.getElementById('charLbl').textContent }));
    ok('remove the current character: its slot is a dated tombstone, the first remaining is current, the rest byte-identical (after a reload)', raw2 === JSON.stringify(want2) && tomb2.deletedAt >= tomb1.deletedAt, raw2 && diffPaths(want2, JSON.parse(raw2)));
    ok('remove the current character: the page shows the remaining one (assassin-lvl22, Lv 22, its quest)', shown.cur === TEST_SLOT && shown.lv === 22 && shown.q === SAVED.quest && shown.lbl === 'assassin-lvl22', shown);
    await p.click('#charBtn');
    ok('remove: back to one character, no Remove offered', (await rowsOf(p)).length === 1 && !(await p.$('#charRows [data-remove]')));
    ok('remove: only the v5 key exists', JSON.stringify(await keys(p)) === JSON.stringify([SAVE_KEY]), await keys(p));
    ok('remove: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 13. phone folds (0.5 P6): a fresh browser at 390 px writes no fold key; opening one adds only its fold_<id> (a view
     setting: savedAt unchanged), which a reload keeps; at 1500 px the save with fold keys renders as one without */
  {
    const { ctx, p, errs } = await page();
    await p.setViewportSize({ width: 390, height: 850 }); await clearSave(p); await p.reload(); await p.waitForTimeout(400);
    await p.click('#lvlUp'); await p.waitForTimeout(150);
    await p.reload(); await p.waitForTimeout(400); /* a stored save to compare against (the first load writes the open milestone) */
    const raw0 = await readRaw(p), s0 = JSON.parse(raw0);
    ok('folds: a fresh save has no fold_* key, Dungeons & Strongholds folded', !Object.keys(s0).some(k => k.startsWith('fold_')) && await p.evaluate(() => !document.getElementById('areasFold').open));
    await p.click('#areasFold > summary'); await p.waitForTimeout(200);
    const raw1 = await readRaw(p), want = { ...s0, fold_areasFold: true };
    ok('folds: opening one stores only fold_areasFold: true', isDeepStrictEqual(JSON.parse(raw1), want), diffPaths(want, JSON.parse(raw1)));
    await p.reload(); await p.waitForTimeout(400);
    ok('folds: after a reload it is still open and the save byte-identical', await p.evaluate(() => document.getElementById('areasFold').open) && await readRaw(p) === raw1);
    await p.click('#areasFold > summary'); await p.waitForTimeout(200);
    ok('folds: closing it stores fold_areasFold: false, nothing else', isDeepStrictEqual(JSON.parse(await readRaw(p)), { ...s0, fold_areasFold: false }));
    await writeRaw(p, JSON.stringify({ ...JSON.parse(raw1), fold_progFold: true }));
    await p.setViewportSize({ width: 1500, height: 1000 }); await p.reload(); await p.waitForTimeout(400);
    const withKeys = await p.evaluate(() => document.querySelector('.layout').innerHTML);
    await writeRaw(p, raw0); await p.reload(); await p.waitForTimeout(400);
    ok('folds: at 1500 px a save with fold_* keys renders as one without (no fold, same markup)', withKeys === await p.evaluate(() => document.querySelector('.layout').innerHTML) && !withKeys.includes('areasFold') && !withKeys.includes('progFold'));
    ok('folds: no page errors', !errs.length, errs);
    await ctx.close();
  }
  /* 14. first-run welcome (0.6 P17, S1 §1.1): once per browser; joining at Lv N sets the level and the story quest only */
  {
    const shown = p => p.evaluate(() => { const el = document.getElementById('welcomeCard'); return !!el && !el.hidden && el.getBoundingClientRect().height > 0; });
    const step = p => p.evaluate(() => ({ intro: !document.getElementById('welIntro').hidden, form: !document.getElementById('welForm').hidden }));
    /* the first story quest at a level or above (the join step's pre-fill), from the page's story */
    const questAt = (p, lv) => p.evaluate(lv => (QUESTS.find(([l]) => l >= lv) || QUESTS[QUESTS.length - 1])[1], lv);
    const setJoinLv = (p, lv) => p.evaluate(lv => { const r = document.getElementById('welLv'); r.value = String(lv); r.dispatchEvent(new Event('input', { bubbles: true })); }, lv);
    /* the character without what differs between two browsers (slot id, creation time, change times) */
    const progress = p => p.evaluate(() => { const { id, created, mt, ...c } = char(state); return c; });
    {
      const { ctx, p, errs } = await page();
      await clearSave(p); await p.reload(); await p.waitForTimeout(400);
      const txt = await p.evaluate(() => document.getElementById('welcomeCard').textContent);
      ok('welcome: a fresh browser shows it, on its first step', await shown(p) && (await step(p)).intro && !(await step(p)).form);
      ok('welcome: says unofficial and "not affiliated with or endorsed by NCSoft"', /Unofficial/.test(txt) && /not affiliated with or endorsed by NCSoft/i.test(txt), txt);
      const before = await progress(p);
      await p.click('#welStart'); await p.waitForTimeout(200);
      const st = JSON.parse(await readRaw(p));
      ok('welcome: Start at Lv 1 hides it and writes welcomed: 1 (top-level)', !(await shown(p)) && st.welcomed === 1 && !('welcomed' in st.chars[st.current]), st.welcomed);
      ok('welcome: Start at Lv 1 leaves the character as it was', isDeepStrictEqual(await progress(p), before), [before, await progress(p)]);
      await p.reload(); await p.waitForTimeout(400);
      ok('welcome: after a reload it stays gone (welcomed: 1 kept)', !(await shown(p)) && JSON.parse(await readRaw(p)).welcomed === 1);
      ok('welcome: no page errors', !errs.length, errs);
      await ctx.close();
    }
    {
      const { ctx, p } = await page();
      await writeSave(p, SAVED, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
      const raw = await readRaw(p);
      ok('welcome: a save from before it (Lv 22, ticks, no welcomed) never shows it, and nothing is written', !(await shown(p)) && await readRaw(p) === raw);
      await writeSave(p, { level: 1, quest: await questAt(p, 1), checks: {}, open: {} }, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
      ok('welcome: a save at Lv 1 with nothing ticked and no welcomed shows it', await shown(p));
      await ctx.close();
    }
    /* joined at Lv 20 vs played through: Level up 19 times, the story quest set in Journey */
    {
      const a = await page(); await clearSave(a.p); await a.p.reload(); await a.p.waitForTimeout(400);
      const q20 = await questAt(a.p, 20);
      await a.p.click('#welJoin'); await a.p.waitForTimeout(100);
      ok('join: the second step replaces the first, focus on the level', !(await step(a.p)).intro && (await step(a.p)).form && await a.p.evaluate(() => document.activeElement.id) === 'welLv');
      await setJoinLv(a.p, 20);
      const pre = await a.p.evaluate(() => ({ q: document.getElementById('welQuest').value, go: document.getElementById('welGo').textContent, out: document.getElementById('welLvOut').textContent }));
      ok('join: Lv 20 pre-fills the first story quest at Lv 20 and the button says Start at Lv 20', pre.q === q20 && pre.go === 'Start at Lv 20' && pre.out === 'Lv 20', [pre, q20]);
      await a.p.click('#welGo'); await a.p.waitForTimeout(400);
      const st = JSON.parse(await readRaw(a.p)), c = st.chars[st.current];
      ok('join: the save gets welcomed 1, level 20 and the quest; no ticks, no snoozes', st.welcomed === 1 && c.level === 20 && c.quest === q20 && !Object.keys(c.checks).length && !c.rqSnooze, { welcomed: st.welcomed, level: c.level, quest: c.quest, checks: c.checks });
      ok('join: the welcome is gone', !(await shown(a.p)));
      await a.p.reload(); await a.p.waitForTimeout(400);
      ok('join: after a reload the welcome stays gone, Lv 20 kept', !(await shown(a.p)) && await a.p.evaluate(() => char(state).level) === 20);
      const b2 = await page(); await clearSave(b2.p); await b2.p.reload(); await b2.p.waitForTimeout(400);
      await b2.p.click('#welStart'); await b2.p.waitForTimeout(100);
      for (let i = 0; i < 19; i++) await b2.p.click('#lvlUpBig');
      await b2.p.fill('#questIn', q20); await b2.p.dispatchEvent('#questIn', 'change'); await b2.p.waitForTimeout(400);
      const [pa, pb] = [await progress(a.p), await progress(b2.p)];
      ok('join at Lv 20: the character equals a played-through Lv 20 one (Level up ×19, quest set)', pb.level === 20 && isDeepStrictEqual(pa, pb), [pa, pb]);
      const [na, nb] = [await a.p.innerText('#nowStar'), await b2.p.innerText('#nowStar')];
      ok('join at Lv 20: Next up equals the played-through Lv 20 state\'s', na.length > 0 && na === nb, [na.slice(0, 300), nb.slice(0, 300)]);
      ok('join: no page errors', !a.errs.length && !b2.errs.length, [a.errs, b2.errs]);
      await a.ctx.close(); await b2.ctx.close();
    }
    /* a new character opens the welcome on its join step (S1: the same screen serves New character) */
    {
      const { ctx, p, errs } = await page();
      await writeSave(p, { ...SAVED, welcomed: 1 }, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
      const first = JSON.parse(await readRaw(p)).chars[TEST_SLOT];
      await p.click('#charBtn'); await p.click('#charNew');
      await Promise.all([p.waitForEvent('load'), p.click('#charCreate')]); await p.waitForTimeout(400);
      ok('new character: the welcome opens on the join step', await shown(p) && !(await step(p)).intro && (await step(p)).form);
      const labels = await p.evaluate(() => [...document.querySelectorAll('#welForm button')].filter(b => b.offsetParent).map(b => b.textContent.trim()));
      ok('new character: no two buttons on the level step carry the same text', labels.length === 2 && new Set(labels).size === labels.length && labels.includes('Skip, start fresh'), labels);
      await setJoinLv(p, 12); const q12 = await questAt(p, 12);
      await p.click('#welGo'); await p.waitForTimeout(400);
      const st = JSON.parse(await readRaw(p)), c = st.chars[st.current];
      ok('new character: joined at Lv 12 on the pre-filled quest; the first character unchanged', st.current !== TEST_SLOT && c.level === 12 && c.quest === q12 && st.welcomed === 1 && isDeepStrictEqual(st.chars[TEST_SLOT], first), { level: c.level, quest: c.quest, q12 });
      ok('new character: no page errors', !errs.length, errs);
      await ctx.close();
    }
    /* the skip button of a new character saves what Start at Lv 1 saved: welcomed 1, the character as created */
    {
      const { ctx, p, errs } = await page();
      await writeSave(p, { ...SAVED, welcomed: 1 }, { fresh: true }); await p.reload(); await p.waitForTimeout(400);
      await p.click('#charBtn'); await p.click('#charNew');
      await Promise.all([p.waitForEvent('load'), p.click('#charCreate')]); await p.waitForTimeout(400);
      const before = await progress(p);
      await p.click('#welBack'); await p.waitForTimeout(300);
      const st = JSON.parse(await readRaw(p)), c = st.chars[st.current];
      ok('new character: Skip, start fresh hides the welcome, writes welcomed 1, leaves the Lv 1 character as created', !(await shown(p)) && st.welcomed === 1 && c.level === 1 && !Object.keys(c.checks).length && isDeepStrictEqual(await progress(p), before), { welcomed: st.welcomed, level: c.level });
      ok('new character: skip path has no page errors', !errs.length, errs);
      await ctx.close();
    }
  }
  /* 15. auto level-up (0.6 P19, owner-ok-autolevel 2026-10-17): turning in a story quest with levelsUp (QUESTS [lv, name,
     true]) at Lv lv − 1 raises the level by one, with an Undo in the toast; stepping back onto it lowers it again; at a
     higher level, or on a quest without levelsUp, the level stays */
  {
    const { ctx, p, errs } = await page();
    const lu = await p.evaluate(() => QUESTS.filter(q => q[2] === true).map(q => [q[0], q[1], QUESTS.findIndex(x => x[1] === q[1])]));
    ok('levelsUp: today one quest, "A Village in the Fog" (Lv 2), the first story quest', JSON.stringify(lu) === JSON.stringify([[2, 'A Village in the Fog', 0]]), lu);
    const [lv, q0] = lu[0] || [2, ''], q1 = await p.evaluate(() => QUESTS[1][1]);
    const at = async (level, quest) => { await writeSave(p, { level, quest, checks: {}, open: {}, welcomed: 1 }, { fresh: true }); await p.reload(); await p.waitForTimeout(400); };
    const turnIn = async () => { const btn = p.locator('#nowStar [data-now="story"]').first(); if (!(await btn.count())) return false; await btn.click(); await p.waitForTimeout(800); return true; };
    const cur = () => p.evaluate(k => ({ level: char(state).level, quest: char(state).quest, stored: (s => s.chars[s.current].level)(JSON.parse(localStorage.getItem(k))), toast: (document.querySelector('#rwToast.has-undo') || {}).textContent || '' }), SAVE_KEY);
    await at(lv - 1, q0);
    ok('levelsUp: Next up offers "Turned in" on it at Lv ' + (lv - 1), await turnIn());
    let s = await cur();
    ok(`levelsUp: turned in at Lv ${lv - 1} → Lv ${lv} (saved), the story on the next quest, a toast with Undo`, s.level === lv && s.stored === lv && s.quest === q1 && /Undo/.test(s.toast), s);
    await p.click('#rwToast .tu'); await p.waitForTimeout(400); s = await cur();
    ok(`levelsUp: Undo → back to Lv ${lv - 1} (saved) on the quest`, s.level === lv - 1 && s.stored === lv - 1 && s.quest === q0, s);
    await turnIn(); await p.click('#questPrev .st-name'); await p.waitForTimeout(400); s = await cur();
    ok(`levelsUp: turned in again, then the story stepped back onto it (untick) → Lv ${lv - 1}`, s.level === lv - 1 && s.stored === lv - 1 && s.quest === q0, s);
    await at(lv, q0); await turnIn(); s = await cur();
    ok(`levelsUp: turned in at a higher level (Lv ${lv}) → no change, no Undo toast`, s.level === lv && s.stored === lv && s.quest === q1 && !s.toast, s);
    await p.click('#questPrev .st-name'); await p.waitForTimeout(400); s = await cur();
    ok(`levelsUp: stepping back onto it at Lv ${lv} lowers it (the untick of the level it gives)`, s.level === lv - 1 && s.quest === q0, s);
    await at(lv, q1); await turnIn(); s = await cur();
    ok('levelsUp: a quest without levelsUp → the level stays', s.level === lv && s.stored === lv && !s.toast, s);
    await at(lv - 1, q0); await p.click('#lvlUpBig'); await p.waitForTimeout(200); await p.click('#lvlDown'); await p.waitForTimeout(200); s = await cur();
    ok('levelsUp: Level up and − unchanged (one each way, the story stays)', s.level === lv - 1 && s.quest === q0, s);
    ok('levelsUp: no page errors', !errs.length, errs);
    await ctx.close();
  }
  await b.close();
  console.log(fail ? `SAVE CHECKS FAILED: ${fail}` : 'SAVE CHECKS PASSED');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('SAVE CHECKS FAILED: exception'); process.exit(1); });
