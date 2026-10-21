/* Unverified values carry their label (0.8 P20, #509). node tests/labels.js  (page at AION_BASE; see tests/config.js)
   Reads every label from the data itself (each record's fieldStatus, else its status; no pinned counts: research batches
   keep changing them) and checks each field players see: a disputed / owner-check value shows "check in game", an inferred
   one "inferred", and a verified (or single-source, which keeps its own tags) value shows no such tag.
   Fields: a regional quest's zone (milestone row; Next up's regional quest list, where the zone is in the tooltip), a
   stronghold's level range (Dungeons & Strongholds), a Sealed Dungeon's entrance (Next up), a skill's learn level (Skills
   card; every guide pack's compiled tables). Story quest zones never show as text, so they have no tag to check. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const ROOT = path.resolve(__dirname, '..'); const CFG = require('./config');
const { buildFixture } = require('./support/regress-fixture'); const { writeSave, writeRaw, toStored } = require('./support/save');
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

  /* specialty slot 2 (0.8.1 F2, owner note 5): every core skill's row names the guide's pick, never "pick a specialty", with
     nothing bought and with every line and plan node bought; a labelled pick (specialtyEvidence) shows its label as a tag
     whose tooltip names the alternative, a 2+ sources pick none */
  const asnBuild = recs('aion2/asmodian/assassin/builds.json').find(r => r.id === 'build:assassin:guide'), ev = asnBuild.specialtyEvidence, picks = asnBuild.specialtyPicks;
  const slot2Of = () => SP_SLOTS.filter(x => x.slot === 2 && !x.s.extra).map(x => { const box = document.createElement('div'); box.innerHTML = spSlotSub(x);
    return { n: x.s.n, text: box.textContent, tags: [...box.querySelectorAll('.ss-tag')].map(t => [t.textContent, t.title]) }; });
  const sp0 = await p.evaluate(slot2Of);
  const st2 = await p.evaluate(buildFixture, { L: 45, mode: 'advanced', fx: 'clean' });
  const all = await p.evaluate(() => [...SP_STEPS, ...DV_NODES()].map(x => x.k)); for (const k of all) st2.checks[k] = true;
  await writeSave(p, st2); await p.reload(); await p.waitForTimeout(400);
  const sp1 = await p.evaluate(slot2Of);
  const lbl = Object.fromEntries(Object.values(picks).filter(ps => ps[1]).map(ps => [ps[1], ev[ps[1]].label]));
  ok('specialty slot 2: the data labels four picks disputed / contested / inferred', JSON.stringify(Object.values(lbl).filter(l => l !== '2+ sources').sort()) === '["contested","disputed","disputed","inferred"]', lbl);
  const badSp = [...sp0, ...sp1].filter(r => /pick a specialty/i.test(r.text) || !/^(Slot 2 open · )?(Pick|Guide pick): /.test(r.text));
  ok(`Skills / Next up: no core slot 2 row of ${sp0.length} reads "pick a specialty", nothing or everything bought`, sp0.length >= 6 && !badSp.length, badSp.slice(0, 5));
  const nLab = Object.values(lbl).filter(l => l !== '2+ sources').length;
  const badTag = sp1.filter(r => { const t = r.tags; return !(t.length === 0 || (t.length === 1 && ['disputed', 'contested', 'inferred'].includes(t[0][0]) && t[0][1].length > 20)); });
  ok(`specialty slot 2: ${nLab} labelled picks each show their label with the alternative in the tooltip`, sp1.filter(r => r.tags.length === 1).length === nLab && !badTag.length, sp1);

  /* 0.9 P1: the build's own labels, for all eight classes. Each value's status comes from the data (a row's own status,
     else the build's; a list's fieldStatus, else the build's): the generator carries exactly the tagged ones (disputed,
     owner-check, inferred), a single-source skill order row keeps "single source", and each class's page shows the tag on
     its skill order rows (Skills card), its plan nodes (Daevanion card), its stigma plan's heading and its default keys'
     heading, and nowhere for a verified value */
  const TAGGED = s => ['disputed', 'owner-check', 'inferred'].includes(s) ? s : undefined;
  const badBuild = [], badPage = [], badMeta = []; let sawLv21Via = false;
  for (const id of guidePacks()) {
    const cls = id.split('/').pop(), g = generate({ pack: id }).constants, b = recs(`aion2/asmodian/${cls}/builds.json`).find(r => r.id === `build:${cls}:guide`);
    const skills = recs(`aion2/classes/${cls}/skills.json`), nm = Object.fromEntries(skills.map(s => [s.id, s.name])), rowOf = Object.fromEntries(b.skillOrder.map(e => [nm[e.skill], e]));
    for (const x of [...g.SP_SKILLS_CORE, ...g.SP_EXTRA]) { const e = rowOf[x.n], s = e.status ?? b.status;
      if (x.st !== TAGGED(s) || !!x.single !== (s === 'single-source' && !e.core)) badBuild.push({ id, skill: x.n, st: x.st, single: x.single, data: s }); }
    const picks = statusOf(b, 'specialtyPicks');
    for (const x of g.SP_SKILLS_CORE) for (const [i, p] of (x.specs || []).entries()) { const pid = b.specialtyPicks[skills.find(s => s.name === x.n).id][i], ev = (b.specialtyEvidence || {})[pid];
      if (ev ? p.vst !== undefined : p.vst !== TAGGED(picks)) badBuild.push({ id, pick: pid, vst: p.vst, data: ev ? ev.label : picks }); }
    const nodes = recs(`aion2/classes/${cls}/board-nodes.json`), keyOf = Object.fromEntries(nodes.map(n => [n.id, n.key]));
    const dvSt = Object.fromEntries(b.boardPlan.map(e => [e.node ? keyOf[e.node] : e.key, e.status ?? b.status]));
    const dvs = g.GUIDE_GATES.flatMap(m => m.items.filter(it => it.dv));
    for (const it of dvs) if (it.st !== TAGGED(dvSt[it.k])) badBuild.push({ id, node: it.k, st: it.st, data: dvSt[it.k] });
    /* 0.9 P16: a plan cost's own label (fieldStatus.cost, e.g. computed from the board path) rides on the item as cst */
    const dvCst = Object.fromEntries(b.boardPlan.map(e => [e.node ? keyOf[e.node] : e.key, (e.fieldStatus || {}).cost]));
    for (const it of dvs) if (it.cst !== TAGGED(dvCst[it.k])) badBuild.push({ id, node: it.k, cst: it.cst, data: dvCst[it.k] });
    const stSt = TAGGED(statusOf(b, 'stigmaSlots')) || TAGGED(statusOf(b, 'stigmaTargets')) || null, dk = b.keyStacks.defaultKeys, kSt = dk ? TAGGED(dk.status ?? b.status) || null : null;
    if (g.STIGMA_ST !== stSt || g.KEYS_ST !== kSt) badBuild.push({ id, STIGMA_ST: g.STIGMA_ST, stSt, KEYS_ST: g.KEYS_ST, kSt });
    /* 0.9 P17: the E stack's own label (keyStacks.eOrderStatus) */
    const eSt = TAGGED(b.keyStacks.eOrderStatus) || null;
    if (g.E_ST !== eSt) badBuild.push({ id, E_ST: g.E_ST, eSt });
    /* the page: this class at Lv 20, nothing bought and no cost logged (a logged cost is the player's own, so its box
       drops the plan cost's tag; the fixture's Assassin costs share keys like dv:nezekan:r4c5 with other classes) */
    const sc = await p.evaluate(buildFixture, { L: 20, mode: 'advanced', fx: 'clean' }); sc.checks = {}; sc.dvCost = {};
    const stored = toStored(sc); Object.assign(stored.chars[stored.current], { pack: id, class: cls });
    await writeRaw(p, JSON.stringify(stored)); await p.reload(); await p.waitForTimeout(400);
    const pg = await p.evaluate(() => { const tags = el => el ? [...el.querySelectorAll('.ss-tag')].map(t => t.textContent) : null;
      return { pack: char(state).pack, sk: [...document.querySelectorAll('#spSoon li:not(.isspec)')].map(li => ({ n: li.querySelector('.sname').textContent, tags: tags(li.querySelector('.sname')) })),
        dv: [...document.querySelectorAll('#dvAllList li.dvn')].map(li => ({ k: li.dataset.dvk, tags: tags(li.querySelector('.txt')), cost: tags(li.querySelector('.dvc-wrap')), meta: li.querySelector('.loc').textContent })),
        nx: [...document.querySelectorAll('#dvNextList .dvrow.nx')].map(r => ({ k: r.dataset.nx, cost: tags(r.querySelector('.dvcost-k')) })),
        stHead: tags(document.querySelector('#stCard .ns-head h2')), stRows: tags(document.getElementById('stBody')).concat(tags(document.getElementById('stList'))),
        keys: tags(document.querySelector('#stackViz .kv-note, #stackViz .kv-defs .khead')), eKeys: tags(document.querySelector('#stackViz .kv-sugg')) }; });
    if (pg.pack !== id) { badPage.push({ id, loaded: pg.pack }); continue; }
    const wSk = Object.fromEntries([...g.SP_SKILLS_CORE, ...g.SP_EXTRA].map(x => [x.n, TAG[x.st] || null]));
    for (const r of pg.sk) { const n = Object.keys(wSk).sort((a, c) => c.length - a.length).find(k => r.n.startsWith(k)), w = wSk[n];
      if (w ? !(r.tags.length === 1 && r.tags[0] === w) : r.tags.length) badPage.push({ id, row: r.n, tags: r.tags, want: w }); }
    for (const r of pg.dv) { const w = TAG[TAGGED(dvSt[r.k])] || null; if (w ? !(r.tags.length === 1 && r.tags[0] === w) : r.tags.length) badPage.push({ id, node: r.k, tags: r.tags, want: w }); }
    for (const r of [...pg.dv, ...pg.nx]) { const w = TAG[TAGGED(dvCst[r.k])] || null; if (w ? !(r.cost.length === 1 && r.cost[0] === w) : r.cost.length) badPage.push({ id, cost: r.k, tags: r.cost, want: w }); }
    if (cls !== 'assassin' && !pg.dv.some(r => r.cost.length)) badPage.push({ id, cost: 'no inferred cost tag rendered' });
    const wSt = TAG[stSt] || null;
    if (!pg.stHead || (wSt ? !(pg.stHead.length === 1 && pg.stHead[0] === wSt) : pg.stHead.length) || pg.stRows.includes(wSt)) badPage.push({ id, stHead: pg.stHead, stRows: pg.stRows, want: wSt });
    const wK = TAG[kSt] || null;
    if (pg.keys && (wK ? !(pg.keys.length === 1 && pg.keys[0] === wK) : pg.keys.length)) badPage.push({ id, keys: pg.keys, want: wK });
    /* the guide's own key grid (the Assassin) names the E stack's label on its heading line; a build with eOrderStatus but
       no guide grid would lose it, so that counts as a miss too */
    const wE = TAG[eSt] || null;
    if (pg.eKeys ? (wE ? !(pg.eKeys.length === 1 && pg.eKeys[0] === wE) : pg.eKeys.length) : wE) badPage.push({ id, eKeys: pg.eKeys, want: wE });
    if (!pg.dv.length) badPage.push({ id, dv: 'no plan rows rendered' });
    /* P16 design review: a row's meta never says a phrase twice ("Fury is learned at Lv 21 · learned at Lv 21") */
    for (const r of pg.dv) { const parts = r.meta.split(' · '); if (parts.some((s, i) => parts.slice(0, i).some(q => q.includes(s)))) badMeta.push({ id, node: r.k, meta: r.meta }); }
    sawLv21Via ||= pg.dv.some(r => / is learned at Lv 21$/.test(r.meta));
  }
  /* 0.9 P19 design review (PR #761, "inferred · inferred"): a line never shows the same tag twice. Every class at a Lv 39
     catch-up start (nothing bought), Next up's cards and the Skills hero / Coming up lines, one element per line */
  const dupTags = []; let tagLines = 0;
  for (const id of guidePacks()) {
    const cls = id.split('/').pop(), sc = await p.evaluate(buildFixture, { L: 39, mode: 'advanced', fx: 'clean' }); sc.checks = {}; sc.dvCost = {};
    const stored = toStored(sc); Object.assign(stored.chars[stored.current], { pack: id, class: cls });
    await writeRaw(p, JSON.stringify(stored)); await p.reload(); await p.waitForTimeout(400);
    const lines = await p.evaluate(() => [...document.querySelectorAll('#nowStar .ns-card h3, #nowStar .ns-card .ns-sub, #nowStar .ns-card p, #nowStar .ns-card small, #spHero .spname, #spHero small, #spHero .sphint, #spSoon li')]
      .map(el => ({ text: el.textContent.replace(/\s+/g, ' ').trim(), tags: [...el.querySelectorAll('.ss-tag')].map(t => t.textContent.trim()) })));
    tagLines += lines.filter(l => l.tags.length).length;
    for (const l of lines) if (new Set(l.tags).size !== l.tags.length) dupTags.push({ id, ...l });
  }
  ok(`every class at a Lv 39 catch-up: no line of Next up or the Skills card repeats a tag (${tagLines} tagged lines)`, tagLines > 0 && !dupTags.length, dupTags.slice(0, 5));
  ok('every class page: no Daevanion plan row\'s meta repeats a phrase',!badMeta.length && sawLv21Via, { badMeta: badMeta.slice(0, 5), sawLv21Via });
  ok('every guide pack: skill order rows, specialty picks, plan nodes, the stigma plan and the default keys carry exactly the data\'s tagged labels', !badBuild.length, badBuild.slice(0, 5));
  ok('every class page: Skills rows, Daevanion plan rows and their cost boxes, the Stigmas heading and the default keys heading show the tag exactly when the data labels them', !badPage.length, badPage.slice(0, 5));
  ok('the data has labelled plan nodes, skill order rows and a labelled stigma plan to check', (() => { const bs = guidePacks().map(id => recs(`aion2/asmodian/${id.split('/').pop()}/builds.json`)[0]);
    return bs.some(b => b.boardPlan.some(e => TAGGED(e.status ?? b.status))) && bs.some(b => b.skillOrder.some(e => TAGGED(e.status ?? b.status))) && bs.some(b => TAGGED(statusOf(b, 'stigmaSlots'))); })());
  /* story turn-in zones: QUEST_LOC carries the quest's own label for its turn-in zone */
  const sqs = recs('aion2/asmodian/story-quests.json'), loc = generate({ pack: guidePacks()[0] }).constants.QUEST_LOC;
  const badZ = sqs.filter(s => loc[s.name] && loc[s.name].turninZone).filter(s => loc[s.name].turninZoneSt !== TAGGED(statusOf(s, 'turnin.zone'))).map(s => ({ id: s.id, got: loc[s.name].turninZoneSt, data: statusOf(s, 'turnin.zone') }));
  ok('story quests: a shown turn-in zone carries its label exactly when the data has one', !badZ.length, badZ.slice(0, 5));
  const nearTags = await p.evaluate(() => { const box = document.createElement('div'); box.innerHTML = nsWhere('Ishalgen', null, 'Ishalgen', null, 'owner-check') + '|' + nsWhere('Ishalgen', null, 'Ishalgen', null, null); return box.textContent; });
  ok('"near your story step" carries the turn-in zone\'s tag, none when verified', nearTags === 'Ishalgen (near your story step check in game)|Ishalgen (near your story step)', nearTags);

  /* the tag's text is at least 12 px wherever it shows (Design Critic checklist) */
  const sizes = await p.evaluate(() => [...document.querySelectorAll('.ss-tag')].map(t => parseFloat(getComputedStyle(t).fontSize)));
  ok('every shown tag is at least 12 px', sizes.length > 0 && sizes.every(s => s >= 12), sizes.filter(s => s < 12).slice(0, 5));
  ok('no page errors', !errs.length, errs);
  await b.close();
  console.log(fail ? `LABELS CHECKS FAILED (${fail} of ${n})` : `LABELS CHECKS PASSED (${n})`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
