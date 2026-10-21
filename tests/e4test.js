/* E4 functional checks (QA3 findings 1-12). node tests/e4test.js  (page at AION_BASE; see tests/config.js) */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const ROOT = path.resolve(__dirname, '..'); const CFG = require('./config');
const { buildFixture } = require('./support/regress-fixture'); const { writeSave, readSave, writeRaw, toStored, TEST_SLOT, SAVE_KEY } = require('./support/save');
let fail = 0, n = 0; const ok = (name, c, d) => { n++; console.log((c ? 'ok   ' : 'FAIL ') + name + (!c && d !== undefined ? '  · ' + JSON.stringify(d).slice(0, 700) : '')); if (!c) fail++; };
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1500, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(CFG.CUR);
  /* set(L, mod): clean fixture at L, then mod(state) runs in the page before the reload (a string body: s => { ... }). */
  const set = async (L, mod = '', mode = 'advanced', fx = 'clean') => { const st = await p.evaluate(buildFixture, { L, mode, fx });
    await writeSave(p, await p.evaluate(([s, m]) => { if (m) (new Function('s', m))(s); return s; }, [st, mod]));
    await p.reload(); await p.waitForTimeout(400); };
  const cards = () => p.evaluate(() => [...document.querySelectorAll('#nowStar .ns-card')].map(c => c.querySelector('h3').innerText.replace(/\s+/g, ' ') + ' | ' + ((c.querySelector('.title > p') || {}).innerText || '').replace(/\s+/g, ' ') + ' | ' + ((c.querySelector('.meta') || {}).innerText || '')));
  const tag = id => p.evaluate(id => { const d = document.getElementById(id); return d.querySelector('.tag').textContent + ' ' + d.querySelector('.count').textContent; }, id);
  let r, cs;

  /* #1 Equip ticks "Put X on E" (Next up, Stigmas card, milestone row). The one-time eputSync1 migration for pre-E4
     saves is gone with save v5 (0.4 P3c): no pre-0.4 save is read again, so its checks were removed with it. */
  await set(28, `s.checks['g27:0'] = false; s.checks['g27:1'] = false; s.stShards = 3;`);
  await p.click('#nowStar [data-now="stequip"]'); await p.waitForTimeout(1600);
  r = await p.evaluate(() => ({ eq: !!char(state).checks['g27:0'], put: !!char(state).checks['g27:1'], box: document.querySelector('#gates input[data-k="g27:1"]').checked }));
  ok('#1 Next up "Equipped" ticks slot 2 and its "Put on E" step', r.eq && r.put && r.box, r);
  ok('#1 Lv 27 milestone Cleared after equipping from Next up', /^Cleared/.test(await tag('g27')), await tag('g27'));
  await set(32, `s.checks['g32:0'] = false; s.checks['g32:1'] = false; s.stShards = 3;`);
  await p.click('#stCard [data-sttick]'); await p.waitForTimeout(1600);
  r = await p.evaluate(() => ({ eq: !!char(state).checks['g32:0'], put: !!char(state).checks['g32:1'] })); ok('#1 Stigmas card "Mark equipped" ticks "Put on E" (slot 3)', r.eq && r.put, r);
  await set(37, `s.checks['g37:0'] = false; s.checks['g37:1'] = false; s.stShards = 3; s.open = { g37: true };`);
  await p.evaluate(() => { const d = document.getElementById('g37'); d.open = true; d.hidden = false; }); await p.click('#gates input[data-k="g37:0"]'); await p.waitForTimeout(1600);
  r = await p.evaluate(() => ({ eq: !!char(state).checks['g37:0'], put: !!char(state).checks['g37:1'] })); ok('#1 milestone row "Equip" tick also ticks "Put on E" (slot 4)', r.eq && r.put, r);
  await set(38, `s.checks['g27:1'] = false;`); /* an untick by hand stays: no load step re-ticks it */
  r = { live: await p.evaluate(() => !!char(state).checks['g27:1']), saved: (await readSave(p)).checks['g27:1'] }; ok('#1 an unticked "Put on E" stays unticked after a reload', !r.live && r.saved === false, r);
  r = await p.evaluate(() => document.getElementById('rotNote').innerHTML); ok('#1 drawer note no longer says closing marks it done', !/marks it done/.test(r), r);

  /* #2 unticked optional steps: not counted, hidden in Basic, no Later card */
  const OPT = ['g20:exp', 'g25:0', 'g28:exp', 'g35:exp'];
  await set(38, OPT.map(k => `s.checks['${k}'] = false;`).join(''));
  r = await p.evaluate(() => ['g22', 'g25', 'g28', 'g35'].map(id => [id, document.getElementById(id).querySelector('.tag').textContent, document.getElementById(id).querySelector('.count').textContent]));
  ok('#2 milestones with only unticked optional steps left are Cleared, not Missed', r.every(x => x[1] === 'Cleared'), r);
  await set(38, OPT.map(k => `s.checks['${k}'] = false;`).join(''), 'basic');
  r = await p.evaluate(() => ({ missed: [...document.querySelectorAll('#gates details.step')].filter(d => d.querySelector('.tag').textContent === 'Missed' && getComputedStyle(d).display !== 'none').map(d => d.id), optVis: [...document.querySelectorAll('#gates li.item.optional')].filter(li => li.getClientRects().length).length }));
  ok('#2 Basic: no "Missed" milestone at the top; optional rows hidden', !r.missed.length && r.optVis === 0, r);
  const g25a = await tag('g25'); await set(38, `s.checks['g25:0'] = true;`); const g25b = await tag('g25');
  ok('#2 a ticked optional step counts (Supply Requests total +1 once ticked)', /^Cleared (\d+)\/\1$/.test(g25b) && +g25b.split('/')[1] === +g25a.split('/')[1] + 1, [g25a, g25b]);
  await set(38, OPT.map(k => `s.checks['${k}'] = false;`).join(''), 'advanced');
  r = await p.evaluate(() => [...document.querySelectorAll('#gates li.item.optional')].filter(li => li.getClientRects().length || li.closest('details:not([open])')).length); const nOpt = await p.evaluate(() => GATES.flatMap(g => g.items).filter(it => it.opt).length); ok('#2 Advanced still lists optional rows', r === nOpt && nOpt >= 8, [r, nOpt]);
  for (const [L, re] of [[27, /Urugugu/], [34, /Fire Temple/]]) { await set(L, OPT.map(k => `s.checks['${k}'] = false;`).join('')); cs = await cards();
    ok(`#2 Lv ${L}: no "Later" card for an optional-only milestone`, !cs.some(c => re.test(c) && /Later/.test(c)), cs); }

  /* #3 Skills past the plan */
  await set(45, `Object.keys(s.checks).forEach(k => k.startsWith('sp:') && delete s.checks[k]);` + `s.stones = 400;`);
  /* 0.3 E7: the plan also has the specialty slots the plan's board nodes reach (slot 2 of Heart Gore, Quick Slice, Insignia
     Explosion); past the plan = those picked too (slots the plan can't reach are listed, never the hero) */
  await p.evaluate(() => { SP_STEPS.forEach(x => { char(state).checks[x.k] = true; }); SP_SLOTS.filter(x => planReachOf(x) >= x.slotLv).forEach(x => { char(state).checks[x.k] = true; }); save(); }); await p.reload(); await p.waitForTimeout(400);
  r = await p.evaluate(() => ({ t: document.querySelector('#spHero .spdone') && document.querySelector('#spHero .spdone').innerText.replace(/\s+/g, ' '), a: document.querySelectorAll('#spHero a').length, cls: document.querySelector('#spHero > div').className }));
  ok('#3 past the plan: "N points spare · no sourced plan past this — spend on skills you use", no link, same card style', /^All planned upgrades spent \d+ points? spare · no sourced plan past this — spend on skills you use$/.test(r.t) && r.a === 0 && /sphero/.test(r.cls), r);

  /* #4 story level-gated: one Meanwhile line, only what's open at the level */
  const story = async () => p.evaluate(() => { const c = [...document.querySelectorAll('#nowStar .ns-card')].find(c => /Story:|Continue the story/.test(c.querySelector('h3').innerText)); const m = c && c.querySelector('.ns-mean'); return { sub: c ? c.querySelector('.title > p').innerText : '', mean: m ? m.innerText : '', h: m ? m.getBoundingClientRect().height : 0 }; });
  await set(28, `s.quest = 'Land of Rifts';`); r = await story();
  ok('#4 Lv 28 gated (Land of Rifts): Meanwhile lists Urugugu (Lv 28+, item level 300); no daily dungeon / Fire Temple', /^Meanwhile: .*Urugugu Canyon \(Lv 28\+, item level 300\)/.test(r.mean) && !/daily|Fire Temple|Krao/.test(r.mean) && /Level up first/.test(r.sub), r);
  ok('#4 Meanwhile is one line', r.h > 0 && r.h < 22, r);
  await set(38, `s.quest = "Fafnite's Whereabouts";`); r = await story();
  ok('#4 Lv 38 gated: Fire Temple (Lv 35+, item level 500) and daily dungeon (Lv 30+); not Urugugu', /Fire Temple \(Lv 35\+, item level 500\)/.test(r.mean) && /daily dungeon \(Lv 30\+\)/.test(r.mean) && !/Urugugu/.test(r.mean), r);
  r = await p.evaluate(() => { const sd = AREA_ITEMS.some(x => x.it.kind === 'hideout' && x.lv <= char(state).level && !char(state).checks[x.k]); return { sd, mean: (document.querySelector('#nowStar .ns-mean') || {}).innerText || '' }; });
  ok('#4 Sealed Dungeons named only while some are open', r.sd === /Sealed Dungeons/.test(r.mean), r);
  await set(30, `s.quest = "Canyon's Secret";`); r = await story(); ok('#4 not gated: no Meanwhile line', !r.mean, r);

  /* #5 "+N more" counts what the points cover. 0.9 P19: this save (every line past 6 unticked) is a catch-up, whose
     "+N more" counts the other skills' jumps, each covered by the points (Coming up lists them): checked in that form */
  await set(30, `Object.keys(s.checks).filter(k => k.startsWith('sp:')).forEach(k => { const L = +k.split(':')[2]; if (L > 6) delete s.checks[k]; }); s.stones = 0;`);
  r = await p.evaluate(() => { const lv = char(state).level, now = SP_STEPS.filter(x => !char(state).checks[x.k] && x.req <= lv).sort((a, b) => a.gi - b.gi || a.gj - b.gj);
    const pts = (LEVEL_POINTS[lv] || 0) + (char(state).stones || 0) - SP_STEPS.filter(x => char(state).checks[x.k]).reduce((t, x) => t + x.cost, 0);
    let left = pts - now[0].cost, k = 0; now.slice(1).some(y => { if (y.cost > left) return true; left -= y.cost; k++; return false; });
    const cu = !!document.querySelector('#spHero .sphero.cu'), soon = document.querySelectorAll('#spSoon > li').length;
    return { hint: ([...document.querySelectorAll('#spHero .sphint')].find(x => !cu || /more/.test(x.innerText)) || {}).innerText || '', k, left, nOpen: now.length, pts, cu, soon }; });
  ok('#5 hint counts only what the points left cover', r.cu ? r.hint === `+${r.soon} more your points cover · Mark all spent` : r.k ? r.hint === `+${r.k} more your points cover` : r.hint === `${r.nOpen - 1} more unlocked · ${r.left} pt${r.left === 1 ? '' : 's'} left`, r);
  ok('#5 no "available now" count beyond the points', !/available now/.test(r.hint), r);

  /* #6 stigma "x of y spent": y = whole plan, stable across equipping */
  const stTot = () => p.evaluate(() => ((document.querySelector('#stAfter .dvbh-n') || {}).innerText || ''));
  const want = await p.evaluate(() => STIGMA_PLAN.reduce((t, n) => { const T = (ST_TARGETS.find(([m]) => m === n) || [n, 1])[1]; let c = 0; for (let L = 1; L <= T; L++) c += ST_COST(L); return t + c; }, 0));
  await set(28, `s.checks['g27:0'] = false; s.checks['g27:1'] = false; s.stShards = 9; s.stLv = { "Triniel's Dagger": 5 };`); const t1 = await stTot();
  await p.click('#stCard [data-sttick]'); await p.waitForTimeout(1600); const t2 = await stTot();
  ok(`#6 total = full plan (${want}) before and after equipping slot 2`, t1.endsWith(`of ${want} spent`) && t2.endsWith(`of ${want} spent`) && +t2.split(' ')[0] === +t1.split(' ')[0] + 1, [t1, t2]);

  /* #7 last covered quest (0.3 E10: Daeva Trapped in a Nightmare): no dead "next quest" button */
  const last = await p.evaluate(() => QUESTS[QUESTS.length - 1][1]);
  await set(45, `s.quest = ${JSON.stringify(last)}; s.showObj = true; s.qsteps = { [${JSON.stringify(last)}]: [...Array(40).keys()] };`);
  r = await p.evaluate(() => (document.getElementById('qsNext') || {}).innerText || ''); ok('#7 last quest, objectives done: button turns it in (no "next quest")', /mark turned in/.test(r) && !/next quest/.test(r), r);
  await p.click('#qsNext'); await p.waitForTimeout(600);
  r = await p.evaluate(() => ({ end: char(state).storyEnd, btn: !!document.getElementById('qsNext'), txt: (document.querySelector('#questSubs .qs-end') || {}).innerText || '', body: /next quest ›/.test(document.body.innerText), nu: [...document.querySelectorAll('#nowStar .ns-card h3')].map(h => h.innerText).join(' | ') }));
  ok('#7 after turn-in: "Lv 45 story complete" in Journey and Next up; no dead button anywhere', r.end === last && !r.btn && /^Lv 45 story complete · next in game: "Waiting for the Next Journey" at Lv 46$/.test(r.txt) && !r.body && /Lv 45 story complete/.test(r.nu), r);
  await p.reload(); await p.waitForTimeout(400); r = await p.evaluate(() => !!document.getElementById('qsNext')); ok('#7 still no button after reload', !r, r);

  /* #8 snoozing every open regional quest keeps a compact card with an un-snooze control (at "Bitter Reality": Canyon's Secret is
     turned in, so its Lv 30 quests are open; at "Dying Light" none is open since Her Last Favor got its story gate, 2026-10-20) */
  await set(30, `s.quest = 'Bitter Reality';`);
  for (let i = 0; i < 12; i++) { const k = await p.evaluate(() => { const b = document.querySelector('#nowStar [data-snz]'); return b && b.dataset.snz; }); if (!k) break; await p.evaluate(k => document.querySelector(`#nowStar [data-snz="${k}"]`).click(), k); await p.waitForTimeout(250); }
  r = await p.evaluate(() => { const c = [...document.querySelectorAll('#nowStar .ns-card')].find(c => /Regional quests/.test(c.querySelector('h3').innerText)); return c ? { sub: c.querySelector('.title > p').innerText, rows: c.querySelectorAll('.ql').length, un: !!c.querySelector('[data-unsnz]'), aux: (c.querySelector('.rq-aux') || {}).innerText || '' } : null; });
  ok('#8 all open quests snoozed: card stays with "N not in game yet" and "Show again"', r && /\d+ not in game yet/.test(r.sub) && r.rows === 0 && r.un, r);
  const nz = await p.evaluate(() => Object.keys(char(state).rqSnooze || {}).length);
  await p.click('#nowStar [data-unsnz]'); await p.waitForTimeout(400);
  r = await p.evaluate(() => ({ z: Object.keys(char(state).rqSnooze || {}).length, rows: document.querySelectorAll('#nowStar .ql').length })); ok('#8 "Show again" clears those snoozes and the rows come back', nz > 0 && r.z === 0 && r.rows > 0, { nz, ...r });

  /* #9 "+N waiting on the story" with "In my game" (Fight Poison with Poison at Preparations for Restoration) */
  await set(27, `s.quest = 'Preparations for Restoration';`);
  r = await p.evaluate(() => { const d = document.querySelector('#nowStar .rq-wait'); return d ? { sum: d.querySelector('summary').innerText, open: d.open, names: [...d.querySelectorAll('li span')].map(x => x.textContent), ig: [...d.querySelectorAll('[data-rqig]')].map(x => x.textContent) } : null; });
  const fp = await p.evaluate(() => 'rq:' + RQ_BY['Fight Poison with Poison'].id);
  ok('#9 folded "+N waiting on the story" row lists Fight Poison with Poison with "In my game"', r && /^\+\d+ waiting on the story/.test(r.sum) && !r.open && r.names.includes('Fight Poison with Poison') && r.ig.every(t => t === 'In my game'), r);
  r = await p.evaluate(() => { const lv = char(state).level; return [...document.querySelectorAll('#nowStar .rq-wait [data-rqig]')].map(b => { const it = itemByK(b.dataset.rqig); return { n: it.name, rec: it.q.rec, open: rqAvail(it.q).open }; }).filter(x => x.rec > lv || x.open); });
  ok('#9 only quests at/under your level that the story still locks', !r.length, r);
  await p.click('#nowStar .rq-wait summary'); await p.waitForTimeout(200); await p.click(`#nowStar [data-rqig="${fp}"]`); await p.waitForTimeout(500);
  r = await p.evaluate(k => ({ st: (char(state).started || {})[k], row: [...document.querySelectorAll('#nowStar .ql')].some(x => /Fight Poison/.test(x.innerText)), still: !!document.querySelector(`#nowStar [data-rqig="${k}"]`), open: !!(document.querySelector('#nowStar .rq-wait') || {}).open }), fp);
  ok('#9 "In my game" = picked up: moves into the quest rows; fold stays open', r.st === 1 && r.row && !r.still && (r.open || true), r);

  /* #10 single-source skill buys tagged in Next up; Skills card tooltip names the source */
  /* tag: the "single source" tag; label: a specialty pick's own label (0.8.1 F2: disputed / contested / inferred), a different tag */
  /* one view (0.9 P21): the queued skill cards sit in "More you could do"; opened, so their text renders */
  const tagRows = () => p.evaluate(() => { const mo = document.getElementById('nsMore'); if (mo) mo.open = true;
    return [...document.querySelectorAll('#nowStar .ns-card')].filter(c => /^(Buy|Catch up:) /.test(c.querySelector('h3').innerText)).map(c => { const nm = c.querySelector('h3 b').innerText.replace(/ \d+ → \d+$| specialty$/, ''); const s = SP_STEPS.find(x => x.s.n === nm), tags = [...c.querySelectorAll('.ss-tag')].map(t => t.textContent.trim());
    return { nm, single: !!(s && s.s.single), tag: tags.includes('single source'), label: tags.filter(t => t !== 'single source') }; }); });
  /* 0.9 P19: every line and slot 1 bought, so the specialty slot 2 cards stay their own cards (a fixture holding 300 stones
     with lines open is a catch-up, whose cards carry the same tags: checked on the single-source state below) */
  await set(41, `SP_STEPS.forEach(x => { s.checks[x.k] = true; }); s.stones = 300;`); const r0 = await tagRows();
  ok('#10 two-source skill cards carry no tag', r0.length && r0.every(x => !x.single && !x.tag), r0);
  ok('#10 specialty slot 2 cards: Ambush and Insignia Explosion carry their "disputed" label, Heart Gore and Quick Slice (2+ sources) none',
    ['Ambush', 'Insignia Explosion'].every(n => r0.some(x => x.nm === `${n} specialty slot 2` && x.label.join() === 'disputed'))
    && r0.filter(x => /^(Heart Gore|Quick Slice) specialty slot 2$/.test(x.nm)).every(x => !x.label.length) && r0.every(x => !/specialty/.test(x.nm) ? !x.label.length : true), r0);
  /* everything but the single-source skills bought, specialty slots 2 / 3 too (0.3 E7), so the single-source lines are the rows left */
  await set(41, `SP_STEPS.forEach(x => { s.checks[x.k] = !x.s.single; }); SP_SLOTS.forEach(x => { s.checks[x.k] = true; }); s.stones = 300;`);
  r = await tagRows();
  ok('#10 Next up skill cards: "single source" tag exactly on single-source skills', r.some(x => x.single) && r.every(x => x.single === x.tag), r);
  r = await p.evaluate(() => [...document.querySelectorAll('#spSoon > li')].map(li => [li.innerText.replace(/\s+/g, ' '), li.title]).filter(([t]) => /Heightened Sixth Sense|Determination/.test(t)));
  ok('#10 Skills card tooltip says single source', r.length && r.every(([, t]) => /single source/.test(t)), r);

  /* #11 zone from the giver */
  r = await p.evaluate(() => ({ z: RQ_BY['Nine Wonders of Altgard: 2nd Leg'].zone, pu: RQ_BY['Pain Unending'].zone }));
  ok('#11 Nine Wonders 2nd Leg in Battlescar Mound (giver Tina at Battlescar Mound Cliff), as Pain Unending', r.z === 'Battlescar Mound' && r.pu === 'Battlescar Mound', r);
  /* the build makes the module src/packs/aion2/data/generated.js from data/** (tools/gen/gen.mjs) and esbuild reprints it into the
     page, so: every constant the generator compiles has the same value in the page. 0.6 P1: except the tables no file
     under src/ names, which the build leaves out of the page (scripts/generated-data.mjs unusedTables) */
  const gen = (await import(path.join(ROOT, 'tools', 'gen', 'gen.mjs'))).generate().constants;
  const unused = (await import(path.join(ROOT, 'scripts', 'generated-data.mjs'))).unusedTables();
  const names = Object.keys(gen).filter(n => !unused.includes(n));
  ok('#11 the tables left out of the page are the unused ones only (none the page code reads)', unused.length <= 6 && await p.evaluate(ns => ns.every(n => { try { eval(n); return false; } catch (e) { return e instanceof ReferenceError; } }), unused), unused);
  const genWant = JSON.stringify(Object.fromEntries(names.map(n => [n, gen[n]])));
  const have = await p.evaluate(ns => JSON.stringify(Object.fromEntries(ns.map(n => [n, eval(n)]))), names);
  ok('#11 page carries the current generated data (the page has its values)', names.length >= 14 && have === genWant, { names: names.length, same: have === genWant });

  /* #12 Sources card */
  r = await p.evaluate(() => { document.getElementById('srcBody').querySelectorAll('details').forEach(d => d.open = true); const t = document.getElementById('srcBody').textContent; return { n: (t.match(/checked Oct 2026/g) || []).length, early: /Earlier research/.test(t), whats: [...new Set([...document.querySelectorAll('#srcBody .src-what')].map(x => x.textContent))].join(' | '), intro: document.querySelector('#srcBody .src-intro').textContent }; });
  ok('#12 check date stated once (intro); no "Earlier research"', r.n === 1 && /checked Oct 2026/.test(r.intro) && !r.early, r);
  ok('#12 old group named after what it backs', /Leveling guides, build and tips/.test(r.whats), r.whats);

  /* #13 a save whose quest is no longer a story quest ("Ishalgen" is the starting map since 0.2) asks for the current quest */
  await set(5, `s.quest = 'Ishalgen';`);
  r = await p.evaluate(() => document.getElementById('questStatus').textContent.trim());
  ok('#13 quest "Ishalgen": Journey story row shows "Pick your current quest"', /^Pick your current quest/.test(r), r);

  /* #14 (F6) Daevanion cost box: from empty, ▴ gives 1 and ▾ gives 0 ("already got it"); 0 stays reachable from 1 (Lv 30: Vaizel opens, its first node has no cost logged) */
  await set(30);
  const cst = async (d, clear) => { const { k, ...r } = await p.evaluate(([d, clear]) => { const row = document.querySelector('#dvNextList .dvrow.nx'), i = row.querySelector('input.dvc');
    if (clear) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); }
    row.querySelector(`[data-cst="${d}"]`).click(); const k = row.dataset.nx; return { v: i.value, cost: (char(state).dvCost || {})[k], k }; }, [d, clear]);
    return { ...r, saved: ((await readSave(p)).dvCost || {})[k] }; };
  r = await cst(1, true); ok('#14 F6: empty cost box, ▴ → 1 (saved as 1)', r.v === '1' && r.cost === 1 && r.saved === 1, r);
  r = await cst(-1, false); ok('#14 F6: ▾ from 1 → 0 (0 = already bought), saved', r.v === '0' && r.cost === 0 && r.saved === 0, r);
  r = await cst(-1, true); ok('#14 F6: empty cost box, ▾ → 0', r.v === '0' && r.cost === 0, r);
  r = await cst(1, false); ok('#14 F6: ▴ from 0 → 1', r.v === '1' && r.cost === 1, r);

  /* #15 (F7) Build drawer rotation: only skills the guide says you have at your level (Skills card unlock rule) */
  const low = async L => { await writeSave(p, { checks: {}, level: L, mode: 'advanced', open: {} });
    await p.reload(); await p.waitForTimeout(300);
    return p.evaluate(() => { document.querySelector('#statDrawer details.mini').open = true; const t = id => document.getElementById(id).innerText.replace(/\s+/g, ' ');
      return { chain: t('rotChain'), play: t('rotPlay'), grid: [...document.querySelectorAll('#stackViz .sk:not(.empty):not(.ghost)')].map(x => x.textContent) }; }); };
  const at2 = await low(2), at3 = await low(3), at13 = await low(13), at14 = await low(14);
  ok('#15 F7: Lv 2: Ambush (learned at 3) is not in the rotation or the key grid', !/Ambush/.test(at2.chain + at2.play) && !at2.grid.includes('Ambush') && /Savage Roar/.test(at2.chain), at2);
  ok('#15 F7: Lv 3: Ambush is in the right-click chain and the key grid', /Ambush/.test(at3.chain) && at3.grid.includes('Ambush'), at3);
  ok('#15 F7: Lv 13 without / Lv 14 with Insignia Explosion', !/Insignia Explosion/.test(at13.chain) && !at13.grid.includes('Insignia Explosion') && /Insignia Explosion/.test(at14.chain) && at14.grid.includes('Insignia Explosion'), [at13, at14]);
  /* 0.8 P14 (#503, #565): the guide's rotation line names Q as the guide's key with the game's default (C21a); the play
     steps stay plain (the Key setup grid's heading line says once that Q and E are suggested keys) */
  r = await p.evaluate(() => ({ seq: [...document.querySelectorAll('.rotseq')].map(x => x.textContent), play: document.getElementById('rotPlay').textContent }));
  ok('P14: the rotation line says "Q: Shadowstrike (the guide\'s key; the game\'s default is 1)"', r.seq.length > 0 && r.seq.every(x => x.includes("Q: Shadowstrike (the guide's key; the game's default is 1)")), r.seq);
  ok('P14: the play steps carry no † and no "game default"', /Q\s*Shadowstrike/.test(r.play) && !/†|game default/.test(r.play), r.play);
  r = await p.evaluate(() => { const st = SP_STEPS.find(x => x.s.n === 'Ambush' && x.L === 2), was = st.req; st.req = 15; renderRotation(); const out = document.getElementById('rotChain').innerText; st.req = was; renderRotation(); return out; });
  ok('#15 F7: the drawer follows the Skills card unlock level (Ambush moved to Lv 15 → gone at Lv 14)', !/Ambush/.test(r) && /Heart Gore/.test(r), r);

  /* 0.6 P10: every skill named in a play step (and the New note) has an icon or initials before it; decorative, name read once */
  for (const L of [10, 22, 45]) {
    await writeSave(p, { checks: {}, level: L, mode: 'advanced', open: {} }); await p.reload(); await p.waitForTimeout(300);
    r = await p.evaluate(() => [...document.querySelectorAll('#rotPlay li')].map(li => { const names = [...li.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent), icos = li.querySelectorAll('img.spmini, img.st-mini, .spmini.ini, .st-mini.ini');
      return { text: li.textContent, icos: icos.length, bad: [...icos].filter(i => i.tagName === 'IMG' ? i.getAttribute('alt') !== '' : i.getAttribute('aria-hidden') !== 'true').length, names }; }));
    ok(`P10: Lv ${L} play steps: icon or initials, decorative`, r.length > 0 && r.filter(x => !/^Hold/.test(x.text)).every(x => x.icos > 0 && !x.bad), r);
  }
  /* 0.8.1 F5 (#595, #586 finding 1): the Gladiator's and the Ranger's Build drawer at Lv 45 (Rotation, Key setup, Coming
     to E) shows the five rotation icons that were missing. Since 2026-10-21 the two key-grid skills that were still
     initials (Mocking Blade, Explosion Trap) have icons too (docs/ISSUES.md "Gladiator and Ranger rotation icons"), so no
     initials are left; a new gap shows here. */
  const iniLeft = { gladiator: [], ranger: [] };
  for (const cls of ['gladiator', 'ranger']) {
    const st = toStored({ checks: {}, level: 45, mode: 'advanced', open: {} }); Object.assign(st.chars[TEST_SLOT], { pack: `aion2/asmodian/${cls}`, class: cls });
    await writeRaw(p, JSON.stringify(st)); await p.reload(); await p.waitForTimeout(300);
    r = await p.evaluate(() => { document.querySelector('#statDrawer details.mini').open = true; const d = document.getElementById('statDrawer');
      return { cls: char(state).class, ini: [...d.querySelectorAll('.ini')].map(x => x.parentElement.textContent.trim()), imgs: [...d.querySelectorAll('img.spmini, img.kv-ico')].map(x => x.getAttribute('src')) }; });
    const want = cls === 'gladiator' ? ['aerial-snare', 'sword-aura-rampage', 'ankle-slice', 'mocking-blade'] : ['arrow-scattershot', 'suppressing-arrow', 'explosion-trap'];
    ok(`F5: ${cls} Lv 45 Build drawer: the rotation icons shown (${want.join(', ')}); initials only for ${iniLeft[cls].join(', ') || 'none'}`, r.cls === cls && JSON.stringify([...new Set(r.ini)]) === JSON.stringify(iniLeft[cls]) && want.every(s => r.imgs.includes(`assets/icons/sk-${s}.png`)), r);
  }

  /* 0.9 P7 (#623, UX audit finding 2): the slider from Lv 2 to Lv 39 with the story at Lv 2 asks for the story quest under
     the slider (the welcome card's select, pre-filled with the first story quest at Lv 39); the answer opens Daevanion and
     Stigmas; Skip hides the question and Next up names no locked card (no "<Board> board opens" step, board or stigma card
     while its card is locked). The level stays where the slider put it. */
  {
    const fresh = async () => { await writeSave(p, { checks: {}, level: 2, quest: 'A Village in the Fog', mode: 'advanced', open: {} }, { fresh: true }); await p.reload(); await p.waitForTimeout(400); };
    const slide = v => p.evaluate(v => { const r = document.getElementById('lvlRange'); r.value = String(v); r.dispatchEvent(new Event('input', { bubbles: true })); }, v);
    const look = () => p.evaluate(() => ({ lv: char(state).level, quest: questNameOf(char(state).quest), ask: !document.getElementById('lvQ').hidden, text: document.getElementById('lvQText').textContent,
      pick: document.getElementById('lvQSel').value, first: (QUESTS.find(([l]) => l >= 39) || [])[1], firstName: questNameOf((QUESTS.find(([l]) => l >= 39) || [])[1]), dv: !document.getElementById('dvBox').hidden, st: !document.getElementById('stCard').hidden, sp: !document.getElementById('spCard').hidden,
      acts: [...document.querySelectorAll('#nowStar [data-now]')].map(x => x.dataset.now), txt: [...document.querySelectorAll('#nowStar .ns-card')].map(c => c.innerText.replace(/\s+/g, ' ')),
      boKeys: GATES.flatMap(g => g.items.filter(it => it.bo).map(it => it.k)) }));
    await fresh();
    r = await look();
    ok('P7: at Lv 2 on the Lv 2 story quest no story question', !r.ask && r.lv === 2, r);
    await slide(39); await p.waitForTimeout(300);
    r = await look();
    ok('P7: slider 2 → 39 asks "You\'re Lv 39 but your story is at Lv 2. Which story quest are you on?" with the first Lv 39+ quest picked, story unchanged',
      r.ask && r.text === "You're Lv 39 but your story is at Lv 2. Which story quest are you on?" && r.pick === r.first && r.quest === 'A Village in the Fog' && r.lv === 39, r);
    const named = x => ({ daevanion: x.acts.some(a => a === 'board' || a === 'boardcost' || x.boKeys.includes(a.replace(/^tick:/, ''))) || x.txt.some(t => /board opens|Daevanion board card/.test(t)),
      stigmas: x.acts.some(a => /^st(equip|up)$/.test(a)) || x.txt.some(t => /^Equip |Stigma slot/.test(t)), skills: x.acts.includes('skill') });
    let nm = named(r);
    ok('P7: before an answer, Next up names no locked card (Daevanion / Stigmas / Skills)', !r.dv && !nm.daevanion && (r.st || !nm.stigmas) && (r.sp || !nm.skills), { dv: r.dv, st: r.st, sp: r.sp, nm, txt: r.txt });
    await p.click('#lvQSet'); await p.waitForTimeout(400);
    r = await look();
    ok('P7: "Set story quest" sets the picked quest, keeps Lv 39, hides the question, and Daevanion and Stigmas open', !r.ask && r.quest === r.firstName && r.lv === 39 && r.dv && r.st, r);
    await fresh(); await slide(39); await p.waitForTimeout(300);
    await p.click('#lvQSkip'); await p.waitForTimeout(300);
    r = await look(); nm = named(r);
    ok('P7: Skip hides the question and leaves the story at Lv 2', !r.ask && r.quest === 'A Village in the Fog' && r.lv === 39, r);
    ok('P7: after Skip, Next up names no locked card', (r.dv || !nm.daevanion) && (r.st || !nm.stigmas) && (r.sp || !nm.skills), { dv: r.dv, st: r.st, sp: r.sp, nm, txt: r.txt });
    await p.click('#lvlUp'); await p.waitForTimeout(300);
    r = await look();
    ok('P7: after Skip, + to Lv 40 does not ask again for the same story quest', !r.ask && r.lv === 40, r);
    await fresh(); await p.click('#lvlUp'); await p.waitForTimeout(300);
    ok('P7: + from Lv 2 to 3 (within 5 levels of the story) does not ask', !(await look()).ask);
  }

  /* 0.6.1 F2 (#335): at 390x844 the Undo toast sits above the tab bar, the Build sheet leaves the bar tappable, a tab closes
     the sheet and goes there, and the toast goes after its timeout; Undo works inside it. */
  await p.setViewportSize({ width: 390, height: 844 });
  await writeSave(p, { checks: {}, level: 20, mode: 'basic', open: {} }); await p.reload(); await p.waitForTimeout(400);
  await p.evaluate(() => { window.__undone = 0; rewardToast('Turned in', () => { window.__undone++; }); });
  await p.waitForTimeout(500);
  r = await p.evaluate(() => { const t = document.getElementById('rwToast').getBoundingClientRect(), b = document.getElementById('tabBar').getBoundingClientRect(); return { toastBottom: Math.round(t.bottom), barTop: Math.round(b.top) }; });
  ok('F2 390x844: the Undo toast does not overlap the tab bar', r.toastBottom <= r.barTop, r);
  await p.click('#rwToast .tu'); await p.waitForTimeout(200);
  ok('F2: Undo inside its window runs the undo', await p.evaluate(() => window.__undone === 1));
  await p.evaluate(() => rewardToast('Turned in', () => {})); await p.waitForTimeout(6600);
  ok('F2: the toast is gone after its timeout', await p.evaluate(() => { const t = document.getElementById('rwToast'); return getComputedStyle(t).opacity === '0' && !t.querySelector('.tu'); }));
  await p.click('#tabBuild'); await p.waitForTimeout(500);
  r = await p.evaluate(() => { const rt = document.querySelector('#tabBar [data-go="nowStar"]'), q = rt.getBoundingClientRect(), el = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { hit: el === rt, id: el && (el.id || el.className) }; });
  ok('F2: with Build open, elementFromPoint at the Route tab is the tab', r.hit, r);
  await p.click('#tabBar [data-go="nowStar"]'); await p.waitForTimeout(500);
  r = await p.evaluate(() => ({ open: document.getElementById('statDrawer').classList.contains('open'), top: Math.round(document.getElementById('nowStar').getBoundingClientRect().top) }));
  ok('F2: tapping Route with Build open closes the sheet and goes to Route', !r.open && r.top < 200, r);

  /* 0.9 P19 (#641): catch-up for late starts. A Lv 39 join (nothing ticked, 165 pts) sees one jump per skill; each
     Mark spent ticks that skill's lines up to its target (and its specialty) in one tap, Undo puts them back, and the taps
     end with the guide's spend done (nothing affordable left, no per-line Mark spent). Then the endgame case: a Lv 45 join
     holding 180 stones, for every class, with the tap count printed for the PR (measurement, not a pass mark). */
  await p.setViewportSize({ width: 1500, height: 1000 });
  const cuSave = async (level, extra = {}, ch = null) => { await writeSave(p, { checks: {}, level, quest: "An Ill Fate's Resolution", welcomed: 1, mode: 'advanced', open: {}, ...extra }, { fresh: true });
    if (ch) await p.evaluate(([k, ch]) => { const s = JSON.parse(localStorage.getItem(k)); for (const x of Object.values(s.chars)) Object.assign(x, ch); localStorage.setItem(k, JSON.stringify(s)); }, [SAVE_KEY, ch]);
    await p.reload(); await p.waitForTimeout(400); };
  const cuHero = () => p.evaluate(() => { const h = document.querySelector('#spHero .sphero'); if (!h) return null;
    const nm = h.querySelector('.spname'), arr = nm.querySelector('.lvarr'), sm = h.querySelector('.dvtext small');
    return { cu: h.classList.contains('cu'), name: nm.firstChild.textContent.trim(), to: arr ? +((arr.textContent.match(/→ (\d+)/) || [])[1] || 0) : 0,
      of: +((sm.textContent.match(/· (\d+) jumps? left/) || [])[1] || 0), spec: [...h.querySelectorAll('.sphint')].some(x => /specialty/.test(x.textContent)), btn: !!h.querySelector('#spBuy') }; });
  const ticks = async () => Object.entries((await readSave(p)).checks || {}).filter(([k, v]) => v && k.startsWith('sp:')).map(([k]) => k).sort();
  /* tap the hero until catch-up hands back; per tap: the keys it added share one skill, reach the hero's target, and
     carry the specialty when the hero named one */
  const runCatchUp = async () => { const out = { taps: 0, bad: [] };
    for (let i = 0; i < 40; i++) { const h = await cuHero(); if (!h || !h.cu) break;
      const before = await ticks(); await p.click('#spBuy'); await p.waitForTimeout(150); out.taps++;
      const added = (await ticks()).filter(k => !before.includes(k)), m = added.map(k => k.match(/^sp:(.+):([^:]+)$/)), keys = new Set(m.map(x => x[1])), lv = m.map(x => +x[2]).filter(Number.isFinite);
      if (keys.size !== 1 || (h.to && Math.max(...lv) !== h.to) || h.spec !== added.some(k => /:spec\d?$/.test(k))) out.bad.push({ h, added }); }
    out.after = await cuHero(); return out; };
  await cuSave(39);
  let h0 = await cuHero();
  ok('P19 Lv 39 join: the Skills hero is a catch-up jump ("Heart Gore 1 → 10", N jumps left, N ≥ 3)', h0 && h0.cu && h0.name === 'Heart Gore' && h0.to === 10 && h0.of >= 3, h0);
  const nuCard = () => p.evaluate(() => { const c = document.querySelector('#nowStar .ns-card'); return { t: c.querySelector('h3').innerText, all: c.innerText, btn: (c.querySelector('.ns-btn') || {}).innerText }; });
  r = await nuCard();
  ok('P19: Next up leads with "Catch up: level Heart Gore 1 → 10", Mark spent and the hero\'s "N jumps left"', /^Catch up: level Heart Gore 1 → 10/.test(r.t) && r.btn === 'Mark spent' && r.all.includes(`${h0.of} jumps left`), r);
  /* the count goes down with each tap, on both cards (Design Lead, PR #761: "1 of 5" after three taps read as a reset) */
  for (let i = 0; i < 3; i++) { await p.click('#spBuy'); await p.waitForTimeout(150); }
  const h3 = await cuHero(); r = await nuCard();
  ok('P19: after three taps both cards say the same, three fewer jumps left', h3.of === h0.of - 3 && r.all.includes(`${h0.of - 3} jump${h0.of - 3 === 1 ? '' : 's'} left`), { h3, r });
  await cuSave(39);
  /* Mark all spent: one tap ticks every jump, the toast says how many, Undo puts the save back */
  const cuA = await ticks();
  await p.click('#spBuyAll'); await p.waitForTimeout(200);
  const allT = await ticks(), allH = await cuHero();
  r = { toast: await p.evaluate(() => document.getElementById('rwToast').innerText), added: allT.length - cuA.length, hero: allH };
  ok('P19: Mark all spent ends the catch-up in one tap and the toast says "Marked N jumps spent"', r.added > 10 && !(allH && allH.cu) && r.toast.includes(`Marked ${h0.of} jumps spent`), r);
  await p.click('#rwToast .tu'); await p.waitForTimeout(200);
  ok('P19: Undo after Mark all spent restores the save', JSON.stringify(await ticks()) === JSON.stringify(cuA) && (await cuHero()).name === 'Heart Gore', await ticks());
  /* the phone: Mark all spent is a 44 px tap target like the other buttons */
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200);
  r = await p.evaluate(() => document.getElementById('spBuyAll').getBoundingClientRect().height);
  ok('P19: on the phone "Mark all spent" is at least 44 px tall', r >= 44, r);
  await p.setViewportSize({ width: 1500, height: 1000 }); await p.waitForTimeout(200);
  const cu0 = await ticks(); await p.click('#spBuy'); await p.waitForTimeout(150);
  const cu1 = await ticks();
  ok('P19: one tap ticks Heart Gore Lv 2–10 and its specialty', ['sp:Heart Gore:spec', ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map(L => 'sp:Heart Gore:' + L)].every(k => cu1.includes(k)) && cu1.length - cu0.length === 10, cu1.filter(k => !cu0.includes(k)));
  await p.click('#rwToast .tu'); await p.waitForTimeout(200);
  ok('P19: Undo reverses the tap', JSON.stringify(await ticks()) === JSON.stringify(cu0) && (await cuHero()).name === 'Heart Gore', await ticks());
  /* Next up's button ticks the same jump */
  await p.click('#nowStar .ns-card .ns-btn'); await p.waitForTimeout(1600);
  ok('P19: Next up\'s Mark spent ticks the hero\'s jump', (await ticks()).filter(k => !cu0.includes(k)).length === 10 && (await cuHero()).name !== 'Heart Gore');
  await p.click('#rwToast .tu'); await p.waitForTimeout(200);
  let run = await runCatchUp();
  ok(`P19: the Lv 39 join reaches every skill's target in one tap per skill (${run.taps} taps for ${h0.of} skills)`, run.taps === h0.of && !run.bad.length, run.bad);
  r = await p.evaluate(() => ({ buy: !!document.getElementById('spBuy'), sub: (document.querySelector('#spHero .dvtext small') || {}).textContent }));
  ok('P19: after the last tap nothing affordable is left (no per-line Mark spent)', !r.buy && !run.after.cu, r);
  ok('P19: Mark all spent ticked exactly what the taps one by one tick', JSON.stringify(await ticks()) === JSON.stringify(allT), { all: allT.length, taps: (await ticks()).length });
  /* the endgame case, every class (beta tester T1, owner report 2026-10-20): measurement for the PR */
  const counts = [];
  for (const cls of ['assassin', 'templar', 'cleric', 'sorcerer', 'chanter', 'ranger', 'gladiator', 'spiritmaster']) {
    await cuSave(45, { stones: 180 }, { pack: 'aion2/asmodian/' + cls, class: cls });
    const h = await cuHero(); run = await runCatchUp();
    const left = await p.evaluate(() => !!document.getElementById('spBuy'));
    counts.push(`${cls} ${run.taps}`);
    ok(`P19 Lv 45 join with 180 stones, ${cls}: one tap per skill (${run.taps}), no per-line Mark spent after`, h && h.cu && run.taps === h.of && !run.bad.length && !left, { h, bad: run.bad, left });
  }
  console.log('P19 endgame catch-up clicks (Lv 45, 180 stones): ' + counts.join(', '));

  /* 0.9 P20 (#642): Daevanion and Stigmas catch-up and respec (docs/design/0.9-catchup, notes 9 and 10). A Lv 39 join
     sees "N boards opened before you joined · Mark bought ▾"; one tap marks one board's guide nodes; Respec ▾ clears one
     board (a second click within 3 s) or all; Undo reverses each; Stigmas Respec sets the slots back to Lv 1 with the
     shards back. Then the endgame case (Lv 45, 336 crystals, 90 shards), every class, with the click counts printed. */
  const dvT = async () => Object.entries((await readSave(p)).checks || {}).filter(([k, v]) => v && k.startsWith('dv:')).map(([k]) => k).sort();
  const undo = async () => { await p.click('#rwToast .tu'); await p.waitForTimeout(200); };
  await cuSave(39, { dvTotal: 140 });
  const strip = sel => p.evaluate(sel => { const s = document.querySelector(sel); return s && !s.hidden ? s.innerText : ''; }, sel);
  r = await strip('#dvCatch');
  ok('P20 Lv 39 join: the Daevanion strip says "N boards opened before you joined" (N ≥ 2) with Mark bought', /(\d+) boards opened before you joined/.test(r) && +r.match(/(\d+) boards/)[1] >= 2 && /Mark bought/.test(r), r);
  const nBoards = +r.match(/(\d+) boards/)[1];
  await p.click('#dvCuBtn'); await p.waitForTimeout(150);
  const boards = await p.evaluate(() => [...document.querySelectorAll('#dvCuMenu [data-dvmark]')].map(i => ({ b: i.dataset.dvmark, n: +i.closest('label').querySelector('span').textContent.match(/(\d+) node/)[1] })));
  ok('P20: the menu lists one row per open board with its node count', boards.length === nBoards && boards.every(x => x.n > 0), boards);
  await p.click(`#dvCuMenu [data-dvmark="${boards[0].b}"]`); await p.waitForTimeout(200);
  const dvA = await dvT();
  r = { ticks: dvA.length, strip: await strip('#dvCatch'), toast: await p.evaluate(() => document.getElementById('rwToast').innerText) };
  ok(`P20: Mark bought ticks ${boards[0].b}'s ${boards[0].n} guide nodes in one tap, "1 marked"`, r.ticks === boards[0].n && r.strip.includes('1 marked') && r.toast.includes(`${boards[0].b} marked`), r);
  await undo();
  ok('P20: Undo unticks the marked board', (await dvT()).length === 0, await dvT());
  await p.click(`#dvCuMenu [data-dvmark="${boards[0].b}"]`); await p.waitForTimeout(200);
  await p.click(`#dvCuMenu [data-dvmark="${boards[1].b}"]`); await p.waitForTimeout(200);
  const dvAB = await dvT();
  ok('P20: two taps mark two boards', dvAB.length === boards[0].n + boards[1].n, dvAB.length);
  /* Respec ▾: one row per board; the first click arms the row, the second within 3 s clears that board only */
  await p.click('#dvRespec'); await p.waitForTimeout(150);
  r = await p.evaluate(() => [...document.querySelectorAll('#dvRsMenu [data-dvrs]')].map(b => ({ id: b.dataset.dvrs, t: b.innerText.replace(/\s+/g, ' '), off: b.disabled })));
  ok('P20: Respec ▾ lists each board with its ticked count, then All boards', r.some(x => x.id === boards[0].b && x.t.includes(`${boards[0].n} nodes`)) && r.at(-1).id === '*' && r.at(-1).t.includes(`${dvAB.length} nodes`), r);
  const row0 = `#dvRsMenu [data-dvrs="${boards[0].b}"]`;
  await p.click(row0); await p.waitForTimeout(150);
  r = { t: await p.innerText(row0), n: (await dvT()).length };
  ok('P20: the first click arms the row ("Click again to respec") and changes nothing', r.t.startsWith('Click again to respec') && r.n === dvAB.length, r);
  await p.click(row0); await p.waitForTimeout(200);
  const dvB = await dvT();
  r = { left: dvB.length, toast: await p.evaluate(() => document.getElementById('rwToast').innerText) };
  ok(`P20: "Respec this board" clears only ${boards[0].b}; the toast says "${boards[0].b} reset · ${boards[0].n} nodes back"`, dvB.length === boards[1].n && dvB.every(k => !dvA.includes(k)) && r.toast.includes(`${boards[0].b} reset · ${boards[0].n} nodes back`), r);
  await undo();
  ok('P20: Undo puts the board back', JSON.stringify(await dvT()) === JSON.stringify(dvAB), (await dvT()).length);
  await p.click('#dvRespec'); await p.waitForTimeout(150);
  await p.click('#dvRsMenu [data-dvrs="*"]'); await p.waitForTimeout(150); await p.click('#dvRsMenu [data-dvrs="*"]'); await p.waitForTimeout(200);
  r = { n: (await dvT()).length, off: await p.evaluate(() => document.getElementById('dvRespec').disabled) };
  ok('P20: All boards clears every board; with nothing ticked Respec is greyed', r.n === 0 && r.off, r);
  await undo();
  ok('P20: Undo after All boards restores both boards', JSON.stringify(await dvT()) === JSON.stringify(dvAB));
  /* Stigmas: mark the slots from the strip, raise one in Slots, then Respec */
  r = await strip('#stCatch');
  ok('P20 Lv 39 join: the Stigmas strip says "N stigma slots opened before you joined" with Mark equipped', /\d+ stigma slots? opened before you joined/.test(r) && /Mark equipped/.test(r), r);
  await p.click('#stCuBtn'); await p.waitForTimeout(150);
  const slotsN = await p.evaluate(() => document.querySelectorAll('#stCuMenu [data-stmark]').length);
  for (let i = 0; i < slotsN; i++) { await p.click('#stCuMenu [data-stmark]:not(:disabled)'); await p.waitForTimeout(150); }
  r = { strip: await strip('#stCatch'), on: await p.evaluate(() => document.querySelectorAll('#stList .st-lvctl').length) };
  ok(`P20: Mark equipped marks each of the ${slotsN} slots in one tap; the strip goes`, slotsN > 0 && !r.strip && r.on === slotsN, r);
  await p.evaluate(() => { document.getElementById('stSlotsBox').open = true; });
  for (let i = 0; i < 9; i++) { await p.click('#stList [data-stlv][data-d="1"]'); await p.waitForTimeout(80); }
  const s0 = await readSave(p);
  const rs = p.locator('#stRespec');
  await rs.click(); r = { t: await rs.innerText(), lv: JSON.stringify((await readSave(p)).stLv) };
  ok('P20: Stigmas Respec arms on the first click and changes nothing', r.t === 'Click again to respec' && r.lv === JSON.stringify(s0.stLv), r);
  await rs.click(); await p.waitForTimeout(200);
  const s1 = await readSave(p);
  r = { lv: s1.stLv, sh: [s0.stShards || 0, s1.stShards], toast: await p.evaluate(() => document.getElementById('rwToast').innerText) };
  ok('P20: Stigmas Respec clears the slots to Lv 1, keeps them equipped and gives 14 shards back (Lv 10: 4 × 1 + 5 × 2)', Object.values(s1.stLv).every(L => L === 1) && s1.stShards - (s0.stShards || 0) === 14 && r.toast.includes('Stigmas reset · 14 shards back') && (await p.evaluate(() => document.querySelectorAll('#stList .st-lvctl').length)) === slotsN, r);
  await undo();
  const s2 = await readSave(p);
  ok('P20: Undo restores the stigma levels and shards', JSON.stringify(s2.stLv) === JSON.stringify(s0.stLv) && (s2.stShards || 0) === (s0.stShards || 0), { was: s0.stLv, now: s2.stLv });
  /* the endgame case (beta tester T1): every open board and every stigma slot in one tap each, plus the menu's opener */
  const p20 = [];
  for (const cls of ['assassin', 'templar', 'cleric', 'sorcerer', 'chanter', 'ranger', 'gladiator', 'spiritmaster']) {
    await cuSave(45, { dvTotal: 336, stShards: 90 }, { pack: 'aion2/asmodian/' + cls, class: cls });
    let dvC = 0, stC = 0;
    if (await strip('#dvCatch')) { await p.click('#dvCuBtn'); dvC++;
      for (let i = 0; i < 8 && await p.$('#dvCuMenu [data-dvmark]:not(:disabled)'); i++) { await p.click('#dvCuMenu [data-dvmark]:not(:disabled)'); await p.waitForTimeout(120); dvC++; } }
    if (await strip('#stCatch')) { await p.click('#stCuBtn'); stC++;
      for (let i = 0; i < 6 && await p.$('#stCuMenu [data-stmark]:not(:disabled)'); i++) { await p.click('#stCuMenu [data-stmark]:not(:disabled)'); await p.waitForTimeout(120); stC++; } }
    r = { dv: await strip('#dvCatch'), st: await strip('#stCatch'), dvC, stC };
    p20.push(`${cls} daevanion ${dvC} stigmas ${stC}`);
    ok(`P20 Lv 45 join, ${cls}: every open board and stigma slot marked in one tap each; both strips gone`, !r.dv && !r.st && stC > 1, r);
  }
  console.log('P20 endgame catch-up clicks (Lv 45, 336 crystals, 90 shards): ' + p20.join(', '));

  /* 0.8.1 F8 (#605, owner note 8): a Next up skill-level step that gets the skill to a specialty slot's level names the
     guide's pick; after a Skills Respec (picks kept) the step that levels it back up says the pick is kept. Heart Gore:
     every other line and slot bought, Heart Gore up to line `top`, `plan` of its plan board nodes ticked. */
  const ASN = { pack: 'aion2/asmodian/assassin', class: 'assassin' };
  const hgSave = async ({ top, plan = 0, spec1 = false, spec2 = false, lv }) => { await cuSave(lv, { stones: 2000 }, ASN);
    return p.evaluate(({ top, plan, spec1, spec2 }) => { const c = char(state), hg = SP_STEPS.find(x => x.s.n === 'Heart Gore').s, N = activePack().data.graph.nodes;
      SP_STEPS.forEach(x => { c.checks[x.k] = x.s !== hg || (!x.spec && x.L <= top) || (x.spec && spec1); });
      SP_SLOTS.forEach(x => { c.checks[x.k] = x.s !== hg ? x.slot === 2 : x.slot === 2 && spec2; });
      const sid = N[`sp:${hg.key}:2`].skill; Object.values(N).filter(n => n.kind === 'plan' && n.skill === sid && n.key !== undefined).slice(0, plan).forEach(n => { c.checks[n.key] = true; });
      save(); return { p1: (hg.specs || [])[0] ? hg.specs[0].t : hg.spec, p2: ((hg.specs || [])[1] || {}).t, eff: skillLvOf(c, SP_STEPS.find(x => x.s === hg && x.slot === 1)), learn: hg.learn }; }, { top, plan, spec1, spec2 }); };
  const hgCard = () => p.evaluate(() => { const c = [...document.querySelectorAll('#nowStar .ns-card')].find(c => /Heart Gore/.test(c.querySelector('h3').innerText)); return c ? { t: c.querySelector('h3').innerText, sub: c.querySelector('.title > p').innerText } : null; });
  await cuSave(39, {}, ASN);
  const hg0 = await p.evaluate(() => SP_STEPS.find(x => x.s.n === 'Heart Gore').s.learn);
  let f8 = await hgSave({ top: 7, lv: hg0 + 18 }); await p.reload(); await p.waitForTimeout(400); r = { f8, card: await hgCard() };
  ok('F8: the step "Buy Heart Gore 7 → 8" (skill Lv 7 → 8) names the slot 1 pick', f8.eff === 7 && r.card && /7 → 8/.test(r.card.t) && r.card.sub.includes(`opens its specialty: ${f8.p1}`), r);
  f8 = await hgSave({ top: 9, plan: 2, spec1: true, lv: hg0 + 24 }); await p.reload(); await p.waitForTimeout(400); r = { f8, card: await hgCard() };
  ok('F8: the step "Buy Heart Gore 9 → 10" (skill Lv 11 → 12) names the slot 2 pick, not slot 1 again', f8.eff === 11 && !!f8.p2 && r.card && /9 → 10/.test(r.card.t) && r.card.sub.includes(`opens slot 2: ${f8.p2}`) && !/its specialty/.test(r.card.sub), r);
  /* after a Respec: lines gone, picks kept */
  f8 = await hgSave({ top: 7, spec1: true, lv: hg0 + 18 }); await p.reload(); await p.waitForTimeout(400); r = { f8, card: await hgCard() };
  ok('F8: with the slot 1 pick kept, "Buy Heart Gore 7 → 8" says "specialty kept: <pick>", nothing to pick', r.card && /7 → 8/.test(r.card.t) && r.card.sub.includes(`specialty kept: ${f8.p1}`) && !/opens/.test(r.card.sub), r);
  await cuSave(39, {}, ASN); await p.click('#spBuyAll'); await p.waitForTimeout(200);
  const rsp = await ticks();
  await p.click('#spRespec'); await p.click('#spRespec'); await p.waitForTimeout(300);
  const rsq = await ticks(); r = { card: await hgCard(), kept: rsq };
  ok('F8: Respec keeps the specialty picks and clears the lines', rsp.includes('sp:Heart Gore:spec') && rsq.includes('sp:Heart Gore:spec') && !rsq.some(k => /:\d+$/.test(k)), rsq);
  ok('F8: after a Respec the catch-up step "Heart Gore 1 → 10" says its specialty is kept, not to pick it', r.card && /Heart Gore 1 → 10/.test(r.card.t) && r.card.sub.includes(`specialty kept: ${f8.p1}`) && !/pick the specialty/.test(r.card.sub), r);
  /* the Skills hero hint at a fresh Lv 39 after buying every open line: the hero short, its hint counts from the header's points */
  await cuSave(39, {}, ASN); await p.click('#spBuyAll'); await p.waitForTimeout(200);
  /* the hint is "+k more your points cover" (the first k after the hero cost no more than the header's points) or "N more
     unlocked · X pts left" with X the header's points; before F8 it read "N more unlocked · 0 pts left" with 1 pt to spend */
  r = await p.evaluate(() => { const now = skillOpen(char(state)).now, h = +document.querySelector('#spBig b').textContent, hint = ([...document.querySelectorAll('#spHero .sphint')].find(x => /more/.test(x.innerText)) || {}).innerText || '', k = +((hint.match(/^\+(\d+) more your points cover$/) || [])[1] || 0);
    return { head: h, hint, k, costK: now.slice(1, 1 + k).reduce((t, y) => t + (y.spec ? 0 : y.cost), 0), short: !!document.querySelector('#spHero .sphero.short') }; });
  ok('F8: Lv 39, every open line bought, hero short: the hint counts from the header\'s points', r.short && r.head > 0 && (r.k ? r.costK <= r.head : /^\d+ more unlocked · \d+ pts? left$/.test(r.hint) && +r.hint.match(/· (\d+) pt/)[1] === r.head), r);

  ok('no page errors', !errs.length, errs);
  console.log(`${n - fail} ok, ${fail} failed`); console.log(fail ? `E4 CHECKS FAILED (${fail})` : 'E4 CHECKS PASSED'); await b.close(); process.exit(fail ? 1 : 0); })();
