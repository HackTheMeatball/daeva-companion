/* Unverified values carry their label (0.8 P20, #509). node tests/labels.js  (page at AION_BASE; see tests/config.js)
   Reads every label from the data itself (each record's fieldStatus, else its status; no pinned counts: research batches
   keep changing them) and checks each field players see: a disputed / owner-check value shows "check in game", an inferred
   one "inferred", and a verified (or single-source, which keeps its own tags) value shows no such tag.
   Fields: a regional quest's zone (milestone row; Next up's regional quest list, where the zone is in the tooltip), a
   stronghold's level range (Dungeons & Strongholds), a Sealed Dungeon's entrance (Next up), a skill's learn level (Skills
   card; every guide pack's compiled tables). Story quest zones never show as text, so they have no tag to check. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const ROOT = path.resolve(__dirname, '..'); const CFG = require('./config');
const { buildFixture } = require('./support/regress-fixture'); const { writeSave } = require('./support/save');
let fail = 0, n = 0; const ok = (name, c, d) => { n++; console.log((c ? 'ok   ' : 'FAIL ') + name + (!c && d !== undefined ? '  · ' + JSON.stringify(d).slice(0, 700) : '')); if (!c) fail++; };
const recs = rel => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'packs', rel), 'utf8')).records;
const statusOf = (r, f) => (r.fieldStatus || {})[f] ?? r.status;
const TAG = { disputed: 'check in game', 'owner-check': 'check in game', inferred: 'inferred' };
const want = (r, f) => TAG[statusOf(r, f)] || null;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1500, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(CFG.CUR);
  const st = await p.evaluate(buildFixture, { L: 20, mode: 'advanced', fx: 'clean' }); st.areaLv = 'sh';
  await writeSave(p, st); await p.reload(); await p.waitForTimeout(400);

  /* regional quests: the milestone row's zone is followed by its tag; Next up's tooltip names it after the zone */
  const rqs = recs('aion2/asmodian/regional-quests.json');
  ok('the data has unverified regional quest zones to check (disputed and inferred)', rqs.some(q => statusOf(q, 'zone') === 'disputed') && rqs.some(q => statusOf(q, 'zone') === 'inferred'));
  const rows = await p.evaluate(ids => ids.map(id => { const i = document.querySelector(`#gates input[data-k="rq:${id}"]`), loc = i && i.closest('li').querySelector('.loc'), q = RQ.find(x => String(x.id) === String(id));
    const tags = loc ? [...loc.querySelectorAll('.ss-tag')] : [];
    const a = q && { open: [{ it: RQ_K('rq:' + q.id), k: 'rq:' + q.id, run: false, lock: false, pre: [] }], snz: [], wait: [], hereArea: null };
    const box = document.createElement('div'); if (a) box.innerHTML = rqExtraHTML(a);
    const tip = (box.querySelector('.ql a, .ql span[title]') || {}).title || '';
    return { id, zone: q && q.zone, found: !!loc, text: loc ? loc.textContent.replace(/\s+/g, ' ').trim() : '', tags: tags.map(t => t.textContent), tip }; }), rqs.map(q => q.gameId));
  const bad = [], badTip = [];
  rqs.forEach((q, i) => { const r = rows[i], w = want(q, 'zone');
    const okRow = r.found && (w ? r.tags.length === 1 && r.tags[0] === w && r.text.startsWith(`${r.zone} ${w}`) : r.tags.length === 0);
    if (!okRow) bad.push({ id: q.id, status: statusOf(q, 'zone'), ...r });
    const okTip = w ? r.tip.includes(`· ${r.zone} (${w}) ·`) : r.tip.includes(`· ${r.zone} ·`) && !/\((check in game|inferred)\)/.test(r.tip);
    if (!okTip) badTip.push({ id: q.id, status: statusOf(q, 'zone'), tip: r.tip }); });
  ok(`milestone rows: each of ${rqs.length} regional quest zones shows its tag right after it, a verified zone none`, !bad.length, bad.slice(0, 5));
  ok(`Next up regional quest list: each zone's tooltip carries its label, a verified zone none`, !badTip.length, badTip.slice(0, 5));

  /* strongholds: the level range in Dungeons & Strongholds (All strongholds) */
  const shs = recs('aion2/asmodian/strongholds.json');
  /* one label shared by every range is said once, in the section's note ("levels inferred"); a row tags only a label
     that differs from that shared one, and every row's tooltip names its own */
  const shRows = await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('#areaList li.arow')].map(li => { const s = li.querySelector('small'); return [li.querySelector('b').textContent, { small: (s || {}).textContent || '', tip: (s || {}).title || '', tags: [...li.querySelectorAll('.ss-tag')].map(t => t.textContent) }]; })));
  const shHead = await p.evaluate(() => { const n = document.querySelector('#areaList li.asec.sh + li.sh-note'); return n ? { text: n.textContent.replace(/\s+/g, ' ').trim(), tags: [...n.querySelectorAll('.ss-tag')].map(t => t.textContent) } : null; });
  const shSt = shs.every(s => statusOf(s, 'levelRange') === statusOf(shs[0], 'levelRange')) ? statusOf(shs[0], 'levelRange') : null, shared = shSt && TAG[shSt];
  ok(`Dungeons & Strongholds: the section note carries the shared level label ${shared ? `once ("levels ${shared}")` : '(none: the labels differ or are verified)'}`,
    !!shHead && (shared ? shHead.tags.length === 1 && shHead.tags[0] === shared && shHead.text.endsWith(`· levels ${shared}`) : shHead.tags.length === 0), shHead);
  const badSh = shs.filter(s => { const r = shRows[s.name], w = want(s, 'levelRange'), own = w && !shared ? w : null;
    return !r || (own ? !(r.tags.length === 1 && r.tags[0] === own && r.small.endsWith(' ' + own)) : r.tags.length !== 0) || (w ? !r.tip.endsWith(`(${w})`) : /\((check in game|inferred)\)/.test(r.tip)); }).map(s => ({ name: s.name, status: statusOf(s, 'levelRange'), row: shRows[s.name] }));
  ok(`Dungeons & Strongholds: each of ${shs.length} stronghold level ranges is labelled (row tag only when it differs, tooltip always), a verified one none`, !badSh.length, badSh.slice(0, 5));

  /* Sealed Dungeon entrances: the Next up card's "Kibelisk: X" (single source today: no tag) */
  const sds = recs('aion2/asmodian/sealed-dungeons.json').filter(d => d.entrance && d.entrance.kibelisk);
  const sdOut = await p.evaluate(names => names.map(nm => { const L = AREA_LOC[nm] || {}, box = document.createElement('div'); box.innerHTML = nsWhere('Somewhere', L.kib, null, L.st); return [...box.querySelectorAll('.ss-tag')].map(t => t.textContent); }), sds.map(d => d.name));
  const badSd = sds.filter((d, i) => { const w = want(d, 'entrance'); return w ? !(sdOut[i].length === 1 && sdOut[i][0] === w) : sdOut[i].length !== 0; }).map(d => ({ name: d.name, status: statusOf(d, 'entrance') }));
  ok(`Next up Sealed Dungeon cards: each of ${sds.length} entrances shows its tag when unverified, none otherwise`, !badSd.length, badSd.slice(0, 5));

  /* skills: every guide pack's compiled learn level label is the data's; the Skills card tags exactly those rows */
  const { generate, guidePacks } = await import(path.join(ROOT, 'tools', 'gen', 'gen.mjs'));
  const badGen = [];
  for (const id of guidePacks()) {
    const g = generate({ pack: id }), cls = id.split('/').pop(), skills = recs(`aion2/classes/${cls}/skills.json`), byName = Object.fromEntries(skills.map(s => [s.name, s]));
    for (const x of [...g.constants.SP_SKILLS_CORE, ...g.constants.SP_EXTRA]) { const s = byName[x.n], w = s && statusOf(s, 'learnLv') !== 'verified' ? statusOf(s, 'learnLv') : undefined;
      if (!s || x.learnSt !== w) badGen.push({ pack: id, skill: x.n, learnSt: x.learnSt, data: s && statusOf(s, 'learnLv') }); }
  }
  ok('every guide pack: a plan skill carries its learn level label exactly when the data has one', !badGen.length, badGen.slice(0, 5));
  const sk = await p.evaluate(() => [...document.querySelectorAll('#spSoon li')].map(li => ({ n: li.querySelector('.sname').textContent, tags: [...li.querySelectorAll('.slv .ss-tag')].map(t => t.textContent) })));
  const learnOf = await p.evaluate(() => Object.fromEntries(SP_SKILLS.map(s => [s.n, s.learnSt || null])));
  const badSk = sk.filter(r => { const nm = Object.keys(learnOf).find(k => r.n.startsWith(k)), w = nm && TAG[learnOf[nm]]; return w ? !(r.tags.length === 1 && r.tags[0] === w) : r.tags.length !== 0; });
  ok(`Skills card: the ${sk.length} Coming up rows carry a learn level tag exactly when theirs is unverified`, sk.length > 0 && !badSk.length, badSk.slice(0, 5));

  /* the tag's text is at least 12 px wherever it shows (Design Critic checklist) */
  const sizes = await p.evaluate(() => [...document.querySelectorAll('.ss-tag')].map(t => parseFloat(getComputedStyle(t).fontSize)));
  ok('every shown tag is at least 12 px', sizes.length > 0 && sizes.every(s => s >= 12), sizes.filter(s => s < 12).slice(0, 5));
  ok('no page errors', !errs.length, errs);
  await b.close();
  console.log(fail ? `LABELS CHECKS FAILED (${fail} of ${n})` : `LABELS CHECKS PASSED (${n})`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
