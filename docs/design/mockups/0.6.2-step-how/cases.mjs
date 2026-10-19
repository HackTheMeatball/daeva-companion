/* 0.6.2 mockup (Design Lead, #397): a Next up step card says how, not just what. Today stepHTML keeps only the step's
   bold phrase ("Extract gear you've replaced"); the how-to after it is dropped. Drawn on the real built page: act() puts
   the step's first sentence after the bold phrase under the title, and the rest behind the card's existing "i" button.
   Nothing here is app code. Run: npm run build && node tests/support/shots.mjs docs/design/mockups/0.6.2-step-how --after-only
   MOCK_BEFORE=1 shoots today's page with the same saves (the Scrapbook's before half). */
import { coreBundle } from '../../../../tests/support/core-bundle.mjs';

const M = await coreBundle(), L = 10;
const save = { level: L, quest: M.QUESTS.find(([l]) => l >= L)[1], open: {},
  checks: Object.fromEntries(M.GATES.filter(g => g.lv < L).flatMap(g => g.items.filter(it => it.k)).map(it => [it.k, true])) };
/* the step's text as data/packs/aion2/asmodian/guide/steps.json g10:0 has it, tips resolved to plain words */
const HOW = 'Open the Cube, click the old piece, choose Extract and confirm.';
const MORE = "Only gear in your Cube can be extracted, not what you're wearing, so the option appears once a drop replaces something.";
const css = `#nowStar .ns-card .title p.ns-how { margin: var(--space-4) 0 0; font-size: 14px; line-height: 1.45; color: var(--fg); }
#nowStar .ns-card .title h3 .nsinfo { display: inline-grid; margin-left: var(--space-6); vertical-align: middle; }`;
/* both halves bring the step card to the top (as if the story and earlier rows were done), so they show the same card */
const lift = `const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => /Extract gear/.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no Extract step card'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc);`;
const act = (on, open) => new Function(lift + (on ? `const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s);
  const t = sc.querySelector('.title'), h = t.querySelector('h3'), p = t.querySelector('p');
  const how = Object.assign(document.createElement('p'), { className: 'ns-how', textContent: ${JSON.stringify(HOW)} });
  h.after(how);
  h.insertAdjacentHTML('beforeend', ' <button type="button" class="tipbtn nsinfo" aria-label="More info" aria-expanded="${open}">i</button>');
  t.insertAdjacentHTML('beforeend', '<span class="ns-info">${MORE.replace(/'/g, "\\'")}</span>');
  ${open ? "sc.classList.add('show-info');" : ''}` : ''));
/* Item icons (Isaac, 8:55 PM ET, via #397): Wisdom Stones, Daevanion Crystals and Enhance Stones show their icon where
   a step or card names them. Only item links (a.itm) and the reward / count lines that name these items; never free text
   (a "Soul Crystal" is not a Daevanion Crystal). Icons are the app's own sourced files in assets/icons. */
const save12 = { level: 12, quest: M.QUESTS.find(([l]) => l >= 12)[1], open: {}, checks: {}, pendSt: 3, pendCr: 2 };
const icoCss = `.mk-ico { width: 1.15em; height: 1.15em; vertical-align: -0.22em; margin-right: 0.2em; border-radius: 3px; }
#nowStar .ns-card h3 .mk-ico { width: 20px; height: 20px; vertical-align: -3px; }`;
const decorate = `const FILES = [[/Wisdom Stones?/, 'wisdom-stone'], [/Daevanion Crystals?|(?<![A-Z][a-z]+ )crystals?/i, 'daevanion-crystal'], [/Enhance(ment)? Stones?/, 'enhance-stone']];
  const st = document.createElement('style'); st.textContent = ${JSON.stringify(icoCss)}; document.head.append(st);
  const img = f => Object.assign(document.createElement('img'), { className: 'mk-ico', alt: '', src: 'assets/icons/' + f + '.png' });
  const fileOf = t => (FILES.find(([re]) => re.test(t)) || [])[1];
  document.querySelectorAll('a.itm').forEach(a => { if (a.closest('#gates')) return; /* milestone rows already show the item's tile on the right */ const f = fileOf(a.textContent); if (f) { a.prepend(img(f)); a.style.whiteSpace = 'nowrap'; } });
  /* the named reward / count lines: split their text so each item word gets its icon */
  document.querySelectorAll('#nowStar .ns-card h3 b, #nowStar .ns-info, #areaList li.sh-note').forEach(el => {
    for (const n of [...el.childNodes].filter(n => n.nodeType === 3)) {
      const parts = n.textContent.split(/((?:\\d+ )?(?:Wisdom Stones?|Daevanion Crystals?|Crystals?|crystals?|Enhance Stones?))/);
      if (parts.length < 2) continue; const frag = document.createDocumentFragment();
      parts.forEach((t, i) => { if (!(i % 2)) { frag.append(t); return; } /* number, icon and word stay on one line */ const m = /^(\\d+ )?(.*)$/.exec(t), w = document.createElement('span'); w.style.whiteSpace = 'nowrap'; w.append(m[1] || '', img(fileOf(m[2])), m[2]); frag.append(w); }); n.replaceWith(frag); }
    /* a flex line would space every piece apart: keep the text in one run */
    if (/flex/.test(getComputedStyle(el).display)) { const r = document.createElement('span'); r.append(...el.childNodes); el.append(r); } });`;
const pick = (re, info) => `const cs = [...document.querySelectorAll('#nowStar .ns-card')], sc = cs.find(c => ${re}.test((c.querySelector('h3') || {}).textContent || ''));
  if (!sc) throw new Error('no card for ${re}'); cs.forEach(c => { if (c !== sc) c.classList.remove('first'); }); sc.classList.add('first'); sc.parentNode.prepend(sc);${info ? " sc.classList.add('show-info');" : ''}`;
const itemAct = (on, pre = '') => new Function(pre + (on ? decorate : ''));
const before = !!process.env.MOCK_BEFORE;
export default [
  { name: 'h1-basic-390', save, mode: 'basic', width: 390, height: 844, act: act(!before, false), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'h2-basic-1500', save, mode: 'basic', width: 1500, height: 900, act: act(!before, false), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'h3-info-open-390', save, mode: 'advanced', width: 390, height: 844, act: act(!before, true), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i1-cube-390', save: save12, mode: 'advanced', width: 390, height: 844, act: itemAct(!before, pick('/Use your Cube/')), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i2-dungeon-390', save: save12, mode: 'advanced', width: 390, height: 844, act: itemAct(!before, pick('/^Clear /', true)), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i3-step-card-390', save: save12, mode: 'advanced', width: 390, height: 844, act: itemAct(!before, pick('/Save your Enhance/')), shots: [{ sel: '#nowStar .ns-card.first' }] },
  { name: 'i4-dungeons-card-1500', save: save12, mode: 'advanced', width: 1500, height: 1000, act: itemAct(!before), shots: [{ sel: '#areaList li.sh-note', text: 'Wisdom' }] },
];
